"use client";
import React, { useEffect, useRef, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function Placeholder() {
  const [placeholders, setPlaceholders] = useState([
    "First name",
        "Last name",
        "Middle name",
        "Email address",
        "Company name",
        "Month Date, Year",
        "DD/MM/YYYY",
        "Day, Month Date, Year",
        "Month Date, Year, Time",
        "Time",
  ]);

  const [editIndex, setEditIndex] = useState(null); // Track index of placeholder being edited
  const [editValue, setEditValue] = useState(""); // Current value of the editing placeholder
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track open dropdown
  const dropdownRefs = useRef({}); // Store refs for all dropdowns

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(placeholders[index]);
    setDropdownOpen(null); // Close dropdown
  };

  const handleEditSubmit = (index) => {
    if (editValue.trim() === "") return; // Prevent empty placeholders
    const updatedPlaceholders = [...placeholders];
    updatedPlaceholders[index] = editValue.trim();
    setPlaceholders(updatedPlaceholders);
    setEditIndex(null); // Close edit mode
    setEditValue(""); // Clear input
  };

  const handleDelete = (index) => {
    setPlaceholders(placeholders.filter((_, i) => i !== index));
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
    <div className="bg-[#FFFFFF] w-full h-auto cursor-pointer rounded-xl mt-6">
      {/* Header */}
      <div className="flex justify-between p-4">
        <p className="font-light">Placeholders</p>
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED]" />

      {placeholders.length > 0 && (
        <div className="p-4 text-sm text-[#999999] flex space-x-2">
          <span className="italic">i</span>
          <p>Available Placeholders</p>
        </div>
      )}

      {/* Placeholders Grid */}
      <div className="flex flex-wrap gap-5 px-4 pb-8">
        {placeholders.map((placeholder, index) => (
          <div
            key={index}
            className="flex items-center space-x-1 bg-[#EDEDED] py-2 px-2 rounded-full  basis-[20%] whitespace-nowrap w-fit"
          >
            {editIndex === index ? (
              <input
                className="text-[#4D4D4D] text-sm font-semibold bg-transparent border-b border-[#4D4D4D] outline-none"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleEditSubmit(index)} // Save on blur
                autoFocus
              />
            ) : (
              <>
                <PencilSquareIcon className="h-4 w-4 text-[#4D4D4D]" />
                <p className="text-[#4D4D4D] text-sm font-semibold">{placeholder}</p>
              </>
            )}

            {/* Dropdown */}
            <div className="relative" ref={(el) => (dropdownRefs.current[index] = el)}>
              <EllipsisVerticalIcon
                className="w-5 h-5 text-[#4D4D4D]  cursor-pointer"
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

      {placeholders.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-6 h-40">
          <p className="text-base text-[#AAAAAA]">You have no available placeholders</p>
        </div>
      )}
    </div>
  );
}
