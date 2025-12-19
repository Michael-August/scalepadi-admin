"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import {
  Calendar,
  Dot,
  House,
  Info,
  Link as LinkIcon,
  MessageCircle,
  Star,
  Verified,
  FolderOpen,
  User,
  X,
  FileText,
} from "lucide-react";
import { useState } from "react";
import CircularProgress from "@/components/circular-progress";
import { useParams, useRouter } from "next/navigation";
import { ProjectSkeleton } from "@/components/ui/project-skeleton";
import {
  useApproveExpert,
  useGetExpertAccountDetails,
  useGetExpertById,
  useGetExpertPerformance,
  useInviteExperts,
} from "@/hooks/useExpert";
import { useGetAllProjects } from "@/hooks/useProjects";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import react-pdf components with no SSR
const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading PDF viewer...</span>
    </div>
  ),
});

export interface ExpertDetails {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  category: string;
  phone: string;
  gender: string;
  verified: boolean;
  role: string[];
  preferredIndustry: string[];
  skills: string[];
  bio: string;
  availability: "available" | "not available";
  projectCount: number;
  taskCount: number;
  regPercentage: number;
  terms: boolean;
  lastLogin: string;
  createdAt: string;
  country: string;
  state: string;
  socialLinks: {
    twitter: string;
    github: string;
    linkedin: string;
    website: string;
  };
  expert: {
    id: string;
    github: string;
    linkedin: string;
    website: string;
  };
}

const ExpertDetails = () => {
  const [showResumePdfPreview, setShowResumePdfPreview] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "about" | "documents" | "performance" | "account"
  >("about");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [assigningProjects, setAssigningProjects] = useState<Set<string>>(
    new Set()
  );

  const params = useParams();
  const expertId = params.expertId as string;
  const { expertPerformance, isLoading } = useGetExpertPerformance(expertId);
  const { expertAccountDetails } = useGetExpertAccountDetails(expertId);

  const { expertDetails } = useGetExpertById(expertId);
  const [page, setPage] = useState(1);

  const { projectList, isLoading: projectsLoading } = useGetAllProjects(
    page,
    10,
    "all",
    "createdAt",
    projectSearchTerm
  );

  const handlePageChange = (newPage: number) => {
    if (!projectList?.totalPages) return;
    if (newPage < 1 || newPage > projectList.totalPages) return;
    setPage(newPage);
  };

  const { mutate: inviteExperts } = useInviteExperts();
  const { mutate: approveExpert, isPending } = useApproveExpert(expertId);

  const handleApprove = () => {
    approveExpert();
  };

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (!expertDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500">Expert not found</p>
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

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-[#EDEEF3] pb-4">
        <div className="heading w-full bg-[#F8F8F8] py-4 px-4 md:px-6 flex items-center gap-2 overflow-x-auto">
          <span
            onClick={() => window.history.back()}
            className="text-[#1746A2AB] text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            Back to Experts list
          </span>
          <span className="text-[#CFD0D4] text-sm">/</span>
          <span className="text-[#1A1A1A] text-sm font-medium whitespace-nowrap">
            {expertDetails.name}
          </span>
          <span className="text-[#CFD0D4] text-sm">/</span>
        </div>

        <div className="flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4">
          <div className="top flex flex-col gap-4 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-5">
              <div className="w-[76px] relative h-[76px] rounded-full">
                <Image
                  src={
                    expertDetails?.profilePicture || "/images/profile-pic.svg"
                  }
                  alt="Profile Picture"
                  width={76}
                  height={76}
                  className="rounded-full w-full h-full"
                />
                <Image
                  className="absolute bottom-0 left-0"
                  src={"/images/profile-logo.svg"}
                  alt="logo"
                  width={20}
                  height={20}
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[#1A1A1A] font-medium text-lg sm:text-[20px]">
                  {expertDetails.name}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center font-medium text-sm">
                    {expertDetails.verified ? (
                      <>
                        <Verified className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-red-500 mt-0.5" />
                        <span className="text-red-500">
                          Pending Verification
                        </span>
                      </>
                    )}
                  </span>

                  <span className="text-[#878A93] text-sm font-medium capitalize">
                    {expertDetails.category}
                  </span>
                </div>
              </div>
            </div>
            <div className="items-center gap-2 flex flex-wrap">
              <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                <Calendar className="w-4 h-4" />
                Joined Date:{" "}
                <span className="text-[#121217]">
                  {formatDate(expertDetails.createdAt)}
                </span>
              </span>
              <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                <Star className="w-4 h-4 text-[#F2BB05] fill-[#F6CF50]" />
                {expertPerformance?.data?.averageScore > 0
                  ? expertPerformance.data.averageScore.toFixed(1)
                  : "0.0"}{" "}
                / 5 average rating | {expertDetails.projectCount}: Projects
                completed
              </span>
              <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                <House className="w-4 h-4" />
                Activity status:{" "}
                <span className="text-[#121217] capitalize">
                  {expertDetails.status}
                </span>
              </span>
            </div>
            <div className="flex items-center mt-5 gap-3">
              <Link href={`/messages?userId=${expertId}&role=Expert`}>
                <Button
                  className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </Link>

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="rounded-[14px] text-sm"
                  >
                    <span>Assign to project</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[95vw] max-w-6xl overflow-y-auto max-h-screen">
                  <SheetHeader className="mb-4">
                    <SheetTitle className="text-xl font-semibold">
                      Assign Expert to Project
                    </SheetTitle>
                    <SheetDescription className="text-gray-600">
                      Select a project from the list below to assign{" "}
                      {expertDetails.name || "this expert"}.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="relative w-full my-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search projects"
                      value={projectSearchTerm}
                      onChange={(e) => setProjectSearchTerm(e.target.value)}
                      className="pl-10 w-full h-10 text-sm border-gray-300 outline-none rounded-lg"
                    />
                  </div>

                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="text-gray-600 truncate font-medium text-sm py-4">
                            Project Name
                          </TableHead>
                          <TableHead className="text-gray-600 truncate font-medium text-sm py-4">
                            Business Name
                          </TableHead>
                          <TableHead className="text-gray-600 truncate font-medium text-sm py-4">
                            Assigned Experts
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium text-sm py-4">
                            Status
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium text-sm py-4 text-right">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {projectsLoading ? (
                          [...Array(5)].map((_, i) => (
                            <TableRow
                              key={`skeleton-${i}`}
                              className="hover:bg-gray-50/50"
                            >
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex -space-x-2">
                                  {[...Array(3)].map((_, j) => (
                                    <div
                                      key={`skeleton-exp-${i}-${j}`}
                                      className="h-6 w-6 rounded-full bg-gray-200 animate-pulse"
                                    />
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                              </TableCell>
                              <TableCell className="py-4 text-right">
                                <div className="h-9 w-20 bg-gray-200 rounded-md animate-pulse ml-auto" />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : projectList?.data && projectList.data.length > 0 ? (
                          projectList.data.map((project, projectIndex) => {
                            const statusColor =
                              project.status === "completed"
                                ? "text-green-600"
                                : project.status === "in-progress"
                                  ? "text-blue-600"
                                  : "text-amber-600";

                            const badgeColor =
                              project.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : project.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800";

                            return (
                              <TableRow
                                key={project?.id || `project-${projectIndex}`}
                                className="hover:bg-gray-50/50"
                              >
                                <TableCell className="py-4 text-gray-700 text-sm truncate">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                      <FolderOpen
                                        className={`w-4 h-4 ${statusColor}`}
                                      />
                                    </div>
                                    <span>{project?.title || "N/A"}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 text-gray-700 text-sm truncate">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                      <User
                                        className={`h-3 w-3 ${statusColor}`}
                                      />
                                    </div>
                                    <span>
                                      {project?.businessId?.name || "N/A"}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex -space-x-2">
                                    {project?.experts
                                      ?.slice(0, 3)
                                      .map((exp, expIndex) => (
                                        <div
                                          key={
                                            exp?.id?.id ||
                                            `${project?.id || "proj"
                                            }-exp-${expIndex}`
                                          }
                                          className="relative h-7 w-7 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center"
                                        >
                                          {exp?.image ? (
                                            <Image
                                              src={exp?.image}
                                              alt={exp?.name || "Expert"}
                                              fill
                                              className="object-cover"
                                            />
                                          ) : (
                                            <User
                                              className={`h-4 w-4 ${statusColor}`}
                                            />
                                          )}
                                        </div>
                                      ))}
                                    {project?.experts &&
                                      project.experts.length > 3 && (
                                        <div className="relative h-7 w-7 rounded-full overflow-hidden border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium">
                                          +{project.experts.length - 3}
                                        </div>
                                      )}
                                    {(!project?.experts ||
                                      project.experts.length === 0) && (
                                        <span className="text-xs text-gray-500">
                                          None
                                        </span>
                                      )}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize w-[90px] sm:w-[100px] md:w-[80px] truncate text-center flex justify-center ${badgeColor}`}
                                  >
                                    {project?.status?.replace("-", " ") ||
                                      "unknown"}
                                  </span>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div>
                                          <Button
                                            onClick={() => {
                                              setAssigningProjects((prev) =>
                                                new Set(prev).add(project?.id)
                                              );
                                              inviteExperts(
                                                {
                                                  projectId: project?.id,
                                                  expertIds: [expertId],
                                                },
                                                {
                                                  onSuccess: () => {
                                                    setAssigningProjects(
                                                      (prev) => {
                                                        const newSet = new Set(
                                                          prev
                                                        );
                                                        newSet.delete(
                                                          project?.id
                                                        );
                                                        return newSet;
                                                      }
                                                    );
                                                  },
                                                  onError: () => {
                                                    setAssigningProjects(
                                                      (prev) => {
                                                        const newSet = new Set(
                                                          prev
                                                        );
                                                        newSet.delete(
                                                          project?.id
                                                        );
                                                        return newSet;
                                                      }
                                                    );
                                                  },
                                                }
                                              );
                                            }}
                                            size="sm"
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 ml-auto w-[90px] sm:w-[100px] md:w-[80px]"
                                            disabled={
                                              project?.experts?.some(
                                                (expert) =>
                                                  expert?.id?.id === expertId
                                              ) ||
                                              assigningProjects?.has(
                                                project?.id
                                              )
                                            }
                                          >
                                            {project?.experts?.some(
                                              (expert) =>
                                                expert?.id?.id === expertId
                                            )
                                              ? "Assigned"
                                              : assigningProjects.has(
                                                project?.id
                                              )
                                                ? "Assigning..."
                                                : "Assign"}
                                          </Button>
                                        </div>
                                      </TooltipTrigger>

                                      {project?.experts?.some(
                                        (expert) => expert?.id?.id === expertId
                                      ) && (
                                          <TooltipContent>
                                            <p>
                                              This expert is already assigned to
                                              this project.
                                            </p>
                                          </TooltipContent>
                                        )}
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-12 text-gray-500"
                            >
                              <div className="flex flex-col items-center justify-center gap-2">
                                <FolderOpen className="h-10 w-10 text-gray-300" />
                                <p>No projects found</p>
                                {projectSearchTerm && (
                                  <p className="text-sm">
                                    Try adjusting your search term
                                  </p>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                      {projectList && projectList.totalPages > 1 && (
                        <div className="flex flex-col w-full sm:flex-row items-center justify-between gap-3 px-4 py-2 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                          {/* <p className="text-xs sm:text-sm text-gray-500">
      Showing{" "}
      <span className="font-medium text-gray-700">
        {(projectList.currentPage - 1) * projectList.itemsPerPage + 1}–
        {Math.min(
          projectList.currentPage * projectList.itemsPerPage,
          projectList.totalItems
        )}
      </span>{" "}
      of{" "}
      <span className="font-medium text-gray-700">
        {projectList.totalItems}
      </span>
    </p> */}

                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs sm:text-sm text-gray-600 hover:text-gray-800"
                              disabled={
                                projectsLoading || projectList.currentPage === 1
                              }
                              onClick={() =>
                                handlePageChange(projectList.currentPage - 1)
                              }
                            >
                              ← Prev
                            </Button>

                            <div className="flex items-center bg-white border border-gray-200 rounded-md px-3 py-1 text-xs sm:text-sm font-medium text-gray-700">
                              Page {projectList.currentPage}
                              <span className="text-gray-400">
                                &nbsp;/&nbsp;
                              </span>
                              {projectList.totalPages}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs sm:text-sm text-gray-600 hover:text-gray-800"
                              disabled={
                                projectsLoading ||
                                projectList.currentPage ===
                                projectList.totalPages
                              }
                              onClick={() =>
                                handlePageChange(projectList.currentPage + 1)
                              }
                            >
                              Next →
                            </Button>
                          </div>
                        </div>
                      )}
                    </Table>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 w-full lg:w-auto">
            <Button
              onClick={handleApprove}
              disabled={isPending || expertDetails?.verified}
              variant="outline"
              className={`rounded-[14px] ${expertDetails?.verified
                ? "bg-green-500 text-white cursor-not-allowed"
                : "text-white bg-primary hover:bg-primary-hover hover:text-black"
                }`}
            >
              {expertDetails?.verified
                ? "Verified"
                : isPending
                  ? "Verifying..."
                  : "Verify Expert"}
            </Button>

            {/* <Button
              variant={"outline"}
              className="rounded-[14px] bg-red-500 text-white hover:bg-primary-hover hover:text-black"
            >
              {expertDetails.status === "active" ? "Suspend" : "Activate"}
            </Button> */}
          </div>
        </div>

        <div className="flex flex-col">
          <div>
            <div className="tab pt-2 w-full flex items-center gap-2 sm:gap-5 bg-[#F9FAFB] overflow-x-auto">
              <div
                className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3 min-w-max
                hover:border-[#3A96E8] transition-colors 
                ${activeTab === "about"
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
                ${activeTab === "documents"
                    ? "border-[#3A96E8] text-[#3A96E8]"
                    : "border-transparent"
                  }`}
                onClick={() => setActiveTab("documents")}
              >
                <span className="text-sm">Documents</span>
              </div>

              <div
                className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3 min-w-max
                hover:border-[#3A96E8] transition-colors 
                ${activeTab === "performance"
                    ? "border-[#3A96E8] text-[#3A96E8]"
                    : "border-transparent"
                  }`}
                onClick={() => setActiveTab("performance")}
              >
                <span className="text-sm">Performance</span>
              </div>

              <div
                className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3 min-w-max
                hover:border-[#3A96E8] transition-colors 
                ${activeTab === "account"
                    ? "border-[#3A96E8] text-[#3A96E8]"
                    : "border-transparent"
                  }`}
                onClick={() => setActiveTab("account")}
              >
                <span className="text-sm">Account details</span>
              </div>
            </div>
          </div>

          {activeTab === "about" && (
            <div className="flex flex-col gap-4 my-5">
              <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg sm:text-[20px] text-primary">
                    Bio
                  </span>
                </div>
                <span className="text-[#353D44] text-sm">
                  {expertDetails.bio || "No bio provided yet."}
                </span>
              </div>

              <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg sm:text-[20px] text-primary">
                    Onboarding Status
                  </span>
                  {/* <span className="border border-[#E7E8E9] rounded-[10px] p-2 bg-white cursor-pointer text-[#0E1426] text-sm">
                    Mark Onboarding as complete
                  </span> */}
                </div>

                <div className="p-5 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <CircularProgress
                      percentage={expertDetails.regPercentage}
                    />
                    <div className="flex flex-col gap-3">
                      <span className="text-[#0A1B39] font-medium text-sm">
                        Complete your profile
                      </span>
                      <div className="flex flex-col gap-2">
                        {/* Step 1 */}
                        <div className="flex items-center gap-2">
                          <Image
                            src={
                              expertDetails.regPercentage >= 30
                                ? "/icons/check.svg"
                                : "/icons/payment-failed.svg"
                            }
                            alt="check"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Personal information</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-center gap-2">
                          <Image
                            src={
                              expertDetails.regPercentage >= 70
                                ? "/icons/check.svg"
                                : "/icons/payment-failed.svg"
                            }
                            alt="check"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Professional details</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-center gap-2">
                          <Image
                            src={
                              expertDetails.regPercentage >= 100
                                ? "/icons/check.svg"
                                : "/icons/payment-failed.svg"
                            }
                            alt="check"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Users Profiling</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="text-[#878A93] flex items-center gap-2 text-xs">
                    <Info />
                    {expertDetails.regPercentage >= 100
                      ? "The user has successfully uploaded all the required documents."
                      : "The user needs to complete their profile."}
                    <span className="text-primary cursor-pointer">
                      review upload and verify
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg sm:text-[20px] text-primary">
                    Personal information
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Full Name
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold">
                      {expertDetails.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Email
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold">
                      {expertDetails.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Gender
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold capitalize">
                      {expertDetails.gender || "Not specified"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Phone number
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold">
                      {expertDetails.phone || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Country of residence
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold capitalize">
                      {expertDetails.country || "Not specified"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      State of residence
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold capitalize">
                      {expertDetails.state || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg sm:text-[20px] text-primary">
                    Professional Details
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Years of experience
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold">
                      {expertDetails.yearsOfExperience || "Not specified"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Category
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold capitalize">
                      {expertDetails.category || "Not specified"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Role
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold capitalize">
                      {expertDetails?.role.join(", ") || "Not specified"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-5">
                  <span className="font-medium text-sm text-[#878A93]">
                    Preferred industries
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {expertDetails.preferredIndustry.length > 0 ? (
                      expertDetails.preferredIndustry.map(
                        (industry: string) => (
                          <span
                            key={industry}
                            className="bg-[#F2F7FF] p-2 rounded-[14px] text-xs text-[#1E88E5] capitalize"
                          >
                            {industry}
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-sm text-[#878A93]">
                        No preferred industries specified
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-5">
                  <span className="font-medium text-sm text-[#878A93]">
                    Skills
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {expertDetails.skills.length > 0 ? (
                      expertDetails.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="bg-[#F2F7FF] p-2 rounded-[14px] text-xs text-[#1E88E5] capitalize"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[#878A93]">
                        No skills specified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg sm:text-[20px] text-primary">
                    External links
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center flex-wrap justify-between gap-4">
                  {expertDetails.socialLinks.website && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm text-[#878A93]">
                        Website
                      </span>
                      <span className="flex gap-2 border text-[#878A93] border-[#ABC6FB] bg-white rounded-[14px] p-[10px] items-center">
                        <LinkIcon className="text-[#FFC371] w-4 h-4" />
                        {expertDetails.socialLinks.website}
                      </span>
                    </div>
                  )}
                  {expertDetails.socialLinks.linkedin && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm text-[#878A93]">
                        LinkedIn
                      </span>
                      <span className="flex gap-2 border text-[#878A93] border-[#ABC6FB] bg-white rounded-[14px] p-[10px] items-center">
                        <LinkIcon className="text-[#FFC371] w-4 h-4" />
                        {expertDetails.socialLinks.linkedin}
                      </span>
                    </div>
                  )}
                  {expertDetails.socialLinks.github && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm text-[#878A93]">
                        GitHub
                      </span>
                      <span className="flex gap-2 border text-[#878A93] border-[#ABC6FB] bg-white rounded-[14px] p-[10px] items-center">
                        <LinkIcon className="text-[#FFC371] w-4 h-4" />
                        {expertDetails.socialLinks.github}
                      </span>
                    </div>
                  )}
                  {expertDetails.socialLinks.twitter && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm text-[#878A93]">
                        Twitter
                      </span>
                      <span className="flex gap-2 border text-[#878A93] border-[#ABC6FB] bg-white rounded-[14px] p-[10px] items-center">
                        <LinkIcon className="text-[#FFC371] w-4 h-4" />
                        {expertDetails.socialLinks.twitter}
                      </span>
                    </div>
                  )}
                  {!expertDetails.socialLinks.website &&
                    !expertDetails.socialLinks.linkedin &&
                    !expertDetails.socialLinks.github &&
                    !expertDetails.socialLinks.twitter && (
                      <span className="text-sm text-[#878A93]">
                        No external links provided
                      </span>
                    )}
                </div>
              </div>

              <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg sm:text-[20px] text-primary">
                    Settings
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="flex flex-col gap-4 my-5">
              <div className="flex flex-col gap-4">
                {expertDetails?.resume ? (
                  <div className="portfolio flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg sm:text-[20px] text-primary">
                        Resume
                      </span>
                      <div className="flex gap-2">
                        <a
                          href={expertDetails.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-primary text-white rounded text-sm transition-colors"
                        >
                          Download
                        </a>
                        <button
                          onClick={() =>
                            setShowResumePdfPreview(!showResumePdfPreview)
                          }
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm transition-colors"
                        >
                          {showResumePdfPreview ? "Hide Preview" : "Preview"}
                        </button>
                      </div>
                    </div>
                    {showResumePdfPreview && (
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <PDFViewer
                          fileUrl={expertDetails.resume}
                          type="resume"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <FileText className="w-8 h-8 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">
                        No Resume Uploaded
                      </p>
                      <p className="text-xs text-yellow-600">
                        Upload your resume to complete your profile
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="portfolio flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[20px] text-primary">
                    Identity
                  </span>
                </div>

                {/* Identity Type and ID Image */}
                <div className="flex flex-col gap-4">
                  {/* <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Identity Type
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold">
                      {expertDetails?.identification?.type
                        ? expertDetails.identification.type
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str: string) => str.toUpperCase())
                        : "Not specified"}
                    </span>
                  </div> */}

                  {/* ID Image Display */}
                  {expertDetails?.identification?.idImage && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[#878A93] text-sm font-normal">
                        ID Document
                      </span>

                      <div className="relative w-full h-[100px] sm:h-[100px] md:h-[200px] max-h-[200px]">
                        <Image
                          src={expertDetails.identification.idImage}
                          alt="ID Document"
                          fill
                          className="rounded-lg border border-gray-200 object-contain bg-gray-50"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}

                  {!expertDetails?.identification?.idImage && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[#878A93] text-sm font-normal">
                        ID Document
                      </span>
                      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <div className="text-center">
                          <div className="text-gray-400 text-sm mb-2">
                            No ID document uploaded
                          </div>
                          {/* <div className="text-xs text-gray-500">
                            Upload your ID document to get verified
                          </div> */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="flex flex-col gap-4 my-5">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Performance Stats */}
                <div className="bg-white border flex flex-col border-[#EFF2F3] rounded-3xl p-4 w-full">
                  <div className="flex flex-col gap-2 border-b border-[#EFF2F3] pb-4 mb-4">
                    <span className="text-base text-[#878A93] font-medium">
                      Projects Completed
                    </span>
                    <span className="font-bold text-[32px] text-[#121217]">
                      {expertDetails?.projectCount || 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-base text-[#878A93] font-medium">
                      Average Project Duration
                    </span>
                    <span className="font-bold text-[24px] text-[#121217]">
                      {expertDetails?.projectCount || 0} month(s)
                    </span>
                  </div>
                </div>

                {/* Rating Overview */}
                <div className="bg-white border border-[#EFF2F3] flex flex-col lg:flex-row gap-6 rounded-3xl p-4 flex-1">
                  <div className="flex flex-col lg:gap-5 lg:mt-4">
                    <span className="font-bold text-4xl lg:text-[84px] text-[#0E1426]">
                      {expertPerformance?.data?.averageScore > 0
                        ? expertPerformance.data.averageScore.toFixed(1)
                        : "0.0"}
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            className={`w-[13.33px] h-[13.33px] ${index <
                              Math.floor(
                                expertPerformance?.data?.averageScore || 0
                              )
                              ? "text-[#F2BB05] fill-[#F6CF50]"
                              : "text-[#CFD0D4] fill-[#E7ECEE]"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-[#878A93] text-sm font-normal">
                        {expertPerformance?.data?.totalRatings || 0} Client
                        Review
                        {expertPerformance?.data?.totalRatings !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="flex flex-col gap-3">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const ratingCount =
                        expertPerformance?.data?.ratings?.filter(
                          (rating: any) => Math.round(rating?.score) === stars
                        ).length || 0;

                      const percentage =
                        expertPerformance?.data?.totalRatings > 0
                          ? (ratingCount /
                            expertPerformance.data.totalRatings) *
                          100
                          : 0;

                      return (
                        <div key={stars} className="flex items-center gap-1">
                          <div className="w-full lg:w-[245px] h-[6px] bg-[#F5F5F5] rounded-[4px]">
                            <div
                              className="h-[6px] bg-[#CCCCCC] rounded-[4px] transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, index) => (
                                <Star
                                  key={index}
                                  className={`w-[13.33px] h-[13.33px] ${index < stars
                                    ? "text-[#F2BB05] fill-[#F6CF50]"
                                    : "text-[#CFD0D4] fill-[#E7ECEE]"
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="text-[#0E1426] text-sm font-normal">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="bg-white border border-[#D1DAEC80] rounded-3xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {expertPerformance?.data?.ratings?.length > 0 ? (
                  expertPerformance.data.ratings.map(
                    (rating: any, index: number) => (
                      <div
                        key={rating.id || index}
                        className="bg-[#FBFCFC] rounded-[18px] p-4 flex flex-col gap-[10px]"
                      >
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star
                              key={index}
                              className={`w-[13.33px] h-[13.33px] ${index < Math.floor(rating.score)
                                ? "text-[#F2BB05] fill-[#F6CF50]"
                                : "text-[#CFD0D4] fill-[#E7ECEE]"
                                }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Image
                              className="w-[22px] h-[22px] rounded-full border border-[#EFF2F3]"
                              src={"/images/dp.svg"}
                              width={22}
                              height={22}
                              alt="reviewer picture"
                            />
                            <span className="text-xs text-[#3E4351] font-medium">
                              {rating.ratingBy || "Anonymous"}
                            </span>
                          </div>
                          <Dot className="text-[#CFD0D4] w-6 h-6" />
                          <span className="text-xs text-[#3E4351] font-normal">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-[#878A93] text-base font-normal">
                          {rating.note || "No review text provided"}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <span className="text-[#878A93] text-lg">
                      No reviews yet
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="flex flex-col gap-4 my-5">
              {expertAccountDetails?.data ? (
                <div className="bg-white p-6 rounded-lg border border-[#D1DAEC80]">
                  <h3 className="font-medium text-lg sm:text-[20px] text-primary">
                    Account Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">
                        Account Name
                      </label>
                      <p className="font-medium">
                        {expertAccountDetails.data.accountName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500">
                        Account Number
                      </label>
                      <p className="font-medium">
                        {expertAccountDetails.data.accountNumber}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500">Bank Name</label>
                      <p className="font-medium">
                        {expertAccountDetails.data.bankName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500">Sort Code</label>
                      <p className="font-medium">
                        {expertAccountDetails.data.sortCode}
                      </p>
                    </div>

                    {expertAccountDetails.data.branch && (
                      <div>
                        <label className="text-sm text-gray-500">Branch</label>
                        <p className="font-medium">
                          {expertAccountDetails.data.branch}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No account details found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDetails;
