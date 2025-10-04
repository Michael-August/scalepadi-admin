"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ChatListSkeleton() {
	return (
		<div className="flex flex-col gap-3 p-4">
			{Array.from({ length: 14 }).map((_, i) => (
				<div
					key={i}
					className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
				>
					{/* Avatar */}
					<Skeleton className="h-10 w-10 rounded-full" />

					{/* Text content */}
					<div className="flex flex-col gap-2 flex-1">
						<Skeleton className="h-3 w-32 rounded" /> {/* Name */}
						<Skeleton className="h-3 w-20 rounded" />{" "}
						{/* Subtitle */}
					</div>
				</div>
			))}

			{/* Floating Action Button */}
			<div className="fixed bottom-6 right-6">
				<Skeleton className="h-12 w-12 rounded-full" />
			</div>
		</div>
	);
}
