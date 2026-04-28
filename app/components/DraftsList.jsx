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
  showStatusDropdown,
  onToggleStatusDropdown,
  onStatusSelect,
  statusDropdownRef,
}) {
  return (
    <div className="bg-white rounded-xl mt-4 sm:mt-5 pb-8">
      {/* Header */}
      <div className="flex justify-between px-4 sm:px-8 pt-5 relative">
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
        <div className="mt-2">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="flex items-center justify-between px-4 sm:px-8 py-2.5 hover:bg-gray-50 transition-colors group"
            >
              {/* Title */}
              <p className="truncate w-[28%] text-sm font-semibold text-[#1C1C1C]">
                {draft.title}
              </p>

              {/* Description — hidden on very small screens */}
              <p className="hidden sm:block truncate w-[38%] text-sm font-extralight text-[#4D4D4D]">
                {draft.description}
              </p>

              {/* Time + actions */}
              <div className="flex items-center justify-end gap-3 sm:gap-6 w-[34%] sm:w-[34%]">
                <p className="text-sm font-medium text-[#4D4D4D] hidden md:block whitespace-nowrap">
                  {draft.time}
                </p>
                <div className="flex items-center gap-2 sm:gap-4">
                  <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#737373] cursor-pointer hover:text-black" />
                  {draft.isStarred ? (
                    <StarSolidIcon
                      onClick={() => onToggleStar(draft.id)}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF304F] cursor-pointer"
                    />
                  ) : (
                    <StarOutlineIcon
                      onClick={() => onToggleStar(draft.id)}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-[#737373] cursor-pointer hover:text-[#FF304F]"
                    />
                  )}
                  <ArchiveBoxIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#737373] cursor-pointer hover:text-black" />
                  <TrashIcon
                    onClick={() => onDeleteClick(draft.id)}
                    className="h-4 w-4 sm:h-5 sm:w-5 text-[#737373] cursor-pointer hover:text-[#E50606]"
                  />
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
        itemLabel="draft"
      />
    </div>
  );
}