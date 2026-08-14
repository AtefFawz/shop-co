"use client";

import { Bell } from "lucide-react";
import type { Notification } from "@/store/notificationStore";
import { NotificationItem } from "./NotificationItem";
type NotificationListProps = {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
};

export default function NotificationList({
  notifications,
  onNotificationClick,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          px-5
          py-10
          sm:py-12
        "
      >
        <div
          className="
            mb-3
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-gray-100
            sm:h-14
            sm:w-14
          "
        >
          <Bell size={21} className="sm:h-6 sm:w-6" />
        </div>

        <p className="text-sm font-semibold text-gray-900 sm:text-base">
          No notifications
        </p>

        <p
          className="
            mt-1
            max-w-[250px]
            text-center
            text-xs
            text-gray-500
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
      className="
        max-h-[65vh]
        overflow-y-auto
        sm:max-h-[420px]
      "
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
