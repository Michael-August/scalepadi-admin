"use client";

import {
  MoreHorizontal,
  ArrowUpDown,
  Download,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  CheckCircle,
  X,
  Loader,
  Info as InfoIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Dummy data for Admin Users
const AdminUserList = [
  {
    id: 1,
    name: "Titi Ayomide",
    email: "titi@scalepadi.com",
    role: "Super Admin",
    lastActive: "2 hrs ago",
    status: "Active",
    phoneNumber: "23412345678",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@scalepadi.com",
    role: "Admin",
    lastActive: "1 day ago",
    status: "Active",
    phoneNumber: "23412345678",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@scalepadi.com",
    role: "Support",
    lastActive: "3 days ago",
    status: "Inactive",
    phoneNumber: "23412345678",
  },
  {
    id: 4,
    name: "Mike Johnson",
    email: "mike@scalepadi.com",
    role: "Viewer",
    lastActive: "1 week ago",
    status: "Active",
    phoneNumber: "23412345678",
  },
  {
    id: 5,
    name: "Sarah Williams",
    email: "sarah@scalepadi.com",
    role: "Admin",
    lastActive: "5 hours ago",
    status: "Active",
    phoneNumber: "23412345678",
  },
  {
    id: 6,
    name: "David Brown",
    email: "david@scalepadi.com",
    role: "Support",
    lastActive: "2 days ago",
    status: "Active",
    phoneNumber: "23412345678",
  },
  {
    id: 7,
    name: "Emily Davis",
    email: "emily@scalepadi.com",
    role: "Viewer",
    lastActive: "1 month ago",
    status: "Inactive",
    phoneNumber: "23412345678",
  },
  {
    id: 8,
    name: "Robert Wilson",
    email: "robert@scalepadi.com",
    role: "Admin",
    lastActive: "1 week ago",
    status: "Active",
    phoneNumber: "23412345678",
  },
  {
    id: 9,
    name: "Lisa Moore",
    email: "lisa@scalepadi.com",
    role: "Super Admin",
    lastActive: "3 days ago",
    status: "Active",
    phoneNumber: "23412345678",
  },
  {
    id: 10,
    name: "Thomas Taylor",
    email: "thomas@scalepadi.com",
    role: "Support",
    lastActive: "Just now",
    status: "Active",
    phoneNumber: "23412345678",
  },
];

const statusStyles = {
  Active: "bg-green-100/50 text-green-500/70 border border-green-500/70",
  Inactive: "bg-gray-100/50 text-gray-500/70 border border-gray-500/70",
  Suspended: "bg-red-100/50 text-red-500/70 border border-red-500/70",
};

const roleStyles = {
  "Super Admin":
    "bg-purple-100/50 text-purple-500/70 border border-purple-500/70",
  Admin: "bg-blue-100/50 text-blue-500/70 border border-blue-500/70",
  Support: "bg-yellow-100/50 text-yellow-500/70 border border-yellow-500/70",
  Viewer: "bg-gray-100/50 text-gray-500/70 border border-gray-500/70",
};

const roles = ["All roles", "Super Admin", "Admin", "Support", "Viewer"];
const statusFilters = ["All statuses", "Active", "Inactive", "Suspended"];

export default function UsersList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All roles");
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingUser, setEditingUser] = useState<
    (typeof AdminUserList)[0] | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Admin",
    status: "Active",
  });

  const handleAction = (id: number, action: string) => {
    setActiveDropdown(null);
    const user = AdminUserList.find((u) => u.id === id);
    if (!user) return;

    switch (action) {
      case "view":
        console.log(`Viewing user ${id}`);
        break;
      case "edit":
        handleEditUser(user);
        break;
      case "delete":
        console.log(`Deleting user ${id}`);
        break;
      case "suspend":
        console.log(`Suspending user ${id}`);
        break;
      default:
        console.log(`Action ${action} for user ${id}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdown !== null) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

  const filteredUsers = useMemo(() => {
    return AdminUserList.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        selectedRole === "All roles" || user.role === selectedRole;

      const matchesStatus =
        selectedStatus === "All statuses" || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchQuery, selectedRole, selectedStatus]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      const key = sortConfig.key as keyof typeof a;
      const aValue = a[key];
      const bValue = b[key];
      // Only compare if both values are string or number
      if ((typeof aValue === "string" && typeof bValue === "string") || (typeof aValue === "number" && typeof bValue === "number")) {
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      }
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

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

  const exportToCSV = (
  ) => {
    if (filteredUsers.length === 0) return;

    const headers = Object.keys(filteredUsers[0]);
    const csvRows = [];

    csvRows.push(headers.join(","));

    for (const user of filteredUsers) {
      const values = headers.map((header) => {
        const escaped = ("" + user[header as keyof typeof user]).replace(
          /"/g,
          '\\"'
        );
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
      `users_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddUser = () => {
    console.log("Adding new user:", newUser);
    setSuccessMessage(`Successfully added ${newUser.name} has been added as a ${newUser.role}. They've recieved an email with login access. You can update their permission or suspend their account anytime.`);
    setShowSuccessModal(true);
    setNewUser({
      name: "",
      email: "",
      role: "Admin",
      phone: "Admin",
      status: "Active",
    });
    setShowAddUserModal(false);
  };

  const handleEditUser = (user: (typeof AdminUserList)[0]) => {
    setEditingUser(user);
    setIsEditing(true);
    setShowAddUserModal(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    console.log("Updating user:", editingUser);
    setSuccessMessage(
      `Successfully updated ${editingUser.name}'s role to ${editingUser.role}`
    );
    setShowSuccessModal(true);
    setEditingUser(null);
    setIsEditing(false);
    setShowAddUserModal(false);
  };

  return (
    <div className="p-3 font-montserrat">
      <main className="w-full bg-white min-h-[80vh]">
        <section aria-labelledby="users-heading">
          <h2 id="users-heading" className="sr-only">
            Admin Users
          </h2>
          <h1 className="text-xs md:text-2xl text-gray-500 mb-2">
            Admin Users List
          </h1>
          <p className="mb-4 font-montserrat text-sm text-gray-600">
            Manage admin users and their permissions
          </p>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center xl:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Role Filter */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRoleFilter(!showRoleFilter);
                    setShowStatusFilter(false);
                  }}
                >
                  {selectedRole}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showRoleFilter ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showRoleFilter && (
                  <div className="absolute z-10 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg">
                    {roles.map((role) => (
                      <button
                        key={role}
                        className={`w-full text-left px-4 py-2 text-xs first:rounded-t-xl last:rounded-b-xl ${
                          selectedRole === role
                            ? "bg-gray-100 text-gray-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSelectedRole(role);
                          setShowRoleFilter(false);
                          setCurrentPage(1);
                        }}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusFilter(!showStatusFilter);
                    setShowRoleFilter(false);
                  }}
                >
                  {selectedStatus}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showStatusFilter ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showStatusFilter && (
                  <div className="absolute z-10 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg">
                    {statusFilters.map((status) => (
                      <button
                        key={status}
                        className={`w-full text-left px-4 py-2 text-xs first:rounded-t-xl last:rounded-b-xl ${
                          selectedStatus === status
                            ? "bg-gray-100 text-gray-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowStatusFilter(false);
                          setCurrentPage(1);
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 pr-4 py-2.5 w-full md:w-36 text-xs border border-gray-200 rounded-xl outline-none transition-colors"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end items-center gap-3">
              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <Download className="w-3 h-3" />
                Export CSV
              </button>

              {/* Add User Button */}
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-2 px-4 py-3 text-xs text-white bg-blue-900/90 rounded-xl transition-colors whitespace-nowrap"
              >
                <UserPlus className="w-3 h-3" />
                Add New User
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-left font-medium text-gray-500 tracking-wider whitespace-nowrap">
                    Admin Name
                  </TableHead>
                  <TableHead className="text-left font-medium text-gray-500 tracking-wider whitespace-nowrap">
                    Email
                  </TableHead>
                  <TableHead
                    className="text-left font-medium text-gray-500 tracking-wider cursor-pointer whitespace-nowrap"
                    onClick={() => requestSort("role")}
                  >
                    <div className="flex items-center gap-1">
                      Role
                      <ArrowUpDown className="w-3 h-3" />
                      {sortConfig?.key === "role" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-left font-medium text-gray-500 tracking-wider cursor-pointer whitespace-nowrap"
                    onClick={() => requestSort("lastActive")}
                  >
                    <div className="flex items-center gap-1">
                      Last Active Status
                      <ArrowUpDown className="w-3 h-3" />
                      {sortConfig?.key === "lastActive" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-left font-medium text-gray-500 tracking-wider whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="text-left font-medium text-gray-500 tracking-wider whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  paginatedData.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 text-xs font-medium">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-500">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1.5 inline-flex text-[13px] leading-5 font-semibold rounded-full ${
                            roleStyles[user.role as keyof typeof roleStyles] ||
                            "bg-gray-100 text-gray-800 border border-gray-900"
                          }`}
                        >
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-gray-500">
                        {user.lastActive}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusStyles[
                              user.status as keyof typeof statusStyles
                            ]
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-center text-sm font-medium">
                        <div className="relative">
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
                              <DropdownMenuItem onClick={() => router.push(`/users/${user.id}`)}>
                                View profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                Chat
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                Assign Task
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                Edit Role
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleAction(user.id, "suspend")}
                              >
                                Suspend
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No users found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Rows per page</span>
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
                  {filteredUsers.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}-
                  {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length}
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
      </main>

      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setIsEditing(false);
                  setEditingUser(null);
                }}
                className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 border"
              >
                <X className="text-xs text-gray-600" size={17} />
              </button>
            </div>
            <h3 className="text-sm md:text-xl font-semibold text-blue-900/90 mb-4 capitalize">
              {isEditing ? "Edit Admin Data" : "New Admin Account Creation"}
            </h3>

            <div className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Yusuf Musa"
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none placeholder:text-sm"
                  value={isEditing ? editingUser?.name || "" : newUser.name}
                  onChange={(e) =>
                    isEditing
                      ? setEditingUser({
                          ...editingUser!,
                          name: e.target.value,
                        })
                      : setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email<span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Yusuf@scalepadi.com"
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none placeholder:text-sm"
                  value={isEditing ? editingUser?.email || "" : newUser.email}
                  onChange={(e) =>
                    isEditing
                      ? setEditingUser({
                          ...editingUser!,
                          email: e.target.value,
                        })
                      : setNewUser({ ...newUser, email: e.target.value })
                  }
                  disabled={isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number<span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Image
                    src={"/icons/nigeriaflag.svg"}
                    alt="nigeria flag"
                    width={1}
                    height={1}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="+234 234567809"
                    className="pl-8 pr-4 p-3 w-full text-sm border border-gray-200 rounded-xl outline-none transition-colors"
                    value={
                      isEditing ? editingUser?.phoneNumber || "" : newUser.phone
                    }
                    onChange={(e) =>
                      isEditing
                        ? setEditingUser({
                            ...editingUser!,
                            phoneNumber: e.target.value,
                          })
                        : setNewUser({ ...newUser, phone: e.target.value })
                    }
                    disabled={isEditing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Set Role<span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full px-3 py-3 text-gray-500 border border-gray-300 rounded-xl outline-none placeholder:text-sm"
                  value={
                    isEditing ? editingUser?.role || "Admin" : newUser.role
                  }
                  onChange={(e) =>
                    isEditing
                      ? setEditingUser({
                          ...editingUser!,
                          role: e.target.value,
                        })
                      : setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Support">Support</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <p className="text-gray-500 text-xs flex items-center mt-4">
                <InfoIcon size={12} className="mr-2" /> Reviews and approves
                expert profiles. Cannot access billing or assign experts.
              </p>

              <div className="mt-6 flex justify-start space-x-3">
                <button
                  onClick={isEditing ? handleUpdateUser : handleAddUser}
                  className="flex items-center px-4 py-3 text-sm text-white bg-blue-800/90 rounded-xl hover:bg-blue-900/80"
                >
                  {isEditing ? "Update User" : "Send Invite"}{" "}
                  <Loader
                    size={15}
                    className={`ml-2 ${isEditing && `animate-spin`}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl px-6 py-10 w-full max-w-xl mx-4">
             <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 border"
              >
                <X className="text-xs text-gray-600" size={17} />
              </button>
            </div>
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
              <h3 className="text-sm md:text-2xl font-bold text-gray-900 mb-2">
                Admin Added Successfully
              </h3>
              <p className="text-lg text-gray-600 px-5 text-center mb-4">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 text-sm text-yellow-300 bg-black/90 rounded-xl"
              >
                Go to Admin List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}