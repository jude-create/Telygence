"use client";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function TaskModal({ taskModal, handleTaskModal }) {
  const [task, setTask] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("To do");
  const [priority, setPriority] = useState("Low");
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmationTaskModal, setShowConfirmationTaskModal] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  //To handle Image upload cover
const handleFileUpload = (file) => {
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image (PNG or JPG)");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setCoverPreview(reader.result);
  };
  reader.readAsDataURL(file);

  setCoverFile(file);
};


  const modalRef = useRef(null);

  // Handle save task logic
  const handleSaveTask = () => {
    setIsSaving(true);
    
    // Simulate async operation (e.g., API call)
    setTimeout(() => {
      setIsSaving(false);
      handleTaskModal();
      setShowConfirmationTaskModal(true);

      // Hide confirmation modal after 2 seconds
      setTimeout(() => {
        setShowConfirmationTaskModal(false);
      }, 2000);
    }, 2000);
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleTaskModal();
      }
    };

    if (taskModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [taskModal, handleTaskModal]);

  // Get priority color
  const getPriorityColor = (value) => {
    switch (value) {
      case "Low":
        return "bg-[#C9F1FE] text-[#14637D]";
      case "Medium":
        return "bg-[#D89E074D] text-[#946A00]";
      case "High":
        return "bg-[#FFCBD3] text-[#801827]";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <>
      {/* Main Task Modal */}
      <div
        className={`${
          taskModal ? "opacity-100" : "hidden opacity-0"
        } fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-60 z-[1000]`}
      >
        <div
          ref={modalRef}
          className="bg-white w-[42%] h-[90%] overflow-y-auto rounded-2xl"
        >
          {/* Modal Header */}
          <div className="flex justify-between px-7 py-3">
            <p className="font-bold text-base text-[#000000] tracking-wider">
              Add new task
            </p>
            <XMarkIcon
              onClick={handleTaskModal}
              className="h-6 w-6 cursor-pointer"
            />
          </div>

          {/* Divider */}
          <div className="border-t-2 w-full border-[#D9D9D9]" />

          {/* Modal Content */}
          <div className="px-10 mt-6 space-y-7 pb-7">
            {/* Task Name Input */}
            <div className="space-y-2">
              <p className="text-sm text-[#000] font-medium">
                What area do you work in?
              </p>
              <input
                className="w-full border border-[#999999] h-10 rounded-lg px-5 placeholder:text-sm placeholder:font-light text-base tracking-wider"
                placeholder="Enter task name"
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <p className="text-sm text-[#000] font-medium">
                Description (Optional)
              </p>
              <textarea
                className="w-full border border-[#999999] h-40 rounded-lg p-3 placeholder:text-sm placeholder:font-light text-base resize-none"
                placeholder="Enter task description"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2 relative">
              <p className="text-sm text-[#000] font-medium">Category</p>
              <div
                className="w-full h-10 border border-[#999999] rounded-lg py-1 px-4 flex justify-between items-center cursor-pointer"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <p>{status}</p>
                {showStatusDropdown ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </div>
              {showStatusDropdown && (
                <div className="w-full bg-white border border-gray-300 rounded-lg shadow-md absolute z-50">
                  {["To do", "In progress", "Completed"].map((item) => (
                    <p
                      key={item}
                      className="px-4 py-2 hover:bg-[#775ADA] hover:text-white cursor-pointer"
                      onClick={() => {
                        setStatus(item);
                        setShowStatusDropdown(false);
                      }}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Dropdown */}
            <div className="space-y-2 relative">
              <p className="text-sm text-[#000] font-medium">Priority</p>
              <div
                className="w-full h-10 border border-[#999999] rounded-lg py-2 px-4 flex justify-between items-center cursor-pointer"
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
              >
                <span
                  className={`px-4 py-1 rounded-md text-sm ${getPriorityColor(
                    priority
                  )}`}
                >
                  {priority}
                </span>
                {showPriorityDropdown ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </div>

              {showPriorityDropdown && (
                <div className="w-full bg-white border border-gray-300 rounded-lg shadow-md absolute z-50 pt-1">
                  {["Low", "Medium", "High"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setPriority(item);
                        setShowPriorityDropdown(false);
                      }}
                    >
                      <span
                        className={`px-4 py-2 rounded-md text-sm ${getPriorityColor(
                          item
                        )}`}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

       {/* Upload Task Cover with Drag & Drop */}
<div className="space-y-3">
  <p className="text-sm text-[#000] font-medium">Upload task cover (Optional)</p>

  <div
    className="py-5 border border-[#999999] rounded-lg cursor-pointer transition hover:border-[#775ADA] hover:bg-gray-50"
    onClick={() => document.getElementById("task-cover-upload").click()}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    }}
  >
    <input
      id="task-cover-upload"
      type="file"
      accept="image/png, image/jpeg"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) handleFileUpload(file);
      }}
    />

    <div className="flex flex-col justify-center items-center text-center space-y-3">
      {coverPreview ? (
        <Image
          src={coverPreview}
          alt="Cover Preview"
          width={120}
          height={120}
          className="rounded-lg object-cover"
        />
      ) : (
        <>
          <div className="bg-[#EDEDED] p-3 rounded-full w-fit">
            <Image src="/images/cloud.png" alt="Upload icon" height={20} width={20} />
          </div>
          <div className="text-sm text-[#999999]">
            <p>
              <span className="text-[#775ADA] text-base cursor-pointer">Click to upload</span> or drag and drop
            </p>
            <p>PNG or JPG</p>
          </div>
        </>
      )}
    </div>
  </div>
</div>


            {/* Deadline and Time */}
            <div className="flex justify-between">
              <div className="space-y-2">
                <p className="text-sm text-[#000] font-medium">Deadline Date</p>
                <div className="flex items-center space-x-8 py-2 px-4 border border-[#999999] rounded-lg">
                  <p className="text-sm text-[#000]">Tues, Oct 1st 2024</p>
                  <XCircleIcon className="h-5 w-5 text-[#666666]" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-[#000] font-medium">Time</p>
                <div className="flex space-x-7 py-2 px-4 border border-[#999999] rounded-lg">
                  <p className="text-sm text-[#000]">4: 00 PM</p>
                  <XCircleIcon className="h-5 w-5 text-[#666666]" />
                </div>
              </div>
            </div>

            {/* Save Task Button */}
            <button
              onClick={handleSaveTask}
              className={`mt-4 border-[#775ADA] border rounded-2xl text-[#FFFFFF] w-full text-center font-bold py-1 transition-colors duration-300 ${
                isSaving
                  ? "bg-gradient-to-b from-[#775ADA]/70 to-[#3B2D6D]/70"
                  : "bg-gradient-to-b from-[#775ADA] to-[#3B2D6D]"
              }`}
              disabled={isSaving}
            >
              {isSaving ? "Saving Task..." : "Save Task"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationTaskModal && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-60 z-[1000]"
        >
          <div className="bg-green-700 w-[20%] p-5 rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-base text-center font-semibold text-[#FFFFFF]">
              Task created!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
