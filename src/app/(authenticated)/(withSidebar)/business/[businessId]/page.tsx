"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FolderOpen,
  MessageCircle,
  MoreHorizontal,
  Search,
  Tag,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import PaymentsTab from "./PaymentAndBilling";
import ExpertTab from "./ExpertTab";
import { ProjectSkeleton } from "@/components/ui/project-skeleton";
import { useGetBusinessById } from "@/hooks/useBusiness";
import { useGetAllBusinessProjects } from "@/hooks/useExpert";

export interface BusinessDetails {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  password: string;
  terms: boolean;
  verified: boolean;
  status: "active" | "inactive";
  newsletterStatus: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  status: "active" | "pending" | "completed";
  dueDate: string;
  brief: string;
  goal: string;
  proposedTotalCost: number;
  experts: any[];
  paymentStatus: string;
  createdAt: string;
}

const BusinessId = () => {
  const [activeTab, setActiveTab] = useState<
    "about" | "aiusage" | "projects" | "experts" | "payments"
  >("about");
  const params = useParams();
  const businessId = params.businessId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState(""); // New state for input value
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  const router = useRouter();
  const { businessDetails, isLoading } = useGetBusinessById(businessId);

  const { AllBusinessProjects, isLoading: projectsLoading } =
    useGetAllBusinessProjects(
      businessId,
      currentPage,
      itemsPerPage,
      statusFilter,
      sortBy,
      searchQuery
    );
  console.log(businessDetails);

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
    setCurrentPage(1);
  };

  const projects = useMemo(() => {
    if (!AllBusinessProjects?.data) return [];

    if (AllBusinessProjects.data && Array.isArray(AllBusinessProjects.data)) {
      return AllBusinessProjects.data;
    }

    if (Array.isArray(AllBusinessProjects)) {
      return AllBusinessProjects;
    }

    return [];
  }, [AllBusinessProjects]);

  const paginationInfo = useMemo(() => {
    if (!AllBusinessProjects)
      return { currentPage: 1, totalPages: 1, itemsPerPage: 10, totalItems: 0 };

    if (AllBusinessProjects.currentPage !== undefined) {
      return {
        currentPage: AllBusinessProjects.currentPage,
        totalPages: AllBusinessProjects.totalPages,
        itemsPerPage: AllBusinessProjects.itemsPerPage,
        totalItems: AllBusinessProjects.totalItems,
      };
    }

    return {
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 10,
      totalItems: projects.length,
    };
  }, [AllBusinessProjects, projects]);

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (!businessDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500">Business not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-[#EDEEF3] pb-4">
        <div className="heading w-full bg-[#F8F8F8] py-4 px-4 md:px-6 flex items-center gap-2 overflow-x-auto">
          <span
            onClick={() => window.history.back()}
            className="text-[#1746A2AB] text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            Back to Business list
          </span>
          <span className="text-[#CFD0D4] text-sm">/</span>
          <span className="text-[#1A1A1A] text-sm font-medium whitespace-nowrap">
            {businessDetails.title}
          </span>
          <span className="text-[#CFD0D4] text-sm">/</span>
        </div>

        <div className="flex flex-col xl:flex-row w-full items-start xl:items-center justify-between gap-4">
          {/* Left section */}
          <div className="top flex flex-col gap-4 w-full">
            {/* Business Info Header */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-[#CDFAE0] flex items-center justify-center p-[8.22px] text-[#1A1A1A] text-xs h-[76px] w-[79.77px] rounded-[16.43px]">
                {businessDetails.name.substring(0, 8)}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-lg sm:text-[20px] text-[#3E4351] font-semibold break-words">
                  {businessDetails.title}
                </span>
                <div className="items-center gap-2 flex flex-wrap">
                  <span className="flex items-center gap-[4px] text-sm text-[#878A93]">
                    <User className="w-4 h-4 shrink-0" />
                    Contact Person:{" "}
                    <span className="text-[#121217]">
                      {businessDetails.name}{" "}
                      <span className="text-[#878A93]">|</span>{" "}
                      {businessDetails.email}{" "}
                      <span className="text-[#878A93]">|</span>{" "}
                      {businessDetails.phone}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Meta details */}
            <div className="items-center gap-3 flex flex-wrap">
              <span className="flex items-center gap-[4px] text-sm text-[#878A93]">
                <Calendar className="w-4 h-4 shrink-0" />
                Joined Date:{" "}
                <span className="text-[#121217]">
                  {formatDate(businessDetails.createdAt)}
                </span>
              </span>
              <span className="flex items-center gap-[4px] text-sm text-[#878A93]">
                <Clock className="w-4 h-4 shrink-0" />
                Account status:{" "}
                <span className="text-[#121217]">
                  {businessDetails.verified ? "Verified" : "Pending"}
                </span>
              </span>
              <span className="flex items-center gap-[4px] text-sm text-[#878A93]">
                <Clock className="w-4 h-4 shrink-0" />
                Activity status:{" "}
                <span className="text-[#121217] capitalize">
                  {businessDetails.status}
                </span>
              </span>
              <span className="flex items-center gap-[4px] text-sm text-[#878A93]">
                <Tag className="w-4 h-4 shrink-0" />
                Current Plan: <span className="text-[#121217]">Padi Pro</span>
              </span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center justify-end gap-3 w-full xl:w-auto">
            <Button className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black w-full sm:w-auto">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>
      </div>
      <div className="project-details w-full">
        <div className="tab pt-2 w-full flex items-center gap-2 sm:gap-5 bg-[#F9FAFB] overflow-x-auto">
          <div
            className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3 min-w-max
                        hover:border-[#3A96E8] transition-colors 
                        ${
                          activeTab === "about"
                            ? "border-[#3A96E8] text-[#3A96E8]"
                            : "border-transparent"
                        }`}
            onClick={() => setActiveTab("about")}
          >
            <span className="text-sm">About</span>
          </div>

          <div
            className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3 min-w-max
                        hover:border-[#3A96E8] transition-colors 
                        ${
                          activeTab === "aiusage"
                            ? "border-[#3A96E8] text-[#3A96E8]"
                            : "border-transparent"
                        }`}
            onClick={() => setActiveTab("aiusage")}
          >
            <span className="text-sm">AI Usage Summary</span>
          </div>
          <div
            className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3 min-w-max
                        hover:border-[#3A96E8] transition-colors 
                        ${
                          activeTab === "projects"
                            ? "border-[#3A96E8] text-[#3A96E8]"
                            : "border-transparent"
                        }`}
            onClick={() => setActiveTab("projects")}
          >
            <span className="text-sm">Projects ({projects.length})</span>
          </div>
          <div
            className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3 min-w-max
                        hover:border-[#3A96E8] transition-colors 
                        ${
                          activeTab === "experts"
                            ? "border-[#3A96E8] text-[#3A96E8]"
                            : "border-transparent"
                        }`}
            onClick={() => setActiveTab("experts")}
          >
            <span className="text-sm">Experts</span>
          </div>
          <div
            className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3 min-w-max
                        hover:border-[#3A96E8] transition-colors 
                        ${
                          activeTab === "payments"
                            ? "border-[#3A96E8] text-[#3A96E8]"
                            : "border-transparent"
                        }`}
            onClick={() => setActiveTab("payments")}
          >
            <span className="text-sm">Payments</span>
          </div>
        </div>

        {activeTab === "about" && (
          <div className="flex flex-col gap-4 my-3">
            <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg sm:text-[20px] text-primary">
                  Business Summary
                </span>
                <span className="border border-[#E7E8E9] rounded-[10px] p-2 bg-white cursor-pointer text-[#0E1426] text-sm">
                  Update
                </span>
              </div>
              <span className="text-[#353D44] text-sm">
                👋 Hey there! I&rsquo;m Abdullahi Suleiman (sulbyee) a curious,
                resourceful, and impact-driven UI/UX and Product Designer with
                over 3 years of experience turning ideas into user-centered
                digital experiences across mobile, web, and wearables.
              </span>
            </div>

            <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg sm:text-[20px] text-primary">
                  Business information
                </span>
                <span className="border border-[#E7E8E9] rounded-[10px] p-2 bg-white cursor-pointer text-[#0E1426] text-sm">
                  Edit
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[#878A93] text-sm font-normal">
                    Full Name
                  </span>
                  <span className="text-[#1A1A1A] text-base font-semibold">
                    {businessDetails.name}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#878A93] text-sm font-normal">
                    Email
                  </span>
                  <span className="text-[#1A1A1A] text-base font-semibold">
                    {businessDetails.email}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#878A93] text-sm font-normal">
                    Phone number
                  </span>
                  <span className="text-[#1A1A1A] text-base font-semibold">
                    {businessDetails.phone}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#878A93] text-sm font-normal">
                    Account Status
                  </span>
                  <span className="text-[#1A1A1A] text-base font-semibold capitalize">
                    {businessDetails.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#878A93] text-sm font-normal">
                    Verification Status
                  </span>
                  <span className="text-[#1A1A1A] text-base font-semibold">
                    {businessDetails.verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#878A93] text-sm font-normal">
                    Last Login
                  </span>
                  <span className="text-[#1A1A1A] text-base font-semibold">
                    {formatDate(businessDetails.lastLogin)}
                  </span>
                </div>
              </div>
            </div>

            <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg sm:text-[20px] text-primary">
                  Other Information
                </span>
                <span className="border border-[#E7E8E9] rounded-[10px] p-2 bg-white cursor-pointer text-[#0E1426] text-sm">
                  Edit
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[#878A93] text-sm font-normal">
                    Newsletter Subscription
                  </span>
                  <span className="text-[#1A1A1A] text-base font-semibold">
                    {businessDetails.newsletterStatus
                      ? "Subscribed"
                      : "Not Subscribed"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#878A93] text-sm font-normal">
                    Terms Accepted
                  </span>
                  <span className="text-[#1A1A1A] text-base font-semibold">
                    {businessDetails.terms ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg sm:text-[20px] text-primary">
                  Settings
                </span>
                <span className="border border-[#E7E8E9] rounded-[10px] p-2 bg-white cursor-pointer text-[#0E1426] text-sm">
                  Edit
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "aiusage" && (
          <div className="flex flex-col gap-4 my-4">
            <div className="flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-[#0E1426]">
                  AI Assistant Usage Overview
                </span>
              </div>
              <span className="text-[#353D44] text-sm">
                This business has made 26 AI queries in the past 30 days. Their
                last interaction was on July 4. Most queries were around funnel
                optimisation and campaign performance. AI engagement has
                increased 18% this month.
              </span>

              <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex flex-col sm:flex-row gap-6 p-4 mt-5">
                <div className="border-b sm:border-b-0 sm:border-r w-full flex flex-col gap-4 border-[#EFF2F3] pb-4 sm:pb-0">
                  <span className="text-2xl font-bold text-[#0E1426]">26</span>
                  <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">
                    AI queries
                  </span>
                </div>
                <div className="border-b sm:border-b-0 sm:border-r w-full flex flex-col gap-4 border-[#EFF2F3] pb-4 sm:pb-0">
                  <span className="text-2xl font-bold text-[#0E1426]">
                    July 4
                  </span>
                  <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary-hover">
                    last interaction
                  </span>
                </div>
                <div className="w-full flex flex-col gap-4">
                  <span className="text-2xl font-bold text-[#0E1426]">18%</span>
                  <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">
                    AI engagement
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
              <div className="w-full p-4 md:p-6">
                <h1 className="text-base font-medium text-primary mb-6">
                  Full Query
                </h1>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Select value="all-projects" defaultValue="all-projects">
                      <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-projects">
                          All projects
                        </SelectItem>
                        <SelectItem value="in-progress">In-Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="sort">
                      <SelectTrigger className="w-[80px] h-9 text-sm border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sort">Sort</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">
                          Date Joined
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">
                          Query
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">
                          Category
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">
                          Action Taken
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{/* Query data would go here */}</TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="flex flex-col gap-4 my-4">
            <div className="flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-3">
              <div className="bg-white">
                {/* Header */}
                <h1 className="text-xl md:text-2xl font-medium text-[#878A93] mb-6">
                  Project List
                </h1>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All projects</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={sortBy}
                      onValueChange={(value) => {
                        setSortBy(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[80px] h-9 text-sm border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="dueDate">Date</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="relative flex items-center">
                      <Input
                        placeholder="Search by project"
                        value={tempSearchQuery}
                        onChange={(e) => setTempSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                        className="w-[200px] h-9 text-sm border-gray-300 pr-2"
                      />
                      <Button
                        onClick={handleSearch}
                        className="ml-2 h-9 text-sm bg-primary text-white hover:bg-primary-hover"
                      >
                        <Search className="h-4 w-4" />
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
                <div className="rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">
                          Project name
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">
                          Experts
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">
                          Total Cost
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">
                          Status
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">
                          Due Date
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectsLoading ? (
                        // Loading state
                        Array.from({ length: 3 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell colSpan={6} className="py-4">
                              <div className="flex items-center space-x-4">
                                <div className="rounded-full bg-gray-200 h-10 w-10 animate-pulse"></div>
                                <div className="space-y-2">
                                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : projects.length > 0 ? (
                        projects.map((project) => (
                          <TableRow
                            onClick={() =>
                              router.push(`/projects/${project.id}`)
                            }
                            key={project.id}
                            className="border-b border-gray-100 cursor-pointer hover:bg-gray-50/50"
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                                  <FolderOpen
                                    className={
                                      project.status === "active"
                                        ? "text-[#04E762]"
                                        : "text-[#F2BB05]"
                                    }
                                  />
                                </div>
                                <span className="text-gray-900 text-sm">
                                  {project.title}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-700 text-sm py-4">
                              {project.experts && project.experts.length > 0
                                ? project.experts.length
                                : "Not assigned"}
                            </TableCell>
                            <TableCell className="text-gray-700 text-sm py-4">
                              {project.proposedTotalCost
                                ? `₦${project.proposedTotalCost.toLocaleString()}`
                                : "Not specified"}
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant={
                                  project.status === "active"
                                    ? "default"
                                    : project.status === "pending"
                                    ? "secondary"
                                    : "outline"
                                }
                                className={
                                  project.status === "active"
                                    ? "border border-[#04E762] text-[#04E762] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent"
                                    : project.status === "pending"
                                    ? "border border-[#F2BB05] text-[#F2BB05] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent"
                                    : "border border-gray-300 text-gray-500 text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent"
                                }
                              >
                                {project.status?.charAt(0).toUpperCase() +
                                  project.status?.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-700 text-sm py-4">
                              {project.dueDate
                                ? formatDate(project.dueDate)
                                : "Not set"}
                            </TableCell>
                            <TableCell className="py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  asChild
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/projects/${project.id}`)
                                    }
                                  >
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            No projects found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(parseInt(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-16 h-8 text-sm border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {paginationInfo.currentPage} of{" "}
                      {paginationInfo.totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === paginationInfo.totalPages}
                      >
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "experts" && (
          <ExpertTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            businessId={businessId}
          />
        )}
        {activeTab === "payments" && (
          <PaymentsTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={itemsPerPage}
            setRowsPerPage={setItemsPerPage}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessId;
