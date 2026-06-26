"use client";

import { CloudArrowUpIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = [
  { value: "todo", label: "To do" },
  { value: "inProgress", label: "In progress" },
  { value: "completed", label: "Completed" },
];
const MAX_COVER_SIZE = 900;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const ratio = Math.min(1, MAX_COVER_SIZE / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * ratio));
      const height = Math.max(1, Math.round(image.height * ratio));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read image"));
    };

    image.src = objectUrl;
  });
}

function Label({ children, optional }) {
  return (
    <p className="text-sm font-medium text-black mb-1.5">
      {children}
      {optional && <span className="text-[#999999] font-normal ml-1">(Optional)</span>}
    </p>
  );
}

function emptyForm() {
  return {
    title: "",
    description: "",
    status: "todo",
    priority: "Low",
    deadline: "",
    dueTime: "",
    imageSrc: "",
  };
}

function formFromTask(task) {
  if (!task) return emptyForm();
  return {
    id: task.id,
    title: task.title || "",
    description: task.description || "",
    status: task.status || "todo",
    priority: task.priority || "Low",
    deadline: task.deadline || "",
    dueTime: task.dueTime || "",
    imageSrc: task.imageSrc || "",
  };
}

export default function TaskModal({ taskModal, taskToEdit, handleTaskModal, onTaskSave }) {
  const [form, setForm] = useState(emptyForm());
  const [coverPreview, setCoverPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const isEditing = Boolean(taskToEdit?.id);

  useEffect(() => {
    if (taskModal) {
      setForm(formFromTask(taskToEdit));
      setCoverPreview(taskToEdit?.imageSrc || null);
      setError("");
    }
  }, [taskModal, taskToEdit]);

  useEffect(() => {
    const handler = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) handleTaskModal();
    };
    if (taskModal) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [taskModal, handleTaskModal]);

  useEffect(() => {
    const handler = (event) => { if (event.key === "Escape") handleTaskModal(); };
    if (taskModal) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [taskModal, handleTaskModal]);

  if (!taskModal) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFile = async (file) => {
    if (!file?.type.startsWith("image/")) return;
    try {
      const imageSrc = await resizeImageFile(file);
      setCoverPreview(imageSrc);
      updateField("imageSrc", imageSrc);
    } catch {
      const imageSrc = await readFileAsDataUrl(file);
      setCoverPreview(imageSrc);
      updateField("imageSrc", imageSrc);
    }
  };

  const validate = () => {
    if (!form.title.trim()) return "Task name is required";
    if (form.deadline && Number.isNaN(new Date(`${form.deadline}T${form.dueTime || "00:00"}`).getTime())) {
      return "Enter a valid deadline and time";
    }
    return "";
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      await onTaskSave({ ...form, imageSrc: coverPreview || "" });
      handleTaskModal();
    } catch (saveError) {
      setError(saveError.message || "Unable to save task");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAiTask = async () => {
    if (isGeneratingAi) return;

    const input = [form.title, form.description].filter(Boolean).join("\n\n").trim();
    if (!input) {
      setError("Add a rough task note first");
      return;
    }

    try {
      setIsGeneratingAi(true);
      setError("");
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "task", input }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to generate task");
      setForm((prev) => ({
        ...prev,
        ...data.task,
        id: prev.id,
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(event) => { if (event.target === event.currentTarget) handleTaskModal(); }}
    >
      <div ref={modalRef} className="bg-white w-full sm:max-w-lg max-h-[95dvh] rounded-t-2xl sm:rounded-xl flex flex-col overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center px-5 sm:px-7 py-4 shrink-0 border-b border-[#EDEDED]">
          <p className="font-bold text-base sm:text-lg text-black tracking-wide">
            {isEditing ? "Edit task" : "Add new task"}
          </p>
          <button onClick={handleTaskModal} className="p-1 rounded-full hover:bg-gray-100 transition-colors" disabled={isSaving}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 sm:px-8 py-5 space-y-5">
          <div>
            <div className="flex items-center justify-between gap-3">
              <Label>Task name</Label>
              <button
                type="button"
                onClick={handleAiTask}
                disabled={isGeneratingAi}
                className="mb-1.5 flex items-center gap-1.5 rounded-lg bg-[#F3F0FF] px-3 py-1.5 text-xs font-medium text-[#5943A3] transition-colors hover:bg-[#E6DEFF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SparklesIcon className="h-4 w-4" />
                {isGeneratingAi ? "Writing..." : "AI draft"}
              </button>
            </div>
            <input
              className="w-full border border-[#999999] min-h-11 rounded-lg px-4 text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
              placeholder="Enter task name"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
          </div>

          <div>
            <Label optional>Description</Label>
            <textarea
              className="w-full border border-[#999999] rounded-lg p-3 text-sm resize-none min-h-28 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
              placeholder="Enter task description"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <select value={form.status} onChange={(event) => updateField("status", event.target.value)} className="w-full min-h-11 border border-[#999999] rounded-lg px-3 text-sm bg-white">
                {STATUSES.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </div>
            <div>
              <Label>Priority</Label>
              <select value={form.priority} onChange={(event) => updateField("priority", event.target.value)} className="w-full min-h-11 border border-[#999999] rounded-lg px-3 text-sm bg-white">
                {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label optional>Task cover</Label>
            <div
              className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer ${isDragging ? "border-[#775ADA] bg-[#F3F0FD]" : "border-[#BABABA] hover:border-[#775ADA] hover:bg-gray-50"}`}
              onClick={() => document.getElementById("task-cover-upload").click()}
              onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFile(event.dataTransfer.files[0]); }}
            >
              <input id="task-cover-upload" type="file" accept="image/png,image/jpeg" className="hidden" onChange={(event) => handleFile(event.target.files[0])} />
              {coverPreview ? (
                <div className="relative">
                  <Image src={coverPreview} alt="Cover preview" width={600} height={160} className="w-full h-36 object-cover rounded-xl" />
                  <button onClick={(event) => { event.stopPropagation(); setCoverPreview(null); updateField("imageSrc", ""); }} className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white shadow">
                    <XMarkIcon className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-7 gap-2">
                  <div className="bg-[#EDEDED] p-3 rounded-full">
                    <CloudArrowUpIcon className="w-6 h-6 text-[#999999]" />
                  </div>
                  <p className="text-sm text-[#999999]"><span className="text-[#775ADA] font-medium">Click to upload</span> or drag & drop</p>
                  <p className="text-xs text-[#BABABA]">PNG or JPG</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label optional>Deadline</Label>
              <input type="date" value={form.deadline} onChange={(event) => updateField("deadline", event.target.value)} className="w-full min-h-11 border border-[#999999] rounded-lg px-3 text-sm" />
            </div>
            <div>
              <Label optional>Time</Label>
              <input type="time" value={form.dueTime} onChange={(event) => updateField("dueTime", event.target.value)} className="w-full min-h-11 border border-[#999999] rounded-lg px-3 text-sm" />
            </div>
          </div>

          {error && <p className="text-sm text-[#E50606]">{error}</p>}

          <button onClick={handleSave} disabled={isSaving || !form.title.trim()} className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 bg-gradient-to-b from-[#775ADA] to-[#3B2D6D] ${isSaving || !form.title.trim() ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 hover:shadow-lg"}`}>
            {isSaving ? "Saving..." : isEditing ? "Save changes" : "Save task"}
          </button>
        </div>
      </div>
    </div>
  );
}
