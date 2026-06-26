"use client";

import { useState } from "react";

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

export function useTemplatePickers({ templates, setTemplates, setTemplateError, setMutatingTemplateIds }) {
  const [allTags, setAllTags] = useState(INITIAL_TAGS);
  const [allPlaceholders, setAllPlaceholders] = useState(INITIAL_PLACEHOLDERS);
  const [attachedTags, setAttachedTags] = useState({});
  const [attachedPlaceholders, setAttachedPlaceholders] = useState({});
  const [activePicker, setActivePicker] = useState(null);

  const hydrateTemplateMeta = (data) => {
    setAttachedTags(Object.fromEntries(data.map((template) => [template.id, template.tags || []])));
    setAttachedPlaceholders(Object.fromEntries(data.map((template) => [template.id, template.placeholders || []])));
  };

  const addTemplateMeta = (template) => {
    setAttachedTags((prev) => ({ ...prev, [template.id]: template.tags || [] }));
    setAttachedPlaceholders((prev) => ({ ...prev, [template.id]: template.placeholders || [] }));
  };

  const handleOpenPicker = (templateId, type) => {
    setActivePicker((prev) =>
      prev?.templateId === templateId && prev?.type === type ? null : { templateId, type }
    );
  };

  const persistTemplateMeta = async (id, nextTags, nextPlaceholders) => {
    const template = templates.find((item) => item.id === id);
    if (!template) return;

    try {
      setMutatingTemplateIds((prev) => new Set(prev).add(id));
      setTemplateError("");
      const response = await fetch("/api/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          message: template.message,
          tags: nextTags,
          placeholders: nextPlaceholders,
        }),
      });
      const updatedTemplate = await response.json();
      if (!response.ok) throw new Error(updatedTemplate.error || "Unable to update template");
      setTemplates((prev) => prev.map((item) => (item.id === id ? updatedTemplate : item)));
      setAttachedTags((prev) => ({ ...prev, [id]: updatedTemplate.tags || [] }));
      setAttachedPlaceholders((prev) => ({ ...prev, [id]: updatedTemplate.placeholders || [] }));
    } catch (error) {
      setTemplateError(error.message);
      setAttachedTags((prev) => ({ ...prev, [id]: template.tags || [] }));
      setAttachedPlaceholders((prev) => ({ ...prev, [id]: template.placeholders || [] }));
    } finally {
      setMutatingTemplateIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleTagSelect = (tag) => {
    const id = activePicker?.templateId;
    if (!id) return;
    const nextTags = attachedTags[id]?.includes(tag) ? attachedTags[id] : [...(attachedTags[id] ?? []), tag];
    setAttachedTags((prev) => ({ ...prev, [id]: nextTags }));
    persistTemplateMeta(id, nextTags, attachedPlaceholders[id] || []);
  };

  const handleTagRemove = (templateId, tag) => {
    const nextTags = (attachedTags[templateId] ?? []).filter((item) => item !== tag);
    setAttachedTags((prev) => ({ ...prev, [templateId]: nextTags }));
    persistTemplateMeta(templateId, nextTags, attachedPlaceholders[templateId] || []);
  };

  const handlePlaceholderSelect = (placeholder) => {
    const id = activePicker?.templateId;
    if (!id) return;
    const nextPlaceholders = attachedPlaceholders[id]?.includes(placeholder)
      ? attachedPlaceholders[id]
      : [...(attachedPlaceholders[id] ?? []), placeholder];
    setAttachedPlaceholders((prev) => ({ ...prev, [id]: nextPlaceholders }));
    persistTemplateMeta(id, attachedTags[id] || [], nextPlaceholders);
  };

  const handlePlaceholderRemove = (templateId, placeholder) => {
    const nextPlaceholders = (attachedPlaceholders[templateId] ?? []).filter((item) => item !== placeholder);
    setAttachedPlaceholders((prev) => ({ ...prev, [templateId]: nextPlaceholders }));
    persistTemplateMeta(templateId, attachedTags[templateId] || [], nextPlaceholders);
  };

  return {
    allTags, setAllTags, allPlaceholders, setAllPlaceholders,
    attachedTags, attachedPlaceholders,
    activePicker, setActivePicker,
    hydrateTemplateMeta, addTemplateMeta,
    handleOpenPicker, handleTagSelect, handleTagRemove,
    handlePlaceholderSelect, handlePlaceholderRemove,
  };
}
