"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useGetProjectById } from "@/hooks/useProjects";
import { useGetBusinessById } from "@/hooks/useBusiness";
import { useGetExpertById } from "@/hooks/useExpert";
import { useGetAdminById } from "@/hooks/useAuth";
import { useNotifications, useNotificationActions } from "@/hooks/useNotification";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCallback, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

// Notification Item Component
interface Notification {
  id: string;
  content: string;
  link: string;
  read: boolean;
  createdAt: string;
}

interface NotificationDetailModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationDetailModal = ({ 
  notification, 
  isOpen, 
  onClose, 
  onMarkAsRead 
}: NotificationDetailModalProps) => {
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOpen = useCallback(() => {
    if (notification && !notification.read) {
      onMarkAsRead(notification.id);
    }
  }, [notification, onMarkAsRead]);

  if (!notification) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Notification Details
          </Dialog.Title>
          
          <Dialog.Description className="sr-only">
            Details for notification: {notification.content}
          </Dialog.Description>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Content</label>
              <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                {notification.content}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Received</label>
              <p className="text-sm mt-1">{formatTimeAgo(notification.createdAt)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <p className="text-sm mt-1">
                <Badge variant={notification.read ? "outline" : "default"} className="ml-2">
                  {notification.read ? "Read" : "Unread"}
                </Badge>
              </p>
            </div>

            {notification.link && (
              <Button 
                onClick={() => {
                  window.open(notification.link, '_blank');
                }}
                variant="outline"
                className="w-full"
              >
                Open Related Link
              </Button>
            )}
            
            <div className="flex justify-end pt-4">
              <Dialog.Close asChild>
                <Button variant="default">Close</Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const NotificationItem = ({ 
  notification, 
  onViewDetails 
}: { 
  notification: Notification;
  onViewDetails: (notification: Notification) => void;
}) => {
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={`border-l-4 pl-3 py-3 transition-all duration-200 ${
      notification.read 
        ? "border-gray-300 bg-white" 
        : "border-primary bg-blue-50/30"
    }`}>
      <div className="flex items-start justify-between mb-1">
        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
          {notification.content.split(' - ')[0] || 'Notification'}
        </p>
        {!notification.read && (
          <Badge variant="default" className="bg-primary hover:bg-primary/90 h-2 w-2 p-0 rounded-full" />
        )}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
        {notification.content.split(' - ')[1] || notification.content}
      </p>
      
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {formatTimeAgo(notification.createdAt)}
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(notification)}
          className="h-6 text-xs px-2 py-1"
        >
          View
        </Button>
      </div>
    </div>
  );
};

// Notification Skeleton Loader
const NotificationSkeleton = () => (
  <div className="border-l-4 border-gray-200 pl-3 py-3">
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-3 w-full mb-1" />
    <Skeleton className="h-2 w-1/4" />
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
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { notifications, unreadCount, isLoading } = useNotifications();
  const { markAsRead, markAllAsRead, isMarkingAsRead } = useNotificationActions();

  const handleViewDetails = useCallback((notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
    
    // Mark as read when viewing details
    if (!notification.read) {
      markAsRead(notification.id);
    }
  }, [markAsRead]);

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedNotification(null);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const handleMarkAsRead = useCallback((notificationId: string) => {
    markAsRead(notificationId);
  }, [markAsRead]);

  const handleBellHover = useCallback(() => {
    // Prefetch or cache warming could go here
  }, []);

  return (
    <>
      <nav className="w-full bg-white flex items-center justify-between py-2 px-4 xl:pr-14">
        {!withLogo && (
          <div className="text-[#0E1426] text-lg font-medium">
            {displayText}
          </div>
        )}
        {withLogo && (
          <Image src={"/logo.svg"} alt="Logo" width={104} height={27.54} />
        )}

        <div className="flex items-center gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative p-2 hover:bg-gray-100 transition-colors"
                onMouseEnter={handleBellHover}
              >
                <Image
                  src={"/icons/bell.svg"}
                  alt="Notifications"
                  width={20}
                  height={20}
                  className="opacity-80"
                />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs min-w-0 rounded-full"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[419px] p-0">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-gray-900">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
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
                  {unreadCount > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <NotificationSkeleton key={index} />
                      ))}
                    </div>
                  ) : notifications.length > 0 ? (
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <Image
                        src="/icons/bell.svg"
                        alt="No notifications"
                        width={48}
                        height={48}
                        className="opacity-30 mb-3"
                      />
                      <p className="text-muted-foreground font-medium">
                        No notifications yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        We`ll notify you when something arrives
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="w-[38px] h-[38px] rounded-full bg-[#FCCE37]"></div>
        </div>
      </nav>

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onMarkAsRead={handleMarkAsRead}
      />
    </>
  );
};

export default DashboardNav;