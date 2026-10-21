"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Bell,
  ArrowUpRight,
  X,
  Truck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { createSocket, refreshAccessToken } from "@/lib/sockets/socket";
import {
  useNotificationStore,
  type Notification,
} from "@/store/notificationStore";
import { useSocketStore } from "@/store/socketStore";

// Subtle Web Audio API Luxury Chime (Zero external file dependencies)
function playAtelierChime() {
  try {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("shopco_notif_sound") === "muted") return;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1318.5, ctx.currentTime + 0.14); // E6

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // Audio autoplay blocked by browser until user interaction
  }
}

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

    const handleIncomingNotification = (notification: Notification) => {
      addNotification(notification);
      playAtelierChime();

      const text = `${notification.title || ""} ${
        notification.message || ""
      }`.toLowerCase();
      const ToastIcon =
        text.includes("ship") || text.includes("deliver")
          ? Truck
          : text.includes("confirm") || text.includes("complete")
            ? CheckCircle2
            : Bell;

      toast.custom(
        (toastItem) => (
          <div
            className={`${
              toastItem.visible ? "animate-enter" : "animate-leave"
            } pointer-events-auto relative flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#111111]/95 p-4 text-white shadow-[0_28px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl`}
          >
            <div className="flex items-start gap-3.5">
              {/* 3D Icon Cube */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#111111] shadow-md">
                <ToastIcon size={19} strokeWidth={2.3} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={10} className="text-amber-400" />
                  <span className="font-mono text-[8.5px] font-black uppercase tracking-[0.22em] text-white/50">
                    LIVE TELEMETRY
                  </span>
                </div>

                <p className="mt-0.5 truncate text-xs font-black uppercase tracking-wider text-white">
                  {notification.title || "New Atelier Update"}
                </p>

                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-300">
                  {notification.message}
                </p>

                {notification.order && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.dismiss(toastItem.id);
                      router.push(`/shop/orders/${notification.order}`);
                    }}
                    className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-wider text-[#111111] shadow-xs transition hover:bg-emerald-400"
                  >
                    <span>
                      Inspect Order #
                      {String(notification.order).slice(-6).toUpperCase()}
                    </span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => toast.dismiss(toastItem.id)}
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-neutral-400 transition hover:bg-white/20 hover:text-white"
              >
                <X size={13} />
              </button>
            </div>
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
