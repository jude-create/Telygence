"use client";
import React, { useState, useEffect, useRef } from "react";

export default function WritingStylesModal({
  stylesModal,
  handleStylesModal,
  onStyleSelect,
}) {
  const writingStyles = [
    "Formal",
    "Informal",
    "Professional",
    "Persuasive",
    "Empathetic",
    "Humorous",
    "Friendly",
    "Concise",
    "Detailed",
  ];

  const [selectedStyle, setSelectedStyle] = useState(null); // Track selected style locally
  const modalRef = useRef(null);

  //use effect closes modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleStylesModal();
      }
    };

    if (stylesModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [stylesModal, handleStylesModal]);

  const handleSelectStyle = (style) => {
    setSelectedStyle(style); // Set selected style locally
    onStyleSelect(style); // Notify parent component about the selected style
  };

  return (
    <div
      className={`${
        stylesModal ? "opacity-100" : "hidden opacity-0"
      } fixed top-28 left-[300px] w-[12%] h-[68vh] flex z-[1000] transition-all ease-in-out duration-500`}
    >
      <div
        ref={modalRef}
        className="bg-white w-full h-full overflow-y-auto scrollbar-hide cursor-pointer py-4 rounded-xl shadow-lg shadow-[#00000033]"
      >
        <div className="space-y-5">
          {writingStyles.map((style, index) => (
            <div
              key={index}
              onClick={() => handleSelectStyle(style)}
              className={`px-6 py-2 cursor-pointer text-base font-normal rounded-md ${
                selectedStyle === style
                  ? "bg-[#DDD6F6]  font-semibold"
                  : "bg-transparent text-[#000000]"
              }`}
            >
              {style}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
