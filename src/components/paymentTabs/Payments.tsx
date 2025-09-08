"use client";

import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown, Download, Search, ChevronLeft, ChevronRight, FolderOpenIcon } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { paymentTypes, statusStyles } from "@/app/data";
import { useGetAllPayment } from "@/hooks/usePayment";

interface PaymentsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
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
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleAction = (id: number, action: string) => {
    console.log(`Action ${action} for row ${id}`);
  };

  const { paymentList, isLoading } = useGetAllPayment();
  const filteredPayments = useMemo(() => {
    const dummyPayments = [
      {
        id: 1,
        type: "Milestone",
        business: "Acme Corp",
        expert: "John Doe",
        amount: "₦10,000",
        trxId: "TRX123456",
        status: "Paid",
        date: "2025-08-29T10:45:46.870Z",
        avatar: "",
        expertAvatar: ""
      },
      {
        id: 2,
        type: "Project",
        business: "Beta Ltd",
        expert: "Jane Smith",
        amount: "₦5,000",
        trxId: "TRX654321",
        status: "Pending",
        date: "2025-08-28T10:45:46.870Z",
        avatar: "",
        expertAvatar: ""
      },
      {
        id: 3,
        type: "Milestone",
        business: "Gamma Inc",
        expert: "Alice Brown",
        amount: "₦7,500",
        trxId: "TRX789012",
        status: "Paid",
        date: "2025-08-27T10:45:46.870Z",
        avatar: "",
        expertAvatar: ""
      }
    ];
    const source = Array.isArray(paymentList) && paymentList.length > 0 ? paymentList : dummyPayments;
    let filtered = source.filter((payment) => {
      const matchesType =
        paymentType === "All payments" || payment.status === paymentType;
      const matchesSearch =
        searchQuery === "" ||
        payment.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.expert.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.trxId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });

    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const { key, direction } = sortConfig;
        type PaymentKey = "type" | "business" | "expert" | "amount" | "trxId" | "status" | "date";
        if (!( ["type", "business", "expert", "amount", "trxId", "status", "date"].includes(key) )) return 0;
        const aValue = (a as Record<PaymentKey, unknown>)[key as PaymentKey];
        const bValue = (b as Record<PaymentKey, unknown>)[key as PaymentKey];
        let aSort = aValue;
        let bSort = bValue;
        if (key === "amount") {
          aSort = typeof aSort === "string" ? parseFloat(aSort.replace(/[^\d.]/g, "")) : aSort;
          bSort = typeof bSort === "string" ? parseFloat(bSort.replace(/[^\d.]/g, "")) : bSort;
        }
        if (key === "date") {
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
          return direction === "asc" ? aSort.getTime() - bSort.getTime() : bSort.getTime() - aSort.getTime();
        }
        return 0;
      });
    }
    return filtered;
  }, [paymentList, paymentType, searchQuery, sortConfig]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredPayments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPayments, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredPayments.length / rowsPerPage);
  }, [filteredPayments, rowsPerPage]);

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
    <section aria-labelledby="payments-heading">
      <h2 id="payments-heading" className="sr-only">
        Payments
      </h2>
      <p className="mb-4 font-montserrat text-sm">
        Track and manage all milestone / project payments for expert
        projects.
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
              placeholder="Search"
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
          onClick={() => exportToCSV(filteredPayments, "payments")}
        >
          <Download className="h-3 w-3 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-x-auto lg:w-[82%] xl:w-full">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading payments...</div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-[#878A93] font-medium text-sm py-4 ">
                Payment type
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4 ">
                Business
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4">
                Expert
              </TableHead>
              <TableHead
                className="text-[#878A93] font-medium text-sm py-4 cursor-pointer"
                onClick={() => requestSort("amount")}
              >
                <div className="flex items-center gap-1">
                  Amount
                  <ArrowUpDown className="w-4 h-4" />
                  {sortConfig?.key === "amount" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </div>
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4">
                Trx ID
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4">
                Status
              </TableHead>
              <TableHead
                className="text-[#878A93] font-medium text-sm py-4 cursor-pointer"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date
                  <ArrowUpDown className="w-4 h-4" />
                  {sortConfig?.key === "date" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </div>
              </TableHead>
              <TableHead className="text-[#878A93] font-medium text-sm py-4">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50"
                >
                  <TableCell className="py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          row.status === "Paid"
                            ? "default"
                            : row.status === "Pending"
                            ? "secondary"
                            : "outline"
                        }
                        className={`${
                          statusStyles[
                            row.status as keyof typeof statusStyles
                          ]
                        } px-0 py-0 rounded-none border-0`}
                      >
                        <FolderOpenIcon size={22} />
                      </Badge>
                      <span className="text-gray-900 text-sm">{row.type}</span>
                    </div>
                  </TableCell>
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
                      <span className="text-gray-900 text-sm">{row.business}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {row.expertAvatar ? (
                        <Image
                          src={row.expertAvatar}
                          alt={row.expert}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-purple-600">
                            {getInitials(row.expert)}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-700 text-sm">{row.expert}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">{row.amount}</TableCell>
                  <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">{row.trxId}</TableCell>
                  <TableCell className="py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        row.status === "Paid"
                          ? "default"
                          : row.status === "Pending"
                          ? "secondary"
                          : "outline"
                      }
                      className={`w-16 justify-center
                        ${statusStyles[
                          row.status as keyof typeof statusStyles
                        ]}`
                      }
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">{new Date(row.date).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell className="py-4 whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction(row.id, "view")}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(row.id, "edit")}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleAction(row.id, "delete")}> 
                          <Trash2 className="w-4 h-4 mr-2" />
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
                  className="py-4 text-center text-gray-500"
                >
                  No payments found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        )}
      </div>

      {/* Pagination */}
      {filteredPayments.length > 0 && (
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
              {filteredPayments.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
              -
              {Math.min(
                currentPage * rowsPerPage,
                filteredPayments.length
              )}{" "}
              of {filteredPayments.length}
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