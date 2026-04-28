"use client";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

/**
 * TemplatesHeader
 *
 * Renders the top bar (title + bulk controls) and the two action buttons
 * (Create a template / Write) side-by-side on larger screens.
 */
export default function TemplatesHeader({
  selectAll,
  onSelectAll,
  bulkDropdownOpen,
  setBulkDropdownOpen,
  bulkDropdownRef,
  onDeleteSelected,
  onDeleteAll,
  onCreateTemplate,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
      {/* Title + checkbox + bulk dropdown */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 bg-white rounded-xl w-full sm:w-[60%]">
        <p className="text-base sm:text-lg font-medium">Templates</p>

        <div className="flex items-center gap-3 relative" ref={bulkDropdownRef}>
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            checked={selectAll}
            onChange={onSelectAll}
            aria-label="Select all templates"
          />
          <EllipsisVerticalIcon
            className="w-5 h-5 cursor-pointer"
            onClick={() => setBulkDropdownOpen((o) => !o)}
          />
          {bulkDropdownOpen && (
            <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-lg shadow-lg z-20 w-36">
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={onDeleteSelected}
              >
                Delete selected
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-[#E50606]"
                onClick={onDeleteAll}
              >
                Delete all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full sm:w-[40%]">
        <button
          onClick={onCreateTemplate}
          className="flex flex-1 justify-center items-center gap-2 rounded-lg bg-custom-radial
                     h-12 sm:h-14 text-sm sm:text-base font-bold text-white
                     hover:opacity-90 transition-opacity"
        >
          Create a template
          <PlusIcon className="w-5 h-5 shrink-0" />
        </button>

        <button
          className="flex items-center justify-center gap-2 border-2 border-[#1E95BB]
                     bg-[#C9F1FE80] rounded-lg px-4 h-12 sm:h-14 text-sm sm:text-base
                     font-bold text-[#1E95BB] hover:text-white hover:bg-[#775ADA]
                     transition-all whitespace-nowrap"
        >
          Write
          <PencilSquareIcon className="w-5 h-5 shrink-0" />
        </button>
      </div>
    </div>
  );
}