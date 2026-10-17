"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import type { Notification } from "@/store/notificationStore";
import { useNotifications } from "@/hooks/useNotifications";

import NotificationHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";
import NotificationFooter from "./NotificationFooter";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

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

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification._id);
    }

    setOpen(false);

    if (notification.order) {
      router.push(`/shop/orders/${notification.order}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative z-50">
      {/* ── زر الجرس التفاعلي ── */}
      <motion.button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((prev) => !prev)}
        className={`relative flex h-9 w-9 lg:h-10 lg:w-10 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 outline-none ${
          open
            ? "border-black bg-black text-white shadow-[0_6px_20px_rgba(0,0,0,0.18)]"
            : "border-neutral-200/80 bg-neutral-100/90 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-200/70 hover:text-black"
        }`}
      >
        <motion.div
          animate={
            unreadCount > 0 && !open
              ? { rotate: [0, -14, 14, -10, 10, 0] }
              : { rotate: 0 }
          }
          transition={{
            duration: 0.6,
            repeat: unreadCount > 0 && !open ? Infinity : 0,
            repeatDelay: 4,
          }}
        >
          <Bell size={18} strokeWidth={2.2} />
        </motion.div>

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              className="absolute -top-1 -right-1 z-10 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[9.5px] font-black leading-none text-white shadow-[0_2px_8px_rgba(239,68,68,0.5)] ring-2 ring-white sm:h-5 sm:min-w-5 sm:text-[10px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── نافذة الإشعارات المنسدلة ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-15 z-40 bg-black/20 backdrop-blur-[2px] sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="fixed inset-x-3 top-16 z-50 mx-auto flex w-auto max-w-[410px] flex-col overflow-hidden rounded-[24px] border border-neutral-200/90 bg-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.22)] ring-1 ring-black/[0.04] sm:absolute sm:inset-x-auto sm:top-13 sm:right-0 sm:mx-0 sm:w-[400px]"
            >
              <NotificationHeader
                unreadCount={unreadCount}
                totalCount={notifications.length}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClose={() => setOpen(false)}
              />

              <NotificationList
                notifications={filteredNotifications}
                activeTab={activeTab}
                onNotificationClick={handleNotificationClick}
                onMarkAsRead={handleMarkAsRead}
              />

              <NotificationFooter
                hasMore={page < totalPages}
                loading={loading}
                currentPage={page}
                totalPages={totalPages}
                onLoadMore={loadMore}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
