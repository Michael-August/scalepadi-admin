import { axiosClient } from "@/lib/api/axiosclient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useGetAllSubscription = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/subscriptions/admin`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch subscriptions.");
        }
        // API returns array of subscriptions directly
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch subscriptions.");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occured while fetching subscriptions.");
        }
        throw error;
      }
    },
  });
  return { subscriptionList: data, isLoading };
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