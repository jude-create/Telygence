"use client";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import React, { useState, useRef, useEffect } from "react";

export default function Tags() {
  const tags = [
    "Job hunt cold emails",
    "Recruiting",
    "Application auto-response",
    "Relations",
    "Advertising inquiries",
    "Networking",
    "Customer Support",
    "Contracts",
    "Design feedback",
    "Tech support",
    "Partnership proposals",
    "Application",
    "Client onboarding",
    "Marketing campaigns",
    "Sales outreach",
    "Partnership proposals",
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleEdit = () => {
    console.log("Edit action triggered");
    setDropdownOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete action triggered");
    setDropdownOpen(false);
  };

  return (
    <div className="bg-[#FFFFFF] w-full h-auto cursor-pointer rounded-xl mt-6">
      {/* Header */}
      <div className="flex justify-between p-4">
        <p className="font-light">Tags</p>
        <div className="relative" ref={dropdownRef}>
          <EllipsisVerticalIcon
            className="w-5 h-5 text-[#775ADA] cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 w-[8rem]">
              <div
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={handleEdit}
              >
                Edit
              </div>
              <div
                className="px-4 py-2 text-sm hover:bg-gray-100 text-[#E50606] cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* Info Section */}
      <div className="p-4 text-sm text-[#999999] flex space-x-2">
        <span className="italic">i</span>
        <p>Drag tag to a template to add/change</p>
      </div>

      {/* Tags Flex Layout */}
      <div className="flex flex-wrap gap-5 px-4 pb-8">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center space-x-1 bg-[#EEEBFB] py-2 px-4 rounded-full basis-[20%] whitespace-nowrap w-fit"
          >
            {/* Tag Icon */}
            <BookmarkIcon className="h-4 w-4 text-[#5943A3]" />
            {/* Tag Text */}
            <p className="text-[#5943A3] text-sm font-semibold">{tag}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
