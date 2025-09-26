import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from "@/lib/api/axiosclient";
import { AxiosError } from "axios";
import { toast } from "sonner";

// Types
export interface Notification {
  id: string;
  content: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  status: boolean;
  message: string;
  data: {
    notifications: Notification[];
    unreadCount: number;
  };
}

// API functions
const fetchNotifications = async (): Promise<NotificationsResponse> => {
  try {
    const response = await axiosClient.get('/notifications');
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Failed to fetch notifications.");
    }
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data?.message || "Failed to fetch notifications."
      );
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred while fetching notifications.");
    }
    throw error;
  }
};

const markAsRead = async (notificationId: string): Promise<{ status: boolean; message: string }> => {
  try {
    const response = await axiosClient.put(`/notification/${notificationId}`);
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Failed to mark notification as read.");
    }
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data?.message || "Failed to mark notification as read."
      );
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred while marking notification as read.");
    }
    throw error;
  }
};

const markAllAsRead = async (): Promise<{ status: boolean; message: string }> => {
  try {
    const response = await axiosClient.put('/notifications/mark-all-read');
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Failed to mark all notifications as read.");
    }
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data?.message || "Failed to mark all notifications as read."
      );
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred while marking all notifications as read.");
    }
    throw error;
  }
};

// Query hooks
export const useNotifications = () => {
  const { data, isLoading, error } = useQuery<NotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  return {
    notifications: data?.data?.notifications || [],
    unreadCount: data?.data?.unreadCount || 0,
    isLoading,
    error
  };
};

// Mutation hooks
export const useMarkAsRead = (options?: {
  onSuccess?: (data: { status: boolean; message: string }) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("Notification marked as read!");
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useMarkAllAsRead = (options?: {
  onSuccess?: (data: { status: boolean; message: string }) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("All notifications marked as read!");
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

// Hook for individual notification operations
export const useNotificationActions = () => {
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleMarkAsRead = (notificationId: string) => {
    return markAsReadMutation.mutateAsync(notificationId);
  };

  const handleMarkAllAsRead = () => {
    return markAllAsReadMutation.mutateAsync();
  };

  return {
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
};