"use client";

import type { Notification } from "@/store/notificationStore";

type NotificationItemProps = {
  notification: Notification;
  onClick: () => void;
};

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex
        gap-2.5
        px-4 py-3.5
        border-b border-gray-100
        hover:bg-gray-50
        cursor-pointer transition
        sm:gap-3 sm:px-5 sm:py-4
        ${
        !notification.read
        ? "border-l-4 border-l-black bg-gray-50"
        : "bg-white"
        }
      `}
    >
      {/* Icon */}
      <div
        className="
          flex shrink-0
          items-center justify-center
          w-9 h-9
          rounded-full
          text-sm text-white
          bg-black
          sm:w-10 sm:h-10
        "
      >
        📦
      </div>

      {/* Content */}
      <div
        className="
          flex-1
          min-w-0
        "
      >
        <div
          className="
            flex
            items-start justify-between
            gap-2
          "
        >
          <h4
            className="
              min-w-0
              text-xs text-gray-900 font-semibold
              truncate
              sm:text-sm
            "
          >
            {notification.title}
          </h4>

          {!notification.read && (
            <span
              className="
                shrink-0
                w-1.5 h-1.5
                mt-1
                rounded-full
                bg-red-500
                sm:w-2 sm:h-2
              "
            />
          )}
        </div>

        <p
          className="
            mt-1
            text-[11px] text-gray-600 leading-4
            line-clamp-2
            sm:text-sm sm:leading-5
          "
        >
          {notification.message}
        </p>

        <p
          className="
            mt-1.5
            text-[10px] text-gray-400
            sm:mt-2 sm:text-xs
          "
        >
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
