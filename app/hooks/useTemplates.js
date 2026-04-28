"use client";
import { useState, useRef, useEffect } from "react";

export const INITIAL_TAGS = [
  "Job hunt cold emails", "Recruiting", "Application auto-response",
  "Relations", "Advertising inquiries", "Networking", "Customer Support",
  "Contracts", "Design feedback", "Tech support", "Partnership proposals",
  "Application", "Client onboarding", "Marketing campaigns", "Sales outreach",
];

export const INITIAL_PLACEHOLDERS = [
  "First name", "Last name", "Middle name", "Email address",
  "Company name", "Month Date, Year", "DD/MM/YYYY",
  "Day, Month Date, Year", "Month Date, Year, Time", "Time",
];

const INITIAL_TEMPLATES = [
  {
    id: 1,
    message: `Hi Joel\nI sent you a message a few weeks back. To follow up, I'd love to connect to discuss Topic.\nAre you free sometime in the next couple of days for a quick chat? Let me know, thanks!`,
  },
  {
    id: 2,
    message: `Hello Alex\nIt was great meeting you at the conference. I'd love to stay in touch and learn more about your work.\nAre you available for a quick call this week?`,
  },
  {
    id: 3,
    message: `Hello Alex\nIt was great meeting you at the conference. I'd love to stay in touch and learn more about your work.\nAre you available for a quick call this week?`,
  },
];

export function useTemplates() {
  // ── Data ──────────────────────────────────────────────────────────────────
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [allTags, setAllTags] = useState(INITIAL_TAGS);
  const [allPlaceholders, setAllPlaceholders] = useState(INITIAL_PLACEHOLDERS);

  // Per-template attached items
  const [attachedTags, setAttachedTags] = useState({ 1: ["Job hunt cold emails"], 2: ["Networking"], 3: ["Networking"] });
  const [attachedPlaceholders, setAttachedPlaceholders] = useState({ 1: ["First name"], 2: [], 3: [] });

  // ── UI state ──────────────────────────────────────────────────────────────
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState({});
  const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false);
  const bulkDropdownRef = useRef(null);

  const [activeShareId, setActiveShareId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [editModeId, setEditModeId] = useState(null);
  const [editedMessages, setEditedMessages] = useState({});

  // activePicker: { templateId, type: "tags" | "placeholders" } | null
  const [activePicker, setActivePicker] = useState(null);

  // ── Side effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (bulkDropdownRef.current && !bulkDropdownRef.current.contains(e.target))
        setBulkDropdownOpen(false);
    };
    if (bulkDropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bulkDropdownOpen]);

  // ── Template actions ──────────────────────────────────────────────────────
  const handleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    setSelectedTemplates(templates.reduce((acc, t) => ({ ...acc, [t.id]: next }), {}));
  };

  const handleDeleteSelected = () => {
    const ids = new Set(Object.keys(selectedTemplates).filter((id) => selectedTemplates[id]).map(Number));
    setTemplates((prev) => prev.filter((t) => !ids.has(t.id)));
    setSelectedTemplates({});
    setBulkDropdownOpen(false);
  };

  const handleDeleteAll = () => {
    setTemplates([]);
    setSelectedTemplates({});
    setBulkDropdownOpen(false);
  };

  const handleCopy = (id) => {
    const t = templates.find((t) => t.id === id);
    navigator.clipboard.writeText(t.message).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleEditStart = (id) => {
    setEditModeId(id);
    const msg = templates.find((t) => t.id === id)?.message ?? "";
    setEditedMessages((p) => ({ ...p, [id]: msg }));
  };

  const handleEditSave = (id) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, message: editedMessages[id] } : t))
    );
    setEditModeId(null);
  };

  const handleEditCancel = () => {
    setEditModeId(null);
    setEditedMessages({});
  };

  const handleConfirmDelete = () => {
    setTemplates((prev) => prev.filter((t) => t.id !== deleteModalId));
    setDeleteModalId(null);
  };

  // ── Picker actions ────────────────────────────────────────────────────────
  const handleOpenPicker = (templateId, type) => {
    setActivePicker((prev) =>
      prev?.templateId === templateId && prev?.type === type ? null : { templateId, type }
    );
  };

  const handleTagSelect = (tag) => {
    const id = activePicker?.templateId;
    if (!id) return;
    setAttachedTags((prev) => ({
      ...prev,
      [id]: prev[id]?.includes(tag) ? prev[id] : [...(prev[id] ?? []), tag],
    }));
  };

  const handleTagRemove = (templateId, tag) => {
    setAttachedTags((prev) => ({
      ...prev,
      [templateId]: (prev[templateId] ?? []).filter((t) => t !== tag),
    }));
  };

  const handlePlaceholderSelect = (p) => {
    const id = activePicker?.templateId;
    if (!id) return;
    setAttachedPlaceholders((prev) => ({
      ...prev,
      [id]: prev[id]?.includes(p) ? prev[id] : [...(prev[id] ?? []), p],
    }));
  };

  const handlePlaceholderRemove = (templateId, p) => {
    setAttachedPlaceholders((prev) => ({
      ...prev,
      [templateId]: (prev[templateId] ?? []).filter((x) => x !== p),
    }));
  };

  return {
    // Data
    templates, allTags, setAllTags, allPlaceholders, setAllPlaceholders,
    attachedTags, attachedPlaceholders,
    // Selection
    selectAll, selectedTemplates, setSelectedTemplates,
    handleSelectAll, handleDeleteSelected, handleDeleteAll,
    // Bulk dropdown
    bulkDropdownOpen, setBulkDropdownOpen, bulkDropdownRef,
    // Per-template UI
    activeShareId, setActiveShareId,
    copiedId, deleteModalId, setDeleteModalId,
    editModeId, editedMessages, setEditedMessages,
    // Actions
    handleCopy, handleEditStart, handleEditSave, handleEditCancel, handleConfirmDelete,
    // Pickers
    activePicker, setActivePicker,
    handleOpenPicker, handleTagSelect, handleTagRemove,
    handlePlaceholderSelect, handlePlaceholderRemove,
  };
}