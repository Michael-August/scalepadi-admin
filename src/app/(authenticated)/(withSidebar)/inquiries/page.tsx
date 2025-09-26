"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Search,
  Trash2,
  User,
  Calendar,
  AlertTriangle,
  Loader2,
  X,
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
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Inquiry, useDeleteInquiry, useGetInquiries } from "@/hooks/useInquiry";

export default function InquiriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const limit = parseInt(rowsPerPage);
  const { inquiriesData, isLoading, isError } = useGetInquiries(
    currentPage,
    limit
  );
  const deleteInquiryMutation = useDeleteInquiry();

  const processedData = useMemo(() => {
    if (!inquiriesData?.data.data) return [];

    let filtered = inquiriesData.data.data;

    if (statusFilter !== "all") {
      filtered = filtered.filter((inquiry) =>
        statusFilter === "viewed" ? inquiry.viewed : !inquiry.viewed
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((inquiry) => {
        const fullName =
          `${inquiry.firstName} ${inquiry.lastName}`.toLowerCase();
        return (
          fullName.includes(searchLower) ||
          inquiry.email.toLowerCase().includes(searchLower) ||
          inquiry.note.toLowerCase().includes(searchLower)
        );
      });
    }

    if (dateFilter) {
      filtered = filtered.filter((inquiry) => {
        const inquiryDate = format(new Date(inquiry.createdAt), "yyyy-MM-dd");
        return inquiryDate === dateFilter;
      });
    }

    return filtered;
  }, [inquiriesData, statusFilter, searchTerm, dateFilter]);

  const statusCounts = useMemo(() => {
    if (!inquiriesData?.data.data) {
      return { total: 0, viewed: 0, unread: 0 };
    }

    const total = inquiriesData.data.data.length;
    const viewed = inquiriesData.data.data.filter(
      (inquiry) => inquiry.viewed
    ).length;
    const unread = total - viewed;

    return { total, viewed, unread };
  }, [inquiriesData]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (inquiriesData?.data.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setViewModalOpen(true);
  };

  const handleDeleteInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedInquiry) return;

    deleteInquiryMutation.mutate(selectedInquiry.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedInquiry(null);

        if (processedData.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      },
    });
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setViewModalOpen(false);
        setDeleteModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <p className="text-red-600">
              Error loading inquiries. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Stats */}
        <div className="flex flex-col md:flex-row md:items-end w-full justify-between gap-6">
          <div className="flex flex-col gap-2 w-full">
            <span className="text-sm text-[#878A93] font-medium">
              Total Inquiries:{" "}
              <span className="text-[#3E4351]">{statusCounts.total || 0}</span>
            </span>

            <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl grid md:grid-cols-3 w-full max-w-[500px] gap-4 p-4">
              <div className="border-b sm:border-b-0 sm:border-r w-full flex flex-col gap-2 border-[#EFF2F3] pb-4 sm:pb-0">
                <span className="text-2xl font-bold text-[#0E1426]">
                  {statusCounts.total}
                </span>
                <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-gray-400">
                  Total
                </span>
              </div>
              <div className="border-b sm:border-b-0 sm:border-r w-full flex flex-col gap-2 border-[#EFF2F3] pb-4 sm:pb-0">
                <span className="text-2xl font-bold text-[#0E1426]">
                  {statusCounts.viewed}
                </span>
                <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">
                  Viewed
                </span>
              </div>
              <div className="w-full flex flex-col gap-2">
                <span className="text-2xl font-bold text-[#0E4351]">
                  {statusCounts.unread}
                </span>
                <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#F2BB05]">
                  Unread
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full bg-white overflow-x-auto p-6 rounded-lg border border-gray-200">
          {/* Header */}
          <h1 className="text-xl md:text-2xl font-medium text-[#878A93] mb-6">
            Inquiry List
          </h1>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm border-gray-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All inquiries</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search inquiries"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-[200px] h-9 text-sm border-gray-300"
                />
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-[140px] h-9 text-sm border-gray-300"
                placeholder="Filter by date"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 min-w-[150px]">
                      Customer
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 min-w-[200px]">
                      Email
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 min-w-[250px]">
                      Note Preview
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 min-w-[100px]">
                      Status
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 min-w-[120px]">
                      Date
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 min-w-[80px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Proper skeleton loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-gray-100"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="h-8 bg-gray-200 rounded w-8 animate-pulse ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : processedData.length > 0 ? (
                    processedData.map((inquiry) => (
                      <TableRow
                        key={inquiry.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3 min-w-[150px]">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <User className="text-gray-600 h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-gray-900 text-sm font-medium block truncate">
                                {inquiry.firstName} {inquiry.lastName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 text-sm truncate block">
                              {inquiry.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 min-w-[250px] max-w-[300px]">
                          <span
                            className="text-gray-700 text-sm truncate block"
                            title={inquiry.note}
                          >
                            {inquiry.note.length > 50
                              ? `${inquiry.note.substring(0, 50)}...`
                              : inquiry.note}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 min-w-[100px]">
                          <Badge
                            variant="secondary"
                            className={`${
                              inquiry.viewed
                                ? "border border-[#04E762] text-[#04E762]"
                                : "border border-[#F2BB05] text-[#F2BB05]"
                            } text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent w-[70px] text-center flex justify-center`}
                          >
                            {inquiry.viewed ? "Viewed" : "Unread"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">
                              {format(
                                new Date(inquiry.createdAt),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 min-w-[80px] text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 ml-auto"
                              >
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewInquiry(inquiry)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteInquiry(inquiry)}
                                className="flex items-center gap-2 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
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
                        colSpan={6}
                        className="text-center py-12 text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <MessageSquare className="h-8 w-8 text-gray-300" />
                          <div>
                            <p className="font-medium">No inquiries found</p>
                            <p className="text-sm text-gray-400">
                              {searchTerm ||
                              statusFilter !== "all" ||
                              dateFilter
                                ? "Try adjusting your filters"
                                : "Get started by creating your first inquiry"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
                Page {currentPage} of {inquiriesData?.data.totalPages || 1}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage === (inquiriesData?.data.totalPages || 1)
                  }
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* View Modal */}
        {viewModalOpen && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Inquiry Details
                  </h3>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Name</p>
                      <p className="text-sm text-gray-900">
                        {selectedInquiry.firstName} {selectedInquiry.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-900">
                        {selectedInquiry.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Created
                      </p>
                      <p className="text-sm text-gray-900">
                        {format(
                          new Date(selectedInquiry.createdAt),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Status
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedInquiry.viewed ? "Viewed" : "Unread"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Inquiry Note
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedInquiry.note}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t flex justify-end">
                <Button
                  onClick={() => setViewModalOpen(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Inquiry
                  </h3>
                </div>

                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete the inquiry from{" "}
                  <strong>
                    {selectedInquiry.firstName} {selectedInquiry.lastName}
                  </strong>
                  ? This action cannot be undone.
                </p>

                <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4">
                  <p>
                    <strong>Email:</strong> {selectedInquiry.email}
                  </p>
                  <p>
                    <strong>Note:</strong>{" "}
                    {selectedInquiry.note.substring(0, 100)}...
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {format(new Date(selectedInquiry.createdAt), "MMM d, yyyy")}
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setDeleteModalOpen(false)}
                    disabled={deleteInquiryMutation.isPending}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    disabled={deleteInquiryMutation.isPending}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    {deleteInquiryMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete Inquiry
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// // Icon Components (since we don't have Lucide React)
// const SearchIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//   </svg>
// );

// const UserIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );

// const MailIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//   </svg>
// );

// const CalendarIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//   </svg>
// );

// const EyeIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// );

// const TrashIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//   </svg>
// );

// const XIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//   </svg>
// );

// const MessageSquareIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//   </svg>
// );

// const AlertTriangleIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
//   </svg>
// );

// const LoadingSpinner = () => (
//   <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
//     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//   </svg>
// );
