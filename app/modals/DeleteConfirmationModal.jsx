"use client";

import React, { useEffect, useRef } from "react";

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemLabel = "item" // Default label is "item" if not provided
}) => {

    const modalRef = useRef(null);
     // Close the modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null; // Don't render the modal if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
      ref={modalRef}
      className="bg-gray-200 rounded-lg shadow-lg  w-[90%] sm:w-[320px] h-[45%]">
      <div className="p-4 text-center font-semibold">
        <p>Delete {itemLabel}</p>
      </div>


      <div className="border-t w-full border-[#737373] mb-5" />
      <div className="p-4 space-y-14">
        <p className="text-base font-light text-[#4D4D4D]   text-center ">
          Are you sure you want to delete this {itemLabel}?
        </p>
        <div className="flex justify-center items-center space-x-8">
          <button
            className="bg-[#D9D9D9] text-[#1E1636] px-6 py-2 rounded-md shadow-lg shadow-[#D9D9D9]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#E50606] text-[#D9D9D9] px-4 py-2 rounded-md"
            onClick={onConfirm}
          >
           Yes, delete
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
