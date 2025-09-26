import { axiosClient } from "@/lib/api/axiosclient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface Inquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  note: string;
  viewed: boolean;
  createdAt: string;
}

export interface PaginatedInquiries {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  data: Inquiry[];
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// GET all inquiries
export const useGetInquiries = (page: number = 1, limit: number = 10) => {
  const { data, isLoading, error, isError } = useQuery<ApiResponse<PaginatedInquiries>>({
    queryKey: ["inquiries", page, limit],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/inquiries?page=${page}&limit=${limit}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch inquiries.");
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch inquiries."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching inquiries.");
        }
        throw error;
      }
    },
  });

  return { 
    inquiriesData: data, 
    isLoading, 
    isError, 
    error 
  };
};

// GET single inquiry by ID
export const useGetInquiryById = (inquiryId: string) => {
  const { data, isLoading, error, isError } = useQuery<ApiResponse<{ data: Inquiry }>>({
    queryKey: ["inquiry", inquiryId],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/inquiry/${inquiryId}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch inquiry.");
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch inquiry."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching inquiry.");
        }
        throw error;
      }
    },
    enabled: !!inquiryId,
  });

  return { 
    inquiryData: data?.data, 
    isLoading, 
    isError, 
    error 
  };
};

// DELETE inquiry
export const useDeleteInquiry = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiryId: string) => {
      try {
        const response = await axiosClient.delete(`/inquiry/${inquiryId}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to delete inquiry.");
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to delete inquiry."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while deleting inquiry.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Inquiry deleted successfully!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

// Mark inquiry as viewed
export const useMarkInquiryAsViewed = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiryId: string) => {
      try {
        const response = await axiosClient.put(`/inquiry/${inquiryId}`, { 
          viewed: true 
        });
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to mark inquiry as viewed.");
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to mark inquiry as viewed."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while marking inquiry as viewed.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["inquiry"] });
      toast.success("Inquiry marked as viewed!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};