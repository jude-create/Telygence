'use client'
import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/solid";
import TemplateCard from "./components/TemplateCard";
import Suggestion from "./components/Suggestion";
import { RecentDraft } from "./components/RecentDraft";
import RecentTask from "./components/RecentTask";
import { useState } from "react";
import Template from "./modals/Template";


export default function Home() {

  const [templateModal, setTemplateModal] = useState(false);
 //Function to handle the add address modal
 const handleTemplateModal = () => {
  setTemplateModal(!templateModal);
}

  return (
    <>
    <div className="h-auto p-6 md:p-10 mt-32  ">
    <div className="  flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-12  w-full">
      {/* Welcome Section */}
      <div className="w-full md:w-[65%] flex flex-col md:flex-row justify-between px-6 md:px-14 items-center h-auto md:h-24 bg-white rounded-xl">
        <div className="flex items-center space-x-4">
          <p className="text-lg md:text-4xl font-normal">Welcome, Joey!</p>
          <Image
            src="/images/hand.png"
            alt="hand"
            width={30}
            height={30}
            className="w-7 h-7 md:w-10 md:h-10"
          />
        </div>
        <p className="font-normal text-sm text-[#737373] md:text-xl mt-4 md:mt-0">
          It’s 8:02 PM, Wed, Jul 24, 2024
        </p>
      </div>

      {/* Buttons Section */}
      <div className="w-full md:w-[35%] flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-8">
        {/* Create Template Button */}
        <button
        onClick={handleTemplateModal}
          className="flex justify-center items-center rounded-lg bg-custom-radial w-[60%]  h-16 
          md:h-24 text-lg md:text-2xl font-bold tracking-wider text-white transition-all ease-in-out duration-500 
           hover:bg-[#C9F1FE80]  hover:tracking-widest"
        >
          Create a template
          <PlusIcon className="w-6 h-6 md:w-10 md:h-10 text-white ml-2" />
        </button>

        {/* Write Button */}
        <button
          className="flex justify-center items-center border-2 tracking-wider md:border-4 border-[#1E95BB] w-full md:w-[40%] h-16 md:h-24 bg-[#C9F1FE80]
           rounded-lg text-lg md:text-2xl font-bold text-[#1E95BB] transition-all ease-in-out duration-500 hover:text-white hover:bg-[#775ADA]"
        >
          <p>Write</p>
          <Image
            className="ml-2"
            src="/images/vector.png"
            alt="write"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>

  <div className="flex w-full md:space-x-8 ">
   <div className="w-[65%]">
    <TemplateCard />
    <RecentDraft />
   </div>

   <div className="w-[35%]"> 
    <Suggestion />
    <RecentTask />
   </div>
  </div>
  
    </div>
    <Template templateModal={templateModal} handleTemplateModal={handleTemplateModal}/>
    </>

  );
}
