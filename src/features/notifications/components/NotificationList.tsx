"use client";

import { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BellOff,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  SearchX,
} from "lucide-react";

import type { Notification } from "@/store/notificationStore";
import type { FilterTab } from "./NotificationDropdown";
import { NotificationItem } from "./NotificationItem";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type NotificationListProps = {
  notifications: Notification[];
  activeTab?: FilterTab;
  loading?: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
};

function isToday(dateValue: string | Date, now: Date) {
  const date = new Date(dateValue);

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function NotificationList({
  notifications,
  activeTab = "all",
  loading = false,
  searchQuery = "",
  onClearSearch,
  onNotificationClick,
  onMarkAsRead,
}: NotificationListProps) {
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();

  const grouped = useMemo(() => {
    const today: Notification[] = [];
    const earlier: Notification[] = [];
    const now = new Date();

    for (const notification of notifications) {
      if (isToday(notification.createdAt, now)) {
        today.push(notification);
      } else {
        earlier.push(notification);
      }
    }

    return { today, earlier };
  }, [notifications]);

  const hasSearch = Boolean(searchQuery.trim());
  const noNotifications = notifications.length === 0;

  const animation = reduceMotion ? { duration: 0 } : { duration: 0.2 };

  if (loading) {
    return (
      <div
        aria-label={t("notifLoading")}
        aria-busy="true"
        className="space-y-2.5 overflow-hidden p-3"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="
              flex animate-pulse items-start gap-3 rounded-2xl
              border border-neutral-200 bg-white p-3.5
              dark:border-neutral-700 dark:bg-neutral-800
            "
          >
            <div className="h-10 w-10 shrink-0 rounded-xl bg-neutral-200 dark:bg-neutral-700" />

            <div className="min-w-0 flex-1 space-y-2.5 pt-1">
              <div className="h-2.5 w-20 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-3 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-2.5 w-full rounded bg-neutral-100 dark:bg-neutral-700/70" />
              <div className="h-2.5 w-2/3 rounded bg-neutral-100 dark:bg-neutral-700/70" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (noNotifications) {
    const isUnreadTab = activeTab === "unread";

    const title = hasSearch
      ? t("notifNoSearchResults")
      : isUnreadTab
        ? t("notifNoUnread")
        : activeTab === "orders"
          ? t("notifNoOrderAlerts")
          : t("notifEmpty");

    const description = hasSearch
      ? t("notifSearchMatchHint").replace("{query}", searchQuery.trim())
      : isUnreadTab
        ? t("notifNoUnreadHint")
        : activeTab === "orders"
          ? t("notifNoOrderHint")
          : t("notifEmptyHint");

    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={animation}
        className="
          flex min-h-56 flex-col items-center justify-center
          bg-neutral-50/70 px-6 py-10 text-center
          dark:bg-neutral-900/50
        "
      >
        <div
          className="
          mb-4 flex h-12 w-12 items-center justify-center
          rounded-2xl border border-neutral-200 bg-white
          text-neutral-700 shadow-sm
          dark:border-neutral-700 dark:bg-neutral-800
          dark:text-neutral-200
        "
        >
          {hasSearch ? (
            <SearchX size={21} />
          ) : isUnreadTab ? (
            <CheckCircle2
              size={22}
              className="text-emerald-600 dark:text-emerald-400"
            />
          ) : (
            <BellOff
              size={21}
              className="text-neutral-400 dark:text-neutral-500"
            />
          )}
        </div>

        <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 sm:text-sm">
          {title}
        </h4>

        <p className="mt-1.5 max-w-[260px] text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {description}
        </p>

        {hasSearch && onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="
              mt-4 inline-flex min-h-9 cursor-pointer items-center
              gap-1.5 rounded-xl border border-neutral-200
              bg-white px-3.5 text-[10px] font-semibold
              text-neutral-700 transition-colors hover:bg-neutral-100
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-neutral-900
              dark:border-neutral-700 dark:bg-neutral-800
              dark:text-neutral-200 dark:hover:bg-neutral-700
              dark:focus-visible:ring-neutral-200
            "
          >
            <RotateCcw size={12} />
            {t("notifClearSearch")}
          </button>
        )}
      </motion.div>
    );
  }

  const renderGroup = (
    title: string,
    items: Notification[],
    groupKey: string,
    withSparkle = false,
  ) => {
    if (items.length === 0) return null;

    return (
      <motion.div
        key={groupKey}
        aria-label={title}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={animation}
        className="mb-1"
      >
        <div
          className="
          sticky top-0 z-20 flex items-center justify-between
          border-y border-neutral-200/70 bg-[#F7F6F3]/95
          px-4 py-2 backdrop-blur-md
          dark:border-neutral-700/70 dark:bg-neutral-900/95
        "
        >
          <h4 className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
            {withSparkle && (
              <Sparkles
                size={11}
                className="text-neutral-500 dark:text-neutral-400"
              />
            )}
            {title}
          </h4>

          <span
            className="
            rounded-full bg-neutral-200/70 px-2 py-0.5
            font-mono text-[9px] font-medium text-neutral-600
            dark:bg-neutral-800 dark:text-neutral-300
          "
          >
            {items.length}
          </span>
        </div>

        <div className="py-0.5">
          <AnimatePresence initial={false}>
            {items.map((notification) => (
              <motion.div
                key={notification._id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }
                }
                transition={animation}
              >
                <NotificationItem
                  notification={notification}
                  onClick={() => onNotificationClick(notification)}
                  onMarkAsRead={
                    onMarkAsRead
                      ? () => onMarkAsRead(notification._id)
                      : undefined
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      role="region"
      aria-label={t("notifResultsRegion")}
      aria-live="polite"
      className="
        min-h-0 flex-1 overflow-y-auto overscroll-contain
        bg-[#F7F6F3] py-1
        dark:bg-neutral-900
        [scrollbar-color:theme(colors.neutral.300)_transparent]
        dark:[scrollbar-color:theme(colors.neutral.700)_transparent]
      "
    >
      {renderGroup(t("notifToday"), grouped.today, "group-today", true)}
      {renderGroup(t("notifEarlier"), grouped.earlier, "group-earlier")}
    </div>
  );
}
