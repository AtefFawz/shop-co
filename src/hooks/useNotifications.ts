"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useNotificationStore } from "@/store/notificationStore";

export function useNotifications() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const notifications = useNotificationStore((state) => state.notifications);

  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );

  const appendNotifications = useNotificationStore(
    (state) => state.appendNotifications,
  );

  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/notifications?page=${page}&limit=10`);

        const newNotifications = res.data.data.notifications;

        if (page === 1) {
          setNotifications(newNotifications);
        } else {
          appendNotifications(newNotifications);
        }

        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        console.log("Failed to get notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, [page, setNotifications, appendNotifications]);

  const loadMore = () => {
    if (loading) return;
    if (page >= totalPages) return;

    setPage((prev) => prev + 1);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}`);

      markAsRead(id);
    } catch (error) {
      console.log("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/notifications/readAll");

      markAllAsRead();
    } catch (error) {
      console.log("Failed to mark all notifications as read:", error);
    }
  };

  return {
    notifications,
    unreadCount,

    page,
    totalPages,
    loading,

    loadMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
}
