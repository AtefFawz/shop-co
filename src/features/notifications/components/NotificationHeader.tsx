"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCheck, X, Search, Volume2, VolumeX } from "lucide-react";

import type { FilterTab } from "./NotificationDropdown";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatNumber } from "@/lib/formatNumber";

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSoundEnabled(localStorage.getItem(soundStorageKey) !== "muted");
    } catch {
      // Keep default enabled state when storage is unavailable.
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

  const formattedUnreadCount = formatNumber(unreadCount, locale);
  const readCount = Math.max(0, totalCount - unreadCount);
  const readPercentage =
    totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 100;

  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all", label: t("notifTabAll"), count: totalCount },
    { id: "unread", label: t("notifTabUnread"), count: unreadCount },
    { id: "orders", label: t("notifTabOrders") },
  ];

  return (
    <header
      data-theme-surface
      className="relative shrink-0 overflow-hidden border-b border-border bg-surface-raised px-4 pb-3.5 pt-4 text-primary sm:px-5"
    >
      {/* Subtle Royal Sapphire Atmospheric Aura & Grid */}
      <div
        aria-hidden="true"
        className="bg-grid-subtle pointer-events-none absolute inset-0 bg-[size:24px_24px] opacity-70"
      />
      <div
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 75%)",
        }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Top row: Status Orb + Title + Action Buttons */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border-strong/60 bg-brand-soft text-accent shadow-2xs">
            <span
              className={`relative flex h-2.5 w-2.5 rounded-full ${
                unreadCount > 0 ? "bg-warning-bright" : "bg-success-bright"
              }`}
            >
              {unreadCount > 0 && !reduceMotion && (
                <span className="absolute inset-0 animate-ping rounded-full bg-warning-bright/60" />
              )}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-xs font-extrabold tracking-wide text-primary sm:text-sm">
                {t("notifTitle")}
              </h3>
              {unreadCount > 0 && (
                <span className="inline-flex items-center rounded-full border border-border-strong/60 bg-brand-soft px-2 py-0.5 font-mono text-[9.5px] font-bold text-accent">
                  {formattedUnreadCount}
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate text-[10.5px] font-medium text-muted">
              {unreadCount > 0
                ? `${formattedUnreadCount} ${t("notifUnreadLabel")}`
                : t("notifCaughtUp")}
            </p>
          </div>
        </div>

        {/* Right utility actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {onSearchChange && (
            <button
              type="button"
              aria-label={
                searchOpen ? t("navCloseSearch") : t("notifSearchAction")
              }
              aria-expanded={searchOpen}
              onClick={toggleSearch}
              className={`
                flex h-8 w-8 cursor-pointer items-center justify-center
                rounded-xl border transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-focus
                ${
                  searchOpen || searchQuery
                    ? "border-action bg-action text-on-action shadow-xs"
                    : "border-border bg-surface-subtle text-secondary hover:border-border-strong hover:bg-surface-muted hover:text-primary"
                }
              `}
            >
              <Search size={14} />
            </button>
          )}

          <button
            type="button"
            aria-label={
              soundEnabled ? t("notifMuteSound") : t("notifEnableSound")
            }
            aria-pressed={soundEnabled}
            onClick={toggleSound}
            className={`
              flex h-8 w-8 cursor-pointer items-center justify-center
              rounded-xl border transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-focus
              ${
                soundEnabled
                  ? "border-success-border bg-success-soft text-success hover:opacity-90"
                  : "border-border bg-surface-subtle text-muted hover:border-border-strong hover:bg-surface-muted hover:text-primary"
              }
            `}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="
                inline-flex min-h-8 cursor-pointer items-center gap-1.5
                rounded-xl border border-border-strong/70 bg-brand-soft
                px-2.5 text-[9.5px] font-bold uppercase tracking-wider
                text-accent transition-all duration-200
                hover:border-action hover:bg-action hover:text-on-action
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-focus active:scale-95
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
                rounded-xl border border-border bg-surface-subtle
                text-secondary transition-colors hover:border-border-strong
                hover:bg-surface-muted hover:text-primary
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-focus sm:hidden
              "
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Expandable search bar */}
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
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-subtle"
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
                  border-border bg-surface-subtle py-2 ps-9 pe-9
                  text-xs font-medium text-primary placeholder:text-subtle
                  outline-none transition-all
                  focus:border-focus focus:bg-surface
                  focus:ring-3 focus:ring-[var(--focus-ring)]
                "
              />

              {searchQuery && (
                <button
                  type="button"
                  aria-label={t("notifClearSearch")}
                  onClick={() => onSearchChange("")}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted transition-colors hover:bg-surface-muted hover:text-primary"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Segmented Filter Tabs */}
      {onTabChange && (
        <div
          role="tablist"
          aria-label={t("notifTitle")}
          className="relative z-10 mt-3.5 flex items-center gap-1 rounded-2xl border border-border bg-surface-subtle p-1"
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
                  items-center justify-center gap-1.5 rounded-xl
                  px-2 text-[10.5px] font-bold transition-colors
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-focus
                  ${
                    selected
                      ? "text-on-action"
                      : "text-muted hover:text-primary"
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
                    className="absolute inset-0 rounded-xl bg-action shadow-[0_4px_14px_-4px_var(--focus-ring)]"
                  />
                )}

                <span className="relative z-10">{tab.label}</span>

                {tab.count != null && (
                  <span
                    className={`
                      relative z-10 rounded-full px-1.5 py-0.5
                      font-mono text-[9px] font-bold leading-none
                      ${
                        selected
                          ? "bg-white/20 text-on-action"
                          : "bg-surface-muted text-secondary"
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

      {/* Read progress telemetry */}
      <div className="relative z-10 mt-3 flex items-center gap-2.5">
        <div
          role="progressbar"
          aria-label={t("notifReadProgress").replace(
            "{percent}",
            String(readPercentage),
          )}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={readPercentage}
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted"
        >
          <motion.div
            initial={false}
            animate={{ width: `${readPercentage}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
            className={`h-full rounded-full ${
              readPercentage === 100
                ? "bg-success-bright"
                : "bg-gradient-to-r from-action to-accent"
            }`}
          />
        </div>

        <span className="font-mono text-[9.5px] font-bold text-muted">
          {t("notifReadProgress").replace("{percent}", String(readPercentage))}
        </span>
      </div>
    </header>
  );
}
