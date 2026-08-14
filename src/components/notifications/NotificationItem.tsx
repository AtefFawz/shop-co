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
        cursor-pointer
        border-b
        border-gray-100
        px-4
        py-3.5
        transition
        hover:bg-gray-50

        sm:gap-3
        sm:px-5
        sm:py-4

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
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-black
          text-sm
          text-white
          sm:h-10
          sm:w-10
        "
      >
        📦
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4
            className="
              min-w-0
              truncate
              text-xs
              font-semibold
              text-gray-900
              sm:text-sm
            "
          >
            {notification.title}
          </h4>

          {!notification.read && (
            <span
              className="
                mt-1
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-red-500
                sm:h-2
                sm:w-2
              "
            />
          )}
        </div>

        <p
          className="
            mt-1
            line-clamp-2
            text-[11px]
            leading-4
            text-gray-600
            sm:text-sm
            sm:leading-5
          "
        >
          {notification.message}
        </p>

        <p
          className="
            mt-1.5
            text-[10px]
            text-gray-400
            sm:mt-2
            sm:text-xs
          "
        >
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
