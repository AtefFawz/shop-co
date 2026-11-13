import { create } from "zustand";

export type Notification = {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  order?: string;
};

type NotificationStore = {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  appendNotifications: (notifications: Notification[]) => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  setNotifications: (notifications) =>
    set({
      notifications,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification._id === id
          ? { ...notification, read: true }
          : notification,
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),
  appendNotifications: (newNotifications) =>
    set((state) => ({
      notifications: [...state.notifications, ...newNotifications],
    })),
}));
