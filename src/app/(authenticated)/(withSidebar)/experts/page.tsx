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

const Experts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("sort");
  const [statusFilter, setStatusFilter] = useState("all");

  const router = useRouter();

  const { expertList, isLoading } = useGetAllExpert(page, Number(rowsPerPage));
  const [query, setQuery] = useState("");

  const { expertList: searchResults } = useSearchExpert(
    searchTerm,
    page,
    Number(rowsPerPage)
  );

  const activeList = searchTerm ? searchResults : expertList;
  console.log(activeList);
  const totalPages = activeList?.data?.totalPages ?? 1;
  const currentPage = activeList?.data?.currentPage ?? 1;
  const totalItems = activeList?.data?.totalItems ?? 0;

  const experts: Expert[] = useMemo(
    () => activeList?.data?.data ?? [],
    [activeList]
  );

  const filteredExperts = useMemo(() => {
    let filtered: Expert[] = experts;

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          exp.name.toLowerCase().includes(lower) ||
          exp.email.toLowerCase().includes(lower) ||
          exp.role.join(", ").toLowerCase().includes(lower)
      );
    }

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter((exp) => exp.status === "active");
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((exp) => exp.status === "inactive");
    }

    // Sorting
    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return filtered;
  }, [experts, searchTerm, sortBy, statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-end w-full justify-between gap-6">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-sm text-[#878A93] font-medium">
            Total Registered Experts:{" "}
            <span className="text-[#3E4351]">{totalItems}</span>
          </span>
          <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex flex-col md:flex-row gap-6 p-4">
            <div className="border-r md:w-full flex flex-col gap-4 border-[#EFF2F3] pr-4">
              <span className="text-2xl font-bold text-[#0E1426]">
                {
                  experts.filter(
                    (e: Expert) => e.verified === true && e.status === "active"
                  ).length
                }
              </span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">
                Verified
              </span>
            </div>
            <div className="border-r md:w-full flex flex-col gap-4 border-[#EFF2F3] pr-4">
              <span className="text-2xl font-bold text-[#0E1426]">
                {experts.filter((e: Expert) => e.status === "inactive").length}
              </span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary-hover">
                Inactive
              </span>
            </div>
            <div className="w-full flex flex-col gap-4">
              <span className="text-2xl font-bold text-[#0E1426]">
                {experts.filter((e: Expert) => e.status === "active").length}
              </span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">
                Active Experts
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white">
        {/* Header */}
        <h1 className="text-2xl font-medium text-[#878A93] mb-6">
          Experts List
        </h1>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experts</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[100px] h-9 text-sm border-gray-300">
                <SelectValue />
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 w-[200px] h-9 text-sm border-gray-300"
              />
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setSearchTerm(query); // triggers search
                  setPage(1); // reset to page 1
                }}
              >
                Search
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 text-sm border-gray-300 bg-transparent"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Date
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden">
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="py-4">Expert name</TableHead>
                  <TableHead className="py-4">Role</TableHead>
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
                {filteredExperts.map((expert: Expert) => (
                  <TableRow
                    onClick={() => router.push(`/experts/${expert.id}`)}
                    key={expert.id}
                    className="border-b capitalize border-gray-100 cursor-pointer hover:bg-gray-50/50"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs overflow-hidden border ${
                            expert?.profilePicture
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
                              width={20}
                              height={20}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-medium leading-none text-[10px]">
                              {expert?.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-900 text-sm">
                          {expert?.name || "Unknown User"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {expert.role?.length ? expert.role.join(", ") : "—"}
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {expert.projectCount}/{expert.taskCount}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={
                          expert.status === "active" ? "default" : "secondary"
                        }
                        className={
                          expert.status === "active"
                            ? "border border-[#04E762] text-[#04E762] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent w-16 justify-center"
                            : "border border-[#F2BB05] text-[#F2BB05] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent w-16 justify-center"
                        }
                      >
                        {expert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {new Date(expert.createdAt).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          {/* <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
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
