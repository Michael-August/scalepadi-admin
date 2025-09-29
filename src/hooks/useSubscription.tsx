import { axiosClient } from "@/lib/api/axiosclient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

// types/subscription.ts
export interface Subscription {
  id: string;
  planId: {
    name: string;
    cost: number;
    coin: number;
    id: string;
  };
  businessId: {
    name: string;
    email: string;
    id: string;
  };
  amountPaid: number;
  planName: string;
  status: string;
  requestsLeft: number;
  nextRenewal: string;
  createdAt: string;
}

export interface SubscriptionResponse {
  status: boolean;
  message: string;
  data: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    data: Subscription[];
  };
}

export const useGetAllSubscription = (
  currentPage: number = 1,
  itemsPerPage: number = 10,
  statusFilter: string = "all",
  sortBy: string = "createdAt",
  searchQuery: string = ""
) => {
  const { data, isLoading, error } = useQuery<SubscriptionResponse>({
    queryKey: ["subscription", currentPage, itemsPerPage, statusFilter, sortBy, searchQuery],
    queryFn: async () => {
      try {
        // Build query parameters
        const params: Record<string, string> = {
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        };
        
        // Only add parameters if they have values and are not defaults
        if (sortBy && sortBy !== "createdAt") {
          params.sort = sortBy;
        }
        
        if (statusFilter && statusFilter !== "all") {
          params.status = statusFilter;
        }
        
        if (searchQuery) {
          params.search = searchQuery;
        }

        const queryString = new URLSearchParams(params).toString();
        const response = await axiosClient.get(`/subscriptions/admin?${queryString}`);
        
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch subscriptions."
          );
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch subscriptions."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching subscriptions.");
        }
        throw error;
      }
    },
  });

  return { 
    subscriptionData: data?.data, 
    isLoading, 
    error 
  };
};

export const useGetSubscriptionById = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["subscription", id],
    queryFn: async ({ queryKey }) => {
      const [, subscriptionId] = queryKey;
      try {
        const response = await axiosClient.get(`/subscription/admin/${subscriptionId}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch subscription.");
        }
        // API returns subscription object directly
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch subscription.");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching subscription.");
        }
        throw error;
      }
    },
    enabled: !!id,
  });
  return { subscriptionDetails: data, isLoading };
};

export const useUpdateSubscriptionById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { status?: string; requestsLeft?: number; nextRenewal?: string } }) => {
      try {
        const response = await axiosClient.put(`/subscription/admin/${id}`, payload);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to update subscription.");
        }
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to update subscription.");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while updating subscription.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Subscription updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
};