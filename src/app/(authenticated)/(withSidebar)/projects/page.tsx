"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
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
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useGetAllProjects } from "@/hooks/useProjects";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export type Project = {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
  dueDate?: string;
  brief?: string;
  goal?: string;
  resources?: string[];
  proposedTotalCost?: number;
  paymentStatus?: string;
  adminApproved?: boolean;
  requestSupervisor?: boolean;
  businessId?: {
    name: string;
    title?: string;
    email?: string;
    phone?: string;
    verified?: boolean;
    status?: string;
    id: string;
  };
  experts?: [];
};

// type ProjectResponse = {
//   status: boolean;
//   message: string;
//   data?: {
//     currentPage: number;
//     totalPages: number;
//     itemsPerPage: number;
//     totalItems: number;
//     data: Project[];
//   };
// };

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all-projects");
  const [sortFilter, setSortFilter] = useState("sort");
  const [dateFilter, setDateFilter] = useState("");

  const router = useRouter();
  const { projectList, isLoading } = useGetAllProjects();

  // Process and filter data
  const processedData = useMemo(() => {
    if (!projectList?.data) return [];

    let data = projectList.data.data || [];

    // Apply search filter
    if (searchTerm) {
      data = data.filter((project: Project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all-projects") {
      data = data.filter((project: Project) => project.status === statusFilter);
    }

    // Apply sorting
    if (sortFilter === "name") {
      data.sort((a: Project, b: Project) => a.title.localeCompare(b.title));
    } else if (sortFilter === "date") {
      data.sort(
        (a: Project, b: Project) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      data = data.filter(
        (project: Project) =>
          (project.dueDate && new Date(project.dueDate).toDateString() === filterDate) ||
          new Date(project.createdAt).toDateString() === filterDate
      );
    }

    return data;
  }, [projectList, searchTerm, statusFilter, sortFilter, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / parseInt(rowsPerPage));
  const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
  const paginatedData = processedData.slice(
    startIndex,
    startIndex + parseInt(rowsPerPage)
  );

  // Count statuses for the summary cards
  const statusCounts = useMemo(() => {
    if (!projectList?.data?.data) return { pending: 0, "in-progress": 0, completed: 0 };

    const data = projectList.data.data;
    return {
      pending: data.filter((project: Project) => project.status === "pending").length,
      "in-progress": data.filter((project: Project) => project.status === "in-progress").length,
      completed: data.filter((project: Project) => project.status === "completed").length,
    };
  }, [projectList]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortFilter, dateFilter, rowsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return <TableSkeleton 
      columns={6} 
      rows={5} 
      headers={["Project name", "Business", "Experts", "Status", "Due Date", "Action"]}
    />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end w-full justify-between gap-6">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-sm text-[#878A93] font-medium">
            Total Projects:{" "}
            <span className="text-[#3E4351]">{projectList?.data?.totalItems || 0}</span>
          </span>
          <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex flex-col sm:flex-row gap-6 p-4">
            <div className="border-b sm:border-b-0 sm:border-r w-full flex flex-col gap-4 border-[#EFF2F3] pb-4 sm:pb-0">
              <span className="text-2xl font-bold text-[#0E1426]">{statusCounts.pending}</span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary-hover">
                Pending
              </span>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r w-full flex flex-col gap-4 border-[#EFF2F3] pb-4 sm:pb-0">
              <span className="text-2xl font-bold text-[#0E1426]">{statusCounts["in-progress"]}</span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary">
                In-Progress
              </span>
            </div>
            <div className="w-full flex flex-col gap-4">
              <span className="text-2xl font-bold text-[#0E1426]">{statusCounts.completed}</span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">
                Completed
              </span>
            </div>
          </div>
        </div>
        <div className="w-full"></div>
        <Button className="hover:bg-primary-hover hover:text-black w-full md:w-auto">
          Start a new project
        </Button>
      </div>

      <div className="w-full p-3 md:p-6 bg-white overflow-x-auto">
        {/* Header */}
        <h1 className="text-xl md:text-2xl font-medium text-[#878A93] mb-6">
          Project List
        </h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-projects">All projects</SelectItem>
                <SelectItem value="in-progress">In-Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortFilter} onValueChange={setSortFilter}>
              <SelectTrigger className="w-full sm:w-[100px] h-9 text-sm border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sort">Sort</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by project"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-[200px] h-9 text-sm border-gray-300"
              />
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-[140px] h-9 text-sm border-gray-300"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Project name
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Business
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Experts
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
              {paginatedData.length > 0 ? (
                paginatedData.map((project: Project) => (
                  <TableRow
                    onClick={() => router.push(`/projects/${project.id}`)}
                    key={project.id}
                    className="border-b border-gray-100 cursor-pointer hover:bg-gray-50/50"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                          <FolderOpen
                            className={
                              project.status === "completed"
                                ? "text-[#04E762]"
                                : project.status === "in-progress"
                                ? "text-primary"
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
                      {project.businessId?.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {project.experts && project.experts.length > 0
                        ? `${project.experts.length} assigned`
                        : "No experts"}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="secondary"
                        className={
                          project.status === "completed"
                            ? "border border-[#04E762] text-[#04E762] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent"
                            : project.status === "in-progress"
                            ? "border border-primary text-primary text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent"
                            : "border border-[#F2BB05] text-[#F2BB05] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {project.dueDate
                        ? format(new Date(project.dueDate), "MMM d, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="py-4" onClick={(e: React.MouseEvent<HTMLTableCellElement>) => e.stopPropagation()}>
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
                          <DropdownMenuItem
                            onClick={() => router.push(`/projects/${project.id}`)}
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
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
              <SelectTrigger className="w-16 h-8 text-sm border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {processedData.length > 0
                ? `${startIndex + 1}-${Math.min(
                    startIndex + parseInt(rowsPerPage),
                    processedData.length
                  )} of ${processedData.length}`
                : "0 of 0"}
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
                disabled={currentPage === totalPages || totalPages === 0}
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

export default Projects;