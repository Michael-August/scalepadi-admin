"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useGetAllProjects } from "@/hooks/useProjects";
import { Calendar, Clock, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetAllBusiness, useGrowthInsight } from "@/hooks/useBusiness";
import { BusinessType } from "../business/page";
import { useGetAllExpert } from "@/hooks/useExpert";
import { Expert } from "../experts/page";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useGetAdminByToken } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Overview = () => {
  const router = useRouter();
  const { admin, isLoading: adminLoading } = useGetAdminByToken();
  const { projectList, isLoading: projectsLoading } = useGetAllProjects();
  const { businessList, isLoading: businessLoading } = useGetAllBusiness(1);
  const { expertList, isLoading: expertsLoading } = useGetAllExpert(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const { insights, isLoading: insightLoading } = useGrowthInsight(year);

  // Separate fetches for stats
  const { expertList: activeExpertsList, isLoading: activeExpertsLoading } = useGetAllExpert(1, 1, "active");
  const { expertList: verifiedExpertsList, isLoading: verifiedExpertsLoading } = useGetAllExpert(1, 1, "active", true);

  const { businessList: activeBusinessList, isLoading: activeBusinessLoading } = useGetAllBusiness(1, 1, "active");
  const { businessList: verifiedBusinessList, isLoading: verifiedBusinessLoading } = useGetAllBusiness(1, 1, "", true);

  const { projectList: pendingProjectsList, isLoading: pendingProjectsLoading } = useGetAllProjects(1, 1, "pending");
  const { projectList: completedProjectsList, isLoading: completedProjectsLoading } = useGetAllProjects(1, 1, "completed");


  const data =
    insights?.data?.map(
      (item: {
        month: number;
        businesses: number;
        experts: number;
        projects: number;
      }) => ({
        name: monthNames[item.month - 1],
        Business: item.businesses,
        Expert: item.experts,
        Project: item.projects,
      })
    ) ?? [];

  const isLoading =
    projectsLoading ||
    businessLoading ||
    expertsLoading ||
    adminLoading ||
    insightLoading ||
    activeExpertsLoading ||
    verifiedExpertsLoading ||
    activeBusinessLoading ||
    verifiedBusinessLoading ||
    pendingProjectsLoading ||
    completedProjectsLoading;

  //   EXPERT
  const experts: Expert[] = useMemo(
    () => expertList?.data?.data ?? [],
    [expertList]
  );
  const totalItems = expertList?.data?.totalItems ?? 0;
  const activeExpertsCount = activeExpertsList?.data?.totalItems ?? 0;
  const verifiedExpertsCount = verifiedExpertsList?.data?.totalItems ?? 0;

  //   BUSINESS
  const businesses: BusinessType[] = useMemo(
    () => businessList?.data?.data ?? [],
    [businessList]
  );
  const totalBusinesses = businessList?.data?.totalItems || 0;
  // Note: verifiedBusinessList fetches verified=true regardless of status. If you need explicitly verified AND active, update hook call.
  // Assuming 'Verified' usually implies a checked state. If the UI meant "Verfied Account", verified=true is correct.
  const verifiedCount = verifiedBusinessList?.data?.totalItems || 0;
  const activeCount = activeBusinessList?.data?.totalItems || 0;

  const projects = useMemo(
    () => projectList?.data?.slice(0, 3) ?? [],
    [projectList]
  );

  const pendingProjectsCount = pendingProjectsList?.totalItems || 0;
  const completedProjectsCount = completedProjectsList?.totalItems || 0;


  const recentSignups = useMemo(() => {
    const businessSignups = businesses.slice(0, 3).map((business) => ({
      id: business.id,
      name: business.name,
      email: business.email,
      accountType: "Business",
      status: business.verified ? "Verified" : "Pending",
      createdAt: business.createdAt,
      avatar: business.name?.charAt(1),
    }));

    const expertSignups = experts.slice(0, 3).map((expert) => ({
      id: expert.id,
      name: expert.name,
      email: expert.email,
      accountType: "Expert",
      status: expert.verified ? "Verified" : "Pending",
      createdAt: expert.createdAt,
      avatar: expert.name?.charAt(1),
    }));

    return [...businessSignups, ...expertSignups]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [businesses, experts]);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDueWeeks = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = Math.abs(due.getTime() - now.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="text-xl md:text-2xl text-[#878A93] font-semibold mb-">
        Welcome back, {admin?.name}! 👋
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Experts Stats */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-[#878A93] font-medium">
            Total Experts:{" "}
            <span className="text-[#3E4351]">
              {isLoading ? (
                <Skeleton className="h-4 w-10 inline-block" />
              ) : (
                <CountUp end={totalItems} duration={2} />
              )}
            </span>
          </span>
          <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex gap-4 p-4">
            {isLoading ? (
              <>
                <div className="border-r w-full flex flex-col gap-3 border-[#EFF2F3]">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="w-full flex flex-col gap-3">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </>
            ) : (
              <>
                <div className="border-r w-full flex flex-col gap-4 border-[#EFF2F3]">
                  <span className="text-2xl font-bold text-[#0E1426]">
                    <CountUp end={activeExpertsCount} duration={2} />
                  </span>
                  <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary">
                    Active
                  </span>
                </div>
                <div className="w-full flex flex-col gap-4 border-[#EFF2F3]">
                  <span className="text-2xl font-bold text-[#0E1426]">
                    <CountUp end={verifiedExpertsCount} duration={2} />
                  </span>
                  <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary-hover">
                    Verified
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Businesses Stats */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-[#878A93] font-medium">
            Total Businesses:{" "}
            <span className="text-[#3E4351]">
              {isLoading ? (
                <Skeleton className="h-4 w-10 inline-block" />
              ) : (
                <CountUp end={totalBusinesses} duration={2} />
              )}
            </span>
          </span>
          <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex gap-4 p-4">
            {isLoading ? (
              <>
                <div className="border-r w-full flex flex-col gap-3 border-[#EFF2F3]">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="w-full flex flex-col gap-3">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </>
            ) : (
              <>
                <div className="border-r w-full flex flex-col gap-4 border-[#EFF2F3]">
                  <span className="text-2xl font-bold text-[#0E1426]">
                    <CountUp end={verifiedCount} duration={2} />
                  </span>
                  <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary">
                    Verified
                  </span>
                </div>
                <div className="w-full flex flex-col gap-4 border-[#EFF2F3]">
                  <span className="text-2xl font-bold text-[#0E1426]">
                    <CountUp end={activeCount} duration={2} />
                  </span>
                  <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">
                    Active
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Projects Stats */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-[#878A93] font-medium">
            Total Projects:{" "}
            <span className="text-[#3E4351]">
              {isLoading ? (
                <Skeleton className="h-4 w-10 inline-block" />
              ) : (
                <CountUp end={projectList?.totalItems || 0} duration={2} />
              )}
            </span>
          </span>
          <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex gap-4 p-4">
            {isLoading ? (
              <>
                <div className="border-r w-full flex flex-col gap-3 border-[#EFF2F3]">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="w-full flex flex-col gap-3">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </>
            ) : (
              <>
                <div className="border-r w-full flex flex-col gap-4 border-[#EFF2F3]">
                  <span className="text-2xl font-bold text-[#0E1426]">
                    <CountUp end={pendingProjectsCount} duration={2} />
                  </span>
                  <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#1E88E5]">
                    Pending
                  </span>
                </div>
                <div className="w-full flex flex-col gap-4 border-[#EFF2F3]">
                  <span className="text-2xl font-bold text-[#0E1426]">
                    <CountUp end={completedProjectsCount} duration={2} />
                  </span>
                  <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#1E88E5]">
                    Completed
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chart and Projects Section */}
      <div className="flex flex-col lg:flex-row gap-6 mt-4">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#878A93] text-[20px] font-medium">
              Growth insight ({year})
            </h2>

            {/* Year selector */}
            <Select
              value={String(year)}
              onValueChange={(val) => setYear(Number(val))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-80">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={1} barCategoryGap={20}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="square"
                    iconSize={12}
                    wrapperStyle={{ paddingBottom: 20, fontSize: "8px" }}
                  />
                  <Bar
                    dataKey="Business"
                    fill="#1746A2"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                  <Bar
                    dataKey="Expert"
                    fill="#1A1A1A"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                  <Bar
                    dataKey="Project"
                    fill="#FCCE37"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[351px] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[#878A93] font-medium text-[20px]">
              Projects
            </span>
            <Link href="/projects" passHref>
              <span className="text-base text-[#0E1426] font-medium cursor-pointer hover:underline">
                See all
              </span>
            </Link>
          </div>

          <div className="bg-[#FBFCFC] w-full hide-scrollbar h-80 overflow-y-auto rounded-3xl p-4">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="w-full flex flex-col gap-3 p-3 mb-4">
                    <div className="flex w-full items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Skeleton className="h-5 w-5 rounded-full mr-1" />
                        <Skeleton className="h-5 w-5 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-40" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <div
                  onClick={() => router.push(`/projects/${project.id}`)}
                  key={project.id}
                  className="w-full cursor-pointer flex flex-col gap-2 p-3 mb-4 border-b border-[#EFF2F3] last:border-b-0"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Image
                        src={
                          project.status === "completed"
                            ? "/icons/completed.svg"
                            : "/icons/inprogress.svg"
                        }
                        width={18}
                        height={18}
                        alt={`${project.status} icon`}
                      />
                      <span
                        className={`text-xs ${project.status === "completed"
                          ? "text-[#04E762]"
                          : project.status === "in-progress"
                            ? "text-[#3A5EFC]"
                            : "text-[#FF9500]"
                          }`}
                      >
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </span>
                    </div>
                    <MoreHorizontal className="w-4 cursor-pointer" />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {project.experts && project.experts.length > 0 ? (
                        project.experts.map((expert, idx: number) => {
                          const initials = expert.name
                            ? expert.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                            : "P";

                          return expert.image ? (
                            <Image
                              key={idx}
                              src={expert.image}
                              alt={expert.name || "profile picture"}
                              width={20}
                              height={20}
                              className={`w-5 h-5 rounded-full ${idx > 0 ? "-ml-2" : ""
                                }`}
                            />
                          ) : (
                            <div
                              key={idx}
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium text-white ${idx > 0 ? "-ml-2" : ""
                                }`}
                              style={{
                                backgroundColor:
                                  "#" +
                                  ((Math.random() * 0xffffff) << 0).toString(
                                    16
                                  ),
                              }}
                            >
                              {initials}
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No expert
                        </span>
                      )}
                    </div>

                    <span className="text-sm text-[#878A93]">
                      {project.title}
                    </span>
                  </div>

                  <span className="text-sm text-[#878A93]">
                    {project.businessId &&
                      typeof project.businessId === "object"
                      ? `Business: ${project.businessId.name}`
                      : "Business information not available"}
                  </span>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 items-center">
                      <Calendar className="w-4 h-4 text-[#878A93]" />
                      <span className="text-sm text-[#878A93]">
                        {formatDate(project.createdAt)}
                      </span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Clock className="w-4 h-4 text-[#878A93]" />
                      <span className="text-sm text-[#878A93]">
                        Due:{" "}
                        {project.dueDate
                          ? calculateDueWeeks(project.dueDate)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-[#878A93]">No projects available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sign-up feeds Section */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-medium text-[#878A93]">
            Sign-up feeds
          </span>
          <Link href="/experts" passHref>
            <span className="text-base text-[#0E1426] font-medium cursor-pointer hover:underline">
              See all
            </span>
          </Link>
        </div>

        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-[#878A93] font-medium text-sm py-4 line-clamp-1">
                  User name
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Email
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4 line-clamp-1">
                  Account Type
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Status
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Created
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i} className="hover:bg-gray-50/50">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : recentSignups.length > 0 ? (
                recentSignups.map((user) => (
                  <TableRow
                    key={user.id}
                    onClick={() =>
                      router.push(
                        `${user.accountType === "Business"
                          ? `/business/${user.id}`
                          : `/experts/${user.id}`
                        }`
                      )
                    }
                    className="hover:bg-gray-50/50 cursor-pointer"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm capitalize">
                          <Badge
                            variant={
                              user.status === "Verified"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              user.status === "Verified"
                                ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs font-normal px-2 py-1"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-normal px-2 py-1"
                            }
                          >
                            {user.avatar}
                          </Badge>
                        </div>
                        <span className="text-gray-900 text-sm line-clamp-1">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {user.accountType}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={
                          user.status === "Verified" ? "default" : "secondary"
                        }
                        className={
                          user.status === "Verified"
                            ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs font-normal px-2 py-1"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-normal px-2 py-1"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {formatDate(user.createdAt)}
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
                          <DropdownMenuItem asChild>
                            <Link
                              href={
                                user.accountType === "Business"
                                  ? `/business/${user.id}`
                                  : `/experts/${user.id}`
                              }
                            >
                              View profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Verify</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-[#878A93]"
                  >
                    No recent signups
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
