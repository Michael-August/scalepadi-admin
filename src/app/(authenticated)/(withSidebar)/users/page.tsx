"use client";

import {
  Download,
  UserPlus,
  CheckCircle,
  X,
  Loader,
  Info as InfoIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import { AdminUserList } from "@/app/data";
import { FilterDropdown, Pagination, SearchInput, UserTable } from "./User";

const roles = ["All roles", "Super Admin", "Admin", "Support", "Viewer"];
const statusFilters = ["All statuses", "Active", "Inactive", "Suspended"];

// Main Component
export default function UsersList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
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

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // const handlePreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

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
              <FilterDropdown
                options={roles}
                selectedValue={selectedRole}
                onSelect={(value) => {
                  setSelectedRole(value);
                  setCurrentPage(1);
                }}
                isOpen={showRoleFilter}
                onToggle={() => {
                  setShowRoleFilter(!showRoleFilter);
                  setShowStatusFilter(false);
                }}
              />

              {/* Status Filter */}
              <FilterDropdown
                options={statusFilters}
                selectedValue={selectedStatus}
                onSelect={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}
                isOpen={showStatusFilter}
                onToggle={() => {
                  setShowStatusFilter(!showStatusFilter);
                  setShowRoleFilter(false);
                }}
              />

              {/* Search */}
              <SearchInput
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value);
                  setCurrentPage(1);
                }}
              />
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
          <UserTable 
            data={paginatedData} 
            onEditUser={handleEditUser}
            onAction={handleAction}
          />

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalItems={filteredUsers.length}
              onPageChange={(page) => setCurrentPage(page)}
              onRowsPerPageChange={(rows) => setRowsPerPage(rows)}
            />
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