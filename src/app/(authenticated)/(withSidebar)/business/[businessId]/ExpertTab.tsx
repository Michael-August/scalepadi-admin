"use client";

import {
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import React, { useMemo } from "react";
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
import { useGetExpertPerformance, useGetExpertsCount } from "@/hooks/useExpert";
import { TableSkeleton } from "@/components/ui/table-skeleton";

interface Expert {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role?: string;
  status?: string;
  rating?: number;
  taskInvolvement?: number;
  performance?: any;
}

interface ExpertTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (rows: number) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: string;
  businessId: string;
}

// Component to handle individual expert performance
function ExpertRow({ expert }: { expert: any }) {
  const { expertPerformance, isLoading: performanceLoading } = useGetExpertPerformance(expert.id);

  // Calculate rating from performance data
  const rating = useMemo(() => {
    if (performanceLoading) return 0; // Default while loading
    if (expertPerformance?.data?.averageScore) {
      return expertPerformance.data.averageScore;
    }
    return 4.6; // Default if no performance data
  }, [expertPerformance, performanceLoading]);

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50/50">
      <TableCell className="py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {expert.profilePicture ? (
            <Image
              src={expert.profilePicture}
              alt={expert.name}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-xs font-medium text-purple-600">
                {expert.name.split(" ").map((part: string) => part[0]).join("").toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-gray-700 text-sm">
            {expert.name}
          </span>
        </div>
      </TableCell>

      <TableCell className="py-4 whitespace-nowrap">
        <span className="text-gray-900 text-sm">
          {expert.role}
        </span>
      </TableCell>

      <TableCell className="py-4 whitespace-nowrap">
        <Badge
          variant="outline"
          className={`w-20 justify-center ${
            expert.status === "Active" ? "bg-green-100 text-green-800" :
            expert.status === "Inactive" ? "bg-gray-100 text-gray-800" :
            "bg-yellow-100 text-yellow-800"
          }`}
        >
          {expert.status}
        </Badge>
      </TableCell>

      <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm flex items-center gap-0.5">
        <Star size={14} /> {performanceLoading ? "Loading..." : rating}
      </TableCell>
      <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">
        {expert.taskInvolvement} project{expert.taskInvolvement !== 1 ? 's' : ''}
      </TableCell>
      <TableCell className="py-4 whitespace-nowrap">
        <Button variant="outline" size="sm">
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function ExpertTab({
  searchQuery,
  setSearchQuery,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  statusFilter,
  setStatusFilter,
  sortBy,
  businessId,
}: ExpertTabProps) {
  const { expertsCount, isLoading, error } = useGetExpertsCount(
    businessId,
    currentPage, 
    itemsPerPage,
    statusFilter,
    sortBy,
    searchQuery
  );

  const expertsData = useMemo(() => {
    if (!expertsCount) return [];
    
    const expertsArray = Array.isArray(expertsCount) 
      ? expertsCount 
      : (expertsCount as any)?.data && Array.isArray((expertsCount as any).data)
        ? (expertsCount as any).data
        : [];
    
    return expertsArray.map((expert: any) => {
      const expertId = expert.expertId || expert.id || "";
      
      return {
        id: expertId,
        name: expert.name || "",
        email: expert.email || "",
        profilePicture: expert.profilePicture,
        role: expert.role || "Expert",
        status: expert.status || "Active",
        taskInvolvement: expert.count || 0,
      };
    });
  }, [expertsCount]);

  const filteredExperts = useMemo(() => {
    return expertsData.filter((expert: Expert) => {
      const matchesStatus =
        statusFilter === "all" || expert.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchQuery, expertsData]);

  const paginatedExperts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExperts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExperts, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredExperts.length / itemsPerPage);
  }, [filteredExperts, itemsPerPage]);

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

  if (isLoading) {
    return <TableSkeleton 
      columns={6} 
      rows={5} 
      headers={["Expert Name", "Role", "Status", "Rating", "Task Involvement", "Action"]}
    />;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading experts: {(error as Error).message}</div>;
  }

  return (
    <div className="flex flex-col gap-4 my-4">
      <div className="flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-3">
        <section aria-labelledby="expert-list-heading">
          <h2 id="expert-list-heading" className="sr-only">
            Expert List
          </h2>
          {/* Header */}
          <h1 className="text-2xl font-medium text-[#878A93] my-4">
            Experts list
          </h1>
          <p className="mb-4 font-montserrat text-sm">
            List of all experts who have worked with the business.
          </p>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] h-9 text-xs rounded-xl text-gray-500 border-gray-300">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
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
              onClick={() => exportToCSV(filteredExperts, "experts_list")}
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
                    Expert Name
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Role
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Rating
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Task Involvement
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedExperts.length > 0 ? (
                  paginatedExperts.map((expert: Expert) => (
                    <ExpertRow key={expert.id} expert={expert} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-4 text-center text-gray-500"
                    >
                      No experts found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredExperts.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
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
                <span className="text-sm text-gray-600">
                  {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
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