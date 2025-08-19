"use client"

import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Clock, FolderOpen, MessageCircle, MoreHorizontal, Search, Tag, User } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const projectData = [
  {
    id: 1,
    name: "GreenMart",
    owner: "James Peterson",
    email: "tanya.hill@exple.com",
    status: "Verified",
    dateJoined: "Feb 2, 2019 19:28",
    avatar: "🌱",
  },
  {
    id: 2,
    name: "TrewCruz",
    owner: "Asara Cruz",
    email: "stcruz@example.com",
    status: "Verified",
    dateJoined: "Dec 30, 2019 05:18",
    avatar: "🔵",
  },
  {
    id: 3,
    name: "XTRAbidial",
    owner: "sandra Abidial",
    email: "kandra@hotmail.com",
    status: "Pending",
    dateJoined: "Dec 30, 2019 05:18",
    avatar: "👤",
  },
  {
    id: 4,
    name: "Bill Sanders",
    owner: "Bill Sanders",
    email: "bill.saers@emple.com",
    status: "Pending",
    dateJoined: "Dec 30, 2019 05:18",
    avatar: "🔥",
  },
  {
    id: 5,
    name: "kasandra Abidial",
    owner: "sandra Abidial",
    email: "kandra@hotmail.com",
    status: "Verified",
    dateJoined: "Dec 30, 2019 05:18",
    avatar: "👤",
  },
  {
    id: 6,
    name: "kasandra Abidial",
    owner: "sandra Abidial",
    email: "kandra@hotmail.com",
    status: "Verified",
    dateJoined: "Dec 30, 2019 05:18",
    avatar: "👤",
  },
  {
    id: 7,
    name: "kasandra Abidial",
    owner: "sandra Abidial",
    email: "kandra@hotmail.com",
    status: "Pending",
    dateJoined: "Dec 30, 2019 05:18",
    avatar: "👤",
  },
  {
    id: 8,
    name: "GreenMart",
    owner: "James Peterson",
    email: "tanya.hill@exple.com",
    status: "Verified",
    dateJoined: "Feb 2, 2019 19:28",
    avatar: "🌱",
  },
  {
    id: 9,
    name: "kasandra Abidial",
    owner: "sandra Abidial",
    email: "kandra@hotmail.com",
    status: "Verified",
    dateJoined: "Dec 30, 2019 05:18",
    avatar: "👤",
  },
  {
    id: 10,
    name: "Bill Sanders",
    owner: "Bill Sanders",
    email: "bill.saers@emple.com",
    status: "Pending",
    dateJoined: "Dec 30, 2019 05:18",
    avatar: "🔥",
  },
]

const BusinessId = () => {

    const [activeTab, setActiveTab] = useState<'about' | 'aiusage' | 'projects' | 'experts' | 'payments'>('about')

    const [searchTerm, setSearchTerm] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState("10")

    const router = useRouter()

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-4 border-b border-[#EDEEF3] pb-4">
                <div className="heading w-full bg-[#F8F8F8] py-4 px-6 flex items-center gap-2">
                    <span onClick={() => window.history.back()} className="text-[#1746A2AB] text-sm font-medium cursor-pointer">Back to Business list</span>
                    <span className="text-[#CFD0D4] text-sm">/</span>
                    <span className="text-[#1A1A1A] text-sm font-medium">Growth Audit for GreenMart </span>
                    <span className="text-[#CFD0D4] text-sm">/</span>
                </div>

                <div className="flex w-full items-center justify-between">
                    <div className="top flex flex-col gap-4">
                        <div className="w-full flex items-center gap-3">
                            <div className="bg-[#CDFAE0] flex items-center justify-center p-[8.22px] text-[#1A1A1A] text-xs h-[76px] w-[79.77px] rounded-[16.43px]">BlueMart</div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[20px] text-[#3E4351] font-semibold">Growth Audit for GreenMart </span>
                                <div className="items-center gap-2 flex">
                                    <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                                        <User className="w-4 h-4" />
                                        Contact Person: <span className="text-[#121217]">James Peterson <span className="text-[#878A93]">|</span> tanya.hill@exple.com <span className="text-[#878A93]">|</span> +2347089645324</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="items-center gap-2 flex">
                            <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                                <Calendar className="w-4 h-4" />
                                Joined Date: <span className="text-[#121217]">June 25, 2025</span>
                            </span>
                            <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                                <Clock className="w-4 h-4" />
                                Account status: <span className="text-[#121217]">Verified</span>
                            </span>
                            <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                                <Clock className="w-4 h-4" />
                                Activity status: <span className="text-[#121217]">Active</span>
                            </span>
                            <span className="flex items-center gap-[2px] text-sm text-[#878A93]">
                                <Tag className="w-4 h-4" />
                                Current Plan: <span className="text-[#121217]">Padi Pro</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <Button className="text-white bg-primary rounded-[14px] hover:bg-primary-hover hover:text-black"><MessageCircle />Chat</Button>
                    </div>
                </div>
            </div>
            <div className="project-details w-full lg:w-[895px] pb-10">
                <div className="tab pt-2 w-full flex items-center gap-5 bg-[#F9FAFB]">
                    <div
                        className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
                        hover:border-[#3A96E8] transition-colors 
                        ${activeTab === 'about' ? 'border-[#3A96E8] text-[#3A96E8]' : 'border-transparent'}`}
                        onClick={() => setActiveTab('about')}
                    >
                        <span className="text-sm">About</span>
                    </div>

                    <div
                        className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
                        hover:border-[#3A96E8] transition-colors 
                        ${activeTab === 'aiusage' ? 'border-[#3A96E8] text-[#3A96E8]' : 'border-transparent'}`}
                        onClick={() => setActiveTab('aiusage')}
                    >
                        <span className="text-sm">AI Usage Summary</span>
                    </div>
                    <div
                        className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
                        hover:border-[#3A96E8] transition-colors 
                        ${activeTab === 'projects' ? 'border-[#3A96E8] text-[#3A96E8]' : 'border-transparent'}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        <span className="text-sm">Projects (2)</span>
                    </div>
                    <div
                        className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
                        hover:border-[#3A96E8] transition-colors 
                        ${activeTab === 'experts' ? 'border-[#3A96E8] text-[#3A96E8]' : 'border-transparent'}`}
                        onClick={() => setActiveTab('experts')}
                    >
                        <span className="text-sm">Experts</span>
                    </div>
                    <div
                        className={`flex cursor-pointer w-full items-center justify-center border-b-2 pb-3
                        hover:border-[#3A96E8] transition-colors 
                        ${activeTab === 'payments' ? 'border-[#3A96E8] text-[#3A96E8]' : 'border-transparent'}`}
                        onClick={() => setActiveTab('payments')}
                    >
                        <span className="text-sm">Payments</span>
                    </div>
                </div>

                {activeTab === 'about' && (
                    <div className="flex flex-col gap-4">
                        <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-[20px] text-primary">Business Summary</span>
                                <span className="border border-[#E7E8E9] rounded-[10px] p-2 bg-white cursor-pointer text-[#0E1426] text-sm">Update</span>
                            </div>
                            <span className="text-[#353D44] text-sm">👋 Hey there! I&rsquo;m Abdullahi Suleiman (sulbyee) a curious, resourceful, and impact-driven UI/UX and Product Designer with over 3 years of experience turning ideas into user-centered digital experiences across mobile, web, and wearables.</span>
                        </div>

                        <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-[20px] text-primary">Business information</span>
                                <span className="border border-[#E7E8E9] rounded-[10px] p-2 bg-white cursor-pointer text-[#0E1426] text-sm">Edit</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#878A93] text-sm font-normal">Full Name</span>
                                    <span className="text-[#1A1A1A] text-base font-semibold">David ezeri</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#878A93] text-sm font-normal">Email</span>
                                    <span className="text-[#1A1A1A] text-base font-semibold">Davidezeri@gmail.com</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#878A93] text-sm font-normal">Gender</span>
                                    <span className="text-[#1A1A1A] text-base font-semibold">Male</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#878A93] text-sm font-normal">Phone number</span>
                                    <span className="text-[#1A1A1A] text-base font-semibold">+234 7067538138</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#878A93] text-sm font-normal">Country of  residence</span>
                                    <span className="text-[#1A1A1A] text-base font-semibold">Nigeria</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#878A93] text-sm font-normal">State of residence</span>
                                    <span className="text-[#1A1A1A] text-base font-semibold">FCT, Abuja</span>
                                </div>
                            </div>
                        </div>

                        <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-[20px] text-primary">Other Information</span>
                                <span className="border border-[#E7E8E9] rounded-[10px] p-2 bg-white cursor-pointer text-[#0E1426] text-sm">Edit</span>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#878A93] text-sm font-normal">What does your company do?</span>
                                    <span className="text-[#1A1A1A] text-base font-semibold">2 years</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#878A93] text-sm font-normal">Company Size</span>
                                    <span className="text-[#1A1A1A] text-base font-semibold">Expert</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#878A93] text-sm font-normal">account created</span>
                                    <span className="text-[#1A1A1A] text-base font-semibold">Business developer</span>
                                </div>
                            </div>
                        </div>

                        <div className="about flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-[20px] text-primary">Settings</span>
                                <span className="border border-[#E7E8E9] rounded-[10px] p-2 bg-white cursor-pointer text-[#0E1426] text-sm">Edit</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'aiusage' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm text-[#0E1426]">AI Assistant Usage Overview</span>
                            </div>
                            <span className="text-[#353D44] text-sm">This business has made 26 AI queries in the past 30 days. Their last interaction was on July 4. Most queries were around funnel optimisation and campaign performance. AI engagement has increased 18% this month.</span>

                            <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex gap-6 p-4 mt-5">
                                <div className="border-r w-full flex flex-col gap-4 border-[#EFF2F3]">
                                    <span className="text-2xl font-bold text-[#0E1426]">26</span>
                                    <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">AI queries</span>
                                </div>
                                <div className="border-r w-full flex flex-col gap-4 border-[#EFF2F3]">
                                    <span className="text-2xl font-bold text-[#0E1426]">July 4</span>
                                    <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary-hover">last interaction</span>
                                </div>
                                <div className="w-full flex flex-col gap-4">
                                    <span className="text-2xl font-bold text-[#0E1426]">18%</span>
                                    <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">AI engagement</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                            <div className="w-full p-6">
                                <h1 className="text-base font-medium text-primary mb-6">Full Query</h1>

                                <div className="flex items-center justify-between mb-6 gap-4">
                                    <div className="flex items-center gap-4">
                                        <Select value="all-projects" defaultValue="all-projects">
                                            <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all-projects">All projects</SelectItem>
                                                <SelectItem value="in-progress">In-Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select defaultValue="sort">
                                            <SelectTrigger className="w-[80px] h-9 text-sm border-gray-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sort">Sort</SelectItem>
                                                <SelectItem value="name">Name</SelectItem>
                                                <SelectItem value="date">Date</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/50">
                                            <TableHead className="text-[#878A93] font-medium text-sm py-4">Date Joined</TableHead>
                                            <TableHead className="text-[#878A93] font-medium text-sm py-4">Query</TableHead>
                                            <TableHead className="text-[#878A93] font-medium text-sm py-4">Category</TableHead>
                                            <TableHead className="text-[#878A93] font-medium text-sm py-4">Action Taken</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* {projectData.map((business, index) => (
                                                <TableRow onClick={() => router.push('/projects/1')} key={business.id} className="border-b border-gray-100 cursor-pointer hover:bg-gray-50/50">
                                                    <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                                                            <FolderOpen className={business.status === "Verified" ? "text-[#04E762]" : "text-[#F2BB05]"} />
                                                        </div>
                                                        <span className="text-gray-900 text-sm">{business.name}</span>
                                                    </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-700 text-sm py-4">{business.owner}</TableCell>
                                                    <TableCell className="text-gray-700 text-sm py-4">{business.email}</TableCell>
                                                    <TableCell className="py-4">
                                                    <Badge
                                                        variant={business.status === "Verified" ? "default" : "secondary"}
                                                        className={
                                                        business.status === "Verified"
                                                            ? "border border-[#04E762] text-[#04E762] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent"
                                                            : "border border-[#F2BB05] text-[#F2BB05] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent"
                                                        }
                                                    >
                                                        {business.status}
                                                    </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-gray-700 text-sm py-4">{business.dateJoined}</TableCell>
                                                    <TableCell className="py-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                                        </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))} */}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'projects' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col rounded-[14px] bg-white border border-[#D1DAEC80] gap-3 p-4">
                            <div className="w-full p-6 bg-white">
                                {/* Header */}
                                <h1 className="text-2xl font-medium text-[#878A93] mb-6">Project List</h1>

                                {/* Controls */}
                                <div className="flex items-center justify-between mb-6 gap-4">
                                    <div className="flex items-center gap-4">
                                        <Select value="all-projects" defaultValue="all-projects">
                                            <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all-projects">All projects</SelectItem>
                                                <SelectItem value="in-progress">In-Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select defaultValue="sort">
                                            <SelectTrigger className="w-[80px] h-9 text-sm border-gray-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sort">Sort</SelectItem>
                                                <SelectItem value="name">Name</SelectItem>
                                                <SelectItem value="date">Date</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                placeholder="Search by project"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 w-[200px] h-9 text-sm border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <Button variant="outline" size="sm" className="h-9 text-sm border-gray-300 bg-transparent">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Date
                                    </Button>
                                </div>

                                {/* Table */}
                                <div className="rounded-lg overflow-hidden">
                                    <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Project name</TableHead>
                                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Experts</TableHead>
                                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Total Task</TableHead>
                                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Status</TableHead>
                                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Due Date</TableHead>
                                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {projectData.map((business) => (
                                        <TableRow onClick={() => router.push('/projects/1')} key={business.id} className="border-b border-gray-100 cursor-pointer hover:bg-gray-50/50">
                                            <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                                                    <FolderOpen className={business.status === "Verified" ? "text-[#04E762]" : "text-[#F2BB05]"} />
                                                </div>
                                                <span className="text-gray-900 text-sm">{business.name}</span>
                                            </div>
                                            </TableCell>
                                            <TableCell className="text-gray-700 text-sm py-4">{business.owner}</TableCell>
                                            <TableCell className="text-gray-700 text-sm py-4">{business.email}</TableCell>
                                            <TableCell className="py-4">
                                            <Badge
                                                variant={business.status === "Verified" ? "default" : "secondary"}
                                                className={
                                                business.status === "Verified"
                                                    ? "border border-[#04E762] text-[#04E762] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent"
                                                    : "border border-[#F2BB05] text-[#F2BB05] text-xs font-normal px-2 py-1 bg-transparent hover:bg-transparent"
                                                }
                                            >
                                                {business.status}
                                            </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-700 text-sm py-4">{business.dateJoined}</TableCell>
                                            <TableCell className="py-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                                </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View</DropdownMenuItem>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Rows per page</span>
                                    <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                                        <SelectTrigger className="w-16 h-8 text-sm border-gray-300">
                                        <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="13">13</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    </div>

                                    <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">1 of 1000</span>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                                            <ChevronLeft className="h-4 w-4 text-gray-400" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <ChevronRight className="h-4 w-4 text-gray-600" />
                                        </Button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BusinessId
