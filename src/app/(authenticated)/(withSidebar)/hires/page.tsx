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
import { Search } from "lucide-react";
import { Hire, HireCard } from "@/components/HireCard";
import ProjectSkeletonLoader from "@/components/skeletons/projects.skeleton";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Hires = () => {
	const { hireList, isLoading } = useGetHires();
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

	return (
		<div>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Select value="rating">
							<SelectTrigger className="w-fit rounded-[10px] h-9 border border-[#D1DAEC]">
								<SelectValue placeholder="Filter" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="rating">
										By rating
									</SelectItem>
									<SelectItem value="duration">
										By duration
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<div className="rounded-[10px] p-2 flex items-center h-9 gap-2 border border-[#D8DFE2]">
							<Search className="w-3 h-3" />
							<Input
								className="border-0 bg-transparent !h-9 p-0"
								placeholder="search"
							/>
						</div>
					</div>
				</div>

				{isLoading ? (
					<ProjectSkeletonLoader />
				) : hireList?.data?.data?.length === 0 ? (
					<div className="empty-state h-full w-full bg-[#FBFCFC] rounded-3xl p-3">
						<div className="bg-[#FFFFFF] h-full w-full rounded-[14px] border border-[#D1DAEC80] flex items-center justify-center py-5">
							<div className="flex flex-col items-center w-full lg:w-[533px] justify-center gap-10">
								<Image
									src={"/images/empty-search.svg"}
									alt="Search icon"
									width={164}
									height={150}
								/>
								<span className="text-center text-base text-[#878A93]">
									No hired experts found
								</span>
							</div>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						{hireList?.data?.data?.map((hire: any) => (
							<HireCard
								setHire={openDialog}
								key={hire.id}
								hire={hire}
							/>
						))}
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
								<p>₦{hireToActOn?.budget?.toLocaleString()}</p>
							</div>
							<div>
								<p className="font-semibold">Commission Due</p>
								<p>
									₦
									{hireToActOn?.commissionDue?.toLocaleString()}
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
