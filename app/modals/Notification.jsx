"use client";
import React, { useRef, useEffect } from "react";

const Notification = ({ notificationModal, handleNotificationModal }) => {
  const modalRef = useRef(null);

  // Sample notifications array
  const notifications = [
    { id: 1, time: "Today, 11:16 AM", message: "It is a new week! Start your day by drafting a message to your customers" },
    { id: 2, time: "Today, 11:05 AM", message: "You just set a new task" },
    { id: 3, time: "Today, 11:05 AM", message: "You have a new message on WhatsApp Business" },
    { id: 4, time: "Mon 12/09, 2:09 AM", message: "You have a new message from LinkedIn" },
    { id: 5, time: "Mon 12/09, 2:09 AM", message: "You have a new message from Slack" },
    { id: 6, time: "Wed 12/09, 2:09 AM", message: "You have one new mail" },
    { id: 7, time: "Thur 12/09, 2:09 AM", message: "You have one new mail" },
    { id: 8, time: "Fri 12/09, 2:09 AM", message: "You have one new mail" },
    { id: 9, time: "Fri 12/09, 2:09 AM", message: "You have one new mail" },
    { id: 10, time: "Fri 12/09, 2:09 AM", message: "You have one new mail" },
    { id: 11, time: "Fri 12/09, 2:09 AM", message: "You have one new mail" },
  ];

  // Helper function to check if a notification is "today"
  const isToday = (time) => time.startsWith("Today");

  // Close modal when clicking outside
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

  return (
    <div
      className={`${
        notificationModal ? "opacity-100" : "hidden opacity-0"
      } fixed top-14 right-6 w-[20%] h-[90vh] flex z-[1000]`}
    >
      {/* Modal content */}
      <div
        ref={modalRef}
        className="bg-white w-full h-full   overflow-y-auto scrollbar-hide scrollbar-show  cursor-pointer px-6 py-7 rounded-xl shadow-sm shadow-black space-y-7"
      >
        {notifications.map((notification) => (
          <div key={notification.id} className="space-y-2   ">
            <div className="flex justify-between">
              <p className="text-sm text-[#737373]">{notification.time}</p>
              {isToday(notification.time) && (
                <div className="border-2 bg-[#FF304F] w-3 h-3 rounded-full"></div>
              )}
            </div>
            <div className="text-sm">{notification.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
