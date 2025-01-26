'use client';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef } from 'react';

export default function TagsModal({ tagModal, handleTagModal,  onTagSelect }) {
  // Tag data
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
  ];

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleTagModal();
      }
    };

    if (tagModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tagModal, handleTagModal]);

  return (
    <div
      className={`${
        tagModal ? "opacity-100" : "hidden opacity-0"
      } fixed top-48 right-80 w-[27%] h-[50vh] flex z-[1000] transition-all ease-in-out duration-500`}
    >
      {/* Modal content */}
      <div
        ref={modalRef}
        className="bg-white w-fit h-full overflow-y-auto scrollbar-hide cursor-pointer px-2 py-4 rounded-xl shadow-lg shadow-[#00000033]"
      >
        {/* Tags grid */}
        <div className="flex flex-wrap gap-4 px-3">
  {tags.map((tag, index) => (
    <div
      key={index}
      onClick={() => onTagSelect(tag)}
       className="flex items-center space-x-1 bg-[#EEEBFB] py-2 px-1 rounded-full basis-[15%] whitespace-nowrap w-fit"
    >
      {/* Tag */}
      <BookmarkIcon className="h-4 w-4 text-[#5943A3]" />
      <p className="text-[#5943A3] text-xs font-semibold">{tag}</p>
    </div>
  ))}
</div>

      </div>
    </div>
  );
}
