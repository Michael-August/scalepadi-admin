"use client";

import { useGetHireById, useGetHires } from "@/hooks/useExpert";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Hire, HireCard, formatCurrency } from "@/components/HireCard";
import ProjectSkeletonLoader from "@/components/skeletons/projects.skeleton";
import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";

const Hires = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [status, setStatus] = useState("all");
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);

	const { hireList, isLoading } = useGetHires(currentPage, 10, status, debouncedSearch);
	const [hireToActOn, setHireToActOn] = useState<Hire | null>(null);

	const { hireDetails } = useGetHireById(hireToActOn?.id as string);

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (hireToActOn) {
			setOpen(true);
		}
	}, [hireToActOn]);

	const openDialog = (hire: Hire) => {
		setHireToActOn(hire); // when this updates, the effect will run
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [status, debouncedSearch]);

	const handlePageChange = useCallback((newPage: number) => {
		if (newPage >= 1 && (hireList?.data?.totalPages === undefined || newPage <= hireList?.data?.totalPages)) {
			setCurrentPage(newPage);
		}
	}, [hireList?.data?.totalPages]);

	const processedHires = useMemo(() => {
		if (!hireList?.data?.data) return [];

		let list = hireList.data.data;

		// Fallback client-side filtering for status if API doesn't support it
		if (status && status !== "all") {
			list = list.filter((hire: any) =>
				hire.hireStatus?.toLowerCase() === status.toLowerCase() ||
				hire.status?.toLowerCase() === status.toLowerCase()
			);
		}

		// Fallback client-side filtering for search if API doesn't support it
		if (debouncedSearch) {
			const s = debouncedSearch.toLowerCase();
			list = list.filter((hire: any) =>
				hire.expertId?.name?.toLowerCase().includes(s) ||
				hire.businessId?.name?.toLowerCase().includes(s) ||
				hire.description?.toLowerCase().includes(s)
			);
		}

		return list;
	}, [hireList, status, debouncedSearch]);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger className="w-fit rounded-[10px] h-9 border border-[#D1DAEC]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="requested">Requested</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="accepted">Accepted</SelectItem>
									<SelectItem value="in_progress">In Progress</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<div className="rounded-[10px] p-2 flex items-center h-9 gap-2 border border-[#D8DFE2] bg-white">
							<Search className="w-3 h-3 text-[#878A93]" />
							<Input
								className="border-0 bg-transparent !h-9 p-0 focus-visible:ring-0 text-xs w-48"
								placeholder="Search hires..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					</div>
				</div>

				{isLoading ? (
					<ProjectSkeletonLoader />
				) : processedHires.length === 0 ? (
					<div className="empty-state h-[60vh] w-full bg-[#FBFCFC] rounded-3xl p-3">
						<div className="bg-[#FFFFFF] h-full w-full rounded-[14px] border border-[#D1DAEC80] flex items-center justify-center py-5">
							<div className="flex flex-col items-center w-full lg:w-[533px] justify-center gap-6">
								<Image
									src={"/images/empty-search.svg"}
									alt="Search icon"
									width={164}
									height={150}
								/>
								<span className="text-center text-base text-[#878A93]">
									No hired experts found matching the filters
								</span>
							</div>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{processedHires.map((hire: any) => (
								<HireCard
									setHire={openDialog}
									key={hire.id}
									hire={hire}
								/>
							))}
						</div>

						{/* Pagination */}
						{hireList?.data?.totalPages > 1 && (
							<div className="flex items-center justify-between bg-[#FBFCFC] border border-[#EFF2F3] p-4 rounded-2xl mb-4">
								<div className="flex items-center gap-2">
									<span className="text-sm text-[#878A93] font-medium">
										Page <span className="text-[#3E4351] font-bold">{currentPage}</span> of <span className="text-[#3E4351] font-bold">{hireList?.data?.totalPages}</span>
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Button
										variant="outline"
										size="sm"
										className="h-8 w-8 p-0 rounded-lg border-[#D1DAEC]"
										onClick={() => handlePageChange(currentPage - 1)}
										disabled={currentPage === 1}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="h-8 w-8 p-0 rounded-lg border-[#D1DAEC]"
										onClick={() => handlePageChange(currentPage + 1)}
										disabled={currentPage === hireList?.data?.totalPages}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-lg rounded-2xl p-6">
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">
							Hire Details
						</DialogTitle>
						<DialogDescription>
							Summary of the project information
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-5 mt-4">
						<section>
							<h4 className="font-medium text-sm text-gray-500">
								Client
							</h4>
							<div className="mt-1 text-sm">
								<p>
									<span className="font-semibold">Name:</span>{" "}
									{hireToActOn?.businessId?.name}
								</p>
								<p>
									<span className="font-semibold">
										Email:
									</span>{" "}
									{hireToActOn?.businessId?.email}
								</p>
							</div>
						</section>

						<Separator />

						<section>
							<h4 className="font-medium text-sm text-gray-500">
								Expert
							</h4>
							<div className="mt-1 text-sm">
								<p>
									<span className="font-semibold">Name:</span>{" "}
									{hireToActOn?.expertId?.name}
								</p>
								<p>
									<span className="font-semibold">
										Email:
									</span>{" "}
									{hireToActOn?.expertId?.email}
								</p>
							</div>
						</section>

						<Separator />

						<section className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="font-semibold">Budget</p>
								<p>{formatCurrency(hireToActOn?.budget || 0)}</p>
							</div>
							<div>
								<p className="font-semibold">Commission Due</p>
								<p>
									{formatCurrency(hireToActOn?.commissionDue || 0)}
								</p>
							</div>
							<div>
								<p className="font-semibold">Duration</p>
								<p>{hireToActOn?.duration}</p>
							</div>
							{/* <div>
								<p className="font-semibold">Payment ID</p>
								<p>{hireToActOn?.paymentId}</p>
							</div> */}
						</section>

						<Separator />

						<section className="space-y-2 text-sm">
							<div>
								<p className="font-semibold">Description</p>
								<p>{hireToActOn?.description}</p>
							</div>

							<div className="flex items-center gap-2">
								<p className="font-semibold">
									Business Status:
								</p>
								<Badge variant="outline">
									{hireToActOn?.businessStatus}
								</Badge>
							</div>

							<div className="flex items-center gap-2">
								<p className="font-semibold">Expert Status:</p>
								<Badge variant="outline">
									{hireToActOn?.expertStatus}
								</Badge>
							</div>

							<div className="flex items-center gap-2">
								<p className="font-semibold">Hire Status:</p>
								<Badge variant="outline">
									{hireToActOn?.hireStatus}
								</Badge>
							</div>

							{/* <p className="text-sm text-gray-500">
								Created: {new Date(hireToActOn?.createdAt).toLocaleString()}
							</p>
							<p className="text-sm text-gray-500">
								Paid On: {new Date(hireToActOn?.paidOn).toLocaleString()}
							</p> */}
						</section>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Hires;
