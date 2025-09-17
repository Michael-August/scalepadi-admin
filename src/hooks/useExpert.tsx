import { Expert, PaginatedExperts } from "@/app/(authenticated)/(withSidebar)/experts/page"
import { axiosClient } from "@/lib/api/axiosclient"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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

export const useGetAllBusinessProjects = (businessId: string, currentPage: number = 1, itemsPerPage: number = 10, statusFilter: string, sortBy: string, searchQuery: string) => {
  const { data, isLoading, error } = useQuery<{
    status: boolean
    message: string
    data: PaginatedExperts
  }>({
    queryKey: ["admin-accounts", businessId, currentPage, itemsPerPage, statusFilter, sortBy, searchQuery],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          `/projects/account/admin?businessId=${businessId}&page=${currentPage}&limit=${itemsPerPage}${statusFilter && statusFilter !== "all" ? `&status=${statusFilter}` : ""}&sort=${sortBy}&search=${searchQuery}`
        )
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch admin accounts."
          )
        }
        return response.data
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch admin accounts."
          )
        } else if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("An unexpected error occurred while fetching admin accounts.")
        }
        throw error
      }
    },
    enabled: !!businessId,
  })

  return { AllBusinessProjects: data?.data, isLoading, error }
};

export const useInviteExperts = (options?: { onSuccess?: () => void; onError?: () => void }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, expertIds }: { projectId: string; expertIds: string[] }) => {
      try {
        const response = await axiosClient.patch(
          `/project/${projectId}/invite-experts`,
          { experts: expertIds }
        )
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to invite experts."
          )
        }
        return response.data.data
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to invite experts."
          )
        } else if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("An unexpected error occurred while inviting experts.")
        }
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["experts"] })
      toast.success("Experts invited successfully!")
      options?.onSuccess?.()
    },
    onError: () => {
      options?.onError?.()
    },
  })
};

export const useGetExpertsCount = (
  businessId: string,
  currentPage: number = 1, itemsPerPage: number = 10,
  statusFilter: string,
  sortBy: string,
  searchQuery: string
) => {
  const { data, isLoading, error } = useQuery<{
    status: boolean
    message: string
    data: Expert
  }>({
    queryKey: ["experts-count", businessId, currentPage, itemsPerPage, statusFilter, sortBy, searchQuery],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          `/projects/experts-count/${businessId}?page=${currentPage}&limit=${itemsPerPage}${statusFilter && statusFilter !== "all" ? `status=${statusFilter}` : ""}&sort=${sortBy}&search=${searchQuery}`
        )
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch experts count."
          )
        }
        return response.data
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch experts count."
          )
        } else if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("An unexpected error occurred while fetching experts count.")
        }
        throw error
      }
    },
    enabled: !!businessId,
  })

  return { expertsCount: data?.data, isLoading, error }
};

// Haven't assigned this yet
export const useAssignSupervisor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, supervisorData }: { projectId: string; supervisorData: { supervisorId: string } }) => {
      try {
        const response = await axiosClient.patch(
          `/project/${projectId}/assign-supervisor`,
          supervisorData
        )
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to assign supervisor."
          )
        }
        return response.data
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to assign supervisor."
          )
        } else if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("An unexpected error occurred while assigning supervisor.")
        }
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] })
      toast.success("Supervisor assigned successfully!")
    },
  })
};
