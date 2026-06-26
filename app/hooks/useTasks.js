"use client";

import { useEffect, useState } from "react";
import { TASK_SECTIONS } from "../components/tasks/taskConstants";

const EMPTY_TASKS = { todo: [], inProgress: [], completed: [] };

function updateTaskInBoard(board, updatedTask) {
  const next = {
    todo: board.todo.filter((task) => task.id !== updatedTask.id),
    inProgress: board.inProgress.filter((task) => task.id !== updatedTask.id),
    completed: board.completed.filter((task) => task.id !== updatedTask.id),
  };
  const status = updatedTask.status || "todo";
  next[status] = [updatedTask, ...next[status]];
  return next;
}

export function useTasks() {
  const [tasks, setTasks] = useState(EMPTY_TASKS);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [taskError, setTaskError] = useState("");
  const [taskModal, setTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [busyTaskIds, setBusyTaskIds] = useState(new Set());

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        setIsLoadingTasks(true);
        setTaskError("");
        const response = await fetch("/api/tasks");
        if (!response.ok) throw new Error("Unable to load tasks");
        const data = await response.json();
        if (isMounted) setTasks(data);
      } catch (error) {
        if (isMounted) setTaskError(error.message);
      } finally {
        if (isMounted) setIsLoadingTasks(false);
      }
    }

    loadTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  const markBusy = (taskId, isBusy) => {
    setBusyTaskIds((prev) => {
      const next = new Set(prev);
      if (isBusy) next.add(taskId);
      else next.delete(taskId);
      return next;
    });
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setTaskModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTaskModal(true);
  };

  const closeTaskModal = () => {
    setTaskModal(false);
    setEditingTask(null);
  };

  const saveTask = async (task) => {
    setTaskError("");
    const response = await fetch("/api/tasks", {
      method: task.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to save task");
    setTasks((prev) => updateTaskInBoard(prev, data));
    return data;
  };

  const moveTask = async (taskId, from, to) => {
    if (from === to || busyTaskIds.has(taskId)) return;
    let movedTask = null;

    setTasks((prev) => {
      movedTask = prev[from].find((item) => item.id === taskId);
      if (!movedTask) return prev;
      return {
        ...prev,
        [from]: prev[from].filter((item) => item.id !== taskId),
        [to]: [{ ...movedTask, status: to, isDropdownVisible: false }, ...prev[to]],
      };
    });

    try {
      markBusy(taskId, true);
      await saveTask({ id: taskId, status: to });
    } catch (error) {
      setTaskError(error.message);
      if (movedTask) {
        setTasks((prev) => ({
          ...prev,
          [to]: prev[to].filter((task) => task.id !== taskId),
          [from]: [movedTask, ...prev[from]],
        }));
      }
    } finally {
      markBusy(taskId, false);
    }
  };

  const deleteTask = async (sectionKey, taskId) => {
    if (busyTaskIds.has(taskId)) return;
    const currentTask = tasks[sectionKey].find((task) => task.id === taskId);

    try {
      markBusy(taskId, true);
      setTasks((prev) => ({ ...prev, [sectionKey]: prev[sectionKey].filter((task) => task.id !== taskId) }));
      const response = await fetch(`/api/tasks?id=${encodeURIComponent(taskId)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete task");
    } catch (error) {
      setTaskError(error.message);
      if (currentTask) setTasks((prev) => ({ ...prev, [sectionKey]: [currentTask, ...prev[sectionKey]] }));
    } finally {
      markBusy(taskId, false);
    }
  };

  const toggleDropdown = (sectionKey, taskId) => {
    setTasks((prev) => {
      const next = { ...prev };
      TASK_SECTIONS.forEach(({ key }) => {
        next[key] = prev[key].map((task) => ({
          ...task,
          isDropdownVisible: key === sectionKey && task.id === taskId ? !task.isDropdownVisible : false,
        }));
      });
      return next;
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      moveTask(draggableId, source.droppableId, destination.droppableId);
    }
  };

  return {
    tasks,
    isLoadingTasks,
    taskError,
    taskModal,
    editingTask,
    busyTaskIds,
    totalCount: Object.values(tasks).flat().length,
    openCreateModal,
    openEditModal,
    closeTaskModal,
    saveTask,
    moveTask,
    deleteTask,
    toggleDropdown,
    handleDragEnd,
  };
}
