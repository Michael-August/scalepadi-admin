// Simple User Table Component
"use client";

import {
  MoreHorizontal,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import { ActiveStatus } from "@/components/ui/ActiveStatus";
import React from "react";
import Skeleton from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css';

// AdminUser type definition
type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "super" | "ops" | "support" | "vetting" | "finance" | string;
  lastLogin: string;
  status: "active" | "Inactive" | "Suspended" | string;
};

const statusStyles = {
  active: "bg-green-100/50 text-green-500/70 border border-green-500/70",
  inactive: "bg-gray-100/50 text-gray-500/70 border border-gray-500/70",
  Suspended: "bg-red-100/50 text-red-500/70 border border-red-500/70",
};

const roleStyles = {
  super: "bg-green-100/50 text-green-500/70 border border-green-500/70",
  ops: "bg-pink-100/50 text-pink-500/70 border border-pink-500/70",
  support: "bg-purple-100/50 text-purple-500/70 border border-purple-500/70",
  finance: "bg-blue-100/50 text-blue-500/70 border border-blue-500/70",
  vetting: "bg-orange-100/50 text-orange-500/70 border border-orange-500/70",
};

// UserTable Component
// UserTable Component with isLoading and skeleton support
export const UserTable = ({
  data,
  isLoading,
  onEditUser,
  onAction,
}: {
  data: AdminUser[];
  isLoading: boolean;
  onEditUser: (user: AdminUser) => void;
  onAction: (id: number, action: string) => void;
}) => {
  const router = useRouter();

  const renderSkeletonRow = () => (
    <TableRow>
      <TableCell className="whitespace-nowrap">
        <Skeleton width={100} height={16} />
      </TableCell>
      <TableCell>
        <Skeleton width={150} height={16} />
      </TableCell>
      <TableCell>
        <Skeleton width={80} height={16} />
      </TableCell>
      <TableCell>
        <Skeleton width={120} height={16} />
      </TableCell>
      <TableCell>
        <Skeleton width={80} height={16} />
      </TableCell>
      <TableCell>
        <Skeleton width={40} height={16} />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm lg:w-[88%] xl:w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-left font-medium text-gray-500 tracking-wider whitespace-nowrap">
              Admin Name
            </TableHead>
            <TableHead className="text-left font-medium text-gray-500 tracking-wider whitespace-nowrap">
              Email
            </TableHead>
            <TableHead className="text-left font-medium text-gray-500 tracking-wider whitespace-nowrap">
              Role
            </TableHead>
            <TableHead className="text-left font-medium text-gray-500 tracking-wider whitespace-nowrap">
              Last Active Status
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
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, idx) => (
                <React.Fragment key={idx}>{renderSkeletonRow()}</React.Fragment>
              ))}
            </>
          ) : data.length > 0 ? (
            data.map((user) => (
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
                    className={`px-2.5 py-1.5 inline-flex text-[13px] capitalize leading-5 font-semibold rounded-full ${
                      roleStyles[user.role as keyof typeof roleStyles] ||
                      "bg-gray-100 text-gray-800 border border-gray-900"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  <ActiveStatus lastLogin={user.lastLogin} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold capitalize rounded-full ${
                      statusStyles[user.status as keyof typeof statusStyles]
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
                        <DropdownMenuItem
                          onClick={() => router.push(`/users/${user.id}`)}
                        >
                          View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                          Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                          Assign Task
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onAction(user.id, "suspend")}
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
  );
};


export const Pagination = ({
  currentPage,
  totalPages,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 whitespace-nowrap">
          Rows per page
        </span>
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(value) => {
            onRowsPerPageChange(Number(value));
            onPageChange(1);
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
          {startItem}-{endItem} of {totalItems}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// FilterDropdown Component
export const FilterDropdown = ({
  options,
  selectedValue,
  onSelect,
  isOpen,
  onToggle,
}: {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2.5 capitalize text-xs text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {selectedValue}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 capitalize w-32 bg-white border border-gray-200 rounded-xl shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              className={`w-full text-left px-4 py-2 capitalize text-xs first:rounded-t-xl last:rounded-b-xl ${
                selectedValue === option
                  ? "bg-gray-100 text-gray-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => {
                onSelect(option);
                onToggle();
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// SearchInput Component
export const SearchInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
      <input
        type="search"
        placeholder="Search users..."
        className="pl-8 pr-4 py-2.5 w-full md:w-36 text-xs border border-gray-200 rounded-xl outline-none transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
