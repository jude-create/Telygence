"use client";

import { useEffect, useState } from "react";

const EMPTY_TASKS = { todo: [], inProgress: [], completed: [] };

export function useDashboardData() {
  const [templates, setTemplates] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [tasks, setTasks] = useState(EMPTY_TASKS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingTemplateId, setDeletingTemplateId] = useState(null);
  const [deletingDraftId, setDeletingDraftId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError("");
        const [templatesResponse, draftsResponse, tasksResponse] = await Promise.all([
          fetch("/api/templates"),
          fetch("/api/drafts"),
          fetch("/api/tasks"),
        ]);

        if (!templatesResponse.ok || !draftsResponse.ok || !tasksResponse.ok) {
          throw new Error("Unable to load dashboard data");
        }

        const [templatesData, draftsData, tasksData] = await Promise.all([
          templatesResponse.json(),
          draftsResponse.json(),
          tasksResponse.json(),
        ]);

        if (isMounted) {
          setTemplates(templatesData);
          setDrafts(draftsData);
          setTasks(tasksData);
        }
      } catch (loadError) {
        if (isMounted) setError(loadError.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const deleteTemplate = async (id) => {
    if (deletingTemplateId) return;
    const previousTemplates = templates;

    try {
      setDeletingTemplateId(id);
      setError("");
      setTemplates((current) => current.filter((template) => template.id !== id));
      const response = await fetch(`/api/templates?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete template");
    } catch (deleteError) {
      setTemplates(previousTemplates);
      setError(deleteError.message);
    } finally {
      setDeletingTemplateId(null);
    }
  };

  const deleteDraft = async (id) => {
    if (deletingDraftId) return;
    const previousDrafts = drafts;

    try {
      setDeletingDraftId(id);
      setError("");
      setDrafts((current) => current.filter((draft) => draft.id !== id));
      const response = await fetch(`/api/drafts?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete draft");
    } catch (deleteError) {
      setDrafts(previousDrafts);
      setError(deleteError.message);
    } finally {
      setDeletingDraftId(null);
    }
  };

  const toggleDraftStar = async (id) => {
    const currentDraft = drafts.find((draft) => draft.id === id);
    if (!currentDraft) return;
    const nextStarred = !currentDraft.isStarred;

    try {
      setDrafts((current) => current.map((draft) => (draft.id === id ? { ...draft, isStarred: nextStarred } : draft)));
      const response = await fetch("/api/drafts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isStarred: nextStarred }),
      });
      if (!response.ok) throw new Error("Unable to update draft");
      const updatedDraft = await response.json();
      setDrafts((current) => current.map((draft) => (draft.id === id ? updatedDraft : draft)));
    } catch (starError) {
      setDrafts((current) => current.map((draft) => (draft.id === id ? currentDraft : draft)));
      setError(starError.message);
    }
  };

  return {
    templates,
    drafts,
    tasks,
    isLoading,
    error,
    deletingTemplateId,
    deletingDraftId,
    deleteTemplate,
    deleteDraft,
    toggleDraftStar,
  };
}
