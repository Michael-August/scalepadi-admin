import { axiosClient } from "@/lib/api/axiosclient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useGetProjects = (params?: any) => {
    const { data, isLoading } = useQuery({
        queryKey: ["projects", params],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/projects?${new URLSearchParams(params).toString()}`)

                if (response.data?.status === false) {
                    throw new Error(response.data?.message || "Failed to fetch projects");
                }
                
                return response.data?.data
            } catch (error: any) {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message || "Failed to fetch projects")
                } else if (error instanceof Error) {
                    toast.error(error.message)
                } else {
                    toast.error("An unexpected error occured while fetching projects")
                }

                throw error;
            }
        }
    })

    return { projects: data, isLoading }
} 