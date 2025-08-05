"use client"

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', Business: 60, Expert: 110, Project: 30 },
    { name: 'Feb', Business: 60, Expert: 110, Project: 30 },
    { name: 'Mar', Business: 60, Expert: 110, Project: 30 },
    { name: 'Apr', Business: 60, Expert: 110, Project: 30 },
    { name: 'May', Business: 60, Expert: 110, Project: 30 },
    { name: 'Jun', Business: 40, Expert: 80, Project: 5 },
    { name: 'Jul', Business: 35, Expert: 110, Project: 0 },
    { name: 'Aug', Business: 60, Expert: 110, Project: 30 },
    { name: 'Sep', Business: 60, Expert: 110, Project: 30 },
    { name: 'Oct', Business: 60, Expert: 110, Project: 30 },
    { name: 'Nov', Business: 60, Expert: 110, Project: 30 },
    { name: 'Dec', Business: 60, Expert: 110, Project: 30 },
];

const businessData = [
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
]

const Overview = () => {
    return (
        <div className="flex flex-col gap-6">
            <header className="text-2xl text-[#878A93] font-semibold mb-6">Welcome back, Samuel! 👋</header>
            <div className="flex items-center w-full gap-6">
                <div className="flex flex-col gap-2 w-full">
                    <span className="text-sm text-[#878A93] font-medium">Total Experts: <span className="text-[#3E4351]">1000</span></span>
                    <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex gap-6 p-4">
                        <div className="border-r w-full flex flex-col gap-4 border-[#EFF2F3]">
                            <span className="text-2xl font-bold text-[#0E1426]">500</span>
                            <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary">Registered</span>
                        </div>
                        <div className="w-full flex flex-col gap-4 border-[#EFF2F3]">
                            <span className="text-2xl font-bold text-[#0E1426]">500</span>
                            <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary-hover">Verified</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <span className="text-sm text-[#878A93] font-medium">Total Businesses: <span className="text-[#3E4351]">1000</span></span>
                    <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex gap-6 p-4">
                        <div className="border-r w-full flex flex-col gap-4 border-[#EFF2F3]">
                            <span className="text-2xl font-bold text-[#0E1426]">500</span>
                            <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-primary">Registered</span>
                        </div>
                        <div className="w-full flex flex-col gap-4 border-[#EFF2F3]">
                            <span className="text-2xl font-bold text-[#0E1426]">500</span>
                            <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#04E762]">Active</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <span className="text-sm text-[#878A93] font-medium">Total Projects: <span className="text-[#3E4351]">05</span></span>
                    <div className="bg-[#FBFCFC] border border-[#EFF2F3] rounded-2xl flex gap-6 p-4">
                        <div className="border-r w-full flex flex-col gap-4 border-[#EFF2F3]">
                            <span className="text-2xl font-bold text-[#0E1426]">500</span>
                            <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#1E88E5]">Active</span>
                        </div>
                        <div className="w-full flex flex-col gap-4 border-[#EFF2F3]">
                            <span className="text-2xl font-bold text-[#0E1426]">500</span>
                            <span className="text-sm text-[#878A93] font-medium pl-2 border-l-[2px] border-[#1E88E5]">Completed</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 mt-4">
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[#878A93] text-[20px] font-medium">Growth insight</h2>
                        <Select value='monthly'>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="annualy">Annualy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} barGap={1} barCategoryGap={20}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend verticalAlign="top" align="right" iconType="square" iconSize={12} wrapperStyle={{ paddingBottom: 20, fontSize: '8px' }} />
                                <Bar dataKey="Business" fill="#1746A2" radius={[4, 4, 0, 0]} barSize={12} />
                                <Bar dataKey="Expert" fill="#1A1A1A" radius={[4, 4, 0, 0]} barSize={12} />
                                <Bar dataKey="Project" fill="#FCCE37" radius={[4, 4, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="w-[351px] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className='text-[#878A93] font-medium text-[20px]'>Projects</span>
                        <span className='text-base text-[#0E1426] font-medium cursor-pointer'>See all</span>
                    </div>  
                    <div className="bg-[#FBFCFC] w-full hide-scrollbar h-80 overflow-y-scroll rounded-3xl p-6 pb-0">
                        <div className="w-full flex flex-col gap-2 p-[10px]">
                            <div className='flex w-full items-center justify-between'>
                                <div className='flex items-center gap-1'>
                                    <Image src={'/icons/inprogress.svg'} width={18} height={18} alt='inprogress icon' />
                                    <span className='text-xs text-[#3A5EFC]'>In-Progress</span>
                                </div>
                                <MoreHorizontal className='w-4' />
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className="flex items-center">
                                    <Image src={'/images/profile-pics.svg'} alt='profile picture' width={20} height={20} className='w-5 h-5 rounded-full' />
                                    <Image src={'/images/profile-pics.svg'} alt='profile picture' width={20} height={20} className='w-5 h-5 rounded-full' />
                                </div>
                                <span className='text-sm text-[#878A93]'>GreenMart Project task</span>
                            </div>
                            <span className='text-sm text-[#878A93]'>Being worked on by David Eze</span>
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-1 items-center'>
                                    <Calendar className='w-4 h-4 text-[#878A93]' />
                                    <span className='text-sm text-[#878A93]'>23-Jun-2025</span>
                                </div>
                                <div className='flex gap-1 items-center'>
                                    <Clock className='w-4 h-4 text-[#878A93]' />
                                    <span className='text-sm text-[#878A93]'>Due: 4weeks</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2 p-[10px]">
                            <div className='flex w-full items-center justify-between'>
                                <div className='flex items-center gap-1'>
                                    <Image src={'/icons/completed.svg'} width={18} height={18} alt='inprogress icon' />
                                    <span className='text-xs text-[#04E762]'>Completed</span>
                                </div>
                                <MoreHorizontal className='w-4' />
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className="flex items-center">
                                    <Image src={'/images/profile-pics.svg'} alt='profile picture' width={20} height={20} className='w-5 h-5 rounded-full' />
                                    <Image src={'/images/profile-pics.svg'} alt='profile picture' width={20} height={20} className='w-5 h-5 rounded-full' />
                                </div>
                                <span className='text-sm text-[#878A93]'>GreenMart Project task</span>
                            </div>
                            <span className='text-sm text-[#878A93]'>Being worked on by David Eze</span>
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-1 items-center'>
                                    <Calendar className='w-4 h-4 text-[#878A93]' />
                                    <span className='text-sm text-[#878A93]'>23-Jun-2025</span>
                                </div>
                                <div className='flex gap-1 items-center'>
                                    <Clock className='w-4 h-4 text-[#878A93]' />
                                    <span className='text-sm text-[#878A93]'>Due: 4weeks</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2 p-[10px]">
                            <div className='flex w-full items-center justify-between'>
                                <div className='flex items-center gap-1'>
                                    <Image src={'/icons/completed.svg'} width={18} height={18} alt='inprogress icon' />
                                    <span className='text-xs text-[#04E762]'>Completed</span>
                                </div>
                                <MoreHorizontal className='w-4' />
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className="flex items-center">
                                    <Image src={'/images/profile-pics.svg'} alt='profile picture' width={20} height={20} className='w-5 h-5 rounded-full' />
                                    <Image src={'/images/profile-pics.svg'} alt='profile picture' width={20} height={20} className='w-5 h-5 rounded-full' />
                                </div>
                                <span className='text-sm text-[#878A93]'>GreenMart Project task</span>
                            </div>
                            <span className='text-sm text-[#878A93]'>Being worked on by David Eze</span>
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-1 items-center'>
                                    <Calendar className='w-4 h-4 text-[#878A93]' />
                                    <span className='text-sm text-[#878A93]'>23-Jun-2025</span>
                                </div>
                                <div className='flex gap-1 items-center'>
                                    <Clock className='w-4 h-4 text-[#878A93]' />
                                    <span className='text-sm text-[#878A93]'>Due: 4weeks</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-4 mt-4'>
                <div className='flex items-center justify-between'>
                    <span className='text-[20px] font-medium text-[#878A93]'>Sign-up feeds</span>
                    <span className='text-base text-[#0E1426] font-medium cursor-pointer'>See all</span>
                </div>

                <div className="rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50">
                                <TableHead className="text-[#878A93] font-medium text-sm py-4">user name</TableHead>
                                <TableHead className="text-[#878A93] font-medium text-sm py-4">Email</TableHead>
                                <TableHead className="text-[#878A93] font-medium text-sm py-4">Account Type</TableHead>
                                <TableHead className="text-[#878A93] font-medium text-sm py-4">Status</TableHead>
                                <TableHead className="text-[#878A93] font-medium text-sm py-4">Created</TableHead>
                                <TableHead className="text-[#878A93] font-medium text-sm py-4">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {businessData.map((business, index) => (
                                <TableRow key={business.id} className="hover:bg-gray-50/50">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                                            {business.avatar}
                                            </div>
                                            <span className="text-gray-900 text-sm">{business.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-700 text-sm py-4">{business.email}</TableCell>
                                    <TableCell className="text-gray-700 text-sm py-4">{business.owner}</TableCell>
                                    <TableCell className="py-4">
                                        <Badge
                                            variant={business.status === "Verified" ? "default" : "secondary"}
                                            className={
                                            business.status === "Verified"
                                                ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs font-normal px-2 py-1"
                                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-normal px-2 py-1"
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
                                                <DropdownMenuItem>View profile</DropdownMenuItem>
                                                <DropdownMenuItem>Verify</DropdownMenuItem>
                                                {/* <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem> */}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Overview;
