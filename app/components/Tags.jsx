"use client";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import React, { useState, useRef, useEffect } from "react";

export default function Tags() {
  const [tags, setTags] = useState([
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
  ]);

  const [editIndex, setEditIndex] = useState(null); // Track index of tag being edited
  const [editValue, setEditValue] = useState(""); // Current value of the editing tag
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track open dropdown
  const dropdownRefs = useRef({}); // Store refs for all dropdowns

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(tags[index]);
    setDropdownOpen(null); // Close dropdown
  };

  const handleEditSubmit = (index) => {
    if (editValue.trim() === "") return; // Prevent empty tags
    const updatedTags = [...tags];
    updatedTags[index] = editValue.trim();
    setTags(updatedTags);
    setEditIndex(null); // Close edit mode
    setEditValue(""); // Clear input
  };

  const handleDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    setDropdownOpen(null); // Close dropdown
  };

  const handleDropdownToggle = (index) => {
    setDropdownOpen((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const outsideClick = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      );
      if (outsideClick) setDropdownOpen(null); // Close all dropdowns
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#FFFFFF] w-full h-auto cursor-pointer rounded-xl mt-6 ">
      {/* Header */}
      <div className="flex justify-between p-4">
        <p className="font-light">Tags</p>
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* Info Section */}
      {tags.length > 0 ? (
        <div className="p-4 text-sm text-[#999999] flex space-x-2">
          <span className="italic">i</span>
          <p>Available Tags</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6 h-44">
          <p className="text-base text-[#AAAAAA]">You have no available tags</p>
        </div>
      )}

      {/* Tags Flex Layout */}
      <div className="flex flex-wrap gap-4 px-3  pb-8">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center space-x-1 bg-[#EEEBFB] py-2 px-1 rounded-full basis-[15%] whitespace-nowrap w-fit"
          >
            {/* Tag Icon */}
            <BookmarkIcon className="h-4 w-4 text-[#5943A3]" />
            {/* Tag Text */}
            {editIndex === index ? (
              <input
                className="text-[#5943A3] text-sm font-semibold bg-transparent border-b border-[#5943A3] outline-none"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleEditSubmit(index)} // Save on blur
                autoFocus
              />
            ) : (
              <p className="text-[#5943A3] text-sm font-semibold">{tag}</p>
            )}
            {/* Dropdown */}
            <div className="relative" ref={(el) => (dropdownRefs.current[index] = el)}>
              <EllipsisVerticalIcon
                className="w-5 h-5 text-[#775ADA] cursor-pointer"
                onClick={() => handleDropdownToggle(index)}
              />
              {dropdownOpen === index && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 w-[8rem]">
                  <div
                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleEdit(index)}
                  >
                    <PencilIcon className="w-4 h-4 mr-2 text-gray-700" />
                    Edit
                  </div>
                  <div
                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 text-[#E50606] cursor-pointer"
                    onClick={() => handleDelete(index)}
                  >
                    <TrashIcon className="w-4 h-4 mr-2 text-red-500" />
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
