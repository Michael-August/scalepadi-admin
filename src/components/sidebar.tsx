import { useState } from "react";
import { Routes } from "@/lib/routes";
import { ChevronRight, LogOutIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/hooks/useAuth";

// Confirmation Modal Component
const LogoutConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  isPending 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
          Confirm Logout
        </h3>
        <p className="text-[#83899F] mb-6">
          Are you sure you want to log out? You`ll need to log in again to access your account.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-[#1A1A1A] border border-[#E6E7EC] rounded-xl hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-[#E33161] rounded-xl hover:bg-[#d12a57] disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              "Log Out"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const SideBar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isPending } = useLogout();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout(undefined, {
      onSuccess: () => {
        // Redirect to login page or home page after successful logout
        localStorage.removeItem("token");
        router.push("/");
        setIsLogoutModalOpen(false);
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        // You can show a toast notification here if needed
        setIsLogoutModalOpen(false);
      },
    });
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <div className="bg-[#ffffff] w-full border-r border-[#EDEEF3] px-[18px] py-[30px] flex flex-col gap-14">
        <Image src={"/logo.svg"} alt="Logo" width={137.7} height={28} />

        <div className="flex w-full h-full flex-col items-center justify-between">
          <div className="routes w-full flex flex-col gap-3">
            {Routes.map((route) => {
              const isActive = pathname.startsWith(route.route);
              return (
                <div
                  key={route.route}
                  onClick={() => {
                    onLinkClick?.();
                    router.push(route.route);
                  }}
                  className={`route cursor-pointer rounded-xl w-full items-center px-4 py-3 flex gap-[10px] font-medium text-sm
                    ${
                      isActive
                        ? "bg-secondary text-primary"
                        : "text-[#1A1A1A] hover:bg-secondary hover:text-primary"
                    }`}
                >
                  <route.icon />
                  <span>{route.name}</span>
                </div>
              );
            })}
          </div>

          <div className="flex w-full flex-col gap-3">
            <div
              onClick={() => {
                onLinkClick?.();
                router.push("/inquiries");
              }}
              className="flex w-full cursor-pointer justify-between bg-[#F5F6F8] items-center rounded-2xl px-4 py-3"
            >
              <div className="bg-white w-12 h-12 rounded-full">
                <Image
                  src={"/icons/double-message.svg"}
                  alt="message icon"
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[#1A1A1A] font-bold text-[15px]">
                  Help Center
                </span>
                <span className="text-[#83899F] text-sm font-normal">
                  Answers here
                </span>
              </div>
              <ChevronRight className="text-[#9CA0B2] w-4 h-4" />
            </div>
            
            {/* Logout Button */}
            <div
              onClick={handleLogoutClick}
              className={`cursor-pointer rounded-xl w-full items-center px-4 py-3 flex text-[#E33161] gap-[10px] font-medium text-sm hover:bg-red-50 transition-colors ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <LogOutIcon className="w-5 h-5" />
              <span>
                {isPending ? "Logging out..." : "Log out"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isPending={isPending}
      />
    </>
  );
};

export default SideBar;