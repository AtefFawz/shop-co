"use client";

import { useEffect } from "react";
import { createSocket, refreshAccessToken } from "@/lib/sockets/socket";
import toast from "react-hot-toast";
import { useNotificationStore } from "@/store/notificationStore";

export default function NotificationListener() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    const socket = createSocket();

    if (!socket) {
      console.log("❌ NO SOCKET");
      return;
    }

    socket.on("connect", () => {
      console.log("🔥 SOCKET CONNECTED:", socket.id);
    });

    socket.on("notification", (notification) => {
      // Add to Zustand
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

      socket.disconnect();
    };
  }, [addNotification]);

  return null;
}
