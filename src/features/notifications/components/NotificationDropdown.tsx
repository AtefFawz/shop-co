"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { Notification } from "@/store/notificationStore";
import { useNotifications } from "@/hooks/useNotifications";

import NotificationHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";
import NotificationFooter from "./NotificationFooter";

export type FilterTab = "all" | "unread" | "orders";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  const {
    notifications,
    unreadCount,
    page,
    totalPages,
    loading,
    loadMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications();

  const filteredNotifications = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();

    return notifications.filter((notification) => {
      if (activeTab === "unread" && notification.read) return false;

      if (activeTab === "orders" && !notification.order) return false;

      if (!query) return true;

      return [
        notification.title,
        notification.message,
        notification.order,
      ].some((value) =>
        String(value ?? "")
          .toLocaleLowerCase()
          .includes(query),
      );
    });
  }, [notifications, activeTab, searchQuery]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, []);

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      setOpen(false);

      if (notification.order) {
        router.push(`/shop/orders/${notification.order}`);
      }

      if (!notification.read) {
        try {
          await handleMarkAsRead(notification._id);
        } catch {
          // Opening an alert should still work if marking it as read fails.
        }
      }
    },
    [handleMarkAsRead, router],
  );

  // Close on outside interaction or Escape.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeDropdown]);

  const toggleDropdown = () => {
    setOpen((current) => !current);
  };

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 380, damping: 30 };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Notification trigger */}
      <motion.button
        ref={triggerRef}
        type="button"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggleDropdown}
        whileHover={reduceMotion ? undefined : { y: -1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        className={`
          group relative flex h-10 w-10 cursor-pointer
          items-center justify-center rounded-2xl border
          outline-none transition-colors duration-200
          focus-visible:ring-2 focus-visible:ring-neutral-900
          focus-visible:ring-offset-2
          dark:focus-visible:ring-neutral-200
          dark:focus-visible:ring-offset-neutral-950
          ${
            open
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-200 dark:bg-neutral-100 dark:text-neutral-950"
              : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
          }
        `}
      >
        {unreadCount > 0 && !open && !reduceMotion && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-ping rounded-2xl bg-rose-500/10 [animation-duration:2.5s] dark:bg-rose-400/10"
          />
        )}

        <motion.span
          animate={
            unreadCount > 0 && !open && !reduceMotion
              ? { rotate: [0, -10, 10, -7, 7, 0] }
              : { rotate: 0 }
          }
          transition={{
            duration: 0.65,
            repeat: unreadCount > 0 && !open && !reduceMotion ? Infinity : 0,
            repeatDelay: 5,
          }}
          className="relative z-10 flex"
        >
          <Bell size={18} strokeWidth={2} />
        </motion.span>

        <AnimatePresence initial={false}>
          {unreadCount > 0 && (
            <motion.span
              initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={transition}
              className="
                absolute -right-1 -top-1 z-20 flex h-5
                min-w-5 items-center justify-center rounded-full
                bg-rose-600 px-1 font-mono text-[9px]
                font-bold leading-none text-white
                ring-2 ring-white dark:ring-neutral-950
              "
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <motion.button
              type="button"
              aria-label="Close notification panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.16 }}
              onClick={closeDropdown}
              className="
                fixed inset-0 z-40 cursor-default bg-black/25
                backdrop-blur-[2px] sm:hidden
              "
            />

            {/* Notification panel */}
            <motion.div
              id={panelId}
              role="dialog"
              aria-label="Notifications"
              aria-modal="false"
              initial={
                reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 6, scale: 0.985 }
              }
              transition={transition}
              className="
                fixed inset-x-3 top-19 z-50 mx-auto
                flex max-h-[min(78dvh,680px)] w-auto
                max-w-[430px] flex-col overflow-hidden
                rounded-3xl border border-neutral-200
                bg-[#F7F6F3] shadow-[0_24px_70px_rgba(0,0,0,0.18)]
                dark:border-neutral-700 dark:bg-neutral-900
                dark:shadow-[0_24px_70px_rgba(0,0,0,0.5)]
                sm:absolute sm:inset-x-auto sm:right-0
                sm:top-[calc(100%+12px)] sm:mx-0 sm:w-[420px]
                sm:max-h-[min(650px,calc(100dvh-100px))]
              "
              style={{ transformOrigin: "top right" }}
            >
              <NotificationHeader
                unreadCount={unreadCount}
                totalCount={notifications.length}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClose={closeDropdown}
              />

              <NotificationList
                notifications={filteredNotifications}
                activeTab={activeTab}
                loading={loading && notifications.length === 0}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery("")}
                onNotificationClick={handleNotificationClick}
                onMarkAsRead={handleMarkAsRead}
              />

              <NotificationFooter
                hasMore={page < totalPages}
                loading={loading}
                currentPage={page}
                totalPages={totalPages}
                totalCount={notifications.length}
                onLoadMore={loadMore}
                onClose={closeDropdown}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
