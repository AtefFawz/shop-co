"use client";

import { useCallback, useEffect, useRef } from "react";
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

import { createSocket, refreshAccessToken } from "@/lib/sockets/socket";
import {
  useNotificationStore,
  type Notification,
} from "@/store/notificationStore";

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function playNotificationChime() {
  if (typeof window === "undefined") return;

  try {
    if (localStorage.getItem("shopco_notif_sound") === "muted") return;
  } catch {
    // Ignore storage restrictions and continue with the default preference.
  }

  const AudioContextClass =
    window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;

  if (!AudioContextClass) return;

  try {
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      1318.5,
      context.currentTime + 0.14,
    );

    gain.gain.setValueAtTime(0.045, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.38);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.onended = () => {
      void context.close().catch(() => undefined);
    };

    oscillator.start();
    oscillator.stop(context.currentTime + 0.4);

    if (context.state === "suspended") {
      void context.resume().catch(() => undefined);
    }
  } catch {
    // Audio can be unavailable until a user gesture or due to browser settings.
  }
}

function getToastVisuals(title = "", message = "") {
  const content = `${title} ${message}`.toLocaleLowerCase();

  if (
    ["ship", "deliver", "transit", "courier"].some((word) =>
      content.includes(word),
    )
  ) {
    return {
      Icon: Truck,
      label: "Shipping update",
      iconStyle: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
    };
  }

  if (
    ["cancel", "fail", "alert", "refund", "issue"].some((word) =>
      content.includes(word),
    )
  ) {
    return {
      Icon: AlertTriangle,
      label: "Attention required",
      iconStyle:
        "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
    };
  }

  if (
    ["confirm", "complete", "success", "paid"].some((word) =>
      content.includes(word),
    )
  ) {
    return {
      Icon: CheckCircle2,
      label: "Order confirmed",
      iconStyle:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
    };
  }

  return {
    Icon: Bell,
    label: "New notification",
    iconStyle:
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100",
  };
}

export default function NotificationListener() {
  const router = useRouter();
  const seenNotificationIds = useRef(new Set<string>());
  const refreshingToken = useRef(false);

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

      addNotification(notification);
      playNotificationChime();

      const { Icon, label, iconStyle } = getToastVisuals(
        notification.title,
        notification.message,
      );

      toast.custom(
        (t) => (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{
              opacity: t.visible ? 1 : 0,
              y: t.visible ? 0 : 8,
              scale: t.visible ? 1 : 0.985,
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
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                    {label}
                  </span>
                </div>

                <p className="mt-1 break-words text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {notification.title || "New notification"}
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
                      toast.dismiss(t.id);
                      router.push(`/shop/orders/${notification.order}`);
                    }}
                    className="
                      mt-3 inline-flex min-h-8 cursor-pointer items-center
                      gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5
                      text-[10px] font-semibold text-white
                      transition-colors hover:bg-neutral-700
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-neutral-900 focus-visible:ring-offset-2
                      dark:bg-neutral-100 dark:text-neutral-950
                      dark:hover:bg-white dark:focus-visible:ring-neutral-200
                    "
                  >
                    <span>
                      View order #
                      {String(notification.order).slice(-6).toUpperCase()}
                    </span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                aria-label="Dismiss notification"
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
          position: "bottom-right",
        },
      );
    },
    [addNotification, router],
  );

  useEffect(() => {
    const socket = createSocket();

    if (!socket) return;

    let disposed = false;

    const handleConnectError = async (error: Error) => {
      if (error.message !== "ACCESS_TOKEN_EXPIRED") return;
      if (refreshingToken.current) return;

      refreshingToken.current = true;

      try {
        const newToken = await refreshAccessToken();

        if (disposed || !newToken) return;

        socket.auth = { token: newToken };
        socket.connect();
      } catch {
        if (!disposed) {
          toast.error("Your session may have expired. Please sign in again.");
        }
      } finally {
        refreshingToken.current = false;
      }
    };

    socket.on("notification", handleIncomingNotification);
    socket.on("new_notification", handleIncomingNotification);
    socket.on("connect_error", handleConnectError);

    return () => {
      disposed = true;

      // Remove only this component's handlers. Do not erase handlers
      // registered by other parts of the application.
      socket.off("notification", handleIncomingNotification);
      socket.off("new_notification", handleIncomingNotification);
      socket.off("connect_error", handleConnectError);

      // Socket connection lifecycle remains managed by the shared socket layer.
    };
  }, [handleIncomingNotification]);

  return null;
}
