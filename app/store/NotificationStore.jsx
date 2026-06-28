"use client";

import { create } from "zustand";

function formatNotificationTime(date = new Date()) {
  return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    message: "Welcome to Telygence",
    time: "Today",
    read: false,
  },
];

function loadNotifications() {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  try {
    const saved = window.localStorage.getItem("telygence-notifications");
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

function persistNotifications(notifications) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("telygence-notifications", JSON.stringify(notifications));
}

export const useNotificationStore = create((set) => ({
  notifications: DEFAULT_NOTIFICATIONS,

  hydrateNotifications: () => set({ notifications: loadNotifications() }),

  addNotification: (notif) =>
    set((state) => {
      const notifications = [
        {
          id: Date.now(),
          read: false,
          time: formatNotificationTime(),
          ...notif,
        },
        ...state.notifications,
      ];
      persistNotifications(notifications);
      return { notifications };
    }),

  markAllAsRead: () =>
    set((state) => {
      const notifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
      persistNotifications(notifications);
      return { notifications };
    }),

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      persistNotifications(notifications);
      return { notifications };
    }),

  deleteNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      persistNotifications(notifications);
      return { notifications };
    }),

  clearNotifications: () => {
    persistNotifications([]);
    set({ notifications: [] });
  },
}));
