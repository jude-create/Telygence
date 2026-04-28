"use client";
import { BookmarkIcon, Square2StackIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ShareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import Share from "../modals/Share";
import TagPicker from "./TagPicker";
import PlaceholderPicker from "./PlaceholderPicker";
import ChipList from "./ChipList";
import EditToolbar from "./EditToolbar";

/**
 * TemplateCard
 *
 * Renders one template with view / edit states, tag + placeholder pickers,
 * share, copy-to-clipboard, and delete.
 */
export default function TemplateCard({
  template,
  allTags,
  allPlaceholders,
  isEditing,
  editedMessage,
  attachedTags,
  attachedPlaceholders,
  isSelected,
  copiedId,
  activeShareId,
  deleteModalId,
  openPickerType,        // "tags" | "placeholders" | null  (for THIS card)
  // handlers
  onEditStart,
  onEditSave,
  onEditCancel,
  onMessageChange,
  onCheckboxChange,
  onCopy,
  onShare,
  onDeleteClick,
  onConfirmDelete,
  onCloseDeleteModal,
  onOpenPicker,
  onClosePicker,
  onTagSelect,
  onTagRemove,
  onPlaceholderSelect,
  onPlaceholderRemove,
}) {
  const tagIcon = <BookmarkIcon className="h-3.5 w-3.5 shrink-0" />;

  return (
    <div className="border border-[#BABABA] bg-[#EDEDED] px-3 sm:px-4 mx-3 sm:mx-6 rounded-xl pb-4 space-y-4">

      {/* ── Tags row ─────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start pt-4 gap-3">
        <div className="relative flex-1 min-w-0">
          <ChipList
            items={attachedTags}
            colorClass="text-[#5943A3] bg-[#DDD6F6]"
            icon={tagIcon}
            canEdit={isEditing}
            isPickerOpen={openPickerType === "tags"}
            onPickerToggle={() => onOpenPicker(template.id, "tags")}
            onRemove={(tag) => onTagRemove(tag)}
            hint="Tags — editable in edit mode"
          />
          {openPickerType === "tags" && (
            <TagPicker
              mode="picker"
              tags={allTags}
              selected={attachedTags}
              onSelect={onTagSelect}
              onRemove={onTagRemove}
              onClose={onClosePicker}
            />
          )}
        </div>

        {!isEditing && (
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer mt-1 shrink-0"
            checked={isSelected}
            onChange={onCheckboxChange}
            aria-label="Select template"
          />
        )}
      </div>

      {/* ── Message ──────────────────────────────────────────────────────── */}
      {isEditing ? (
        <textarea
          value={editedMessage}
          onChange={onMessageChange}
          className="w-full p-3 border border-gray-300 rounded-lg h-40 bg-white text-sm resize-none
                     focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
        />
      ) : (
        <p className="text-sm text-[#4D4D4D] whitespace-pre-line leading-relaxed">
          {template.message}
        </p>
      )}

      {/* ── Placeholders row ─────────────────────────────────────────────── */}
      <div className="relative">
        <ChipList
          items={attachedPlaceholders}
          colorClass="text-[#4D4D4D] bg-[#D9D9D9]"
          canEdit={isEditing}
          isPickerOpen={openPickerType === "placeholders"}
          onPickerToggle={() => onOpenPicker(template.id, "placeholders")}
          onRemove={(p) => onPlaceholderRemove(p)}
          hint="Placeholders — editable in edit mode"
        />
        {openPickerType === "placeholders" && (
          <PlaceholderPicker
            mode="picker"
            placeholders={allPlaceholders}
            selected={attachedPlaceholders}
            onSelect={onPlaceholderSelect}
            onRemove={onPlaceholderRemove}
            onClose={onClosePicker}
          />
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#4D4D4D]">Cheers</p>

        <div className="flex gap-4 sm:gap-5 relative">
          <ShareIcon
            onClick={() => onShare(template.id)}
            className="w-5 h-5 text-[#737373] cursor-pointer hover:text-black transition-transform hover:scale-110"
          />
          <Square2StackIcon
            onClick={() => onCopy(template.id)}
            className="w-5 h-5 text-[#737373] cursor-pointer hover:text-black transition-transform hover:scale-110"
          />
          <TrashIcon
            onClick={() => onDeleteClick(template.id)}
            className="w-5 h-5 text-[#737373] cursor-pointer hover:text-black transition-transform hover:scale-110"
          />

          {copiedId === template.id && (
            <div className="absolute -top-9 right-0 bg-[#1E95BB] text-white text-xs px-3 py-1.5 rounded-md shadow whitespace-nowrap z-10">
              Copied to clipboard!
            </div>
          )}

          {activeShareId === template.id && (
            <Share isOpen onClose={() => onShare(null)} />
          )}
        </div>
      </div>

      {/* ── Edit toolbar / Edit button ────────────────────────────────────── */}
      {isEditing ? (
        <EditToolbar onSave={onEditSave} onCancel={onEditCancel} />
      ) : (
        <button
          onClick={() => onEditStart(template.id)}
          className="py-1.5 px-3 bg-[#775ADA] text-white text-sm rounded-lg
                     hover:bg-[#5F48C2] transition-colors"
        >
          Edit
        </button>
      )}

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <DeleteConfirmationModal
        isOpen={deleteModalId === template.id}
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
        itemLabel="template"
      />
    </div>
  );
}