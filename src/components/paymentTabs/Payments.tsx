// components/Payments.tsx
"use client";

import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown, Download, Search, ChevronLeft, ChevronRight, FolderOpenIcon } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import Image from "next/image";
import { TableSkeleton } from "@/components/ui/table-skeleton";
// import { paymentStatusStyles, paymentTypeStyles, paymentTypes } from "@/app/data/payment-styles";
import { useGetAllPayment } from "@/hooks/usePayment";

export const paymentStatusStyles = {
  successful: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-blue-50 text-blue-700 border-blue-200",
  default: "bg-gray-50 text-gray-700 border-gray-200"
} as const;

export const paymentTypeStyles = {
  subscription: "bg-purple-100 text-purple-600",
  project: "bg-blue-100 text-blue-600",
  milestone: "bg-orange-100 text-orange-600",
  default: "bg-gray-100 text-gray-600"
} as const;

export const paymentTypes = [
  "All payments",
  "Successful", 
  "Pending",
  "Failed",
  "Refunded"
];

interface PaymentsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
}

interface TransformedPayment {
  id: string;
  type: string;
  business: string;
  expert: string;
  amount: string;
  trxId: string;
  status: string;
  date: string;
  avatar: string;
  expertAvatar: string;
  rawAmount: number;
  planName: string;
  rawDate: Date;
}

export default function Payments({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage
}: PaymentsProps) {
  const [paymentType, setPaymentType] = useState("All payments");
  const [sortBy, setSortBy] = useState("createdAt");

  const { paymentData, isLoading } = useGetAllPayment(
    currentPage,
    rowsPerPage,
    paymentType === "All payments" ? "all" : paymentType.toLowerCase(),
    sortBy,
    searchQuery
  );

  console.log("Payment Data:", paymentData);

  // Transform API data to match your table structure
  const transformedPayments = useMemo((): TransformedPayment[] => {
    if (!paymentData?.data) return [];

    return paymentData.data.map((payment) => {
      const isSubscription = !!payment.subscriptionId;
      const business = isSubscription 
        ? payment.subscriptionId?.businessId?.name || "N/A"
        : payment.projectId?.businessId?.name || "N/A";
      
      const type = isSubscription ? "Subscription" : "Project";
      const planName = isSubscription ? (payment.subscriptionId?.planId?.name ?? "N/A") : "Project Payment";
      
      // Format status to match our styles
      const formattedStatus = payment.status.charAt(0).toUpperCase() + payment.status.slice(1);
      
      return {
        id: payment.id,
        type,
        business,
        expert: "System", 
        amount: `₦${payment.amount.toLocaleString()}`,
        // trxId: `TRX${payment.id.slice(-8).toUpperCase()}`,
        trxId: "N/A",
        status: formattedStatus,
        date: payment.createdAt,
        avatar: "",
        expertAvatar: "",
        rawAmount: payment.amount,
        planName: planName, // always a string now
        rawDate: new Date(payment.createdAt)
      };
    });
  }, [paymentData]);

  const handleAction = (id: string, action: string) => {
    console.log(`Action ${action} for payment ${id}`);
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
    if (paymentData && currentPage < paymentData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const exportToCSV = (data: TransformedPayment[], filename: string) => {
    if (data.length === 0) return;

    const headers = ["ID", "Type", "Business", "Expert", "Amount", "Transaction ID", "Status", "Date"];
    const csvRows = [];

    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = [
        row.id,
        row.type,
        `"${row.business}"`,
        `"${row.expert}"`,
        row.amount,
        row.trxId,
        row.status,
        new Date(row.date).toLocaleDateString("en-GB")
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

  const getFolderIconStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "subscription":
        return "text-purple-600 bg-purple-100";
      case "project":
        return "text-blue-600 bg-blue-100";
      case "milestone":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSortIndicator = (key: string) => {
    if (sortBy === key) return "↑";
    if (sortBy === `-${key}`) return "↓";
    return null;
  };

  return (
    <section aria-labelledby="payments-heading">
      <h2 id="payments-heading" className="sr-only">
        Payments
      </h2>
      <p className="mb-4 font-montserrat text-sm">
        Track and manage all milestone / project payments for expert projects.
      </p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Select
            value={paymentType}
            onValueChange={(value) => {
              setPaymentType(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9 rounded-xl text-sm border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full md:w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by business or transaction ID"
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
          onClick={() => exportToCSV(transformedPayments, "payments")}
          disabled={transformedPayments.length === 0}
        >
          <Download className="h-3 w-3 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-x-auto lg:w-[82%] xl:w-full">
        {isLoading ? (
          <div className="py-8">
            <TableSkeleton rows={5} columns={8} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Payment type
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Business
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Expert
                </TableHead>
                <TableHead
                  className="text-[#878A93] font-medium text-sm py-4 cursor-pointer hover:bg-gray-100/50"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    <ArrowUpDown className="w-4 h-4" />
                    {getSortIndicator("amount")}
                  </div>
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Trx ID
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Status
                </TableHead>
                <TableHead
                  className="text-[#878A93] font-medium text-sm py-4 cursor-pointer hover:bg-gray-100/50"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Date
                    <ArrowUpDown className="w-4 h-4" />
                    {getSortIndicator("createdAt")}
                  </div>
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transformedPayments.length > 0 ? (
                transformedPayments.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${getFolderIconStyle(row.type)}`}>
                          <FolderOpenIcon size={18} className="stroke-current" />
                        </div>
                        <span className="text-gray-900 text-sm font-medium">{row.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {getInitials(row.business)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-900 text-sm font-medium">{row.business}</span>
                          <span className="text-gray-500 text-xs">{row.planName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-purple-600">
                            {getInitials(row.expert)}
                          </span>
                        </div>
                        <span className="text-gray-700 text-sm">{row.expert}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      <span className="text-gray-900 text-sm font-semibold">{row.amount}</span>
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      <code className="text-gray-700 text-sm bg-gray-100 px-2 py-1 rounded">
                        {row.trxId}
                      </code>
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      <Badge
                        className={`min-w-[80px] justify-center text-xs font-medium ${
                          paymentStatusStyles[
                            row.status.toLowerCase() as keyof typeof paymentStatusStyles
                          ] || paymentStatusStyles.default
                        }`}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-gray-900 text-sm">
                          {new Date(row.date).toLocaleDateString("en-GB")}
                        </span>
                        {/* <span className="text-gray-500 text-xs">
                          {new Date(row.date).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span> */}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
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
                            Edit Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction(row.id, "delete")}
                            className="flex items-center gap-2 text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FolderOpenIcon className="h-12 w-12 text-gray-300" />
                      <span className="text-lg font-medium">No payments found</span>
                      <span className="text-sm">
                        {searchQuery || paymentType !== "All payments" 
                          ? "Try adjusting your search or filter criteria" 
                          : "No payment records available"
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
      {paymentData && paymentData.totalItems > 0 && (
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
              Page {currentPage} of {paymentData.totalPages} •{" "}
              {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, paymentData.totalItems)} of{" "}
              {paymentData.totalItems} items
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
                disabled={currentPage === paymentData.totalPages || paymentData.totalPages === 0}
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