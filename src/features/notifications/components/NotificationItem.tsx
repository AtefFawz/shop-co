"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
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
  const formatter = new Intl.RelativeTimeFormat(
    locale === "ar" ? "ar-EG" : "en",
    { numeric: "auto" },
  );

  if (Number.isNaN(diffSeconds) || diffSeconds < 60) {
    return formatter.format(0, "second");
  }

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
    [
      "deliver",
      "ship",
      "transit",
      "on the way",
      "courier",
      "شحن",
      "توصيل",
      "وصل",
      "مندوب",
    ].some((word) => text.includes(word))
  ) {
    return {
      Icon: Truck,
      category: t("notifShippingCategory"),
      iconStyle: "border-info-border bg-info-soft text-info",
    };
  }

  if (
    [
      "complete",
      "success",
      "confirm",
      "paid",
      "verified",
      "تأكيد",
      "تم بنجاح",
      "دفع",
      "موثق",
      "مؤكد",
    ].some((word) => text.includes(word))
  ) {
    return {
      Icon: CheckCircle2,
      category: t("notifConfirmedCategory"),
      iconStyle: "border-success-border bg-success-soft text-success",
    };
  }

  if (
    [
      "cancel",
      "fail",
      "alert",
      "issue",
      "refund",
      "إلغاء",
      "فشل",
      "تنبيه",
      "استرداد",
      "مشكلة",
    ].some((word) => text.includes(word))
  ) {
    return {
      Icon: AlertTriangle,
      category: t("notifAttentionCategory"),
      iconStyle: "border-danger-border bg-danger-soft text-danger",
    };
  }

  if (
    [
      "offer",
      "welcome",
      "promo",
      "discount",
      "drop",
      "عرض",
      "ترحيب",
      "خصم",
      "مجموعة",
    ].some((word) => text.includes(word))
  ) {
    return {
      Icon: Sparkles,
      category: t("notifOfferCategory"),
      iconStyle: "border-warning-border bg-warning-soft text-warning",
    };
  }

  return {
    Icon: Package,
    category: t("notifOrderCategory"),
    iconStyle: "border-border-strong/60 bg-brand-soft text-accent",
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
  const { Icon, category, iconStyle } = getNotificationVisuals(
    title,
    message,
    t,
  );

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
      data-theme-surface
      className={`
        group relative overflow-hidden rounded-2xl border
        transition-all duration-200
        ${
          isUnread
            ? "border-border-strong/75 bg-surface-raised shadow-[var(--shadow-soft)] hover:border-focus/60"
            : "border-border-subtle bg-surface/75 hover:border-border hover:bg-surface-raised"
        }
      `}
    >
      {/* Active Sapphire Unread Indicator Bar */}
      {isUnread && (
        <span
          aria-hidden="true"
          className="absolute inset-y-3 start-0 w-1 rounded-e-full bg-accent shadow-[0_0_12px_var(--focus-ring)]"
        />
      )}

      {/* Main clickable content */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`${t("notifTitle")}: ${title}`}
        className="
          flex w-full cursor-pointer items-start gap-3 px-3.5 pb-1.5 pt-3.5
          text-start outline-none
          focus-visible:ring-2 focus-visible:ring-inset
          focus-visible:ring-focus
          sm:gap-3.5
        "
      >
        <span
          aria-hidden="true"
          className={`
            mt-0.5 flex h-10 w-10 shrink-0 items-center
            justify-center rounded-xl border transition-transform
            duration-200 group-hover:scale-105
            ${iconStyle}
          `}
        >
          <Icon size={18} strokeWidth={2} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-[9.5px] font-extrabold uppercase tracking-[0.12em] text-muted">
              {category}
            </span>

            <span
              title={new Date(notification.createdAt).toLocaleString(
                locale === "ar" ? "ar-EG" : "en-US",
              )}
              className="inline-flex shrink-0 items-center gap-1 font-mono text-[9.5px] font-medium text-subtle"
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
                  ? "font-extrabold text-primary"
                  : "font-semibold text-secondary"
              }
            `}
          >
            {title}
          </span>

          <span
            className={`
              mt-1 block text-[11.5px] leading-[1.65] sm:text-xs
              ${expanded ? "whitespace-pre-line break-words" : "line-clamp-2"}
              ${isUnread ? "text-secondary" : "text-muted"}
            `}
          >
            {message || t("notifNoDetails")}
          </span>
        </span>

        {isUnread && (
          <span
            aria-label={t("notifUnreadStatus")}
            title={t("notifUnreadStatus")}
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_8px_var(--focus-ring)]"
          />
        )}
      </button>

      {/* Secondary actions row */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 pb-3 pt-2 ps-[4.25rem]">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {orderId && (
            <>
              <span
                className="
                  inline-flex items-center gap-1 rounded-lg
                  border border-border bg-surface-subtle px-2 py-1
                  font-mono text-[9.5px] font-bold text-secondary
                "
              >
                {t("notifOrderReference").replace("{id}", `#${shortOrderId}`)}
              </span>

              <button
                type="button"
                onClick={handleCopyOrder}
                aria-label={`${t("notifCopyOrderId")} ${shortOrderId}`}
                title={t("notifCopyOrderId")}
                className={`
                  inline-flex h-6 w-6 cursor-pointer items-center
                  justify-center rounded-lg border transition-colors
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-focus
                  ${
                    copiedOrder
                      ? "border-success-border bg-success-soft text-success"
                      : "border-border bg-surface text-muted hover:border-border-strong hover:bg-surface-muted hover:text-primary"
                  }
                `}
              >
                {copiedOrder ? <Check size={11} /> : <Copy size={11} />}
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
                rounded-lg px-2 text-[9.5px] font-bold
                text-accent transition-colors
                hover:bg-brand-soft
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-focus
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
              rounded-lg border border-border-strong/60 bg-brand-soft
              px-2.5 py-1 text-[9.5px] font-bold text-accent
              transition-all hover:border-action
              hover:bg-action hover:text-on-action
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-focus active:scale-95
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
