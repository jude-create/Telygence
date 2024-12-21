"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

const ShareModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Close the modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null; // Don't render the modal if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-[90%] sm:w-[350px]"
      >
        {/* Modal Header */}
        {/* Centered Share Text */}
      <div className='flex justify-between p-3'>
      <div className="flex-grow flex justify-center">
         <p className="font-semibold text-base">Share</p>
     </div>

        {/* Close Icon */}
       <div className="flex justify-end">
       <XMarkIcon
       onClick={onClose}
        className="w-5 h-5 cursor-pointer" />
      </div>
      
      </div>

        <div className="border-t w-full border-[#737373] mb-2" />
        
        <div className='py-5 px-8'>
        {/* Share Link Button */}
        <button className="w-full bg-[#775ADA] text-white py-2 rounded-lg mb-4">
          Share as link
        </button>

        {/* Sharing Options */}
        <div className="grid grid-cols-4 gap-6 mt-4">
          {/* Gmail */}
          <div className="bg-[#FDECEB] w-fit rounded-full p-3 flex items-center justify-center">
            <Image src="/images/gmail.png" alt="Gmail" width={25} height={25} />
          </div>
          {/* Slack */}
          <div className="bg-[#FDECEB] w-fit rounded-full p-3 flex items-center justify-center">
            <Image src="/images/slack.png" alt="Slack" width={25} height={25} />
          </div>
          {/* LinkedIn */}
          <div className="bg-[#CEE0F3] w-fit rounded-full p-3 flex items-center justify-center">
            <Image
              src="/images/linkedin.png"
              alt="LinkedIn"
              width={25}
              height={25}
            />
          </div>
          {/* Instagram */}
          <div className="bg-[#FDECEB] w-fit rounded-full p-3 flex items-center justify-center">
            <Image
              src="/images/instagram.png"
              alt="Instagram"
              width={25}
              height={25}
            />
          </div>
          {/* Facebook */}
          <div className="bg-[#CEE0F3] w-fit rounded-full p-3 flex items-center justify-center">
            <Image
              src="/images/facebook.png"
              alt="Facebook"
              width={25}
              height={25}
            />
          </div>
          {/* WhatsApp */}
          <div className="bg-[#CEE0F3] w-fit rounded-full p-3 flex items-center justify-center">
            <Image
              src="/images/whatsapp.png"
              alt="WhatsApp"
              width={25}
              height={25}
            />
          </div>
          {/* Messenger */}
          <div className="bg-[#CEE0F3] w-fit rounded-full p-3 flex items-center justify-center">
            <Image
              src="/images/messenger.png"
              alt="Messenger"
              width={25}
              height={25}
            />
          </div>
          {/* More */}
          <div className="bg-[#EDEDED] w-fit rounded-full p-3 flex items-center justify-center">
            <Image
              src="/images/dot.png"
              alt="Three dots"
              width={25}
              height={25}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
