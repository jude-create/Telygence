import { BookmarkIcon, Square2StackIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ShareIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";

const TemplateCard = () => {
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

  return (
    <div className="h-auto w-full bg-[#FFFFFF] rounded-xl mt-6 space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex justify-between px-8 pt-7">
        <div className="flex space-x-2 items-center">
          <Image
            className="w-6 h-6"
            src="/images/temp.png"
            alt="Dashboard Icon"
            height={40}
            width={40}
          />
          <p className="font-light text-2xl text-[#001C3D]">Recently used templates</p>
        </div>
        <p className="text-xl text-[#775ADA] cursor-pointer hover:underline">View all</p>
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* Template Items */}
      <div className="space-y-12">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border border-[#BABABA] bg-[#EDEDED] px-7 mx-7 rounded-xl space-y-20 lg:space-y-16 pb-10"
          >
            {/* Tag */}
            <div className="flex space-x-2 bg-[#DDD6F6] w-fit py-2 px-4 rounded-full mt-4 items-center">
              <BookmarkIcon className="h-5 w-5 text-[#5943A3]" />
              <p className="text-[#5943A3] text-xl">{template.tag}</p>
            </div>

            {/* Message */}
            <div className="font-normal text-2xl text-[#4D4D4D]">{template.title}</div>
            <div className="text-2xl text-[#4D4D4D] font-normal">
              <p>{template.message}</p>
            </div>

            {/* Meta Info */}
            <div className="text-[#4D4D4D] flex capitalize text-xl space-x-4">
              <p className="w-fit bg-[#D9D9D9] rounded-full px-6 py-2">{template.meta.author}</p>
              <p className="w-fit bg-[#D9D9D9] rounded-full px-6 py-2">{template.meta.date}</p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center">
              <p className="text-[#4D4D4D] text-2xl font-normal">Cheers</p>
              <div className="flex space-x-9">
                <ShareIcon
                  className="w-10 h-10 text-[#737373] cursor-pointer hover:text-[#000000]
                   transition-transform duration-300 ease-in-out hover:scale-110"
                />
                <Square2StackIcon
                  className="w-10 h-10 text-[#737373] cursor-pointer hover:text-[#000000]
                   transition-transform duration-300 ease-in-out hover:scale-110"
                />
                <TrashIcon
                  className="w-10 h-10 text-[#737373] cursor-pointer hover:text-[#000000] 
                  transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateCard;
