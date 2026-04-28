"use client";
import React, { useRef, useEffect, useState } from "react";
import Portal from "./Portal";
import { useNotificationStore } from "../store/NotificationStore";


export default function Notification({ notificationModal, handleNotificationModal }) {
  const modalRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const {
    notifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
  } = useNotificationStore();

  const isToday = (time) => time.startsWith("Today");

  // Animate in/out
  useEffect(() => {
    if (notificationModal) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 200); // match duration
    }
  }, [notificationModal]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleNotificationModal();
      }
    };

    if (notificationModal) {
      document.addEventListener("mousedown", handler);
    }

    return () => document.removeEventListener("mousedown", handler);
  }, [notificationModal, handleNotificationModal]);

  if (!visible) return null;

  return (
    <Portal>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9999] flex justify-end items-end sm:items-start
          ${notificationModal ? "bg-black/40" : "bg-black/0"}
          transition-all duration-200`}
      >
        {/* Panel */}
        <div
          ref={modalRef}
          className={`
            w-full max-h-[80vh] rounded-t-2xl p-4
            sm:w-80 sm:max-h-[85vh] sm:mt-16 sm:mr-6 sm:rounded-2xl
            bg-white shadow-2xl flex flex-col overflow-hidden
            transition-all duration-200 ease-out

            ${
              notificationModal
                ? "translate-y-0 opacity-100 sm:translate-y-0 sm:translate-x-0"
                : "translate-y-6 opacity-0 sm:translate-y-0 sm:translate-x-6"
            }
          `}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3 border-b pb-3">
            <p className="text-sm font-semibold text-gray-800">
              Notifications
            </p>

            <button
              onClick={markAllAsRead}
              className="text-xs text-[#775ADA] font-medium"
            >
              Mark all
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 space-y-2">
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">
                No notifications
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`flex justify-between gap-3 p-3 rounded-lg cursor-pointer transition
                    ${!n.read ? "bg-[#F8F7FF]" : "hover:bg-gray-50"}
                  `}
                >
                  <div className="flex-1">
                    <p className="text-xs text-gray-800">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {n.time.split(", ")[1] || n.time}
                    </p>
                  </div>

                  {!n.read && (
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="text-[10px] text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t pt-3 mt-3">
            <button
              onClick={handleNotificationModal}
              className="w-full text-xs text-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}