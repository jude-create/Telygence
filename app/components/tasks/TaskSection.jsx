"use client";

import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function TaskSection({
  tasks,
  section,
  viewMode,
  busyTaskIds,
  onEdit,
  onMove,
  onDelete,
  onDropdownToggle,
  onAddTask,
}) {
  const total = tasks.length;

  return (
    <Droppable droppableId={section.key} direction="vertical">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col min-w-0 transition-colors duration-200 rounded-xl ${
            viewMode === "board" ? "flex-1" : "w-full"
          } ${snapshot.isDraggingOver ? "bg-[#F3F0FD]" : ""}`}
        >
          <div className={`flex justify-between items-center mb-3 px-1 ${viewMode === "list" ? "py-2 border-b border-[#EDEDED]" : ""}`}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
              <p className="font-semibold text-sm text-[#1C1C1C]">{section.label}</p>
              <span className="text-xs bg-[#EDEDED] text-[#737373] px-2 py-0.5 rounded-full font-medium">
                {total}
              </span>
            </div>
            <button onClick={onAddTask} className="p-2 rounded-full hover:bg-[#EDE9FB] transition-colors" title="Add task">
              <PlusIcon className="w-4 h-4 text-[#775ADA]" />
            </button>
          </div>

          <div className={`space-y-3 flex-1 ${viewMode === "list" ? "space-y-1.5" : ""}`}>
            {total === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Image src="/images/ballon.png" alt="empty" height={100} width={100} className="opacity-50" style={{ width: "auto", height: "auto" }} />
                <p className="text-xs text-[#AAAAAA] mt-3 max-w-[140px]">No tasks here yet</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  sectionKey={section.key}
                  index={index}
                  isBusy={busyTaskIds.has(task.id)}
                  onEdit={onEdit}
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
