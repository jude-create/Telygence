"use client";
import {
  ArchiveBoxIcon, TrashIcon,
  StarIcon as StarOutlineIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

/**
 * DraftsList
 *
 * Renders the "Recent" panel listing all drafts with star, archive, delete.
 */
export default function DraftsList({
  drafts,
  deleteModalId,
  onDeleteClick,
  onConfirmDelete,
  onCloseDeleteModal,
  onToggleStar,
  busyDraftIds = new Set(),
  deletingDraftId = null,
  showStatusDropdown,
  onToggleStatusDropdown,
  onStatusSelect,
  statusDropdownRef,
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E7E4F0] shadow-sm mt-4 sm:mt-5 pb-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between px-4 sm:px-6 pt-5 relative">
        <div className="flex items-center gap-2">
          <p className="font-light text-base text-[#001C3D]">Recent</p>
          <button onClick={onToggleStatusDropdown} className="p-0.5">
            {showStatusDropdown
              ? <ChevronUpIcon className="h-4 w-4 text-[#262626]" />
              : <ChevronDownIcon className="h-4 w-4 text-[#262626]" />}
          </button>
        </div>

        {showStatusDropdown && (
          <div
            ref={statusDropdownRef}
            className="absolute left-4 sm:left-8 top-12 bg-white border border-gray-200 rounded-lg shadow-md z-50 w-36"
          >
            {["Starred", "Archived"].map((item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => onStatusSelect(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t-4 w-full border-[#EDEDED] mt-3" />

      {drafts.length > 0 ? (
        <div className="mt-2 divide-y divide-[#F0EEF7]">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(120px,0.75fr)_minmax(0,1.35fr)_auto] items-center gap-3 px-4 sm:px-6 py-3 hover:bg-[#FAFAFD] transition-colors group"
            >
              {/* Title */}
              <p className="truncate text-sm font-semibold text-[#1C1C1C]">
                {draft.title}
              </p>

              {/* Description — hidden on very small screens */}
              <p className="hidden sm:block truncate text-sm font-light text-[#4D4D4D]">
                {draft.description}
              </p>

              {/* Time + actions */}
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <p className="text-sm font-medium text-[#4D4D4D] hidden md:block whitespace-nowrap">
                  {draft.time}
                </p>
                <div className="flex items-center gap-2 sm:gap-4">
                  <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#737373] cursor-pointer hover:text-black" />
              {draft.isStarred ? (
                <StarSolidIcon
                  onClick={() => !busyDraftIds.has(draft.id) && onToggleStar(draft.id)}
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-[#FF304F] ${busyDraftIds.has(draft.id) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                />
              ) : (
                <StarOutlineIcon
                  onClick={() => !busyDraftIds.has(draft.id) && onToggleStar(draft.id)}
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-[#737373] hover:text-[#FF304F] ${busyDraftIds.has(draft.id) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                />
              )}
                  <ArchiveBoxIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#737373] cursor-pointer hover:text-black" />
                  {deletingDraftId === draft.id ? (
                    <span className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 border-[#E50606] border-t-transparent animate-spin" />
                  ) : (
                    <TrashIcon
                      onClick={() => !deletingDraftId && onDeleteClick(draft.id)}
                      className={`h-4 w-4 sm:h-5 sm:w-5 text-[#737373] hover:text-[#E50606] ${deletingDraftId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-44">
          <p className="text-base text-[#AAAAAA]">You have no recent drafts yet</p>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalId !== null}
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
        isLoading={Boolean(deletingDraftId)}
        itemLabel="draft"
      />
    </div>
  );
}
