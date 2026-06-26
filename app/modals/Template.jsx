"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import TagsModal from "./TagsModal";
import PlaceholderModal from "./PlaceholderModal";
import WritingStylesModal from "./WritingStylesModal";
import {
  SuccessToast,
  TemplateFooter,
  TemplateMessageEditor,
  TemplateTagField,
} from "../components/templates/TemplateComposerParts";

export default function Template({ templateModal, handleTemplateModal, onTemplateCreate }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPlaceholders, setSelectedPlaceholders] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [placeholderModal, setPlaceholderModal] = useState(false);
  const [stylesModal, setStylesModal] = useState(false);
  const tagInputRef = useRef(null);
  const editorRef = useRef(null);

  if (!templateModal) return null;

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) setSelectedTags((prev) => [...prev, trimmed]);
  };

  const addPlaceholder = (placeholder) => {
    if (!selectedPlaceholders.includes(placeholder)) {
      setSelectedPlaceholders((prev) => [...prev, placeholder]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorRef.current?.innerText ?? "").then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const handleCreate = async () => {
    if (isCreating) return;
    const message = editorRef.current?.innerText?.trim() || "";
    if (!message) return;

    try {
      setIsCreating(true);
      setCreateError("");
      const payload = { message, tags: selectedTags, placeholders: selectedPlaceholders };
      if (onTemplateCreate) await onTemplateCreate(payload);
      else {
        const response = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Unable to create template");
      }
      if (editorRef.current) editorRef.current.innerHTML = "";
      setSelectedTags([]);
      setSelectedPlaceholders([]);
      handleTemplateModal();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={(event) => { if (event.target === event.currentTarget) handleTemplateModal(); }}>
        <div className="bg-white w-full sm:max-w-2xl max-h-[95dvh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center px-5 sm:px-7 py-4 shrink-0">
            <p className="font-bold text-base sm:text-lg text-black tracking-wide">Create a new template</p>
            <button onClick={handleTemplateModal} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="border-t-4 border-[#EDEDED] shrink-0" />

          <div className="overflow-y-auto flex-1 px-4 sm:px-7 py-5 space-y-5">
            <TemplateTagField
              selectedTags={selectedTags}
              tagInputRef={tagInputRef}
              tagModal={tagModal}
              onAddTag={addTag}
              onRemoveTag={(tag) => setSelectedTags((prev) => prev.filter((item) => item !== tag))}
              onToggleModal={() => setTagModal((open) => !open)}
            />
            <TemplateMessageEditor
              selectedPlaceholders={selectedPlaceholders}
              placeholderModal={placeholderModal}
              editorRef={editorRef}
              showCopied={showCopied}
              onRemovePlaceholder={(placeholder) => setSelectedPlaceholders((prev) => prev.filter((item) => item !== placeholder))}
              onTogglePlaceholderModal={() => setPlaceholderModal((open) => !open)}
              onCopy={handleCopy}
            />
          </div>

          <TemplateFooter
            selectedStyle={selectedStyle}
            isCreating={isCreating}
            createError={createError}
            onStylesClick={() => setStylesModal(true)}
            onCancel={handleTemplateModal}
            onCreate={handleCreate}
          />
        </div>
      </div>

      {tagModal && <TagsModal tagModal={tagModal} handleTagModal={() => setTagModal(false)} onTagSelect={(tag) => { addTag(tag); setTagModal(false); }} />}
      {placeholderModal && <PlaceholderModal placeholderModal={placeholderModal} handlePlaceholderModal={() => setPlaceholderModal(false)} onPlaceholderSelect={(placeholder) => { addPlaceholder(placeholder); setPlaceholderModal(false); }} />}
      <WritingStylesModal stylesModal={stylesModal} handleStylesModal={() => setStylesModal(false)} onStyleSelect={(style) => { setSelectedStyle(style); setStylesModal(false); }} />
      {showSuccess && <SuccessToast message="Template created!" />}
    </>
  );
}
