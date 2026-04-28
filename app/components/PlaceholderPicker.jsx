"use client";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  EllipsisVerticalIcon, PencilIcon, TrashIcon,
  XMarkIcon, PlusIcon,
} from "@heroicons/react/24/solid";
import { useState, useRef, useEffect } from "react";

/**
 * PlaceholderPicker — dual-mode component.
 *
 * mode="sidebar"  Full panel: view, add, edit, delete placeholders.
 * mode="picker"   Floating dropdown: tap to attach/detach from a template.
 */
export default function PlaceholderPicker({
  mode = "sidebar",
  placeholders = [],
  onPlaceholdersChange,
  // picker-only
  selected = [],
  onSelect,
  onRemove,
  onClose,
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [addingNew, setAddingNew] = useState(false);

  const dropdownRefs = useRef({});
  const pickerRef = useRef(null);
  const newInputRef = useRef(null);

  useEffect(() => {
    if (mode !== "picker") return;
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mode, onClose]);

  useEffect(() => {
    if (mode !== "sidebar") return;
    const handler = (e) => {
      const outside = Object.values(dropdownRefs.current).every((ref) => !ref?.contains(e.target));
      if (outside) setDropdownOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mode]);

  // ── Sidebar handlers ──────────────────────────────────────────────────────
  const commitEdit = (index) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    onPlaceholdersChange(placeholders.map((p, i) => (i === index ? trimmed : p)));
    setEditIndex(null);
    setEditValue("");
  };

  const commitNew = () => {
    const trimmed = newValue.trim();
    if (trimmed && !placeholders.includes(trimmed)) onPlaceholdersChange([...placeholders, trimmed]);
    setNewValue("");
    setAddingNew(false);
  };

  const handleDelete = (index) => {
    onPlaceholdersChange(placeholders.filter((_, i) => i !== index));
    setDropdownOpen(null);
  };

  const keyDown = (e, cb) => {
    if (e.key === "Enter") cb();
    if (e.key === "Escape") { setEditIndex(null); setEditValue(""); setAddingNew(false); setNewValue(""); }
  };

  // ── Picker mode ───────────────────────────────────────────────────────────
  if (mode === "picker") {
    return (
      <div
        ref={pickerRef}
        className="absolute left-0 top-8 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden"
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
          <p className="text-xs font-medium text-[#4D4D4D]">Add placeholders</p>
          <button onClick={onClose} className="p-0.5 rounded hover:bg-gray-100">
            <XMarkIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="max-h-52 overflow-y-auto p-3 grid grid-cols-2 gap-2">
          {placeholders.map((p, i) => {
            const active = selected.includes(p);
            return (
              <button
                key={i}
                onClick={() => active ? onRemove(p) : onSelect(p)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium transition-colors text-left
                  ${active ? "bg-[#775ADA] text-white" : "bg-[#EDEDED] text-[#4D4D4D] hover:bg-[#D9D9D9]"}`}
              >
                <PencilSquareIcon className="h-3 w-3 shrink-0" />
                <span className="truncate">{p}</span>
                {active && <XMarkIcon className="h-3 w-3 opacity-70 shrink-0 ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Sidebar mode ──────────────────────────────────────────────────────────
  return (
    <div className="bg-white w-full rounded-xl mt-4 hidden md:block">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-light text-sm text-[#4D4D4D]">Placeholders</p>
        <button
          onClick={() => { setAddingNew(true); setTimeout(() => newInputRef.current?.focus(), 50); }}
          className="p-1 rounded-full text-[#4D4D4D] bg-[#EDEDED] hover:bg-[#D9D9D9] transition-colors"
          aria-label="Add placeholder"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="border-t-4 border-[#EDEDED]" />

      {placeholders.length === 0 && !addingNew ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm text-[#AAAAAA]">No available placeholders</p>
        </div>
      ) : (
        <>
          <p className="px-4 pt-3 pb-1 text-xs text-[#999999] italic">Available Placeholders</p>
          <div className="flex flex-wrap gap-2 px-4 pb-6">
            {placeholders.map((placeholder, index) => (
              <div key={index} className="flex items-center gap-1.5 bg-[#EDEDED] py-1.5 px-2.5 rounded-full w-fit">
                {editIndex === index ? (
                  <input
                    className="text-[#4D4D4D] text-xs font-semibold bg-transparent border-b border-[#4D4D4D] outline-none w-24"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(index)}
                    onKeyDown={(e) => keyDown(e, () => commitEdit(index))}
                    autoFocus
                  />
                ) : (
                  <>
                    <PencilSquareIcon className="h-3.5 w-3.5 text-[#4D4D4D] shrink-0" />
                    <p className="text-[#4D4D4D] text-xs font-semibold truncate max-w-[120px]">{placeholder}</p>
                  </>
                )}

                <div className="relative shrink-0" ref={(el) => (dropdownRefs.current[index] = el)}>
                  <EllipsisVerticalIcon
                    className="w-4 h-4 text-[#4D4D4D] cursor-pointer hover:text-black"
                    onClick={() => setDropdownOpen((p) => (p === index ? null : index))}
                  />
                  {dropdownOpen === index && (
                    <div className="absolute right-0 mt-1.5 bg-white border border-gray-100 rounded-lg shadow-md z-20 w-32">
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => { setEditIndex(index); setEditValue(placeholder); setDropdownOpen(null); }}
                      >
                        <PencilIcon className="w-3.5 h-3.5 text-gray-600" /> Edit
                      </button>
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-[#E50606]"
                        onClick={() => handleDelete(index)}
                      >
                        <TrashIcon className="w-3.5 h-3.5 text-red-500" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {addingNew && (
              <div className="flex items-center gap-1.5 bg-[#EDEDED] py-1.5 px-2.5 rounded-full">
                <PencilSquareIcon className="h-3.5 w-3.5 text-[#4D4D4D] shrink-0" />
                <input
                  ref={newInputRef}
                  className="text-[#4D4D4D] text-xs font-semibold bg-transparent border-b border-[#4D4D4D] outline-none w-24"
                  placeholder="New placeholder…"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onBlur={commitNew}
                  onKeyDown={(e) => keyDown(e, commitNew)}
                />
                <button onClick={() => { setNewValue(""); setAddingNew(false); }}>
                  <XMarkIcon className="w-3.5 h-3.5 text-[#4D4D4D] opacity-60 hover:opacity-100" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}