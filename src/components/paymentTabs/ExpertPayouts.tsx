"use client";

import {
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  FolderOpenIcon,
} from "lucide-react";
import React, { useState, useMemo } from "react";
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
import { useGetAllHires } from "@/hooks/useHook";
import { TableSkeleton } from "../ui/table-skeleton";

interface HireManagementProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
}

const statusStyles = {
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  "awaiting-payment": "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-purple-100 text-purple-800 border-purple-200",
} as const;

const hireStatuses = [
  "All statuses",
  "in_progress",
  "completed",
  "cancelled",
  "awaiting-payment",
  "accepted",
];

export default function HireManagement({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
}: HireManagementProps) {
  const [hireStatus, setHireStatus] = useState("All statuses");

  const { hireData, isLoading, error } = useGetAllHires(
    currentPage,
    rowsPerPage
  );

  const filteredHires = useMemo(() => {
    if (!hireData?.data) return [];

    let filtered = hireData.data;

    // Filter by status
    if (hireStatus !== "All statuses") {
      filtered = filtered.filter((hire) => hire.hireStatus === hireStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (hire) =>
          hire.businessId.name.toLowerCase().includes(query) ||
          hire.expertId.name.toLowerCase().includes(query) ||
          hire.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [hireData?.data, hireStatus, searchQuery]);

  const paginatedHires = useMemo(() => {
    return filteredHires;
  }, [filteredHires]);

  const totalPages = hireData?.totalPages || 1;

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

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (isLoading) {
    return (
     <div className="py-8">
                 <TableSkeleton rows={5} columns={8} />
               </div>
    );
  }

  if (error) {
    return (
      <section aria-labelledby="hire-management-heading">
        <h2 id="hire-management-heading" className="sr-only">
          Hire Management
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">
            Error loading hires. Please try again.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="hire-management-heading">
      <h2 id="hire-management-heading" className="sr-only">
        Hire Management
      </h2>
      <p className="mb-4 font-montserrat text-sm">
        Admin view of all hire requests and their status.
      </p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Select
            value={hireStatus}
            onValueChange={(value) => {
              setHireStatus(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs rounded-xl text-gray-500 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hireStatuses.map((status) => (
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
          onClick={() =>
            exportToCSV(
              filteredHires as unknown as Record<string, unknown>[],
              "hire_management"
            )
          }
        >
          <Download className="h-3 w-3 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-x-auto lg:w-[80%] xl:w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                Business
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                Expert
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                Description
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                Duration
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                Budget
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                Commission
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                Created Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedHires.length > 0 ? (
              paginatedHires.map((hire) => (
                <TableRow
                  key={hire.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50"
                >
                  <TableCell className="py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {getInitials(hire.businessId.name)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-700 text-sm font-medium">
                          {hire.businessId.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {hire.businessId.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-green-600">
                          {getInitials(hire.expertId.name)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-700 text-sm font-medium">
                          {hire.expertId.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {hire.expertId.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 max-w-[200px]">
                    <div className="line-clamp-2 text-gray-700 text-sm">
                      {hire.description}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">
                    {hire.duration}
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm font-medium">
                    {formatCurrency(hire.budget)}
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">
                    {formatCurrency(hire.commissionDue)}
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap">
                    <Badge
                      className={`w-20 justify-center ${
                        statusStyles[
                          hire.hireStatus as keyof typeof statusStyles
                        ] || "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {hire.hireStatus
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">
                    {formatDate(hire.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <FolderOpenIcon className="h-12 w-12 text-gray-300 mb-2" />
                    <p>No hires found matching your criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredHires.length > 0 && (
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
              {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, hireData?.totalItems || 0)}{" "}
              of {hireData?.totalItems || 0}
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
}
