"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPassword } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const forgotPasswordFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

const ForgotPassword = () => {
  const router = useRouter();

  const { forgotPassword, isPending } = useForgotPassword();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data, {
      onSuccess: (res) => {
        console.log(res);
        localStorage.setItem("newUserEmail", data.email);
        toast.success("OTP sent");
        reset();
        router.replace("/reset-password");
      },
      onError: (error) => {
        toast.error(
          error.message || "An error occurred during forgot password"
        );
        console.error("Forgot password error:", error);
      },
    });
  };

  return (
    <div className="flex">
      <Image
        className="hidden lg:block"
        src={"/images/login-side.svg"}
        alt="Side image"
        width={692}
        height={743}
      />
      <div className="bg-[url('/images/blur-bg.svg')] w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 lg:w-[506px] py-5 lg:py-0">
          <div className="top flex flex-col gap-4 items-center justify-center">
            <span className="text-primary-text font-bold lg:text-[32px] text-2xl">
              Forgot Password
            </span>
            <span className="text-secondary-text text-sm lg:text-base font-medium text-center">
              Request an OTP to reset ur password
            </span>
          </div>

          <div className="rounded-3xl bg-white p-10 border border-[#EFF2F3] w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="form-group flex flex-col gap-2">
                <Label>
                  Email <span className="text-red-600">*</span>
                </Label>
                <Input
                  {...register("email")}
                  className="rounded-[14px] py-6 px-4 border border-[#D1DAEC]"
                  type="email"
                  placeholder="Enter email"
                />
                {errors.email && (
                  <span className="text-red-600 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <Button
                disabled={isPending}
                type="submit"
                className="bg-primary text-white w-fit rounded-[14px] px-4 py-6"
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
