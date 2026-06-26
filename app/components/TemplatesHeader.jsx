"use client";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

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
  isBulkMutating = false,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.75fr)] gap-3">
      {/* Title + checkbox + bulk dropdown */}
      <div className="flex justify-between items-center gap-3 px-4 sm:px-6 py-3 bg-white rounded-xl border border-[#E7E4F0] shadow-sm w-full min-w-0">
        <p className="text-base sm:text-lg font-medium">Templates</p>

        <div className="flex items-center gap-3 relative" ref={bulkDropdownRef}>
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            checked={selectAll}
            onChange={onSelectAll}
            disabled={isBulkMutating}
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
                disabled={isBulkMutating}
              >
                {isBulkMutating ? "Deleting..." : "Delete selected"}
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-[#E50606]"
                onClick={onDeleteAll}
                disabled={isBulkMutating}
              >
                {isBulkMutating ? "Deleting..." : "Delete all"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(88px,0.55fr)] sm:grid-cols-[minmax(0,1fr)_110px] gap-2 sm:gap-3 w-full">
        <button
          onClick={onCreateTemplate}
          className="flex min-w-0 flex-1 justify-center items-center gap-1.5 sm:gap-2 rounded-lg bg-custom-radial px-2 sm:px-3
                     min-h-12 sm:min-h-14 text-xs sm:text-base font-bold text-white
                     hover:opacity-90 transition-opacity"
        >
          <span className="truncate">Create a template</span>
          <PlusIcon className="w-5 h-5 shrink-0" />
        </button>

        <Link href="/drafts" className="min-w-0">
          <button
            className="flex w-full items-center justify-center gap-1.5 sm:gap-2 border-2 border-[#1E95BB]
                       bg-[#C9F1FE80] rounded-lg px-2 sm:px-4 min-h-12 sm:min-h-14 text-xs sm:text-base
                       font-bold text-[#1E95BB] hover:text-white hover:bg-[#775ADA]
                       transition-all whitespace-nowrap"
          >
            Write
            <PencilSquareIcon className="w-5 h-5 shrink-0" />
          </button>
        </Link>
      </div>
    </div>
  );
}
