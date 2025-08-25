"use client";

import React from "react";

type Props = {
  lastLogin: string;
};

const getRelativeTime = (lastLogin: string) => {
  if (!lastLogin) return "Never logged in";

  const loginDate = new Date(lastLogin);
  const now = new Date();
  const diffMs = now.getTime() - loginDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;

  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
};

export const ActiveStatus = ({ lastLogin }: Props) => {
  const timeAgo = getRelativeTime(lastLogin);

  return (
    <div className="flex items-center gap-2">
      {/* <span className="h-2 w-2 rounded-full bg-gray-400" /> */}
      <span className="text-sm text-gray-600">{timeAgo}</span>
    </div>
  );
};
