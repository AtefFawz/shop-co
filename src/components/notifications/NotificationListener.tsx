"use client";
import { useEffect } from "react";
import { createSocket, refreshAccessToken } from "@/lib/sockets/socket";
import toast from "react-hot-toast";
import { useNotificationStore } from "@/store/notificationStore";
import { useSocketStore } from "@/store/socketStore";

export default function NotificationListener() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const socketReady = useSocketStore((state) => state.socketReady);

  useEffect(() => {
    const socket = createSocket();

    if (!socket) {
      console.log("❌ NO SOCKET");
      return;
    }

    socket.on("connect", () => {
      console.log("🔥 SOCKET CONNECTED:", socket.id);
    });

    // For User
    socket.on("notification", (notification) => {
      // Add to Zustand
      socket.connect();

      addNotification(notification);
      // Show toast
      toast.success(notification.message, {
        duration: 5000,
      });
    });

    // For Admin
    socket.on("new_notification", (notification) => {
      socket.connect();
      addNotification(notification);

      // Show toast
      toast.success(notification.message, {
        duration: 5000,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 SOCKET DISCONNECT:", reason);
    });

    socket.on("connect_error", async (error) => {
      console.log("❌ Socket Error:", error.message);
      console.log("❌ Socket Error:", error);

      if (error.message === "ACCESS_TOKEN_EXPIRED") {
        try {
          console.log("🔄 Refreshing...");

          const newToken = await refreshAccessToken();

          socket.auth = {
            token: newToken,
          };

          socket.connect();
        } catch (error) {
          console.log("❌ Refresh Failed:", error);
        }
      }
      
    });

    return () => {
      socket.off("notification");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("new_notification");

      socket.disconnect();
    };
  }, [addNotification, socketReady]);

  return null;
}
