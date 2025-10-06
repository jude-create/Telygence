'use client';

import React, { useState } from "react";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Notification from "../modals/Notification";

const Header = () => {
  const [notificationModal, setNotificationModal] = useState(false);

  // Function to handle the Notification modal
  const handleNotificationModal = () => {
    setNotificationModal(!notificationModal);
  };

  return (
    <div
      className=" fixed w-full h-20 bg-[#775ADA] flex justify-between items-center px-6 lg:px-12 "
    >
    
      <div className="relative flex-1  max-w-[50%]">
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

      <div className="flex space-x-10 w-[30%] lg:w-[25%]">
        <Link href="/account">
          <UserCircleIcon
            className="w-7 h-7 text-[#FFFFFF] cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-125 hover:text-[#DDD6F6]"
          />
        </Link>

        <div className="relative" onClick={handleNotificationModal}>
          {/* Bell Icon */}
          <BellIcon
            className="w-7 h-7 text-[#FFFFFF] cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-125 hover:text-[#DDD6F6]"
          />
          {/* Notification Badge */}
          <div className="absolute top-0 right-1 border-2 border-[#FFFFFF] bg-[#FF304F] w-3 h-3 rounded-full"></div>
        </div>
      </div>

      {/* Notification Modal */}
      <Notification
        notificationModal={notificationModal}
        handleNotificationModal={handleNotificationModal}
      />
    </div>
  );
};

export default Header;
