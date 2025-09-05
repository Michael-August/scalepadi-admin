import { axiosClient } from "@/lib/api/axiosclient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useGetAllPayment = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["payment"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/transactions/admin`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch transactions.");
        }
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch transactions.");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occured while fetching transactions.");
        }
        throw error;
      }
    },
  });
  return { paymentList: data, isLoading };
};

export const useGetPaymentById = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["payment", id],
    queryFn: async ({ queryKey }) => {
      const [, paymentId] = queryKey;
      try {
        const response = await axiosClient.get(`/transaction/admin/${paymentId}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch transaction.");
        }
        // API returns subscription object directly
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch transaction.");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching transaction.");
        }
        throw error;
      }
    },
    enabled: !!id,
  });
  return { transactionDetails: data, isLoading };
};