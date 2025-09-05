import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axiosclient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useGetAllProjects = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/projects/admin`);
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch projects."
          );
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch projects."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occured while fetching projects.");
        }
        throw error;
      }
    },
  });
  return { projectList: data, isLoading };
};

export const useGetProjectById = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/project/${id}/admin`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch project.");
        }
        return response?.data?.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch project."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching project.");
        }
        throw error;
      }
    },
    enabled: !!id,
  });
  return { projectDetails: data, isLoading };
};

export const useAssignSupervisor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      supervisorId,
    }: {
      projectId: string;
      supervisorId: string;
    }) => {
      try {
        const response = await axiosClient.post(
          `/project/${projectId}/assign-supervisor`,
          { supervisorId }
        );
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to assign supervisor."
          );
        }
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to assign supervisor."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(
            "An unexpected error occurred while assigning supervisor."
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Supervisor assigned successfully.");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useApproveProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      approved,
      totalCost,
      discount,
    }: {
      projectId: string;
      approved: boolean;
      totalCost: number;
      discount: number;
    }) => {
      try {
        const response = await axiosClient.post(
          `/project/${projectId}/approve`,
          { approved, totalCost, discount }
        );
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to approve project."
          );
        }
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to approve project."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while approving project.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Project approved successfully.");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useInviteExperts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      expertIds,
    }: {
      projectId: string;
      expertIds: string[];
    }) => {
      try {
        const response = await axiosClient.post(
          `/project/${projectId}/invite-experts`,
          { expertIds }
        );
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to invite experts."
          );
        }
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to invite experts."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while inviting experts.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Experts invited successfully.");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
