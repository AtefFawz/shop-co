"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellOff, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import type { Notification } from "@/store/notificationStore";
import type { FilterTab } from "./NotificationDropdown";
import { NotificationItem } from "./NotificationItem";

type NotificationListProps = {
  notifications: Notification[];
  activeTab?: FilterTab;
  loading?: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
};

export default function NotificationList({
  notifications,
  activeTab = "all",
  loading = false,
  searchQuery = "",
  onClearSearch,
  onNotificationClick,
  onMarkAsRead,
}: NotificationListProps) {
  // Group notifications into "Today" and "Earlier Archive"
  const grouped = useMemo(() => {
    const today: Notification[] = [];
    const earlier: Notification[] = [];
    const now = new Date();

    notifications.forEach((n) => {
      const d = new Date(n.createdAt);
      const isSameDay =
        !isNaN(d.getTime()) &&
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();

      if (isSameDay) today.push(n);
      else earlier.push(n);
    });

    return { today, earlier };
  }, [notifications]);

  // Initial Loading Shimmer Skeleton
  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex animate-pulse items-start gap-3.5 rounded-2xl bg-white p-4"
          >
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-neutral-200" />
              <div className="h-3.5 w-3/4 rounded bg-neutral-200" />
              <div className="h-2.5 w-full rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (notifications.length === 0) {
    const isUnreadTab = activeTab === "unread";
    const hasSearch = Boolean(searchQuery.trim());

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center bg-white/60 px-6 py-14 text-center"
      >
        <div className="relative mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-[#111111] shadow-2xs">
          {isUnreadTab && !hasSearch ? (
            <CheckCircle2 size={24} className="text-emerald-500" />
          ) : (
            <BellOff size={22} className="text-neutral-400" />
          )}
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#111111] sm:text-sm">
          {hasSearch
            ? "No Matching Alerts"
            : isUnreadTab
              ? "Inbox Zero Achieved"
              : "No Notifications Yet"}
        </p>

        <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed text-neutral-500">
          {hasSearch
            ? `No alerts matched "${searchQuery}".`
            : isUnreadTab
              ? "You're all caught up on your recent order dispatches and updates."
              : "Live order telemetry, courier dispatches, and limited drops will appear here."}
        </p>

        {hasSearch && onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#111111] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-neutral-800"
          >
            <RotateCcw size={11} />
            <span>Clear Search</span>
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="max-h-[62vh] overflow-y-auto overscroll-contain py-1.5 sm:max-h-[390px]">
      <AnimatePresence initial={false}>
        {/* TODAY GROUP */}
        {grouped.today.length > 0 && (
          <div key="group-today" className="mb-2">
            <div className="sticky top-0 z-20 flex items-center justify-between bg-[#F4F3F4]/95 px-4 py-1.5 backdrop-blur-md">
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">
                <Sparkles size={10} className="text-[#111111]" />
                Today&apos;s Telemetry
              </span>
              <span className="font-mono text-[9px] font-bold text-neutral-400">
                {grouped.today.length}
              </span>
            </div>

            {grouped.today.map((notification) => (
              <motion.div
                key={notification._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <NotificationItem
                  notification={notification}
                  onClick={() => onNotificationClick(notification)}
                  onMarkAsRead={
                    onMarkAsRead
                      ? () => onMarkAsRead(notification._id)
                      : undefined
                  }
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* EARLIER ARCHIVE GROUP */}
        {grouped.earlier.length > 0 && (
          <div key="group-earlier">
            <div className="sticky top-0 z-20 flex items-center justify-between bg-[#F4F3F4]/95 px-4 py-1.5 backdrop-blur-md">
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">
                Earlier Archive
              </span>
              <span className="font-mono text-[9px] font-bold text-neutral-400">
                {grouped.earlier.length}
              </span>
            </div>

            {grouped.earlier.map((notification) => (
              <motion.div
                key={notification._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <NotificationItem
                  notification={notification}
                  onClick={() => onNotificationClick(notification)}
                  onMarkAsRead={
                    onMarkAsRead
                      ? () => onMarkAsRead(notification._id)
                      : undefined
                  }
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
