"use client";

import { motion } from "framer-motion";
import { CheckCheck, Sparkles, X } from "lucide-react";

type FilterTab = "all" | "unread";

type NotificationHeaderProps = {
  unreadCount: number;
  totalCount?: number;
  activeTab?: FilterTab;
  onTabChange?: (tab: FilterTab) => void;
  onMarkAllAsRead: () => void;
  onClose?: () => void;
};

export default function NotificationHeader({
  unreadCount,
  totalCount = 0,
  activeTab = "all",
  onTabChange,
  onMarkAllAsRead,
  onClose,
}: NotificationHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-neutral-200/80 bg-[#080808] px-4 pt-4 pb-3.5 text-white sm:px-5">
      {/* شبكة معمارية خفيفة في خلفية الهيدر */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white sm:text-[15px]">
            Inbox
          </h3>
          <span className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-neutral-300">
            <Sparkles size={9} className="text-amber-400" />
            {unreadCount > 0 ? `${unreadCount} New` : "Synced"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="group inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-200 transition hover:border-white/30 hover:bg-white hover:text-black active:scale-95"
            >
              <CheckCheck size={12} />
              <span>Mark all read</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/10 text-neutral-400 transition hover:bg-white/20 hover:text-white sm:hidden"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {onTabChange && (
        <div className="relative z-10 mt-3.5 flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.05] p-1">
          {(["all", "unread"] as const).map((tab) => {
            const isSelected = activeTab === tab;
            const count = tab === "all" ? totalCount : unreadCount;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`relative flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-[10.5px] font-black uppercase tracking-[0.12em] transition-colors ${
                  isSelected
                    ? "text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="notificationFilterTab"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    className="absolute inset-0 rounded-lg bg-white shadow-xs"
                  />
                )}
                <span className="relative z-10">{tab}</span>
                <span
                  className={`relative z-10 rounded-full px-1.5 py-0.2 font-mono text-[9px] ${
                    isSelected
                      ? "bg-black/10 text-black"
                      : "bg-white/10 text-neutral-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
