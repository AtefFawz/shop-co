"use client";

import React from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Clock,
  Check,
} from "lucide-react";
import type { Notification } from "@/store/notificationStore";

type NotificationItemProps = {
  notification: Notification;
  onClick: () => void;
  onMarkAsRead?: () => void;
};

// دالة ذكية لحساب الوقت النسبي بشكل أنيق
function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// دالة لاختيار الأيقونة المناسبة تلقائياً حسب محتوى الإشعار
function getNotificationVisuals(title = "", message = "") {
  const text = `${title} ${message}`.toLowerCase();

  if (
    text.includes("deliver") ||
    text.includes("ship") ||
    text.includes("way")
  ) {
    return {
      Icon: Truck,
      bg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    };
  }
  if (
    text.includes("complete") ||
    text.includes("success") ||
    text.includes("confirm")
  ) {
    return {
      Icon: CheckCircle2,
      bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    };
  }
  if (
    text.includes("cancel") ||
    text.includes("fail") ||
    text.includes("alert")
  ) {
    return {
      Icon: AlertTriangle,
      bg: "bg-red-500/10 text-red-600 border-red-500/20",
    };
  }
  if (
    text.includes("offer") ||
    text.includes("welcome") ||
    text.includes("promo")
  ) {
    return {
      Icon: Sparkles,
      bg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    };
  }

  return {
    Icon: Package,
    bg: "bg-neutral-900 text-white border-black",
  };
}

export function NotificationItem({
  notification,
  onClick,
  onMarkAsRead,
}: NotificationItemProps) {
  const isUnread = !notification.read;
  const { Icon, bg } = getNotificationVisuals(
    notification.title,
    notification.message,
  );

  const handleQuickRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead?.();
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex cursor-pointer items-start gap-3.5 px-4 py-3.5 transition-all duration-200 sm:px-5 sm:py-4 ${
        isUnread
          ? "bg-neutral-50/90 hover:bg-neutral-100/80"
          : "bg-white hover:bg-neutral-50/60"
      }`}
    >
      {/* شريط جانبي بارز للإشعار غير المقروء */}
      {isUnread && (
        <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-black" />
      )}

      {/* الأيقونة الديناميكية */}
      <div
        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-2xs transition-transform duration-200 group-hover:scale-105 ${bg}`}
      >
        <Icon size={17} strokeWidth={2.2} />
      </div>

      {/* المحتوى والتفاصيل */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`truncate text-xs tracking-tight sm:text-[13.5px] ${
              isUnread ? "font-black text-black" : "font-bold text-neutral-700"
            }`}
          >
            {notification.title}
          </h4>

          <div className="flex shrink-0 items-center gap-1.5">
            <span
              title={new Date(notification.createdAt).toLocaleString()}
              className="inline-flex items-center gap-1 font-mono text-[10px] font-medium text-neutral-400"
            >
              <Clock size={10} />
              {formatRelativeTime(notification.createdAt)}
            </span>

            {isUnread && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            )}
          </div>
        </div>

        <p
          className={`mt-1 line-clamp-2 text-[11.5px] leading-relaxed sm:text-xs ${
            isUnread ? "font-medium text-neutral-700" : "text-neutral-500"
          }`}
        >
          {notification.message}
        </p>

        {/* شريط سفلي صغير: رقم الطلب + زر تعليم كمقروء السريع */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          {notification.order ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200/90 bg-white px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-black shadow-2xs transition-colors group-hover:border-black group-hover:bg-black group-hover:text-white">
              <span>Order #{String(notification.order).slice(-6)}</span>
              <ArrowUpRight size={10} />
            </span>
          ) : (
            <span />
          )}

          {isUnread && onMarkAsRead && (
            <button
              type="button"
              onClick={handleQuickRead}
              title="Mark as read"
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-neutral-400 opacity-100 transition hover:bg-neutral-200/70 hover:text-black sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Check size={11} />
              <span>Mark read</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
