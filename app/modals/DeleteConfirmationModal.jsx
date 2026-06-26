"use client";

import React, { useEffect, useRef } from "react";

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemLabel = "item",
  isLoading = false,
}) => {

    const modalRef = useRef(null);
     // Close the modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!isLoading) onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, isLoading]);
  if (!isOpen) return null; // Don't render the modal if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
      ref={modalRef}
      className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
      <div className="p-4 text-center font-semibold">
        <p>Delete {itemLabel}</p>
      </div>


      <div className="border-t w-full border-[#737373] mb-5" />
      <div className="p-5 space-y-8">
        <p className="text-base font-light text-[#4D4D4D]   text-center ">
          Are you sure you want to delete this {itemLabel}?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            className="bg-[#D9D9D9] text-[#1E1636] px-6 py-2 rounded-md shadow-lg shadow-[#D9D9D9]"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="bg-[#E50606] text-[#D9D9D9] px-4 py-2 rounded-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={onConfirm}
            disabled={isLoading}
          >
           {isLoading && <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
           {isLoading ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
