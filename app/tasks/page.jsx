"use client";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EllipsisHorizontalIcon,
  FlagIcon,
  PlusIcon,
  ViewColumnsIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskModal from "../modals/TaskModal";
import Image from "next/image";

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { key: "todo",       label: "To do",       color: "#FF304F", bg: "bg-[#FF304F]" },
  { key: "inProgress", label: "In progress", color: "#D89E07", bg: "bg-[#D89E07]" },
  { key: "completed",  label: "Completed",   color: "#03A12F", bg: "bg-[#03A12F]" },
];

const PRIORITY_STYLES = {
  High:   { bg: "#FFCBD3", text: "#801827" },
  Medium: { bg: "#D89E074D", text: "#946A00" },
  Low:    { bg: "#C9F1FE", text: "#14637D" },
};

const INITIAL_TASKS = {
  todo: [
    { id: 1, title: "Prepare seminar docs", description: "Write a MS Word document of over 2000 words that explains the organization summary of Telygence", priority: "Medium", dueDate: "Tues, Oct 1st 2024", time: "11:09 AM", imageSrc: "", flagColor: "#FF304F" },
    { id: 2, title: "Write marketing report", description: "Draft a marketing performance report for Q3.", priority: "High", dueDate: "Wed, Oct 2nd 2024", time: "02:15 PM", imageSrc: "", flagColor: "#D89E07" },
  ],
  inProgress: [
    { id: 3, title: "Organize sign-up documents", description: "Prepare sign-up sheets for the new event.", priority: "High", dueDate: "Fri, Oct 4th 2024", time: "09:30 AM", imageSrc: "/images/rectangle.png", flagColor: "#BABABA" },
  ],
  completed: [
    { id: 4, title: "Prepare proposal for expo", description: "Prepare a detailed partnership proposal for the NES 30 competition exhibition at Transcorp Hilton hotel Abuja", priority: "Low", dueDate: "Mon, Oct 7th 2024", time: "05:00 PM", imageSrc: "", flagColor: "#03A12F" },
  ],
};

// ─── Dropdown options per section ─────────────────────────────────────────────

function getDropdownOptions(sectionKey) {
  const all = [
    { label: "Edit",                  action: "edit" },
    { label: "Move to To do",         action: "moveToTodo",       hide: sectionKey === "todo" },
    { label: "Move to In progress",   action: "moveToInProgress", hide: sectionKey === "inProgress" },
    { label: "Move to Completed",     action: "moveToCompleted",  hide: sectionKey === "completed" },
    { label: "Delete",                action: "delete",           danger: true },
  ];
  return all.filter((o) => !o.hide);
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────

function TaskCard({ task, sectionKey, index, onMove, onDelete, onDropdownToggle }) {
  const p = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.Low;
  const isFirst = sectionKey === "todo";
  const isLast  = sectionKey === "completed";

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-xl p-4 space-y-3 border border-[#EDEDED]
            transition-all duration-200 select-none
            ${snapshot.isDragging ? "shadow-xl scale-[1.02] rotate-1 border-[#775ADA]" : "hover:shadow-md hover:border-[#C4BAF0]"}`}
        >
          {/* Top row: priority + actions */}
          <div className="flex justify-between items-center">
            <span
              className="px-3 py-1 rounded-md text-xs font-semibold"
              style={{ backgroundColor: p.bg, color: p.text }}
            >
              {task.priority}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Move left */}
              {!isFirst && (
                <button
                  onClick={() => onMove(task.id, sectionKey, sectionKey === "completed" ? "inProgress" : "todo")}
                  className="p-1 rounded-full hover:bg-[#EDE9FB] transition-colors"
                  title="Move back"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5 text-[#775ADA]" />
                </button>
              )}
              {/* Move right */}
              {!isLast && (
                <button
                  onClick={() => onMove(task.id, sectionKey, sectionKey === "todo" ? "inProgress" : "completed")}
                  className="p-1 rounded-full hover:bg-[#EDE9FB] transition-colors"
                  title="Move forward"
                >
                  <ArrowRightIcon className="w-3.5 h-3.5 text-[#775ADA]" />
                </button>
              )}

              {/* Dropdown */}
              <div className="relative">
                <button
                  onClick={() => onDropdownToggle(sectionKey, task.id)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <EllipsisHorizontalIcon className="w-4 h-4 text-[#737373]" />
                </button>

                {task.isDropdownVisible && (
                  <div className="absolute right-0 top-7 bg-white border border-gray-200 rounded-xl shadow-lg z-30 w-44 py-1 overflow-hidden">
                    {getDropdownOptions(sectionKey).map((opt) => (
                      <button
                        key={opt.action}
                        className={`w-full text-left text-sm px-4 py-2 hover:bg-gray-50 transition-colors
                          ${opt.danger ? "text-[#E50606]" : "text-[#1C1C1C]"}`}
                        onClick={() => {
                          if (opt.action === "delete") onDelete(sectionKey, task.id);
                          else if (opt.action === "moveToTodo")       onMove(task.id, sectionKey, "todo");
                          else if (opt.action === "moveToInProgress") onMove(task.id, sectionKey, "inProgress");
                          else if (opt.action === "moveToCompleted")  onMove(task.id, sectionKey, "completed");
                          onDropdownToggle(sectionKey, task.id); // close
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title + description */}
          <div>
            <p className="font-semibold text-sm text-[#1C1C1C] leading-snug">{task.title}</p>
            <p className="text-xs text-[#737373] mt-1 leading-relaxed line-clamp-2">{task.description}</p>
          </div>

          {/* Image */}
          {task.imageSrc && (
            <Image
              src={task.imageSrc}
              className="w-full h-28 object-cover rounded-lg"
              height={112} width={300} alt="task"
            />
          )}

          {/* Footer: due date + time */}
          <div className="flex justify-between items-center pt-1 border-t border-[#F0F0F0]">
            <div className="flex items-center gap-1.5">
              <FlagIcon className="w-3.5 h-3.5 shrink-0" style={{ color: task.flagColor }} />
              <p className="text-xs text-[#4D4D4D]">{task.dueDate}</p>
            </div>
            <div className="flex items-center gap-1 text-[#999999]">
              <ClockIcon className="w-3.5 h-3.5" />
              <p className="text-xs">{task.time}</p>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

// ─── TaskSection ──────────────────────────────────────────────────────────────

function TaskSection({ tasks, section, viewMode, onMove, onDelete, onDropdownToggle, onAddTask }) {
  const total = tasks.length;

  return (
    <Droppable droppableId={section.key} direction="vertical">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col min-w-0 transition-colors duration-200 rounded-xl
            ${viewMode === "board" ? "flex-1" : "w-full"}
            ${snapshot.isDraggingOver ? "bg-[#F3F0FD]" : ""}`}
        >
          {/* Section header */}
          <div className={`flex justify-between items-center mb-3 px-1 ${viewMode === "list" ? "py-2 border-b border-[#EDEDED]" : ""}`}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
              <p className="font-semibold text-sm text-[#1C1C1C]">
                {section.label}
              </p>
              <span className="text-xs bg-[#EDEDED] text-[#737373] px-2 py-0.5 rounded-full font-medium">
                {total}
              </span>
            </div>
            <button
              onClick={onAddTask}
              className="p-1 rounded-full hover:bg-[#EDE9FB] transition-colors"
              title="Add task"
            >
              <PlusIcon className="w-4 h-4 text-[#775ADA]" />
            </button>
          </div>

          {/* Cards */}
          <div className={`space-y-3 flex-1 ${viewMode === "list" ? "space-y-1.5" : ""}`}>
            {total === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Image src="/images/ballon.png" alt="empty" height={100} width={100} className="opacity-50" />
                <p className="text-xs text-[#AAAAAA] mt-3 max-w-[140px]">No tasks here yet</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  sectionKey={section.key}
                  index={index}
                  onMove={onMove}
                  onDelete={onDelete}
                  onDropdownToggle={onDropdownToggle}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

// ─── Main Tasks page ──────────────────────────────────────────────────────────

export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [taskModal, setTaskModal] = useState(false);
  // "board" = 3-column grid, "list" = stacked sections
  const [viewMode, setViewMode] = useState("board");
  // On mobile default to list
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) setViewMode("list");
    const handler = (e) => { if (e.matches) setViewMode("list"); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const moveTask = (taskId, from, to) => {
    if (from === to) return;
    setTasks((prev) => {
      const task = prev[from].find((t) => t.id === taskId);
      return {
        ...prev,
        [from]: prev[from].filter((t) => t.id !== taskId),
        [to]: [...prev[to], { ...task, isDropdownVisible: false }],
      };
    });
  };

  const deleteTask = (sectionKey, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter((t) => t.id !== taskId),
    }));
  };

  const toggleDropdown = (sectionKey, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((t) =>
        t.id === taskId
          ? { ...t, isDropdownVisible: !t.isDropdownVisible }
          : { ...t, isDropdownVisible: false }
      ),
    }));
    // also close dropdowns in other sections
    setTasks((prev) => {
      const next = { ...prev };
      SECTIONS.forEach(({ key }) => {
        if (key !== sectionKey) {
          next[key] = prev[key].map((t) => ({ ...t, isDropdownVisible: false }));
        }
      });
      return next;
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      moveTask(Number(draggableId), source.droppableId, destination.droppableId);
    }
  };

  const totalCount = Object.values(tasks).flat().length;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-[#F5F4FA] p-4 sm:p-6 lg:p-7">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mb-4 sm:mb-5">
          {/* Title bar */}
          <div className="flex justify-between items-center px-4 sm:px-8 py-3 bg-white rounded-xl w-full sm:w-[80%]">
            <div className="flex items-center gap-3">
              <p className="text-base sm:text-xl font-medium">Tasks</p>
              <span className="text-xs bg-[#EDE9FB] text-[#775ADA] px-2.5 py-1 rounded-full font-semibold">
                {totalCount} total
              </span>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-1 bg-[#EDEDED] p-1 rounded-lg">
              <button
                onClick={() => setViewMode("board")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "board" ? "bg-white shadow-sm text-[#775ADA]" : "text-[#737373] hover:text-black"}`}
                title="Board view"
              >
                <ViewColumnsIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-[#775ADA]" : "text-[#737373] hover:text-black"}`}
                title="List view"
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add task button */}
          <div className="w-full sm:w-[20%]">
            <button
              onClick={() => setTaskModal(true)}
              className="flex justify-center items-center gap-2 rounded-xl bg-custom-radial
                         w-full h-12 sm:h-14 text-sm sm:text-base font-bold text-white
                         hover:opacity-90 transition-opacity"
            >
              Add new task
              <PlusIcon className="w-5 h-5 shrink-0" />
            </button>
          </div>
        </div>

        {/* ── Board / List view ────────────────────────────────────────────── */}
        <div
          className={
            viewMode === "board"
              ? "grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start"
              : "flex flex-col gap-4"
          }
        >
          {SECTIONS.map((section) => (
            <div
              key={section.key}
              className={`bg-[#FAFAFA] rounded-2xl p-4 border border-[#EDEDED]
                ${viewMode === "board" ? "" : "w-full"}`}
            >
              <TaskSection
                tasks={tasks[section.key]}
                section={section}
                viewMode={viewMode}
                onMove={moveTask}
                onDelete={deleteTask}
                onDropdownToggle={toggleDropdown}
                onAddTask={() => setTaskModal(true)}
              />
            </div>
          ))}
        </div>
      </div>

      <TaskModal taskModal={taskModal} handleTaskModal={() => setTaskModal((o) => !o)} />
    </DragDropContext>
  );
}