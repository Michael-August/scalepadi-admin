"use client";

import { useEffect, useRef, useState } from "react";
import {
	Send,
	Search,
	Plus,
	SendHorizontal,
	MessageCircle,
	MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
	useCreateChat,
	useGetChatMessages,
	useGetChats,
	useSendMessages,
} from "@/hooks/useMessages";
import { ChatListSkeleton } from "@/components/skeletons/chats.skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetAllExpert } from "@/hooks/useExpert";
import { useGetAllBusiness } from "@/hooks/useBusiness";
import { useGetAdminList } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ChatWindowSkeleton } from "@/components/skeletons/messages.skeleton";
import { useSearchParams } from "next/navigation";

interface Participant {
	id: string;
	model: string;
	read: boolean;
	_id: string;
}

interface Sender {
	id: string;
	model: string;
}

interface Message {
	sender: Sender;
	chatId: string;
	content: string;
	participants: Participant[];
	createdAt: string;
	id: string;
}

interface IUserToChat {
	id: string;
	name: string;
	role: string;
	email: string;
	avatar?: string;
}

const colors = [
	"bg-red-500",
	"bg-blue-500",
	"bg-green-500",
	"bg-yellow-500",
	"bg-purple-500",
	"bg-pink-500",
	"bg-indigo-500",
	"bg-orange-500",
];

function getColorForUser(name: string) {
	// create a simple hash based on name
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	return colors[Math.abs(hash) % colors.length];
}

export default function MessagesPage() {
	const [selectedExpert, setSelectedExpert] = useState<any>();
	const [messages, setMessages] = useState<Message[]>([]);

	const bottomRef = useRef<HTMLDivElement | null>(null);

	const [findUsersToChat, setFindUsersToChat] = useState(false);

	const { chats, isLoading } = useGetChats();
	const { createChat, isPending } = useCreateChat();

	const [chatMessagesToFetch, setChatMessagesToFetch] = useState("");

	const { expertList, isLoading: isLoadingExperts } = useGetAllExpert();
	const { businessList, isLoading: isLoadingBusinesses } =
		useGetAllBusiness();
	// const { AdminUserList, isLoading: isLoadingAdminUsers } = useGetAdminList(1, 100);

	const { messages: chatMessages, isLoading: isLoadingMessages } =
		useGetChatMessages(chatMessagesToFetch);
	const { sendMessage, isPending: isPendingSendMessage } =
		useSendMessages(chatMessagesToFetch);

	const [users, setUsers] = useState<IUserToChat[]>([]);
	const [loggedInUser, setLoggedInUser] = useState<any>();

	const [input, setInput] = useState("");

	const handleCreateChat = (userId: string, role: string) => {
		if (!userId || !role) {
			toast.error("Please select a valid user");
			return;
		}

		createChat(
			{ participants: [{ user: userId, userModel: role }] },
			{
				onSuccess: (res) => {
					console.log(res);
					setFindUsersToChat(false);
					setChatMessagesToFetch(res?.data?.id);

					// Set selected expert from response if available
					if (res?.data?.participants) {
						const otherParticipant = res.data.participants.find(
							(p: any) => p.user?._id === userId || p.user === userId
						);
						if (otherParticipant) {
							setSelectedExpert(otherParticipant);
						}
					}
				},
				onError: (error) => {
					toast.error(`${error.message}`);
				},
			}
		);
	};

	// ... (rest of component function)



	const handleSendMessage = () => {
		if (!input.trim()) return;

		// Create a temporary optimistic message
		const tempMessage: Message = {
			id: `temp-${Date.now()}`, // unique temp id
			chatId: chatMessagesToFetch,
			content: input,
			sender: {
				id: loggedInUser?.id,
				model: loggedInUser?.role || "me",
			},
			participants: [],
			createdAt: new Date().toISOString(),
		};

		setMessages((prev) => [...prev, tempMessage]);
		setInput("");

		sendMessage(
			{ chatId: chatMessagesToFetch, text: input },
			{
				onSuccess: (res) => {
					setMessages((prev) =>
						prev.map((msg) =>
							msg.id === tempMessage.id ? res.data : msg
						)
					);
					toast.success("Message sent");
				},
				onError: () => {
					setMessages((prev) =>
						prev.map((msg) =>
							msg.id === tempMessage.id
								? { ...msg, status: "failed" }
								: msg
						)
					);
					toast.error("Failed to send message");
				},
			}
		);
	};

	useEffect(() => {
		// const admins: IUserToChat[] = (AdminUserList?.data ?? [])?.map(
		// 	(admin: any) => {
		// 		return {
		// 			id: admin?.id,
		// 			name: admin?.name,
		// 			email: admin?.email,
		// 			role: "Admin",
		// 		};
		// 	}
		// );
		const experts: IUserToChat[] = (expertList?.data?.data ?? []).map(
			(expert: any) => {
				return {
					id: expert?.id,
					name: expert?.name,
					email: expert?.email,
					role: "Expert",
				};
			}
		);
		const business: IUserToChat[] = (businessList?.data?.data ?? []).map(
			(business: any) => {
				return {
					id: business?.id,
					name: business?.name,
					email: business?.email,
					role: "Business",
				};
			}
		);

		setUsers([...(experts ?? []), ...(business ?? [])]);
	}, [expertList, businessList]);

	useEffect(() => {
		setLoggedInUser(JSON.parse(localStorage.getItem("user") || "{}"));
	}, []);

	const searchParams = useSearchParams();
	const userIdParam = searchParams.get("userId");
	const roleParam = searchParams.get("role");

	useEffect(() => {
		if (userIdParam && roleParam) {
			// Only initiate chat if not already active or loading
			if (!chatMessagesToFetch && !isPending) {
				handleCreateChat(userIdParam, roleParam);
			}
		}
	}, [userIdParam, roleParam, chatMessagesToFetch, isPending]);

	useEffect(() => {
		setMessages(chatMessages);
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatMessages]);

	return (
		<div className="flex h-[90vh] w-full">
			<div className="w-72 p-4 flex flex-col">
				<div className="flex items-center gap-2 border border-[#D1DAEC] p-2 rounded-[10px]">
					<Search className="w-4 h-4 text-gray-500" />
					<input
						placeholder="Search expert"
						className="flex-1 outline-none text-sm"
					/>
				</div>
				<div className="flex-1 flex flex-col relative gap-2 py-2 px-1 max-h-full mt-4 overflow-y-auto hide-scrollbar">
					{isLoading && <ChatListSkeleton />}
					{!isLoading && chats?.length === 0 && (
						<div className="flex flex-col items-center justify-center h-full p-6 text-center">
							<div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
								<MessageCircle className="h-8 w-8 text-gray-400" />
							</div>
							<h3 className="text-lg font-medium text-gray-700">
								No Conversations
							</h3>
							<p className="text-sm text-gray-500 mt-1">
								Start a new conversation to connect with others.
								Click the button below
							</p>
						</div>
					)}
					{chats?.map((chat: any) => (
						<div
							key={chat?._id}
							onClick={() => {
								setChatMessagesToFetch(chat?._id);
								setSelectedExpert(
									chat.participants.find(
										(p: {
											user: { _id: string; name: string };
										}) => p?.user?._id !== loggedInUser?.id
									)
								);
							}}
							className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedExpert?._id ===
								chat.participants.find(
									(p: {
										user: { _id: string; name: string };
									}) => p?.user?._id !== loggedInUser?.id
								)?._id
								? "bg-gray-100"
								: ""
								}`}
						>
							<div className="w-10 h-10 rounded-full overflow-hidden">
								<Avatar className="w-10 h-10">
									<AvatarImage
										src={
											chat.participants.find(
												(p: {
													user: {
														_id: string;
														name: string;
													};
												}) =>
													p?.user?._id !==
													loggedInUser?.id
											)?.user?.avatar
										}
										alt={
											chat.participants.find(
												(p: {
													user: {
														_id: string;
														name: string;
													};
												}) =>
													p?.user?._id !==
													loggedInUser?.id
											)?.user?.name
										}
									/>
									<AvatarFallback
										className={`${getColorForUser(
											chat.participants.find(
												(p: {
													user: {
														_id: string;
														name: string;
													};
												}) =>
													p?.user?._id !==
													loggedInUser?.id
											)?.user?.name
										)} text-white font-semibold`}
									>
										{chat.participants
											.find(
												(p: {
													user: {
														_id: string;
														name: string;
													};
												}) =>
													p?.user?._id !==
													loggedInUser?.id
											)
											?.user?.name?.[0]?.toUpperCase() ||
											"?"}
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="flex flex-col gap-1">
								<div className="text-sm font-semibold">
									{
										chat.participants.find(
											(p: {
												user: {
													_id: string;
													name: string;
												};
											}) =>
												p?.user?._id !==
												loggedInUser?.id
										)?.user?.name
									}
								</div>
								<div className="text-xs text-gray-500 truncate w-40">
									{
										chat.participants.find(
											(p: {
												user: {
													_id: string;
													name: string;
												};
											}) =>
												p?.user?._id !==
												loggedInUser?.id
										)?.userModel
									}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{!chatMessagesToFetch && (
				<div className="flex-1 border rounded-xl flex flex-col gap-4 items-center justify-center">
					<Image
						src={"/logo.svg"}
						alt={"Logo"}
						width={250}
						height={250}
					/>
					<span className="text-2xl font-semibold text-primary text-center">
						Scalepadi chats
					</span>
					<span className="text-sm text-gray-500 text-center">
						Select a chat to see messages
					</span>
				</div>
			)}

			{chatMessagesToFetch && (
				<div className="flex-1 flex flex-col">
					<div className="border-b border-[#F2F2F2] p-4 text-lg font-semibold flex items-center">
						{selectedExpert?.user?.name}
					</div>
					{chatMessages?.length > 0 && (
						<div className="flex-1 p-4 max-h-full overflow-y-auto flex flex-col gap-4">
							{messages?.map((msg, idx) => {
								const isMe = msg.sender.id === loggedInUser.id;

								return (
									<div
										key={idx}
										className={`flex flex-col mb-2 ${isMe
											? "items-end text-right"
											: "items-start text-left"
											}`}
									>
										<div className="text-xs text-gray-500 mb-1">
											{isMe ? "You" : msg.sender.model}{" "}
											{/* show "You" or the sender's model */}
										</div>
										<div
											className={`p-2 rounded-lg max-w-xs text-sm ${isMe
												? "bg-blue-100 text-blue-900"
												: "bg-gray-100 text-gray-900"
												}`}
										>
											{msg.content}
										</div>
									</div>
								);
							})}
							<div ref={bottomRef} />
						</div>
					)}
					{isLoadingMessages && (
						<div className="flex-1 p-4 max-h-full overflow-y-auto flex flex-col gap-4">
							<ChatWindowSkeleton />
						</div>
					)}
					{chatMessages?.length === 0 && (
						<div className="flex-1 p-4 max-h-full overflow-y-auto flex flex-col gap-4">
							<div className="flex flex-col items-center justify-center h-full text-center p-8">
								<div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
									<MessageSquare className="h-8 w-8 text-gray-400" />
								</div>
								<h3 className="text-lg font-medium text-gray-700">
									No messages yet
								</h3>
								<p className="text-sm text-gray-500 mt-1">
									Start the conversation and it will appear
									here.
								</p>
							</div>
						</div>
					)}
					<div className="pt-4 border-t -mx-2 px-2 lg:-mx-6 lg:px-6 border-[#F2F2F2]">
						<div className="flex items-center w-full justify-between bg-[#F7F7F8] py-1 px-[6px]">
							<div className="flex w-full items-center gap-1">
								{/* <Image
								src={"/images/scalepadi-ai-logo.svg"}
								alt="ScalePadi AI Logo"
								width={126}
								height={36}
							/> */}
								<Plus className="w-6 h-6 text-[#878A93] cursor-pointer" />
								<Input
									value={input}
									onChange={(e) => setInput(e.target.value)}
									className="w-full bg-[#F7F7F8] border-none focus:outline-none"
									autoFocus={true}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleSendMessage();
										}
									}}
								/>
							</div>
							<div
								onClick={handleSendMessage}
								className="p-1 rounded-[8px] bg-primary text-white flex items-center cursor-pointer"
							>
								<SendHorizontal className="-rotate-90" />
							</div>
						</div>
					</div>
				</div>
			)}
			<div
				onClick={() => setFindUsersToChat(true)}
				className="text-white w-12 h-12 flex-shrink-0 flex-none flex items-center justify-center rounded-full bg-primary hover:bg-primary-hover hover:text-black fixed bottom-24 left-[500px] cursor-pointer"
			>
				<Plus />
			</div>

			<Dialog open={findUsersToChat} onOpenChange={setFindUsersToChat}>
				<DialogContent className="!rounded-3xl">
					<DialogTitle className="text-primary text-[20px]">
						Find Busines, Expert or Admin to text
					</DialogTitle>

					<div className="flex flex-col gap-6">
						<div className="flex items-center gap-2 border border-[#D1DAEC] p-2 rounded-[10px]">
							<Search className="w-4 h-4 text-gray-500" />
							<input
								placeholder="Search user"
								className="flex-1 outline-none text-sm"
							/>
						</div>

						<div className="flex flex-col gap-2 users max-h-96 overflow-y-auto">
							{users?.map((user) => (
								<div
									key={user.name}
									className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100"
									onClick={() => {
										if (isPending) {
											toast.info(
												`Creating chat with ${user.name}, hold on`
											);
											return;
										}
										handleCreateChat(user?.id, user?.role);
									}}
								>
									<Avatar className="w-8 h-8">
										<AvatarImage
											src={user?.avatar}
											alt={user?.name}
										/>
										<AvatarFallback
											className={`${getColorForUser(
												user?.name
											)} text-white font-semibold`}
										>
											{user?.name?.[0]?.toUpperCase() ||
												"?"}
										</AvatarFallback>
									</Avatar>

									<div className="flex flex-col gap-1">
										<div className="text-sm font-semibold">
											{user.name}
										</div>
										<div className="text-xs text-gray-500 truncate w-40">
											{user.role}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
