"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const DashboardNav = ({ withLogo = true }: { withLogo?: boolean }) => {

    const pathName = usePathname()
    const route = pathName.replace(/^\//, '');

    return (
        <nav className="w-full bg-white flex items-center justify-between py-2 px-4 xl:pr-14">
            {!withLogo && <div className="text-[#0E1426] text-lg font-medium">{ route.charAt(0).toUpperCase() + route.slice(1) }</div>}
            {withLogo && <Image src={'/logo.svg'} alt="Logo" width={104} height={27.54} />}

            <div className="flex items-center gap-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <div className="px-4 py-2 cursor-pointer">
                            <Image src={'/icons/bell.svg'} alt="Bell" width={20} height={20} />
                        </div>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[419px] p-0">
                            <div className="h-screen p-4 flex flex-col gap-6">
                                <span className="text-2xl font-medium text-[#1A1A1A]">Notifications</span>
                                {/* Example Notification */}
                                <div className="border-l-4 border-primary pl-3 py-2 mb-2">
                                    <p className="text-sm font-semibold">Client name/company</p>
                                    <p className="text-xs text-muted-foreground">
                                        You`ve received feedback on your project with GreenMart
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">2 mins ago</p>
                                </div>
                            </div>
                    </SheetContent>
                </Sheet>

                <div className="w-[38px] h-[38px] rounded-full bg-[#FCCE37]"></div>
            </div>
        </nav>
    );
};

export default DashboardNav;
