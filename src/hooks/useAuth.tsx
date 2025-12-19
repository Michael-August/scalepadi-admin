import { axiosClient } from "@/lib/api/axiosclient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignUp = () => {
  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axiosClient.post("/sign-up-business", data);
        if (res.data?.status === false) {
          throw new Error(
            res.data?.message || "An error occurred during sign up"
          );
        }
        return res.data;
      } catch (error: any) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || `Failed to sign up`);
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(`An unexpected error occured while trying to sign up`);
        }

        throw error;
      }
    },
  });

  return { signUp, isPending };
};

export const useLogin = () => {
  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        const res = await axiosClient.post("/login/admin", data);
        if (res.data?.status === false) {
          throw new Error(
            res.data?.message || "An error occurred during login"
          );
        }
        return res.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || `Failed to log in`);
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(`An unexpected error occured while trying to log in`);
        }

        throw error;
      }
    },
  });

  return { login, isPending };
};

export const useVerifyEmail = () => {
  const { mutate: verifyEmail, isPending } = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      try {
        const res = await axiosClient.put("/verify-business", data);
        if (res.data?.status === false) {
          throw new Error(
            res.data?.message || "An error occurred during email verification"
          );
        }
        return res.data;
      } catch (error: any) {
        throw (
          new Error(error) ||
          new Error("An error occurred during email verification")
        );
      }
    },
  });

  return { verifyEmail, isPending };
};

export const useForgotPassword = () => {
  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: async (data: { email: string }) => {
      try {
        const res = await axiosClient.post("/forgot-password-admin", data);
        if (res.data?.status === false) {
          throw new Error(
            res.data?.message ||
            "An error occurred during password reset request"
          );
        }
        console.log(res.data);
        return res.data;
      } catch (error: any) {
        throw (
          new Error(error) ||
          new Error("An error occurred during password reset request")
        );
      }
    },
  });

  return { forgotPassword, isPending };
};

export const useResetPassword = () => {
  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async (data: {
      code: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      try {
        const res = await axiosClient.put("/reset-password-admin", data);
        if (res.data?.status === false) {
          throw new Error(
            res.data?.message || "An error occurred during password reset"
          );
        }
        console.log(res.data);
        return res.data;
      } catch (error: any) {
        throw (
          new Error(error) ||
          new Error("An error occurred during password reset")
        );
      }
    },
  });

  return { resetPassword, isPending };
};

export const useGetAdminByToken = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/token/admin`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch admin");
        }
        return response.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch admin");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occured while fetching project");
        }

        throw error;
      }
    },
  });

  return { admin: data, isLoading };
};

export const useLogout = () => {
  const router = useRouter();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axiosClient.post("/logout/admin");

        if (res.data?.status === false) {
          throw new Error(
            res.data?.message || "An error occurred during logout"
          );
        }

        console.log(res.data);
        return res.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || `Failed to log out`);
          router.push("/");
        } else if (error instanceof Error) {
          toast.error(error.message);
          router.push("/");
        } else {
          toast.error(`An unexpected error occured while trying to log out`);
          router.push("/");
        }
        throw error;
      }
    },
    onError: (error: any) => {
      // You can add toast notification here
      console.error("Logout error:", error);
    },
  });

  return { logout, isPending };
};

export const useGetAdminList = (
  page: number = 1,
  limit: number = 10,
  status: string = "",
  search: string = "",
  role: string = ""
) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile", page, limit, status, search, role],
    queryFn: async () => {
      try {
        let url = `/admin?page=${page}&limit=${limit}`;
        if (status && status !== "All statuses") url += `&status=${status}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (role && role !== "All roles") url += `&role=${encodeURIComponent(role)}`;

        const response = await axiosClient.get(url);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch admin");
        }
        return response.data.data;
      } catch (error: any) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch admin");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occured while fetching project");
        }

        throw error;
      }
    },
  });

  return { AdminUserList: data, isLoading };
};

export const useGetAdminById = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async ({ queryKey }) => {
      const [, adminId] = queryKey;

      try {
        const response = await axiosClient.get(`/admin/${adminId}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch admin");
        }
        return response.data.data;
      } catch (error: any) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch admin");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching admin");
        }

        throw error;
      }
    },
    enabled: !!id,
  });

  return { AdminDetails: data, isLoading };
};

export const useUpdateAdminBySuperAdmin = () => {
  const queryClient = useQueryClient();
  const { mutate: updateAdminBySuperAdmin, isPending } = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      try {
        const res = await axiosClient.put(`/admin/${id}`, { role });
        if (res.data?.status === false) {
          throw new Error(
            res.data?.message || "An error occurred during login"
          );
        }
        return res.data.data;
      } catch (error: any) {
        throw new Error(error) || new Error("An error occurred during login");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return { updateAdminBySuperAdmin, isPending };
};

type NewAdmin = {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  status: string;
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  const { mutate: createAdmin, isPending } = useMutation<void, Error, NewAdmin>(
    {
      mutationFn: async (data) => {
        try {
          const response = await axiosClient.post(`/admin`, data);
          if (response?.data.status === false) {
            throw new Error(
              response.data?.message || "An error occurred creating admin"
            );
          }
          return response.data;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error("Unknown error occurred while creating admin");
          }
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      },
    }
  );
  return { createAdmin, isPending };
};

export const useAcceptDeclineMatch = () => {
  const queryClient = useQueryClient();
  const { mutate: acceptOrDecline, isPending } = useMutation({
    mutationFn: async (data: {
      inviteStatus: "accepted" | "declined";
      userId: string;
    }) => {
      try {
        const response = await axiosClient.put(
          `/invite/admin/${data?.userId}`,
          { inviteStatus: data.inviteStatus }
        );
        if (response.data?.status === false) {
          throw new Error(
            response.data?.message || `Failed to ${data.inviteStatus} match`
          );
        }
        return response.data;
      } catch (error: any) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message ||
            `Failed to ${data.inviteStatus} match`
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(
            `An unexpected error occured while trying to ${data.inviteStatus} match`
          );
        }

        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return { acceptOrDecline, isPending };
};


export const useGetAdminApprovedUsers = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-approved", id],
    queryFn: async ({ queryKey }) => {
      const [, adminId] = queryKey;

      try {
        const response = await axiosClient.get(`/approval/count/${adminId}`);
        if (response.data?.status === false) {
          throw new Error(response.data?.message || "Failed to fetch admin");
        }
        return response.data.data;
      } catch (error: any) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch admin");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while fetching admin");
        }

        throw error;
      }
    },
    enabled: !!id,
  });

  return { adminApprovedUsers: data, isLoading };
};