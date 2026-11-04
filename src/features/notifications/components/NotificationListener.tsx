"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Bell,
  ArrowUpRight,
  X,
  Truck,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import { createSocket } from "@/lib/sockets/socket";
import { useSocketStore } from "@/store/socketStore";
import {
  useNotificationStore,
  type Notification,
} from "@/store/notificationStore";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import {
  isOrderStatusNotification,
  isQuietHoursActive,
  useNotificationPreferences,
} from "@/shared/preferences/NotificationPreferencesProvider";

function getToastVisuals(
  title = "",
  message = "",
  t: (key: import("@/shared/i18n/messages").MessageKey) => string,
) {
  const content = `${title} ${message}`.toLocaleLowerCase();

  if (
    [
      "ship",
      "deliver",
      "transit",
      "on the way",
      "courier",
      "شحن",
      "توصيل",
      "وصل",
      "مندوب",
    ].some((word) => content.includes(word))
  ) {
    return {
      Icon: Truck,
      label: t("notifShippingCategory"),
      iconStyle: "border border-info-border bg-info-soft text-info",
    };
  }

  if (
    [
      "cancel",
      "fail",
      "alert",
      "refund",
      "issue",
      "إلغاء",
      "فشل",
      "تنبيه",
      "استرداد",
      "مشكلة",
    ].some((word) => content.includes(word))
  ) {
    return {
      Icon: AlertTriangle,
      label: t("notifAttentionCategory"),
      iconStyle: "border border-danger-border bg-danger-soft text-danger",
    };
  }

  if (
    [
      "confirm",
      "complete",
      "success",
      "paid",
      "verified",
      "تأكيد",
      "تم بنجاح",
      "دفع",
      "موثق",
      "مؤكد",
    ].some((word) => content.includes(word))
  ) {
    return {
      Icon: CheckCircle2,
      label: t("notifOrderConfirmed"),
      iconStyle: "border border-success-border bg-success-soft text-success",
    };
  }

  return {
    Icon: Bell,
    label: t("notifNew"),
    iconStyle: "border border-border bg-brand-soft text-accent",
  };
}

export default function NotificationListener() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const seenNotificationIds = useRef(new Set<string>());
  const { preferences } = useNotificationPreferences();
  const preferencesRef = useRef(preferences);

  useEffect(() => {
    preferencesRef.current = preferences;
  }, [preferences]);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const handleIncomingNotification = useCallback(
    (notification: Notification) => {
      const notificationId = notification?._id ? String(notification._id) : "";

      // The backend may publish both aliases for the same notification.
      if (notificationId && seenNotificationIds.current.has(notificationId)) {
        return;
      }

      if (notificationId) {
        seenNotificationIds.current.add(notificationId);

        // Avoid retaining an unbounded list of IDs during a long session.
        if (seenNotificationIds.current.size > 500) {
          const oldestId = seenNotificationIds.current.values().next().value;
          if (oldestId) seenNotificationIds.current.delete(oldestId);
        }
      }

      // Keep the notification in the inbox/store even when its banner is muted.
      // The backend remains the source of truth for the persisted notification.
      addNotification(notification);

      const currentPreferences = preferencesRef.current;
      const orderNotification = isOrderStatusNotification(notification);
      if (
        !currentPreferences.inAppBanners ||
        (orderNotification && !currentPreferences.orderUpdates) ||
        isQuietHoursActive(currentPreferences)
      ) {
        return;
      }

      const { Icon, label, iconStyle } = getToastVisuals(
        notification.title,
        notification.message,
        t,
      );

      toast.custom(
        (toastItem) => (
          <motion.div
            role="status"
            aria-live="polite"
            dir={locale === "ar" ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{
              opacity: toastItem.visible ? 1 : 0,
              y: toastItem.visible ? 0 : 8,
              scale: toastItem.visible ? 1 : 0.985,
            }}
            transition={{ duration: 0.2 }}
            className="
              pointer-events-auto w-[min(100vw-24px,380px)]
              overflow-hidden rounded-2xl border border-neutral-200
              bg-white p-4 text-neutral-900
              shadow-[0_18px_50px_rgba(0,0,0,0.16)]
              dark:border-neutral-700 dark:bg-neutral-900
              dark:text-neutral-100
              dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]
            "
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
              >
                <Icon size={18} strokeWidth={2} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles
                    size={11}
                    className="text-amber-600 dark:text-amber-400"
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                    {label}
                  </span>
                </div>

                <p className="mt-1 break-words text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {notification.title || t("notifNew")}
                </p>

                {notification.message && (
                  <p className="mt-1 line-clamp-2 break-words text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {notification.message}
                  </p>
                )}

                {notification.order && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.dismiss(toastItem.id);
                      router.push(`/shop/orders/${notification.order}`);
                    }}
                    className="
                      mt-3 inline-flex min-h-8 cursor-pointer items-center
                      gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5
                      text-xs font-semibold text-white
                      transition-colors hover:bg-neutral-700
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-neutral-900 focus-visible:ring-offset-2
                      dark:bg-neutral-100 dark:text-neutral-950
                      dark:hover:bg-white dark:focus-visible:ring-neutral-200
                    "
                  >
                    <span>
                      {t("notifViewOrder")} #
                      {String(notification.order).slice(-6).toUpperCase()}
                    </span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => toast.dismiss(toastItem.id)}
                aria-label={t("notifClose")}
                className="
                  flex h-7 w-7 shrink-0 cursor-pointer items-center
                  justify-center rounded-lg text-neutral-500
                  transition-colors hover:bg-neutral-100 hover:text-neutral-900
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-neutral-900
                  dark:text-neutral-400 dark:hover:bg-neutral-800
                  dark:hover:text-white dark:focus-visible:ring-neutral-200
                "
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ),
        {
          duration: 5000,
          position: locale === "ar" ? "bottom-left" : "bottom-right",
        },
      );
    },
    [addNotification, locale, router, t],
  );

  const socketReady = useSocketStore((state) => state.socketReady);

  useEffect(() => {
    if (!socketReady) return;

    let disposed = false;
    let socket: Socket | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const connectWithFreshTicket = async () => {
      try {
        const nextSocket = await createSocket();
        if (disposed || !nextSocket) {
          nextSocket?.disconnect();
          return;
        }

        socket = nextSocket;
        nextSocket.on("notification", handleIncomingNotification);
        nextSocket.on("new_notification", handleIncomingNotification);
        nextSocket.on("connect", () => {
          attempts = 0;
        });
        nextSocket.on("connect_error", () => {
          nextSocket.disconnect();
          if (disposed) return;
          attempts += 1;
          const delay = Math.min(30_000, 1_000 * 2 ** Math.min(attempts - 1, 5));
          retryTimer = setTimeout(() => {
            void connectWithFreshTicket();
          }, delay);
        });
        nextSocket.connect();
      } catch (error) {
        if (disposed) return;
        console.warn("Realtime notification connection is unavailable:", error);
        attempts += 1;
        const delay = Math.min(30_000, 1_000 * 2 ** Math.min(attempts - 1, 5));
        retryTimer = setTimeout(() => {
          void connectWithFreshTicket();
        }, delay);
      }
    };

    void connectWithFreshTicket();

    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (socket) {
        socket.off("notification", handleIncomingNotification);
        socket.off("new_notification", handleIncomingNotification);
        socket.disconnect();
      }
    };
  }, [handleIncomingNotification, socketReady]);

  return null;
}
