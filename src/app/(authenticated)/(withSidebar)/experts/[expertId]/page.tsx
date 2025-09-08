"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Calendar,
  Dot,
  House,
  Info,
  Link,
  MessageCircle,
  Star,
  Verified,
} from "lucide-react";
import { useState } from "react";
import CircularProgress from "@/components/circular-progress";
import { useParams } from "next/navigation";
import { ProjectSkeleton } from "@/components/ui/project-skeleton";
import { useGetExpertById } from "@/hooks/useExpert";

// types/expert.ts
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
}

const ExpertDetails = () => {
  const [activeTab, setActiveTab] = useState<
    "about" | "documents" | "performance" | "account"
  >("about");
  const params = useParams();
  const expertId = params.expertId as string;

  const { expertDetails, isLoading } = useGetExpertById(expertId);
  console.log(expertDetails);

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
                  src={"/images/profile-pic.svg"}
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
                  <span className="flex items-center gap-[2px] font-medium text-[#0DDC0E] text-sm">
                    <Verified className="w-4 h-4" />
                    {expertDetails.verified
                      ? "Verified"
                      : "Pending Verification"}
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
                4.5/5 average rating | {expertDetails.projectCount}: Projects
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
              <Button className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button variant={"outline"} className="rounded-[14px] text-sm">
                Assign to project
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 w-full lg:w-auto">
            <Button
              variant={"outline"}
              className="rounded-[14px] hover:bg-primary-hover hover:text-black"
            >
              {expertDetails.status === "active" ? "Suspend" : "Activate"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col">
          <div>
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
                  activeTab === "documents"
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
                ${
                  activeTab === "performance"
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
                ${
                  activeTab === "account"
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
                  <span className="border border-[#E7E8E9] rounded-[10px] p-2 bg-white cursor-pointer text-[#0E1426] text-sm">
                    Mark Onboarding as complete
                  </span>
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
                      {expertDetails.name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Email
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold">
                      {expertDetails.email}
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
                      {expertDetails.phone}
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
                      2 years
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Category
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold capitalize">
                      {expertDetails.category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#878A93] text-sm font-normal">
                      Role
                    </span>
                    <span className="text-[#1A1A1A] text-base font-semibold capitalize">
                      {expertDetails.role.join(", ") || "Not specified"}
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
                        <Link className="text-[#FFC371] w-4 h-4" />
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
                        <Link className="text-[#FFC371] w-4 h-4" />
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
                        <Link className="text-[#FFC371] w-4 h-4" />
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
                        <Link className="text-[#FFC371] w-4 h-4" />
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
              <div className="portfolio flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg sm:text-[20px] text-primary">
                    Resume
                  </span>
                </div>
              </div>

              <div className="portfolio flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg sm:text-[20px] text-primary">
                    Identity
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="flex flex-col gap-4 my-5">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="bg-white border flex flex-col border-[#EFF2F3] rounded-3xl p-4 w-full">
                  <div className="flex flex-col gap-2 border-b border-[#EFF2F3] pb-4 mb-4">
                    <span className="text-base text-[#878A93] font-medium">
                      Projects Completed
                    </span>
                    <span className="font-bold text-[32px] text-[#121217]">
                      {expertDetails.projectCount}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-base text-[#878A93] font-medium">
                      Average Project Duration
                    </span>
                    <span className="font-bold text-[24px] text-[#121217]">
                      3 months
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-[#EFF2F3] flex flex-col lg:flex-row gap-6 rounded-3xl p-4 flex-1">
                  <div className="flex flex-col lg:gap-5 lg:mt-4">
                    <span className="font-bold text-4xl lg:text-[84px] text-[#0E1426]">
                      4.0
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                        <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                        <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                        <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                        <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                      </div>
                      <span className="text-[#878A93] text-sm font-normal">
                        Client&rsquo;s Reviews
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-full lg:w-[245px] h-[6px] bg-[#F5F5F5] rounded-[4px]">
                        <div className="w-[40%] h-[6px] bg-[#CCCCCC] rounded-[4px]"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                        </div>
                        <span className="text-[#0E1426] text-sm font-normal">
                          40%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-full lg:w-[245px] h-[6px] bg-[#F5F5F5] rounded-[4px]">
                        <div className="w-[20%] h-[6px] bg-[#CCCCCC] rounded-[4px]"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                        </div>
                        <span className="text-[#0E1426] text-sm font-normal">
                          20%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-full lg:w-[245px] h-[6px] bg-[#F5F5F5] rounded-[4px]">
                        <div className="w-[15%] h-[6px] bg-[#CCCCCC] rounded-[4px]"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                        </div>
                        <span className="text-[#0E1426] text-sm font-normal">
                          15%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-full lg:w-[245px] h-[6px] bg-[#F5F5F5] rounded-[4px]">
                        <div className="w-[15%] h-[6px] bg-[#CCCCCC] rounded-[4px]"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                        </div>
                        <span className="text-[#0E1426] text-sm font-normal">
                          15%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-full lg:w-[245px] h-[6px] bg-[#F5F5F5] rounded-[4px]">
                        <div className="w-[10%] h-[6px] bg-[#CCCCCC] rounded-[4px]"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                          <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                        </div>
                        <span className="text-[#0E1426] text-sm font-normal">
                          10%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#D1DAEC80] rounded-3xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#FBFCFC] rounded-[18px] p-4 flex flex-col gap-[10px]">
                  <div className="flex items-center gap-1">
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Image
                        className="w-[22px] h-[22px] rounded-full border border-[#EFF2F3]"
                        src={"/images/dp.svg"}
                        width={22}
                        height={22}
                        alt="user picture"
                      />
                      <span className="text-xs text-[#3E4351] font-medium">
                        Darlene Robertson
                      </span>
                    </div>
                    <Dot className="text-[#CFD0D4] w-6 h-6" />
                    <span className="text-xs text-[#3E4351] font-normal">
                      AI & ML Smitre ltd
                    </span>
                  </div>
                  <span className="text-[#878A93] text-base font-normal">
                    made scaling our business feel exciting and achievable!
                    Their strategic guidance was crystal clear, their expertise
                    was invaluable, and their collaborative approach gave us the
                    support we needed to hit our growth targets.{" "}
                  </span>
                </div>
                <div className="bg-[#FBFCFC] rounded-[18px] p-4 flex flex-col gap-[10px]">
                  <div className="flex items-center gap-1">
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Image
                        className="w-[22px] h-[22px] rounded-full border border-[#EFF2F3]"
                        src={"/images/dp.svg"}
                        width={22}
                        height={22}
                        alt="user picture"
                      />
                      <span className="text-xs text-[#3E4351] font-medium">
                        Darlene Robertson
                      </span>
                    </div>
                    <Dot className="text-[#CFD0D4] w-6 h-6" />
                    <span className="text-xs text-[#3E4351] font-normal">
                      AI & ML Smitre ltd
                    </span>
                  </div>
                  <span className="text-[#878A93] text-base font-normal">
                    made scaling our business feel exciting and achievable!
                    Their strategic guidance was crystal clear, their expertise
                    was invaluable, and their collaborative approach gave us the
                    support we needed to hit our growth targets.{" "}
                  </span>
                </div>
                <div className="bg-[#FBFCFC] rounded-[18px] p-4 flex flex-col gap-[10px]">
                  <div className="flex items-center gap-1">
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Image
                        className="w-[22px] h-[22px] rounded-full border border-[#EFF2F3]"
                        src={"/images/dp.svg"}
                        width={22}
                        height={22}
                        alt="user picture"
                      />
                      <span className="text-xs text-[#3E4351] font-medium">
                        Darlene Robertson
                      </span>
                    </div>
                    <Dot className="text-[#CFD0D4] w-6 h-6" />
                    <span className="text-xs text-[#3E4351] font-normal">
                      AI & ML Smitre ltd
                    </span>
                  </div>
                  <span className="text-[#878A93] text-base font-normal">
                    made scaling our business feel exciting and achievable!
                    Their strategic guidance was crystal clear, their expertise
                    was invaluable, and their collaborative approach gave us the
                    support we needed to hit our growth targets.{" "}
                  </span>
                </div>
                <div className="bg-[#FBFCFC] rounded-[18px] p-4 flex flex-col gap-[10px]">
                  <div className="flex items-center gap-1">
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Image
                        className="w-[22px] h-[22px] rounded-full border border-[#EFF2F3]"
                        src={"/images/dp.svg"}
                        width={22}
                        height={22}
                        alt="user picture"
                      />
                      <span className="text-xs text-[#3E4351] font-medium">
                        Darlene Robertson
                      </span>
                    </div>
                    <Dot className="text-[#CFD0D4] w-6 h-6" />
                    <span className="text-xs text-[#3E4351] font-normal">
                      AI & ML Smitre ltd
                    </span>
                  </div>
                  <span className="text-[#878A93] text-base font-normal">
                    made scaling our business feel exciting and achievable!
                    Their strategic guidance was crystal clear, their expertise
                    was invaluable, and their collaborative approach gave us the
                    support we needed to hit our growth targets.{" "}
                  </span>
                </div>
                <div className="bg-[#FBFCFC] rounded-[18px] p-4 flex flex-col gap-[10px]">
                  <div className="flex items-center gap-1">
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Image
                        className="w-[22px] h-[22px] rounded-full border border-[#EFF2F3]"
                        src={"/images/dp.svg"}
                        width={22}
                        height={22}
                        alt="user picture"
                      />
                      <span className="text-xs text-[#3E4351] font-medium">
                        Darlene Robertson
                      </span>
                    </div>
                    <Dot className="text-[#CFD0D4] w-6 h-6" />
                    <span className="text-xs text-[#3E4351] font-normal">
                      AI & ML Smitre ltd
                    </span>
                  </div>
                  <span className="text-[#878A93] text-base font-normal">
                    made scaling our business feel exciting and achievable!
                    Their strategic guidance was crystal clear, their expertise
                    was invaluable, and their collaborative approach gave us the
                    support we needed to hit our growth targets.{" "}
                  </span>
                </div>
                <div className="bg-[#FBFCFC] rounded-[18px] p-4 flex flex-col gap-[10px]">
                  <div className="flex items-center gap-1">
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
                    <Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Image
                        className="w-[22px] h-[22px] rounded-full border border-[#EFF2F3]"
                        src={"/images/dp.svg"}
                        width={22}
                        height={22}
                        alt="user picture"
                      />
                      <span className="text-xs text-[#3E4351] font-medium">
                        Darlene Robertson
                      </span>
                    </div>
                    <Dot className="text-[#CFD0D4] w-6 h-6" />
                    <span className="text-xs text-[#3E4351] font-normal">
                      AI & ML Smitre ltd
                    </span>
                  </div>
                  <span className="text-[#878A93] text-base font-normal">
                    made scaling our business feel exciting and achievable!
                    Their strategic guidance was crystal clear, their expertise
                    was invaluable, and their collaborative approach gave us the
                    support we needed to hit our growth targets.{" "}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDetails;
