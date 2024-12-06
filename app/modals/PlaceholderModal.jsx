'use client';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef } from 'react'

export default function PlaceholderModal({ placeholderModal, handlePlaceholderModal }) {
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

    const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handlePlaceholderModal();
      }
    };

    if (placeholderModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [placeholderModal, handlePlaceholderModal]);

  return (
    <div
    className={`${
      placeholderModal ? "opacity-100" : "hidden opacity-0"
    } fixed top-72 right-80 w-[26%] h-[42vh] flex z-[1000] `}
  >
    {/* Modal content */}
    <div
      ref={modalRef}
      className="bg-white w-full h-full overflow-y-auto scrollbar-hide cursor-pointer px-2 py-4 rounded-xl shadow-lg shadow-[#00000033]"
    >
      {/* Tags grid */}
      <div className="grid grid-cols-2 gap-4 ">
{placeholders.map((placeholder, index) => (
  <div
    key={index}
    className="flex items-center space-x-1 bg-[#EDEDED] p-2 rounded-full  whitespace-nowrap w-max"
  >
    {/* Tag */}
    <PencilSquareIcon className="h-4 w-4 text-[#4D4D4D]" />
    <p className="text-[#4D4D4D] text-xs font-semibold">{placeholder}</p>
  </div>
))}
</div>

    </div>
  </div>
  )
}
