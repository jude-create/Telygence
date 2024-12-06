import {
    ArchiveBoxIcon,
    BookmarkIcon,
    PencilSquareIcon,
    Square2StackIcon,
    TrashIcon,
  } from "@heroicons/react/24/outline";
  import { ShareIcon, StarIcon } from "@heroicons/react/24/solid";
  import Image from "next/image";
  import React from "react";
  
  export const RecentDraft = () => {
    // Array of recent drafts
    const drafts = [
      {
        title: "Professional Summary",
        description: "Thank you for signing up on Telygence. Begin your journey now!",
        time: "11:45 AM",
      },
      {
        title: "Company Overview",
        description: "Draft an outline for your organization's key services and values.",
        time: "10:30 AM",
      },
      {
        title: "Investor Proposal",
        description: "Prepare a detailed proposal letter for potential investors.",
        time: "9:15 AM",
      },
      {
        title: "Marketing Strategy",
        description: "Plan a comprehensive strategy for launching new products.",
        time: "Yesterday",
      },
      {
        title: "Project Timeline",
        description: "Create a timeline for completing key deliverables in Q4.",
        time: "2 days ago",
      },
    ];
  
    return (
      <div className="h-auto w-full bg-[#FFFFFF] rounded-xl mt-5 space-y-5 pb-10">
        {/* Header Section */}
        <div className="flex justify-between px-8 pt-5">
          <div className="flex space-x-2 items-center">
            <Image
              className="w-5 h-5"
              src="/images/pen.png"
              alt="Dashboard Icon"
              height={40}
              width={40}
            />
            <p className="font-light text-lg text-[#001C3D]">Recently drafts</p>
          </div>
          <p className="text-base text-[#775ADA] cursor-pointer hover:underline">
            View all
          </p>
        </div>
  
        {/* Divider */}
        <div className="border-t-4 w-full border-[#EDEDED]" />
  
        {/* Recent drafts */}
        <div className="space-y-6 cursor-pointer">
          {drafts.map((draft, index) => (
            <div key={index} className="flex justify-between px-4 text-base group">
              <p className="truncate w-[30%] font-medium">{draft.title}</p>
              <p className="font-extralight truncate w-[50%]">{draft.description}</p>
              <div className="w-[35%] flex justify-end font-medium transition-all ease-in-out duration-500">
                {/* Initially visible */}
                <p className="group-hover:opacity-0 group-hover:translate-y-2 transition-all ease-in-out duration-500">
                  {draft.time}
                </p>
  
                {/* Hidden initially, shown on hover */}
                <div className="hidden group-hover:flex xl:space-x-7 items-center transition-all ease-in-out duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  <PencilSquareIcon  className="h-5 w-5 text-[#737373]"/>
                  <StarIcon className="h-5 w-5 text-[#FF304F]" />
                  <ArchiveBoxIcon className="h-5 w-5 text-[#737373]" />
                  <TrashIcon className="h-5 w-5 text-[#737373]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  