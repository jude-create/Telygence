import { FlagIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";

function RecentTask() {
  const tasks = {
    todo: [
      { title: "Prepare seminar docs", priority: "M", priorityColor: "#946A00", priorityBg: "#D89E074D", dueDate: "Tues, Oct 1st 2024" },
      {title: "Prepare seminar docs", priority: "M", priorityColor: "#946A00", priorityBg: "#D89E074D", dueDate: "Tues, Oct 1st 2024" },
      {title: "Prepare seminar docs", priority: "M", priorityColor: "#946A00", priorityBg: "#D89E074D", dueDate: "Tues, Oct 1st 2024" }
    ],
    inProgress: [
      { title: "Organize sign-up documents", priority: "H", priorityColor: "#801827", priorityBg: "#FFCBD3", dueDate: "Tues, Oct 1st 2024" },
      { title: "Organize sign-up documents", priority: "H", priorityColor: "#801827", priorityBg: "#FFCBD3", dueDate: "Tues, Oct 1st 2024" },
      { title: "Organize sign-up documents", priority: "H", priorityColor: "#801827", priorityBg: "#FFCBD3", dueDate: "Tues, Oct 1st 2024" },
    ],
    completed: [
      { title: "Prepare proposal for expo", priority: "L", priorityColor: "#14637D", priorityBg: "#C9F1FE", dueDate: "Mon, Sept 30th 2024" },
      { title: "Prepare proposal for expo", priority: "L", priorityColor: "#14637D", priorityBg: "#C9F1FE", dueDate: "Mon, Sept 30th 2024" },
      { title: "Prepare proposal for expo", priority: "L", priorityColor: "#14637D", priorityBg: "#C9F1FE", dueDate: "Mon, Sept 30th 2024" },
     
    ],
  };

  const renderTasks = (taskList) =>
    taskList.map((task, index) => (
      <div key={index} className="flex justify-between w-full">
        <div className="flex w-[50%] space-x-5">
          <p className="truncate">{task.title}</p>
          <p
            className="font-medium w-fit px-4 py-1 rounded-lg"
            style={{ color: task.priorityColor, backgroundColor: task.priorityBg }}
          >
            {task.priority}
          </p>
        </div>
        <div className="flex w-[50%] justify-end space-x-5">
        <FlagIcon
          className={`w-9 h-9 ${
            task.priority === "H"
              ? "text-[#FF304F]" // High priority - Red
              : task.priority === "L"
              ? "text-[#03A12F]" // Low priority - Green
              : "text-[#BABABA]" // Default/Medium - Gray
          }`}
        />
          <p className="text-[#4D4D4D]">{task.dueDate}</p>
        </div>
      </div>
    ));

  return (
    <div className="h-auto w-full bg-[#FFFFFF] rounded-xl mt-6 space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex justify-between px-7 pt-7">
        <div className="flex space-x-2 items-center">
          <Image
            className="w-6 h-6"
            src="/images/taskbar.png"
            alt="Dashboard Icon"
            height={40}
            width={40}
          />
          <p className="font-light text-2xl text-[#001C3D]">Recently tasks</p>
        </div>
        <p className="text-xl text-[#775ADA] cursor-pointer hover:underline">
          View all
        </p>
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* To Do Section */}
      <div className="px-7 text-2xl">
        <div className="flex justify-between">
          <div className="flex space-x-3">
            <div className="mt-2 w-5 h-5 rounded-full bg-[#FF304F]" />
            <p>To do</p>
          </div>
          <PlusIcon className="w-9 h-9 text-[#262626]" />
        </div>
        <div className="mt-9 space-y-7">{renderTasks(tasks.todo)}</div>
      </div>

      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* In Progress Section */}
      <div className="px-7 text-2xl">
        <div className="flex justify-between">
          <div className="flex space-x-3">
            <div className="mt-2 w-5 h-5 rounded-full bg-[#D89E07]" />
            <p>In progress</p>
          </div>
          <PlusIcon className="w-9 h-9 text-[#262626]" />
        </div>
        <div className="mt-9 space-y-7">{renderTasks(tasks.inProgress)}</div>
      </div>

      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* Completed Section */}
      <div className="px-7 text-2xl">
        <div className="flex justify-between">
          <div className="flex space-x-3">
            <div className="mt-2 w-5 h-5 rounded-full bg-[#03A12F]" />
            <p>Completed</p>
          </div>
          <PlusIcon className="w-9 h-9 text-[#262626]" />
        </div>
        <div className="mt-9 space-y-7">{renderTasks(tasks.completed)}</div>
      </div>
    </div>
  );
}

export default RecentTask;
