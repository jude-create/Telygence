"use client";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef } from "react";

const PLACEHOLDERS = [
  "First name", "Last name", "Middle name", "Email address",
  "Company name", "Month Date, Year", "DD/MM/YYYY",
  "Day, Month Date, Year", "Month Date, Year, Time", "Time",
];

export default function PlaceholderModal({ placeholderModal, handlePlaceholderModal, onPlaceholderSelect }) {
  const ref = useRef(null);

  // Outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handlePlaceholderModal();
    };
    if (placeholderModal) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [placeholderModal, handlePlaceholderModal]);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handlePlaceholderModal(); };
    if (placeholderModal) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [placeholderModal, handlePlaceholderModal]);

  if (!placeholderModal) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center
                    bg-black/30 sm:bg-transparent sm:absolute sm:inset-auto
                    sm:top-full sm:right-0 sm:mt-2 sm:w-72">
      <div
        ref={ref}
        className="pointer-events-auto w-full sm:w-72 max-h-[60dvh] sm:max-h-[48vh]
                   bg-white rounded-t-2xl sm:rounded-2xl shadow-xl shadow-black/20
                   flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDEDED] shrink-0">
          <p className="text-sm font-semibold text-[#1C1C1C]">Select a placeholder</p>
          <button
            onClick={handlePlaceholderModal}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-[#737373]"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Placeholder grid */}
        <div className="overflow-y-auto flex-1 p-3">
          <div className="grid grid-cols-2 gap-2">
            {PLACEHOLDERS.map((p) => (
              <button
                key={p}
                onClick={() => { onPlaceholderSelect(p); handlePlaceholderModal(); }}
                className="flex items-center gap-1.5 bg-[#EDEDED] hover:bg-[#D9D9D9]
                           px-2.5 py-2 rounded-full text-xs font-semibold text-[#4D4D4D]
                           transition-colors text-left"
              >
                <PencilSquareIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{p}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}