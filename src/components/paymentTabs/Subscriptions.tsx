// components/Subscriptions.tsx
"use client";

import { ArrowUpDown, Download, Search, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Edit, Play, Pause, RotateCcw, Zap } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableSkeleton } from "@/components/ui/table-skeleton";
// import { subscriptionStatusStyles, planStyles, subscriptionStatuses } from "@/app/data/subscription-styles";
import { useGetAllSubscription } from "@/hooks/useSubscription";

// app/data/subscription-styles.ts
export const subscriptionStatusStyles = {
  active: "bg-green-50 text-green-700 border-green-200",
  expired: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-gray-50 text-gray-700 border-gray-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  trial: "bg-blue-50 text-blue-700 border-blue-200",
  default: "bg-gray-50 text-gray-700 border-gray-200"
} as const;

export const planStyles = {
  "Padi Pro": "bg-blue-100 text-blue-600",
  "Padi Gold": "bg-yellow-100 text-yellow-600",
  "Padi Basic": "bg-green-100 text-green-600",
  "Padi Yakata": "bg-purple-100 text-purple-600",
  default: "bg-gray-100 text-gray-600"
} as const;

export const subscriptionStatuses = [
  "All statuses",
  "Active",
  "Expired",
  "Trial",
  "Pending",
  "Cancelled"
];

interface SubscriptionsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
}

interface TransformedSubscription {
  id: string;
  business: string;
  businessEmail: string;
  plan: string;
  amount: string;
  renewal: string;
  status: string;
  requestsLeft: number;
  createdAt: string;
  rawAmount: number;
  rawRenewal: Date;
  rawCreatedAt: Date;
}

export default function Subscriptions({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage
}: SubscriptionsProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState("All statuses");
  const [sortBy, setSortBy] = useState("createdAt");

  const { subscriptionData, isLoading } = useGetAllSubscription(
    currentPage,
    rowsPerPage,
    subscriptionStatus === "All statuses" ? "all" : subscriptionStatus.toLowerCase(),
    sortBy,
    searchQuery
  );

  console.log("Subscription Data:", subscriptionData);

  // Transform API data to match table structure
  const transformedSubscriptions = useMemo((): TransformedSubscription[] => {
    if (!subscriptionData?.data) return [];

    return subscriptionData.data.map((subscription) => {
      const formattedStatus = subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
      
      return {
        id: subscription.id,
        business: subscription.businessId.name,
        businessEmail: subscription.businessId.email,
        plan: subscription.planName || subscription.planId.name,
        amount: `₦${subscription.amountPaid.toLocaleString()}`,
        renewal: subscription.nextRenewal,
        status: formattedStatus,
        requestsLeft: subscription.requestsLeft,
        createdAt: subscription.createdAt,
        rawAmount: subscription.amountPaid,
        rawRenewal: new Date(subscription.nextRenewal),
        rawCreatedAt: new Date(subscription.createdAt)
      };
    });
  }, [subscriptionData]);

  const handleAction = (id: string, action: string) => {
    console.log(`Action ${action} for subscription ${id}`);
    // Implement action logic here
  };

  const handleSort = (key: string) => {
    const newSortBy = sortBy === key ? `-${key}` : key;
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (subscriptionData && currentPage < subscriptionData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const exportToCSV = (data: TransformedSubscription[], filename: string) => {
    if (data.length === 0) return;

    const headers = ["ID", "Business", "Plan", "Amount", "Next Renewal", "Status", "Requests Left", "Created Date"];
    const csvRows = [];

    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = [
        row.id,
        `"${row.business}"`,
        `"${row.plan}"`,
        row.amount,
        new Date(row.renewal).toLocaleDateString("en-GB"),
        row.status,
        row.requestsLeft.toString(),
        new Date(row.createdAt).toLocaleDateString("en-GB")
      ];
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("hidden", "");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPlanColor = (planName: string) => {
    const planKey = planName as keyof typeof planStyles;
    return planStyles[planKey] || planStyles.default;
  };

  const getPlanInitial = (planName: string): string => {
    return planName.charAt(0).toUpperCase();
  };

  const getStatusAction = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return { label: "Pause", icon: Pause, variant: "outline" as const };
      case "expired":
        return { label: "Renew", icon: RotateCcw, variant: "default" as const };
      case "trial":
        return { label: "Upgrade", icon: Zap, variant: "default" as const };
      case "pending":
        return { label: "Activate", icon: Play, variant: "default" as const };
      default:
        return { label: "Manage", icon: MoreHorizontal, variant: "outline" as const };
    }
  };

  const getSortIndicator = (key: string) => {
    if (sortBy === key) return "↑";
    if (sortBy === `-${key}`) return "↓";
    return null;
  };

  const isSubscriptionExpiringSoon = (renewalDate: string): boolean => {
    const renewal = new Date(renewalDate);
    const now = new Date();
    const daysUntilRenewal = Math.ceil((renewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilRenewal <= 7 && daysUntilRenewal > 0;
  };

  const isSubscriptionExpired = (renewalDate: string): boolean => {
    return new Date(renewalDate) < new Date();
  };

  return (
    <section aria-labelledby="subscriptions-heading">
      <h2 id="subscriptions-heading" className="sr-only">
        Subscriptions
      </h2>
      <p className="mb-4 font-montserrat text-sm">
        Track business subscriptions and renewal status.
      </p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Select
            value={subscriptionStatus}
            onValueChange={(value) => {
              setSubscriptionStatus(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9 rounded-xl text-sm border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subscriptionStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full md:w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by business or plan"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full h-9 rounded-xl text-sm border-gray-300"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-xl text-xs border-gray-300 bg-transparent"
          onClick={() => exportToCSV(transformedSubscriptions, "subscriptions")}
          disabled={transformedSubscriptions.length === 0}
        >
          <Download className="h-3 w-3 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-x-auto lg:w-[99%] xl:w-full">
        {isLoading ? (
          <div className="py-8">
            <TableSkeleton rows={5} columns={6} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                  Business
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                  Subscription Plan
                </TableHead>
                <TableHead
                  className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/50"
                  onClick={() => handleSort("amountPaid")}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    <ArrowUpDown className="w-4 h-4" />
                    {getSortIndicator("amountPaid")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/50"
                  onClick={() => handleSort("nextRenewal")}
                >
                  <div className="flex items-center gap-1">
                    Next Renewal
                    <ArrowUpDown className="w-4 h-4" />
                    {getSortIndicator("nextRenewal")}
                  </div>
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transformedSubscriptions.length > 0 ? (
                transformedSubscriptions.map((row) => {
                  const statusAction = getStatusAction(row.status);
                  const ActionIcon = statusAction.icon;
                  const isExpiringSoon = isSubscriptionExpiringSoon(row.renewal);
                  const isExpired = isSubscriptionExpired(row.renewal);

                  return (
                    <TableRow
                      key={row.id}
                      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                        isExpiringSoon ? 'bg-yellow-50/30 hover:bg-yellow-50/50' : ''
                      } ${isExpired ? 'bg-red-50/30 hover:bg-red-50/50' : ''}`}
                    >
                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {getInitials(row.business)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-900 text-sm font-semibold">{row.business}</span>
                            <span className="text-gray-500 text-xs">{row.businessEmail}</span>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="text-xs h-5">
                                {row.requestsLeft} requests left
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${getPlanColor(row.plan)}`}>
                            <span className="text-sm font-bold">
                              {getPlanInitial(row.plan)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-900 text-sm font-medium">{row.plan}</span>
                            {/* <span className="text-gray-500 text-xs">
                              Created: {new Date(row.createdAt).toLocaleDateString("en-GB")}
                            </span> */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        <span className="text-gray-900 text-sm font-semibold">{row.amount}</span>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-gray-900 text-sm font-medium">
                            {new Date(row.renewal).toLocaleDateString("en-GB")}
                          </span>
                          {/* <span className="text-gray-500 text-xs">
                            {new Date(row.renewal).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span> */}
                          {isExpiringSoon && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-300 text-xs mt-1">
                              Expiring soon
                            </Badge>
                          )}
                          {isExpired && (
                            <Badge variant="outline" className="text-red-600 border-red-300 text-xs mt-1">
                              Expired
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        <Badge
                          className={`min-w-[80px] justify-center text-xs font-medium ${
                            subscriptionStatusStyles[
                              row.status.toLowerCase() as keyof typeof subscriptionStatusStyles
                            ] || subscriptionStatusStyles.default
                          }`}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={statusAction.variant}
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleAction(row.id, statusAction.label.toLowerCase())}
                          >
                            <ActionIcon className="h-3 w-3 mr-1" />
                            {statusAction.label}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 data-[state=open]:bg-gray-100"
                              >
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem 
                                onClick={() => handleAction(row.id, "view")}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleAction(row.id, "edit")}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Subscription
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleAction(row.id, "renew")}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <RotateCcw className="w-4 h-4" />
                                Renew Now
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Zap className="h-8 w-8 text-gray-400" />
                      </div>
                      <span className="text-lg font-medium">No subscriptions found</span>
                      <span className="text-sm max-w-md">
                        {searchQuery || subscriptionStatus !== "All statuses" 
                          ? "Try adjusting your search or filter criteria" 
                          : "No subscription records available. Subscriptions will appear here when businesses sign up."
                        }
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {subscriptionData && subscriptionData.totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
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
              <SelectTrigger className="w-20 h-8 text-sm border-gray-300">
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
              Page {currentPage} of {subscriptionData.totalPages} •{" "}
              {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, subscriptionData.totalItems)} of{" "}
              {subscriptionData.totalItems} subscriptions
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleNextPage}
                disabled={currentPage === subscriptionData.totalPages || subscriptionData.totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}