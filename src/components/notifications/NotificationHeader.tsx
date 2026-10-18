"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCheck,
  Sparkles,
  X,
  Search,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { FilterTab } from "./NotificationDropdown";

type NotificationHeaderProps = {
  unreadCount: number;
  totalCount?: number;
  activeTab?: FilterTab;
  onTabChange?: (tab: FilterTab) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onMarkAllAsRead: () => void;
  onClose?: () => void;
};

export default function NotificationHeader({
  unreadCount,
  totalCount = 0,
  activeTab = "all",
  onTabChange,
  searchQuery = "",
  onSearchChange,
  onMarkAllAsRead,
  onClose,
}: NotificationHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shopco_notif_sound");
      if (saved === "muted") setSoundEnabled(false);
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem("shopco_notif_sound", next ? "on" : "muted");
    } catch {
      // ignore
    }
  };

  // Calculate Inbox Read Readiness Percentage
  const readCount = Math.max(0, totalCount - unreadCount);
  const readPercentage =
    totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 100;

  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-[#111111] px-4 pt-4 pb-3.5 text-white sm:px-5">
      {/* Subtle Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient Top Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl"
      />

      {/* ── Top Row: Title + Quick Controls ── */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                unreadCount > 0 ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                unreadCount > 0 ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
          </span>

          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white sm:text-[15px]">
            Atelier Inbox
          </h3>

          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-200">
            <Sparkles size={9} className="text-amber-400" />
            {unreadCount > 0 ? `${unreadCount} New` : "Inbox Zero"}
          </span>
        </div>

        {/* Right Controls: Search Toggle, Sound Toggle, Mark All Read, Close */}
        <div className="flex items-center gap-1.5">
          {onSearchChange && (
            <button
              type="button"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                if (searchOpen) onSearchChange("");
              }}
              title="Search notifications"
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border transition-all ${
                searchOpen || searchQuery
                  ? "border-white bg-white text-black"
                  : "border-white/15 bg-white/[0.06] text-neutral-300 hover:bg-white/15 hover:text-white"
              }`}
            >
              <Search size={12} />
            </button>
          )}

          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? "Mute alert chime" : "Enable alert chime"}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-neutral-300 transition hover:bg-white/15 hover:text-white"
          >
            {soundEnabled ? (
              <Volume2 size={12} className="text-emerald-400" />
            ) : (
              <VolumeX size={12} className="text-neutral-500" />
            )}
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="group inline-flex cursor-pointer items-center gap-1 rounded-xl border border-white/15 bg-white/[0.08] px-2.5 py-1 text-[9.5px] font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black active:scale-95"
            >
              <CheckCheck size={12} />
              <span className="hidden xs:inline">Read All</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-neutral-400 transition hover:bg-white/20 hover:text-white sm:hidden"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Collapsible Instant Search Input ── */}
      <AnimatePresence initial={false}>
        {searchOpen && onSearchChange && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 overflow-hidden"
          >
            <div className="relative mt-3 flex items-center">
              <Search
                size={13}
                className="pointer-events-none absolute left-3 text-neutral-400"
              />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Filter by order #ID, keyword, or status..."
                className="w-full rounded-xl border border-white/15 bg-white/10 py-2 pl-8 pr-8 text-xs font-semibold text-white placeholder:text-neutral-400 focus:border-white/40 focus:bg-white/15 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 text-neutral-400 hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filter Tabs (All / Unread / Orders) ── */}
      {onTabChange && (
        <div className="relative z-10 mt-3.5 flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.06] p-1">
          {(
            [
              { id: "all", label: "All", badge: totalCount },
              { id: "unread", label: "Unread", badge: unreadCount },
              { id: "orders", label: "Orders", badge: null },
            ] as const
          ).map((tab) => {
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl py-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition-colors ${
                  isSelected
                    ? "text-[#111111]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="notificationFilterTab"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-white shadow-xs"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {tab.badge !== null && (
                  <span
                    className={`relative z-10 rounded-full px-1.5 py-0.2 font-mono text-[9px] font-black ${
                      isSelected
                        ? "bg-black/10 text-black"
                        : "bg-white/10 text-neutral-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Micro Inbox Readiness Progress Laser Bar ── */}
      {totalCount > 0 && (
        <div className="relative z-10 mt-3 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              style={{ width: `${readPercentage}%` }}
              className="h-full rounded-full bg-linear-to-r from-white/60 via-white to-emerald-400 transition-all duration-500"
            />
          </div>
          <span className="font-mono text-[8.5px] font-bold uppercase tracking-widest text-white/50">
            {readPercentage}% Read
          </span>
        </div>
      )}
    </div>
  );
}
