"use client";

import { Button } from "@/components/ui/button";
import { Users2, Clock, Church, Download, File, Pin, Verified, Star, LinkIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const ProjectDetails = () => {

    const [activeTab, setActiveTab] = useState<'projectOverview' | 'taskTracker'>('projectOverview')

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-4 border-b border-[#EDEEF3] pb-4">
                {/* <div className="heading w-full bg-[#F8F8F8] py-4 px-6 flex items-center gap-2">
                    <span onClick={() => window.history.back()} className="text-[#1746A2AB] text-sm font-medium cursor-pointer">Back to My projects</span>
                    <span className="text-[#CFD0D4] text-sm">/</span>
                    <span className="text-[#1A1A1A] text-sm font-medium">Growth Audit for GreenMart </span>
                    <span className="text-[#CFD0D4] text-sm">/</span>
                </div> */}

                <div className="flex w-full items-center justify-between">
                    <div className="top w-full flex items-center gap-3">
                        <div className="bg-[#D1F7FF] flex items-center justify-center p-[5.84px] text-[#1A1A1A] text-xs h-[54px] rounded-[11.68px]">BlueMart</div>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#878A93] ">Growth Audit for GreenMart </span>
                            <div className="items-center gap-2 flex">
                                <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                                    <Users2 className="w-4 h-4" />
                                    Members: <span className="text-[#121217]">03</span>
                                </span>
                                <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                                    <Clock className="w-4 h-4" />
                                    Due: <span className="text-[#121217]">June 30</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-[#878A93] opacity-0">Hi</span>
                            <div className="items-center gap-1 flex">
                                <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                                    <Church className="w-4 h-4" />
                                    Status: <span className="text-[#121217]">In progress</span>
                                </span>
                                <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                                    <Church className="w-4 h-4" />
                                    Role: <span className="text-[#121217]">In progress</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <Button variant={'outline'} className="rounded-[14px">Edit Project</Button>
                        <Button className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black">Chage Status</Button>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-5">
                    <div className="w-[52px] relative h-[52px] rounded-full">
                        <Image src={'/images/profile-pic.svg'} alt="Profile Picture" width={52} height={52} className="rounded-full w-full h-full" />
                        <Image className="absolute bottom-0 left-0" src={'/images/profile-logo.svg'} alt="logo" width={20} height={20} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[#1A1A1A] font-medium text-[20px]">David ABIJANRI eerie</span>
                        <div className="flex items-center gap-1">
                            <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                            <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                            <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                            <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                            <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm"><Verified className="w-4 h-4 text-[#878A93]" /> Verified</span>
                            <span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm"><Pin className="w-4 h-4 text-[#878A93]" /> Abuja,Nigeria</span>
                            <span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm"><Clock className="w-4 h-4 text-[#878A93]" /> Availability: Full time</span>
                        </div>
                    </div>
                </div>
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
                {activeTab === 'projectOverview' && <div className="w-full border border-[#F2F2F2] rounded-2xl p-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-[#1A1A1A] text-sm font-normal">Project brief</span>
                        {/* <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(yourContent) }}
                        /> */}
                        <span className="text-sm text-[#727374]">
                            Theming allows users to leverage the power of the dotLottie format by adding multiple themes into a single file. This enables you can easily embed one animation file into your design project and switch between themes without the need to create multiple files.
                        </span>
                        <span className="text-sm text-[#727374]">
                            Theming allows users to leverage the power of the dotLottie format by adding multiple themes into a single file. This enables you can easily embed one animation file into your design project and switch between themes without the need to create multiple files.
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[#1A1A1A] text-sm font-normal">Goal</span>
                        <span className="text-sm text-[#727374]">Increase weekly customer sign-ups by 30% in 6 weeks through acquisition funnel optimization and sales outreach.</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[#1A1A1A] text-sm font-normal">Challenge</span>
                        <span className="text-sm text-[#727374]">Increase weekly customer sign-ups by 30% in 6 weeks through acquisition funnel optimization and sales outreach.</span>
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
                    <div className="flex flex-col gap-2">
                        <span className="text-[#1A1A1A] text-sm font-normal">Resources</span>
                        <div className="flex items-center gap-[10px]">
                            <div className="flex items-center gap-2 p-1 bg-[#F7F9F9] rounded-3xl">
                                <File className="w-4 h-4 text-primary" />
                                <span className="text-[#878A93] text-xs">CRM Snapshot ()CSV</span>
                                <Download className="w-4 h-4 text-[#878A93] cursor-pointer" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[#1A1A1A] text-sm font-normal">Deliverables</span>
                        <ul className="list-none flex flex-col gap-2 text-sm text-[#727374]">
                            <li>Weekly Sign-Ups</li>
                            <li>Landing Page Conversion Rate</li>
                            <li>CPA (Cost per Acquisition)</li>
                            <li>Referral Rate</li>
                        </ul>
                    </div>
                </div>}

                {activeTab === 'taskTracker' &&
                    <div className="w-full border border-[#F2F2F2] rounded-2xl p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#1A1A1A]">Track Tasks in real time</span>
                            <span className="text-sm text-[#727374]">Review submissions and approve or request changes.</span>
                        </div>

                        <div className="p-3 flex flex-col gap-4 rounded-3xl bg-[#FBFCFC]">
                            <div className="flex items-center gap-2">
                                <div className="w-[52px] relative h-[52px] rounded-full">
                                    <Image src={'/images/profile-pic.svg'} alt="Profile Picture" width={52} height={52} className="rounded-full w-full h-full" />
                                    <Image className="absolute bottom-0 left-0" src={'/images/profile-logo.svg'} alt="logo" width={20} height={20} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[#1A1A1A] font-medium text-[20px]">David ABIJANRI eerie</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                                        <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                                        <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                                        <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                                        <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm"><Verified className="w-4 h-4 text-[#878A93]" /> Verified</span>
                                        <span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm"><Pin className="w-4 h-4 text-[#878A93]" /> Abuja,Nigeria</span>
                                        <span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm"><Clock className="w-4 h-4 text-[#878A93]" /> Availability: Full time</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="bg-white p-3 rounded-2xl flex flex-col gap-4">
                                    <span className="text-[#878A93] text-sm font-medium">Task 1: <span className="text-[#1A1A1A]">Audit the current acquisition funnel</span></span>
                                    <span className="text-[#727374] text-sm">Review GreenMart’s landing pages, sign-up process, and paid traffic sources. Identify key drop-off points and capture screenshots where applicable.</span>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="links flex items-center flex-wrap gap-2 w-full">
                                        <div className="link border border-[#FEE1BA] flex px-2 py-[10px] items-center gap-2 rounded-[14px] lg:w-[367px]">
                                            <LinkIcon className="text-[#FF5F6D]" />
                                            url
                                        </div>
                                        <div className="link border border-[#FEE1BA] flex px-2 py-[10px] items-center gap-2 rounded-[14px] lg:w-[367px]">
                                            <LinkIcon className="text-[#FF5F6D]" />
                                            url
                                        </div>
                                    </div>

                                    <div className="docs flex items-center gap-2 w-full">
                                        <div className="flex w-full items-center justify-between p-3 border border-[#F3F4F6] rounded-[12px]">
                                            <div className="flex items-center gap-3">
                                                <Image src={'/icons/file-icon.svg'} alt="file" width={32} height={32} />
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-[#353D44]">[Front] My phone bill.pdf</span>
                                                    <span className="text-xs text-[#757B85]">250kb</span>
                                                </div>
                                            </div>
                                            <Download className="text-[#878A93] cursor-pointer w-5 h-5" />
                                        </div>
                                        <div className="flex w-full items-center justify-between p-3 border border-[#F3F4F6] rounded-[12px]">
                                            <div className="flex items-center gap-3">
                                                <Image src={'/icons/file-icon.svg'} alt="file" width={32} height={32} />
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-[#353D44]">[Front] My phone bill.pdf</span>
                                                    <span className="text-xs text-[#757B85]">250kb</span>
                                                </div>
                                            </div>
                                            <Download className="text-[#878A93] cursor-pointer w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-[#1A1A1A] text-sm">Additional notes</span>
                                        <span className="text-sm text-[#727374]">Review GreenMart's landing pages, sign-up process, and paid traffic sources. Identify key drop-off points and capture screenshots where applicable.</span>
                                    </div>

                                    <div className="flex items-center justify-end gap-3">
                                        <Button variant={'outline'} className="">Mark as Completed</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            
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
        </div>
    )
}

export default ProjectDetails
