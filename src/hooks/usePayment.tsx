// hooks/usePayment.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { axiosClient } from "@/lib/api/axiosclient";

export interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  subscriptionId?: {
    id: string;
    businessId: {
      id: string;
      name: string;
      email: string;
    };
    planId: {
      id: string;
      name: string;
      cost: number;
      coin: number;
    };
    createdAt: string;
    nextRenewal: string;
    status: string;
    requestsLeft: number;
    planName: string;
  };
  projectId?: {
    id: string;
    businessId?: {
      name: string;
    };
  };
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    data: Payment[];
  };
}

// types/account-transaction.ts
// types/account-transaction.ts
export interface AccountTransaction {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  subscriptionId?: {
    id: string;
    amountPaid: number;
    businessId: {
      id: string;
      name: string;
      email: string;
    };
    planId: {
      id: string;
      name: string;
      cost: number;
      coin: number;
    };
    planName: string;
    status: string;
    requestsLeft: number;
    nextRenewal: string;
    createdAt: string;
  };
  projectId?: {
    id: string;
    title: string;
    status: string;
    totalCost: number;
    proposedTotalCost: number;
    businessId: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface AccountTransactionResponse {
  status: boolean;
  message: string;
  data: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    data: AccountTransaction[];
  };
}

export const useGetAllPayment = (
  currentPage: number = 1,
  itemsPerPage: number = 10,
  statusFilter: string = "all",
  sortBy: string = "createdAt",
  searchQuery: string = ""
) => {
  const { data, isLoading, error } = useQuery<PaymentResponse>({
    queryKey: ["payment", currentPage, itemsPerPage, statusFilter, sortBy, searchQuery],
    queryFn: async () => {
      try {
        // Build query parameters - adjust based on what your API supports
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
        const response = await axiosClient.get(`/transactions/admin?${queryString}`);
        
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch payment records."
          );
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch payment records."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching payment records.");
        }
        throw error;
      }
    },
  });

  return { 
    paymentData: data?.data, 
    isLoading, 
    error 
  };
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

export const useGetAccountTransactions = (
  businessId: string,
  currentPage: number = 1,
  itemsPerPage: number = 10,
  statusFilter: string = "all",
  sortBy: string = "createdAt",
  searchQuery: string = ""
) => {
  const { data, isLoading, error } = useQuery<AccountTransactionResponse>({
    queryKey: ["account-transactions", businessId, currentPage, itemsPerPage, statusFilter, sortBy, searchQuery],
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
        const response = await axiosClient.get(`/transactions/account/admin?businessId=${businessId}&${queryString}`);
        
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch account transactions."
          );
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch account transactions."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching account transactions.");
        }
        throw error;
      }
    },
    enabled: !!businessId, // Only run query if businessId is provided
  });

  return { 
    transactionData: data?.data, 
    isLoading, 
    error 
  };
};