"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  MoreHorizontal,
  Search,
  X,
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
import { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useGetAllProjects } from "@/hooks/useProjects";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import Image from "next/image";
import {
  useGetAllExpert,
  useInviteExperts,
  useSearchExpert,
} from "@/hooks/useExpert";
import { Project } from "@/hooks/useProjects";

export interface SocialLinks {
  linkedin?: string;
  website?: string;
  github?: string;
  twitter?: string;
}

export interface Expert {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  bio?: string;
  gender?: string;
  country?: string;
  state?: string;
  availability?: "full-time" | "part-time" | "contract" | string;
  category?: "expert" | string;
  role: string[];
  skills: string[];
  preferredIndustry: string[];
  yearsOfExperience?: string;
  profilePicture?: string;
  socialLinks: SocialLinks;
  regPercentage: number;
  projectCount: number;
  taskCount: number;
  verified: boolean;
  terms: boolean;
  status: "active" | "inactive" | string;
  identification?: string | null;
  lastLogin?: string;
  createdAt?: string;
}

const ExpertTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-3 border rounded-lg animate-pulse"
        >
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
};

const ExpertSelectionRow = ({
  expert,
  isSelected,
  isAlreadyAssigned,
  onSelect,
}: {
  expert: Expert;
  isSelected: boolean;
  isAlreadyAssigned: boolean;
  onSelect: (expertId: string) => void;
}) => {
  return (
    <tr
      className={`border-b hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50 border-blue-200" : "border-gray-200"
        } ${isAlreadyAssigned ? "opacity-60" : ""}`}
      onClick={() => !isAlreadyAssigned && onSelect(expert.id)}
    >
      <td className="p-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
            {expert.image ? (
              <Image
                src={expert.image}
                alt={expert.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              expert.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{expert.name}</span>
              <Badge
                variant="secondary"
                className={
                  expert.status === "active"
                    ? "bg-green-100 text-green-800 border-green-200 text-xs capitalize"
                    : "bg-red-100 text-red-800 border-red-200 text-xs capitalize"
                }
              >
                {expert.status}
              </Badge>
              {isAlreadyAssigned && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs"
                >
                  Already Assigned
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{expert.email}</p>
          </div>
        </div>
      </td>
      <td className="p-3">
        {expert.role && expert.role.length > 0 ? (
          <span className="text-sm text-gray-700">
            {expert.role.join(", ")}
          </span>
        ) : (
          <span className="text-sm text-gray-400">No role</span>
        )}
      </td>
      <td className="p-3">
        {expert.skills && expert.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {expert.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
            {expert.skills.length > 3 && (
              <span className="text-xs text-gray-500">
                +{expert.skills.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400">No skills</span>
        )}
      </td>
      <td className="p-3 text-right">
        <Button
          size="sm"
          variant={
            isSelected ? "default" : isAlreadyAssigned ? "ghost" : "outline"
          }
          disabled={isAlreadyAssigned}
          className="min-w-[100px]"
          onClick={(e) => {
            e.stopPropagation();
            if (!isAlreadyAssigned) {
              onSelect(expert.id);
            }
          }}
        >
          {isAlreadyAssigned
            ? "Already Assigned"
            : isSelected
              ? "Selected"
              : "Select"}
        </Button>
      </td>
    </tr>
  );
};

const AssignExpertModal = ({
  isOpen,
  onClose,
  project,
  experts,
  isLoadingExperts,
  onAssignExpert,
  isAssigning,
  currentPage,
  totalPages,
  onPageChange,
  expertSearchTerm,
  onExpertSearchChange,
  expertStatusFilter,
  onExpertStatusChange,
  expertVerifiedFilter,
  onExpertVerifiedChange,
  selectedExpertIds,
  onExpertSelectionChange,
  assignedExpertIds = [], // New prop to track already assigned experts
}: {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  experts: Expert[] | undefined; // Changed to allow undefined
  isLoadingExperts: boolean;
  onAssignExpert: (expertIds: string[]) => void;
  isAssigning: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  expertSearchTerm: string;
  onExpertSearchChange: (term: string) => void;
  expertStatusFilter: string;
  onExpertStatusChange: (status: string) => void;
  expertVerifiedFilter: string;
  onExpertVerifiedChange: (verified: string) => void;
  selectedExpertIds: string[];
  onExpertSelectionChange: (expertIds: string[]) => void;
  assignedExpertIds?: string[]; // Array of expert IDs already assigned to the project
}) => {
  // Ensure experts is always an array
  const safeExperts = useMemo(
    () => (Array.isArray(experts) ? experts : []),
    [experts]
  );

  const handleExpertSelect = useCallback(
    (expertId: string) => {
      // Don't allow selection of already assigned experts
      if (assignedExpertIds.includes(expertId)) return;

      const newSelectedExpertIds = selectedExpertIds.includes(expertId)
        ? selectedExpertIds.filter((id) => id !== expertId)
        : [...selectedExpertIds, expertId];

      onExpertSelectionChange(newSelectedExpertIds);
    },
    [selectedExpertIds, assignedExpertIds, onExpertSelectionChange]
  );

  const handleSelectAll = useCallback(() => {
    // Only select experts that are not already assigned
    const selectableExperts = safeExperts.filter(
      (expert) => !assignedExpertIds.includes(expert.id)
    );

    if (selectedExpertIds.length === selectableExperts.length) {
      onExpertSelectionChange([]);
    } else {
      onExpertSelectionChange(selectableExperts.map((expert) => expert.id));
    }
  }, [
    safeExperts,
    assignedExpertIds,
    selectedExpertIds,
    onExpertSelectionChange,
  ]);

  const handleAssign = () => {
    if (selectedExpertIds.length > 0) {
      onAssignExpert(selectedExpertIds);
    }
  };

  const handleExpertPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  // Filter out already assigned experts from selectable count
  const selectableExperts = safeExperts.filter(
    (expert) => !assignedExpertIds.includes(expert.id)
  );
  const allSelectableSelected =
    selectableExperts.length > 0 &&
    selectedExpertIds.length === selectableExperts.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Assign Experts to Project
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Project Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">
              Project Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Project Name:
                </span>
                <p className="text-sm text-gray-900 mt-1">
                  {project?.title || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Business:
                </span>
                <p className="text-sm text-gray-900 mt-1">
                  {project?.businessId?.name || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Status:
                </span>
                <p className="text-sm text-gray-900 mt-1 capitalize">
                  {project?.status || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Due Date:
                </span>
                <p className="text-sm text-gray-900 mt-1">
                  {project?.dueDate
                    ? format(new Date(project.dueDate), "MMM d, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Expert Selection */}
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Select Experts
                  </h3>
                  {safeExperts.length > 0 && selectableExperts.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="h-8 text-xs"
                    >
                      {allSelectableSelected ? "Deselect All" : "Select All"}
                    </Button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Select value={expertStatusFilter} onValueChange={onExpertStatusChange}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={expertVerifiedFilter} onValueChange={onExpertVerifiedChange}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Verified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Verified</SelectItem>
                      <SelectItem value="false">Unverified</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search experts..."
                      value={expertSearchTerm}
                      onChange={(e) => onExpertSearchChange(e.target.value)}
                      className="pl-10 w-full h-9 text-sm border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Summary */}
            <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600">
              {selectedExpertIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <span className="font-medium text-blue-800">
                    {selectedExpertIds.length}
                  </span>
                  {selectedExpertIds.length === 1 ? " expert" : " experts"}{" "}
                  selected for assignment
                </div>
              )}
              {assignedExpertIds.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  <span className="font-medium text-yellow-800">
                    {assignedExpertIds.length}
                  </span>
                  {assignedExpertIds.length === 1 ? " expert" : " experts"}{" "}
                  already assigned
                </div>
              )}
            </div>

            {isLoadingExperts ? (
              <ExpertTableSkeleton rows={5} />
            ) : safeExperts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm">No experts found</p>
                {(expertSearchTerm || expertStatusFilter !== "all" || expertVerifiedFilter !== "all") && (
                  <p className="text-xs text-gray-400 mt-1">
                    Try adjusting your filters
                  </p>
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">
                        Expert
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">
                        Role
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">
                        Skills
                      </th>
                      <th className="p-3 text-right text-sm font-medium text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeExperts.map((expert) => (
                      <ExpertSelectionRow
                        key={expert.id}
                        expert={expert}
                        isSelected={selectedExpertIds.includes(expert.id)}
                        isAlreadyAssigned={assignedExpertIds.includes(
                          expert.id
                        )}
                        onSelect={handleExpertSelect}
                      />
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleExpertPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleExpertPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedExpertIds.length > 0 ? (
              <span>
                {selectedExpertIds.length}{" "}
                {selectedExpertIds.length === 1 ? "expert" : "experts"} ready
                for assignment
                {assignedExpertIds.length > 0 &&
                  ` (${assignedExpertIds.length} already assigned)`}
              </span>
            ) : (
              <span>
                No experts selected
                {assignedExpertIds.length > 0 &&
                  ` (${assignedExpertIds.length} already assigned)`}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isAssigning}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={selectedExpertIds.length === 0 || isAssigning}
              className="min-w-[120px]"
            >
              {isAssigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assigning...
                </>
              ) : (
                `Assign ${selectedExpertIds.length > 0
                  ? `(${selectedExpertIds.length})`
                  : ""
                }`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("createdAt");
  const [dateFilter, setDateFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const [expertCurrentPage, setExpertCurrentPage] = useState(1);
  const [expertSearchTerm, setExpertSearchTerm] = useState("");
  const [expertStatusFilter, setExpertStatusFilter] = useState("all");
  const [expertVerifiedFilter, setExpertVerifiedFilter] = useState("all");
  const [selectedExpertIds, setSelectedExpertIds] = useState<string[]>([]);

  const router = useRouter();
  const { projectList, isLoading } = useGetAllProjects(
    currentPage,
    parseInt(rowsPerPage),
    statusFilter,
    sortFilter,
    searchTerm
  );

  // Separate fetches for stats to ensure accurate totals across all pages
  const { projectList: pendingProjectsList } = useGetAllProjects(1, 1, "pending");
  const { projectList: inProgressProjectsList } = useGetAllProjects(1, 1, "in-progress");
  const { projectList: completedProjectsList } = useGetAllProjects(1, 1, "completed");
  const { projectList: totalProjectsList } = useGetAllProjects(1, 1, "all");

  const { expertList: expertsToDisplay, isLoading: isLoadingExpertsToDisplay } = useGetAllExpert(
    expertCurrentPage,
    10,
    expertStatusFilter,
    expertSearchTerm,
    "", // role
    "", // skill
    expertVerifiedFilter !== "all" ? (expertVerifiedFilter === "true") : undefined
  );

  const { mutate: inviteExperts } = useInviteExperts();

  const processedData = useMemo(() => {
    if (!projectList?.data) return [];

    let data = projectList.data || [];

    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      data = data?.filter(
        (project) =>
          (project.dueDate &&
            new Date(project.dueDate).toDateString() === filterDate) ||
          new Date(project.createdAt).toDateString() === filterDate
      );
    }

    return data;
  }, [projectList, dateFilter]);


  const statusCounts = useMemo(() => {
    return {
      pending: pendingProjectsList?.totalItems || 0,
      "in-progress": inProgressProjectsList?.totalItems || 0,
      completed: completedProjectsList?.totalItems || 0,
      total: totalProjectsList?.totalItems || 0,
    };
  }, [pendingProjectsList, inProgressProjectsList, completedProjectsList, totalProjectsList]);

  const assignedExpertIds = useMemo(() => {
    return selectedProject?.experts?.map((expert) => expert.id.id) || [];
  }, [selectedProject]);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortFilter, dateFilter, rowsPerPage]);

  useEffect(() => {
    if (isModalOpen) {
      setExpertCurrentPage(1);
      setExpertSearchTerm("");
      setExpertStatusFilter("all");
      setExpertVerifiedFilter("all");
      setSelectedExpertIds([]);
    }
  }, [isModalOpen]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= (projectList?.totalPages || 1)) {
        setCurrentPage(newPage);
      }
    },
    [projectList?.totalPages]
  );

  const handleAssignExpert = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setIsAssigning(false);
    setSelectedExpertIds([]);
    setExpertSearchTerm("");
    setExpertStatusFilter("all");
    setExpertVerifiedFilter("all");
  }, []);

  const handleAssignProject = useCallback(
    async (expertIds: string[]) => {
      if (!selectedProject) return;

      setIsAssigning(true);
      try {
        inviteExperts({
          projectId: selectedProject.id,
          expertIds,
        });

        handleCloseModal();
      } catch (error) {
        console.error("Failed to assign experts:", error);
      } finally {
        setIsAssigning(false);
      }
    },
    [selectedProject, inviteExperts, handleCloseModal]
  );

  const handleExpertPageChange = useCallback((newPage: number) => {
    setExpertCurrentPage(newPage);
  }, []);

  const handleExpertSelectionChange = useCallback((expertIds: string[]) => {
    setSelectedExpertIds(expertIds);
  }, []);

  const handleExpertSearchChange = useCallback((term: string) => {
    setExpertSearchTerm(term);
    setExpertCurrentPage(1);
  }, []);

  const handleExpertStatusChange = useCallback((status: string) => {
    setExpertStatusFilter(status);
    setExpertCurrentPage(1);
  }, []);

  const handleExpertVerifiedChange = useCallback((verified: string) => {
    setExpertVerifiedFilter(verified);
    setExpertCurrentPage(1);
  }, []);

  if (isLoading) {
    return (
      <TableSkeleton
        columns={8}
        rows={10}
        headers={[
          "Project name",
          "Business",
          "Experts",
          "Status",
          "Due Date",
          "Action",
        ]}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AssignExpertModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
        experts={expertsToDisplay?.data?.data || []}
        isLoadingExperts={isLoadingExpertsToDisplay}
        onAssignExpert={handleAssignProject}
        isAssigning={isAssigning}
        currentPage={expertCurrentPage}
        totalPages={expertsToDisplay?.data?.totalPages || 1}
        onPageChange={handleExpertPageChange}
        expertSearchTerm={expertSearchTerm}
        onExpertSearchChange={handleExpertSearchChange}
        expertStatusFilter={expertStatusFilter}
        onExpertStatusChange={handleExpertStatusChange}
        expertVerifiedFilter={expertVerifiedFilter}
        onExpertVerifiedChange={handleExpertVerifiedChange}
        selectedExpertIds={selectedExpertIds}
        onExpertSelectionChange={handleExpertSelectionChange}
        assignedExpertIds={assignedExpertIds}
      />

      <div className="flex flex-col md:flex-row md:items-end w-full justify-between gap-6">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-sm text-[#878A93] font-medium">
            Total Projects:{" "}
            <span className="text-[#3E4351]">{statusCounts.total || 0}</span>
          </span>

          <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl grid md:grid-cols-4 w-full max-w-[600px] gap-4 p-4">
            <div className="border-b sm:border-b-0 sm:border-r w-full flex flex-col gap-2 border-[#EFF2F3] pb-4 sm:pb-0">
              <span className="text-2xl font-bold text-[#0E1426]">
                {statusCounts.total}
              </span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-gray-400">
                Total
              </span>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r w-full flex flex-col gap-2 border-[#EFF2F3] pb-4 sm:pb-0">
              <span className="text-2xl font-bold text-[#0E1426]">
                {statusCounts.pending}
              </span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#F2BB05]">
                Pending
              </span>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r w-full flex flex-col gap-2 border-[#EFF2F3] pb-4 sm:pb-0">
              <span className="text-2xl font-bold text-[#0E1426]">
                {statusCounts["in-progress"]}
              </span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary">
                In-Progress
              </span>
            </div>
            <div className="w-full flex flex-col gap-2">
              <span className="text-2xl font-bold text-[#0E1426]">
                {statusCounts.completed}
              </span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">
                Completed
              </span>
            </div>
          </div>
        </div>
        {/* <Button className="hover:bg-primary-hover hover:text-black w-full md:w-auto">
          Start a new project
        </Button> */}
      </div>

      <div className="w-full bg-white overflow-x-auto p-6 rounded-lg border border-gray-200 my-4 md:my-6">
        {/* Header */}
        <h1 className="text-xl md:text-2xl font-medium text-[#878A93] mb-6">
          Project List
        </h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm border-gray-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                <SelectItem value="in-progress">In-Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortFilter} onValueChange={setSortFilter}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="title">Name</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
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
              placeholder="Filter by date"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden">
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
              {processedData.length > 0 ? (
                processedData.map((project) => (
                  <TableRow
                    onClick={() => router.push(`/projects/${project.id}`)}
                    key={project.id}
                    className="border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 truncate"
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
                    <TableCell className="py-4 capitalize">
                      <Badge
                        variant="secondary"
                        className={`${project.status === "completed"
                          ? "border border-[#04E762] text-[#04E762]"
                          : project.status === "in-progress"
                            ? "border border-primary text-primary"
                            : "border border-[#F2BB05] text-[#F2BB05]"
                          } text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent w-[80px] sm:w-[80px] md:w-[80px] truncate text-center flex justify-center`}
                      >
                        {project.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {project.dueDate
                        ? format(new Date(project.dueDate), "MMM d, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      className="py-4"
                      onClick={(e: React.MouseEvent<HTMLTableCellElement>) =>
                        e.stopPropagation()
                      }
                    >
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
                            onClick={() =>
                              router.push(`/projects/${project.id}`)
                            }
                          >
                            View
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}
                          <DropdownMenuItem
                            onClick={() => handleAssignExpert(project)}
                          >
                            Assign Expert
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem className="text-red-600">
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
              {projectList
                ? `Page ${projectList.currentPage} of ${projectList.totalPages}`
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
                disabled={currentPage === (projectList?.totalPages || 1)}
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
