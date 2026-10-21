"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
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
import { useLocale } from "@/shared/i18n/LocaleProvider";
import type { MessageKey } from "@/shared/i18n/messages";

type NotificationItemProps = {
  notification: Notification;
  onClick: () => void;
  onMarkAsRead?: () => void;
};

function formatRelativeTime(dateValue: string | Date, locale: "ar" | "en") {
  const date = new Date(dateValue);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(locale === "ar" ? "ar-EG" : "en", {
    numeric: "auto",
  });

  if (Number.isNaN(diffSeconds)) return formatter.format(0, "second");
  if (diffSeconds < 60) return formatter.format(0, "second");

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return formatter.format(-minutes, "minute");

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return formatter.format(-hours, "hour");

  const days = Math.floor(hours / 24);
  if (days < 7) return formatter.format(-days, "day");

  return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

function getNotificationVisuals(
  title = "",
  message = "",
  t: (key: MessageKey) => string,
) {
  const text = `${title} ${message}`.toLocaleLowerCase();

  if (
    ["deliver", "ship", "transit", "on the way", "courier", "شحن", "توصيل", "وصل", "مندوب"].some((word) =>
      text.includes(word),
    )
  ) {
    return {
      Icon: Truck,
      category: t("notifShippingCategory"),
      iconStyle:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300",
    };
  }

  if (
    ["complete", "success", "confirm", "paid", "verified", "تأكيد", "تم بنجاح", "دفع", "موثق", "مؤكد"].some((word) =>
      text.includes(word),
    )
  ) {
    return {
      Icon: CheckCircle2,
      category: t("notifConfirmedCategory"),
      iconStyle:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300",
    };
  }

  if (
    ["cancel", "fail", "alert", "issue", "refund", "إلغاء", "فشل", "تنبيه", "استرداد", "مشكلة"].some((word) =>
      text.includes(word),
    )
  ) {
    return {
      Icon: AlertTriangle,
      category: t("notifAttentionCategory"),
      iconStyle:
        "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-300",
    };
  }

  if (
    ["offer", "welcome", "promo", "discount", "drop", "عرض", "ترحيب", "خصم", "مجموعة"].some((word) =>
      text.includes(word),
    )
  ) {
    return {
      Icon: Sparkles,
      category: t("notifOfferCategory"),
      iconStyle:
        "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300",
    };
  }

  return {
    Icon: Package,
    category: t("notifOrderCategory"),
    iconStyle:
      "border-neutral-200 bg-neutral-100 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100",
  };
}

export function NotificationItem({
  notification,
  onClick,
  onMarkAsRead,
}: NotificationItemProps) {
  const { locale, t } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const resetCopiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetCopiedTimer.current) {
        clearTimeout(resetCopiedTimer.current);
      }
    };
  }, []);

  const isUnread = !notification.read;
  const message = notification.message || "";
  const title = notification.title || t("notifTitle");
  const { Icon, category, iconStyle } = getNotificationVisuals(title, message, t);

  const isLongMessage = message.length > 100;
  const orderId = notification.order ? String(notification.order) : "";
  const shortOrderId = orderId ? orderId.slice(-6).toUpperCase() : "";

  const handleMarkAsRead = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onMarkAsRead?.();
  };

  const handleCopyOrder = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!orderId) return;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard is unavailable");
      }

      await navigator.clipboard.writeText(orderId);
      setCopiedOrder(true);
      toast.success(t("notifOrderCopied").replace("{id}", `#${shortOrderId}`));

      if (resetCopiedTimer.current) {
        clearTimeout(resetCopiedTimer.current);
      }

      resetCopiedTimer.current = setTimeout(() => {
        setCopiedOrder(false);
      }, 1800);
    } catch {
      toast.error(t("notifCopyOrderFailed"));
    }
  };

  const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setExpanded((current) => !current);
  };

  return (
    <article
      className={`
        group relative mx-2 my-1.5 overflow-hidden rounded-2xl border
        transition-colors duration-200
        ${
          isUnread
            ? "border-neutral-200 bg-white shadow-sm hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800/90 dark:hover:border-neutral-600"
            : "border-transparent bg-white/60 hover:border-neutral-200 hover:bg-white dark:bg-neutral-800/45 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
        }
      `}
    >
      {isUnread && (
        <span
          aria-hidden="true"
          className="absolute inset-y-3 start-0 w-[3px] rounded-s-full bg-neutral-900 dark:bg-neutral-200"
        />
      )}

      {/* Main clickable content */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`${t("notifTitle")}: ${title}`}
        className="
          flex w-full cursor-pointer items-start gap-3 px-3.5 pb-1 pt-3.5
          text-start outline-none
          focus-visible:ring-2 focus-visible:ring-inset
          focus-visible:ring-neutral-900
          dark:focus-visible:ring-neutral-200
          sm:gap-3.5
        "
      >
        <span
          aria-hidden="true"
          className={`
            mt-0.5 flex h-10 w-10 shrink-0 items-center
            justify-center rounded-xl border transition-transform
            duration-200 group-hover:scale-[1.03]
            ${iconStyle}
          `}
        >
          <Icon size={18} strokeWidth={2} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
              {category}
            </span>

            <span
              title={new Date(notification.createdAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
              className="inline-flex shrink-0 items-center gap-1 text-[9px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              <Clock size={10} />
              {formatRelativeTime(notification.createdAt, locale)}
            </span>
          </span>

          <span
            className={`
              mt-1 block truncate text-xs tracking-tight sm:text-[13px]
              ${
                isUnread
                  ? "font-bold text-neutral-950 dark:text-neutral-50"
                  : "font-semibold text-neutral-700 dark:text-neutral-200"
              }
            `}
          >
            {title}
          </span>

          <span
            className={`
              mt-1 block text-[11px] leading-[1.65] sm:text-xs
              ${expanded ? "whitespace-pre-line break-words" : "line-clamp-2"}
              ${
                isUnread
                  ? "text-neutral-700 dark:text-neutral-300"
                  : "text-neutral-600 dark:text-neutral-400"
              }
            `}
          >
            {message || t("notifNoDetails")}
          </span>
        </span>

        {isUnread && (
          <span
            aria-label={t("notifUnreadStatus")}
            title={t("notifUnreadStatus")}
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-600 dark:bg-rose-400"
          />
        )}
      </button>

      {/* Secondary actions, separate from the main button */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 pb-3 pt-2.5 ps-[4.35rem]">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {orderId && (
            <>
              <span
                className="
                inline-flex items-center gap-1 rounded-lg
                border border-neutral-200 bg-neutral-50 px-2 py-1
                font-mono text-[9px] font-semibold text-neutral-700
                dark:border-neutral-700 dark:bg-neutral-900
                dark:text-neutral-200
              "
              >
                {t("notifOrderReference").replace("{id}", `#${shortOrderId}`)}
              </span>

              <button
                type="button"
                onClick={handleCopyOrder}
                aria-label={`${t("notifCopyOrderId")} ${shortOrderId}`}
                title={t("notifCopyOrderId")}
                className="
                  inline-flex h-6 w-6 cursor-pointer items-center
                  justify-center rounded-lg border border-neutral-200
                  bg-white text-neutral-500 transition-colors
                  hover:bg-neutral-100 hover:text-neutral-900
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-neutral-900
                  dark:border-neutral-700 dark:bg-neutral-800
                  dark:text-neutral-300 dark:hover:bg-neutral-700
                  dark:hover:text-white dark:focus-visible:ring-neutral-200
                "
              >
                {copiedOrder ? (
                  <Check
                    size={11}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                ) : (
                  <Copy size={11} />
                )}
              </button>
            </>
          )}

          {isLongMessage && (
            <button
              type="button"
              onClick={handleToggleExpand}
              aria-expanded={expanded}
              className="
                inline-flex min-h-6 cursor-pointer items-center gap-1
                rounded-md px-1.5 text-[9px] font-semibold
                text-neutral-500 transition-colors
                hover:bg-neutral-100 hover:text-neutral-900
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-neutral-900
                dark:text-neutral-400 dark:hover:bg-neutral-700
                dark:hover:text-white dark:focus-visible:ring-neutral-200
              "
            >
              <span>{expanded ? t("notifShowLess") : t("notifShowMore")}</span>
              <ChevronDown
                size={11}
                className={`transition-transform duration-200 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {isUnread && onMarkAsRead && (
          <button
            type="button"
            onClick={handleMarkAsRead}
            className="
              inline-flex min-h-7 cursor-pointer items-center gap-1.5
              rounded-lg border border-neutral-200 bg-neutral-50
              px-2 py-1 text-[9px] font-semibold text-neutral-700
              transition-colors hover:border-neutral-900
              hover:bg-neutral-900 hover:text-white
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-neutral-900
              dark:border-neutral-700 dark:bg-neutral-900
              dark:text-neutral-300 dark:hover:border-neutral-200
              dark:hover:bg-neutral-100 dark:hover:text-neutral-950
              dark:focus-visible:ring-neutral-200
            "
          >
            <Check size={11} />
            <span>{t("notifMarkRead")}</span>
          </button>
        )}
      </div>
    </article>
  );
}
