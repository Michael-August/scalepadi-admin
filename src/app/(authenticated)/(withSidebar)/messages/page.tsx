"use client";

import { useEffect, useRef, useState, Suspense } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ChatWindowSkeleton } from "@/components/skeletons/messages.skeleton";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow, isToday, format } from "date-fns";
import { useMemo } from "react";

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
	if (name) {
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
	}
	return colors[Math.abs(hash) % colors.length];
}

function MessagesContent() {
	const [selectedExpert, setSelectedExpert] = useState<any>();
	const [messages, setMessages] = useState<Message[]>([]);

	const bottomRef = useRef<HTMLDivElement | null>(null);

	const [findUsersToChat, setFindUsersToChat] = useState(false);

	const { chats, isLoading } = useGetChats();
	const { createChat, isPending } = useCreateChat();

	const [chatMessagesToFetch, setChatMessagesToFetch] = useState("");

	const { expertList } = useGetAllExpert();
	const { businessList } = useGetAllBusiness();

	const { messages: chatMessages, isLoading: isLoadingMessages } =
		useGetChatMessages(chatMessagesToFetch);
	const { sendMessage } =
		useSendMessages(chatMessagesToFetch);

	const [users, setUsers] = useState<IUserToChat[]>([]);
	const [loggedInUser, setLoggedInUser] = useState<any>();

	const [input, setInput] = useState("");
	const [sidebarSearch, setSidebarSearch] = useState("");
	const hasProcessedParams = useRef(false);

	const handleCreateChat = (userId: string, role: string) => {
		if (!userId || !role) {
			toast.error("Please select a valid user");
			return;
		}

		createChat(
			{ participants: [{ user: userId, userModel: role }] },
			{
				onSuccess: (res) => {
					setFindUsersToChat(false);
					setChatMessagesToFetch(res?.data?.id);

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

	const handleSendMessage = () => {
		if (!input.trim()) return;

		const tempMessage: Message = {
			id: `temp-${Date.now()}`,
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
				onSuccess: (res: any) => {
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
							msg.id === tempMessage.id ? { ...msg } : msg
						)
					);
					toast.error("Failed to send message");
				},
			}
		);
	};

	useEffect(() => {
		const experts: IUserToChat[] = (expertList?.data?.data ?? []).map(
			(expert: any) => ({
				id: expert?.id,
				name: expert?.name,
				email: expert?.email,
				role: "Expert",
				avatar: expert?.profilePicture || expert?.image,
			})
		);
		const business: IUserToChat[] = (businessList?.data?.data ?? []).map(
			(business: any) => ({
				id: business?.id,
				name: business?.name,
				email: business?.email,
				role: "Business",
				avatar: business?.avatar,
			})
		);

		const allUsers = [...experts, ...business];
		const uniqueUsers = Array.from(new Map(allUsers.map((u) => [u.id, u])).values());
		setUsers(uniqueUsers);
	}, [expertList, businessList]);

	useEffect(() => {
		setLoggedInUser(JSON.parse(localStorage.getItem("user") || "{}"));
	}, []);

	const searchParams = useSearchParams();
	const userIdParam = searchParams.get("userId");
	const roleParam = searchParams.get("role");

	useEffect(() => {
		if (userIdParam && roleParam && chats && !isPending && !hasProcessedParams.current) {
			const myId = loggedInUser?.id || loggedInUser?._id;

			// Find if a chat with this user already exists
			const existingChat = chats.find((chat: any) =>
				chat.participants.some((p: any) => {
					const pId = p.user?._id || p.user?.id || p.user;
					return pId === userIdParam && p.userModel === roleParam;
				})
			);

			if (existingChat) {
				setChatMessagesToFetch(existingChat._id);
				const otherParticipant = existingChat.participants.find((p: any) => {
					const pId = p.user?._id || p.user?.id || p.user;
					return pId !== myId;
				});
				if (otherParticipant) setSelectedExpert(otherParticipant);
				hasProcessedParams.current = true;
			} else {
				handleCreateChat(userIdParam, roleParam);
				hasProcessedParams.current = true;
			}
		}
	}, [userIdParam, roleParam, chats, isPending, loggedInUser]);

	useEffect(() => {
		setMessages(chatMessages || []);
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatMessages]);

	const uniqueChats = useMemo(() => {
		if (!chats) return [];
		const myId = loggedInUser?.id || loggedInUser?._id;

		return chats.filter((chat: any) => {
			const hasMessages = chat.lastMessage || (chat.messages && chat.messages.length > 0);
			const isCurrentlySelected = chat._id === chatMessagesToFetch;
			return hasMessages || isCurrentlySelected;
		}).map((chat: any) => {
			const otherParticipant = chat.participants.find((p: any) => {
				const pId = p.user?._id || p.user?.id || p.user;
				return pId !== myId;
			});

			// Calculate unread count specifically for the admin
			// 1. If the admin sent the last message, unread count for the admin should be 0
			// 2. If the chat is currently selected, unread count should be 0
			const isLastSenderMe = chat.lastMessage?.sender?.id === myId || chat.lastMessage?.sender?._id === myId;
			const isCurrentlyActive = chat._id === chatMessagesToFetch;

			let unreadCount = chat.unreadCount || 0;
			if (isLastSenderMe || isCurrentlyActive) {
				unreadCount = 0;
			}

			return {
				...chat,
				otherParticipant,
				unreadCount
			};
		});
	}, [chats, loggedInUser, chatMessagesToFetch]);

	const filteredChats = useMemo(() => {
		if (!sidebarSearch.trim()) return uniqueChats;
		const s = sidebarSearch.toLowerCase();
		return uniqueChats.filter((chat: any) => {
			const other = chat.participants.find((p: any) => {
				const pId = p.user?._id || p.user?.id || p.user;
				return pId !== (loggedInUser?.id || loggedInUser?._id);
			});
			return other?.user?.name?.toLowerCase().includes(s);
		});
	}, [uniqueChats, sidebarSearch, loggedInUser]);

	const [searchUser, setSearchUser] = useState("");

	const filteredUsers = useMemo(() => {
		if (!searchUser.trim()) return users;
		const s = searchUser.toLowerCase();
		return users.filter(u => u.name.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s));
	}, [users, searchUser]);

	return (
		<div className="flex h-[88vh] w-full bg-white rounded-2xl border border-[#EFF2F3] overflow-hidden shadow-sm">
			{/* Sidebar */}
			<div className="w-80 border-r border-[#EFF2F3] flex flex-col bg-[#FBFCFC]">
				<div className="p-4 space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-bold text-[#0E1426]">Messages</h1>
						<div
							onClick={() => setFindUsersToChat(true)}
							className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
						>
							<Plus className="w-5 h-5" />
						</div>
					</div>

					<div className="relative group">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
						<input
							placeholder="Search conversations..."
							value={sidebarSearch}
							onChange={(e) => setSidebarSearch(e.target.value)}
							className="w-full bg-white border border-[#D1DAEC] pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
						/>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 scrollbar-thin">
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
							</p>
						</div>
					)}
					{filteredChats.map((chat: any) => {
						const otherParticipant = chat.otherParticipant;
						if (!otherParticipant) return null;

						const otherId = otherParticipant.user?._id || otherParticipant.user?.id || otherParticipant.user;
						const isSelected = chatMessagesToFetch === chat._id;

						const lastMsg = chat.lastMessage;
						const unreadCount = chat.unreadCount;

						return (
							<div
								key={chat._id}
								onClick={() => {
									setChatMessagesToFetch(chat._id);
									setSelectedExpert(otherParticipant);
								}}
								className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isSelected
									? "bg-white shadow-md border-l-4 border-l-primary"
									: "hover:bg-gray-100 border-l-4 border-l-transparent"
									}`}
							>
								<div className="relative flex-shrink-0">
									<Avatar className="h-12 w-12 border-2 border-white shadow-sm">
										<AvatarImage
											src={otherParticipant.user?.avatar || otherParticipant.user?.profilePicture || otherParticipant.user?.image}
											alt={otherParticipant.user?.name}
										/>
										<AvatarFallback
											className={`${getColorForUser(
												otherParticipant.user?.name || "?"
											)} text-white text-xs font-bold`}
										>
											{otherParticipant.user?.name?.[0]?.toUpperCase() || "?"}
										</AvatarFallback>
									</Avatar>
									{chat.online && (
										<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
									)}
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between mb-0.5">
										<h3 className="text-sm font-bold text-[#0E1426] truncate max-w-[120px]">
											{otherParticipant.user?.name || "Unknown User"}
										</h3>
										{lastMsg?.createdAt && (
											<span className="text-[10px] text-gray-400 font-medium">
												{isToday(new Date(lastMsg.createdAt))
													? format(new Date(lastMsg.createdAt), "h:mm a")
													: formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: false })}
											</span>
										)}
									</div>

									<div className="flex items-center justify-between">
										<p className={`text-xs truncate max-w-[140px] ${unreadCount > 0 ? "text-[#0E1426] font-bold" : "text-gray-500"
											}`}>
											{lastMsg?.content || `Start a conversation...`}
										</p>
										{unreadCount > 0 && (
											<span className="flex items-center justify-center min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full px-1 shadow-sm">
												{unreadCount}
											</span>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{!chatMessagesToFetch ? (
				<div className="flex-1 flex flex-col gap-6 items-center justify-center bg-gray-50/30">
					<div className="relative">
						<div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
						<Image
							src={"/logo.svg"}
							alt={"Logo"}
							width={160}
							height={160}
							className="relative opacity-20 grayscale"
						/>
					</div>
					<div className="text-center space-y-2">
						<h2 className="text-2xl font-bold text-[#0E1426]">Scalepadi Chats</h2>
						<p className="text-sm text-gray-500 max-w-[280px]">
							Select a conversation from the sidebar or start a new one to begin messaging.
						</p>
					</div>
					<button
						onClick={() => setFindUsersToChat(true)}
						className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
					>
						<Plus className="w-5 h-5" />
						Start New Chat
					</button>
				</div>
			) : (
				<div className="flex-1 flex flex-col bg-white">
					<div className="border-b border-[#EFF2F3] p-4 bg-[#FBFCFC] flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Avatar className="h-10 w-10 border border-[#EFF2F3]">
								<AvatarImage src={selectedExpert?.user?.avatar || selectedExpert?.user?.profilePicture} />
								<AvatarFallback className={`${getColorForUser(selectedExpert?.user?.name)} text-white font-bold`}>
									{selectedExpert?.user?.name?.[0]?.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div>
								<h2 className="text-sm font-bold text-[#0E1426] leading-none mb-1">
									{selectedExpert?.user?.name}
								</h2>
								<div className="flex items-center gap-1.5">
									<span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
									<span className="text-[10px] text-gray-400 font-medium">Active now</span>
								</div>
							</div>
						</div>
					</div>
					<div className="flex-1 p-4 max-h-full overflow-y-auto flex flex-col gap-4">
						{messages?.length === 0 && !isLoadingMessages && (
							<div className="flex flex-col items-center justify-center h-full text-center p-8">
								<div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
									<MessageSquare className="h-8 w-8 text-gray-400" />
								</div>
								<h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
								<p className="text-sm text-gray-500 mt-1">Start the conversation below.</p>
							</div>
						)}
						{isLoadingMessages && <ChatWindowSkeleton />}
						{messages?.map((msg, idx) => {
							const isMe = msg.sender.id === loggedInUser?.id || msg.sender.id === loggedInUser?._id;
							return (
								<div
									key={idx}
									className={`flex flex-col mb-2 ${isMe ? "items-end" : "items-start"}`}
								>
									<div className="text-[10px] text-gray-400 mb-1 px-1">
										{isMe ? "You" : (selectedExpert?.user?.name || msg.sender.model)}
									</div>
									<div
										className={`p-3 rounded-2xl max-w-sm text-sm shadow-sm ${isMe
											? "bg-primary text-white rounded-tr-none"
											: "bg-gray-100 text-gray-900 rounded-tl-none"
											}`}
									>
										{msg.content}
									</div>
									<div className="text-[9px] text-gray-400 mt-1 px-1">
										{format(new Date(msg.createdAt), "h:mm a")}
									</div>
								</div>
							);
						})}
						<div ref={bottomRef} />
					</div>
					<div className="p-4 border-t border-[#EFF2F3] bg-[#FBFCFC]">
						<div className="flex items-center gap-2 bg-white border border-[#D1DAEC] rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
							<button className="p-2 text-gray-400 hover:text-primary transition-colors">
								<Plus className="w-5 h-5" />
							</button>
							<Input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Type a message..."
								className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
								onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
							/>
							<button
								onClick={handleSendMessage}
								disabled={!input.trim()}
								className="p-2.5 rounded-lg bg-primary text-white disabled:opacity-50 disabled:grayscale hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
							>
								<SendHorizontal className="w-5 h-5 -rotate-45" />
							</button>
						</div>
					</div>
				</div>
			)}

			<Dialog open={findUsersToChat} onOpenChange={setFindUsersToChat}>
				<DialogContent className="sm:max-w-[425px] !rounded-3xl p-6">
					<DialogTitle className="text-xl font-bold text-[#0E1426] mb-4">
						New Message
					</DialogTitle>

					<div className="space-y-6">
						<div className="relative group">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
							<input
								placeholder="Search people..."
								value={searchUser}
								onChange={(e) => setSearchUser(e.target.value)}
								className="w-full bg-gray-50 border border-[#D1DAEC] pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
							/>
						</div>

						<div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
							{filteredUsers?.map((user) => (
								<div
									key={user.id}
									className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
									onClick={() => handleCreateChat(user?.id, user?.role)}
								>
									<Avatar className="h-10 w-10 border border-white shadow-sm font-bold">
										<AvatarImage src={user?.avatar} />
										<AvatarFallback className={`${getColorForUser(user?.name)} text-white`}>
											{user?.name?.[0]?.toUpperCase()}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 min-w-0">
										<div className="text-sm font-bold text-[#0E1426] truncate">{user.name}</div>
										<div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{user.role}</div>
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

export default function MessagesPage() {
	return (
		<Suspense fallback={<div className="flex h-[88vh] items-center justify-center bg-white rounded-2xl border border-[#EFF2F3]">
			<div className="flex flex-col items-center gap-4">
				<div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
				<span className="text-sm text-gray-500 font-medium">Loading your conversations...</span>
			</div>
		</div>}>
			<MessagesContent />
		</Suspense>
	);
}
