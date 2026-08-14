"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Notification } from "@/store/notificationStore";

import { useNotifications } from "@/hooks/useNotifications";

import NotificationHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";
import NotificationFooter from "./NotificationFooter";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    page,
    totalPages,
    loading,
    loadMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications();

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification._id);
    }

    setOpen(false);

    if (notification.order) {
      router.push(`/shopping/orders/${notification.order}`);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-100">
      {/* Button */}
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="
          relative
          flex
          h-9
          w-9
          cursor-pointer
          items-center
          justify-center
          rounded-full
          bg-gray-100
          transition-all
          duration-300
          hover:bg-gray-200
          sm:h-10
          sm:w-10
        "
      >
        <Bell size={19} className="text-gray-700 sm:h-5.25 sm:w-5.25" />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              z-10
              flex
              h-4.5
              min-w-4.5
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[9px]
              font-extrabold
              leading-none
              text-white
              shadow-sm
              sm:h-5
              sm:min-w-5
              sm:text-[10px]
            "
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            fixed
            left-1/2
            top-23
            z-200
            w-[calc(100vw-24px)]
            max-w-95
            -translate-x-1/2
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-2xl

            sm:absolute
            sm:left-auto
            sm:right-0
            sm:top-20
            sm:w-95
            sm:translate-x-0
          "
        >
          <NotificationHeader
            unreadCount={unreadCount}
            onMarkAllAsRead={handleMarkAllAsRead}
          />

          <NotificationList
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
          />

          <NotificationFooter
            hasMore={page < totalPages}
            loading={loading}
            onLoadMore={loadMore}
          />
        </div>
      )}
    </div>
  );
}
