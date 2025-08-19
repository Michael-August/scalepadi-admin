"use client"

import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, FolderOpen, MoreHorizontal, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

const Business = () => {

    const [searchTerm, setSearchTerm] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState("10")

    const router = useRouter()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-end w-full justify-between gap-6">
                <div className="flex flex-col gap-2 w-full">
                    <span className="text-sm text-[#878A93] font-medium">Total Registered Businesses: <span className="text-[#3E4351]">1000</span></span>
                    <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex gap-6 p-4">
                        <div className="border-r w-full flex flex-col gap-4 border-[#EFF2F3]">
                            <span className="text-2xl font-bold text-[#0E1426]">500</span>
                            <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">Verified</span>
                        </div>
                        <div className="border-r w-full flex flex-col gap-4 border-[#EFF2F3]">
                            <span className="text-2xl font-bold text-[#0E1426]">200</span>
                            <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary-hover">Pending</span>
                        </div>
                        <div className="w-full flex flex-col gap-4">
                            <span className="text-2xl font-bold text-[#0E1426]">300</span>
                            <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">Active Business</span>
                        </div>
                    </div>
                </div>
                <div className="w-full"></div>
                {/* <Button className="hover:bg-primary-hover hover:text-black">Start a new project</Button> */}
            </div>

            <div className="w-full p-6 bg-white">
                {/* Header */}
                <h1 className="text-2xl font-medium text-[#878A93] mb-6">Business List</h1>

                {/* Controls */}
                <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <Select value="all-business" defaultValue="all-business">
                            <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-business">All Business</SelectItem>
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
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Business name</TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Owner</TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Email</TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Status</TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Date Joined</TableHead>
                        <TableHead className="text-[#878A93] font-medium text-sm py-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projectData.map((business) => (
                        <TableRow onClick={() => router.push('/business/1')} key={business.id} className="border-b border-gray-100 cursor-pointer hover:bg-gray-50/50">
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
                                    ? "border border-[#04E762] text-[#04E762] text-xs font-normal px-2 py-1 bg-transparent"
                                    : "border border-[#F2BB05] text-[#F2BB05] text-xs font-normal px-2 py-1 bg-transparent"
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
    )
}

export default Business
