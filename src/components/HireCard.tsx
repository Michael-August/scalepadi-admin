"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export interface Hire {
	businessId: {
		name: string;
		email: string;
		id: string;
	};
	expertId: {
		name: string;
		email: string;
		id: string;
		image?: string;
	};
	description: string;
	duration: string;
	budget: number;
	commissionDue: number;
	businessStatus: string;
	expertStatus: string;
	adminStatus: string;
	hireStatus: string;
	createdAt: string;
	id: string;
}

function getStatusColor(status: string) {
	switch (status?.toLowerCase()) {
		case "completed":
			return "bg-green-100 text-green-700 border-green-200";
		case "active":
		case "in_progress":
			return "bg-blue-100 text-blue-700 border-blue-200";
		case "pending":
		case "awaiting-response":
		case "negotiating":
			return "bg-yellow-100 text-yellow-700 border-yellow-200";
		case "cancelled":
		case "declined":
			return "bg-red-100 text-red-700 border-red-200";
		case "approved":
		case "accepted":
			return "bg-green-100 text-green-700 border-green-200";
		case "requested":
			return "bg-gray-100 text-gray-700 border-gray-200";
		default:
			return "bg-gray-100 text-gray-700 border-gray-200";
	}
}

export function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

export function HireCard({ hire, setHire }: { hire: Hire; setHire: (hire: Hire) => void }) {
	const router = useRouter();

	const handleMessage = (e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/messages?userId=${hire.expertId.id}&role=Expert`);
	};

	return (
		<Card
			className="overflow-hidden hover:shadow-lg transition-all duration-300 border-[#E9E9E9] flex flex-col h-full cursor-pointer group"
			onClick={() => setHire(hire)}
		>
			<CardContent className="p-5 flex-1 flex flex-col gap-4">
				{/* Header: Expert Info + Status */}
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10 border border-[#F2F2F2]">
							<AvatarImage src={hire.expertId.image} />
							<AvatarFallback className="bg-primary/10 text-primary font-bold">
								{hire.expertId.name?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<h3 className="font-bold text-sm text-[#0E1426] line-clamp-1 group-hover:text-primary transition-colors">
								{hire.expertId.name}
							</h3>
							<span className="text-[10px] text-[#878A93] font-medium">
								{hire.businessId.name} (Client)
							</span>
						</div>
					</div>
					<Badge
						variant="outline"
						className={`${getStatusColor(hire.hireStatus)} text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm whitespace-nowrap capitalize`}
					>
						{hire.hireStatus?.replace("_", " ")}
					</Badge>
				</div>

				{/* Description */}
				<p className="text-[#3E4351] text-xs leading-relaxed line-clamp-3 min-h-[4.5em]">
					{hire.description || "No description provided"}
				</p>

				{/* Details Grid */}
				<div className="grid grid-cols-2 gap-3 mt-auto pt-2">
					<div className="flex flex-col gap-1">
						<span className="text-[10px] text-[#878A93] font-medium flex items-center gap-1">
							<Calendar className="h-3 w-3" /> Duration
						</span>
						<span className="text-xs font-bold text-[#0E1426]">
							{hire.duration}
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-[10px] text-[#878A93] font-medium">
							Comm. Due
						</span>
						<span className="text-xs font-bold text-primary">
							{formatCurrency(hire.commissionDue) || 0}
						</span>
					</div>
				</div>
			</CardContent>

			<CardFooter className="p-4 bg-[#FBFCFC] border-t border-[#F2F2F2] flex gap-2">
				<Button
					variant="outline"
					size="sm"
					className="flex-1 text-xs h-9 gap-2 border-[#D1DAEC] text-[#3E4351]"
					onClick={handleMessage}
				>
					<MessageSquare className="h-3.5 w-3.5" />
					Message
				</Button>
				<Button
					size="sm"
					className="flex-1 text-xs h-9 gap-2 shadow-sm"
					onClick={() => setHire(hire)}
				>
					<ExternalLink className="h-3.5 w-3.5" />
					Details
				</Button>
			</CardFooter>
		</Card>
	);
}

