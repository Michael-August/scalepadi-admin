import { axiosClient } from "@/lib/api/axiosclient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

// Types
interface Benefit {
  id?: string;
  name: string;
}

interface Plan {
  _id: string;
  name: string;
  cost: number;
  description: string;
  benefits: Benefit[];
}

interface PaginatedPlans {
  plans: Plan[];
  total: number;
  page: number;
  totalPages: number;
}

interface CreatePlanData {
  name: string;
  cost: number;
  coin: number;
  description: string;
  benefits: string[] | Benefit[];
}

// GET all plans
export const useGetAllPlans = (
  page: number = 1,
  limit: number = 10,
  statusFilter: string = "all",
  sortBy: string = "createdAt",
  searchQuery: string = ""
) => {
  const { data, isLoading } = useQuery<{
    status: boolean;
    message: string;
    totalPages: number;
    data: any[];
  }>({
    queryKey: ["plans", page, limit, statusFilter, sortBy, searchQuery],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          `/plans?page=${page}&limit=${limit}${
            statusFilter && statusFilter !== "all"
              ? `&status=${statusFilter}`
              : ""
          }&sort=${sortBy}&search=${searchQuery}`
        );
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch plans.");
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch plans."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching plans.");
        }
        throw error;
      }
    },
  });

  return { planList: data, isLoading };
};

// GET plan by ID
export const useGetPlanById = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/plan/${id}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch plan.");
        }
        return response?.data?.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch plan."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching plan.");
        }
        throw error;
      }
    },
    enabled: !!id,
  });
  return { planDetails: data, isLoading };
};

// SEARCH plans
export const useSearchPlans = (
  search: string,
  page: number = 1,
  limit: number = 10
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["plans", search, page, limit],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          `/plans?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
          )}`
        );

        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch plans.");
        }

        return response.data;
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message || "Failed to fetch plans."
          );
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An unexpected error occurred while fetching plans.");
        }
        throw err;
      }
    },
    enabled: !!search,
  });

  return { planList: data, isLoading, isError, error };
};

// CREATE plan
export const useCreatePlan = (options?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: CreatePlanData) => {
      try {
        const response = await axiosClient.post(`/plan`, planData);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to create plan.");
        }
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to create plan."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while creating plan.");
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan created successfully!");
      options?.onSuccess?.();
    },
    onError: () => {
      options?.onError?.();
    },
  });
};

// UPDATE plan
export const useUpdatePlan = (options?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreatePlanData> }) => {
      try {
        const response = await axiosClient.put(`/plan/${id}`, data);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to update plan.");
        }
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to update plan."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while updating plan.");
        }
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan", variables.id] });
      toast.success("Plan updated successfully!");
      options?.onSuccess?.();
    },
    onError: () => {
      options?.onError?.();
    },
  });
};

// DELETE plan
export const useDeletePlan = (options?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axiosClient.delete(`/plan/${id}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to delete plan.");
        }
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to delete plan."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while deleting plan.");
        }
        throw error;
      }
    },
    onSuccess: (data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.removeQueries({ queryKey: ["plan", deletedId] });
      toast.success("Plan deleted successfully!");
      options?.onSuccess?.();
    },
    onError: () => {
      options?.onError?.();
    },
  });
};

// GET plans with filters
export const useGetAllPlansWithFilters = (
  currentPage: number = 1,
  itemsPerPage: number = 10,
  costFilter: string,
  sortBy: string,
  searchQuery: string
) => {
  const { data, isLoading, error } = useQuery<{
    status: boolean;
    message: string;
    data: PaginatedPlans;
  }>({
    queryKey: [
      "plans",
      currentPage,
      itemsPerPage,
      costFilter,
      sortBy,
      searchQuery,
    ],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          `/plans?page=${currentPage}&limit=${itemsPerPage}${
            costFilter && costFilter !== "all"
              ? `&cost=${costFilter}`
              : ""
          }&sort=${sortBy}&search=${searchQuery}`
        );
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch plans."
          );
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch plans."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(
            "An unexpected error occurred while fetching plans."
          );
        }
        throw error;
      }
    },
  });

  return { filteredPlans: data?.data, isLoading, error };
};

// GET plans count
export const useGetPlansCount = (
  currentPage: number = 1,
  itemsPerPage: number = 10,
  costFilter: string,
  sortBy: string,
  searchQuery: string
) => {
  const { data, isLoading, error } = useQuery<{
    status: boolean;
    message: string;
    data: { total: number };
  }>({
    queryKey: [
      "plans-count",
      currentPage,
      itemsPerPage,
      costFilter,
      sortBy,
      searchQuery,
    ],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          `/plans/count?page=${currentPage}&limit=${itemsPerPage}${
            costFilter && costFilter !== "all"
              ? `&cost=${costFilter}`
              : ""
          }&sort=${sortBy}&search=${searchQuery}`
        );
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch plans count."
          );
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch plans count."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(
            "An unexpected error occurred while fetching plans count."
          );
        }
        throw error;
      }
    },
  });

  return { plansCount: data?.data, isLoading, error };
};