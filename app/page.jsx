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
import Link from "next/link";

export default function Home() {
  const [templateModal, setTemplateModal] = useState(false);

  return (
    <>
      <div className="p-4 md:p-7">

        {/* Top bar — stacks on mobile */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">

          {/* Welcome */}
          <div className="w-full sm:w-[60%] flex flex-row justify-between px-5 md:px-8 items-center h-14 bg-white rounded-xl">
            <div className="flex items-center space-x-2">
              <p className="text-base md:text-xl font-medium">Welcome, Joey!</p>
              <Image src="/images/hand.png" alt="hand" width={30} height={30} className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <p className="font-normal text-xs md:text-base text-[#737373]">
              It&apos;s 8:02 PM, Wed, Jul 24, 2024
            </p>
          </div>

          {/* Buttons */}
          <div className="w-full sm:w-[40%] flex flex-row gap-3">
            <button
              onClick={() => setTemplateModal(!templateModal)}
              className="flex justify-center items-center gap-2 rounded-lg bg-custom-radial flex-1 h-14
                text-sm md:text-lg font-bold tracking-wide text-white
                transition-all ease-in-out duration-500 hover:tracking-wider"
            >
              Create a template
              <PlusIcon className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </button>

            <Link href="/drafts" className="w-[40%]">
              <button className="flex justify-center items-center gap-2 tracking-wider border-4
                border-[#1E95BB] h-14 w-full bg-[#C9F1FE80] px-3 rounded-lg
                text-sm md:text-lg font-bold text-[#1E95BB]
                transition-all ease-in-out duration-500 hover:text-white hover:bg-[#775ADA]">
                Write
                <PencilSquareIcon className="w-5 h-5 md:w-7 md:h-7" />
              </button>
            </Link>
          </div>
        </div>

        {/* Main content — stacks on mobile, side by side on large screens */}
        <div className="flex flex-col lg:flex-row gap-4 w-full mt-0">
          <div className="w-full lg:w-[60%] min-w-0">
            <TemplateCard />
            <RecentDraft />
          </div>
          <div className="w-full lg:w-[40%] min-w-0">
            <Suggestion />
            <RecentTask />
          </div>
        </div>
      </div>

      <Template templateModal={templateModal} handleTemplateModal={() => setTemplateModal(!templateModal)} />
    </>
  );
}