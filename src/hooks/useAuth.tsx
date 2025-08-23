import { axiosClient } from "@/lib/api/axiosclient";
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useSignUp = () => {
    const { mutate: signUp, isPending } = useMutation({
        mutationFn: async (data) => {
            try {
                const res = await axiosClient.post("/sign-up-business", data);
                if (res.data?.status === false) {
                    throw new Error(res.data?.message || "An error occurred during sign up");
                }
                return res.data;
            } catch (error: any) { 
                throw new Error(error) || new Error("An error occurred during sign up");
            }
        }
    })

    return { signUp, isPending };
}

export const useLogin = () => {
    const { mutate: login, isPending } = useMutation({
        mutationFn: async (data: { email: string, password: string }) => {
            try {
                const res = await axiosClient.post("/login/admin", data);
                if (res.data?.status === false) {
                    throw new Error(res.data?.message || "An error occurred during login");
                }
                return res.data;
            } catch (error: any) { 
                throw new Error(error) || new Error("An error occurred during login");
            }
        }
    })

    return { login, isPending };
}

export const useVerifyEmail = () => {
    const { mutate: verifyEmail, isPending } = useMutation({
        mutationFn: async (data: { email: string, otp: string }) => {
            try {
                const res = await axiosClient.put("/verify-business", data);
                if (res.data?.status === false) {
                    throw new Error(res.data?.message || "An error occurred during email verification");
                }
                return res.data;
            } catch (error: any) { 
                throw new Error(error) || new Error("An error occurred during email verification");
            }
        }
    })

    return { verifyEmail, isPending };
}

export const useForgotPassword = () => {
    const { mutate: forgotPassword, isPending } = useMutation({
        mutationFn: async (data: { email: string }) => {
            try {
                const res = await axiosClient.post("/forgot-password-business", data);
                if (res.data?.status === false) {
                    throw new Error(res.data?.message || "An error occurred during password reset request");
                }
                return res.data;
            } catch (error: any) { 
                throw new Error(error) || new Error("An error occurred during password reset request");
            }
        }
    })

    return { forgotPassword, isPending };
}

export const useResetPassword = () => {
    const { mutate: resetPassword, isPending } = useMutation({
        mutationFn: async (data: { email: string, password: string, confirmPassword: string }) => {
            try {
                const res = await axiosClient.put("/reset-password-business", data);
                if (res.data?.status === false) {
                    throw new Error(res.data?.message || "An error occurred during password reset");
                }
                return res.data;
            } catch (error: any) { 
                throw new Error(error) || new Error("An error occurred during password reset");
            }
        }
    })

    return { resetPassword, isPending };
}

export const useGetAdminByToken = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/token/admin`)
                if (response.data?.status === false) {
                    throw new Error(response.data?.message || "Failed to fetch admin");
                }
                return response.data
            } catch (error: any) {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message || "Failed to fetch admin")
                } else if (error instanceof Error) {
                    toast.error(error.message)
                } else {
                    toast.error("An unexpected error occured while fetching project")
                }

                throw error;
            }
        }
    })

    return { admin: data, isLoading }
}

export const useLogout = () => {
    const { mutate: logout, isPending } = useMutation({
        mutationFn: async () => {
            try {
                const res = await axiosClient.post("/logout/business");
                if (res.data?.status === false) {
                    throw new Error(res.data?.message || "An error occurred during logout");
                }
                return res.data;
            } catch (error: any) { 
                throw new Error(error) || new Error("An error occurred during logout");
            }
        }
    })

    return { logout, isPending };
}
