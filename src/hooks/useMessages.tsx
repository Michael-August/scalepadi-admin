import { axiosClient } from "@/lib/api/axiosclient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useGetChats = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["Admin Chats"],
		queryFn: async () => {
			try {
				const response = await axiosClient.get(`/chats/admin`);
				if (response.data?.status === false) {
					throw new Error(
						response.data?.message || "Failed to fetch chats"
					);
				}
				return response.data?.data;
			} catch (error: any) {
				if (error instanceof AxiosError) {
					toast.error(
						error.response?.data?.message || "Failed to fetch chats"
					);
				} else if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error(
						"An unexpected error occured while fetching chats"
					);
				}

				throw error;
			}
		},
	});

	return { chats: data, isLoading };
};

export const useCreateChat = () => {
	const queryClient = useQueryClient();
	const { mutate: createChat, isPending } = useMutation({
		mutationFn: async (data: {
			participants: [{ user: string; userModel: string }];
		}) => {
			try {
				const res = await axiosClient.post("/chat/admin", data);
				if (res.data?.status === false) {
					throw new Error(
						res.data?.message ||
							"An error occurred while creating chat"
					);
				}
				return res.data;
			} catch (error: any) {
				// If backend sent a message, preserve it
				const backendMessage =
					error?.response?.data?.message ||
					error?.message ||
					"An error occurred during chat creation";

				throw new Error(backendMessage);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["Admin Chats"] });
		},
	});

	return { createChat, isPending };
};

export const useGetChatMessages = (chatId: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ["Admin Messages", chatId],
		queryFn: async () => {
			try {
				const response = await axiosClient.get(
					`/messages/admin/${chatId}`
				);
				if (response.data?.status === false) {
					throw new Error(
						response.data?.message || "Failed to fetch messages"
					);
				}
				return response.data?.data;
			} catch (error: any) {
				if (error instanceof AxiosError) {
					toast.error(
						error.response?.data?.message ||
							"Failed to fetch messages"
					);
				} else if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error(
						"An unexpected error occured while fetching messages"
					);
				}

				throw error;
			}
		},
		enabled: !!chatId,
	});

	return { messages: data, isLoading };
};

export const useSendMessages = (chatId: string) => {
	const queryClient = useQueryClient();
	const { mutate: sendMessage, isPending } = useMutation({
		mutationFn: async (data: { chatId: string; text: string }) => {
			try {
				const res = await axiosClient.post("/message/admin", data);
				if (res.data?.status === false) {
					throw new Error(
						res.data?.message ||
							"An error occurred while sending message"
					);
				}
				return res.data;
			} catch (error: any) {
				// If backend sent a message, preserve it
				const backendMessage =
					error?.response?.data?.message ||
					error?.message ||
					"An error occurred during sending message";

				throw new Error(backendMessage);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["Admin Messages", chatId],
			});
		},
	});

	return { sendMessage, isPending };
};
