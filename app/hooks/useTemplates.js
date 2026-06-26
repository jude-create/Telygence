"use client";
import { useState, useRef, useEffect } from "react";
import { useTemplatePickers } from "./useTemplatePickers";

export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [templateError, setTemplateError] = useState("");
  const [isBulkMutating, setIsBulkMutating] = useState(false);
  const [mutatingTemplateIds, setMutatingTemplateIds] = useState(new Set());
  const pickers = useTemplatePickers({
    templates, setTemplates, setTemplateError, setMutatingTemplateIds,
  });
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState({});
  const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false);
  const bulkDropdownRef = useRef(null);

  const [activeShareId, setActiveShareId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [editModeId, setEditModeId] = useState(null);
  const [editedMessages, setEditedMessages] = useState({});
  useEffect(() => {
    let isMounted = true;

    const loadTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        setTemplateError("");
        const response = await fetch("/api/templates");

        if (!response.ok) throw new Error("Unable to load templates");

        const data = await response.json();
        if (isMounted) {
          setTemplates(data);
          pickers.hydrateTemplateMeta(data);
        }
      } catch (error) {
        if (isMounted) setTemplateError(error.message);
      } finally {
        if (isMounted) setIsLoadingTemplates(false);
      }
    };

    loadTemplates();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (bulkDropdownRef.current && !bulkDropdownRef.current.contains(e.target)) {
        setBulkDropdownOpen(false);
      }
    };

    if (bulkDropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bulkDropdownOpen]);

  const handleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    setSelectedTemplates(templates.reduce((acc, template) => ({ ...acc, [template.id]: next }), {}));
  };

  const handleDeleteSelected = async () => {
    if (isBulkMutating) return;
    const ids = Object.keys(selectedTemplates).filter((id) => selectedTemplates[id]);
    if (ids.length === 0) return;

    try {
      setIsBulkMutating(true);
      await Promise.all(ids.map((id) => fetch(`/api/templates?id=${encodeURIComponent(id)}`, { method: "DELETE" })));

      const idSet = new Set(ids);
      setTemplates((prev) => prev.filter((template) => !idSet.has(template.id)));
      setSelectedTemplates({});
      setBulkDropdownOpen(false);
    } catch {
      setTemplateError("Unable to delete selected templates");
    } finally {
      setIsBulkMutating(false);
    }
  };
  const handleDeleteAll = async () => {
    if (isBulkMutating) return;
    try {
      setIsBulkMutating(true);
      const response = await fetch("/api/templates?all=true", { method: "DELETE" });

      if (!response.ok) throw new Error("Unable to delete templates");

      setTemplates([]);
      setSelectedTemplates({});
      setBulkDropdownOpen(false);
    } catch (error) {
      setTemplateError(error.message);
    } finally {
      setIsBulkMutating(false);
    }
  };

  const handleCreateTemplate = async ({ message, tags = [], placeholders = [] }) => {
    try {
      setTemplateError("");
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, tags, placeholders }),
      });

      if (!response.ok) throw new Error("Unable to create template");

      const template = await response.json();
      setTemplates((prev) => [template, ...prev]);
      pickers.addTemplateMeta(template);
      return template;
    } catch (error) {
      setTemplateError(error.message);
      throw error;
    }
  };
  const handleCopy = (id) => {
    const template = templates.find((item) => item.id === id);
    if (!template) return;

    navigator.clipboard.writeText(template.message).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleEditStart = (id) => {
    setEditModeId(id);
    const message = templates.find((template) => template.id === id)?.message ?? "";
    setEditedMessages((prev) => ({ ...prev, [id]: message }));
  };

  const handleEditSave = async (id) => {
    if (mutatingTemplateIds.has(id)) return;
    try {
      setMutatingTemplateIds((prev) => new Set(prev).add(id));
      setTemplateError("");
      const response = await fetch("/api/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          message: editedMessages[id],
          tags: pickers.attachedTags[id] || [],
          placeholders: pickers.attachedPlaceholders[id] || [],
        }),
      });

      if (!response.ok) throw new Error("Unable to update template");

      const updatedTemplate = await response.json();
      setTemplates((prev) => prev.map((template) => (template.id === id ? updatedTemplate : template)));
      pickers.addTemplateMeta(updatedTemplate);
      setEditModeId(null);
    } catch (error) {
      setTemplateError(error.message);
    } finally {
      setMutatingTemplateIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };
  const handleEditCancel = () => {
    setEditModeId(null);
    setEditedMessages({});
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalId || mutatingTemplateIds.has(deleteModalId)) return;
    const templateId = deleteModalId;

    try {
      setMutatingTemplateIds((prev) => new Set(prev).add(templateId));
      const response = await fetch(`/api/templates?id=${encodeURIComponent(templateId)}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Unable to delete template");

      setTemplates((prev) => prev.filter((template) => template.id !== templateId));
      setDeleteModalId(null);
    } catch (error) {
      setTemplateError(error.message);
    } finally {
      setMutatingTemplateIds((prev) => {
        const next = new Set(prev);
        next.delete(templateId);
        return next;
      });
    }
  };

  return {
    templates, isLoadingTemplates, templateError, isBulkMutating, mutatingTemplateIds,
    allTags: pickers.allTags, setAllTags: pickers.setAllTags, allPlaceholders: pickers.allPlaceholders, setAllPlaceholders: pickers.setAllPlaceholders,
    attachedTags: pickers.attachedTags, attachedPlaceholders: pickers.attachedPlaceholders, selectAll, selectedTemplates, setSelectedTemplates,
    handleSelectAll, handleDeleteSelected, handleDeleteAll, bulkDropdownOpen, setBulkDropdownOpen, bulkDropdownRef,
    activeShareId, setActiveShareId, copiedId, deleteModalId, setDeleteModalId, editModeId, editedMessages, setEditedMessages,
    handleCopy, handleEditStart, handleEditSave, handleEditCancel, handleConfirmDelete, handleCreateTemplate,
    activePicker: pickers.activePicker, setActivePicker: pickers.setActivePicker, handleOpenPicker: pickers.handleOpenPicker,
    handleTagSelect: pickers.handleTagSelect, handleTagRemove: pickers.handleTagRemove,
    handlePlaceholderSelect: pickers.handlePlaceholderSelect, handlePlaceholderRemove: pickers.handlePlaceholderRemove,
  };
}
