import { LightBulbIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";

const Suggestion = () => {
  // Array of suggestions
  const suggestions = [
   "Prepare a proposal letter for investors seeking equity allocation...",
    "Write partnership proposal letter to potential companies...", 
    "Prepare a proposal letter for investors seeking equity allocation...", 
    "Draft the organizational summary and blueprint of your company", 
    "Prepare a proposal letter for investors seeking equity allocation...",
  ];

  return (
    <div className="h-auto w-full bg-[#FFFFFF] rounded-xl mt-6 space-y-5 pb-6">
      <div className="flex space-x-2 px-6 pt-5 items-center">
        <LightBulbIcon className="w-5 h-5 text-[#737373]" />
        <p className="font-light text-lg text-[#001C3D]">Smart suggestions</p>
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* Show message only if suggestions are available */}
      {suggestions.length > 0 && (
        <p className="text-[#8093A8] px-6 text-base">
          Smart suggestions are based on your recent activities
        </p>
      )}

      {suggestions.length > 0 ? (
        <div className="space-y-3 text-sm px-6 text-[#4D4D4D] font-normal">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="hover:bg-[#775ADA] flex space-x-3 p-3 rounded-xl items-center bg-[#EDEDED] 
               hover:text-white transition duration-300 ease-in-out cursor-pointer"
            >
              <Image
                src="/images/magic.png"
                className="w-5 h-5"
                alt="magic-wand"
                height={30}
                width={30}
              />
              <p className="truncate w-full hover:whitespace-normal hover:break-words transition duration-300 ease-in-out">
                {suggestion}
              </p>
            </div>
          ))}

          {/* Update Suggestions Button */}
          <div className="flex items-center space-x-3 justify-end pt-2">
            <ArrowPathIcon className="h-5 w-5 text-[#775ADA]" />
            <p className="text-sm text-[#775ADA] hover:underline cursor-pointer">
              Update suggestions
            </p>
          </div>
        </div>
      ) : (
        <div>
        <div className="flex flex-col items-center justify-center space-y-6">
          <p className="text-base text-[#AAAAAA]">
            Start using Telygence to get smart suggestions
          </p>
          <Image
            src="/images/floating.png" // Replace with your "no templates available" image path
            alt="No Templates Available"
            height={200}
            width={200}
          />
          </div>
          {/* Update Suggestions Button (Disabled) */}
          <div className="flex items-center space-x-2 justify-end px-2 pt-6">
            <ArrowPathIcon className="h-5 w-5 text-[#D3D3D3]" />
            <p className="text-sm text-[#BBACEC] cursor-not-allowed">
              Update suggestions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suggestion;





