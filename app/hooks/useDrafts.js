"use client";

import { useEffect, useRef, useState } from "react";

export function useDrafts() {
  const [title, setTitle] = useState("");
  const [isStarred, setIsStarred] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [routeDraftId, setRouteDraftId] = useState(null);
  const editorRef = useRef(null);
  const [drafts, setDrafts] = useState([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [draftError, setDraftError] = useState("");
  const [saveStatus, setSaveStatus] = useState("Ready");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [deletingDraftId, setDeletingDraftId] = useState(null);
  const [updatingStarIds, setUpdatingStarIds] = useState(new Set());
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDrafts() {
      try {
        setIsLoadingDrafts(true);
        setDraftError("");
        const response = await fetch("/api/drafts");
        if (!response.ok) throw new Error("Unable to load drafts");
        const data = await response.json();
        if (isMounted) setDrafts(data);
      } catch (error) {
        if (isMounted) setDraftError(error.message);
      } finally {
        if (isMounted) setIsLoadingDrafts(false);
      }
    }

    loadDrafts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const syncDraftIdFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setRouteDraftId(params.get("draft"));
    };

    syncDraftIdFromUrl();
    window.addEventListener("popstate", syncDraftIdFromUrl);
    return () => window.removeEventListener("popstate", syncDraftIdFromUrl);
  }, []);

  useEffect(() => {
    if (!routeDraftId || isLoadingDrafts || !editorRef.current?.setContent) return;

    const draftToEdit = drafts.find((draft) => draft.id === routeDraftId);
    if (!draftToEdit) return;

    setEditingDraftId(draftToEdit.id);
    setTitle(draftToEdit.title || "");
    setIsStarred(Boolean(draftToEdit.isStarred));
    editorRef.current.setContent(draftToEdit.content || "");
    setSaveStatus("Editing draft");
  }, [drafts, isLoadingDrafts, routeDraftId]);

  const handleConfirmDelete = async () => {
    if (!deleteModalId || deletingDraftId) return;
    const draftId = deleteModalId;
    const previousDrafts = drafts;

    try {
      setDeletingDraftId(draftId);
      setSaveStatus("Deleting...");
      setDraftError("");
      setDrafts((prev) => prev.filter((draft) => draft.id !== draftId));
      const response = await fetch(`/api/drafts?id=${encodeURIComponent(draftId)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete draft");
      setDeleteModalId(null);
      setSaveStatus("Deleted");
    } catch (error) {
      setDrafts(previousDrafts);
      setDraftError(error.message);
      setSaveStatus("Delete failed");
    } finally {
      setDeletingDraftId(null);
    }
  };

  const handleToggleStar = async (id) => {
    if (updatingStarIds.has(id)) return;
    const currentDraft = drafts.find((draft) => draft.id === id);
    if (!currentDraft) return;
    const nextStarred = !currentDraft.isStarred;

    setDrafts((prev) => prev.map((draft) => (draft.id === id ? { ...draft, isStarred: nextStarred } : draft)));
    setUpdatingStarIds((prev) => new Set(prev).add(id));

    try {
      const response = await fetch("/api/drafts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isStarred: nextStarred }),
      });
      if (!response.ok) throw new Error("Unable to update draft");
      const updatedDraft = await response.json();
      setDrafts((prev) => prev.map((draft) => (draft.id === id ? updatedDraft : draft)));
    } catch (error) {
      setDraftError(error.message);
      setDrafts((prev) => prev.map((draft) => (draft.id === id ? currentDraft : draft)));
    } finally {
      setUpdatingStarIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const createBlankDraft = () => {
    setIsDiscardModalOpen(false);
    setIsCreatingModalOpen(true);
    setTimeout(() => {
      setTitle("");
      editorRef.current?.clear?.();
      setIsStarred(false);
      setEditingDraftId(null);
      setIsCreatingModalOpen(false);
    }, 700);
  };

  const handleNewDraft = () => {
    const hasContent = title.trim() || editorRef.current?.getText?.().trim();
    if (hasContent) setIsDiscardModalOpen(true);
    else createBlankDraft();
  };

  const handleSaveDraft = async () => {
    if (isSavingDraft) return;

    try {
      setIsSavingDraft(true);
      setSaveStatus("Saving...");
      setDraftError("");
      const response = await fetch("/api/drafts", {
        method: editingDraftId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingDraftId ? { id: editingDraftId } : {}),
          title,
          content: editorRef.current?.getHTML?.() ?? "",
          isStarred,
        }),
      });
      if (!response.ok) throw new Error("Unable to save draft");
      const savedDraft = await response.json();
      setDrafts((prev) => (
        editingDraftId
          ? prev.map((draft) => (draft.id === editingDraftId ? savedDraft : draft))
          : [savedDraft, ...prev]
      ));
      setTitle("");
      editorRef.current?.clear?.();
      setIsStarred(false);
      setEditingDraftId(null);
      setSaveStatus("Saved");
    } catch (error) {
      setDraftError(error.message);
      setSaveStatus("Save failed");
    } finally {
      setIsSavingDraft(false);
    }
  };

  return {
    title,
    setTitle,
    isStarred,
    setIsStarred,
    editorRef,
    drafts,
    isLoadingDrafts,
    draftError,
    saveStatus,
    isSavingDraft,
    editingDraftId,
    deletingDraftId,
    updatingStarIds,
    deleteModalId,
    setDeleteModalId,
    isDiscardModalOpen,
    setIsDiscardModalOpen,
    isCreatingModalOpen,
    handleConfirmDelete,
    handleToggleStar,
    handleNewDraft,
    createBlankDraft,
    handleSaveDraft,
  };
}
