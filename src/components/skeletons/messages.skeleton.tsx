import { Skeleton } from "@/components/ui/skeleton";

export function ChatWindowSkeleton() {
	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Chat header */}
			<Skeleton className="h-6 w-32 rounded" />

			<div className="flex flex-col gap-4 mt-6">
				{/* Message 1 */}
				<div className="flex flex-col items-start gap-2">
					<Skeleton className="h-4 w-24 rounded" />
					<Skeleton className="h-12 w-64 rounded-lg" />
				</div>

				{/* Message 2 */}
				<div className="flex flex-col items-start gap-2">
					<Skeleton className="h-4 w-28 rounded" />
					<Skeleton className="h-16 w-80 rounded-lg" />
				</div>

				{/* Message 3 */}
				<div className="flex flex-col items-start gap-2">
					<Skeleton className="h-4 w-20 rounded" />
					<Skeleton className="h-10 w-48 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
