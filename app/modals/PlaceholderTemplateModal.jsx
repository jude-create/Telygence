'use client';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef } from 'react'

export default function PlaceholderModal({ placeholderTemplateModal, handlePlaceholderTemplateModal }) {
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
        "T",
      ];

    const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handlePlaceholderTemplateModal();
      }
    };

    if (placeholderTemplateModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [placeholderTemplateModal, handlePlaceholderTemplateModal]);

  return (
    <div
    className={`${
      placeholderTemplateModal ? "opacity-100" : "hidden opacity-0"
    } fixed inset-0 sm:inset-auto sm:top-48 sm:right-10 w-full sm:w-[360px] h-full sm:h-auto flex z-[1000] bg-black/30 sm:bg-transparent p-4 sm:p-0`}
  >
    {/* Modal content */}
    <div
      ref={modalRef}
      className="bg-white w-full max-w-sm sm:max-w-none mx-auto self-center sm:self-auto max-h-[60vh] overflow-y-auto scrollbar-hide cursor-pointer px-3 py-4 rounded-xl shadow-lg shadow-[#00000033]"
    >
      {/* Tags grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
{placeholders.map((placeholder, index) => (
  <div
    key={index}
    className="flex items-center space-x-1 bg-[#EDEDED] p-2 rounded-full whitespace-nowrap max-w-full"
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
