"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGetAllExpert, useSearchExpert } from "@/hooks/useExpert";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import CountUp from "react-countup";

export interface SocialLinks {
  twitter: string;
  github: string;
  linkedin: string;
  website: string;
}

export interface Expert {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  category: string;
  profilePicture: string;
  image?: string;
  phone: string;
  gender: string;
  verified: boolean;
  role: string[];
  preferredIndustry: string[];
  skills: string[];
  bio: string;
  availability: string;
  projectCount: number;
  taskCount: number;
  regPercentage: number;
  terms: boolean;
  lastLogin: string;
  createdAt: string;
  country: string;
  state: string;
  socialLinks: SocialLinks;
}

export interface PaginatedExperts {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  data: Expert[];
}


// --- Sub-components ---

const StatCard = ({
  label,
  value,
  secondaryLabel,
  secondaryValue,
  isLoading,
  borderLeftColor,
}: {
  label: string;
  value: number;
  secondaryLabel?: string;
  secondaryValue?: number;
  isLoading: boolean;
  borderLeftColor?: string;
}) => (
  <div className="flex flex-col gap-2 w-full">
    <span className="text-sm text-[#878A93] font-medium">
      {label}:{" "}
      <span className="text-[#3E4351]">
        {isLoading ? (
          <Skeleton className="h-4 w-10 inline-block" />
        ) : (
          <CountUp end={value} duration={1.5} />
        )}
      </span>
    </span>
    <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex gap-6 p-4 h-[88px]">
      {secondaryLabel !== undefined ? (
        <div className="md:w-full flex flex-col justify-center gap-2">
          <span className="text-2xl font-bold text-[#0E1426]">
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <CountUp end={secondaryValue || 0} duration={1.5} />
            )}
          </span>
          <span
            className={`text-sm text-[#878A93] font-medium pl-2 border-l-[2px] ${borderLeftColor}`}
          >
            {secondaryLabel}
          </span>
        </div>
      ) : (
        <div className="md:w-full flex items-center">
          <Skeleton className="h-4 w-20" />
        </div>
      )}
    </div>
  </div>
);

// Helper to render tags (Role/Skills) with limit
const RenderTags = ({ items }: { items: string[] }) => {
  if (!items || items.length === 0)
    return <span className="text-gray-400 text-xs">N/A</span>;

  const displayItems = items.slice(0, 2);
  const remaining = items.length - 2;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {displayItems.map((item, i) => (
        <Badge
          key={i}
          variant="secondary"
          className="text-[10px] px-1.5 py-0.5 font-normal whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {item}
        </Badge>
      ))}
      {remaining > 0 && (
        <span className="text-[10px] text-gray-500 font-medium ml-1">
          +{remaining} more
        </span>
      )}
    </div>
  );
};

const Experts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("sort");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");

  const router = useRouter();

  // 1. Fetch filtered experts for the table
  const { expertList: activeList, isLoading } = useGetAllExpert(
    page,
    Number(rowsPerPage),
    statusFilter,
    debouncedSearch,
    roleFilter,
    skillFilter
  );

  // 2. Fetch global metrics (using limit: 1 to minimize payload)
  const { expertList: totalMetrics } = useGetAllExpert(1, 1);
  const { expertList: activeMetrics } = useGetAllExpert(1, 1, "active");
  const { expertList: inactiveMetrics } = useGetAllExpert(1, 1, "inactive");
  const { expertList: verifiedMetrics } = useGetAllExpert(1, 1, "active", "", "", "", true);

  // 3. Fetch data for filter unique values (fetching a larger set to capture most roles/skills)
  const { expertList: globalDataForFilters } = useGetAllExpert(1, 100);

  const totalItems = totalMetrics?.data?.totalItems ?? 0;
  const activeCount = activeMetrics?.data?.totalItems ?? 0;
  const inactiveCount = inactiveMetrics?.data?.totalItems ?? 0;
  const verifiedCount = verifiedMetrics?.data?.totalItems ?? 0;

  const experts: Expert[] = useMemo(() => {
    let list = activeList?.data?.data ?? [];

    // Fallback client-side filtering if server-side is not fully supported or for immediate feedback
    if (skillFilter !== "all") {
      list = list.filter((e) => e.skills?.includes(skillFilter));
    }
    if (roleFilter !== "all") {
      list = list.filter((e) => e.role?.includes(roleFilter));
    }

    return list;
  }, [activeList, skillFilter, roleFilter]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set<string>();
    globalDataForFilters?.data?.data?.forEach((e: Expert) => e.role?.forEach((r) => roles.add(r)));
    return Array.from(roles).sort();
  }, [globalDataForFilters]);

  const uniqueSkills = useMemo(() => {
    const skills = new Set<string>();
    globalDataForFilters?.data?.data?.forEach((e: Expert) => e.skills?.forEach((s) => skills.add(s)));
    return Array.from(skills).sort();
  }, [globalDataForFilters]);

  const totalPages = activeList?.data?.totalPages ?? 1;
  const currentPage = activeList?.data?.currentPage ?? 1;

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
    setSkillFilter("all");
    setSortBy("sort");
    setPage(1);
  };

  const isFiltered = searchTerm || statusFilter !== "all" || roleFilter !== "all" || skillFilter !== "all" || sortBy !== "sort";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Registered Experts"
          value={totalItems}
          secondaryLabel="Verified"
          secondaryValue={verifiedCount}
          isLoading={isLoading}
          borderLeftColor="border-[#04E762]"
        />
        <StatCard
          label="Inactive Experts"
          value={inactiveCount}
          secondaryLabel="Inactive"
          secondaryValue={inactiveCount}
          isLoading={isLoading}
          borderLeftColor="border-primary-hover"
        />
        <StatCard
          label="Active Experts"
          value={activeCount}
          secondaryLabel="Active Experts"
          secondaryValue={activeCount}
          isLoading={isLoading}
          borderLeftColor="border-[#04E762]"
        />
      </div>

      <div className="w-full bg-white my-4 md:my-6">
        {/* Header */}
        <h1 className="text-2xl font-medium text-[#878A93] mb-6">
          Experts List
        </h1>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300 rounded-xl">
                <SelectValue placeholder="All Experts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experts</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300 rounded-xl">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={skillFilter} onValueChange={(val) => { setSkillFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300 rounded-xl">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {uniqueSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setPage(1); }}>
              <SelectTrigger className="w-[100px] h-9 text-sm border-gray-300 rounded-xl">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sort">Sort</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex items-center gap-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name/email"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="pl-10 w-[240px] h-9 text-sm border-gray-300 rounded-xl"
              />
            </div>

            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 text-sm text-primary hover:text-primary-hover px-2"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* <Button
            variant="outline"
            size="sm"
            className="h-9 text-sm border-gray-300 bg-transparent rounded-xl"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Date
          </Button> */}
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden">
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="py-4">Expert name</TableHead>
                  <TableHead className="py-4">Role</TableHead>
                  <TableHead className="py-4">Skills</TableHead>
                  <TableHead className="py-4">Projects/Tasks</TableHead>
                  <TableHead className="py-4">Status</TableHead>
                  <TableHead className="py-4">Date Joined</TableHead>
                  <TableHead className="py-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: Number(rowsPerPage) }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-[#878A93] font-medium text-sm py-4">
                    Expert name
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4">
                    Role
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4">
                    Skills
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4">
                    Projects/Tasks
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4">
                    Status
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4">
                    Date Joined
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experts.length > 0 ? (
                  experts.map((expert: Expert) => (
                    <TableRow
                      onClick={() => router.push(`/experts/${expert.id}`)}
                      key={expert.id}
                      className="border-b capitalize border-gray-100 cursor-pointer hover:bg-gray-50/50"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs overflow-hidden border ${expert?.profilePicture
                              ? "bg-gray-100 border-gray-200"
                              : expert?.status === "active"
                                ? "bg-[#04E762]/5 border-[#04E762]/20 text-[#04E762]"
                                : "bg-[#F2BB05]/5 border-[#F2BB05]/20 text-[#F2BB05]"
                              }`}
                          >
                            {expert?.profilePicture ? (
                              <Image
                                src={expert.profilePicture}
                                alt="profile picture"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-medium leading-none text-xs">
                                {expert?.name?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-900 text-sm font-medium">
                              {expert?.name || "Unknown User"}
                            </span>
                            <span className="text-gray-500 text-[10px] lowercase transition-colors">
                              {expert?.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm py-4">
                        <RenderTags items={expert.role || []} />
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm py-4">
                        <RenderTags items={expert.skills || []} />
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm py-4">
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="font-normal text-[#878A93] border-gray-200"
                          >
                            {expert.projectCount || 0} Prj
                          </Badge>
                          <Badge
                            variant="outline"
                            className="font-normal text-[#878A93] border-gray-200"
                          >
                            {expert.taskCount || 0} Tsk
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant={
                            expert.status === "active" ? "default" : "secondary"
                          }
                          className={
                            expert.status === "active"
                              ? "border border-[#04E762] text-[#04E762] text-[10px] font-normal px-2 py-0.5 bg-transparent hover:bg-transparent w-16 justify-center"
                              : "border border-[#F2BB05] text-[#F2BB05] text-[10px] font-normal px-2 py-0.5 bg-transparent hover:bg-transparent w-16 justify-center"
                          }
                        >
                          {expert.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm py-4">
                        <span className="text-gray-500 text-xs">
                          {new Date(expert.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/experts/${expert.id}`)}
                            >
                              View Profile
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-40 text-center text-gray-500"
                    >
                      No experts found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 mx-4 md:mx-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page</span>
            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
              <SelectTrigger className="w-16 h-8 text-sm border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 text-gray-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experts;
