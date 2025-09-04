"use client";

import { Button } from "@/components/ui/button";
import { Users2, Clock, Church, Download, Pin, Verified, Star } from "lucide-react";
import { useState } from "react";
import { useGetProjectById } from "@/hooks/useProjects";
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
  const [activeTab, setActiveTab] = useState<'projectOverview' | 'taskTracker'>('projectOverview');
  const params = useParams();
  const projectId = params.projectId as string;
  
  const { projectDetails, isLoading } = useGetProjectById(projectId);
  console.log(projectDetails)

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
      <div className="flex flex-col gap-4 border-b border-[#EDEEF3] pb-4">
        <div className="flex w-full items-center justify-between">
          <div className="top w-full flex items-center gap-3">
            <div className="bg-[#D1F7FF] flex items-center justify-center p-[5.84px] text-[#1A1A1A] text-xs h-[54px] rounded-[11.68px]">
              {projectDetails.businessId?.name?.substring(0, 8) || 'Project'}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[#878A93]">{projectDetails?.title}</span>
              <div className="items-center gap-2 flex">
                <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                  <Users2 className="w-4 h-4" />
                  Members: <span className="text-[#121217]">{projectDetails.experts?.length || 0}</span>
                </span>
                <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                  <Clock className="w-4 h-4" />
                  Due: <span className="text-[#121217]">
                    {projectDetails.dueDate ? format(new Date(projectDetails.dueDate), "MMM d") : "N/A"}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-[#878A93] opacity-0">Hi</span>
              <div className="items-center gap-1 flex">
                <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                  <Church className="w-4 h-4" />
                  Status: <span className="text-[#121217] capitalize">{projectDetails.status}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant={'outline'} className="rounded-[14px]">Edit Project</Button>
            <Button className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black">
              Change Status
            </Button>
          </div>
        </div>

        {projectDetails.businessId && (
          <div className="flex items-center gap-2 mt-5">
            <div className="w-[52px] relative h-[52px] rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-lg font-medium">
                {projectDetails.businessId.name?.charAt(0) || 'B'}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] font-medium text-[20px]">{projectDetails.businessId.name}</span>
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
      
      <div className="project-details w-full lg:w-[895px] pb-10">
        <div className="tab pt-2 w-1/2 flex items-center gap-5 bg-[#F9FAFB]">
          <div
            className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
            hover:border-[#3A96E8] transition-colors 
            ${activeTab === 'projectOverview' ? 'border-[#3A96E8] text-[#3A96E8]' : 'border-transparent'}`}
            onClick={() => setActiveTab('projectOverview')}
          >
            <span className="text-sm">Project Overview</span>
          </div>

          <div
            className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
            hover:border-[#3A96E8] transition-colors 
            ${activeTab === 'taskTracker' ? 'border-[#3A96E8] text-[#3A96E8]' : 'border-transparent'}`}
            onClick={() => setActiveTab('taskTracker')}
          >
            <span className="text-sm">Task Tracker</span>
          </div>
        </div>
        
        {activeTab === 'projectOverview' && (
          <div className="w-full border border-[#F2F2F2] rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">Project brief</span>
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
              <span className="text-[#1A1A1A] text-sm font-normal">Challenge</span>
              <span className="text-sm text-[#727374]">
                {projectDetails.brief || "No challenge description provided."}
              </span>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">Metrics to Influence</span>
              <ul className="list-none flex flex-col gap-2 text-sm text-[#727374]">
                <li>Weekly Sign-Ups</li>
                <li>Landing Page Conversion Rate</li>
                <li>CPA (Cost per Acquisition)</li>
                <li>Referral Rate</li>
              </ul>
            </div>
            
            {projectDetails.resources && projectDetails.resources.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[#1A1A1A] text-sm font-normal">Resources</span>
                <div className="flex items-center gap-[10px]">
                  {projectDetails?.resources.map((resourceUrl: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-1 bg-[#F7F9F9] rounded-3xl">
                      <Image src={resourceUrl} alt={`Resource ${idx + 1}`} width={18} height={18} className="w-8 h-8 rounded-lg object-cover border" />
                      <span className="text-[#878A93] text-xs">Resource {idx + 1}</span>
                      <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 text-[#878A93] cursor-pointer" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">Deliverables</span>
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
                {projectDetails.proposedTotalCost ? `$${projectDetails.proposedTotalCost.toLocaleString()}` : "No budget specified"}
              </span>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[#1A1A1A] text-sm font-normal">Payment Status</span>
              <span className="text-sm text-[#727374] capitalize">
                {projectDetails.paymentStatus || "Not specified"}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'taskTracker' && (
          <div className="w-full border border-[#F2F2F2] rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[#1A1A1A]">Track Tasks in real time</span>
              <span className="text-sm text-[#727374]">Review submissions and approve or request changes.</span>
            </div>

            <div className="p-3 flex flex-col gap-4 rounded-3xl bg-[#FBFCFC]">
              {projectDetails.experts && projectDetails.experts.length > 0 ? (
                projectDetails.experts.map((expert: NonNullable<Project['experts']>[number]) => (
                  <div key={expert.id} className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-[52px] relative h-[52px] rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-medium">
                          {expert?.name?.charAt(0) || 'E'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[#1A1A1A] font-medium text-[20px]">{expert?.name || "Expert"}</span>
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
                        Task {expert?.id + 1}: <span className="text-[#1A1A1A]">Project Task</span>
                      </span>
                      <span className="text-[#727374] text-sm">
                        Complete assigned project tasks and deliverables.
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <Button variant={'outline'}>Mark as Completed</Button>
                    </div>
                  </div>
                ))
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

{/* <Dialog open={openReview} onOpenChange={setOpenReview}>
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
</Dialog> */}