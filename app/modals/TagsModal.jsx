'use client';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef } from 'react';

export default function TagsModal({ tagModal, handleTagModal }) {
  // Tag data
  const tags = [
    "Job hunt cold emails",
    "Recruiting",
    "Application auto-response",
    "Relations",
    "Advertising inquiries",
    "Networking",
    "Customer Support",
    "Design feedback",
    "Tech support",
    "Partnership proposals",
    "Client onboarding",
    "Sales outreach"
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
        className="bg-white w-full h-full overflow-y-auto scrollbar-hide cursor-pointer px-2 py-4 rounded-xl shadow-lg shadow-[#00000033]"
      >
        {/* Tags grid */}
        <div className="grid grid-cols-2 gap-4 gap-x-8">
  {tags.map((tag, index) => (
    <div
      key={index}
      className="flex items-center space-x-1 bg-[#DDD6F6] p-2 rounded-full  whitespace-nowrap w-max"
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
