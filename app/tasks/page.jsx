"use client";

import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { PlusIcon, ViewColumnsIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import TaskModal from "../modals/TaskModal";
import TaskSection from "../components/tasks/TaskSection";
import { TASK_SECTIONS } from "../components/tasks/taskConstants";
import { ErrorState, LoadingState } from "../components/LoadingState";
import { useTasks } from "../hooks/useTasks";

export default function Tasks() {
  const taskState = useTasks();
  const [viewMode, setViewMode] = useState("board");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) setViewMode("list");
    const handler = (event) => {
      if (event.matches) setViewMode("list");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <DragDropContext onDragEnd={taskState.handleDragEnd}>
      <div className="min-h-screen bg-[#F6F7FB] p-3 sm:p-5 lg:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_170px] gap-3 w-full mb-4 sm:mb-5">
          <div className="flex justify-between items-center gap-3 px-4 sm:px-6 py-3 bg-white rounded-xl border border-[#E7E4F0] shadow-sm w-full min-w-0">
            <div className="flex items-center gap-3">
              <p className="text-base sm:text-xl font-medium">Tasks</p>
              <span className="text-xs bg-[#EDE9FB] text-[#775ADA] px-2.5 py-1 rounded-full font-semibold">
                {taskState.isLoadingTasks ? "Loading..." : `${taskState.totalCount} total`}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[#EDEDED] p-1 rounded-lg">
              <button onClick={() => setViewMode("board")} className={`p-1.5 rounded-md transition-colors ${viewMode === "board" ? "bg-white shadow-sm text-[#775ADA]" : "text-[#737373] hover:text-black"}`} title="Board view">
                <ViewColumnsIcon className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-[#775ADA]" : "text-[#737373] hover:text-black"}`} title="List view">
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button onClick={taskState.openCreateModal} className="flex justify-center items-center gap-2 rounded-xl bg-custom-radial w-full min-h-12 sm:min-h-14 text-sm sm:text-base font-bold text-white hover:opacity-90 transition-opacity">
            Add new task
            <PlusIcon className="w-5 h-5 shrink-0" />
          </button>
        </div>

        <ErrorState message={taskState.taskError} />

        {taskState.isLoadingTasks ? (
          <div className="bg-white rounded-xl border border-[#E7E4F0] shadow-sm">
            <LoadingState label="Loading tasks..." />
          </div>
        ) : (
          <div className={viewMode === "board" ? "grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 items-start" : "flex flex-col gap-4"}>
            {TASK_SECTIONS.map((section) => (
              <div key={section.key} className={`bg-white rounded-2xl p-4 border border-[#E7E4F0] shadow-sm ${viewMode === "board" ? "" : "w-full"}`}>
                <TaskSection
                  tasks={taskState.tasks[section.key]}
                  section={section}
                  viewMode={viewMode}
                  busyTaskIds={taskState.busyTaskIds}
                  onEdit={taskState.openEditModal}
                  onMove={taskState.moveTask}
                  onDelete={taskState.deleteTask}
                  onDropdownToggle={taskState.toggleDropdown}
                  onAddTask={taskState.openCreateModal}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskModal
        taskModal={taskState.taskModal}
        taskToEdit={taskState.editingTask}
        handleTaskModal={taskState.closeTaskModal}
        onTaskSave={taskState.saveTask}
      />
    </DragDropContext>
  );
}
