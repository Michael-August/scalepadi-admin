"use client";

import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";


const paymentsData = [
  {
    id: 1,
    type: "Project",
    business: "GreenMart",
    expert: "Ummni Abdullah",
    amount: "₦145,000",
    trxId: "8772HG",
    status: "Paid",
    date: "Dec 4, 2019",
    avatar: "/images/profile-pics.svg",
  },
  {
    id: 2,
    type: "Consultation",
    business: "Bella+",
    expert: "David Eze",
    amount: "₦12,000",
    trxId: "8772HG",
    status: "Pending",
    date: "Jul 4, 2019",
    avatar: "/images/profile-pics.svg",
  },
  {
    id: 3,
    type: "Project",
    business: "SubletAI+",
    expert: "Kasan Driah",
    amount: "₦12,000",
    trxId: "8772HG",
    status: "Funded (not released)",
    date: "Jul 4, 2019",
    avatar: "/images/profile-pics.svg",
  },
  {
    id: 4,
    type: "Subscription",
    business: "LandHub",
    expert: "Amina Lawal",
    amount: "₦25,000",
    trxId: "9821KL",
    status: "Paid",
    date: "Jan 15, 2020",
    expertAvatar: "/images/profile-pics.svg",
  },
  {
    id: 5,
    type: "Consultation",
    business: "TechFarm",
    expert: "John Okafor",
    amount: "₦18,500",
    trxId: "7563MN",
    status: "Pending",
    date: "Mar 22, 2020",
    expertAvatar: "/images/profile-pics.svg",
  },
  {
    id: 6,
    type: "Project",
    business: "FoodExpress",
    expert: "Sarah Johnson",
    amount: "₦85,000",
    trxId: "1234AB",
    status: "Paid",
    date: "Apr 10, 2020",
    expertAvatar: "/images/profile-pics.svg",
  },
  {
    id: 7,
    type: "Consultation",
    business: "HealthPlus",
    expert: "Michael Brown",
    amount: "₦15,000",
    trxId: "5678CD",
    status: "Pending",
    date: "May 5, 2020",
    expertAvatar: "/images/profile-pics.svg",
  },
  {
    id: 8,
    type: "Subscription",
    business: "EduTech",
    expert: "Emily Davis",
    amount: "₦30,000",
    trxId: "9012EF",
    status: "Paid",
    date: "Jun 18, 2020",
  },
  {
    id: 9,
    type: "Project",
    business: "AutoCare",
    expert: "Robert Wilson",
    amount: "₦120,000",
    trxId: "3456GH",
    status: "Funded (not released)",
    date: "Jul 22, 2020",
  },
  {
    id: 10,
    type: "Consultation",
    business: "FashionHub",
    expert: "Lisa Moore",
    amount: "₦22,000",
    trxId: "7890IJ",
    status: "Pending",
    date: "Aug 7, 2020",
  },
];

// Dummy data for Subscriptions tab
const subscriptionsData = [
  {
    id: 1,
    business: "GreenMart",
    plan: "Padi Pro",
    amount: "₦145,000",
    renewal: "Dec 4, 2019",
    status: "Active",
    avatar: "/images/profile-pics.svg",
  },
  {
    id: 2,
    business: "Bella+ Nigeria ltd.",
    plan: "Padi Yakata",
    amount: "₦12,000",
    renewal: "Jul 4, 2019",
    status: "Expired",
    avatar: "/images/profile-pics.svg",
  },
  {
    id: 3,
    business: "LandHub",
    plan: "Starter Free",
    amount: "₦0",
    renewal: "Jul 4, 2019",
    status: "Trial",
    avatar: "/images/profile-pics.svg",
  },
  {
    id: 4,
    business: "SubletAI+",
    plan: "Padi Pro",
    amount: "₦145,000",
    renewal: "Aug 10, 2020",
    status: "Active",
  },
  {
    id: 5,
    business: "TechFarm Solutions",
    plan: "Padi Basic",
    amount: "₦45,000",
    renewal: "Sep 5, 2020",
    status: "Active",
  },
  {
    id: 6,
    business: "FoodExpress",
    plan: "Padi Pro",
    amount: "₦145,000",
    renewal: "Oct 15, 2020",
    status: "Active",
  },
  {
    id: 7,
    business: "HealthPlus",
    plan: "Padi Basic",
    amount: "₦45,000",
    renewal: "Nov 2, 2020",
    status: "Expired",
  },
  {
    id: 8,
    business: "EduTech",
    plan: "Padi Yakata",
    amount: "₦12,000",
    renewal: "Dec 10, 2020",
    status: "Active",
  },
  {
    id: 9,
    business: "AutoCare",
    plan: "Starter Free",
    amount: "₦0",
    renewal: "Jan 5, 2021",
    status: "Trial",
  },
  {
    id: 10,
    business: "FashionHub",
    plan: "Padi Pro",
    amount: "₦145,000",
    renewal: "Feb 18, 2021",
    status: "Active",
  },
];

// Dummy data for Expert Payout tab
const expertPayoutData = [
  {
    id: 1,
    expert: "Ummni Abdullah",
    amount: "₦145,000",
    trxId: "PAY-8772HG",
    status: "Paid",
    date: "Dec 4, 2019",
    method: "Bank Transfer",
    type: "Project",
    avatar: "/images/profile-pics.svg",
  },
  {
    id: 2,
    expert: "David Eze",
    amount: "₦12,000",
    trxId: "PAY-7563MN",
    status: "Pending",
    date: "Jul 4, 2019",
    method: "PayPal",
    type: "Consultation",
    avatar: "/images/profile-pics.svg",
  },
  {
    id: 3,
    expert: "Kasan Driah",
    amount: "₦12,000",
    trxId: "PAY-9821KL",
    status: "Processing",
    date: "Jul 4, 2019",
    method: "Bank Transfer",
    type: "Subscription",
  },
  {
    id: 4,
    expert: "Amina Lawal",
    amount: "₦25,000",
    trxId: "PAY-3456PQ",
    status: "Paid",
    date: "Jan 15, 2020",
    method: "PayPal",
    type: "Email Fix",
    expertAvatar: "/images/profile-pics.svg",
  },
  {
    id: 5,
    expert: "John Okafor",
    amount: "₦18,500",
    trxId: "PAY-7890RS",
    status: "Failed",
    date: "Mar 22, 2020",
    method: "Bank Transfer",
    type: "Funnel Setup",
    expertAvatar: "/images/profile-pics.svg",
  },
  {
    id: 6,
    expert: "Sarah Johnson",
    amount: "₦85,000",
    trxId: "PAY-1234AB",
    status: "Paid",
    date: "Apr 10, 2020",
    method: "PayPal",
    type: "Project",
    expertAvatar: "/images/profile-pics.svg",
  },
  {
    id: 7,
    expert: "Michael Brown",
    amount: "₦15,000",
    trxId: "PAY-5678CD",
    status: "Processing",
    date: "May 5, 2020",
    method: "Bank Transfer",
    type: "Consultation",
  },
  {
    id: 8,
    expert: "Emily Davis",
    amount: "₦30,000",
    trxId: "PAY-9012EF",
    status: "Paid",
    date: "Jun 18, 2020",
    method: "PayPal",
    type: "Subscription",
  },
  {
    id: 9,
    expert: "Robert Wilson",
    amount: "₦120,000",
    trxId: "PAY-3456GH",
    status: "Pending",
    date: "Jul 22, 2020",
    method: "Bank Transfer",
    type: "Project",
  },
  {
    id: 10,
    expert: "Lisa Moore",
    amount: "₦22,000",
    trxId: "PAY-7890IJ",
    status: "Failed",
    date: "Aug 7, 2020",
    method: "PayPal",
    type: "Consultation",
  },
];

const statusStyles = {
  Paid: "bg-green-100/50 text-green-500/70 border border-green-500/70",
  Pending: "bg-yellow-100/50 text-yellow-500/70 border border-yellow-500/70",
  Processing: "bg-blue-100/50 text-blue-500/70 border border-blue-500/70",
  Failed: "bg-red-100/50 text-red-500/70 border border-red-500/70",
  "Funded (not released)":
    "bg-purple-100/50 text-purple-500/70 border border-purple-500/70",
  Active: "bg-green-100/50 text-green-500/70 border border-green-500/70",
  Expired: "bg-yellow-100/50 text-yellow-500/70 border border-yellow-500/70",
  Trial: "bg-gray-100/50 text-gray-500/70 border border-gray-500/70",
};

const tabs = [
  { label: "Payments", value: "payments" },
  { label: "Subscriptions", value: "subscriptions" },
  { label: "Expert Payout", value: "expertPayout" },
];

const paymentTypes = [
  "All payments",
  "Paid",
  "Pending",
  "Funded (not released)",
];

const payoutStatuses = [
  "All statuses",
  "Paid",
  "Pending",
  "Processing",
  "Failed",
];

const subscriptionStatuses = ["All statuses", "Active", "Expired", "Trial"];

export default function PaymentsMainContent() {
  const [activeTab, setActiveTab] = useState("payments");
  const [paymentType, setPaymentType] = useState("All payments");
  const [payoutStatus, setPayoutStatus] = useState("All statuses");
  const [subscriptionStatus, setSubscriptionStatus] = useState("All statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleAction = (id: number, action: string) => {
    console.log(`Action ${action} for row ${id}`);
  };

  const filteredPayments = useMemo(() => {
    return paymentsData.filter((payment) => {
      const matchesType =
        paymentType === "All payments" || payment.status === paymentType;
      const matchesSearch =
        searchQuery === "" ||
        payment.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.expert.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.trxId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [paymentType, searchQuery]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptionsData.filter((sub) => {
      const matchesStatus =
        subscriptionStatus === "All statuses" ||
        sub.status === subscriptionStatus;
      const matchesSearch =
        searchQuery === "" ||
        sub.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.plan.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [subscriptionStatus, searchQuery]);

  const filteredPayouts = useMemo(() => {
    return expertPayoutData.filter((payout) => {
      const matchesStatus =
        payoutStatus === "All statuses" || payout.status === payoutStatus;
      const matchesSearch =
        searchQuery === "" ||
        payout.expert.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payout.trxId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [payoutStatus, searchQuery]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredPayments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPayments, currentPage, rowsPerPage]);

  const paginatedSubscriptions = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredSubscriptions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSubscriptions, currentPage, rowsPerPage]);

  const paginatedPayouts = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredPayouts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPayouts, currentPage, rowsPerPage]);

  // Tab-specific total pages
  const totalPages = useMemo(() => {
    if (activeTab === "payments") return Math.ceil(filteredPayments.length / rowsPerPage);
    if (activeTab === "subscriptions") return Math.ceil(filteredSubscriptions.length / rowsPerPage);
    return Math.ceil(filteredPayouts.length / rowsPerPage);
  }, [activeTab, filteredPayments, filteredSubscriptions, filteredPayouts, rowsPerPage]);

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
    <div className="rounded-2xl bg-gray-100/50 p-3 font-montserrat">
      <main className="w-full px-2 py-6 bg-white min-h-[80vh] rounded-xl shadow-sm">
        {/* Tabs */}
        <nav aria-label="Payments tabs" className="mb-4">
          <ul className="flex gap-6 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <li key={tab.value}>
                <button
                  className={`py-2 px-4 md:px-6 font-montserrat text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.value
                      ? "border-b-2 border-blue-600/60 text-black"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                  aria-current={activeTab === tab.value ? "page" : undefined}
                  onClick={() => {
                    setActiveTab(tab.value);
                    setCurrentPage(1);
                    setSearchQuery("");
                    setSortConfig(null);
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tab Panels */}
        {activeTab === "payments" && (
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
            <div className="rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                      Payment type
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                      Business
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                      Expert
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
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                      Trx ID
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead
                      className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => requestSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowUpDown className="w-4 h-4" />
                        {sortConfig?.key === "date" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </div>
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
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
                            className={
                              statusStyles[
                                row.status as keyof typeof statusStyles
                              ]
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">{row.date}</TableCell>
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
        )}

        {activeTab === "subscriptions" && (
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
                onClick={() =>
                  exportToCSV(filteredSubscriptions, "subscriptions")
                }
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
                            <span className="text-gray-900 text-sm">{row.business}</span>
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
                        <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">{row.amount}</TableCell>
                        <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">{row.renewal}</TableCell>
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
                              statusStyles[
                                row.status as keyof typeof statusStyles
                              ]
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
        )}

        {activeTab === "expertPayout" && (
          <section aria-labelledby="expert-payout-heading">
            <h2 id="expert-payout-heading" className="sr-only">
              Expert Payouts
            </h2>
            <p className="mb-4 font-montserrat text-sm">
              Admin view of all payments released to experts.
            </p>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <Select
                  value={payoutStatus}
                  onValueChange={(value) => {
                    setPayoutStatus(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px] h-9 text-xs rounded-xl text-gray-500 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {payoutStatuses.map((status) => (
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
                onClick={() => exportToCSV(filteredPayouts, "expert_payouts")}
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
                      Expert
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                      Project
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
                      onClick={() => requestSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowUpDown className="w-4 h-4" />
                        {sortConfig?.key === "date" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </div>
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                      Transaction ID
                    </TableHead>
                    <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                      Method
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayouts.length > 0 ? (
                    paginatedPayouts.map((row) => (
                      <TableRow
                        key={row.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
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
                        <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">{row.amount}</TableCell>
                        <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">{row.date}</TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              row.status === "Paid"
                                ? "default"
                                : row.status === "Pending"
                                ? "secondary"
                                : "outline"
                            }
                            className={
                              statusStyles[
                                row.status as keyof typeof statusStyles
                              ]
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">{row.trxId}</TableCell>
                        <TableCell className="py-4 whitespace-nowrap text-gray-700 text-sm">{row.method}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-4 text-center text-gray-500"
                      >
                        No payouts found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredPayouts.length > 0 && (
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
                    {filteredPayouts.length === 0
                      ? 0
                      : (currentPage - 1) * rowsPerPage + 1}
                    -
                    {Math.min(
                      currentPage * rowsPerPage,
                      filteredPayouts.length
                    )}{" "}
                    of {filteredPayouts.length}
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
        )}
      </main>
    </div>
  );
}
