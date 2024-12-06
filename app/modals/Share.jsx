"use client"
import { XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react'
import { SocialIcon } from 'react-social-icons';

export default function Share({ shareModal, handleShareModal }) {

    const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleShareModal();
      }
    };

    if (shareModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareModal, handleShareModal]);

  return (
    <div
      className={`${
        shareModal == false ? "hidden opacity-0 " : " opacity-100"
      } fixed  top-64 left-96 w-[26%] h-[45vh] bg-gray-800 bg-opacity-60  flex z-[1000] transition-all ease-in-out duration-500`}
    >
      {/* Modal content */}
      <div
        ref={modalRef}
        className="bg-white w-full h-full overflow-y-auto scrollbar-hide cursor-pointer   rounded-xl shadow-lg shadow-[#00000033]"
      >
        {/* Tags grid */}
        <div>
        
      {/* Centered Share Text */}
      <div className='flex justify-between p-2'>
      <div className="flex-grow flex justify-center">
         <p className="font-semibold text-base">Share</p>
     </div>

        {/* Close Icon */}
       <div className="flex justify-end">
       <XMarkIcon
       onClick={handleShareModal}
        className="w-5 h-5 cursor-pointer" />
      </div>
      
      </div>

      <div className="border-t w-full border-[#737373] " />
     
     <div className='py-5 px-8'>
      <div className='bg-[#775ADA] rounded-full p-2 text-center text-[#FFFFFF] '>
      Share as link
      </div>

      <div className='grid grid-cols-4 gap-6 mt-5'>
        <div className='bg-[#FDECEB] w-fit rounded-full p-4'>
            <Image 
            src="/images/gmail.png" 
            alt='Gmail'
            width={25}
            height={25}
            />
        </div>

        <div className='bg-[#FDECEB] w-fit rounded-full p-4'>
            <Image 
            src="/images/slack.png" 
            alt='Slack'
            width={25}
            height={25}
            />
        </div>

        <div className='bg-[#CEE0F3] w-fit rounded-full p-4'>
            <Image 
            src="/images/linkedin.png" 
            alt='Linkedin'
            width={25}
            height={25}
            />
        </div>

        <div className='bg-[#FDECEB] w-fit rounded-full p-4'>
            <Image 
            src="/images/instagram.png" 
            alt='instagram'
            width={25}
            height={25}
            />
        </div>

        <div className='bg-[#CEE0F3] w-fit rounded-full p-4'>
            <Image 
            src="/images/facebook.png" 
            alt='Facebook'
            width={25}
            height={25}
            />
        </div>

        <div className='bg-[#CEE0F3] w-fit rounded-full p-4'>
            <Image 
            src="/images/whatsapp.png" 
            alt='Whatsapp'
            width={25}
            height={25}
            />
        </div>

        <div className='bg-[#CEE0F3] w-fit rounded-full p-4'>
            <Image 
            src="/images/messenger.png" 
            alt='Messenger'
            width={25}
            height={25}
            />
        </div>

        <div className='bg-[#EDEDED] w-fit rounded-full p-4 flex items-center justify-center'>
            <Image
             src="/images/dot.png" 
             alt='Three dot'
             width={25}
             height={25}
            />
        </div>
      </div>
      </div>
      </div>
    

      </div>
    </div>
  )
}
