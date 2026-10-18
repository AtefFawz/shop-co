"use client";

import React, { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Clock,
  Check,
  Copy,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Notification } from "@/store/notificationStore";

type NotificationItemProps = {
  notification: Notification;
  onClick: () => void;
  onMarkAsRead?: () => void;
};

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

function getNotificationVisuals(title = "", message = "") {
  const text = `${title} ${message}`.toLowerCase();

  if (
    text.includes("deliver") ||
    text.includes("ship") ||
    text.includes("transit") ||
    text.includes("way")
  ) {
    return {
      Icon: Truck,
      category: "LOGISTICS",
      bg: "border-sky-500/25 bg-sky-500/10 text-sky-700",
    };
  }
  if (
    text.includes("complete") ||
    text.includes("success") ||
    text.includes("confirm")
  ) {
    return {
      Icon: CheckCircle2,
      category: "VERIFIED",
      bg: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700",
    };
  }
  if (
    text.includes("cancel") ||
    text.includes("fail") ||
    text.includes("alert")
  ) {
    return {
      Icon: AlertTriangle,
      category: "ALERT",
      bg: "border-rose-500/25 bg-rose-500/10 text-rose-600",
    };
  }
  if (
    text.includes("offer") ||
    text.includes("welcome") ||
    text.includes("promo") ||
    text.includes("drop")
  ) {
    return {
      Icon: Sparkles,
      category: "ATELIER DROP",
      bg: "border-amber-500/30 bg-amber-500/10 text-amber-700",
    };
  }

  return {
    Icon: Package,
    category: "ORDER",
    bg: "border-black bg-[#111111] text-white",
  };
}

export function NotificationItem({
  notification,
  onClick,
  onMarkAsRead,
}: NotificationItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  const isUnread = !notification.read;
  const { Icon, category, bg } = getNotificationVisuals(
    notification.title,
    notification.message,
  );

  const isLongMessage = (notification.message || "").length > 85;
  const shortOrderId = notification.order
    ? String(notification.order).slice(-6).toUpperCase()
    : "";

  const handleQuickRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead?.();
  };

  const handleCopyOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.order) return;
    navigator.clipboard?.writeText(String(notification.order));
    setCopiedOrder(true);
    toast.success(`Order #${shortOrderId} copied`);
    setTimeout(() => setCopiedOrder(false), 1800);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <div
      onClick={onClick}
      className={`group relative mx-2 my-1.5 flex cursor-pointer items-start gap-3.5 rounded-2xl border p-3.5 transition-all duration-300 ${
        isUnread
          ? "border-black/15 bg-white shadow-[0_8px_24px_-10px_rgba(0,0,0,0.08)] hover:border-black/30"
          : "border-transparent bg-white/65 opacity-85 hover:border-neutral-200 hover:bg-white hover:opacity-100"
      }`}
    >
      {/* Left Accent Pillar for Unread */}
      {isUnread && (
        <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[#111111]" />
      )}

      {/* 3D Extruded Dynamic Icon Box */}
      <div
        className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-2xs transition-transform duration-300 group-hover:rotate-3 group-hover:scale-108 ${bg}`}
      >
        <Icon size={18} strokeWidth={2.2} />
      </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {/* Category Tag + Timestamp */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[8.5px] font-black uppercase tracking-[0.18em] text-neutral-400">
            {category}
          </span>

          <div className="flex shrink-0 items-center gap-1.5">
            <span
              title={new Date(notification.createdAt).toLocaleString()}
              className="inline-flex items-center gap-1 font-mono text-[9.5px] font-semibold text-neutral-400"
            >
              <Clock size={9.5} />
              {formatRelativeTime(notification.createdAt)}
            </span>

            {isUnread && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.6)]" />
            )}
          </div>
        </div>

        {/* Title */}
        <h4
          className={`mt-0.5 truncate text-xs tracking-tight sm:text-[13px] ${
            isUnread
              ? "font-black text-[#111111]"
              : "font-bold text-neutral-700"
          }`}
        >
          {notification.title}
        </h4>

        {/* Message Body (Expandable if long) */}
        <p
          className={`mt-1 text-[11.5px] leading-relaxed ${
            expanded ? "" : "line-clamp-2"
          } ${isUnread ? "font-medium text-neutral-700" : "text-neutral-500"}`}
        >
          {notification.message}
        </p>

        {/* Bottom Actions Bar: Order Link, Copy ID, Expand, Mark Read */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {notification.order && (
              <>
                <span className="inline-flex items-center gap-1 rounded-lg border border-neutral-200/90 bg-[#F8F8F8] px-2 py-0.5 font-mono text-[9.5px] font-black uppercase tracking-wider text-[#111111] transition-colors group-hover:border-black group-hover:bg-[#111111] group-hover:text-white">
                  <span>Order #{shortOrderId}</span>
                  <ArrowUpRight size={10} />
                </span>

                <button
                  type="button"
                  onClick={handleCopyOrder}
                  title="Copy Order ID"
                  className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 transition hover:border-black hover:text-black"
                >
                  {copiedOrder ? (
                    <Check size={10} className="text-emerald-500" />
                  ) : (
                    <Copy size={9.5} />
                  )}
                </button>
              </>
            )}

            {isLongMessage && (
              <button
                type="button"
                onClick={handleToggleExpand}
                className="inline-flex cursor-pointer items-center gap-0.5 text-[9.5px] font-black uppercase tracking-wider text-neutral-400 hover:text-black"
              >
                <span>{expanded ? "Less" : "More"}</span>
                <ChevronDown
                  size={11}
                  className={`transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {isUnread && onMarkAsRead && (
            <button
              type="button"
              onClick={handleQuickRead}
              title="Mark as read"
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#F4F3F4] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-neutral-600 transition hover:bg-[#111111] hover:text-white"
            >
              <Check size={10} strokeWidth={2.5} />
              <span>Mark Read</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
