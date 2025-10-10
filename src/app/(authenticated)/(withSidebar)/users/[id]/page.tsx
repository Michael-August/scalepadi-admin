"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  House,
  MessageCircle,
  MoreHorizontal,
  Search,
  User2Icon,
  Verified,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { useGetAdminApprovedUsers, useGetAdminById } from "@/hooks/useAuth";

const AdminDetails = () => {
  const [activeTab, setActiveTab] = useState<"task">("task");
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all-projects");
  const [sortOption, setSortOption] = useState<string>("sort");

  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { AdminDetails } = useGetAdminById(id ?? "");
  console.log(AdminDetails);

  const { adminApprovedUsers, isLoading } = useGetAdminApprovedUsers(id ?? "");
  console.log(adminApprovedUsers?.totalItems);

  const totalItems = adminApprovedUsers?.totalItems || 0;
  const totalPages = adminApprovedUsers?.totalPages || 1;
  const currentPageFromApi = adminApprovedUsers?.currentPage || 1;
  const itemsPerPage = adminApprovedUsers?.itemsPerPage || 10;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  function getInitials(name: string) {
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`; // unique but consistent
    return color;
  }

  return (
    <div className="flex w-full flex-col lg:w-[82%] xl:w-full gap-6 bg-gray-100/50 px-4 md:px-6">
      <div className="flex flex-col gap-4 border-b border-[#EDEEF3] pb-4">
        <div className="heading w-full bg-[#F8F8F8] py-4 px-4 md:px-6 flex items-center gap-2 overflow-x-auto">
          <span
            onClick={() => window.history.back()}
            className="text-[#1746A2AB] text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            Back to User list
          </span>
          <span className="text-[#CFD0D4] text-sm">/</span>
          <span className="text-[#1A1A1A] text-sm font-medium whitespace-nowrap">
            {AdminDetails?.name || "user name"}
          </span>
          <span className="text-[#CFD0D4] text-sm">/</span>
        </div>

        <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-4">
          <div className="top flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2 sm:mt-5">
              <div className="w-[76px] relative h-[76px] rounded-full flex items-center justify-center overflow-hidden">
                {AdminDetails?.image ? (
                  <Image
                    src={AdminDetails.image}
                    alt={AdminDetails?.name || "Profile Picture"}
                    width={76}
                    height={76}
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center text-white font-semibold text-lg`}
                    style={{
                      backgroundColor: stringToColor(
                        AdminDetails?.name || "User"
                      ),
                    }}
                  >
                    {getInitials(AdminDetails?.name || "User")}
                  </div>
                )}

                <Image
                  className="absolute bottom-0 left-0"
                  src={"/images/profile-logo.svg"}
                  alt="logo"
                  width={20}
                  height={20}
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[#1A1A1A] font-medium text-[18px] capitalize sm:text-[20px]">
                  {AdminDetails?.name || "user name"}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="flex items-center gap-[2px] font-medium capitalize text-[#0DDC0E] text-sm">
                    <Verified className="w-4 h-4" />{" "}
                    {AdminDetails?.role || "Admin"} admin
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                    <User2Icon className="w-4 h-4" />
                    Contact:{" "}
                    <span className="text-[#121217] font-semibold">
                      Lagos, Nigeria |{" "}
                      {AdminDetails?.email || "admin@scalepadi.com "} |{" "}
                      {AdminDetails?.phone || "+234 789012345"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
              <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                <Calendar className="w-4 h-4" />
                Joined Date:{" "}
                <span className="text-[#121217]">
                  {new Date(AdminDetails?.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  ) || "May 25, 2025"}{" "}
                  | {adminApprovedUsers?.totalItems} Accounts Reviewed |
                </span>
              </span>
              <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                <House className="w-4 h-4" />
                Activity status:{" "}
                <span className="text-[#121217] capitalize">
                  {AdminDetails?.status}
                </span>
              </span>
            </div>
            <div className="flex flex-wrap items-center mt-3 sm:mt-5 gap-3">
              <Button
                onClick={() => router.push(`/messages`)}
                className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="ml-2">Chat</span>
              </Button>
              <Button
                onClick={() => router.push(`/users`)}
                variant={"outline"}
                className="rounded-[14px] text-sm"
              >
                Assign new Role
              </Button>
            </div>
          </div>
          {/* <div className="flex items-center justify-end gap-3 w-full md:w-auto">
            <Button
              variant={"outline"}
              className="rounded-[14px] hover:bg-primary-hover hover:text-black"
            >
              Suspend
            </Button>
          </div> */}
        </div>

        <div className="flex flex-col bg-white rounded-2xl my-5 py-2 overflow-x-auto">
          <div>
            <div className="tab pt-2 w-full border-b flex items-center gap-5">
              <div
                className={`flex cursor-pointer px-4 md:px-6 items-center justify-center border-b-2 pb-2
                                hover:border-[#3A96E8] transition-colors 
                                ${
                                  activeTab === "task"
                                    ? "border-[#3A96E8] text-black"
                                    : "border-transparent"
                                }`}
                onClick={() => setActiveTab("task")}
              >
                <span className="text-sm">Task</span>
              </div>
            </div>
          </div>

          {activeTab === "task" && (
            <div className="flex flex-col gap-6">
              <div className="w-full p-4 md:p-6 bg-white">
                {/* Header */}
                <p className="text-xs font-medium text-[#878A93] mb-6">
                  A table view of all signups reviewed by this admin
                </p>

                {/* Controls */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                      defaultValue="all-projects"
                    >
                      <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-projects">
                          All Business
                        </SelectItem>
                        <SelectItem value="in-progress">In-Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={sortOption}
                      onValueChange={setSortOption}
                      defaultValue="sort"
                    >
                      <SelectTrigger className="w-[80px] h-9 text-sm border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sort">Sort</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="relative w-full sm:w-[200px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by project"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1); // Reset to first page when searching
                        }}
                        className="pl-10 w-full h-9 text-sm border-gray-300"
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm border-gray-300 bg-transparent w-full md:w-auto"
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
                        <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                          Expert name
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                          Role
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                          No of Projects
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                          Status
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                          Date Joined
                        </TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminApprovedUsers?.data?.length > 0 ? (
                        adminApprovedUsers.data.map((user: any) => (
                          <TableRow
                            onClick={() => router.push(`/experts/${user.id}`)}
                            key={user.id}
                            className="border-b border-gray-100 cursor-pointer hover:bg-gray-50/50"
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                                  {user?.profilePicture ? (
                                    <Image
                                      src={user?.profilePicture}
                                      alt={user.name}
                                      width={32}
                                      height={32}
                                      className="rounded-full object-cover"
                                    />
                                  ) : (
                                    <div
                                      className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                      style={{
                                        backgroundColor: stringToColor(
                                          user?.name
                                        ),
                                      }}
                                    >
                                      {getInitials(user?.name)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-gray-900 text-sm font-medium whitespace-nowrap">
                                    {user?.name}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    {user?.email}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-700 text-sm py-4 whitespace-nowrap">
                              {user.role?.[0] || "Expert"}
                            </TableCell>
                            <TableCell className="text-gray-700 text-sm py-4 whitespace-nowrap">
                              {user.projectCount || 0}
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant={
                                  user.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  user.status === "active"
                                    ? "border border-[#04E762] text-[#04E762] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent whitespace-nowrap"
                                    : "border border-[#F2BB05] text-[#F2BB05] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent whitespace-nowrap"
                                }
                              >
                                {user.status === "active"
                                  ? "Verified"
                                  : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-700 text-sm py-4 whitespace-nowrap">
                              {new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
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
                                  <DropdownMenuItem>View</DropdownMenuItem>
                                  {/* <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Delete
                                  </DropdownMenuItem> */}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="py-8 text-center text-gray-500"
                          >
                            {isLoading
                              ? "Loading users..."
                              : "This Admin has not reviewed any user accounts yet."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      Rows per page
                    </span>
                    <Select
                      value={rowsPerPage.toString()}
                      onValueChange={(value) => {
                        setRowsPerPage(Number(value));
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
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {totalItems === 0
                        ? 0
                        : (currentPageFromApi - 1) * itemsPerPage + 1}
                      -{Math.min(currentPageFromApi * itemsPerPage, totalItems)}{" "}
                      of {totalItems}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleNextPage}
                        disabled={
                          currentPage === totalPages || totalPages === 0
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
