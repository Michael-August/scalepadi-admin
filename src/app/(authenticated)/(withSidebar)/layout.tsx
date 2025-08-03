"use client"

import DashboardNav from "@/components/dashboard-navbar";
import SideBar from "@/components/sidebar";
import { Menu } from "lucide-react";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

    return (
        <html lang="en">
            <body>
                <div className="flex h-screen overflow-hidden">
                    <div className="hidden lg:flex w-[17.25rem] bg-white h-screen fixed left-0 top-0 z-30">
                        <SideBar />
                    </div>

                    {/* Sidebar for mobile */}
                    {isSidebarOpen && (
                        <div className="fixed inset-0 z-40 lg:hidden">
                            {/* Overlay */}
                            <div
                                className="fixed inset-0 bg-black opacity-30"
                                onClick={() => setIsSidebarOpen(false)}
                            />

                            {/* Sliding panel */}
                            <div className="fixed top-0 left-0 h-full w-[17.25rem] bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0">
                                <SideBar onLinkClick={() => setIsSidebarOpen(false)} />
                            </div>
                        </div>
                    )}

                    {/* Main content wrapper */}
                    <div className="flex flex-col w-full flex-1 lg:ml-[17.25rem]">
                        {/* Navbar */}
                        <div className="flex items-center w-full gap-3 justify-between bg-white fixed top-0 lg:left-[17.25rem] right-0 z-20">
                            {/* Mobile: Hamburger icon */}
                            <button className="lg:hidden cursor-pointer px-4" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="text-gray-700" />
                            </button>
                            <DashboardNav withLogo={false} />
                        </div>

                        {/* Scrollable Main Content */}
                        <main className="bg-white w-full flex-1 overflow-y-auto mt-[4rem] p-4">
                            {/*<Protected> */}
                            <div className="mx-auto max-w-screen-xl">
                                <div className="lg:pt-10">
                                    {children}
                                </div>
                            </div>
                            {/*</Protected> */}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
