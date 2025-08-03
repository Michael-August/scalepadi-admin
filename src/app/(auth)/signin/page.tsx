"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail } from "lucide-react";
import Image from "next/image"
import Link from "next/link";
import { useState } from "react";

const SignIn = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [signInMethod, setSignInMethod] = useState('initial')

    return (
        <div className="flex">
            <Image className="hidden lg:block" src={'/images/login-side.svg'} alt="Side image" width={692} height={743} />
            <div className="bg-[url('/images/blur-bg.svg')] w-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-6 lg:w-[506px] py-5 lg:py-0">
                    <div className="top flex flex-col gap-4 items-center justify-center">
                        <span className="text-primary-text font-bold lg:text-[32px] text-2xl">Sign-in</span>
                        <span className="text-secondary-text text-sm lg:text-base font-medium text-center">Choose your preferred means of signing in</span>
                    </div>
                    {signInMethod === 'initial' && <div className="rounded-3xl bg-white p-10 border border-[#EFF2F3] w-full flex flex-col gap-6">
                        <Button onClick={() => setSignInMethod('email')} className="bg-primary text-white py-6 flex gap-3 rounded-[14px] w-full">
                            <Mail />
                            Sign In with Email
                        </Button>
                        <span className="font-medium text-center text-sm text-[#1A1A1A]">Or</span>
                        <Button variant={'outline'} className="py-6 flex gap-3 rounded-[14px] w-full">
                            <Image src={'/icons/google.svg'} alt="Google icon" width={24} height={24} />
                            Sign In with Google
                        </Button>
                    </div>}

                    { signInMethod === 'email' && <div className="rounded-3xl bg-white p-10 border border-[#EFF2F3] w-full">
                        <form action="" className="flex flex-col gap-6">
                            <div className="form-group flex flex-col gap-2">
                                <Label>Email <span className="text-red-600">*</span></Label>
                                <Input className="rounded-[14px] py-6 px-4 border border-[#D1DAEC]" type="email" placeholder="Enter email" />
                            </div>
                            <div className="form-group flex flex-col gap-2">
                                <Label>
                                    Password <span className="text-red-600">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        className="rounded-[14px] py-6 px-4 border border-[#D1DAEC] pr-12"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
                                        onClick={() => setShowPassword((prev: boolean) => !prev)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <Link href='' className="font-normal text-sm text-[#878A93] cursor-pointer">
                                    Forgot password
                                </Link>
                            </div>
                            <Button className="bg-primary text-white w-fit rounded-[14px] px-4 py-6">Login</Button>
                        </form>
                    </div>}

                    <div className="w-full">
                        <Link href={'/signup'} className="text-sm text-[#878A93] text-left">Don’t have an account? <span className="text-primary cursor-pointer">Create account</span></Link>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default SignIn;
