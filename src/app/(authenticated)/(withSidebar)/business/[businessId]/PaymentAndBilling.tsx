// components/PaymentsTab.tsx
"use client";

import {
  ArrowUpDown,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  FileText,
  CreditCard,
  Building,
  FolderOpen
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useGetAccountTransactions } from "@/hooks/usePayment";

// app/data/transaction-styles.ts
export const transactionStatusStyles = {
  successful: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-gray-50 text-gray-700 border-gray-200",
  default: "bg-gray-50 text-gray-700 border-gray-200"
} as const;

export const transactionTypeStyles = {
  subscription: "bg-purple-100 text-purple-600",
  project: "bg-blue-100 text-blue-600",
  milestone: "bg-orange-100 text-orange-600",
  withdrawal: "bg-red-100 text-red-600",
  deposit: "bg-green-100 text-green-600",
  default: "bg-gray-100 text-gray-600"
} as const;

export const transactionStatuses = [
  "All statuses",
  "Successful",
  "Pending",
  "Failed",
  "Refunded",
  "Cancelled"
];

export const transactionTypes = [
  "All types",
  "Subscription",
  "Project",
  "Milestone",
  "Withdrawal",
  "Deposit"
];

interface PaymentsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  businessId: string;
}

interface TransformedTransaction {
  id: string;
  business: string;
  businessEmail: string;
  type: string;
  description: string;
  amount: string;
  status: string;
  date: string;
  reference: string;
  rawAmount: number;
  rawDate: Date;
  planName?: string;
  projectTitle?: string;
  subscriptionStatus?: string;
  projectStatus?: string;
}

export default function PaymentsTab({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  businessId
}: PaymentsTabProps) {
  const [transactionStatus, setTransactionStatus] = useState("All statuses");
  const [transactionType, setTransactionType] = useState("All types");
  const [sortBy, setSortBy] = useState("createdAt");

  const { transactionData, isLoading } = useGetAccountTransactions(
    businessId,
    currentPage,
    rowsPerPage,
    transactionStatus === "All statuses" ? "all" : transactionStatus.toLowerCase(),
    sortBy,
    searchQuery
  );

  console.log("Transaction Data:", transactionData);

  // Transform API data to match table structure
  const transformedTransactions = useMemo((): TransformedTransaction[] => {
    if (!transactionData?.data) return [];

    return transactionData.data.map((transaction) => {
      const isSubscription = !!transaction.subscriptionId;
      const isProject = !!transaction.projectId;
      
      const businessInfo = isSubscription 
        ? transaction.subscriptionId?.businessId 
        : isProject 
        ? transaction.projectId?.businessId 
        : null;

      const businessName = businessInfo?.name || "N/A";
      const businessEmail = businessInfo?.email || "N/A";
      
      const type = isSubscription ? "Subscription" : isProject ? "Project" : "Other";
      
      let description = "";
      let planName = "";
      let projectTitle = "";
      let subscriptionStatus = "";
      let projectStatus = "";

      if (isSubscription) {
        planName = transaction.subscriptionId?.planName || transaction.subscriptionId?.planId?.name || "Unknown Plan";
        subscriptionStatus = transaction.subscriptionId?.status || "unknown";
        description = `${planName} Subscription`;
      } else if (isProject) {
        projectTitle = transaction.projectId?.title || "Unknown Project";
        projectStatus = transaction.projectId?.status || "unknown";
        description = `Project: ${projectTitle}`;
      } else {
        description = "Transaction";
      }

      const formattedStatus = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
      const reference = isSubscription 
        ? `SUB-${transaction.subscriptionId?.id?.slice(-8)?.toUpperCase() || "N/A"}`
        : isProject
        ? `PROJ-${transaction.projectId?.id?.slice(-8)?.toUpperCase() || "N/A"}`
        : `TX-${transaction.id.slice(-8).toUpperCase()}`;

      return {
        id: transaction.id,
        business: businessName,
        businessEmail: businessEmail,
        type: type,
        description: description,
        amount: `₦${transaction.amount.toLocaleString()}`,
        status: formattedStatus,
        date: transaction.createdAt,
        reference: reference,
        rawAmount: transaction.amount,
        rawDate: new Date(transaction.createdAt),
        planName: planName,
        projectTitle: projectTitle,
        subscriptionStatus: subscriptionStatus,
        projectStatus: projectStatus
      };
    });
  }, [transactionData]);

  const handleAction = (id: string, action: string) => {
    console.log(`Action ${action} for transaction ${id}`);
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
    if (transactionData && currentPage < transactionData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const exportToCSV = (data: TransformedTransaction[], filename: string) => {
    if (data.length === 0) return;

    const headers = ["ID", "Business", "Type", "Description", "Amount", "Status", "Date", "Reference"];
    const csvRows = [];

    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = [
        row.id,
        `"${row.business}"`,
        `"${row.type}"`,
        `"${row.description}"`,
        row.amount,
        row.status,
        new Date(row.date).toLocaleDateString("en-GB"),
        row.reference
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

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "subscription":
        return <CreditCard className="h-4 w-4" />;
      case "project":
        return <FolderOpen className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const getTypeStyle = (type: string) => {
    const typeKey = type.toLowerCase() as keyof typeof transactionTypeStyles;
    return transactionTypeStyles[typeKey] || transactionTypeStyles.default;
  };

  const getSortIndicator = (key: string) => {
    if (sortBy === key) return "↑";
    if (sortBy === `-${key}`) return "↓";
    return null;
  };

  const getAdditionalInfo = (transaction: TransformedTransaction) => {
    if (transaction.type === "Subscription" && transaction.planName) {
      return (
        <span className="text-xs text-gray-500 mt-1">
          Plan: {transaction.planName} • Status: {transaction.subscriptionStatus}
        </span>
      );
    } else if (transaction.type === "Project" && transaction.projectTitle) {
      return (
        <span className="text-xs text-gray-500 mt-1">
          Project: {transaction.projectTitle} • Status: {transaction.projectStatus}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4 my-4">
      <div className="flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-3">
        <section aria-labelledby="transactions-heading">
          <h2 id="transactions-heading" className="sr-only">
            Transactions
          </h2>
          
          {/* Header */}
          <h1 className="text-2xl font-medium text-[#878A93] my-4">
            All transactions
          </h1>
          <p className="mb-4 font-montserrat text-sm">
            Track and manage all business transactions and payment history.
          </p>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <Select
                value={transactionStatus}
                onValueChange={(value) => {
                  setTransactionStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] h-9 rounded-xl text-sm border-gray-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {transactionStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={transactionType}
                onValueChange={(value) => {
                  setTransactionType(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] h-9 rounded-xl text-sm border-gray-300">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative w-full md:w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
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
              onClick={() => exportToCSV(transformedTransactions, "transactions")}
              disabled={transformedTransactions.length === 0}
            >
              <Download className="h-3 w-3 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-lg overflow-hidden">
            <div className="overflow-x-auto w-full">
              {isLoading ? (
                <TableSkeleton rows={5} columns={7} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-[#878A93] font-medium text-sm py-4">
                        Business
                      </TableHead>
                      <TableHead className="text-[#878A93] font-medium text-sm py-4">
                        Type
                      </TableHead>
                      <TableHead className="text-[#878A93] font-medium text-sm py-4">
                        Description
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
                    {transformedTransactions.length > 0 ? (
                      transformedTransactions.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">
                                  {getInitials(row.business)}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-gray-900 text-sm font-medium">
                                  {row.business}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {row.businessEmail}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${getTypeStyle(row.type)}`}>
                                {getTypeIcon(row.type)}
                              </div>
                              <span className="text-gray-700 text-sm">{row.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-col">
                              <span className="text-gray-600 text-sm line-clamp-1" title={row.description}>
                                {row.description}
                              </span>
                              <span className="text-gray-400 text-xs">
                                Ref: {row.reference}
                              </span>
                              {getAdditionalInfo(row)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap">
                            <span className="text-gray-900 text-sm font-semibold">
                              {row.amount}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap">
                            <Badge
                              className={`min-w-[90px] justify-center text-xs font-medium ${
                                transactionStatusStyles[
                                  row.status.toLowerCase() as keyof typeof transactionStatusStyles
                                ] || transactionStatusStyles.default
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
                                  onClick={() => handleAction(row.id, "invoice")}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <FileText className="w-4 h-4" />
                                  Download Invoice
                                </DropdownMenuItem>
                                {row.status.toLowerCase() === "successful" && (
                                  <DropdownMenuItem 
                                    onClick={() => handleAction(row.id, "refund")}
                                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                                  >
                                    <CreditCard className="w-4 h-4" />
                                    Process Refund
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-12 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                              <CreditCard className="h-8 w-8 text-gray-400" />
                            </div>
                            <span className="text-lg font-medium">No transactions found</span>
                            <span className="text-sm max-w-md">
                              {searchQuery || transactionStatus !== "All statuses" || transactionType !== "All types"
                                ? "Try adjusting your search or filter criteria" 
                                : "No transaction records available for this business."
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
          </div>

          {/* Pagination */}
          {transactionData && transactionData.totalItems > 0 && (
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
                  Page {currentPage} of {transactionData.totalPages} •{" "}
                  {(currentPage - 1) * rowsPerPage + 1}-
                  {Math.min(currentPage * rowsPerPage, transactionData.totalItems)} of{" "}
                  {transactionData.totalItems} transactions
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
                    disabled={currentPage === transactionData.totalPages || transactionData.totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}