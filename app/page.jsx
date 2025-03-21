"use client";
import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/solid";
import TemplateCard from "./components/TemplateCard";
import Suggestion from "./components/Suggestion";
import { RecentDraft } from "./components/RecentDraft";
import RecentTask from "./components/RecentTask";
import { useState } from "react";
import Template from "./modals/Template";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Share from "./modals/Share";
import Link from "next/link";

export default function Home() {
  const [templateModal, setTemplateModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);

  // Function to handle the "Create Template" modal
  const handleTemplateModal = () => {
    setTemplateModal(!templateModal);
  };

  // Function to toggle the Share modal and set the active template
  const handleShareModal = (template) => {
    setActiveTemplate(template);
    setShareModal(!shareModal);
  };

  return (
    <>
      <div className="p-7 mt-20">
        <div className="flex  flex-row space-y-0 space-x-5 w-full">
          {/* Welcome Section */}
          <div className=" w-[60%] flex flex-row justify-between px-8 items-center h-14 bg-white rounded-xl">
            <div className="flex items-center xl:space-x-3 space-x-0">
              <p className="text-base md:text-xl font-medium">Welcome, Joey!</p>
              <Image
                src="/images/hand.png"
                alt="hand"
                width={30}
                height={30}
                className="w-7 h-7"
              />
            </div>
            <p className="font-normal text-sm text-[#737373] md:text-base mt-0">
              It’s 8:02 PM, Wed, Jul 24, 2024
            </p>
          </div>

          {/* Buttons Section */}
          <div className="w-[40%] flex  space-y-0 flex-row space-x-4">
            {/* Create Template Button */}
            <button
              onClick={handleTemplateModal}
              className="flex justify-center items-center rounded-lg bg-custom-radial w-full h-14 
             text-base md:text-lg font-bold tracking-wide text-white transition-all ease-in-out duration-500 
             hover:bg-[#C9F1FE80] hover:tracking-wider"
            >
              Create a template
              <PlusIcon className="w-7 h-7 text-white xl:ml-2" />
            </button>

            {/* Write Button */}
            
            <Link
            className="w-[40%]"
            href="/drafts"
            >
            <button
              className="flex justify-center items-center  tracking-wider border-4 border-[#1E95BB]  h-14 bg-[#C9F1FE80] p-4
             rounded-lg text-base md:text-lg font-bold text-[#1E95BB] transition-all ease-in-out duration-500 hover:text-white hover:bg-[#775ADA]"
            >
              Write
              <PencilSquareIcon className="w-7 h-7 ml-2" />
            </button>
            </Link>
          </div>
        </div>

        <div className="flex w-full space-x-4 h-full">
          <div className="w-[60%]">
            <TemplateCard  />
            <RecentDraft />
          </div>

          <div className="w-[40%]">
            <Suggestion />
            <RecentTask />
          </div>
        </div>
      </div>

      {/* Template Modal */}
      <Template templateModal={templateModal} handleTemplateModal={handleTemplateModal} />

     
    </>
  );
}
