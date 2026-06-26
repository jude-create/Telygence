"use client";

import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EllipsisHorizontalIcon,
  FlagIcon,
} from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { Draggable } from "@hello-pangea/dnd";
import { PRIORITY_STYLES } from "./taskConstants";

function getDropdownOptions(sectionKey) {
  const all = [
    { label: "Edit", action: "edit" },
    { label: "Move to To do", action: "moveToTodo", hide: sectionKey === "todo" },
    { label: "Move to In progress", action: "moveToInProgress", hide: sectionKey === "inProgress" },
    { label: "Move to Completed", action: "moveToCompleted", hide: sectionKey === "completed" },
    { label: "Delete", action: "delete", danger: true },
  ];
  return all.filter((option) => !option.hide);
}

export default function TaskCard({
  task,
  sectionKey,
  index,
  isBusy,
  onEdit,
  onMove,
  onDelete,
  onDropdownToggle,
}) {
  const priority = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.Low;
  const isFirst = sectionKey === "todo";
  const isLast = sectionKey === "completed";

  const handleAction = (action) => {
    if (action === "edit") onEdit(task);
    else if (action === "delete") onDelete(sectionKey, task.id);
    else if (action === "moveToTodo") onMove(task.id, sectionKey, "todo");
    else if (action === "moveToInProgress") onMove(task.id, sectionKey, "inProgress");
    else if (action === "moveToCompleted") onMove(task.id, sectionKey, "completed");
    onDropdownToggle(sectionKey, task.id);
  };

  return (
    <Draggable draggableId={String(task.id)} index={index} isDragDisabled={isBusy}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-[#FAFAFD] rounded-xl p-4 space-y-3 border border-[#E0DDEA] transition-all duration-200 select-none ${
            snapshot.isDragging ? "shadow-xl scale-[1.02] rotate-1 border-[#775ADA]" : "hover:shadow-md hover:border-[#C4BAF0]"
          } ${isBusy ? "opacity-60 pointer-events-none" : ""}`}
        >
          <div className="flex justify-between items-center gap-2">
            <span
              className="px-3 py-1 rounded-md text-xs font-semibold"
              style={{ backgroundColor: priority.bg, color: priority.text }}
            >
              {task.priority}
            </span>

            <div className="flex items-center gap-1.5">
              {!isFirst && (
                <button
                  onClick={() => onMove(task.id, sectionKey, sectionKey === "completed" ? "inProgress" : "todo")}
                  className="p-2 rounded-full hover:bg-[#EDE9FB] transition-colors"
                  title="Move back"
                  disabled={isBusy}
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5 text-[#775ADA]" />
                </button>
              )}
              {!isLast && (
                <button
                  onClick={() => onMove(task.id, sectionKey, sectionKey === "todo" ? "inProgress" : "completed")}
                  className="p-2 rounded-full hover:bg-[#EDE9FB] transition-colors"
                  title="Move forward"
                  disabled={isBusy}
                >
                  <ArrowRightIcon className="w-3.5 h-3.5 text-[#775ADA]" />
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => onDropdownToggle(sectionKey, task.id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={isBusy}
                  aria-label="Task actions"
                >
                  <EllipsisHorizontalIcon className="w-4 h-4 text-[#737373]" />
                </button>

                {task.isDropdownVisible && (
                  <div className="absolute right-0 top-7 bg-white border border-gray-200 rounded-xl shadow-lg z-30 w-44 py-1 overflow-hidden">
                    {getDropdownOptions(sectionKey).map((option) => (
                      <button
                        key={option.action}
                        className={`w-full text-left text-sm px-4 py-2 hover:bg-gray-50 transition-colors ${
                          option.danger ? "text-[#E50606]" : "text-[#1C1C1C]"
                        }`}
                        onClick={() => handleAction(option.action)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm text-[#1C1C1C] leading-snug">{task.title}</p>
            <p className="text-xs text-[#737373] mt-1 leading-relaxed line-clamp-2">{task.description}</p>
          </div>

          {task.imageSrc && (
            <div className="relative w-full h-28">
              <Image src={task.imageSrc} fill loading="eager" className="object-cover rounded-lg" alt="task" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-1 border-t border-[#F0F0F0]">
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
