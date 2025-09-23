"use client"

import { Facebook, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"

const navigation = [
  { title: "How ScalePadi works", href: "#" },
  { title: "Academy", href: "#" },
  { title: "Blog", href: "#" },
  { title: "About our Growth Hub", href: "#" },
  { title: "Contact us", href: "#" },
]

const licence = [
  { title: "Privacy Policy", href: "#" },
  { title: "Terms of Use", href: "#" },
  { title: "Cookie Policy", href: "#" },
]

export default function Footer() {
    return (
        <footer className="flex flex-col gap-10 bg-primary text-white px-4 lg:px-14 py-12">
            <div className="scale bg-[#020609] rounded-[32px] w-full flex flex-wrap items-center justify-between px-8 py-4 gap-5 lg:px-16 lg:py-8 lg:mb-16">
                <span className="font-semibold text-4xl lg:text-6xl leading-[130%] lg:w-[750px]">Looking to Scale your Business?</span>
                <Button className="flex items-center gap-2 bg-primary text-white">
                    <span>Get Started Now</span>
                    <ArrowRight />
                </Button>
            </div>
            <div className="w-full">
                <div className="flex items-center flex-col lg:flex-row justify-between gap-10 lg:gap-[100px]">
                    {/* Logo and Description */}
                    <div className="flex flex-col gap-3.5 lg:gap-[30px] lg:w-[800px]">
                        <Image src={'/footer-logo.svg'} alt="logo" width={186} height={49.25} />
                        <p className="text-[#DFDFDF] text-sm leading-[24px] text-center md:text-left">
                            We provide end-to-end business growth services that tackle every scaling challenge African businesses
                            face, from AI-powered strategy development and expert talent matching to performance analytics and
                            execution frameworks, our platform delivers the complete infrastructure to accelerate sustainable business
                            growth.
                        </p>
                        <div className="flex items-center justify-center md:items-start md:justify-start gap-3">
                            <div className="bg-white w-[34px] h-[34px] rounded-full flex items-center justify-center">
                                <Facebook className="w-4 h-4 text-primary hover:text-[#7392ee] cursor-pointer" />
                            </div>
                            <div className="bg-white w-[34px] h-[34px] rounded-full flex items-center justify-center">
                                <Twitter className="w-4 h-4 text-primary hover:text-[#7392ee] cursor-pointer" />
                            </div>
                            <div className="bg-white w-[34px] h-[34px] rounded-full flex items-center justify-center">
                                <Linkedin className="w-4 h-4 text-primary hover:text-[#7392ee] cursor-pointer" />
                            </div>
                            <div className="bg-white w-[34px] h-[34px] rounded-full flex items-center justify-center">
                                <Instagram className="w-4 h-4 text-primary hover:text-[#7392ee] cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col md:flex-row gap-11 lg:gap-[95px]">
                        {/* Navigation */}
                        <div className="w-full flex flex-col items-center justify-center md:items-start md:justify-start">
                            <h4 className="font-semibold text-lg mb-5 lg:mb-10">Navigation</h4>
                            <ul className="flex flex-col items-center justify-center md:items-start md:justify-start gap-3 md:gap-7">
                                {navigation.map((item, index) => (
                                    <li key={index}>
                                        <Link href={item.href} className="text-blue-100 hover:text-white text-sm transition-colors">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Licence */}
                        <div className="w-full flex flex-col items-center justify-center md:items-start md:justify-start">
                            <h4 className="font-semibold text-lg mb-5 lg:mb-10">Licence</h4>
                            <ul className="flex flex-col items-center justify-center md:items-start md:justify-start gap-3 md:gap-7">
                            {licence.map((item, index) => (
                                <li key={index}>
                                <Link href={item.href} className="text-blue-100 hover:text-white text-sm transition-colors">
                                    {item.title}
                                </Link>
                                </li>
                            ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="w-full flex flex-col items-center justify-center md:items-start md:justify-start">
                            <h4 className="font-semibold text-lg mb-5 lg:mb-10">Contact</h4>
                            <div className="flex flex-col text-center items-center justify-center md:items-start md:justify-start gap-3 md:gap-7 text-sm text-blue-100">
                                <p>+2349073538138</p>
                                <p>info@scalepadi.com</p>
                                <p>
                                    No 26 Abu Lamidat street
                                    <br />
                                    Abuja, Nigeria
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
