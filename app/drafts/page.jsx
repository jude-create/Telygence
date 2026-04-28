"use client";
import {
  ArchiveBoxIcon, TrashIcon,
  StarIcon as StarOutlineIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon, StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import DraftToolbar from "../components/DraftToolbar";
import DraftsList from "../components/DraftsList";

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_DRAFTS = [
  { id: 1, title: "Professional Summary",   description: "Thank you for signing up on Telygence. Begin your journey now!", time: "11:45 AM",  isStarred: false },
  { id: 2, title: "Company Overview",       description: "Draft an outline for your organization's key services and values.",  time: "10:30 AM",  isStarred: true  },
  { id: 3, title: "Investor Proposal",      description: "Prepare a detailed proposal letter for potential investors.",         time: "9:15 AM",   isStarred: false },
  { id: 4, title: "Marketing Strategy",     description: "Plan a comprehensive strategy for launching new products.",          time: "Yesterday", isStarred: false },
  { id: 5, title: "Project Timeline",       description: "Create a timeline for completing key deliverables in Q4.",           time: "2 days ago",isStarred: true  },
];

// ─── Discard / Creating modals ────────────────────────────────────────────────

function DiscardModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-200 rounded-lg w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-4 pb-2 text-center">
          <h2 className="text-base font-semibold">New draft</h2>
        </div>
        <div className="border-t border-[#737373]" />
        <div className="px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Are you sure you want to discard the current draft and create a new one?
          </p>
        </div>
        <div className="flex justify-center gap-4 px-6 pb-5">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-[#D9D9D9] rounded-md text-sm hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-7 py-2 bg-[#775ADA] text-white rounded-md text-sm hover:bg-[#5F48C2] transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

function CreatingModal() {
  return (
    <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-72 text-center">
        <h2 className="text-base font-semibold">Creating new draft…</h2>
        <div className="mt-3 flex justify-center">
          <div className="w-5 h-5 border-2 border-[#775ADA] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Drafts() {
  // Editor state
  const [title, setTitle] = useState("");
  const [isStarred, setIsStarred] = useState(false);
  const editorRef = useRef(null);

  // Toolbar dropdowns
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [font, setFont] = useState("Sora");
  const [size, setSize] = useState(15);
  const fontDropdownRef = useRef(null);
  const sizeDropdownRef = useRef(null);

  // Drafts list
  const [drafts, setDrafts] = useState(INITIAL_DRAFTS);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);

  // Draft creation flow
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(e.target))
        setShowFontDropdown(false);
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(e.target))
        setShowSizeDropdown(false);
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target))
        setShowStatusDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleConfirmDelete = () => {
    setDrafts((prev) => prev.filter((d) => d.id !== deleteModalId));
    setDeleteModalId(null);
  };

  const handleToggleStar = (id) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isStarred: !d.isStarred } : d))
    );
  };

  const handleNewDraft = () => {
    // Only prompt discard if there's content
    const hasContent = title.trim() || (editorRef.current?.innerText?.trim());
    if (hasContent) {
      setIsDiscardModalOpen(true);
    } else {
      createBlankDraft();
    }
  };

  const createBlankDraft = () => {
    setIsDiscardModalOpen(false);
    setIsCreatingModalOpen(true);
    setTimeout(() => {
      setTitle("");
      if (editorRef.current) editorRef.current.innerHTML = "";
      setIsStarred(false);
      setIsCreatingModalOpen(false);
    }, 1200);
  };

  const handleSaveDraft = () => {
    const content = editorRef.current?.innerHTML ?? "";
    const newDraft = {
      id: Date.now(),
      title: title.trim() || "Untitled draft",
      description: editorRef.current?.innerText?.slice(0, 80) ?? "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStarred,
    };
    setDrafts((prev) => [newDraft, ...prev]);
    console.log("Saved draft content:", content);
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-7">

        {/* ── Top bar ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:w-[80%] flex justify-between items-center px-4 sm:px-8 py-3 bg-white rounded-xl">
            <p className="text-base sm:text-xl font-medium">Drafts</p>
            <p className="text-[#8093A8] text-sm">Saving…</p>
          </div>
          <div className="w-full sm:w-[20%]">
            <button
              onClick={handleNewDraft}
              className="flex justify-center items-center gap-2 rounded-lg bg-custom-radial w-full h-12 sm:h-14
                text-sm sm:text-base font-bold tracking-wider text-white
                transition-all ease-in-out duration-500 hover:opacity-90"
            >
              Draft
              <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            </button>
          </div>
        </div>

        {/* ── Editor panel ───────────────────────────────────────────────── */}
        <div className="bg-white w-full mt-4 rounded-xl p-4 sm:p-5">

          {/* Title input */}
          <input
            className="border border-[#BABABA] h-10 rounded-lg px-4 text-sm w-full sm:w-auto
                       placeholder:text-sm placeholder:font-light tracking-wide
                       focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
            placeholder="Enter title here..."
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Toolbar — wraps on small screens */}
          <div className="mt-3 overflow-x-auto">
            <DraftToolbar
              editorRef={editorRef}
              font={font}
              size={size}
              onFontClick={() => setShowFontDropdown((o) => !o)}
              onSizeClick={() => setShowSizeDropdown((o) => !o)}
              showFontDropdown={showFontDropdown}
              showSizeDropdown={showSizeDropdown}
              fontDropdownRef={fontDropdownRef}
              sizeDropdownRef={sizeDropdownRef}
            />
          </div>

          {/* ContentEditable editor — supports real rich-text formatting */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="w-full mt-4 min-h-[300px] sm:min-h-[420px] border border-[#EDEDED] rounded-lg p-4
                       text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#775ADA]
                       empty:before:content-['Start_writing...'] empty:before:text-[#BABABA]"
            style={{ fontFamily: font }}
          />

          {/* Editor footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 px-1">
            {/* AI button */}
            <button className="border-2 border-blue-700 py-2 px-5 rounded-full
                               transition-transform hover:scale-105 hover:shadow-md shrink-0">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#775ADA] to-[#1E95BB] text-sm font-medium">
                Auto-complete with AI
              </span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              {isStarred ? (
                <StarSolidIcon
                  onClick={() => setIsStarred(false)}
                  className="h-5 w-5 text-[#FF304F] cursor-pointer"
                />
              ) : (
                <StarOutlineIcon
                  onClick={() => setIsStarred(true)}
                  className="h-5 w-5 text-[#737373] cursor-pointer hover:text-[#FF304F]"
                />
              )}
              <ArchiveBoxIcon className="h-5 w-5 text-[#737373] cursor-pointer hover:text-black" />
              <TrashIcon
                onClick={() => {
                  setTitle("");
                  if (editorRef.current) editorRef.current.innerHTML = "";
                }}
                className="h-5 w-5 text-[#737373] cursor-pointer hover:text-[#E50606]"
              />
              <button
                onClick={handleSaveDraft}
                className="py-1.5 px-4 bg-[#775ADA] text-white text-sm rounded-lg
                           hover:bg-[#5F48C2] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* ── Recent drafts list ─────────────────────────────────────────── */}
        <DraftsList
          drafts={drafts}
          deleteModalId={deleteModalId}
          onDeleteClick={(id) => setDeleteModalId(id)}
          onConfirmDelete={handleConfirmDelete}
          onCloseDeleteModal={() => setDeleteModalId(null)}
          onToggleStar={handleToggleStar}
          showStatusDropdown={showStatusDropdown}
          onToggleStatusDropdown={() => setShowStatusDropdown((o) => !o)}
          onStatusSelect={(s) => { console.log("Filter by:", s); setShowStatusDropdown(false); }}
          statusDropdownRef={statusDropdownRef}
        />

      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {isDiscardModalOpen && (
        <DiscardModal
          onCancel={() => setIsDiscardModalOpen(false)}
          onConfirm={createBlankDraft}
        />
      )}
      {isCreatingModalOpen && <CreatingModal />}
    </>
  );
}