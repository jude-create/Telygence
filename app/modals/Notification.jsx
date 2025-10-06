"use client";
import React, { useRef, useEffect } from "react";
import Portal from "./Portal";

export default function Notification({ notificationModal, handleNotificationModal }) {
  const modalRef = useRef(null);

  const notifications = [
    { id: 1, time: "Today, 11:16 AM", message: "It is a new week! Start your day by drafting a message to your customers" },
    { id: 2, time: "Today, 11:05 AM", message: "You just set a new task" },
    { id: 3, time: "Today, 11:05 AM", message: "You have a new message on WhatsApp Business" },
    { id: 4, time: "Mon 12/09, 2:09 AM", message: "You have a new message from LinkedIn" },
    { id: 5, time: "Mon 12/09, 2:09 AM", message: "You have a new message from Slack" },
     { id: 6, time: "Mon 12/09, 2:09 AM", message: "You have a new message from LinkedIn" },
    { id: 7, time: "Mon 12/09, 2:09 AM", message: "You have a new message from LinkedIn" }
   
  ];

  const isToday = (time) => time.startsWith("Today");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleNotificationModal();
      }
    };

    if (notificationModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationModal, handleNotificationModal]);

  if (!notificationModal) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] bg-black/30 flex justify-end">
        <div
          ref={modalRef}
          className="bg-white w-[22%] h-[90vh] mt-14 mr-6 rounded-xl shadow-lg px-6 py-7 overflow-y-auto transition-transform duration-300 ease-out"
        >
          {notifications.map((notification) => (
            <div key={notification.id} className="space-y-2 mb-4 border-b pb-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{notification.time}</p>
                {isToday(notification.time) && (
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
              </div>
              <p className="text-xs text-gray-700">{notification.message}</p>
            </div>
          ))}
        </div>
      </div>
    </Portal>
  );
}
