import { useGetAdminByToken } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { admin } = useGetAdminByToken();

//   console.log(admin);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.info("You need to login first");
      router.replace("/signin");
    }

    if (admin) {
      localStorage.setItem("user", JSON.stringify(admin));
    }
  }, [admin]);

  return <>{children}</>;
};

export default Protected;
