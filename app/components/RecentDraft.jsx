import {
    ArchiveBoxIcon,
    BookmarkIcon,
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
      <div className="h-auto w-full bg-[#FFFFFF] rounded-xl mt-6 space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex justify-between px-8 pt-7">
          <div className="flex space-x-2 items-center">
            <Image
              className="w-6 h-6"
              src="/images/pen.png"
              alt="Dashboard Icon"
              height={40}
              width={40}
            />
            <p className="font-light text-2xl text-[#001C3D]">Recently drafts</p>
          </div>
          <p className="text-xl text-[#775ADA] cursor-pointer hover:underline">
            View all
          </p>
        </div>
  
        {/* Divider */}
        <div className="border-t-4 w-full border-[#EDEDED]" />
  
        {/* Recent drafts */}
        <div className="space-y-11 cursor-pointer">
          {drafts.map((draft, index) => (
            <div key={index} className="flex justify-between px-8 text-2xl group">
              <p className="truncate w-[25%] font-medium">{draft.title}</p>
              <p className="font-extralight truncate w-[40%]">{draft.description}</p>
              <div className="w-[35%] flex justify-end font-medium transition-all ease-in-out duration-500">
                {/* Initially visible */}
                <p className="group-hover:opacity-0 group-hover:translate-y-2 transition-all ease-in-out duration-500">
                  {draft.time}
                </p>
  
                {/* Hidden initially, shown on hover */}
                <div className="hidden group-hover:flex xl:space-x-7 items-center transition-all ease-in-out duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  <Image
                    src="/images/lightpen.png"
                    className="md:w-8 md:h-8 h-2 w-2"
                    alt="draft icon"
                    height={30}
                    width={30}
                  />
                  <StarIcon className="h-8 w-8 text-[#FF304F]" />
                  <ArchiveBoxIcon className="h-8 w-8 text-[#737373]" />
                  <TrashIcon className="h-8 w-8 text-[#737373]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  