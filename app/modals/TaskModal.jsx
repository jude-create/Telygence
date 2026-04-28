"use client";
import { XCircleIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

// ─── Priority config ──────────────────────────────────────────────────────────

const PRIORITIES = [
  { value: "Low",    bg: "bg-[#C9F1FE]",    text: "text-[#14637D]" },
  { value: "Medium", bg: "bg-[#D89E074D]",  text: "text-[#946A00]" },
  { value: "High",   bg: "bg-[#FFCBD3]",    text: "text-[#801827]" },
];
const STATUSES = ["To do", "In progress", "Completed"];

function priorityClasses(value) {
  const p = PRIORITIES.find((x) => x.value === value) ?? PRIORITIES[0];
  return `${p.bg} ${p.text}`;
}

// ─── Field label ──────────────────────────────────────────────────────────────

function Label({ children, optional }) {
  return (
    <p className="text-sm font-medium text-black mb-1.5">
      {children}
      {optional && <span className="text-[#999999] font-normal ml-1">(Optional)</span>}
    </p>
  );
}

// ─── Success toast ────────────────────────────────────────────────────────────

function SuccessToast() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#03A12F] text-white
                    text-sm font-medium px-6 py-3 rounded-xl shadow-lg z-[1100]">
      ✓ Task created!
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function TaskModal({ taskModal, handleTaskModal }) {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To do");
  const [priority, setPriority] = useState("Low");
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const modalRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) handleTaskModal();
    };
    if (taskModal) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [taskModal, handleTaskModal]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleTaskModal(); };
    if (taskModal) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [taskModal, handleTaskModal]);

  if (!taskModal) return null;

  // ── File helpers ────────────────────────────────────────────────────────────
  const handleFile = (file) => {
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!task.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      handleTaskModal();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) handleTaskModal(); }}
      >
        {/* Modal */}
        <div
          ref={modalRef}
          className="bg-white w-full max-w-lg max-h-[95dvh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 sm:px-7 py-4 shrink-0">
            <p className="font-bold text-base sm:text-lg text-black tracking-wide">Add new task</p>
            <button
              onClick={handleTaskModal}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="border-t-2 border-[#EDEDED] shrink-0" />

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-5 sm:px-8 py-5 space-y-5">

            {/* Task name */}
            <div>
              <Label>Task name</Label>
              <input
                className="w-full border border-[#999999] h-10 rounded-lg px-4 text-sm
                           placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
                placeholder="Enter task name"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <Label optional>Description</Label>
              <textarea
                className="w-full border border-[#999999] rounded-lg p-3 text-sm resize-none
                           h-28 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Status + Priority — side by side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
              <div className="relative">
                <Label>Category</Label>
                <button
                  onClick={() => { setShowStatusDropdown((o) => !o); setShowPriorityDropdown(false); }}
                  className="w-full h-10 border border-[#999999] rounded-lg px-4 flex justify-between items-center text-sm"
                >
                  <span>{status}</span>
                  {showStatusDropdown
                    ? <ChevronUpIcon className="h-4 w-4" />
                    : <ChevronDownIcon className="h-4 w-4" />}
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#EDE9FB] hover:text-[#775ADA] transition-colors"
                        onClick={() => { setStatus(s); setShowStatusDropdown(false); }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="relative">
                <Label>Priority</Label>
                <button
                  onClick={() => { setShowPriorityDropdown((o) => !o); setShowStatusDropdown(false); }}
                  className="w-full h-10 border border-[#999999] rounded-lg px-3 flex justify-between items-center"
                >
                  <span className={`px-3 py-1 rounded-md text-xs font-semibold ${priorityClasses(priority)}`}>
                    {priority}
                  </span>
                  {showPriorityDropdown
                    ? <ChevronUpIcon className="h-4 w-4" />
                    : <ChevronDownIcon className="h-4 w-4" />}
                </button>
                {showPriorityDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {PRIORITIES.map(({ value }) => (
                      <button
                        key={value}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                        onClick={() => { setPriority(value); setShowPriorityDropdown(false); }}
                      >
                        <span className={`px-3 py-1 rounded-md text-xs font-semibold ${priorityClasses(value)}`}>
                          {value}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cover image upload */}
            <div>
              <Label optional>Task cover</Label>
              <div
                className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer
                  ${isDragging ? "border-[#775ADA] bg-[#F3F0FD]" : "border-[#BABABA] hover:border-[#775ADA] hover:bg-gray-50"}`}
                onClick={() => document.getElementById("task-cover-upload").click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
              >
                <input
                  id="task-cover-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {coverPreview ? (
                  <div className="relative">
                    <Image
                      src={coverPreview}
                      alt="Cover preview"
                      width={600} height={160}
                      className="w-full h-36 object-cover rounded-xl"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); setCoverPreview(null); }}
                      className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white shadow"
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-7 gap-2">
                    <div className="bg-[#EDEDED] p-3 rounded-full">
                      <CloudArrowUpIcon className="w-6 h-6 text-[#999999]" />
                    </div>
                    <p className="text-sm text-[#999999]">
                      <span className="text-[#775ADA] font-medium">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-xs text-[#BABABA]">PNG or JPG</p>
                  </div>
                )}
              </div>
            </div>

            {/* Deadline + Time — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Deadline</Label>
                <div className="flex items-center justify-between border border-[#999999] rounded-lg px-3 py-2.5">
                  <p className="text-xs text-[#4D4D4D]">Tues, Oct 1st 2024</p>
                  <XCircleIcon className="h-4 w-4 text-[#999999] shrink-0" />
                </div>
              </div>
              <div>
                <Label>Time</Label>
                <div className="flex items-center justify-between border border-[#999999] rounded-lg px-3 py-2.5">
                  <p className="text-xs text-[#4D4D4D]">4:00 PM</p>
                  <XCircleIcon className="h-4 w-4 text-[#999999] shrink-0" />
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={isSaving || !task.trim()}
              className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200
                bg-gradient-to-b from-[#775ADA] to-[#3B2D6D]
                ${isSaving || !task.trim() ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 hover:shadow-lg"}`}
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </span>
              ) : "Save Task"}
            </button>
          </div>
        </div>
      </div>

      {showSuccess && <SuccessToast />}
    </>
  );
}