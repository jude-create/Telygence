import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [
    {
      id: 1,
      message: "New task created",
      time: "Today, 11:16 AM",
      read: false,
    },
    {
      id: 2,
      message: "You got a message",
      time: "Today, 11:05 AM",
      read: false,
    },
    {
      id: 3,
      message: "LinkedIn message",
      time: "Mon 12/09, 2:09 AM",
      read: true,
    },
  ],

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        {
          id: Date.now(),
          read: false,
          ...notif,
        },
        ...state.notifications,
      ],
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        read: true,
      })),
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));