"use client"
import React, { useEffect, useRef, useState } from 'react'
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

export default function Placeholder() {
    const placeholders = [
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
    <div
     className="bg-[#FFFFFF] w-full h-auto cursor-pointer  rounded-xl mt-6">
     <div className='flex justify-between  p-4'>
        <p className='font-light'>Placeholders</p>
        <div className="relative" ref={dropdownRef}>
        <EllipsisVerticalIcon className='w-5 h-5 text-[#775ADA]' 
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
      <div className="border-t-4 w-full border-[#EDEDED] " />

      <div className='p-4 text-sm text-[#999999] flex space-x-2'>
    <span className='italic'>i</span>
    <p>  Drag placeholder to the portion on template to add/change</p>
      </div>
  
      {/* Tags grid */}
      <div className="flex flex-wrap gap-6 px-4 pb-8">
{placeholders.map((placeholder, index) => (
  <div
    key={index}
    className="flex items-center space-x-1 bg-[#EDEDED] py-2 px-4 rounded-full  basis-[25%] whitespace-nowrap w-fit"
  >
    {/* Tag */}
    <PencilSquareIcon className="h-4 w-4 text-[#4D4D4D]" />
    <p className="text-[#4D4D4D] text-sm font-semibold">{placeholder}</p>
  </div>
))}
</div>

    </div>
  
  )
}
