// UsersListPage.tsx - Main parent component for managing admin users
"use client";

import {
  Download,
  UserPlus,
  CheckCircle,
  X,
  Loader,
  Info as InfoIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  FilterDropdown,
  Pagination,
  SearchInput,
  UserTable,
  type AdminUser,
} from "./User";
import {
  useCreateAdmin,
  useGetAdminList,
  useUpdateAdminBySuperAdmin,
} from "@/hooks/useAuth";


const ROLES = ["All roles", "super", "ops", "support", "vetting", "finance"] as const;
const STATUS_FILTERS = ["All statuses", "active", "inactive", "Suspended"] as const;

const ROLE_DESCRIPTIONS: Record<string, string> = {
  super: "Full system access. Can manage all users and settings.",
  ops: "Manages operations and day-to-day activities.",
  support: "Handles user support and customer service.",
  vetting: "Reviews and approves expert profiles. Cannot access billing or assign experts.",
  finance: "Manages financial operations and billing.",
};

const INITIAL_USER_STATE = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "",
  status: "active",
};

const validateUserForm = (user: typeof INITIAL_USER_STATE, isEditing: boolean) => {
  if (!user.name.trim()) {
    toast.error("Name is required");
    return false;
  }
  if (!user.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    toast.error("Valid email is required");
    return false;
  }
  if (!isEditing && !user.password.trim()) {
    toast.error("Password is required");
    return false;
  }
  if (!isEditing && user.password.length < 8) {
    toast.error("Password must be at least 8 characters");
    return false;
  }
  if (!user.role) {
    toast.error("Role is required");
    return false;
  }
  return true;
};

const exportToCSV = (data: AdminUser[]) => {
  if (data.length === 0) {
    toast.error("No data to export");
    return;
  }

  const headers = ["ID", "Name", "Email", "Phone", "Role", "Status", "Last Login"];
  const csvRows = [headers.join(",")];

  data.forEach((user) => {
    const values = [
      user.id,
      `"${user.name}"`,
      `"${user.email}"`,
      `"${user.phone || ""}"`,
      user.role,
      user.status,
      `"${user.lastLogin}"`,
    ];
    csvRows.push(values.join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `admin_users_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success("CSV exported successfully");
};

export default function UsersListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All roles");
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { AdminUserList, isLoading } = useGetAdminList(
    currentPage,
    rowsPerPage,
    selectedStatus,
    searchQuery,
    selectedRole
  );
  const { createAdmin, isPending: isCreating } = useCreateAdmin();
  const { updateAdminBySuperAdmin, isPending: isUpdating } = useUpdateAdminBySuperAdmin();

  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [newUser, setNewUser] = useState(INITIAL_USER_STATE);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const admins = useMemo(() => {
    return AdminUserList?.data || [];
  }, [AdminUserList?.data]);

  const totalPages = AdminUserList?.totalPages || 0;
  const totalItems = AdminUserList?.totalItems || 0;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleRoleSelect = useCallback((value: string) => {
    setSelectedRole(value);
    setCurrentPage(1);
  }, []);

  const handleStatusSelect = useCallback((value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setNewUser(INITIAL_USER_STATE);
    setEditingUser(null);
    setIsEditing(false);
    setShowAddUserModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddUserModal(false);
    setIsEditing(false);
    setEditingUser(null);
    setNewUser(INITIAL_USER_STATE);
  }, []);

  const handleEditUser = useCallback((user: AdminUser) => {
    setEditingUser(user);
    setIsEditing(true);
    setShowAddUserModal(true);
  }, []);

  const handleAddUser = useCallback(() => {
    if (!validateUserForm(newUser, false)) return;

    createAdmin(newUser, {
      onSuccess: () => {
        const message = `Successfully added ${newUser.name} as a ${newUser.role}. They've received an email with login access. You can update their permission or suspend their account anytime.`;
        toast.success(`Successfully added ${newUser.name} as ${newUser.role}`);
        setSuccessMessage(message);
        setShowSuccessModal(true);
        handleCloseModal();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create admin user");
      },
    });
  }, [newUser, createAdmin, handleCloseModal]);

  const handleUpdateUser = useCallback(() => {
    if (!editingUser) return;

    if (!editingUser.role) {
      toast.error("Role is required");
      return;
    }

    updateAdminBySuperAdmin(
      {
        id: String(editingUser.id),
        role: editingUser.role,
      },
      {
        onSuccess: () => {
          const message = `Successfully updated ${editingUser.name}'s role to ${editingUser.role}`;
          toast.success(message);
          setSuccessMessage(message);
          setShowSuccessModal(true);
          handleCloseModal();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update admin user");
        },
      }
    );
  }, [editingUser, updateAdminBySuperAdmin, handleCloseModal]);

  const handleAction = useCallback(
    (id: number, action: string) => {
      if (!Array.isArray(AdminUserList?.data)) return;

      const user = AdminUserList.data.find((u: AdminUser) => u.id === id);
      if (!user) return;

      switch (action) {
        case "suspend":
          toast.info(`Suspend functionality for ${user.name} - To be implemented`);
          break;
        default:
          console.log(`Action ${action} for user ${id}`);
      }
    },
    [AdminUserList]
  );

  const handleExportCSV = useCallback(() => {
    exportToCSV(admins);
  }, [admins]);

  const getRoleDescription = (role: string) => {
    return ROLE_DESCRIPTIONS[role] || "Manage specific admin functions.";
  };

  return (
    <div className="p-3 font-montserrat">
      <main className="w-full bg-white min-h-[80vh]">
        <section aria-labelledby="users-heading">
          <h2 id="users-heading" className="sr-only">
            Admin Users
          </h2>
          <h1 className="text-xs md:text-2xl text-gray-500 mb-2">
            Admin List
          </h1>
          <p className="mb-4 font-montserrat text-sm text-gray-600">
            Manage admin users and their permissions
          </p>

          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row md:items-center xl:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <FilterDropdown
                options={ROLES}
                selectedValue={selectedRole}
                onSelect={handleRoleSelect}
                isOpen={showRoleFilter}
                onToggle={() => {
                  setShowRoleFilter(!showRoleFilter);
                  setShowStatusFilter(false);
                }}
              />

              <FilterDropdown
                options={STATUS_FILTERS}
                selectedValue={selectedStatus}
                onSelect={handleStatusSelect}
                isOpen={showStatusFilter}
                onToggle={() => {
                  setShowStatusFilter(!showStatusFilter);
                  setShowRoleFilter(false);
                }}
              />

              <SearchInput value={searchQuery} onChange={handleSearchChange} />
            </div>

            <div className="flex justify-end items-center gap-3">
              {/* <button
                onClick={handleExportCSV}
                disabled={filteredUsers.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-3 h-3" />
                Export CSV
              </button> */}

              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-3 text-white hover:text-black text-xs rounded-md bg-primary hover:bg-primary-hover transition-colors whitespace-nowrap"
              >
                <UserPlus className="w-3 h-3" />
                Add New User
              </button>
            </div>
          </div>

          {/* Table */}
          <UserTable
            isLoading={isLoading}
            data={admins}
            onEditUser={handleEditUser}
            onAction={handleAction}
          />

          {/* Pagination */}
          {admins.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(value) => {
                setRowsPerPage(value);
                setCurrentPage(1);
              }}
            />
          )}
        </section>
      </main>

      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 border transition-colors"
                aria-label="Close modal"
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
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none placeholder:text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                  value={isEditing ? editingUser?.name || "" : newUser.name}
                  onChange={(e) =>
                    isEditing
                      ? setEditingUser({ ...editingUser!, name: e.target.value })
                      : setNewUser({ ...newUser, name: e.target.value })
                  }
                  disabled={isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email<span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="yusuf@scalepadi.com"
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none placeholder:text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                  value={isEditing ? editingUser?.email || "" : newUser.email}
                  onChange={(e) =>
                    isEditing
                      ? setEditingUser({ ...editingUser!, email: e.target.value })
                      : setNewUser({ ...newUser, email: e.target.value })
                  }
                  disabled={isEditing}
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password<span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="*********"
                      className="w-full p-3 pr-10 border border-gray-300 rounded-xl outline-none placeholder:text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number<span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Image
                    src="/icons/nigeriaflag.svg"
                    alt="Nigeria flag"
                    width={16}
                    height={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  <input
                    type="tel"
                    placeholder="+234 234567809"
                    className="pl-10 pr-4 p-3 w-full text-sm border border-gray-300 rounded-xl outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                    value={isEditing ? editingUser?.phone || "" : newUser.phone}
                    onChange={(e) =>
                      isEditing
                        ? setEditingUser({ ...editingUser!, phone: e.target.value })
                        : setNewUser({ ...newUser, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Set Role<span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full px-3 py-3 text-gray-500 border border-gray-300 rounded-xl outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                  value={isEditing ? editingUser?.role || "" : newUser.role}
                  onChange={(e) => {
                    const selectedRole = e.target.value as AdminUser["role"];
                    isEditing
                      ? setEditingUser({ ...editingUser!, role: selectedRole })
                      : setNewUser({ ...newUser, role: selectedRole });
                  }}
                >
                  <option value="">Select a role</option>
                  <option value="super">Super Admin</option>
                  <option value="ops">Ops Admin</option>
                  <option value="support">Support</option>
                  <option value="vetting">Vetting Admin</option>
                  <option value="finance">Finance Admin</option>
                </select>
              </div>

              <p className="text-gray-500 text-xs flex items-start mt-4">
                <InfoIcon size={12} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  {(isEditing ? editingUser?.role : newUser.role)
                    ? getRoleDescription(isEditing ? editingUser?.role || "" : newUser.role)
                    : "Select a role to see description"}
                </span>
              </p>

              <div className="mt-6 flex justify-start space-x-3">
                <button
                  onClick={isEditing ? handleUpdateUser : handleAddUser}
                  disabled={isCreating || isUpdating}
                  className="flex items-center px-6 py-3 text-sm text-white bg-blue-800/90 rounded-xl hover:bg-blue-900/80 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="flex items-center">
                    {isEditing ? "Update User" : "Send Invite"}
                    {(isCreating || isUpdating) && (
                      <Loader size={15} className="ml-2 animate-spin" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl px-6 py-10 w-full max-w-xl mx-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 border transition-colors"
                aria-label="Close success modal"
              >
                <X className="text-xs text-gray-600" size={17} />
              </button>
            </div>
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
              <h3 className="text-sm md:text-2xl font-bold text-gray-900 mb-2">
                {isEditing ? "Admin Updated Successfully" : "Admin Added Successfully"}
              </h3>
              <p className="text-base md:text-lg text-gray-600 px-5 text-center mb-6">
                {successMessage}
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 py-3 text-sm text-yellow-300 bg-black/90 rounded-xl hover:bg-black transition-colors"
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