"use client";
import {
  FaceSmileIcon, LinkIcon, Square2StackIcon, TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUturnLeftIcon, ArrowUturnRightIcon, BoldIcon,
  ItalicIcon, ListBulletIcon, NumberedListIcon,
  PlusIcon, UnderlineIcon, XMarkIcon, BookmarkIcon,
} from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";
import TagsModal from "./TagsModal";
import PlaceholderModal from "./PlaceholderModal";
import WritingStylesModal from "./WritingStylesModal";

// ─── Small reusable pieces ────────────────────────────────────────────────────

function IconBtn({ icon: Icon, title, onClick, className = "" }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1 rounded hover:bg-gray-100 text-[#737373] hover:text-black transition-colors ${className}`}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
}

function ToolbarDivider() {
  return <span className="border-l h-5 border-[#D0D0D0]" />;
}

// ─── Success toast ────────────────────────────────────────────────────────────

function SuccessToast({ message }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#03A12F] text-white
                    text-sm font-medium px-6 py-3 rounded-xl shadow-lg z-[1100]
                    animate-in fade-in slide-in-from-bottom-4 duration-300">
      ✓ {message}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Template({ templateModal, handleTemplateModal }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPlaceholders, setSelectedPlaceholders] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [placeholderModal, setPlaceholderModal] = useState(false);
  const [stylesModal, setStylesModal] = useState(false);
  const tagInputRef = useRef(null);
  const editorRef = useRef(null);

  if (!templateModal) return null;

  // ── Tag helpers ─────────────────────────────────────────────────────────────
  const addTag = (tag) => {
    const t = tag.trim();
    if (t && !selectedTags.includes(t)) setSelectedTags((p) => [...p, t]);
  };
  const removeTag = (t) => setSelectedTags((p) => p.filter((x) => x !== t));

  // ── Placeholder helpers ─────────────────────────────────────────────────────
  const addPlaceholder = (p) => {
    if (!selectedPlaceholders.includes(p)) setSelectedPlaceholders((prev) => [...prev, p]);
  };
  const removePlaceholder = (p) => setSelectedPlaceholders((prev) => prev.filter((x) => x !== p));

  // ── Formatting ──────────────────────────────────────────────────────────────
  const exec = (cmd) => { editorRef.current?.focus(); document.execCommand(cmd, false, null); };
  const insertLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) { editorRef.current?.focus(); document.execCommand("createLink", false, url); }
  };

  // ── Clipboard ───────────────────────────────────────────────────────────────
  const handleCopy = () => {
    const text = editorRef.current?.innerText ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = () => {
    handleTemplateModal();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      {/* ── Backdrop ────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) handleTemplateModal(); }}
      >
        {/* ── Modal shell ─────────────────────────────────────────────────── */}
        <div className="bg-white w-full max-w-2xl max-h-[95dvh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">

          {/* Header */}
          <div className="flex justify-between items-center px-5 sm:px-7 py-4 shrink-0">
            <p className="font-bold text-base sm:text-lg text-black tracking-wide">
              Create a new template
            </p>
            <button
              onClick={handleTemplateModal}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="border-t-4 border-[#EDEDED] shrink-0" />

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-4 sm:px-7 py-5 space-y-5">

            {/* ── Tag field ─────────────────────────────────────────────── */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-black">
                Add tags
              </label>
              <div className="flex gap-2">
                <div
                  className="flex flex-wrap gap-1.5 items-center flex-1 min-h-[44px] border border-[#BABABA]
                             bg-white rounded-lg px-3 py-2 cursor-text"
                  onClick={() => tagInputRef.current?.focus()}
                >
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-[#5943A3] bg-[#DDD6F6]
                                 px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      <BookmarkIcon className="w-3 h-3" />
                      {tag}
                      <XMarkIcon
                        className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                      />
                    </span>
                  ))}
                  <input
                    ref={tagInputRef}
                    type="text"
                    placeholder={selectedTags.length === 0 ? "Type & press Enter, or pick below" : ""}
                    className="outline-none text-sm text-gray-600 placeholder:text-xs flex-1 min-w-[120px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => setTagModal((o) => !o)}
                  className="p-2 bg-[#DDD6F6] rounded-full text-[#5943A3] hover:bg-[#C8BBEE] transition-colors self-start shrink-0"
                >
                  {tagModal ? <XMarkIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* ── Message editor ────────────────────────────────────────── */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-black">Message content</label>
              <div className="flex gap-2">
                <div className="flex-1 border border-[#BABABA] bg-white rounded-xl overflow-hidden">
                  {/* Attached placeholders */}
                  {selectedPlaceholders.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 px-3 pt-2">
                      {selectedPlaceholders.map((p) => (
                        <span
                          key={p}
                          className="flex items-center gap-1 text-[#4D4D4D] bg-[#D9D9D9]
                                     px-2.5 py-1 rounded-full text-xs font-medium"
                        >
                          {p}
                          <XMarkIcon
                            className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100"
                            onClick={() => removePlaceholder(p)}
                          />
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ContentEditable editor */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="min-h-[140px] sm:min-h-[160px] px-3 py-2 text-sm leading-relaxed
                               focus:outline-none
                               empty:before:content-['Write_content_here…']
                               empty:before:text-[#BABABA] empty:before:text-xs"
                  />

                  {/* Formatting toolbar */}
                  <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-t border-[#EDEDED]
                                  justify-between">
                    <div className="flex items-center gap-0.5 flex-wrap">
                      <IconBtn icon={BoldIcon}          title="Bold"          onClick={() => exec("bold")} />
                      <IconBtn icon={ItalicIcon}        title="Italic"        onClick={() => exec("italic")} />
                      <IconBtn icon={UnderlineIcon}     title="Underline"     onClick={() => exec("underline")} />
                      <ToolbarDivider />
                      <IconBtn icon={ListBulletIcon}    title="Bullet list"   onClick={() => exec("insertUnorderedList")} />
                      <IconBtn icon={NumberedListIcon}  title="Numbered list" onClick={() => exec("insertOrderedList")} />
                      <ToolbarDivider />
                      <IconBtn icon={LinkIcon}          title="Insert link"   onClick={insertLink} />
                      <IconBtn icon={FaceSmileIcon}     title="Emoji"         onClick={() => {
                        const e = window.prompt("Enter emoji:"); if (e) exec("insertText", e);
                      }} />
                    </div>
                    <div className="flex items-center gap-0.5 relative">
                      <IconBtn icon={ArrowUturnLeftIcon}  title="Undo" onClick={() => exec("undo")} />
                      <IconBtn icon={ArrowUturnRightIcon} title="Redo" onClick={() => exec("redo")} />
                      <IconBtn icon={Square2StackIcon}    title="Copy"  onClick={handleCopy} />
                      <IconBtn icon={TrashIcon}           title="Clear" onClick={() => {
                        if (editorRef.current) editorRef.current.innerHTML = "";
                      }} />
                      {showCopied && (
                        <div className="absolute -top-9 right-0 bg-[#1E95BB] text-white
                                        text-xs px-3 py-1.5 rounded-md shadow whitespace-nowrap z-10">
                          Copied!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Placeholder picker toggle */}
                <button
                  onClick={() => setPlaceholderModal((o) => !o)}
                  className="p-2 bg-[#DDD6F6] rounded-full text-[#5943A3] hover:bg-[#C8BBEE] transition-colors self-start shrink-0 mt-1"
                >
                  {placeholderModal ? <XMarkIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* ── Footer ──────────────────────────────────────────────────────── */}
          <div className="shrink-0 border-t border-[#EDEDED] px-4 sm:px-7 py-4
                          flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Writing style */}
            <button
              onClick={() => setStylesModal(true)}
              className="border-2 border-[#775ADA] py-2 px-4 rounded-full text-sm
                         hover:scale-105 hover:shadow-md transition-transform shrink-0"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#775ADA] to-[#1E95BB] font-medium">
                {selectedStyle ? `Style: ${selectedStyle}` : "Change writing style with AI"}
              </span>
            </button>

            {/* Cancel + Create */}
            <div className="flex gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={handleTemplateModal}
                className="py-2 px-5 bg-[#DDD6F6] text-[#1E1636] rounded-lg text-sm
                           hover:bg-[#BEB6E5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="py-2 px-6 bg-[#775ADA] text-white rounded-lg text-sm
                           hover:bg-[#5F48C2] transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub-modals ─────────────────────────────────────────────────────── */}
      {tagModal && (
        <TagsModal
          tagModal={tagModal}
          handleTagModal={() => setTagModal(false)}
          onTagSelect={(t) => { addTag(t); setTagModal(false); }}
        />
      )}
      {placeholderModal && (
        <PlaceholderModal
          placeholderModal={placeholderModal}
          handlePlaceholderModal={() => setPlaceholderModal(false)}
          onPlaceholderSelect={(p) => { addPlaceholder(p); setPlaceholderModal(false); }}
        />
      )}
      <WritingStylesModal
        stylesModal={stylesModal}
        handleStylesModal={() => setStylesModal(false)}
        onStyleSelect={(s) => { setSelectedStyle(s); setStylesModal(false); }}
      />

      {/* ── Success toast ───────────────────────────────────────────────────── */}
      {showSuccess && <SuccessToast message="Template created!" />}
    </>
  );
}