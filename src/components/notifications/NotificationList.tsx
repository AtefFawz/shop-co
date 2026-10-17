"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BellOff, CheckCircle2 } from "lucide-react";
import type { Notification } from "@/store/notificationStore";
// import type { FilterTab } from "./NotificationDropdown";
import { NotificationItem } from "./NotificationItem";
type FilterTab = "all" | "unread";
type NotificationListProps = {
  notifications: Notification[];
  activeTab?: FilterTab;
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
};

export default function NotificationList({
  notifications,
  activeTab = "all",
  onNotificationClick,
  onMarkAsRead,
}: NotificationListProps) {
  if (notifications.length === 0) {
    const isUnreadTab = activeTab === "unread";

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center px-6 py-12 text-center"
      >
        <div className="relative mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 text-neutral-700 shadow-2xs">
          {isUnreadTab ? (
            <CheckCircle2 size={24} className="text-emerald-500" />
          ) : (
            <BellOff size={22} className="text-neutral-400" />
          )}
        </div>

        <p className="text-xs font-black uppercase tracking-[0.14em] text-black sm:text-sm">
          {isUnreadTab ? "Zero Unread Alerts" : "No Notifications Yet"}
        </p>

        <p className="mt-1.5 max-w-[230px] text-xs leading-relaxed text-neutral-500">
          {isUnreadTab
            ? "You've reviewed all your recent updates and order statuses."
            : "Order updates, delivery telemetry, and exclusive drops will appear here."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-h-[60vh] overflow-y-auto overscroll-contain divide-y divide-neutral-100 sm:max-h-[380px] scrollbar-thin">
      <AnimatePresence initial={false}>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.15) }}
          >
            <NotificationItem
              notification={notification}
              onClick={() => onNotificationClick(notification)}
              onMarkAsRead={
                onMarkAsRead ? () => onMarkAsRead(notification._id) : undefined
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
