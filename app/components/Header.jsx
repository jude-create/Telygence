'use client';

import React, { useEffect, useState } from "react";
import { Bars3CenterLeftIcon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Notification from "../modals/Notification";
import { useSidebarStore } from "../store/SidebarStore";
import { useNotificationStore } from "../store/NotificationStore";

const Header = () => {
 const [notificationModal, setNotificationModal] = useState(false);

  const { notifications } = useNotificationStore();
  const hydrateNotifications = useNotificationStore((state) => state.hydrateNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    hydrateNotifications();
  }, [hydrateNotifications]);

  const toggleModal = () => {
    setNotificationModal((prev) => !prev);
  };

  const sidebar = useSidebarStore();



  
  return (
    <header className="sticky top-0 w-full min-h-[72px] bg-[#775ADA] flex items-center justify-between z-40 px-3 sm:px-5 lg:px-8 gap-3 shadow-sm">
    <button
      className="md:hidden p-2 rounded-lg flex-shrink-0 text-white hover:bg-white/10 active:bg-white/20"
      onClick={sidebar.openMobileDrawer}
      aria-label="Open navigation menu"
>
      <Bars3CenterLeftIcon className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
    </button>

      <div className="relative flex-1 max-w-2xl min-w-0 hidden sm:block">
        {/* Input Field */}
        <input
          className="w-full border border-white/20 bg-[#654CB9] px-11 py-2.5 rounded-full 
          focus:outline-none focus:ring-2 focus:ring-white/30 font-light text-sm text-[#F4F1FF] placeholder:text-[#CFC5F4]"
          type="search"
          placeholder="Search drafts, tasks, or recent conversation..."
        />
        {/* Search Icon (Inside Input) */}
        <MagnifyingGlassIcon className="w-6 h-6 absolute left-5 top-1/2 transform -translate-y-1/2 text-[#DDD6F6]" />
      </div>

      <div className="flex items-center gap-2 sm:gap-4 justify-end">
        <Link href="/account" className="p-2 rounded-full hover:bg-white/10" aria-label="My account">
          <UserCircleIcon
            className="w-7 h-7 text-[#FFFFFF] cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-125 hover:text-[#DDD6F6]"
          />
        </Link>

       <div className="relative p-2 rounded-full hover:bg-white/10">
        <BellIcon
          onClick={toggleModal}
          className="w-7 h-7 text-white cursor-pointer"
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      </div>

      {/* Notification Modal */}
      <Notification
        notificationModal={notificationModal}
        handleNotificationModal={toggleModal}
      />
    </header>
  );
};

export default Header;
