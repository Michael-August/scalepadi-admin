import { axiosClient } from "@/lib/api/axiosclient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  link: string[];
  documents: File[];
  status: "pending" | "in-progress" | "completed" | "cancelled";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTasks {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useCreateTask = (options?: {
  onSuccess?: (data: { status: boolean; message: string; data: Task }) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: {
      projectId: string;
      title: string;
      description: string;
      dueDate: string;
      link: string[];
      documents: File[]; // Accept files instead of URLs
    }) => {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("projectId", taskData.projectId);
        formData.append("title", taskData.title);
        formData.append("description", taskData.description);
        formData.append("dueDate", taskData.dueDate);

        // Append links as array
        taskData.link.forEach((link, index) => {
          formData.append(`link[${index}]`, link);
        });

        // Append files
        taskData.documents.forEach((file) => {
          formData.append("documents", file); // Backend will handle cloud upload
        });

        const response = await axiosClient.post(`/task`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to create task.");
        }
        console.log(response.data);
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to create task."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while creating task.");
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      toast.success("Task created successfully!");
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useGetProjectTasks = (
  projectId: string,
  page: number = 1,
  limit: number = 10
) => {
  const { data, isLoading } = useQuery<{
    status: boolean;
    message: string;
    data: PaginatedTasks;
  }>({
    queryKey: ["project-tasks", projectId, page, limit],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/tasks/${projectId}/admin`);
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || "Failed to fetch project tasks."
          );
        }
        console.log(response.data);
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to fetch project tasks."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(
            "An unexpected error occurred while fetching project tasks."
          );
        }
        throw error;
      }
    },
    enabled: !!projectId,
  });

  return { projectTasks: data, isLoading };
};

export const useGetTaskById = (taskId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/admin/task/${taskId}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch task.");
        }
        console.log(response.data);
        return response?.data?.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch task.");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching task.");
        }
        throw error;
      }
    },
    enabled: !!taskId,
  });
  return { taskDetails: data, isLoading };
};

export const useUpdateTask = (options?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      updateData,
    }: {
      taskId: string;
      updateData: Partial<Task>;
    }) => {
      try {
        const response = await axiosClient.put(
          `/admin/task/${taskId}`,
          updateData
        );
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to update task.");
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to update task."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while updating task.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
      toast.success("Task updated successfully!");
      options?.onSuccess?.();
    },
    onError: () => {
      options?.onError?.();
    },
  });
};

export const useDeleteTask = (options?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      try {
        const response = await axiosClient.delete(`/task/${taskId}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to delete task.");
        }
        console.log(response.data);
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to delete task."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while deleting task.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      toast.success("Task deleted successfully!");
      options?.onSuccess?.();
    },
    onError: () => {
      options?.onError?.();
    },
  });
};

export const useAssignTask = (options?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      expertId,
    }: {
      taskId: string;
      expertId: string;
    }) => {
      try {
        const response = await axiosClient.put(`/task/assign/${taskId}`, {
          expertId: expertId,
        });
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to assign task.");
        }
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || "Failed to assign task."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while assigning task.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
      toast.success("Task assigned successfully!");
      options?.onSuccess?.();
    },
    onError: () => {
      options?.onError?.();
    },
  });
};

export const useSearchTasks = (
  search: string,
  projectId?: string,
  page: number = 1,
  limit: number = 10
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks", search, projectId, page, limit],
    queryFn: async () => {
      try {
        const baseUrl = projectId ? `/tasks/${projectId}/admin` : `/tasks`;
        const response = await axiosClient.get(
          `${baseUrl}?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
          )}`
        );

        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch tasks.");
        }

        return response.data;
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message || "Failed to fetch tasks.");
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An unexpected error occurred while fetching tasks.");
        }
        throw err;
      }
    },
    enabled: !!search || !!projectId,
  });

  return { taskList: data, isLoading, isError, error };
};
