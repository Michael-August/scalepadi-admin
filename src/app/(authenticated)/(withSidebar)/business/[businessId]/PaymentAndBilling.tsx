"use client";

import {
  ArrowUpDown,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
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
import Image from "next/image";
import { subscriptionsData, statusStyles } from "@/app/data";

interface SubscriptionsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
}

const subscriptionStatuses = ["All statuses", "Active", "Expired", "Trial"];

export default function PaymentsTab({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
}: SubscriptionsProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState("All statuses");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptionsData.filter((sub) => {
      const matchesStatus =
        subscriptionStatus === "All statuses" ||
        sub.status === subscriptionStatus;
      const matchesSearch =
        searchQuery === "" ||
        sub.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.plan.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const { key, direction } = sortConfig;
        // Only allow sorting by known keys
        type SubscriptionKey =
          | "business"
          | "plan"
          | "amount"
          | "renewal"
          | "status";
        if (!["business", "plan", "amount", "renewal", "status"].includes(key))
          return 0;
        const aValue = (a as Record<SubscriptionKey, unknown>)[
          key as SubscriptionKey
        ];
        const bValue = (b as Record<SubscriptionKey, unknown>)[
          key as SubscriptionKey
        ];
        let aSort = aValue;
        let bSort = bValue;
        // Handle numeric sort for amount
        if (key === "amount") {
          aSort =
            typeof aSort === "string"
              ? parseFloat(aSort.replace(/[^\d.]/g, ""))
              : aSort;
          bSort =
            typeof bSort === "string"
              ? parseFloat(bSort.replace(/[^\d.]/g, ""))
              : bSort;
        }
        // Handle date sort for renewal
        if (key === "renewal") {
          aSort = typeof aSort === "string" ? new Date(aSort) : aSort;
          bSort = typeof bSort === "string" ? new Date(bSort) : bSort;
        }
        if (typeof aSort === "string" && typeof bSort === "string") {
          if (aSort < bSort) return direction === "asc" ? -1 : 1;
          if (aSort > bSort) return direction === "asc" ? 1 : -1;
          return 0;
        }
        if (typeof aSort === "number" && typeof bSort === "number") {
          return direction === "asc" ? aSort - bSort : bSort - aSort;
        }
        if (aSort instanceof Date && bSort instanceof Date) {
          return direction === "asc"
            ? aSort.getTime() - bSort.getTime()
            : bSort.getTime() - aSort.getTime();
        }
        return 0;
      });
    }
    return filtered;
  }, [subscriptionStatus, searchQuery, sortConfig]);

  const paginatedSubscriptions = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredSubscriptions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSubscriptions, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredSubscriptions.length / rowsPerPage);
  }, [filteredSubscriptions, rowsPerPage]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const exportToCSV = <T extends Record<string, unknown>>(
    data: T[],
    filename: string
  ) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("hidden", "");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return (
    <section aria-labelledby="transactions-heading">
      <h2 id="transactions-heading" className="sr-only">
        Transactions
      </h2>
      {/* Header */}
      <h1 className="text-2xl font-medium text-[#878A93] my-4">All transactions</h1>
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
            <SelectTrigger className="w-[180px] h-9 text-xs rounded-xl text-gray-500 border-gray-300">
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
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full h-9 text-xs rounded-xl text-gray-500 border-gray-300"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs rounded-xl text-gray-500 border-gray-300 bg-transparent"
          onClick={() => exportToCSV(filteredSubscriptions, "subscriptions")}
        >
          <Download className="h-3 w-3 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-x-auto">
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
                className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap cursor-pointer"
                onClick={() => requestSort("amount")}
              >
                <div className="flex items-center gap-1">
                  Amount
                  <ArrowUpDown className="w-4 h-4" />
                  {sortConfig?.key === "amount" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </div>
              </TableHead>
              <TableHead
                className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap cursor-pointer"
                onClick={() => requestSort("renewal")}
              >
                <div className="flex items-center gap-1">
                  Next Renewal
                  <ArrowUpDown className="w-4 h-4" />
                  {sortConfig?.key === "renewal" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </div>
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSubscriptions.length > 0 ? (
              paginatedSubscriptions.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50"
                >
                  <TableCell className="py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {row.avatar ? (
                        <Image
                          src={row.avatar}
                          alt={row.business}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {getInitials(row.business)}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-900 text-sm">
                        {row.business}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className=" flex items-center justify-center">
                        <span
                          className={`text-xs font-medium p-2 rounded-full ${
                            row.plan === "Padi Pro"
                              ? "bg-blue-500"
                              : row.plan === "Padi Yakata"
                              ? "bg-yellow-500"
                              : row.plan === "Padi Basic"
                              ? "bg-green-500"
                              : "bg-purple-500" // Default color for other plans
                          }`}
                        >
                          {/* {row.plan[0]} */}
                        </span>
                      </div>
                      <span className="text-gray-700 text-sm">{row.plan}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">
                    {row.amount}
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">
                    {row.renewal}
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        row.status === "Active"
                          ? "default"
                          : row.status === "Expired"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        statusStyles[row.status as keyof typeof statusStyles]
                      }
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap">
                    {row.status === "Active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs rounded-xl text-gray-500"
                      >
                        Pause
                      </Button>
                    )}
                    {row.status === "Expired" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs rounded-xl text-gray-500"
                      >
                        Renew
                      </Button>
                    )}
                    {row.status === "Trial" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs rounded-xl text-gray-500"
                      >
                        Upgrade
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-4 text-center text-gray-500"
                >
                  No subscriptions found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredSubscriptions.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
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
              <SelectTrigger className="w-16 h-8 text-sm border-gray-300">
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
              {filteredSubscriptions.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
              -
              {Math.min(
                currentPage * rowsPerPage,
                filteredSubscriptions.length
              )}{" "}
              of {filteredSubscriptions.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
