"use client"
import { FaceSmileIcon, LinkIcon, Square2StackIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon, BoldIcon, ItalicIcon, ListBulletIcon, NumberedListIcon, PlusCircleIcon, PlusIcon, UnderlineIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React,  { useState } from 'react'

const Template = ({templateModal, handleTemplateModal}) => {
  
    const [tag, setTag] = useState("");
    const [message, setMessage] = useState("");
   

    
    return (
    <>
    {/* Modal for adding new address */}
    <div
      className={`${
        templateModal == false ? "hidden opacity-0" : "opacity-100" // Conditional rendering of modal based on addAddressModal prop
      } fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-60 z-[1000] `}
    >
      {/* Modal content */}
      <div className="bg-white w-[60%] h-[96%] overflow-y-auto  rounded-2xl">
        {/* Modal header */}
        <div className="flex justify-between px-10 py-8">
       
          <p className="font-bold text-2xl text-[#000000] tracking-wider">Create a new template</p>
        
        <XMarkIcon
        onClick={handleTemplateModal}
         className='h-10 w-10' />
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED] " />
        <div className='px-10 mt-12 '>
        {/* Template input field */}
        <div className='border-[#DEDEDE] bg-[#F5F5F5] border-2 w-full rounded-xl p-10 space-y-16 '>
            <div className='space-y-6'>
            <p className='text-2xl text-[#000]'>Create a tag or add from previously created tags</p>
            <div className='flex justify-between'>
                   <input 
                     className="w-[93%] border border-[#BABABA] h-16 rounded-lg px-5 placeholder:text-2xl placeholder:font-light text-2xl tracking-wider"
                    placeholder="Enter tag name"
                    type='text'
                   value={tag}
                  onChange={(e) => setTag(e.target.value)} 

                   />
                   <div className='bg-[#DDD6F6] w-fit h-fit rounded-full p-4'>
                   <PlusIcon className='w-10 h-10 text-[#5943A3] cursor-pointer' />
                   </div>
                </div>
            </div>

            <div className='space-y-6'>
            <p className='text-2xl'>Write message content</p>
            <div className='flex justify-between'>
                  
                   <textarea
                      className="w-[93%] border border-[#BABABA] h-96 rounded-lg p-7 placeholder:text-2xl 
                      placeholder:font-light text-2xl resize-none  "
                    placeholder="Write content here, use the plus icon to add placeholders while writing"
                    type='text'
                   value={message}
                  onChange={(e) => setMessage(e.target.value)} 

                   />
                   <div className='bg-[#DDD6F6] w-fit h-fit rounded-full p-4'>
                   <PlusIcon className='w-10 h-10 text-[#5943A3] cursor-pointer' />
                   </div>
                </div>
            </div>

            <div>

            </div>

            <div  className='flex justify-between text-[#737373]  md:w-[92%] '>
            <div className='flex space-x-6'>
            <BoldIcon className='w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110'/>
            <ItalicIcon  className='w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
            <UnderlineIcon  className='w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
            <div className='border-l-2 h-12 border-[#737373]'/>
            <ListBulletIcon className='w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
             <NumberedListIcon className='w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
             <div className='border-l-2 h-12 border-[#737373]'/>
             <LinkIcon  className='w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110 '/>
             <FaceSmileIcon className='w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110 '/>

            </div>

            <div className='flex space-x-6 '>
                <ArrowUturnLeftIcon className='w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
                <ArrowUturnRightIcon className='w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110'/>
                <Square2StackIcon
                  className="w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110"
                />
                <TrashIcon
                  className="w-10 h-10 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110 " />
            </div>
            
            </div>
           
        </div>
        </div>
       
        <div className="mt-14 flex justify-between  px-10">
  <div>
    {/* Gradient Text Button */}
    <button className="border-2 border-blue-700 w-fit py-6 px-24 rounded-full transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#775ADA] to-[#1E95BB] text-2xl">
        Change writing style with AI
      </p>
    </button>
  </div>

  <div className="space-x-14">
    {/* Cancel Button */}
    <button className="w-fit py-6 px-14 bg-[#DDD6F6] text-[#1E1636] rounded-lg text-2xl transition-transform duration-300 ease-in-out hover:bg-[#BEB6E5] hover:scale-105 hover:shadow-md">
      Cancel
    </button>

    {/* Create Button */}
    <button className="w-fit py-6 px-14 bg-[#775ADA] text-2xl text-[#FFFFFF] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#5F48C2] hover:scale-105 hover:shadow-md">
      Create
    </button>
  </div>
</div>

      </div>
    </div>
     {/* Add address modal */}
    
  </>
    )
}

export default Template
