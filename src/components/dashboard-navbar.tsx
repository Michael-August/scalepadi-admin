"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useGetProjectById } from "@/hooks/useProjects";
import { useGetBusinessById } from "@/hooks/useBusiness";
import { useGetExpertById } from "@/hooks/useExpert";
import { useGetAdminById } from "@/hooks/useAuth";
import { useNotifications, useNotificationActions } from "@/hooks/useNotification";
// import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
// import { Badge } from "./ui/badge";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import moment from "moment";


interface Notification {
  id: string;
  content: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const RelativeTime: React.FC<{ date: string | Date }> = ({ date }) => {
  const [relative, setRelative] = useState("");

  const formatRelativeTime = (date: string | Date) => {
    const now = moment();
    const target = moment(date);

    const diffMinutes = now.diff(target, "minutes");
    const diffHours = now.diff(target, "hours");
    const diffDays = now.diff(target, "days");
    const diffMonths = now.diff(target, "months");

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60)
      return `${diffMinutes} min${diffMinutes !== 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays < 30)
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    setRelative(formatRelativeTime(date));

    const interval = setInterval(() => {
      setRelative(formatRelativeTime(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  return <p className="text-[10px] text-muted-foreground">{relative}</p>;
};

const NotificationItem = ({ 
  notification, 
  onMarkAsRead
}: { 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) => {
  const handleClick = () => {
    // Mark as read when clicked
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate to link if provided
    // if (notification.link) {
    //   window.open(notification.link, '_blank');
    // }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer p-4 rounded-lg transition-all duration-200 shadow-sm border-l-4 flex flex-col gap-1",
        notification.read === false
          ? "bg-[#F2F6FF] border-[#1746A2] hover:bg-[#E9F0FF]"
          : "bg-[#FAFAFA] border-[#F2BB05] hover:bg-[#F5F5F5]"
      )}
    >
      <p
        className={cn(
          "text-sm font-medium",
          notification.read === false ? "text-[#1746A2]" : "text-gray-600"
        )}
      >
        {notification.content}
      </p>
      <span className="text-xs text-gray-400">
        <RelativeTime date={notification.createdAt} />
      </span>
    </div>
  );
};

// Notification Skeleton Loader
const NotificationSkeleton = () => (
  <div className="p-4 rounded-lg bg-gray-50 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
  </div>
);

const DashboardNav = ({ withLogo = true }: { withLogo?: boolean }) => {
  const pathName = usePathname();
  const route = pathName.replace(/^\/|\/$/g, "");

  // Detect detail pages
  const projectDetailMatch = route.match(/^projects\/(\w+)/);
  const businessDetailMatch = route.match(/^business\/(\w+)/);
  const expertDetailMatch = route.match(/^experts\/(\w+)/);
  const userDetailMatch = route.match(/^users\/(\w+)/);

  const projectId = projectDetailMatch ? projectDetailMatch[1] : null;
  const businessId = businessDetailMatch ? businessDetailMatch[1] : null;
  const expertId = expertDetailMatch ? expertDetailMatch[1] : null;
  const userId = userDetailMatch ? userDetailMatch[1] : null;

  // Fetch names if on detail page
  const { projectDetails } = useGetProjectById(projectId || "");
  const { businessDetails } = useGetBusinessById(businessId || "");
  const { expertDetails } = useGetExpertById(expertId || "");
  const { AdminDetails } = useGetAdminById(userId || "");

  const displayText = useMemo(() => {
    if (projectId && projectDetails?.title) {
      return `Project / ${projectDetails.title}`;
    } else if (businessId && businessDetails?.name) {
      return `Business / ${businessDetails.name}`;
    } else if (expertId && expertDetails?.name) {
      return `Expert / ${expertDetails.name}`;
    } else if (userId && AdminDetails?.name) {
      return `Admin / ${AdminDetails.name}`;
    } else if (route.startsWith("projects")) {
      return "Project";
    } else if (route.startsWith("business")) {
      return "Business";
    } else if (route.startsWith("experts")) {
      return "Expert";
    } else if (route.startsWith("users")) {
      return "User";
    } else {
      return route.charAt(0).toUpperCase() + route.slice(1);
    }
  }, [projectId, businessId, expertId, userId, projectDetails, businessDetails, expertDetails, AdminDetails, route]);

  // Notifications state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newNotifications, setNewNotifications] = useState<Notification[]>([]);
  
  const { notifications, isLoading } = useNotifications();
  const { markAsRead, markAllAsRead, isMarkingAsRead } = useNotificationActions();

  // Use refs to avoid dependency issues
  const markAsReadRef = useRef(markAsRead);
  markAsReadRef.current = markAsRead;

  // Combine existing notifications with new WebSocket notifications
  const allNotifications = useMemo(() => {
    return [...newNotifications, ...notifications];
  }, [notifications, newNotifications]);

  // Calculate total unread count
  const totalUnreadCount = useMemo(() => {
    const existingUnread = notifications.filter(n => !n.read).length;
    const newUnread = newNotifications.filter(n => !n.read).length;
    return existingUnread + newUnread;
  }, [notifications, newNotifications]);

  // WebSocket connection setup
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      console.log("No user found in localStorage");
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
      if (!user?.id) {
        console.log("No user ID found");
        return;
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return;
    }

    console.log("🔄 Initializing WebSocket connection for user:", user.id);

    const newSocket = io("https://scale-padi.onrender.com", {
      transports: ["websocket", "polling"],
      timeout: 10000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    const handleConnect = () => {
      console.log(`WebSocket Connected for user ${user.id}:`);
      setIsConnected(true);
      
      // Register user with socket server
      newSocket.emit("register", user.id);
    };

    const handleNotification = (data: Notification) => {
      console.log("New notification received");
      
      setNewNotifications(prev => [data, ...prev]);
      
      toast.info("New Notification", {
        description: data.content,
        action: {
          label: "View",
          onClick: () => {
            setIsSheetOpen(true);
            
            if (!data.read) {
              markAsReadRef.current(data.id);
              setNewNotifications(prev => 
                prev.map(n => n.id === data.id ? { ...n, read: true } : n)
              );
            }
          },
        },
      });
    };

    const handleDisconnect = (reason: string) => {
      console.log(`WebSocket Disconnected for user ${user.id}:`, reason);
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("notification", handleNotification);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("connect_error", handleConnectError);

    return () => {
      console.log("Cleaning up WebSocket connection");
      newSocket.off("connect", handleConnect);
      newSocket.off("notification", handleNotification);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("connect_error", handleConnectError);
      
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);
  
  useEffect(() => {
    if (!isConnected && socket && socket.disconnected) {
      console.log("Attempting to reconnect WebSocket...");
      const reconnectTimeout = setTimeout(() => {
        socket.connect();
      }, 3000);

      return () => clearTimeout(reconnectTimeout);
    }
  }, [isConnected, socket]);

  const handleMarkAsRead = useCallback((notificationId: string) => {
    markAsRead(notificationId);
    setNewNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, [markAsRead]);

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
    setNewNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, [markAllAsRead]);

  const handleSheetOpen = useCallback((open: boolean) => {
    setIsSheetOpen(open);
  }, []);

  return (
    <nav className="w-full bg-white border-b border-primary-border flex items-center justify-between py-2 px-4 lg:pr-14">
      {!withLogo && (
        <div className="text-[#0E1426] text-lg font-medium">
          {displayText}
        </div>
      )}
      {withLogo && (
        <Image src={"/logo.svg"} alt="Logo" width={104} height={27.54} />
      )}

      <div className="flex items-center gap-2">
        <Sheet open={isSheetOpen} onOpenChange={handleSheetOpen}>
          <SheetTrigger asChild>
            <div className="px-4 relative py-2 cursor-pointer">
              {totalUnreadCount > 0 && (
                <div className="absolute top-1 right-3 w-2 h-2 bg-red-600 rounded-full"></div>
              )}
              <Image
                src={"/icons/bell.svg"}
                alt="Bell"
                width={20}
                height={20}
              />
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="w-[419px] p-0">
            <div className="h-screen p-4 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-medium text-[#1A1A1A]">
                  Notifications
                </span>
                {totalUnreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    disabled={isMarkingAsRead}
                    className="text-xs"
                  >
                    {isMarkingAsRead ? "Marking..." : "Mark all read"}
                  </Button>
                )}
              </div>
              
              {/* Notifications List */}
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <NotificationSkeleton key={index} />
                  ))}
                </div>
              ) : allNotifications.length > 0 ? (
                <div className="space-y-3">
                  {allNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No notifications
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="w-[38px] h-[38px] rounded-full bg-[#FCCE37]"></div>
      </div>
    </nav>
  );
};

export default DashboardNav;