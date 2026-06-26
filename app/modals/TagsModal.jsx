"use client";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef } from "react";

const TAGS = [
  "Job hunt cold emails", "Recruiting", "Application auto-response",
  "Relations", "Advertising inquiries", "Networking", "Customer Support",
  "Contracts", "Design feedback", "Tech support", "Partnership proposals",
  "Application", "Client onboarding", "Marketing campaigns", "Sales outreach",
];

export default function TagsModal({ tagModal, handleTagModal, onTagSelect }) {
  const ref = useRef(null);

  // Outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handleTagModal();
    };
    if (tagModal) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [tagModal, handleTagModal]);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleTagModal(); };
    if (tagModal) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [tagModal, handleTagModal]);

  if (!tagModal) return null;

  return (
    <div className="fixed inset-0 z-[1010] flex items-end justify-center
                    bg-black/30 sm:items-center sm:p-4">
      <div
        ref={ref}
        className="pointer-events-auto w-full sm:w-[30rem] max-h-[65dvh] sm:max-h-[70vh]
                   bg-white rounded-t-2xl sm:rounded-2xl shadow-xl shadow-black/20
                   flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDEDED] shrink-0">
          <p className="text-sm font-semibold text-[#1C1C1C]">Select a tag</p>
          <button
            onClick={handleTagModal}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-[#737373]"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Tag chips */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-4">
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => { onTagSelect(tag); handleTagModal(); }}
                className="flex items-center gap-1.5 bg-[#EEEBFB] hover:bg-[#DDD6F6]
                           px-3 py-1.5 rounded-full text-xs font-semibold text-[#5943A3]
                           transition-colors whitespace-nowrap"
              >
                <BookmarkIcon className="h-3.5 w-3.5 shrink-0" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
