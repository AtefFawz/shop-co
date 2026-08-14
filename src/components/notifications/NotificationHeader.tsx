"use client";

type NotificationHeaderProps = {
  unreadCount: number;
  onMarkAllAsRead: () => void;
};

export default function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
}: NotificationHeaderProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        border-b
        border-gray-100
        px-4
        py-3.5
        sm:px-5
        sm:py-4
      "
    >
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">
          Notifications
        </h3>

        <p className="mt-0.5 text-[11px] text-gray-500 sm:mt-1 sm:text-xs">
          {unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
            : "You're all caught up"}
        </p>
      </div>

      {unreadCount > 0 && (
        <button
          type="button"
          onClick={onMarkAllAsRead}
          className="
            shrink-0
            text-[10px]
            font-semibold
            text-black
            hover:underline
            sm:text-xs
          "
        >
          Mark all as read
        </button>
      )}
    </div>
  );
}
