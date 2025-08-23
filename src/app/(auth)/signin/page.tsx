"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail } from "lucide-react";
import Image from "next/image"
import Link from "next/link";
import { useState } from "react";
import * as z from 'zod';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const signinFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .refine((value) => {
            // Check for at least one uppercase letter, one lowercase letter, one number, and one special character
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        }, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
});

type SignInFormData = z.infer<typeof signinFormSchema>;

const SignIn = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [signInMethod, setSignInMethod] = useState('initial')
    const router = useRouter();

    const { login, isPending } = useLogin();

    const { handleSubmit, formState: {errors}, register, reset } = useForm<SignInFormData>({
        resolver: zodResolver(signinFormSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = (data: SignInFormData) => {
        login(data, {
            onSuccess: (res) => {
                console.log(res);
                localStorage.setItem("token", res.data.token);
                toast.success("Login successful");
                reset();
                router.replace('/overview');
            },
            onError: (error) => {
                toast.error(error.message || "An error occurred during login");
                console.error("Login error:", error);
            }
        });
    }

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
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            <div className="form-group flex flex-col gap-2">
                                <Label>Email <span className="text-red-600">*</span></Label>
                                <Input {...register('email')} className="rounded-[14px] py-6 px-4 border border-[#D1DAEC]" type="email" placeholder="Enter email" />
                                {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
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
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
                                        onClick={() => setShowPassword((prev: boolean) => !prev)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
                                <Link href='' className="font-normal text-sm text-[#878A93] cursor-pointer">
                                    Forgot password
                                </Link>
                            </div>
                            <Button disabled={isPending} type="submit" className="bg-primary text-white w-fit rounded-[14px] px-4 py-6">{isPending ? 'Logging in...' : 'Login'}</Button>
                        </form>
                    </div>}
                </div>
                
            </div>
        </div>
    )
}

export default SignIn;
