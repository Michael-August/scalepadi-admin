import { PaginatedExperts } from "@/app/(authenticated)/(withSidebar)/experts/page"
import { axiosClient } from "@/lib/api/axiosclient"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useGetAllExpert = (page: number = 1, limit: number = 10) => {
  const { data, isLoading } = useQuery<{
    status: boolean
    message: string
    data: PaginatedExperts
  }>({
    queryKey: ["expert", page, limit],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          `/experts?page=${page}&limit=${limit}`
        )
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch experts."
          )
        }
        return response.data
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch experts."
          )
        } else if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("An unexpected error occured while fetching experts.")
        }
        throw error
      }
    },
  })

  return { expertList: data, isLoading }
}

export const useGetExpertById = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["expert", id],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/expert/${id}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch expert.");
        }
        return response?.data?.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch expert."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching expert.");
        }
        throw error;
      }
    },
    enabled: !!id,
  });
  return { expertDetails: data, isLoading };
};

export const useSearchExpert = (
  search: string,
  page: number = 1,
  limit: number = 10
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expert", search, page, limit],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          `/experts?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
          )}`
        );

        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch expert."
          );
        }

        return response.data;
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message || "Failed to fetch expert."
          );
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error(
            "An unexpected error occurred while fetching experts."
          );
        }
        throw err;
      }
    },
    enabled: !!search, 
  });

  return { expertList: data, isLoading, isError, error };
};
