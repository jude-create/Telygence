'use client';

import React, { useState } from "react";
import { Bars3CenterLeftIcon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Notification from "../modals/Notification";
import { useSidebarStore } from "../store/SidebarStore";
import { useNotificationStore } from "../store/NotificationStore";

const Header = () => {
 const [notificationModal, setNotificationModal] = useState(false);

  const { notifications } = useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleModal = () => {
    setNotificationModal((prev) => !prev);
  };

  const sidebar = useSidebarStore();



  
  return (
    <div
      className=" sticky top-0 w-full h-20 bg-[#775ADA] flex items-center justify-between z-50  px-2 lg:px-12 "
    >
    <button
  className="md:hidden p-2 rounded-md   flex-shrink-0 "
   onClick={sidebar.toggleSidebar}
>
      <Bars3CenterLeftIcon className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
    </button>

      <div className="relative md:flex-1  max-w-full">
        {/* Input Field */}
        <input
          className="w-full border-2 border-[#9983E3] bg-[#654CB9] px-12 py-3 rounded-full 
          focus:outline-none focus:border-[#9983E3] font-light text-sm text-[#DDD6F6] tracking-wider placeholder:text-[#9983E3]"
          type="search"
          placeholder="Search drafts, tasks, or recent conversation..."
        />
        {/* Search Icon (Inside Input) */}
        <MagnifyingGlassIcon className="w-6 h-6 absolute left-5 top-1/2 transform -translate-y-1/2 text-[#DDD6F6]" />
      </div>

      <div className="flex md:space-x-10 space-x-4 justify-end   lg:w-[25%]">
        <Link href="/account">
          <UserCircleIcon
            className="w-7 h-7 text-[#FFFFFF] cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-125 hover:text-[#DDD6F6]"
          />
        </Link>

       <div className="relative">
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
    </div>
  );
};

export default Header;
