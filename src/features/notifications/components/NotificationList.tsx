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
        className="space-y-2.5 overflow-hidden bg-app/70 p-3"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="
              flex animate-pulse items-start gap-3 rounded-2xl
              border border-border bg-surface-raised p-3.5
              shadow-[var(--shadow-soft)]
            "
          >
            <div className="h-10 w-10 shrink-0 rounded-xl bg-surface-muted" />

            <div className="min-w-0 flex-1 space-y-2.5 pt-1">
              <div className="h-2.5 w-20 rounded bg-surface-muted" />
              <div className="h-3 w-3/4 rounded bg-surface-muted" />
              <div className="h-2.5 w-full rounded bg-surface-subtle" />
              <div className="h-2.5 w-2/3 rounded bg-surface-subtle" />
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
          relative flex min-h-60 flex-col items-center justify-center
          overflow-hidden bg-app/60 px-6 py-10 text-center
        "
      >
        <div
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 65%)",
          }}
          className="pointer-events-none absolute inset-0"
        />

        <div
          className={`
            relative z-10 mb-4 flex h-13 w-13 items-center justify-center
            rounded-2xl border shadow-[var(--shadow-soft)]
            ${
              isUnreadTab && !hasSearch
                ? "border-success-border bg-success-soft text-success"
                : "border-border-strong/60 bg-surface-raised text-accent"
            }
          `}
        >
          {hasSearch ? (
            <SearchX size={22} />
          ) : isUnreadTab ? (
            <CheckCircle2 size={23} />
          ) : (
            <BellOff size={21} className="text-muted" />
          )}
        </div>

        <h4 className="relative z-10 text-xs font-extrabold text-primary sm:text-sm">
          {title}
        </h4>

        <p className="relative z-10 mt-1.5 max-w-[260px] text-xs leading-relaxed text-muted">
          {description}
        </p>

        {hasSearch && onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="
              relative z-10 mt-4 inline-flex min-h-9 cursor-pointer
              items-center gap-1.5 rounded-xl border border-border-strong/70
              bg-surface-raised px-3.5 text-[10.5px] font-bold
              text-primary shadow-2xs transition-all
              hover:border-action hover:bg-action hover:text-on-action
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-focus
            "
          >
            <RotateCcw size={12} />
            <span>{t("notifClearSearch")}</span>
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
        className="mb-1.5"
      >
        <div
          className="
            sticky top-0 z-20 flex items-center justify-between
            border-y border-border-subtle bg-surface/90
            px-4 py-2 backdrop-blur-xl
          "
        >
          <h4 className="inline-flex items-center gap-1.5 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-secondary">
            {withSparkle && <Sparkles size={11} className="text-accent" />}
            <span>{title}</span>
          </h4>

          <span
            className="
              rounded-full border border-border-strong/50 bg-brand-soft
              px-2 py-0.5 font-mono text-[9px] font-bold text-accent
            "
          >
            {items.length}
          </span>
        </div>

        <div className="space-y-1.5 px-2.5 py-2">
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
        bg-app/75 pb-1
        [scrollbar-color:var(--border-strong)_transparent]
      "
    >
      {renderGroup(t("notifToday"), grouped.today, "group-today", true)}
      {renderGroup(t("notifEarlier"), grouped.earlier, "group-earlier")}
    </div>
  );
}
