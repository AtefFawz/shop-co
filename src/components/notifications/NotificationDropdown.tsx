"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import type { Notification } from "@/store/notificationStore";
import { useNotifications } from "@/hooks/useNotifications";

import NotificationHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";
import NotificationFooter from "./NotificationFooter";

export type FilterTab = "all" | "unread" | "orders";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter by tab + search query
  const filteredNotifications = useMemo(() => {
    let list = [...notifications];

    if (activeTab === "unread") {
      list = list.filter((n) => !n.read);
    } else if (activeTab === "orders") {
      list = list.filter((n) => Boolean(n.order));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          (n.title || "").toLowerCase().includes(q) ||
          (n.message || "").toLowerCase().includes(q) ||
          String(n.order || "")
            .toLowerCase()
            .includes(q),
      );
    }

    return list;
  }, [notifications, activeTab, searchQuery]);

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
      {/* ================================================================== */}
      {/* 1. 3D BELL TRIGGER BUTTON                                          */}
      {/* ================================================================== */}
      <motion.button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        whileHover={{ y: -1.5 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((prev) => !prev)}
        className={`group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border transition-all duration-300 outline-none ${
          open
            ? "border-[#111111] bg-[#111111] text-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.4)]"
            : "border-neutral-200/90 bg-white text-neutral-800 shadow-2xs hover:border-black hover:bg-[#F8F8F8] hover:text-black"
        }`}
      >
        {/* Ambient Ping Halo when Unread */}
        {unreadCount > 0 && !open && (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-2xl bg-rose-500/15 duration-1000" />
        )}

        <motion.div
          animate={
            unreadCount > 0 && !open
              ? { rotate: [0, -14, 14, -10, 10, 0] }
              : { rotate: 0 }
          }
          transition={{
            duration: 0.65,
            repeat: unreadCount > 0 && !open ? Infinity : 0,
            repeatDelay: 4.5,
          }}
        >
          <Bell
            size={18}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </motion.div>

        {/* Unread Counter Pill */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              className="absolute -right-1.5 -top-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 font-mono text-[9.5px] font-black leading-none text-white shadow-[0_4px_12px_rgba(225,29,72,0.55)] ring-2 ring-white"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ================================================================== */}
      {/* 2. 3D FLOATING INBOX POPOVER                                       */}
      {/* ================================================================== */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black/35 backdrop-blur-xs sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.96, rotateX: -6 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 10, scale: 0.96, rotateX: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              style={{ transformOrigin: "top right", perspective: "1200px" }}
              className="fixed inset-x-3 top-16 z-50 mx-auto flex w-auto max-w-[430px] flex-col overflow-hidden rounded-[2rem] border border-white/90 bg-[#F4F3F4] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.28)] ring-1 ring-black/[0.06] sm:absolute sm:inset-x-auto sm:right-0 sm:top-13 sm:mx-0 sm:w-[420px]"
            >
              <NotificationHeader
                unreadCount={unreadCount}
                totalCount={notifications.length}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClose={() => setOpen(false)}
              />

              <NotificationList
                notifications={filteredNotifications}
                activeTab={activeTab}
                loading={loading && notifications.length === 0}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery("")}
                onNotificationClick={handleNotificationClick}
                onMarkAsRead={handleMarkAsRead}
              />

              <NotificationFooter
                hasMore={page < totalPages}
                loading={loading}
                currentPage={page}
                totalPages={totalPages}
                totalCount={notifications.length}
                onLoadMore={loadMore}
                onClose={() => setOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
