import { BookmarkIcon, Square2StackIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ShareIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";
import Share from "../modals/Share";

const TemplateCard = ({ handleShareModal }) => {

  const [shareModal, setShareModal] = useState(false);
  const [activeShareModalId, setActiveShareModalId] = useState(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  // Template data
  const templates = [
    {
      id: 1,
      tag: "Job hunt cold emails",
      title: "Hi Joel",
      message: `I sent you a message a few weeks back. To follow up, I'd love to connect to discuss Topic. 
      Are you free sometime in the next couple of days for a quick chat? Let me know, thanks!`,
      meta: { author: "David", date: "09/26/2024" },
    },
    {
      id: 2,
      tag: "Networking ",
      title: "Hello Alex",
      message: `It was great meeting you at the conference. I'd love to stay in touch and learn more about 
      your work. Are you available for a quick call this week?`,
      meta: { author: "Sophia", date: "09/25/2024" },
    }
    
  ];

  const handleCopyToClipboard = () => {
    const textToCopy = "Sample text to copy"; // Replace with your desired text
    navigator.clipboard.writeText(textToCopy).then(() => {
      setShowCopiedMessage(true); // Show "Copied to clipboard" message
  
      
       // Hide the message after 2 seconds
       setTimeout(() => {
        setShowCopiedMessage(false);
      }, 2000);
    })
  };
  
 

  return (
    <>
    <div className="h-auto w-full bg-[#FFFFFF] rounded-xl mt-6 space-y-5 pb-10">
      {/* Header Section */}
      <div className="flex justify-between px-7 pt-5">
        <div className="flex space-x-2 items-center">
          <Image
            className="w-5 h-5"
            src="/images/temp.png"
            alt="Dashboard Icon"
            height={40}
            width={40}
          />
          <p className="font-light text-lg text-[#001C3D]">Recently used templates</p>
        </div>
        <p className="text-base text-[#775ADA] cursor-pointer hover:underline">View all</p>
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* Template Items */}
      <div className="space-y-7">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border border-[#BABABA] bg-[#EDEDED] px-7 mx-6 rounded-xl space-y-12 lg:space-y-7 pb-7"
          >
            {/* Tag */}
            <div className="flex space-x-2 bg-[#DDD6F6] w-fit py-2 px-4 rounded-full mt-4 items-center">
              <BookmarkIcon className="h-4 w-4 text-[#5943A3]" />
              <p className="text-[#5943A3] text-sm">{template.tag}</p>
            </div>

            {/* Message */}
            <div className="font-normal text-base text-[#4D4D4D]">{template.title}</div>
            <div className="text-base text-[#4D4D4D] font-normal">
              <p>{template.message}</p>
            </div>

            {/* Meta Info */}
            <div className="text-[#4D4D4D] flex capitalize text-sm space-x-4">
              <p className="w-fit bg-[#D9D9D9] rounded-full px-6 py-2">{template.meta.author}</p>
              <p className="w-fit bg-[#D9D9D9] rounded-full px-6 py-2">{template.meta.date}</p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center">
              <p className="text-[#4D4D4D] text-base font-normal">Cheers</p>
              <div className="flex space-x-8 relative">
              <ShareIcon
                    onClick={() => handleShareModal(template.id)} // Open modal for specific template
                    className="w-6 h-6 text-[#737373] cursor-pointer hover:text-[#000000]
                   transition-transform duration-300 ease-in-out hover:scale-110"
                  />
                <Square2StackIcon
                onClick={handleCopyToClipboard}
                  className="w-6 h-6 text-[#737373] cursor-pointer hover:text-[#000000]
                   transition-transform duration-300 ease-in-out hover:scale-110"
                />
                <TrashIcon
                  className="w-6 h-6 text-[#737373] cursor-pointer hover:text-[#000000] 
                  transition-transform duration-300 ease-in-out hover:scale-110"
                />
                   {/* Copied to Clipboard Message */}
       {showCopiedMessage && (
        <div className="absolute -top-10 right-5 bg-[#1E95BB] text-[#FFFFFF] text-sm w-max px-4 py-2 rounded-md shadow-md">
        Copied to clipboard!
        </div>
      )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>


  {/** Share Modal */}
  {activeShareModalId && (
        <Share
          shareModal={true}
          handleShareModal={() => setActiveShareModalId(null)} // Close modal
          template={templates.find((template) => template.id === activeShareModalId)} // Pass selected template data
        />
      )}
    </>
  );
};

export default TemplateCard;
