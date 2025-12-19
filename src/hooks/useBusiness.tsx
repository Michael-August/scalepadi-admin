import { axiosClient } from "@/lib/api/axiosclient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useGetAllBusiness = (
  page: number = 1,
  limit: number = 10,
  status: string = "",
  verified?: boolean
) => {
  const { data, isLoading } = useQuery({
    queryKey: ["business", page, limit, status, verified],
    queryFn: async () => {
      try {
        let url = `/businesses?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (verified !== undefined) url += `&verified=${verified}`;

        const response = await axiosClient.get(url);
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch business."
          );
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch business."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occured while fetching business.");
        }
        throw error;
      }
    },
  });
  return { businessList: data, isLoading };
};

export const useGetBusinessById = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["business", id],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/business/${id}`);
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch business."
          );
        }
        return response?.data?.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch business."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching business.");
        }
        throw error;
      }
    },
    enabled: !!id,
  });
  return { businessDetails: data, isLoading };
};

export const useSearchBusiness = (
  search: string,
  page: number = 1,
  limit: number = 10
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["business", search, page, limit],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          `/businesses?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
          )}`
        );

        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch business."
          );
        }

        return response.data;
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message || "Failed to fetch business."
          );
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error(
            "An unexpected error occurred while fetching businesses."
          );
        }
        throw err;
      }
    },
    enabled: !!search, 
  });

  return { businessList: data, isLoading, isError, error };
};

export const useGrowthInsight = (year: number) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["growth-insight", year],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/growth-insight?year=${year}`);

        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch growth insights."
          );
        }

        return response.data;
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message || "Failed to fetch growth insights."
          );
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An unexpected error occurred while fetching insights.");
        }
        throw err;
      }
    },
    enabled: !!year, // only run if year is provided
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  return { insights: data, isLoading, isError, error };
};