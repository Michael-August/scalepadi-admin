"use client";

import { Button } from "@/components/ui/button";
import {
  Users2,
  Clock,
  Church,
  Download,
  Pin,
  Verified,
  Star,
  X,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useGetProjectById, useApproveProject } from "@/hooks/useProjects";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ProjectSkeleton } from "@/components/ui/project-skeleton";
import Image from "next/image";

type Project = {
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
  experts?: {
    name: string;
    title?: string;
    email?: string;
    phone?: string;
    verified?: boolean;
    status?: string;
    id: string;
  }[];
};

const ProjectDetails = () => {
  const [activeTab, setActiveTab] = useState<"projectOverview" | "taskTracker">(
    "projectOverview"
  );
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<boolean>(true);
  const [discount, setDiscount] = useState<number>(0);
  
  const params = useParams();
  const projectId = params.projectId as string;

  const { projectDetails, isLoading } = useGetProjectById(projectId);
  const approveProjectMutation = useApproveProject();

  // Reset discount when modal opens or project details change
  useEffect(() => {
    if (isApprovalModalOpen) {
      setDiscount(0);
    }
  }, [isApprovalModalOpen, projectDetails]);

  const handleApprove = () => {
    if (!projectDetails) return;
    
    // Ensure discount doesn't make amount negative
    const finalDiscount = Math.min(discount, projectDetails.proposedTotalCost || 0);
    
    approveProjectMutation.mutate({
      projectId,
      approved: approvalStatus,
      totalCost: projectDetails.proposedTotalCost || 0,
      discount: finalDiscount,
    }, {
      onSuccess: () => {
        setIsApprovalModalOpen(false);
      }
    });
  };

  // Calculate amount ensuring it's never negative
  const calculatedAmount = Math.max(
    0, 
    (projectDetails?.proposedTotalCost || 0) - discount
  );

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (!projectDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500">Project not found</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Approval Modal */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Approve Project</h3>
              <button 
                onClick={() => setIsApprovalModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Approval Status
                </label>
                <select
                  value={approvalStatus.toString()}
                  onChange={(e) => setApprovalStatus(e.target.value === "true")}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="true">Approve</option>
                  <option value="false">Reject</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Proposed Total Cost
                </label>
                <div className="p-2 bg-gray-100 rounded-lg">
                  ${projectDetails.proposedTotalCost?.toLocaleString() || "0"}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Discount ($)
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => {
                    const newDiscount = Number(e.target.value);
                    // Ensure discount doesn't exceed proposed total cost
                    const maxDiscount = projectDetails.proposedTotalCost || 0;
                    setDiscount(Math.min(newDiscount, maxDiscount));
                  }}
                  min="0"
                  max={projectDetails.proposedTotalCost || 0}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Final Amount
                </label>
                <div className="p-2 bg-gray-100 rounded-lg font-medium">
                  ${calculatedAmount.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsApprovalModalOpen(false)}
                disabled={approveProjectMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={approveProjectMutation.isPending}
                className="bg-primary text-white hover:bg-primary-hover"
              >
                {approveProjectMutation.isPending ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 border-b border-[#EDEEF3] pb-4">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
          {/* Left section */}
          <div className="top w-full flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-[#D1F7FF] flex items-center justify-center p-[5.84px] text-[#1A1A1A] text-2xl font-bold h-[54px] w-[54px] rounded-[11.68px]">
              {projectDetails?.title?.substring(0, 1) || "P"}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-[#878A93] break-words">
                {projectDetails?.title}
              </span>
              <div className="items-center gap-4 flex flex-wrap">
                <span className="flex items-center gap-[4px] text-sm text-[#878A93]">
                  <Users2 className="w-4 h-4 shrink-0" />
                  Members:
                  <span className="text-[#121217]">
                    {projectDetails.experts?.length || 0}
                  </span>
                </span>
                <span className="flex items-center gap-[4px] text-sm text-[#878A93]">
                  <Clock className="w-4 h-4 shrink-0" />
                  Due:
                  <span className="text-[#121217]">
                    {projectDetails.dueDate
                      ? format(new Date(projectDetails.dueDate), "MMM d")
                      : "N/A"}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-[#878A93] opacity-0">Hi</span>
              <div className="items-center gap-1 flex">
                <span className="flex items-center gap-[4px] text-sm text-[#878A93]">
                  <Church className="w-4 h-4 shrink-0" />
                  Status:
                  <span className="text-[#121217] capitalize">
                    {projectDetails.status}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant={"outline"}
              className="rounded-[14px] w-full sm:w-auto"
            >
              Edit Project
            </Button>
            <Button className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black w-full sm:w-auto">
              Change Status
            </Button>
            
            {projectDetails.adminApproved ? (
              <Button 
                disabled
                className="bg-green-100 text-green-700 rounded-[14px] w-full sm:w-auto flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approved
              </Button>
            ) : (
              <Button 
                onClick={() => setIsApprovalModalOpen(true)}
                className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black w-full sm:w-auto"
              >
                Approve
              </Button>
            )}
          </div>
        </div>

        {projectDetails.businessId && (
          <div className="flex items-center gap-2">
            <div className="w-[52px] relative h-[52px] rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-lg font-medium">
                {projectDetails.businessId.name?.charAt(0) || "B"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] font-medium text-[20px]">
                {projectDetails.businessId.name}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm">
                  <Verified className="w-4 h-4 text-[#878A93]" /> Verified
                </span>
                <span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm">
                  <Pin className="w-4 h-4 text-[#878A93]" /> Location
                </span>
                <span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm">
                  <Clock className="w-4 h-4 text-[#878A93]" /> Availability
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="project-details w-full">
        <div className="tab pt-2 w-1/2 flex items-center gap-5 bg-[#F9FAFB]">
          <div
            className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
            hover:border-[#3A96E8] transition-colors 
            ${
              activeTab === "projectOverview"
                ? "border-[#3A96E8] text-[#3A96E8]"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("projectOverview")}
          >
            <span className="text-sm">Project Overview</span>
          </div>

          <div
            className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
            hover:border-[#3A96E8] transition-colors 
            ${
              activeTab === "taskTracker"
                ? "border-[#3A96E8] text-[#3A96E8]"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("taskTracker")}
          >
            <span className="text-sm">Task Tracker</span>
          </div>
        </div>

        {activeTab === "projectOverview" && (
          <div className="w-full border border-[#F2F2F2] rounded-2xl p-4 my-2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">
                Project brief
              </span>
              <span className="text-sm text-[#727374]">
                {projectDetails.brief || "No project brief provided."}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">Goal</span>
              <span className="text-sm text-[#727374]">
                {projectDetails.goal || "No goal specified."}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">
                Challenge
              </span>
              <span className="text-sm text-[#727374]">
                {projectDetails.brief || "No challenge description provided."}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">
                Metrics to Influence
              </span>
              <ul className="list-none flex flex-col gap-2 text-sm text-[#727374]">
                <li>Weekly Sign-Ups</li>
                <li>Landing Page Conversion Rate</li>
                <li>CPA (Cost per Acquisition)</li>
                <li>Referral Rate</li>
              </ul>
            </div>

            {projectDetails.resources &&
              projectDetails.resources.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[#1A1A1A] text-sm font-normal">
                    Resources
                  </span>
                  <div className="flex items-center gap-[10px]">
                    {projectDetails?.resources.map(
                      (resourceUrl: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-1 bg-[#F7F9F9] rounded-3xl px-4"
                        >
                          <Image
                            src={resourceUrl}
                            alt={`Resource ${idx + 1}`}
                            width={18}
                            height={18}
                            className="w-8 h-8 rounded-lg object-cover border"
                          />
                          <span className="text-[#878A93] text-xs">
                            Resource {idx + 1}
                          </span>
                          <a
                            href={resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4 text-[#878A93] cursor-pointer" />
                          </a>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">
                Deliverables
              </span>
              <ul className="list-none flex flex-col gap-2 text-sm text-[#727374]">
                <li>Project Analysis Report</li>
                <li>Implementation Plan</li>
                <li>Progress Updates</li>
                <li>Final Review</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">Budget</span>
              <span className="text-sm text-[#727374]">
                {projectDetails.proposedTotalCost
                  ? `$${projectDetails.proposedTotalCost.toLocaleString()}`
                  : "No budget specified"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">
                Payment Status
              </span>
              <span className="text-sm text-[#727374] capitalize">
                {projectDetails.paymentStatus || "Not specified"}
              </span>
            </div>
          </div>
        )}

        {activeTab === "taskTracker" && (
          <div className="w-full border border-[#F2F2F2] rounded-2xl p-4 my-2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[#1A1A1A]">
                Track Tasks in real time
              </span>
              <span className="text-sm text-[#727374]">
                Review submissions and approve or request changes.
              </span>
            </div>

            <div className="p-3 flex flex-col gap-4 rounded-3xl bg-[#FBFCFC]">
              {projectDetails.experts && projectDetails.experts.length > 0 ? (
                projectDetails.experts.map(
                  (expert: NonNullable<Project["experts"]>[number]) => (
                    <div key={expert.id} className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-[52px] relative h-[52px] rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-medium">
                            {expert?.name?.charAt(0) || "E"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-[#1A1A1A] font-medium text-[20px]">
                            {expert?.name || "Expert"}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                            <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                            <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                            <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                            <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-2xl flex flex-col gap-4">
                        <span className="text-[#878A93] text-sm font-medium">
                          Task {expert?.id + 1}:{" "}
                          <span className="text-[#1A1A1A]">Project Task</span>
                        </span>
                        <span className="text-[#727374] text-sm">
                          Complete assigned project tasks and deliverables.
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <Button variant={"outline"}>Mark as Completed</Button>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No experts assigned to this project yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;

{
  /* <Dialog open={openReview} onOpenChange={setOpenReview}>
    <DialogContent className="!rounded-3xl">
        <DialogTitle className="text-primary text-[20px]">
            Write a review
        </DialogTitle>
        
        <div className="flex flex-col gap-6">
            <span className="text-[#878A93] text-sm">Your project was recently completed and we will like for you to leave a feedback and performance review for the expert</span>
            <div className="flex items-center justify-center gap-4">
                <Star className="w-[32px] h-[32px] text-[#CFD0D4] fill-[#E7ECEE]" />
                <Star className="w-[32px] h-[32px] text-[#CFD0D4] fill-[#E7ECEE]" />
                <Star className="w-[32px] h-[32px] text-[#CFD0D4] fill-[#E7ECEE]" />
                <Star className="w-[32px] h-[32px] text-[#CFD0D4] fill-[#E7ECEE]" />
                <Star className="w-[32px] h-[32px] text-[#CFD0D4] fill-[#E7ECEE]" />
            </div>

            <div className="form-group flex flex-col gap-2">
                <Label>Write your feedback</Label>
                <Textarea className="rounded-[14px] py-6 px-4 border border-[#D1DAEC]"  />
            </div>

            <Button className="bg-primary text-white py-6 rounded-[14px] w-fit hover:bg-primary-hover hover:text-black">Submit review</Button>
        </div>
    </DialogContent>
</Dialog>

<Dialog open={openRejectReason} onOpenChange={setOpenRejectReason}>
    <DialogContent className="!rounded-3xl">
        <DialogTitle className="text-primary text-[20px]">
            Request update
        </DialogTitle>

        <div className="flex flex-col gap-6">
            <span className="text-[#878A93] text-sm">Kingly write detailed information as regards to why the submitted project has been rejected and what you want the expert to do?</span>
            <div className="form-group flex flex-col gap-2">
                <Label>Write your feedback</Label>
                <Textarea className="rounded-[14px] py-6 px-4 border border-[#D1DAEC]"  />
            </div>

            <Button className="bg-primary text-white py-6 rounded-[14px] w-fit hover:bg-primary-hover hover:text-black">Submit request</Button>
        </div>
    </DialogContent>
</Dialog> */
}
