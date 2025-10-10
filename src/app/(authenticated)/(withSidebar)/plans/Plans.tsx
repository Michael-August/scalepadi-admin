// components/Plans.tsx
"use client";

import {
  ArrowUpDown,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Plus,
  Trash2,
  Zap,
  X,
  Copy,
  Check,
  Users,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useGetAllPlans,
  useDeletePlan,
  useCreatePlan,
  useUpdatePlan,
  useGetPlanById,
} from "@/hooks/usePlan";

// Plan styles
export const planStatusStyles = {
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-red-50 text-red-700 border-red-200",
  draft: "bg-yellow-50 text-yellow-700 border-yellow-200",
  default: "bg-gray-50 text-gray-700 border-gray-200",
} as const;

export const planTypeStyles = {
  "Padi Pro": "bg-blue-100 text-blue-600",
  "Padi Gold": "bg-yellow-100 text-yellow-600",
  "Padi Basic": "bg-green-100 text-green-600",
  "Padi Free": "bg-gray-100 text-gray-600",
  default: "bg-purple-100 text-purple-600",
} as const;

export const planStatuses = ["All statuses", "Active", "Inactive", "Draft"];
export type Benefit = string | { name: string };

interface PlansProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
}

interface TransformedPlan {
  id: string;
  name: string;
  cost: string;
  rawCost: number;
  coin: number;
  description: string;
  benefits: string[];
  status: string;
  subscribers: number;
  createdAt: string;
  rawCreatedAt: Date;
}

// Modal Components
interface CreateEditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: TransformedPlan | null;
  planDetails?: any; // Add this
  onSubmit: (data: {
    name: string;
    cost: number;
    coin: number;
    description: string;
    benefits: string[];
  }) => void;
  isLoading: boolean;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
  isLoading: boolean;
}

const CreateEditPlanModal: React.FC<CreateEditPlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  planDetails, // Add this prop
  onSubmit,
  isLoading,
}) => {
  // Use the fetched planDetails if available, otherwise use the passed plan
  const planData = planDetails || plan;

  const [formData, setFormData] = useState({
    name: planData?.name || "",
    cost: planData?.cost?.toString() || "",
    coin: planData?.coin?.toString() || "0",
    description: planData?.description || "",
    benefits: planData?.benefits?.join("\n") || "",
  });

  // Reset form when planData changes (when modal opens with new data)
  React.useEffect(() => {
    if (planData) {
      setFormData({
        name: planData.name || "",
        cost: planData.cost?.toString() || "",
        coin: planData.coin?.toString() || "0",
        description: planData.description || "",
        benefits: planData.benefits?.join("\n") || "",
      });
    }
  }, [planData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      cost: Number(formData.cost),
      coin: Number(formData.coin),
      description: formData.description,
      benefits: formData.benefits
        .split("\n")
        .filter((b: string) => b.trim() !== ""),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">
            {plan ? "Edit Plan" : "Create New Plan"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Plan Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Padi Pro"
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost" className="text-sm font-medium">
                Cost (₦) *
              </Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cost: e.target.value }))
                }
                placeholder="10000"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="coin" className="text-sm font-medium">
                Coins *
              </Label>
              <Input
                id="coin"
                type="number"
                value={formData.coin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, coin: e.target.value }))
                }
                placeholder="10"
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the plan features and benefits..."
              className="mt-1 resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="benefits" className="text-sm font-medium">
              Benefits (one per line) *
            </Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, benefits: e.target.value }))
              }
              placeholder="Everything in Free&#10;Extended limits on messaging..."
              className="mt-1 resize-none"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Saving..." : plan ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planName,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-red-600">Delete Plan</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete <strong>{planName}</strong>? This
            action cannot be undone and will remove the plan from the system.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Plan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this modal component to your Plans.tsx file
interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: TransformedPlan | null;
  isLoading?: boolean;
}

const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({
  isOpen,
  onClose,
  plan,
  isLoading = false,
}) => {
  if (!isOpen) return null;
  // Add these helper functions if not already present
  const getPlanColor = (planName: string) => {
    const planKey = planName as keyof typeof planTypeStyles;
    return planTypeStyles[planKey] || planTypeStyles.default;
  };

  const getPlanInitial = (planName: string): string => {
    return planName.charAt(0).toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const statusKey = status.toLowerCase() as keyof typeof planStatusStyles;
    return planStatusStyles[statusKey] || planStatusStyles.default;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Plan Details</h2>
            <p className="text-gray-600 text-sm mt-1">
              Complete information about {plan.name}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Plan Card */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${getPlanColor(
                    plan.name
                  )}`}
                >
                  <span className="text-lg font-bold">
                    {getPlanInitial(plan.name)}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <Badge className={`mt-1 capitalize ${getStatusBadge(plan.status)}`}>
                    {plan.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {plan.cost}
                </div>
                <div className="text-gray-600 text-sm">per month</div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{plan.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>{plan.coin} coins</span>
                </div>
                {/* <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{plan.subscribers.toLocaleString()} subscribers</span>
                </div> */}
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  Created:{" "}
                  {new Date(plan.createdAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Plan Benefits
            </h4>
            <div className="grid gap-3">
              {plan.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {plan.subscribers.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm">Total Subscribers</div>
            </div> */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {plan.rawCost === 0 ? "Free" : plan.cost}
              </div>
              <div className="text-gray-600 text-sm">Monthly Price</div>
            </div>
          </div>

          {/* Quick Actions */}
          {/* <div className="border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Quick Actions
            </h4>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // Handle edit action
                  onClose();
                  // You might want to trigger edit modal here
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Plan
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // Handle duplicate action
                  onClose();
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default function Plans({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
}: PlansProps) {
  const [planStatus, setPlanStatus] = useState("All statuses");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TransformedPlan | null>(
    null
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const { planDetails, isLoading: isLoadingPlanDetails } = useGetPlanById(
    selectedPlanId || ""
  );

  const { planDetails: viewPlanDetails, isLoading: isLoadingViewPlan } =
    useGetPlanById(isViewModalOpen && selectedPlanId ? selectedPlanId : "");

  const { planList, isLoading } = useGetAllPlans(
    currentPage,
    rowsPerPage,
    planStatus === "All statuses" ? "all" : planStatus.toLowerCase(),
    sortBy,
    searchQuery
  );

  const deletePlanMutation = useDeletePlan();
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();

  const transformedPlans = useMemo((): TransformedPlan[] => {
    if (!planList?.data) return [];

    return planList.data.map((plan) => {
      return {
        id: plan.id || plan._id,
        name: plan.name,
        cost: `₦${plan.cost.toLocaleString()}`,
        rawCost: plan.cost,
        coin: plan.coin || 0,
        description: plan.description,
        benefits: plan.benefits.map((b: Benefit) =>
          typeof b === "string" ? b : b.name
        ),
        status: "active",
        subscribers: Math.floor(Math.random() * 1000),
        createdAt: plan.createdAt,
        rawCreatedAt: new Date(plan.createdAt),
      };
    });
  }, [planList]);

  const handleCreatePlan = (data: {
    name: string;
    cost: number;
    coin: number;
    description: string;
    benefits: string[];
  }) => {
    createPlanMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  const handleUpdatePlan = (data: {
    name: string;
    cost: number;
    coin: number;
    description: string;
    benefits: string[];
  }) => {
    if (selectedPlan) {
      updatePlanMutation.mutate(
        {
          id: selectedPlan.id,
          data,
        },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            setSelectedPlan(null);
          },
        }
      );
    }
  };

  const handleDeletePlan = () => {
    if (selectedPlan) {
      deletePlanMutation.mutate(selectedPlan.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedPlan(null);
        },
      });
    }
  };

  const handleAction = (plan: TransformedPlan, action: string) => {
    setSelectedPlan(plan);

    switch (action) {
      case "view":
        setSelectedPlanId(plan.id);
        setIsViewModalOpen(true);
        break;
      case "edit":
        setSelectedPlanId(plan.id);
        setIsEditModalOpen(true);
        break;
      case "delete":
        setIsDeleteModalOpen(true);
        break;
      case "duplicate":
        createPlanMutation.mutate({
          name: `${plan.name} (Copy)`,
          cost: plan.rawCost,
          coin: plan.coin,
          description: plan.description,
          benefits: plan.benefits,
        });
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    if (planDetails && selectedPlanId) {
      setIsEditModalOpen(true);
    }
  }, [planDetails, selectedPlanId]);

  const viewPlanData = useMemo(() => {
    if (viewPlanDetails) {
      return {
        id: viewPlanDetails.id || viewPlanDetails._id,
        name: viewPlanDetails.name,
        cost: `₦${viewPlanDetails.cost.toLocaleString()}`,
        rawCost: viewPlanDetails.cost,
        coin: viewPlanDetails.coin || 0,
        description: viewPlanDetails.description,
        benefits: viewPlanDetails.benefits.map((b: Benefit) =>
          typeof b === "string" ? b : b.name
        ),
        status: "active",
        subscribers: Math.floor(Math.random() * 1000),
        createdAt: viewPlanDetails.createdAt,
        rawCreatedAt: new Date(viewPlanDetails.createdAt),
      };
    }
    return selectedPlan;
  }, [viewPlanDetails, selectedPlan]);

  // Update the modal close functions to reset the selectedPlanId
  const handleCloseEditModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedPlanId(null);
    setSelectedPlan(null);
  };

  const handleSort = (key: string) => {
    const newSortBy = sortBy === key ? `-${key}` : key;
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (planList?.data && currentPage < planList.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const exportToCSV = (data: TransformedPlan[], filename: string) => {
    if (data.length === 0) return;

    const headers = [
      "ID",
      "Name",
      "Cost",
      "Coins",
      "Description",
      "Benefits",
      "Status",
      "Subscribers",
      "Created Date",
    ];
    const csvRows = [];

    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = [
        row.id,
        `"${row.name}"`,
        row.cost,
        row.coin.toString(),
        `"${row.description}"`,
        `"${row.benefits.join("; ")}"`,
        row.status,
        row.subscribers.toString(),
        new Date(row.createdAt).toLocaleDateString("en-GB"),
      ];
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

//   const getInitials = (name: string): string => {
//     return name
//       .split(" ")
//       .map((part) => part[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

  const getPlanColor = (planName: string) => {
    const planKey = planName as keyof typeof planTypeStyles;
    return planTypeStyles[planKey] || planTypeStyles.default;
  };

  const getPlanInitial = (planName: string): string => {
    return planName.charAt(0).toUpperCase();
  };

  const getSortIndicator = (key: string) => {
    if (sortBy === key) return "↑";
    if (sortBy === `-${key}`) return "↓";
    return null;
  };

  const getStatusBadge = (status: string) => {
    const statusKey = status.toLowerCase() as keyof typeof planStatusStyles;
    return planStatusStyles[statusKey] || planStatusStyles.default;
  };

  return (
    <>
      <section aria-labelledby="plans-heading">
        <h2 id="plans-heading" className="sr-only">
          Subscription Plans
        </h2>
        <p className="mb-4 font-montserrat text-sm">
          Manage subscription plans and pricing tiers for your platform.
        </p>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Select
              value={planStatus}
              onValueChange={(value) => {
                setPlanStatus(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] h-9 rounded-xl text-sm border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {planStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative w-full md:w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search plans..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full h-9 rounded-xl text-sm border-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-md text-xs border-gray-300 bg-transparent"
              onClick={() => exportToCSV(transformedPlans, "plans")}
              disabled={transformedPlans.length === 0}
            >
              <Download className="h-3 w-3 mr-2" />
              Export CSV
            </Button>
            <Button
              size="sm"
              className="h-10 rounded-md text-xs bg-primary hover:bg-primary-hover"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-3 w-3 mr-2" />
              New Plan
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-x-auto lg:w-[99%] xl:w-full">
          {isLoading ? (
            <div className="py-8">
              <TableSkeleton rows={5} columns={7} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Plan Name
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Description
                  </TableHead>
                  <TableHead
                    className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/50"
                    onClick={() => handleSort("cost")}
                  >
                    <div className="flex items-center gap-1">
                      Cost
                      <ArrowUpDown className="w-4 h-4" />
                      {getSortIndicator("cost")}
                    </div>
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Coins
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Benefits
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="text-[#878A93] font-medium text-sm py-4 whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transformedPlans.length > 0 ? (
                  transformedPlans.map((plan) => (
                    <TableRow
                      key={plan.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getPlanColor(
                              plan.name
                            )}`}
                          >
                            <span className="text-sm font-bold">
                              {getPlanInitial(plan.name)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-900 text-sm font-semibold">
                              {plan.name}
                            </span>
                            <span className="text-gray-500 text-xs">
                              Created:{" "}
                              {new Date(plan.createdAt).toLocaleDateString(
                                "en-GB"
                              )}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-gray-600 text-sm line-clamp-2">
                          {plan.description}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        <span className="text-gray-900 text-sm font-semibold">
                          {plan.cost}
                        </span>
                        <span className="text-gray-500 text-xs block">
                          per month
                        </span>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        <span className="text-gray-900 text-sm font-semibold">
                          {plan.coin}
                        </span>
                        <span className="text-gray-500 text-xs block">
                          coins
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          {plan.benefits.slice(0, 2).map((benefit, index) => (
                            <span
                              key={index}
                              className="text-gray-600 text-xs line-clamp-1"
                            >
                              • {benefit}
                            </span>
                          ))}
                          {plan.benefits.length > 2 && (
                            <span className="text-blue-600 text-xs font-medium">
                              +{plan.benefits.length - 2} more benefits
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap capitalize">
                        <Badge
                          className={`min-w-[80px] justify-center text-xs font-medium ${getStatusBadge(
                            plan.status
                          )}`}
                        >
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleAction(plan, "edit")}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 data-[state=open]:bg-gray-100"
                              >
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleAction(plan, "view")}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction(plan, "duplicate")}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Zap className="w-4 h-4" />
                                Duplicate Plan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleAction(plan, "delete")}
                                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Plan
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
                      colSpan={7}
                      className="py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <Zap className="h-8 w-8 text-gray-400" />
                        </div>
                        <span className="text-lg font-medium">
                          No plans found
                        </span>
                        <span className="text-sm max-w-md">
                          {searchQuery || planStatus !== "All statuses"
                            ? "Try adjusting your search or filter criteria"
                            : "No subscription plans available. Create your first plan to get started."}
                        </span>
                        {!searchQuery && planStatus === "All statuses" && (
                          <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Plan
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {planList?.data && planList.data.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
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
                <SelectTrigger className="w-20 h-8 text-sm border-gray-300">
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
                Page {currentPage} of{" "}
                {Math.ceil(planList.data.length / rowsPerPage)} •{" "}
                {(currentPage - 1) * rowsPerPage + 1}-
                {Math.min(currentPage * rowsPerPage, planList.data.length)} of{" "}
                {planList.data.length} plans
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleNextPage}
                  disabled={
                    currentPage ===
                      Math.ceil(planList.data.length / rowsPerPage) ||
                    Math.ceil(planList.data.length / rowsPerPage) === 0
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modals */}
      <CreateEditPlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlan}
        isLoading={createPlanMutation.isPending}
      />

      <CreateEditPlanModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        plan={selectedPlan}
        planDetails={planDetails} // Pass the fetched plan details
        onSubmit={handleUpdatePlan}
        isLoading={updatePlanMutation.isPending || isLoadingPlanDetails}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPlan(null);
        }}
        onConfirm={handleDeletePlan}
        planName={selectedPlan?.name || ""}
        isLoading={deletePlanMutation.isPending}
      />

      <PlanDetailsModal
        isOpen={isViewModalOpen}
        onClose={handleCloseEditModal}
        plan={viewPlanData}
        isLoading={isLoadingViewPlan}
      />
    </>
  );
}
