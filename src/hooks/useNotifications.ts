"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { useNotificationStore } from "@/store/notificationStore";

type NotificationQuery = {
  keyword?: string;
  unreadOnly?: boolean;
  orderOnly?: boolean;
};

export function useNotifications(query: NotificationQuery = {}) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const appendNotifications = useNotificationStore((state) => state.appendNotifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const keyword = (query.keyword || "").trim();
  const queryKey = JSON.stringify({ keyword, unreadOnly: !!query.unreadOnly, orderOnly: !!query.orderOnly });
  const previousQueryKey = useRef(queryKey);
  const requestPage = previousQueryKey.current === queryKey ? page : 1;

  useEffect(() => {
    if (previousQueryKey.current !== queryKey) {
      previousQueryKey.current = queryKey;
      if (page !== 1) setPage(1);
    }
  }, [queryKey, page]);

  useEffect(() => {
    const controller = new AbortController();
    const getNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get("notifications", {
          params: {
            page: requestPage,
            limit: 10,
            keyword: keyword || undefined,
            unreadOnly: query.unreadOnly ? "true" : undefined,
            orderOnly: query.orderOnly ? "true" : undefined,
          },
          signal: controller.signal,
        });
        const newNotifications = res.data.data.notifications;
        if (requestPage === 1) setNotifications(newNotifications);
        else appendNotifications(newNotifications);
        setTotalPages(Math.max(1, Number(res.data.pagination.totalPages) || 1));
        setUnreadCount(Number(res.data.unreadCount) || 0);
        setTotalCount(Number(res.data.totalCount) || 0);
      } catch (error) {
        if (!controller.signal.aborted) console.error("Failed to get notifications:", error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    getNotifications();
    return () => controller.abort();
  }, [requestPage, queryKey, keyword, query.unreadOnly, query.orderOnly, setNotifications, appendNotifications]);

  const loadMore = useCallback(() => {
    if (loading || page >= totalPages) return;
    setPage((prev) => prev + 1);
  }, [loading, page, totalPages]);

  const handleMarkAsRead = async (id: string) => {
    const target = notifications.find((notification) => notification._id === id);
    try {
      await api.patch(`notifications/${id}`);
      markAsRead(id);
      if (target && !target.read) setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("notifications/readAll");
      markAllAsRead();
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    totalCount,
    page,
    totalPages,
    loading,
    loadMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
}
