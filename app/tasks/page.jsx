"use client";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EllipsisHorizontalIcon,
  FlagIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskModal from "../modals/TaskModal";
import { ClockIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Tasks() {
  const [taskModal, setTaskModal] = useState(false);
  const dropdownRefs = useRef({});

  // Task data with individual task state
  const [tasks, setTasks] = useState({
    todo: [
      {
        id: 1,
        title: "Prepare seminar docs",
        description:
          "Write a MS Word document of over 2000 words that explains the organization summary of Telygence",
        priority: "Medium",
        dueDate: "Tues, Oct 1st 2024",
        time: "11:09 AM",
        imageSrc: "",
        flagColor: "#FF304F",
        isDropdownVisible: false,
      },
      {
        id: 2,
        title: "Write marketing report",
        description: "Draft a marketing performance report for Q3.",
        priority: "High",
        dueDate: "Wed, Oct 2nd 2024",
        time: "02:15 PM",
        imageSrc: "",
        flagColor: "#D89E07",
        isDropdownVisible: false,
      },
    ],
    inProgress: [
      {
        id: 3,
        title: "Organize sign-up documents",
        description: "Prepare sign-up sheets for the new event.",
        priority: "High",
        dueDate: "Fri, Oct 4th 2024",
        time: "09:30 AM",
        imageSrc: "/images/Rectangle.png",
        flagColor: "#BABABA",
        isDropdownVisible: false,
      },
    ],
    completed: [
      {
        id: 4,
        title: "Prepare proposal for expo",
        description:
          "Prepare a detailed partnership proposal for the NES 30 competition exhibition at Transcorp Hilton hotel Abuja",
        priority: "Low",
        dueDate: "Mon, Oct 7th 2024",
        time: "05:00 PM",
        imageSrc: "",
        flagColor: "#03A12F",
      },
    ],
  });

  // Handle drag-and-drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceSection = result.source.droppableId;
    const destSection = result.destination.droppableId;
    const taskId = Number(result.draggableId);

    if (sourceSection !== destSection) {
      moveTask(taskId, sourceSection, destSection);
    }
  };

  // Move task between sections
  const moveTask = (taskId, fromSection, toSection) => {
    setTasks((prevTasks) => {
      const taskToMove = prevTasks[fromSection].find((task) => task.id === taskId);
      return {
        ...prevTasks,
        [fromSection]: prevTasks[fromSection].filter((task) => task.id !== taskId),
        [toSection]: [...prevTasks[toSection], taskToMove],
      };
    });
  };

  // Dropdown options
  const getDropdownOptions = (sectionKey) => {
    switch (sectionKey) {
      case "todo":
        return [
          { label: "Edit", action: "edit" },
          { label: "Move to In Progress", action: "moveToInProgress" },
          { label: "Move to Completed", action: "moveToCompleted" },
          { label: "Delete", action: "delete" },
        ];
      case "inProgress":
        return [
          { label: "Edit", action: "edit" },
          { label: "Move to To Do", action: "moveToTodo" },
          { label: "Move to Completed", action: "moveToCompleted" },
          { label: "Delete", action: "delete" },
        ];
      case "completed":
        return [
          { label: "Edit", action: "edit" },
          { label: "Move to In Progress", action: "moveToInProgress" },
          { label: "Move to To Do", action: "moveToTodo" },
          { label: "Delete", action: "delete" },
        ];
      default:
        return [];
    }
  };

  // Handle dropdown actions
  const handleDropdownAction = (sectionKey, taskId, action) => {
    switch (action) {
      case "edit":
        console.log(`Editing task ${taskId}`);
        break;
      case "moveToTodo":
        moveTask(taskId, sectionKey, "todo");
        break;
      case "moveToInProgress":
        moveTask(taskId, sectionKey, "inProgress");
        break;
      case "moveToCompleted":
        moveTask(taskId, sectionKey, "completed");
        break;
      case "delete":
        setTasks((prevTasks) => ({
          ...prevTasks,
          [sectionKey]: prevTasks[sectionKey].filter((task) => task.id !== taskId),
        }));
        break;
      default:
        console.error(`Unknown action: ${action}`);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (sectionKey, taskId) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [sectionKey]: prevTasks[sectionKey].map((task) =>
        task.id === taskId
          ? { ...task, isDropdownVisible: !task.isDropdownVisible }
          : { ...task, isDropdownVisible: false }
      ),
    }));
  };

  // Handle task modal
  const handleTaskModal = () => {
    setTaskModal(!taskModal);
  };

  // TaskSection component
  const TaskSection = ({ tasks, sectionTitle, sectionColor, sectionKey }) => {
    return (
      <Droppable droppableId={sectionKey}>
        {(provided, snapshot) => (
          <section
            className={`w-1/3 flex flex-col`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <div
                  className={`w-3 h-3 rounded-full`}
                  style={{ backgroundColor: sectionColor }}
                />
                <p className="font-semibold">
                  {sectionTitle} ({tasks.length})
                </p>
              </div>
              <PlusIcon
                onClick={handleTaskModal}
                className="w-5 h-5 text-[#262626] cursor-pointer"
              />
            </div>
            <div
              className={`mt-2 space-y-3  transition-all duration-200 
                
              `}
             
            >
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center pt-28 space-y-6 h-full">
                  <p className="text-base text-[#AAAAAA]">
                    You have not set any tasks yet in this section
                  </p>
                  <Image
                    src="/images/ballon.png"
                    alt="No Tasks Available"
                    height={200}
                    width={200}
                  />
                </div>
              ) : (
                tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={String(task.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-[#FAFAFA] p-4 space-y-3 rounded-lg shadow-sm transition-all duration-200 ${
                          snapshot.isDragging
                            ? "shadow-lg transform scale-105 fixed" // Fixed position during drag
                            : "hover:shadow-md"
                        }`}
                      >
                        {/* Task content */}
                        <div className="flex justify-between">
                          <p
                            className={`px-4 py-2 rounded-md text-sm font-medium w-fit`}
                            style={{
                              backgroundColor:
                                task.priority === "High"
                                  ? "#FFCBD3"
                                  : task.priority === "Medium"
                                  ? "#D89E074D"
                                  : "#C9F1FE",
                              color:
                                task.priority === "High"
                                  ? "#801827"
                                  : task.priority === "Medium"
                                  ? "#946A00"
                                  : "#14637D",
                            }}
                          >
                            {task.priority}
                          </p>
                          <div className="flex space-x-4 cursor-pointer">
                            {sectionTitle !== "To do" && (
                              <ArrowLeftIcon
                                onClick={() =>
                                  moveTask(task.id, sectionKey, "todo")
                                }
                                className="w-5 h-5 text-[#9983E3]"
                              />
                            )}
                            {sectionTitle !== "Completed" && (
                              <ArrowRightIcon
                                onClick={() =>
                                  moveTask(task.id, sectionKey, "completed")
                                }
                                className="w-5 h-5 text-[#9983E3]"
                              />
                            )}
                            <div className="relative" ref={dropdownRefs}>
                              <EllipsisHorizontalIcon
                                onClick={() => toggleDropdown(sectionKey, task.id)}
                                className="w-5 h-5 cursor-pointer"
                              />
                              {task.isDropdownVisible && (
                                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-48">
                                  {getDropdownOptions(sectionKey).map((option) => (
                                    <button
                                      key={option.action}
                                      className={`w-full text-left text-sm px-4 py-2 hover:bg-gray-100 ${
                                        option.action === "delete" ? "text-red-500" : ""
                                      }`}
                                      onClick={() =>
                                        handleDropdownAction(sectionKey, task.id, option.action)
                                      }
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <p className="font-semibold">{task.title}</p>
                          <p>{task.description}</p>
                          {task.imageSrc && (
                            <Image
                              src={task.imageSrc}
                              className="w-full h-24"
                              height={100}
                              width={100}
                              alt="task image"
                            />
                          )}
                          <div className="flex justify-between">
                            <div className="flex space-x-2">
                              <FlagIcon
                                className="w-5 h-5"
                                style={{ color: task.flagColor }}
                              />
                              <p>{task.dueDate}</p>
                            </div>
                            <div className="text-[#999999] flex space-x-1 xl:space-x-2">
                              <ClockIcon className="w-5 h-5" />
                              <p>{task.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          </section>
        )}
      </Droppable>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-6 md:p-7 mt-20 h-screen bg-[#EDEDED] lg:h-full ">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-5 w-full">
          {/* Welcome Section */}
          <div className="w-full md:w-[80%] flex justify-between px-4 md:px-8 items-center h-auto bg-white rounded-xl">
            <p className="text-base md:text-xl font-medium">Tasks</p>
          </div>

          {/* Buttons Section */}
          <div className="w-full md:w-[20%] flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4">
            {/* Create Template Button */}
            <button
              onClick={handleTaskModal}
              className="flex justify-center items-center rounded-lg bg-custom-radial w-full h-14 
             text-base md:text-lg font-bold tracking-wide text-white transition-all ease-in-out duration-500 
             hover:bg-[#C9F1FE80] hover:tracking-widest"
            >
              Add new task
              <PlusIcon className="w-7 h-7 text-white xl:ml-2" />
            </button>
          </div>
        </div>

        <div className="flex space-x-12 mt-3 w-full">
          <TaskSection
            tasks={tasks.todo}
            sectionTitle="To do"
            sectionColor="#FF304F"
            sectionKey="todo"
          />
          <TaskSection
            tasks={tasks.inProgress}
            sectionTitle="In progress"
            sectionColor="#D89E07"
            sectionKey="inProgress"
          />
          <TaskSection
            tasks={tasks.completed}
            sectionTitle="Completed"
            sectionColor="#03A12F"
            sectionKey="completed"
          />
        </div>
      </div>
      {/* Task Modal */}
      <TaskModal taskModal={taskModal} handleTaskModal={handleTaskModal} />
    </DragDropContext>
  );
}