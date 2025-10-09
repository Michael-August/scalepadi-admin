"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  MoreHorizontal,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useGetAllBusiness, useSearchBusiness } from "@/hooks/useBusiness";
import { Skeleton } from "@/components/ui/skeleton";

export type BusinessType = {
  id: string;
  name: string;
  title: string;
  email: string;
  status: "active" | "inactive";
  verified: boolean;
  createdAt: string;
};

const Business = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all-business");
  const [sortFilter, setSortFilter] = useState("sort");
  const [dateFilter, setDateFilter] = useState<string>("");

  const router = useRouter();
  const { businessList, isLoading } = useGetAllBusiness(
    currentPage,
    parseInt(rowsPerPage)
  );
  const [query, setQuery] = useState("");

  const { businessList: searchResults } = useSearchBusiness(
    searchTerm,
    currentPage,
    parseInt(rowsPerPage)
  );
  const activeData = searchTerm ? searchResults : businessList;

  const filteredData: BusinessType[] =
    activeData?.data?.data?.filter((business: BusinessType) => {
      const matchesStatus =
        statusFilter === "all-business" ||
        (statusFilter === "verified" && business.verified) ||
        (statusFilter === "pending" && !business.verified) ||
        (statusFilter === "active" && business.status === "active") ||
        (statusFilter === "inactive" && business.status === "inactive");

      const matchesDate =
        !dateFilter ||
        new Date(business.createdAt).toLocaleDateString("en-CA") === dateFilter;

      return matchesStatus && matchesDate;
    }) || [];

  const sortedData = [...filteredData].sort(
    (a: BusinessType, b: BusinessType) => {
      if (sortFilter === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortFilter === "date") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    }
  );

  const totalBusinesses = businessList?.data?.totalItems || 0;
  const verifiedCount =
    businessList?.data?.data?.filter((b: BusinessType) => b.verified).length ||
    0;
  const inactiveCount =
    businessList?.data?.data?.filter(
      (b: BusinessType) => b.status === "inactive"
    ).length || 0;
  const activeCount =
    businessList?.data?.data?.filter((b: BusinessType) => b.status === "active")
      .length || 0;

  const handlePageChange = (direction: "next" | "prev") => {
    if (
      direction === "next" &&
      currentPage < (businessList?.data?.totalPages || 1)
    ) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortFilter, rowsPerPage, dateFilter]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-end w-full lg:w-[88%] xl:w-full justify-between gap-6">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-sm text-[#878A93] font-medium">
            Total Registered Businesses:{" "}
            <span className="text-[#3E4351]">{totalBusinesses}</span>
          </span>
          <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex flex-col sm:flex-row gap-6 p-4">
            <div className="border-r sm:w-1/3 w-full flex flex-col gap-4 border-[#EFF2F3]">
              <span className="text-2xl font-bold text-[#0E1426]">
                {verifiedCount}
              </span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">
                Verified
              </span>
            </div>
            <div className="border-r sm:w-1/3 w-full flex flex-col gap-4 border-[#EFF2F3]">
              <span className="text-2xl font-bold text-[#0E1426]">
                {inactiveCount}
              </span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary-hover">
                Inacive Business
              </span>
            </div>
            <div className="sm:w-1/3 w-full flex flex-col gap-4">
              <span className="text-2xl font-bold text-[#0E1426]">
                {activeCount}
              </span>
              <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">
                Active Business
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg shadow-sm">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-medium text-[#878A93] mb-6">
          Business List
        </h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-business">All Business</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortFilter} onValueChange={setSortFilter}>
              <SelectTrigger className="w-[80px] h-9 text-sm border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sort">Sort</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex items-center gap-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search business"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 w-[200px] h-9 text-sm border-gray-300"
              />
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setSearchTerm(query); // trigger search
                  setCurrentPage(1); // reset to page 1
                }}
              >
                Search
              </Button>
            </div>

            <div className="relative">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-[160px] h-9 text-sm border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden lg:w-[88%] xl:w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Business name
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Owner
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Email
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Status
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Date Joined
                </TableHead>
                <TableHead className="text-[#878A93] font-medium text-sm py-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: parseInt(rowsPerPage) }).map(
                  (_, index) => (
                    <TableRow key={index}>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : sortedData.length > 0 ? (
                sortedData.map((business: BusinessType) => (
                  <TableRow
                    onClick={() => router.push(`/business/${business.id}`)}
                    key={business.id}
                    className="border-b border-gray-100 truncate cursor-pointer hover:bg-gray-50/50"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                          <FolderOpen
                            className={
                              business.verified
                                ? "text-[#04E762]"
                                : "text-[#F2BB05]"
                            }
                          />
                        </div>
                        <span className="text-gray-900 text-sm">
                          {business.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {business.name}
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {business.email}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={business.verified ? "default" : "secondary"}
                        className={
                          business.verified
                            ? "border border-[#04E762] text-[#04E762] text-xs font-normal px-2 py-1 bg-transparent"
                            : "border border-[#F2BB05] text-[#F2BB05] text-xs font-normal px-2 py-1 bg-transparent"
                        }
                      >
                        {business.verified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4">
                      {new Date(business.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          // hour: "2-digit",
                          // minute: "2-digit",
                        }
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          {/* <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No businesses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page</span>
            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
              <SelectTrigger className="w-16 h-8 text-sm border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {currentPage} of {businessList?.data?.totalPages || 1}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 text-gray-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange("next")}
                disabled={
                  currentPage === (businessList?.data?.totalPages || 1) ||
                  isLoading
                }
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;
