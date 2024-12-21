"use client"
import { FlagIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";
import TaskModal from "../modals/TaskModal";
import Link from "next/link";

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
    
  const [taskModal, setTaskModal] = useState(false);

   // Function to handle the "Create Template" modal
   const handleTaskModal = () => {
    setTaskModal(!taskModal);
  };
 

  const renderTasks = (taskList) =>
    taskList.map((task, index) => (
      <div key={index} className="flex justify-between w-full">
        <div className="flex w-[50%] space-x-1">
          <p className="truncate w-[60%] font-medium">{task.title}</p>
          <p
            className="font-semibold w-fit px-4 py-1 rounded-lg"
            style={{ color: task.priorityColor, backgroundColor: task.priorityBg }}
          >
            {task.priority}
          </p>
        </div>
        <div className="flex w-[50%] justify-end space-x-1">
        <FlagIcon
          className={`w-5 h-5 ${
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
    <>
    <div className="h-auto w-full bg-[#FFFFFF] rounded-xl mt-4 space-y-5 pb-8">
      {/* Header Section */}
      <div className="flex justify-between px-7 pt-5">
        <div className="flex space-x-3 items-center">
          <Image
            className="w-5 h-5"
            src="/images/taskbar.png"
            alt="Dashboard Icon"
            height={40}
            width={40}
          />
          <p className="font-light text-lg text-[#001C3D]">Recently tasks</p>
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
          <PlusIcon
          onClick={handleTaskModal}
           className="w-5 h-5 text-[#262626] cursor-pointer" />
        </div>
        <div className="mt-6 space-y-3">{renderTasks(tasks.todo)}</div>
      </div>

      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* In Progress Section */}
      <div className="px-4 text-sm">
        <div className="flex justify-between">
          <div className="flex space-x-2 justify-center items-center">
            <div className="mt-2 w-3 h-3 rounded-full bg-[#D89E07]" />
            <p className="pt-2 font-semibold">In progress</p>
          </div>
          <PlusIcon
          onClick={handleTaskModal}
           className="w-5 h-5 text-[#262626] cursor-pointer" />
        </div>
        <div className="mt-6 space-y-3">{renderTasks(tasks.inProgress)}</div>
      </div>

      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* Completed Section */}
      <div className="px-4 text-sm">
        <div className="flex justify-between">
          <div className="flex space-x-2 justify-center items-center">
            <div className="mt-2 w-3 h-3 rounded-full bg-[#03A12F]" />
            <p className="pt-2 font-semibold">Completed</p>
          </div>
          <PlusIcon 
          onClick={handleTaskModal}
          className="w-5 h-5 text-[#262626] cursor-pointer" />
        </div>
        <div className="mt-6 space-y-3">{renderTasks(tasks.completed)}</div>
      </div>
    </div>
     {/* Template Modal */}
     <TaskModal taskModal={taskModal} handleTaskModal={handleTaskModal} />
     </>
  );
}

export default RecentTask;
