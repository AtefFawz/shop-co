"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCheck,
  Sparkles,
  X,
  Search,
  Volume2,
  VolumeX,
} from "lucide-react";

import type { FilterTab } from "./NotificationDropdown";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type NotificationHeaderProps = {
  unreadCount: number;
  totalCount?: number;
  activeTab?: FilterTab;
  onTabChange?: (tab: FilterTab) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMarkAllAsRead: () => void;
  onClose?: () => void;
};

const soundStorageKey = "shopco_notif_sound";

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
  const { locale, t } = useLocale();
  const [searchOpen, setSearchOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      setSoundEnabled(localStorage.getItem(soundStorageKey) !== "muted");
    } catch {
      setSoundEnabled(true);
    }
  }, []);

  const toggleSound = () => {
    const nextValue = !soundEnabled;

    setSoundEnabled(nextValue);

    try {
      localStorage.setItem(soundStorageKey, nextValue ? "on" : "muted");
    } catch {
      // Sound preference remains usable for the current session.
    }
  };

  const toggleSearch = () => {
    if (searchOpen) onSearchChange?.("");
    setSearchOpen((current) => !current);
  };

  const readCount = Math.max(0, totalCount - unreadCount);
  const readPercentage =
    totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 100;

  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all", label: t("notifTabAll"), count: totalCount },
    { id: "unread", label: t("notifTabUnread"), count: unreadCount },
    { id: "orders", label: t("notifTabOrders") },
  ];

  return (
    <header className="relative shrink-0 overflow-hidden border-b border-neutral-200 bg-white px-4 pb-3.5 pt-4! text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 sm:px-5">
      {/* Subtle decorative grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`relative flex h-2.5 w-2.5 shrink-0 rounded-full ${
              unreadCount > 0
                ? "bg-amber-500 dark:bg-amber-400"
                : "bg-emerald-600 dark:bg-emerald-400"
            }`}
          >
            {unreadCount > 0 && !reduceMotion && (
              <span className="absolute inset-0 animate-ping rounded-full bg-amber-500/40 dark:bg-amber-400/40" />
            )}
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-xs font-extrabold tracking-wide text-neutral-900 dark:text-neutral-100 sm:text-sm">
              {t("notifTitle")}
            </h3>

            <p className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
              {unreadCount > 0
                ? `${new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(unreadCount)} ${t("notifUnreadLabel")}`
                : t("notifCaughtUp")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {onSearchChange && (
            <button
              type="button"
              aria-label={searchOpen ? t("navCloseSearch") : t("notifSearchAction")}
              aria-expanded={searchOpen}
              onClick={toggleSearch}
              className={`
                flex h-8 w-8 cursor-pointer items-center justify-center
                rounded-xl border transition-colors
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-neutral-900
                dark:focus-visible:ring-neutral-200
                ${
                  searchOpen || searchQuery
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-200 dark:bg-neutral-100 dark:text-neutral-950"
                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }
              `}
            >
              <Search size={14} />
            </button>
          )}

          <button
            type="button"
            aria-label={
              soundEnabled
                ? t("notifMuteSound")
                : t("notifEnableSound")
            }
            aria-pressed={soundEnabled}
            onClick={toggleSound}
            className="
              flex h-8 w-8 cursor-pointer items-center justify-center
              rounded-xl border border-neutral-200 bg-neutral-50
              text-neutral-600 transition-colors hover:bg-neutral-100
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-neutral-900
              dark:border-neutral-700 dark:bg-neutral-800
              dark:text-neutral-300 dark:hover:bg-neutral-700
              dark:focus-visible:ring-neutral-200
            "
          >
            {soundEnabled ? (
              <Volume2
                size={14}
                className="text-emerald-600 dark:text-emerald-400"
              />
            ) : (
              <VolumeX
                size={14}
                className="text-neutral-500 dark:text-neutral-400"
              />
            )}
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="
                inline-flex min-h-8 cursor-pointer items-center gap-1.5
                rounded-xl border border-neutral-200 bg-neutral-50
                px-2 text-[9px] font-bold uppercase tracking-wide
                text-neutral-700 transition-colors hover:bg-neutral-100
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-neutral-900
                dark:border-neutral-700 dark:bg-neutral-800
                dark:text-neutral-200 dark:hover:bg-neutral-700
                dark:focus-visible:ring-neutral-200
              "
            >
              <CheckCheck size={13} />
              <span className="hidden sm:inline">{t("notifReadAll")}</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t("notifClose")}
              className="
                flex h-8 w-8 cursor-pointer items-center justify-center
                rounded-xl border border-neutral-200 bg-neutral-50
                text-neutral-600 transition-colors hover:bg-neutral-100
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-neutral-900
                dark:border-neutral-700 dark:bg-neutral-800
                dark:text-neutral-300 dark:hover:bg-neutral-700
                dark:focus-visible:ring-neutral-200
                sm:hidden
              "
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Expandable search */}
      <AnimatePresence initial={false}>
        {searchOpen && onSearchChange && (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="relative z-10 overflow-hidden"
          >
            <div className="relative mt-3">
              <Search
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={t("notifSearchPlaceholder")}
                aria-label={t("notifSearchAction")}
                className="
                  min-h-10 w-full rounded-xl border
                  border-neutral-200 bg-neutral-50 py-2 ps-9 pe-9
                  text-xs text-neutral-900 placeholder:text-neutral-400
                  outline-none transition-colors
                  focus:border-neutral-400 focus:bg-white
                  dark:border-neutral-700 dark:bg-neutral-800
                  dark:text-neutral-100 dark:placeholder:text-neutral-500
                  dark:focus:border-neutral-500 dark:focus:bg-neutral-800
                "
              />

              {searchQuery && (
                <button
                  type="button"
                  aria-label={t("notifClearSearch")}
                  onClick={() => onSearchChange("")}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-700 dark:hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      {onTabChange && (
        <div
          role="tablist"
          aria-label={t("notifTitle")}
          className="relative z-10 mt-3.5 flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-100/80 p-1 dark:border-neutral-700 dark:bg-neutral-800"
        >
          {tabs.map((tab) => {
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`notification-tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex min-h-8 flex-1 cursor-pointer
                  items-center justify-center gap-1.5 rounded-lg
                  px-1.5 text-[10px] font-bold transition-colors
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-neutral-900
                  dark:focus-visible:ring-neutral-200
                  ${
                    selected
                      ? "text-neutral-900 dark:text-neutral-950"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  }
                `}
              >
                {selected && (
                  <motion.span
                    layoutId="notification-filter-indicator"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 32 }
                    }
                    className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-100"
                  />
                )}

                <span className="relative z-10">{tab.label}</span>

                {tab.count != null && (
                  <span
                    className={`
                      relative z-10 rounded-full px-1.5 py-0.5
                      font-mono text-[9px] font-semibold
                      ${
                        selected
                          ? "bg-neutral-100 text-neutral-700 dark:bg-neutral-200 dark:text-neutral-800"
                          : "bg-neutral-200/70 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300"
                      }
                    `}
                  >
                    {tab.count > 99 ? "99+" : tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Read progress */}
      <div className="relative z-10 mt-3 flex items-center gap-2">
        <div
          role="progressbar"
          aria-label={t("notifReadProgress").replace("{percent}", String(readPercentage))}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={readPercentage}
          className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700"
        >
          <motion.div
            initial={false}
            animate={{ width: `${readPercentage}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            className="h-full rounded-full bg-neutral-800 dark:bg-neutral-200"
          />
        </div>

        <span className="font-mono text-[9px] font-medium text-neutral-500 dark:text-neutral-400">
          {t("notifReadProgress").replace("{percent}", String(readPercentage))}
        </span>
      </div>
    </header>
  );
}
