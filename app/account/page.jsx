"use client";

import { UserIcon } from "@heroicons/react/24/solid"; // Default user icon
import Image from "next/image";
import React, { useState } from "react";


export default function Account({ signInMethod = "google" }) {
  const [isToggled, setIsToggled] = useState(false);
  const [isToggled2, setIsToggled2] = useState(false);

  const handleToggle = () => setIsToggled(!isToggled);
  const handleToggle2 = () => setIsToggled2(!isToggled2);

  // Dummy data
  const userData = {
    name: "Joel Mgbikeh",
    email: "mgbikehjoel@gmail.com",
    agency: "Telygence",
    area: "AI",
    profileImage: "/images/profile.png", // Set to empty string if no image is provided
  };

  return (
    <div className="p-6 md:p-7 mt-20 w-full">
      {/* Welcome Section */}
      <div className="w-full px-4 md:px-8 flex py-4 items-center h-auto bg-white rounded-xl">
        <p className="text-base md:text-xl font-medium">My Account</p>
      </div>

      {/* Profile Information */}
      {signInMethod === "google" ? (
        <div className="bg-[#F8F8F8] w-full h-auto py-4 px-8 mt-6 rounded-xl">
          <p className="text-[#4D4D4D]">Profile information</p>
          <div className="flex justify-between items-center mt-3">
            <div className="flex space-x-5">
              {/* Profile Image **/}
              {userData.profileImage ? (
                <Image
                  className="w-20 h-20"
                  src={userData.profileImage}
                  alt="Profile Image"
                  height={100}
                  width={100}
                />
              ) : (
                <div className="bg-[#D2D2D2] p-2 rounded-full">
                <UserIcon className="text-[#999999] w-20 h-20" />
                </div>
              )}

              <div className="w-full mt-6 text-[#4D4D4D]">
                <div className="flex space-x-2 items-center justify-center">
                  <p className="font-semibold">{userData.name}</p>
                  <p className="text-sm bg-[#D6DCE2] rounded-xl px-2 py-1 text-[#002651]">
                    Agency
                  </p>
                </div>
                <p className="text-sm">{userData.email}</p>
              </div>
            </div>

            <div>
              <p className="text-[#8093A8]">Agency</p>
              <p className="text-[#002651]">{userData.agency}</p>
            </div>

            <div>
              <p className="text-[#8093A8]">Area</p>
              <p className="text-[#002651]">{userData.area}</p>
            </div>

            <div className="border-2 border-[#775ADA] text-[#775ADA] rounded-full py-2 px-6 hover:bg-[#775ADA] hover:text-white transition-all ease-in-out duration-300 cursor-pointer">
              Edit profile information
            </div>
          </div>
        </div>

        
      ) : (
        <div className="bg-[#F8F8F8] w-full h-auto py-4 px-8 mt-6 rounded-xl">
          <p className="text-[#4D4D4D]">Profile information</p>
          <div className="flex justify-between items-center mt-3">
            <div className="flex space-x-5">
              {/* Default Icon if No Image */}
              {userData.profileImage ? (
                <div className="bg-[#D2D2D2] p-2 rounded-full">
                <UserIcon className="text-[#999999] w-20 h-20" />
                </div>
                
              ) : (
                
                <Image
                  className="w-20 h-20"
                  src={userData.profileImage}
                  alt="Profile Image"
                  height={100}
                  width={100}
                />
              )}
              <div className="w-full mt-6 text-[#4D4D4D]">
                <div className="flex space-x-2 items-center justify-center">
                  <p className="font-semibold">{userData.name}</p>
                  <p className="text-sm bg-[#D6DCE2] rounded-xl px-2 py-1 text-[#002651]">
                    Agency
                  </p>
                </div>
                <p className="text-sm">{userData.email}</p>
              </div>
            </div>

            <div>
              <p className="text-[#8093A8]"> Agency</p>
              <p className="text-[#002651]">{userData.agency}</p>
            </div>

            <div>
              <p className="text-[#8093A8]">Area</p>
              <p className="text-[#002651]">{userData.area}</p>
            </div>

            <div className="border-2 border-[#775ADA] text-[#775ADA] rounded-full py-2 px-6 hover:bg-[#775ADA] hover:text-white transition-all ease-in-out duration-300 cursor-pointer">
              Change password
            </div>

            <div className="border-2 border-[#775ADA] text-[#775ADA] rounded-full py-2 px-6 hover:bg-[#775ADA] hover:text-white transition-all ease-in-out duration-300 cursor-pointer">
              Edit profile information
            </div>
          </div>
        </div>

      )}

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* Features Section */}
      <div className="bg-[#F8F8F8] p-8">
        <p className="text-[#4D4D4D]">Features</p>

        {/* Feature 1 */}
        <div className="flex justify-between bg-[#EDEDED] p-4 w-full rounded-lg mt-5">
          <p className="font-semibold">Smart suggestions</p>
          <p className="text-sm">
            Telygence smart suggestions are based on your recent templates,
            drafts, and tasks.
          </p>
          <div
            onClick={handleToggle}
            className={`relative w-14 h-7 flex items-center rounded-full cursor-pointer transition-colors duration-300 ${
              isToggled ? "bg-[#28C7FA]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isToggled ? "translate-x-8" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex justify-between bg-[#EDEDED] p-4 w-full rounded-lg mt-6">
          <p className="font-semibold">Writing style</p>
          <p className="text-sm">
            Activating writing styles helps AI determine the tone of your
            writing.
          </p>
          <div
            onClick={handleToggle2}
            className={`relative w-14 h-7 flex items-center rounded-full cursor-pointer transition-colors duration-300 ${
              isToggled2 ? "bg-[#28C7FA]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isToggled2 ? "translate-x-8" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
      

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED] mt-10" />

      {/* Action Buttons */}
      <div className="space-x-4 mt-4 flex justify-end">
        <button
          className="w-fit py-2 px-5 border-[#775ADA] border-2 text-[#775ADA] rounded-full text-base transition-transform duration-300 ease-in-out hover:bg-[#775ADA] hover:text-white hover:scale-105 hover:shadow-md"
        >
          Cancel
        </button>
        <button
          className="w-fit py-2 px-7 bg-[#775ADA] text-base text-[#FFFFFF] rounded-full transition-transform duration-300 ease-in-out hover:bg-[#5F48C2] hover:scale-105 hover:shadow-md"
        >
          Save
        </button>
      </div>
    </div>
    </div>
  );
}








