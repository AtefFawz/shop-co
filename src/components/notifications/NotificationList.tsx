"use client";

import { Bell } from "lucide-react";
import type { Notification } from "@/store/notificationStore";
import { NotificationItem } from "./NotificationItem";
type NotificationListProps = {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
};
//
export default function NotificationList({
  notifications,
  onNotificationClick,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center
          px-5 py-10 sm:py-12"
      >
        <div
          className="flex items-center justify-center
            w-12 h-12 mb-3 rounded-full bg-gray-100 sm:w-14 sm:h-14"
        >
          <Bell size={21} className="m:w-6 sm:h-6  " />
        </div>

        <p className="text-sm text-gray-900 font-semibold sm:text-base">
          No notifications
        </p>

        <p
          className="
            max-w-62.5
            mt-1
            text-xs text-gray-500
            text-center
            sm:text-sm
"
        >
          We'll let you know when something happens.
        </p>
      </div>
    );
  }

  return (
    <div
      className=" overflow-y-auto
        max-h-[65vh] sm:max-h-105"
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onClick={() => onNotificationClick(notification)}
        />
      ))}
    </div>
  );
}
