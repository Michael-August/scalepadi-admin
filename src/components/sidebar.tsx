import { Routes } from "@/lib/routes"
import { ChevronRight, Folder, FolderOpen, LogOutIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const SideBar = ({ onLinkClick }: { onLinkClick?: () => void }) => {

    const pathname = usePathname();
    
    return (
        <div className="bg-[#ffffff] w-full border-r border-[#EDEEF3] px-[18px] py-[30px] flex flex-col gap-14">
            <Image src={'/logo.svg'} alt="Logo" width={137.7} height={28} />
            
            <div className="flex w-full h-full flex-col items-center justify-between">
                <div className="routes w-full flex flex-col gap-3">
                    {Routes.map((route) => {
                        const isActive = pathname.startsWith(route.route);
                        return (
                            <Link
                                key={route.route}
                                href={route.route}
                                className={`route cursor-pointer rounded-xl w-full items-center px-4 py-3 flex gap-[10px] font-medium text-sm
                                ${isActive ? 'bg-secondary text-primary' : 'text-[#1A1A1A] hover:bg-secondary hover:text-primary'}`}
                            >
                                <route.icon />
                                <span>{route.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="flex w-full flex-col gap-3">
                    {/* <div className="progress mb-4 flex flex-col w-full items-center gap-3 justify-center">
                        <CircularProgress percentage={70} />
                        <span className="text-[#0A1B39] font-bold text-sm text-center">Complete your profile</span>
                        <span className="text-[#83899F] text-sm font-normal text-center">Awaiting profile verification feedback </span>
                        <Link href={'/profile'} className="border border-[#E6E7EC] text-center cursor-pointer text-sm text-[#1A1A1A] font-medium px-4 py-[8px] rounded-[12px]">My Profile</Link>
                    </div> */}
                    <div className="flex w-full cursor-pointer justify-between bg-[#F5F6F8] items-center rounded-2xl px-4 py-3">
                        <div className="bg-white w-12 h-12 rounded-full">
                            <Image src={'/icons/double-message.svg'} alt="message icon" width={48} height={48} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#1A1A1A] font-bold text-[15px]">Help Center</span>
                            <span className="text-[#83899F] text-sm font-normal">Answers here</span>
                        </div>
                        <ChevronRight className="text-[#9CA0B2] w-4 h-4" />
                    </div>
                    <div
                        className={`cursor-pointer rounded-xl w-full items-center px-4 py-3 flex text-[#E33161] gap-[10px] font-medium text-sm`}
                    >
                        <LogOutIcon className="w-5 h-5" />
                        <span>Log out</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar
