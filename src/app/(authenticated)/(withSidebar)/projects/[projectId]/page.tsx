"use client";

import { Button } from "@/components/ui/button";
import {
	Clock,
	Church,
	Download,
	Pin,
	Verified,
	Star,
	X,
	CheckCircle,
	PhoneOutgoingIcon,
	CalendarIcon,
	Plus,
	Upload,
	FileText,
	Link2,
	Eye,
	Edit,
	Trash2,
	UserPlus,
} from "lucide-react";
import { GoUnverified } from "react-icons/go";
import { useState, useEffect } from "react";
import { useGetProjectById, useApproveProject } from "@/hooks/useProjects";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ProjectSkeleton } from "@/components/ui/project-skeleton";
import Image from "next/image";
import {
	useCreateTask,
	useGetProjectTasks,
	useUpdateTask,
	useDeleteTask,
	useAssignTask,
	useUpdateTaskChanges,
} from "@/hooks/useTask";
import { toast } from "sonner";
import { useGetAllExpert } from "@/hooks/useExpert";
import Link from "next/link";
import moment from "moment";

type Task = {
	id: string;
	title: string;
	description: string;
	status:
		| "pending"
		| "in-progress"
		| "completed"
		| "approved"
		| "need-changes"
		| "assigned"
		| "not-assigned";
	dueDate: string;
	link?: string[];
	document?: string[];
	assignee?: {
		id: string;
		name: string;
		email?: string;
		profilePicture?: string;
	};
	submission?: string[];
	assignedTo?: {
		id: string;
		name: string;
		email?: string;
		profilePicture?: string;
	};
	createdAt: string;
	updatedAt: string;
};

type Expert = {
	id: string;
	name: string;
	email: string;
	status: "active" | "inactive";
	category: string;
	profilePicture?: string;
	phone: string;
	gender: string;
	verified: boolean;
	role: string[];
	preferredIndustry: string[];
	skills: string[];
	bio: string;
	availability: string;
	projectCount: number;
	taskCount: number;
	regPercentage: number;
	terms: boolean;
	lastLogin: string;
	createdAt: string;
	country: string;
	state: string;
	socialLinks?: any;
};

interface TaskFormData {
	title: string;
	description: string;
	dueDate: string;
	link: string[];
	documents: File[];
	newLink: string;
}

const ExpertAssignmentItem = ({
	expert,
	taskId,
	onAssignmentComplete,
}: {
	expert: Expert;
	taskId: string;
	onAssignmentComplete: () => void;
}) => {
	const assignTaskMutation = useAssignTask();

	const handleAssign = () => {
		assignTaskMutation.mutate(
			{
				taskId: taskId,
				expertId: expert.id,
			},
			{
				onSuccess: () => {
					onAssignmentComplete();
				},
			}
		);
	};

	return (
		<div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
					{expert.profilePicture ? (
						<Image
							src={expert.profilePicture}
							alt="Expert"
							width={40}
							height={40}
							className="rounded-full object-fit"
						/>
					) : (
						<span className="text-sm font-medium">
							{expert.name.charAt(0)}
						</span>
					)}
				</div>
				<div>
					<p className="font-medium text-sm capitalize">
						{expert.name}
					</p>
					{expert.category && (
						<p className="text-xs text-gray-500 capitalize">
							{expert.category}
						</p>
					)}
					<div className="flex items-center gap-2 mt-1">
						{expert.verified && (
							<div className="flex items-center gap-1">
								<Verified className="w-3 h-3 text-green-500" />
								<span className="text-xs text-green-600">
									Verified
								</span>
							</div>
						)}
						<span
							className={`text-xs px-2 py-0.5 rounded-full capitalize ${
								expert.status === "active"
									? "bg-green-100 text-green-800"
									: "bg-gray-100 text-gray-800"
							}`}
						>
							{expert.status}
						</span>
					</div>
				</div>
			</div>
			<Button
				size="sm"
				onClick={handleAssign}
				disabled={
					assignTaskMutation.isPending || expert.status !== "active"
				}
				className="bg-primary text-white hover:bg-primary-hover min-w-[80px]"
			>
				{assignTaskMutation.isPending ? "Assigning..." : "Assign"}
			</Button>
		</div>
	);
};

const ProjectDetails = () => {
	const [activeTab, setActiveTab] = useState<
		"projectOverview" | "taskTracker"
	>("projectOverview");
	const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
	const [isExpertAssignModalOpen, setIsExpertAssignModalOpen] =
		useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [selectedTaskForAssign, setSelectedTaskForAssign] = useState<
		string | null
	>(null);
	const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [approvalStatus, setApprovalStatus] = useState<boolean>(true);
	const [discount, setDiscount] = useState<number>(0);
	const [proposedTotalCost, setProposedTotalCost] = useState<number>(0);
	const [taskForm, setTaskForm] = useState<TaskFormData>({
		title: "",
		description: "",
		dueDate: "",
		link: [],
		documents: [],
		newLink: "",
	});
	const [uploading, setUploading] = useState(false);

	const [showNoteInput, setShowNoteInput] = useState<
		"approved" | "needs-changes" | null
	>(null);
	const [note, setNote] = useState("");

	const updateTaskChangesMutation = useUpdateTaskChanges({
		onSuccess: () => {
			setShowNoteInput(null);
			setNote("");
		},
		onError: () => {
			// Optional: handle error state if needed
		},
	});

	const handleStatusUpdate = (
		status: "approved" | "needs-changes",
		note: string,
		taskId: string
	) => {
		if (!note.trim()) {
			toast.error("Please enter a note before submitting.");
			return;
		}

		updateTaskChangesMutation.mutate({
			taskId: taskId,
			status: status,
			note: note.trim(),
		});
	};

	const params = useParams();
	const projectId = params.projectId as string;

	const { projectDetails, isLoading } = useGetProjectById(projectId);
	const { projectTasks, isLoading: tasksLoading } =
		useGetProjectTasks(projectId);
	console.log(projectDetails);
	const { expertList, isLoading: expertsLoading } = useGetAllExpert();
	const createTaskMutation = useCreateTask();
	const updateTaskMutation = useUpdateTask();
	const deleteTaskMutation = useDeleteTask();
	const approveProjectMutation = useApproveProject();

	useEffect(() => {
		if (isApprovalModalOpen && projectDetails) {
			setDiscount(0);
			setProposedTotalCost(projectDetails.proposedTotalCost ?? 0);
		}
	}, [isApprovalModalOpen, projectDetails]);

	useEffect(() => {
		if (!isTaskModalOpen) {
			setTaskForm({
				title: "",
				description: "",
				dueDate: "",
				link: [],
				documents: [],
				newLink: "",
			});
			setEditingTask(null);
		}
	}, [isTaskModalOpen]);

	useEffect(() => {
		if (editingTask) {
			setTaskForm({
				title: editingTask.title,
				description: editingTask.description,
				dueDate: format(
					new Date(editingTask.dueDate),
					"yyyy-MM-dd'T'HH:mm"
				),
				link: editingTask.link || [],
				documents: [],
				newLink: "",
			});
		}
	}, [editingTask]);

	const handleApprove = () => {
		if (!projectDetails) return;

		const finalDiscount = Math.min(discount, proposedTotalCost);

		approveProjectMutation.mutate(
			{
				projectId,
				approved: approvalStatus,
			},
			{
				onSuccess: () => {
					setIsApprovalModalOpen(false);
				},
			}
		);
	};

	const handleTaskSubmit = () => {
		if (!taskForm.title || !taskForm.description || !taskForm.dueDate) {
			toast.error("Please fill in all required fields");
			return;
		}

		setUploading(true);

		const taskData = {
			title: taskForm.title,
			description: taskForm.description,
			dueDate: new Date(taskForm.dueDate).toISOString(),
			link: taskForm.link,
			documents: taskForm.documents, // Pass File[] directly
		};

		if (editingTask) {
			// For update, we need to handle file upload differently
			updateTaskMutation.mutate(
				{
					taskId: editingTask.id,
					updateData: taskData,
				},
				{
					onSuccess: () => {
						setIsTaskModalOpen(false);
						setUploading(false);
						// toast.success("Task updated successfully");
						setEditingTask(null);
					},
					onError: () => {
						setUploading(false);
					},
				}
			);
		} else {
			createTaskMutation.mutate(
				{
					projectId,
					...taskData,
				},
				{
					onSuccess: () => {
						setIsTaskModalOpen(false);
						setUploading(false);
						// refetchTasks();
						// toast.success("Task created successfully");
					},
					onError: () => {
						setUploading(false);
					},
				}
			);
		}
	};

	const handleDeleteTask = () => {
		if (!taskToDelete) return;

		deleteTaskMutation.mutate(taskToDelete, {
			onSuccess: () => {
				setIsDeleteModalOpen(false);
				setTaskToDelete(null);
				// toast.success("Task deleted successfully");
			},
		});
	};

	const openDeleteModal = (taskId: string) => {
		setTaskToDelete(taskId);
		setIsDeleteModalOpen(true);
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newFiles = Array.from(files);
			setTaskForm((prev) => ({
				...prev,
				documents: [...prev.documents, ...newFiles],
			}));
		}
	};

	const removeFile = (index: number) => {
		setTaskForm((prev) => ({
			...prev,
			documents: prev.documents.filter((_, i) => i !== index),
		}));
	};

	const addLink = () => {
		if (taskForm.newLink.trim()) {
			setTaskForm((prev) => ({
				...prev,
				link: [...prev.link, prev.newLink.trim()],
				newLink: "",
			}));
		}
	};

	const removeLink = (index: number) => {
		setTaskForm((prev) => ({
			...prev,
			link: prev.link.filter((_, i) => i !== index),
		}));
	};

	const openTaskDetails = (task: Task) => {
		setSelectedTask(task);
		setIsTaskDetailsModalOpen(true);
	};

	const openEditTask = (task: Task) => {
		setEditingTask(task);
		setIsTaskModalOpen(true);
	};

	const openAssignExpert = (taskId: string) => {
		setSelectedTaskForAssign(taskId);
		setIsExpertAssignModalOpen(true);
	};

	const statusColors = {
		completed: "bg-green-100 text-green-800",
		approved: "bg-blue-100 text-blue-800",
		"in-progress": "bg-indigo-100 text-indigo-800",
		assigned: "bg-orange-100 text-orange-800",
		"not-assigned": "bg-gray-100 text-gray-800",
		"need-changes": "bg-red-100 text-red-800",
		default: "bg-yellow-100 text-yellow-800",
		pending: "bg-yellow-100 text-yellow-800",
	};

	if (isLoading || tasksLoading) {
		return <ProjectSkeleton />;
	}

	if (!projectDetails) {
		return (
			<div className="flex justify-center items-center h-64">
				<span className="text-gray-500">Project not found</span>
			</div>
		);
	}

	const formattedText = projectDetails?.brief
		.replace(/\\r\\n/g, "<br />")
		.replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

	return (
		<div className="flex w-full flex-col gap-6">
			{/* Delete Confirmation Modal */}
			{isDeleteModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl p-6 w-full max-w-md">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-red-600">
								Delete Task
							</h3>
							<button
								onClick={() => setIsDeleteModalOpen(false)}
								className="p-1 rounded-full hover:bg-gray-100"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="space-y-4">
							<p className="text-gray-600">
								Are you sure you want to delete this task? This
								action cannot be undone.
							</p>
						</div>

						<div className="flex justify-end gap-3 mt-6">
							<Button
								variant="outline"
								onClick={() => setIsDeleteModalOpen(false)}
								disabled={deleteTaskMutation.isPending}
							>
								Cancel
							</Button>
							<Button
								onClick={handleDeleteTask}
								disabled={deleteTaskMutation.isPending}
								className="bg-red-600 text-white hover:bg-red-700"
							>
								{deleteTaskMutation.isPending
									? "Deleting..."
									: "Delete Task"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Approval Modal */}
			{isApprovalModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl p-6 w-full max-w-md">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">
								Approve Project
							</h3>
							<button
								onClick={() => setIsApprovalModalOpen(false)}
								className="p-1 rounded-full hover:bg-gray-100"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">
									Approval Status
								</label>
								<select
									value={approvalStatus.toString()}
									onChange={(e) =>
										setApprovalStatus(
											e.target.value === "true"
										)
									}
									className="w-full p-2 border border-gray-300 rounded-lg"
								>
									<option value="true">Approve</option>
									<option value="false">Reject</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">
									Proposed Total Cost (₦)
								</label>
								<input
									type="number"
									value={proposedTotalCost}
									onChange={(e) =>
										setProposedTotalCost(
											Number(e.target.value)
										)
									}
									min="0"
									className="w-full p-2 border border-gray-300 rounded-lg"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">
									Discount (₦)
								</label>
								<input
									type="number"
									value={discount}
									onChange={(e) => {
										const newDiscount = Number(
											e.target.value
										);
										setDiscount(
											Math.min(
												newDiscount,
												proposedTotalCost
											)
										);
									}}
									min="0"
									max={proposedTotalCost}
									className="w-full p-2 border border-gray-300 rounded-lg"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">
									Final Amount
								</label>
								<div className="p-2 bg-gray-100 rounded-lg font-medium">
									₦
									{Math.max(
										0,
										proposedTotalCost - discount
									).toLocaleString()}
								</div>
							</div>
						</div>

						<div className="flex justify-end gap-3 mt-6">
							<Button
								variant="outline"
								onClick={() => setIsApprovalModalOpen(false)}
								disabled={approveProjectMutation.isPending}
							>
								Cancel
							</Button>
							<Button
								onClick={handleApprove}
								disabled={approveProjectMutation.isPending}
								className="bg-primary text-white hover:bg-primary-hover"
							>
								{approveProjectMutation.isPending
									? "Processing..."
									: "Confirm"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Task Creation/Edit Modal */}
			{isTaskModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-semibold">
								{editingTask ? "Edit Task" : "Create New Task"}
							</h3>
							<button
								onClick={() => setIsTaskModalOpen(false)}
								className="p-1 rounded-full hover:bg-gray-100"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium mb-2">
									Task Title *
								</label>
								<input
									type="text"
									value={taskForm.title}
									onChange={(e) =>
										setTaskForm((prev) => ({
											...prev,
											title: e.target.value,
										}))
									}
									placeholder="Enter task title"
									className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									Description *
								</label>
								<textarea
									value={taskForm.description}
									onChange={(e) =>
										setTaskForm((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									placeholder="Enter task description"
									rows={4}
									className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									Due Date *
								</label>
								<input
									type="datetime-local"
									value={taskForm.dueDate}
									onChange={(e) =>
										setTaskForm((prev) => ({
											...prev,
											dueDate: e.target.value,
										}))
									}
									className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									Reference Links
								</label>
								<div className="space-y-2">
									{taskForm.link.map((link, index) => (
										<div
											key={index}
											className="flex items-center gap-2"
										>
											<Link2 className="w-4 h-4 text-gray-500" />
											<input
												type="text"
												value={link}
												readOnly
												className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50"
											/>
											<button
												onClick={() =>
													removeLink(index)
												}
												className="p-1 text-red-500 hover:bg-red-50 rounded"
											>
												<X className="w-4 h-4" />
											</button>
										</div>
									))}
									<div className="flex gap-2">
										<input
											type="text"
											value={taskForm.newLink}
											onChange={(e) =>
												setTaskForm((prev) => ({
													...prev,
													newLink: e.target.value,
												}))
											}
											placeholder="Paste link here"
											className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
											onKeyPress={(e) =>
												e.key === "Enter" && addLink()
											}
										/>
										<Button
											type="button"
											onClick={addLink}
											variant="outline"
											className="whitespace-nowrap"
										>
											Add Link
										</Button>
									</div>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									Documents & Images
								</label>
								<div className="space-y-3">
									<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
										<div className="flex flex-col items-center justify-center pt-5 pb-6">
											<Upload className="w-8 h-8 mb-3 text-gray-400" />
											<p className="mb-2 text-sm text-gray-500">
												<span className="font-semibold">
													Click to upload
												</span>{" "}
												or drag and drop
											</p>
											<p className="text-xs text-gray-500">
												PNG, JPG, JPEG, PDF, DOC, DOCX
												up to 10MB
											</p>
										</div>
										<input
											type="file"
											multiple
											accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,image/*"
											onChange={handleFileUpload}
											className="hidden"
										/>
									</label>

									{taskForm.documents.length > 0 && (
										<div className="space-y-2">
											{taskForm.documents.map(
												(file, index) => (
													<div
														key={index}
														className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
													>
														<div className="flex items-center gap-3">
															<FileText className="w-5 h-5 text-gray-400" />
															<div>
																<p className="text-sm font-medium">
																	{file.name}
																</p>
																<p className="text-xs text-gray-500">
																	{(
																		file.size /
																		1024 /
																		1024
																	).toFixed(
																		2
																	)}{" "}
																	MB
																</p>
															</div>
														</div>
														<button
															onClick={() =>
																removeFile(
																	index
																)
															}
															className="p-1 text-red-500 hover:bg-red-50 rounded"
														>
															<X className="w-4 h-4" />
														</button>
													</div>
												)
											)}
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="flex justify-end gap-3 mt-8">
							<Button
								variant="outline"
								onClick={() => setIsTaskModalOpen(false)}
								disabled={
									uploading ||
									createTaskMutation.isPending ||
									updateTaskMutation.isPending
								}
							>
								Cancel
							</Button>
							<Button
								onClick={handleTaskSubmit}
								disabled={
									uploading ||
									createTaskMutation.isPending ||
									updateTaskMutation.isPending ||
									!taskForm.title ||
									!taskForm.description ||
									!taskForm.dueDate
								}
								className="bg-primary text-white hover:bg-primary-hover"
							>
								{uploading ||
								createTaskMutation.isPending ||
								updateTaskMutation.isPending ? (
									<>
										{editingTask
											? "Updating..."
											: "Creating..."}
									</>
								) : (
									<>
										{editingTask
											? "Update Task"
											: "Create Task"}
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Enhanced Task Details Modal */}
			{isTaskDetailsModalOpen && selectedTask && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-semibold">
								Task Details
							</h3>
							<button
								onClick={() => setIsTaskDetailsModalOpen(false)}
								className="p-1 rounded-full hover:bg-gray-100"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						<div className="space-y-6">
							{/* Task Header */}
							<div className="bg-gray-50 rounded-xl p-4">
								<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
									<div>
										<h4 className="font-semibold text-lg mb-2">
											{selectedTask.title}
										</h4>
										<div className="flex flex-wrap items-center gap-4">
											<span
												className={`px-3 py-1 rounded-full text-sm capitalize font-medium ${
													selectedTask.status ===
													"completed"
														? "bg-green-100 text-green-800"
														: selectedTask.status ===
														  "approved"
														? "bg-blue-100 text-blue-800"
														: selectedTask.status ===
														  "in-progress"
														? "bg-indigo-100 text-indigo-800"
														: selectedTask.status ===
														  "assigned"
														? "bg-orange-100 text-orange-800"
														: selectedTask.status ===
														  "not-assigned"
														? "bg-gray-100 text-gray-800"
														: selectedTask.status ===
														  "need-changes"
														? "bg-red-100 text-red-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{selectedTask.status}
											</span>
											<span className="flex items-center gap-2 text-sm text-gray-600">
												<CalendarIcon className="w-4 h-4" />
												Due:{" "}
												{moment(
													selectedTask?.dueDate
												).format("LL [at] LT")}
											</span>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												setIsTaskDetailsModalOpen(
													false
												);
												openEditTask(selectedTask);
											}}
										>
											<Edit className="w-4 h-4 mr-2" />
											Edit Task
										</Button>
									</div>
								</div>
							</div>

							{/* Task Description */}
							<div>
								<h5 className="font-semibold mb-3">
									Description
								</h5>
								<p className="text-gray-700 bg-gray-50 rounded-lg p-4">
									{selectedTask.description ||
										"No description provided."}
								</p>
							</div>

							{/* Task Timeline */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h5 className="font-semibold mb-3">
										Timeline
									</h5>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">
												Created:
											</span>
											<span className="text-sm font-medium">
												{moment(
													selectedTask?.createdAt
												).format("MMM DD, YYYY")}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">
												Due Date:
											</span>
											<span className="text-sm font-medium">
												{moment(
													selectedTask?.dueDate
												).format("MMM DD, YYYY")}
											</span>
										</div>
									</div>
								</div>

								{/* Assigned Expert */}
								{selectedTask.assignee && (
									<div>
										<h5 className="font-semibold mb-3">
											Assigned Expert
										</h5>
										<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
											<div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
												{selectedTask.assignee
													.profilePicture ? (
													<Image
														src={
															selectedTask
																?.assignee
																?.profilePicture
														}
														alt="Assignee"
														width={48}
														height={48}
														className="rounded-full"
													/>
												) : (
													<span className="text-lg font-medium">
														{selectedTask?.assignee.name.charAt(
															0
														)}
													</span>
												)}
											</div>
											<div>
												<p className="font-medium">
													{
														selectedTask?.assignee
															.name
													}
												</p>
												{selectedTask.assignee
													.email && (
													<p className="text-sm text-gray-600">
														{
															selectedTask
																.assignee.email
														}
													</p>
												)}
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Expert Details Section */}
							{selectedTask.assignedTo && (
								<div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 relative rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
											{selectedTask.assignedTo
												.profilePicture ? (
												<Image
													src={
														selectedTask.assignedTo
															.profilePicture
													}
													alt="Expert Profile"
													layout="fill"
													objectFit="cover"
												/>
											) : (
												<span className="text-lg font-medium">
													{selectedTask.assignedTo.name?.charAt(
														0
													) || "E"}
												</span>
											)}
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<span className="text-[#1A1A1A] font-medium text-base">
													{
														selectedTask.assignedTo
															.name
													}
												</span>
												<div className="flex items-center gap-1">
													<Star className="w-3 h-3 text-[#F2BB05] fill-[#F6CF50]" />
													<Star className="w-3 h-3 text-[#F2BB05] fill-[#F6CF50]" />
													<Star className="w-3 h-3 text-[#F2BB05] fill-[#F6CF50]" />
													<Star className="w-3 h-3 text-[#F2BB05] fill-[#F6CF50]" />
													<Star className="w-3 h-3 text-[#CFD0D4] fill-[#E7ECEE]" />
												</div>
											</div>
											<div className="flex items-center gap-3">
												<span className="flex items-center gap-1 font-medium text-[#48c629] text-sm">
													<Verified className="w-3 h-3 text-[#48c629]" />
													<span>Verified</span>
												</span>
												<span className="flex items-center gap-1 font-medium text-[#878A93] text-sm">
													<Pin className="w-3 h-3 text-[#878A93]" />
													Remote
												</span>
												<span className="flex items-center gap-1 font-medium text-[#878A93] text-sm">
													<Clock className="w-3 h-3 text-[#878A93]" />
													Available
												</span>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												className="rounded-xl"
											>
												Message Expert
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="rounded-xl"
											>
												Reassign
											</Button>
										</div>
									</div>
								</div>
							)}

							{/* Task Resources */}
							{((selectedTask.link &&
								selectedTask.link.length > 0) ||
								(selectedTask.document &&
									selectedTask.document.length > 0)) && (
								<div className="flex flex-col gap-3">
									<h5 className="font-semibold">
										Task Resources
									</h5>

									{/* Links */}
									{selectedTask.link &&
										selectedTask.link.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{selectedTask.link.map(
													(link, index) => (
														<div
															key={index}
															className="flex items-center gap-2 p-2 border border-[#EDEEF3] rounded-xl flex-1 min-w-0"
														>
															<Link2 />
															<input
																type="text"
																className="w-full outline-none text-sm text-[#727374] bg-transparent"
																value={link}
																readOnly
															/>
														</div>
													)
												)}
											</div>
										)}

									{/* Documents */}
									{selectedTask.document &&
										selectedTask.document.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{selectedTask.document.map(
													(doc, index) => (
														<div
															key={index}
															className="flex items-center justify-between p-2 border border-[#EDEEF3] rounded-xl flex-1 min-w-0"
														>
															<div className="flex items-center gap-2">
																<Image
																	src="/icons/file-icon.svg"
																	alt="file icon"
																	width={16}
																	height={16}
																/>
																<div className="flex flex-col min-w-0">
																	<span className="text-sm font-medium text-[#1A1A1A] truncate">
																		Document{" "}
																		{index +
																			1}
																	</span>
																	<span className="text-xs text-[#878A93]">
																		PDF File
																	</span>
																</div>
															</div>
															<a
																href={doc}
																target="_blank"
																rel="noopener noreferrer"
															>
																<Download className="w-4 h-4 text-[#878A93] cursor-pointer hover:text-primary" />
															</a>
														</div>
													)
												)}
											</div>
										)}
								</div>
							)}

							{/* Task Progress Actions */}
							{selectedTask.assignee &&
								!selectedTask.submission?.length && (
									<div className="flex items-center justify-between pt-3 border-t border-gray-100">
										<div className="flex flex-col gap-1">
											<span className="text-[#878A93] text-sm font-medium">
												Task Progress
											</span>
											<span className="text-[#727374] text-sm">
												Track completion and review
												submissions
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												className="rounded-xl"
												onClick={() =>
													setShowNoteInput(
														"needs-changes"
													)
												}
											>
												Request Update
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="rounded-xl hover:bg-primary-hover"
												onClick={() =>
													setShowNoteInput("approved")
												}
											>
												Mark as Completed
											</Button>
										</div>
									</div>
								)}

							{/* Submissions Section */}
							{selectedTask.submission &&
								selectedTask.submission.length > 0 && (
									<div className="pt-3 border-t border-gray-100">
										<div className="flex items-center justify-between pt-3 border-t border-gray-100">
											<div className="flex flex-col gap-1">
												<span className="text-[#878A93] text-sm font-medium">
													Task Progress
												</span>
												<span className="text-[#727374] text-sm">
													Track completion and review
													submissions
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													className="rounded-xl"
													onClick={() =>
														setShowNoteInput(
															"needs-changes"
														)
													}
												>
													Request Update
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="rounded-xl hover:bg-primary-hover"
													onClick={() =>
														setShowNoteInput(
															"approved"
														)
													}
												>
													Mark as Completed
												</Button>
											</div>
										</div>

										{/* Note Input */}
										{showNoteInput && (
											<div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
												<div className="flex flex-col gap-3">
													<label className="text-sm font-medium text-gray-700">
														Add a note for{" "}
														{showNoteInput ===
														"approved"
															? "approval"
															: "changes"}
														:
													</label>
													<textarea
														value={note}
														onChange={(e) =>
															setNote(
																e.target.value
															)
														}
														placeholder="Enter your feedback here..."
														className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														rows={3}
													/>
													<div className="flex items-center gap-2 justify-end">
														<Button
															variant="outline"
															size="sm"
															onClick={() => {
																setShowNoteInput(
																	null
																);
																setNote("");
															}}
														>
															Cancel
														</Button>
														<Button
															size="sm"
															className="bg-primary text-white hover:bg-primary-hover"
															onClick={() =>
																handleStatusUpdate(
																	showNoteInput,
																	note,
																	selectedTask?.id
																)
															}
															disabled={
																updateTaskChangesMutation.isPending
															}
														>
															{updateTaskChangesMutation.isPending
																? "Updating..."
																: "Submit"}
														</Button>
													</div>
												</div>
											</div>
										)}

										<div className="flex flex-col gap-3">
											<span className="text-[#878A93] text-sm font-medium mt-4">
												Submissions (
												{selectedTask.submission.length}
												)
											</span>

											{/* Links */}
											<div className="flex flex-wrap gap-2">
												{(
													selectedTask?.submission?.filter(
														(item: string) =>
															!item.includes(
																"res.cloudinary.com"
															)
													) || []
												)?.map(
													(
														link: string,
														index: number
													) => (
														<Link
															href={link}
															target="_blank"
															key={index}
															className="flex items-center cursor-pointer gap-2 p-2 border border-[#EDEEF3] rounded-xl flex-1 min-w-0"
														>
															<Link2 />
															<input
																type="text"
																className="w-full outline-none text-sm text-[#727374] bg-transparent"
																value={link}
																readOnly
															/>
														</Link>
													)
												)}
											</div>

											{/* Documents */}
											<div className="flex flex-wrap gap-2">
												{(
													selectedTask?.submission?.filter(
														(item: string) =>
															item.includes(
																"res.cloudinary.com"
															)
													) || []
												)?.map(
													(
														doc: string,
														index: number
													) => (
														<div
															key={index}
															className="flex items-center justify-between p-2 border border-[#EDEEF3] rounded-xl flex-1 min-w-0"
														>
															<div className="flex items-center gap-2">
																<Image
																	src="/icons/file-icon.svg"
																	alt="file icon"
																	width={16}
																	height={16}
																/>
																<div className="flex flex-col min-w-0">
																	<span className="text-sm font-medium text-[#1A1A1A] truncate">
																		Document{" "}
																		{index +
																			1}
																	</span>
																	<span className="text-xs text-[#878A93]">
																		File
																	</span>
																</div>
															</div>
															<a
																href={doc}
																target="_blank"
																rel="noopener noreferrer"
															>
																<Download className="w-4 h-4 text-[#878A93] cursor-pointer hover:text-primary" />
															</a>
														</div>
													)
												)}
											</div>
										</div>
									</div>
								)}

							{/* Task Actions */}
							<div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
								{!selectedTask.assignee && (
									<Button
										onClick={() => {
											setIsTaskDetailsModalOpen(false);
											openAssignExpert(selectedTask.id);
										}}
										className="bg-primary text-white hover:bg-primary-hover"
									>
										<UserPlus className="w-4 h-4 mr-2" />
										Assign Expert
									</Button>
								)}
								<Button
									variant="outline"
									onClick={() =>
										setIsTaskDetailsModalOpen(false)
									}
								>
									Close
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Expert Assignment Modal */}
			{isExpertAssignModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-semibold">
								Assign Expert
							</h3>
							<button
								onClick={() =>
									setIsExpertAssignModalOpen(false)
								}
								className="p-1 rounded-full hover:bg-gray-100"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						<div className="space-y-3">
							{expertList?.data?.data &&
							expertList.data.data.length > 0 ? (
								expertList.data.data.map((expert: Expert) => (
									<ExpertAssignmentItem
										key={expert.id}
										expert={expert}
										taskId={selectedTaskForAssign!}
										onAssignmentComplete={() => {
											setIsExpertAssignModalOpen(false);
											setSelectedTaskForAssign(null);
											// console.log(expert)
											// toast.success("Expert assigned successfully");
										}}
									/>
								))
							) : expertsLoading ? (
								<div className="text-center py-8 text-gray-500">
									Loading experts...
								</div>
							) : (
								<div className="text-center py-8 text-gray-500">
									No experts available
								</div>
							)}
						</div>

						<div className="flex justify-end gap-3 mt-6">
							<Button
								variant="outline"
								onClick={() =>
									setIsExpertAssignModalOpen(false)
								}
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Main Content */}
			<div className="flex flex-col gap-4 border-b border-[#EDEEF3] pb-4">
				<div className="flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4">
					{/* Left section */}
					<div className="top w-full flex flex-col lg:flex-row items-start lg:items-center gap-4">
						<div className="bg-[#D1F7FF] flex items-center justify-center p-[5.84px] text-[#1A1A1A] text-2xl font-bold h-[54px] w-[54px] rounded-[11.68px]">
							{projectDetails?.title?.substring(0, 1) || "P"}
						</div>

						<div className="flex flex-col gap-2 flex-1">
							<span className="text-sm text-[#878A93] break-words">
								{projectDetails?.title}
							</span>
							<div className="flex flex-wrap items-center gap-4">
								<span className="flex items-center gap-[4px] text-sm text-[#878A93]">
									<Clock className="w-4 h-4 shrink-0" />
									Due:
									<span className="text-[#121217]">
										{projectDetails.dueDate
											? new Date(
													projectDetails.dueDate
											  ).toLocaleDateString()
											: "N/A"}
									</span>
								</span>
								<span className="flex items-center gap-[4px] text-sm text-[#878A93]">
									<Church className="w-4 h-4 shrink-0" />
									Status:
									<span className="text-[#121217] capitalize">
										{projectDetails.status}
									</span>
								</span>
							</div>
						</div>
					</div>

					{/* Right section */}
					<div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto">
						<Button
							variant={"outline"}
							className="rounded-[14px] w-full lg:w-auto flex items-center gap-2"
							onClick={() => setIsTaskModalOpen(true)}
						>
							<Plus className="w-4 h-4" />
							Add Task
						</Button>
						<Button className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black w-full lg:w-auto">
							Change Status
						</Button>

						{projectDetails.adminApproved ? (
							<Button
								disabled
								className="bg-green-100 text-green-700 rounded-[14px] w-full lg:w-auto flex items-center gap-2"
							>
								<CheckCircle className="w-4 h-4" />
								Approved
							</Button>
						) : (
							<Button
								disabled={approveProjectMutation.isPending}
								onClick={() => setIsApprovalModalOpen(true)}
								className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black w-full lg:w-auto"
							>
								{approveProjectMutation.isPending
									? "Approving..."
									: "Approve"}
							</Button>
						)}
					</div>
				</div>

				{projectDetails.businessId && (
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						<div className="w-[52px] relative h-[52px] rounded-full bg-gray-200 flex items-center justify-center">
							<span className="text-lg font-medium">
								{projectDetails.businessId.name?.charAt(0) ||
									"B"}
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-[#1A1A1A] font-medium text-[20px]">
								{projectDetails.businessId.name}
							</span>
							<div className="flex items-center gap-1">
								<Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
								<Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
								<Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
								<Star className="w-[13.33px] h-[13.33px] text-[#F2BB05] fill-[#F6CF50]" />
								<Star className="w-[13.33px] h-[13.33px] text-[#CFD0D4] fill-[#E7ECEE]" />
							</div>
							<div className="flex flex-wrap items-center gap-2">
								<span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm">
									{projectDetails.businessId?.verified ===
									true ? (
										<div className="flex items-center gap-1">
											<Verified className="w-4 h-4 text-[#47bf29]" />{" "}
											<span className="text-[#47bf29]">
												Verified
											</span>{" "}
										</div>
									) : (
										<div className="flex items-center gap-1">
											<GoUnverified className="w-4 h-4 text-red-600" />{" "}
											<span>Not Verified</span>
										</div>
									)}
								</span>
								<span className="flex items-center gap-[2px] font-medium text-[#878A93] text-sm">
									<Pin className="w-4 h-4 text-[#878A93]" />{" "}
									Location
								</span>
								<span className="flex capitalize items-center gap-[2px] font-medium text-[#47bf29] text-sm">
									<Clock className="w-4 h-4 text-[#47bf29]" />{" "}
									{projectDetails.businessId?.status}
								</span>
								<span className="flex capitalize items-center gap-2 text-[#878A93] font-medium text-sm">
									<PhoneOutgoingIcon className="w-4 h-4" />{" "}
									{projectDetails.businessId?.phone}
								</span>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="project-details w-full">
				<div className="tab pt-2 w-full flex items-center gap-5 bg-[#F9FAFB]">
					<div
						className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
            hover:border-[#3A96E8] transition-colors 
            ${
				activeTab === "projectOverview"
					? "border-[#3A96E8] text-[#3A96E8]"
					: "border-transparent"
			}`}
						onClick={() => setActiveTab("projectOverview")}
					>
						<span className="text-sm">Project Overview</span>
					</div>

					<div
						className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
            hover:border-[#3A96E8] transition-colors 
            ${
				activeTab === "taskTracker"
					? "border-[#3A96E8] text-[#3A96E8]"
					: "border-transparent"
			}`}
						onClick={() => setActiveTab("taskTracker")}
					>
						<span className="text-sm">Task Tracker</span>
					</div>
				</div>

				{activeTab === "projectOverview" && (
					<div className="w-full border border-[#F2F2F2] rounded-2xl p-4 my-2 flex flex-col gap-6">
						<div className="flex flex-col gap-2">
							<span className="text-[#1A1A1A] text-sm font-normal">
								Project brief
							</span>
							<div
								className="whitespace-pre-line text-sm text-[#727374] leading-relaxed"
								dangerouslySetInnerHTML={{
									__html: formattedText,
								}}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<span className="text-[#1A1A1A] text-sm font-normal">
								Goal
							</span>
							<span className="text-sm text-[#727374]">
								{projectDetails.goal || "No goal specified."}
							</span>
						</div>

						<div className="flex flex-col gap-2">
							<span className="text-[#1A1A1A] text-sm font-normal">
								Challenge
							</span>
							<span className="text-sm text-[#727374]">
								{projectDetails.challengeId?.description ||
									"No challenge description provided."}
							</span>
						</div>

						{projectDetails.resources &&
							projectDetails.resources.length > 0 && (
								<div className="flex flex-col gap-2">
									<span className="text-[#1A1A1A] text-sm font-normal">
										Resources
									</span>
									<div className="flex items-center gap-[10px]">
										{projectDetails?.resources.map(
											(
												resourceUrl: string,
												idx: number
											) => (
												<div
													key={idx}
													className="flex items-center gap-2 p-1 bg-[#F7F9F9] rounded-3xl px-4"
												>
													<Image
														src={resourceUrl}
														alt={`Resource ${
															idx + 1
														}`}
														width={18}
														height={18}
														className="w-8 h-8 rounded-lg object-cover border"
													/>
													<span className="text-[#878A93] text-xs">
														Resource {idx + 1}
													</span>
													<a
														href={resourceUrl}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Download className="w-4 h-4 text-[#878A93] cursor-pointer" />
													</a>
												</div>
											)
										)}
									</div>
								</div>
							)}

						<div className="flex flex-col gap-2">
							<span className="text-[#1A1A1A] text-sm font-normal">
								Budget
							</span>
							<span className="text-sm text-[#727374]">
								{projectDetails.proposedTotalCost
									? `${projectDetails.proposedTotalCost.toLocaleString()}`
									: "No budget specified"}
							</span>
						</div>

						<div className="flex flex-col gap-2">
							<span className="text-[#1A1A1A] text-sm font-normal">
								Payment Status
							</span>
							<span className="text-sm text-[#727374] capitalize">
								{projectDetails.paymentStatus ||
									"Not specified"}
							</span>
						</div>
					</div>
				)}

				{activeTab === "taskTracker" && (
					<div className="w-full border border-[#F2F2F2] rounded-2xl p-4 my-2 flex flex-col gap-6">
						<div className="flex flex-col gap-2">
							<span className="text-sm text-[#1A1A1A]">
								Track tasks in real time.
							</span>
							<span className="text-sm text-[#727374]">
								Review submissions and approve or request
								changes.
							</span>
						</div>

						{/* Enhanced Tasks List */}
						<div className="p-3 flex flex-col gap-4 rounded-3xl bg-[#FBFCFC]">
							{Array.isArray(projectTasks?.data) &&
							projectTasks.data.length > 0 ? (
								projectTasks.data.map((task: Task) => (
									<div
										key={task.id}
										className="flex flex-col gap-4 bg-white rounded-2xl p-4 border border-gray-100"
									>
										{/* Task Header */}
										<div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
											<div className="flex flex-col gap-2 flex-1">
												<div className="flex flex-col sm:flex-row sm:items-center gap-2">
													<h4 className="text-lg font-semibold text-[#1A1A1A]">
														{task.title}
													</h4>
													<span
														className={`px-2 py-1 rounded-full text-xs capitalize font-medium ${
															statusColors[
																task?.status
															] ||
															statusColors.default
														}`}
													>
														{task.status}
													</span>
												</div>
												<p className="text-sm text-[#727374] line-clamp-2">
													{task.description}
												</p>
												<div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-[#878A93]">
													<span className="flex items-center gap-1">
														<CalendarIcon className="w-4 h-4" />
														Due:{" "}
														{moment(
															task?.dueDate
														).format(
															"MMM dd, YYYY"
														)}
													</span>
													<span className="flex items-center gap-1">
														<Clock className="w-4 h-4" />
														Created:{" "}
														{format(
															new Date(
																task.createdAt
															),
															"MMM d"
														)}
													</span>
												</div>
											</div>

											{/* Action Buttons */}
											<div className="flex flex-wrap items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														openTaskDetails(task)
													}
													className="flex items-center gap-1"
												>
													<Eye className="w-4 h-4" />
													<span className="hidden sm:inline">
														View
													</span>
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														openEditTask(task)
													}
													className="flex items-center gap-1"
												>
													<Edit className="w-4 h-4" />
													<span className="hidden sm:inline">
														Edit
													</span>
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														openAssignExpert(
															task.id
														)
													}
													className="flex items-center gap-1"
												>
													<UserPlus className="w-4 h-4" />
													<span className="hidden sm:inline">
														Assign
													</span>
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() =>
														openDeleteModal(task.id)
													}
													className="flex items-center gap-1"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>

										{task.assignedTo && (
											<div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
												<div className="flex items-center gap-3">
													<div className="w-12 h-12 relative rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
														{task.assignedTo
															.profilePicture ? (
															<Image
																src={
																	task
																		.assignedTo
																		.profilePicture
																}
																alt="Expert Profile"
																layout="fill"
																objectFit="cover"
															/>
														) : (
															<span className="text-lg font-medium">
																{task.assignedTo.name?.charAt(
																	0
																) || "E"}
															</span>
														)}
													</div>
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<span className="text-[#1A1A1A] font-medium text-base">
																{
																	task
																		.assignedTo
																		.name
																}
															</span>
															<div className="flex items-center gap-1">
																<Star className="w-3 h-3 text-[#F2BB05] fill-[#F6CF50]" />
																<Star className="w-3 h-3 text-[#F2BB05] fill-[#F6CF50]" />
																<Star className="w-3 h-3 text-[#F2BB05] fill-[#F6CF50]" />
																<Star className="w-3 h-3 text-[#F2BB05] fill-[#F6CF50]" />
																<Star className="w-3 h-3 text-[#CFD0D4] fill-[#E7ECEE]" />
															</div>
														</div>
														<div className="flex items-center gap-3">
															<span className="flex items-center gap-1 font-medium text-[#47bf29] text-sm">
																<Verified className="w-3 h-3 text-[#47bf29]" />
																<span>
																	Verified
																</span>
															</span>
															<span className="flex items-center gap-1 font-medium text-[#878A93] text-sm">
																<Pin className="w-3 h-3 text-[#878A93]" />
																Remote
															</span>
															<span className="flex items-center gap-1 font-medium text-[#878A93] text-sm">
																<Clock className="w-3 h-3 text-[#878A93]" />
																Available
															</span>
														</div>
													</div>
													<div className="flex items-center gap-2">
														<Button
															variant="outline"
															size="sm"
															className="rounded-xl"
														>
															Message Expert
														</Button>
														<Button
															variant="outline"
															size="sm"
															className="rounded-xl"
														>
															Reassign
														</Button>
													</div>
												</div>
											</div>
										)}

										{/* Task Resources */}
										{((task.link && task.link.length > 0) ||
											(task.document &&
												task.document.length > 0)) && (
											<div className="flex flex-col gap-3">
												{/* Links */}
												{task.link &&
													task.link.length > 0 && (
														<div className="flex flex-wrap gap-2">
															{task.link.map(
																(
																	link,
																	index
																) => (
																	<div
																		key={
																			index
																		}
																		className="flex items-center gap-2 p-2 border border-[#EDEEF3] rounded-xl flex-1 min-w-0"
																	>
																		<Link2 />
																		<input
																			type="text"
																			className="w-full outline-none text-sm text-[#727374] bg-transparent"
																			value={
																				link
																			}
																			readOnly
																		/>
																	</div>
																)
															)}
														</div>
													)}

												{/* Documents */}
												{task.document &&
													task.document.length >
														0 && (
														<div className="flex flex-wrap gap-2">
															{task.document.map(
																(
																	doc,
																	index
																) => (
																	<div
																		key={
																			index
																		}
																		className="flex items-center justify-between p-2 border border-[#EDEEF3] rounded-xl flex-1 min-w-0"
																	>
																		<div className="flex items-center gap-2">
																			<Image
																				src="/icons/file-icon.svg"
																				alt="file icon"
																				width={
																					16
																				}
																				height={
																					16
																				}
																			/>
																			<div className="flex flex-col min-w-0">
																				<span className="text-sm font-medium text-[#1A1A1A] truncate">
																					Document{" "}
																					{index +
																						1}
																				</span>
																				<span className="text-xs text-[#878A93]">
																					PDF
																					File
																				</span>
																			</div>
																		</div>
																		<a
																			href={
																				doc
																			}
																			target="_blank"
																			rel="noopener noreferrer"
																		>
																			<Download className="w-4 h-4 text-[#878A93] cursor-pointer hover:text-primary" />
																		</a>
																	</div>
																)
															)}
														</div>
													)}
											</div>
										)}

										{/* Task Actions for Assigned Tasks */}
										{task.assignee && (
											<div className="flex items-center justify-between pt-3 border-t border-gray-100">
												<div className="flex flex-col gap-1">
													<span className="text-[#878A93] text-sm font-medium">
														Task Progress
													</span>
													<span className="text-[#727374] text-sm">
														Track completion and
														review submissions
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Button
														variant="outline"
														size="sm"
														className="rounded-xl"
													>
														Request Update
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="rounded-xl"
													>
														Mark as Completed
													</Button>
												</div>
											</div>
										)}

										{/* Submissions */}
										{task.submission &&
											task.submission.length > 0 && (
												<div className="pt-3 border-t border-gray-100">
													<div className="flex items-center justify-between pt-3 border-t border-gray-100">
														<div className="flex flex-col gap-1">
															<span className="text-[#878A93] text-sm font-medium">
																Task Progress
															</span>
															<span className="text-[#727374] text-sm">
																Track completion
																and review
																submissions
															</span>
														</div>
														<div className="flex items-center gap-2">
															<Button
																variant="outline"
																size="sm"
																className="rounded-xl"
																onClick={() =>
																	setShowNoteInput(
																		"needs-changes"
																	)
																}
															>
																Request Update
															</Button>
															<Button
																variant="outline"
																size="sm"
																className="rounded-xl hover:bg-primary-hover"
																onClick={() =>
																	setShowNoteInput(
																		"approved"
																	)
																}
															>
																Mark as
																Completed
															</Button>
														</div>
													</div>

													{/* Note Input */}
													{showNoteInput && (
														<div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
															<div className="flex flex-col gap-3">
																<label className="text-sm font-medium text-gray-700">
																	Add a note
																	for{" "}
																	{showNoteInput ===
																	"approved"
																		? "approval"
																		: "changes"}
																	:
																</label>
																<textarea
																	value={note}
																	onChange={(
																		e
																	) =>
																		setNote(
																			e
																				.target
																				.value
																		)
																	}
																	placeholder="Enter your feedback here..."
																	className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
																	rows={3}
																/>
																<div className="flex items-center gap-2 justify-end">
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() => {
																			setShowNoteInput(
																				null
																			);
																			setNote(
																				""
																			);
																		}}
																	>
																		Cancel
																	</Button>
																	<Button
																		size="sm"
																		className="bg-primary text-white hover:bg-primary-hover"
																		onClick={() =>
																			handleStatusUpdate(
																				showNoteInput,
																				note,
																				task?.id
																			)
																		}
																		disabled={
																			updateTaskChangesMutation.isPending
																		}
																	>
																		{updateTaskChangesMutation.isPending
																			? "Updating..."
																			: "Submit"}
																	</Button>
																</div>
															</div>
														</div>
													)}

													<div className="flex flex-col gap-3">
														<span className="text-[#878A93] text-sm font-medium mt-4">
															Submissions
														</span>

														{/* Links */}
														<div className="flex flex-wrap gap-2">
															{(
																task?.submission?.filter(
																	(
																		item: string
																	) =>
																		!item.includes(
																			"res.cloudinary.com"
																		)
																) || []
															)?.map(
																(
																	link: string,
																	index: number
																) => (
																	<Link
																		href={
																			link
																		}
																		target="_blank"
																		key={
																			index
																		}
																		className="flex items-center cursor-pointer gap-2 p-2 border border-[#EDEEF3] rounded-xl flex-1 min-w-0"
																	>
																		<Link2 />
																		<input
																			type="text"
																			className="w-full outline-none text-sm text-[#727374] bg-transparent"
																			value={
																				link
																			}
																			readOnly
																		/>
																	</Link>
																)
															)}
														</div>

														{/* Documents */}
														<div className="flex flex-wrap gap-2">
															{(
																task?.submission?.filter(
																	(
																		item: string
																	) =>
																		item.includes(
																			"res.cloudinary.com"
																		)
																) || []
															)?.map(
																(
																	doc: string,
																	index: number
																) => (
																	<div
																		key={
																			index
																		}
																		className="flex items-center justify-between p-2 border border-[#EDEEF3] rounded-xl flex-1 min-w-0"
																	>
																		<div className="flex items-center gap-2">
																			<Image
																				src="/icons/file-icon.svg"
																				alt="file icon"
																				width={
																					16
																				}
																				height={
																					16
																				}
																			/>
																			<div className="flex flex-col min-w-0">
																				<span className="text-sm font-medium text-[#1A1A1A] truncate">
																					Document{" "}
																					{index +
																						1}
																				</span>
																				<span className="text-xs text-[#878A93]">
																					File
																				</span>
																			</div>
																		</div>
																		<a
																			href={
																				doc
																			}
																			target="_blank"
																			rel="noopener noreferrer"
																		>
																			<Download className="w-4 h-4 text-[#878A93] cursor-pointer hover:text-primary" />
																		</a>
																	</div>
																)
															)}
														</div>
													</div>
												</div>
											)}
									</div>
								))
							) : (
								<div className="text-center py-12">
									<div className="flex flex-col items-center gap-3">
										<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
											<FileText className="w-8 h-8 text-gray-400" />
										</div>
										<div className="text-center">
											<h3 className="text-lg font-medium text-gray-900 mb-1">
												No tasks yet
											</h3>
											<p className="text-sm text-gray-500 mb-4">
												Create your first task to start
												tracking progress
											</p>
											<Button
												onClick={() =>
													setIsTaskModalOpen(true)
												}
												className="bg-primary text-white hover:bg-primary-hover"
											>
												<Plus className="w-4 h-4 mr-2" />
												Create Task
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProjectDetails;
