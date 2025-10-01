"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPassword } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const resetPasswordFormSchema = z
  .object({
    code: z.string(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine(
        (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value),
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

const ResetPassword = () => {
  const router = useRouter();

  const { resetPassword, isPending } = useResetPassword();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(
      { ...data },
      {
        onSuccess: (res) => {
          console.log(res);
          localStorage.removeItem("random");
          toast.success("Password reset successful");
          reset();
          router.replace("/signin");
        },
        onError: (error) => {
          toast.error(
            error.message || "An error occurred during reset password"
          );
          console.error("Reset password error:", error);
        },
      }
    );
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
              Reset Password
            </span>
            <span className="text-secondary-text text-sm lg:text-base font-medium text-center">
              Enter your desired new password
            </span>
          </div>

          <div className="rounded-3xl bg-white p-10 border border-[#EFF2F3] w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="form-group flex flex-col gap-2">
                <Label>
                  Code <span className="text-red-600">*</span>
                </Label>
                <Input
                  {...register("code")}
                  className="rounded-[14px] py-6 px-4 border border-[#D1DAEC]"
                  type="password"
                  placeholder="Enter Code sent to your email"
                />
                {errors.code && (
                  <span className="text-red-600 text-sm">
                    {errors.code.message}
                  </span>
                )}
              </div>

              {/* New Password */}
              <div className="form-group flex flex-col gap-2">
                <Label>
                  New Password <span className="text-red-600">*</span>
                </Label>
                <Input
                  {...register("newPassword")}
                  className="rounded-[14px] py-6 px-4 border border-[#D1DAEC]"
                  type="password"
                  placeholder="Enter new password"
                />
                {errors.newPassword && (
                  <span className="text-red-600 text-sm">
                    {errors.newPassword.message}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group flex flex-col gap-2">
                <Label>
                  Confirm Password <span className="text-red-600">*</span>
                </Label>
                <Input
                  {...register("confirmPassword")}
                  className="rounded-[14px] py-6 px-4 border border-[#D1DAEC]"
                  type="password"
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <span className="text-red-600 text-sm">
                    {errors.confirmPassword.message}
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

export default ResetPassword;
