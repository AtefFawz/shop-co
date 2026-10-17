"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Bell, ArrowUpRight, X } from "lucide-react";

import { createSocket, refreshAccessToken } from "@/lib/sockets/socket";
import {
  useNotificationStore,
  type Notification,
} from "@/store/notificationStore";
import { useSocketStore } from "@/store/socketStore";

export default function NotificationListener() {
  const router = useRouter();
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const socketReady = useSocketStore((state) => state.socketReady);

  useEffect(() => {
    const socket = createSocket();

    if (!socket) {
      return;
    }

    // دالة موحدة لعرض Toast فخم متناسق مع هوية SHOP.CO
    const handleIncomingNotification = (notification: Notification) => {
      addNotification(notification);

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } pointer-events-auto flex w-full max-w-sm items-start gap-3.5 rounded-2xl border border-white/15 bg-[#080808]/95 p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black shadow-sm">
              <Bell size={18} strokeWidth={2.3} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black uppercase tracking-wider text-white">
                {notification.title || "New Update"}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-300">
                {notification.message}
              </p>

              {notification.order && (
                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(t.id);
                    router.push(`/shop/orders/${notification.order}`);
                  }}
                  className="mt-2.5 inline-flex cursor-pointer items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-black"
                >
                  <span>View Order</span>
                  <ArrowUpRight size={11} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        ),
        { duration: 5000, position: "bottom-right" },
      );
    };

    socket.on("connect", () => {
      console.log("🔥 SOCKET CONNECTED:", socket.id);
    });

    socket.on("notification", handleIncomingNotification);
    socket.on("new_notification", handleIncomingNotification);

    socket.on("disconnect", (reason) => {
      console.log("🔴 SOCKET DISCONNECT:", reason);
    });

    socket.on("connect_error", async (error) => {
      if (error.message === "ACCESS_TOKEN_EXPIRED") {
        try {
          const newToken = await refreshAccessToken();
          socket.auth = { token: newToken };
          socket.connect();
        } catch (refreshError) {
          console.error("❌ Refresh Failed:", refreshError);
        }
      }
    });

    return () => {
      socket.off("connect");
      socket.off("notification", handleIncomingNotification);
      socket.off("new_notification", handleIncomingNotification);
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [addNotification, socketReady, router]);

  return null;
}
