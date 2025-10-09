import { axiosClient } from "@/lib/api/axiosclient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface Business {
  name: string;
  email: string;
  id: string;
}

export interface Expert {
  name: string;
  email: string;
  id: string;
}

export interface Hire {
  id: string;
  businessId: Business;
  expertId: Expert;
  description: string;
  duration: string;
  budget: number;
  businessStatus: string;
  expertStatus: string;
  hireStatus: string;
  createdAt: string;
  commissionDue: number;
}

export interface HireResponse {
  status: boolean;
  message: string;
  data: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    data: Hire[];
  };
}

export const useGetAllHires = (
  currentPage: number = 1,
  itemsPerPage: number = 10
) => {
  const { data, isLoading, error } = useQuery<HireResponse>({
    queryKey: ["hires", currentPage, itemsPerPage],
    queryFn: async () => {
      try {
        const params: Record<string, string> = {
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        };

        const queryString = new URLSearchParams(params).toString();
        const response = await axiosClient.get(`/hires/admin?${queryString}`);
        
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch hires."
          );
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch hires."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching hires.");
        }
        throw error;
      }
    },
  });

  return { 
    hireData: data?.data, 
    isLoading, 
    error 
  };
};