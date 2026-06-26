"use client"
import { FlagIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { LoadingState } from "./LoadingState";

const PRIORITY_LOOKUP = {
  High: { label: "H", color: "#801827", bg: "#FFCBD3" },
  Medium: { label: "M", color: "#946A00", bg: "#D89E074D" },
  Low: { label: "L", color: "#14637D", bg: "#C9F1FE" },
};

function RecentTask({ tasks = { todo: [], inProgress: [], completed: [] }, isLoading = false }) {

  const renderTasks = (taskList) => {
    if (taskList.length === 0) {
      return <p className="text-gray-500 italic text-center">You have no available tasks in this section</p>;
    }
  
    return taskList.map((task) => {
      const priority = PRIORITY_LOOKUP[task.priority] || PRIORITY_LOOKUP.Low;
      return (
      <div key={task.id} className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-2 w-full rounded-lg bg-[#FAFAFD] border border-[#E7E4F0] p-3">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate font-medium min-w-0">{task.title}</p>
          <p
            className="font-semibold px-3 py-1 rounded-lg text-xs shrink-0"
            style={{ color: priority.color, backgroundColor: priority.bg }}
          >
            {priority.label}
          </p>
        </div>
        <div className="flex min-w-0 justify-start sm:justify-end items-center gap-1">
          <FlagIcon
            className={`w-5 h-5 ${
              priority.label === "H"
                ? "text-[#FF304F]"
                : priority.label === "L"
                ? "text-[#03A12F]"
                : "text-[#BABABA]"
            }`}
          />
          <p className="text-[#4D4D4D] truncate">{task.dueDate}</p>
        </div>
      </div>
    )});
  };
  

  return (
    <>
    <section className="max-h-full w-full bg-white rounded-xl border border-[#E7E4F0] shadow-sm space-y-5 pb-6 overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between gap-3 xl:px-6 px-4 pt-5">
        <div className="flex space-x-2 items-center">
          <Image
            className="w-5 h-5"
            src="/images/taskbar.png"
            alt="Dashboard Icon"
            height={40}
            width={40}
          />
          <p className="font-medium text-base text-[#001C3D]">Recent tasks</p>
        </div>
        <Link href="/tasks">
        <p className="text-base text-[#775ADA] cursor-pointer hover:underline">
          View all
        </p>
        </Link>
       
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* To Do Section */}
      <div className="px-4 text-sm">
        <div className="flex justify-between">
          <div className="flex space-x-2 justify-center items-center">
            <div className="mt-2 w-3 h-3 rounded-full bg-[#FF304F]" />
            <p className="pt-2 font-semibold">To do</p>
          </div>
          <Link href="/tasks" className="p-2 rounded-full hover:bg-[#EDE9FB]" aria-label="Add task"><PlusIcon className="w-5 h-5 text-[#262626]" /></Link>
        </div>
        <div className="mt-4 space-y-3">{isLoading ? <LoadingState label="Loading tasks..." /> : renderTasks(tasks.todo.slice(0, 3))}</div>
      </div>

      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* In Progress Section */}
      <div className="px-4 text-sm">
        <div className="flex justify-between">
          <div className="flex space-x-2 justify-center items-center">
            <div className="mt-2 w-3 h-3 rounded-full bg-[#D89E07]" />
            <p className="pt-2 font-semibold">In progress</p>
          </div>
          <Link href="/tasks" className="p-2 rounded-full hover:bg-[#EDE9FB]" aria-label="Add task"><PlusIcon className="w-5 h-5 text-[#262626]" /></Link>
        </div>
        <div className="mt-4 space-y-3">{isLoading ? <LoadingState label="Loading tasks..." /> : renderTasks(tasks.inProgress.slice(0, 3))}</div>
      </div>

      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* Completed Section */}
      <div className="px-4 text-sm">
        <div className="flex justify-between">
          <div className="flex space-x-2 justify-center items-center">
            <div className="mt-2 w-3 h-3 rounded-full bg-[#03A12F]" />
            <p className="pt-2 font-semibold">Completed</p>
          </div>
          <Link href="/tasks" className="p-2 rounded-full hover:bg-[#EDE9FB]" aria-label="Add task"><PlusIcon className="w-5 h-5 text-[#262626]" /></Link>
        </div>
        <div className="mt-4 space-y-3">{isLoading ? <LoadingState label="Loading tasks..." /> : renderTasks(tasks.completed.slice(0, 3))}</div>
      </div>
    </section>
     </>
  );
}

export default RecentTask;
