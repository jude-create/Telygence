"use client";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/solid";

/**
 * ChipList — renders a row of pill/chip items with optional remove buttons.
 * The trailing "+" button opens the associated picker dropdown.
 *
 * Props:
 *  items        string[]   — chips to render
 *  colorClass   string     — Tailwind text+bg classes for the chips
 *  icon         ReactNode  — optional icon before each chip label
 *  canEdit      boolean    — show remove (×) buttons and enable picker toggle
 *  isPickerOpen boolean    — whether the picker dropdown is currently open
 *  onPickerToggle () => void
 *  onRemove     (item: string) => void
 *  hint         string     — small hint text shown below the row
 */
export default function ChipList({
  items = [],
  colorClass = "text-[#4D4D4D] bg-[#D9D9D9]",
  icon = null,
  canEdit = false,
  isPickerOpen = false,
  onPickerToggle,
  onRemove,
  hint,
}) {
  return (
    <div className="flex flex-col gap-1 z-0">
      <div className="flex flex-wrap gap-1.5 items-center">
        {items.map((item) => (
          <span
            key={item}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium  ${colorClass}`}
          >
            {icon}
            {item}
            {canEdit && (
              <XMarkIcon
                className="h-3.5 w-3.5 cursor-pointer opacity-60 hover:opacity-100 shrink-0"
                onClick={() => onRemove?.(item)}
              />
            )}
          </span>
        ))}

        {/* Picker toggle button */}
        <button
          onClick={canEdit ? onPickerToggle : undefined}
          className={`p-1 rounded-full transition-colors ${colorClass}
            ${canEdit ? "cursor-pointer hover:opacity-80" : "opacity-30 cursor-default"}`}
          aria-label={isPickerOpen ? "Close picker" : "Open picker"}
        >
          {isPickerOpen
            ? <XMarkIcon className="w-4 h-4" />
            : <PlusIcon className="w-4 h-4" />}
        </button>
      </div>

      {hint && (
        <p className="text-[10px] text-[#999999] italic">{hint}</p>
      )}
    </div>
  );
}