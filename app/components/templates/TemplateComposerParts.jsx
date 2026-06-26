"use client";

import {
  FaceSmileIcon, LinkIcon, Square2StackIcon, TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUturnLeftIcon, ArrowUturnRightIcon, BoldIcon, BookmarkIcon,
  ItalicIcon, ListBulletIcon, NumberedListIcon, PlusIcon,
  UnderlineIcon, XMarkIcon,
} from "@heroicons/react/24/solid";

function IconBtn({ icon: Icon, title, onClick }) {
  return (
    <button title={title} onClick={onClick} className="p-2 rounded-lg hover:bg-gray-100 text-[#737373] hover:text-black transition-colors">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
}

function ToolbarDivider() {
  return <span className="border-l h-5 border-[#D0D0D0]" />;
}

export function SuccessToast({ message }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#03A12F] text-white text-sm font-medium px-6 py-3 rounded-xl shadow-lg z-[1100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      {message}
    </div>
  );
}

export function TemplateTagField({
  selectedTags,
  tagInputRef,
  tagModal,
  onAddTag,
  onRemoveTag,
  onToggleModal,
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-black">Add tags</label>
      <div className="flex gap-2">
        <div className="flex flex-wrap gap-1.5 items-center flex-1 min-h-[44px] border border-[#BABABA] bg-white rounded-lg px-3 py-2 cursor-text" onClick={() => tagInputRef.current?.focus()}>
          {selectedTags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-[#5943A3] bg-[#DDD6F6] px-2.5 py-1 rounded-full text-xs font-medium">
              <BookmarkIcon className="w-3 h-3" />
              {tag}
              <XMarkIcon className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100" onClick={(event) => { event.stopPropagation(); onRemoveTag(tag); }} />
            </span>
          ))}
          <input
            ref={tagInputRef}
            type="text"
            placeholder={selectedTags.length === 0 ? "Type and press Enter, or pick below" : ""}
            className="outline-none text-sm text-gray-600 placeholder:text-xs flex-1 min-w-[120px]"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAddTag(event.target.value);
                event.target.value = "";
              }
            }}
          />
        </div>
        <button onClick={onToggleModal} className="p-2.5 bg-[#DDD6F6] rounded-full text-[#5943A3] hover:bg-[#C8BBEE] transition-colors self-start shrink-0" aria-label="Add tag from list">
          {tagModal ? <XMarkIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

export function TemplateMessageEditor({
  selectedPlaceholders,
  placeholderModal,
  editorRef,
  showCopied,
  onRemovePlaceholder,
  onTogglePlaceholderModal,
  onCopy,
}) {
  const exec = (cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-black">Message content</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 border border-[#BABABA] bg-white rounded-xl overflow-hidden">
          {selectedPlaceholders.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-3 pt-2">
              {selectedPlaceholders.map((placeholder) => (
                <span key={placeholder} className="flex items-center gap-1 text-[#4D4D4D] bg-[#D9D9D9] px-2.5 py-1 rounded-full text-xs font-medium">
                  {placeholder}
                  <XMarkIcon className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100" onClick={() => onRemovePlaceholder(placeholder)} />
                </span>
              ))}
            </div>
          )}

          <div ref={editorRef} contentEditable suppressContentEditableWarning className="min-h-[140px] sm:min-h-[160px] px-3 py-2 text-sm leading-relaxed focus:outline-none empty:before:content-['Write_content_here...'] empty:before:text-[#BABABA] empty:before:text-xs" />

          <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-t border-[#EDEDED] justify-between">
            <div className="flex items-center gap-0.5 flex-wrap">
              <IconBtn icon={BoldIcon} title="Bold" onClick={() => exec("bold")} />
              <IconBtn icon={ItalicIcon} title="Italic" onClick={() => exec("italic")} />
              <IconBtn icon={UnderlineIcon} title="Underline" onClick={() => exec("underline")} />
              <ToolbarDivider />
              <IconBtn icon={ListBulletIcon} title="Bullet list" onClick={() => exec("insertUnorderedList")} />
              <IconBtn icon={NumberedListIcon} title="Numbered list" onClick={() => exec("insertOrderedList")} />
              <ToolbarDivider />
              <IconBtn icon={LinkIcon} title="Insert link" onClick={() => {
                const url = window.prompt("Enter URL:");
                if (url) exec("createLink", url);
              }} />
              <IconBtn icon={FaceSmileIcon} title="Emoji" onClick={() => {
                const emoji = window.prompt("Enter emoji:");
                if (emoji) exec("insertText", emoji);
              }} />
            </div>
            <div className="flex items-center gap-0.5 relative">
              <IconBtn icon={ArrowUturnLeftIcon} title="Undo" onClick={() => exec("undo")} />
              <IconBtn icon={ArrowUturnRightIcon} title="Redo" onClick={() => exec("redo")} />
              <IconBtn icon={Square2StackIcon} title="Copy" onClick={onCopy} />
              <IconBtn icon={TrashIcon} title="Clear" onClick={() => { if (editorRef.current) editorRef.current.innerHTML = ""; }} />
              {showCopied && <div className="absolute -top-9 right-0 bg-[#1E95BB] text-white text-xs px-3 py-1.5 rounded-md shadow whitespace-nowrap z-10">Copied!</div>}
            </div>
          </div>
        </div>

        <button onClick={onTogglePlaceholderModal} className="p-2.5 bg-[#DDD6F6] rounded-full text-[#5943A3] hover:bg-[#C8BBEE] transition-colors self-start shrink-0 mt-1" aria-label="Add placeholder from list">
          {placeholderModal ? <XMarkIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

export function TemplateFooter({ selectedStyle, isCreating, createError, onStylesClick, onCancel, onCreate }) {
  return (
    <div className="shrink-0 border-t border-[#EDEDED] px-4 sm:px-7 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <button onClick={onStylesClick} className="border-2 border-[#775ADA] py-2 px-4 rounded-full text-sm hover:shadow-md transition-transform shrink-0">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#775ADA] to-[#1E95BB] font-medium">
          {selectedStyle ? `Style: ${selectedStyle}` : "Change writing style with AI"}
        </span>
      </button>
      <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto justify-end">
        {createError && <p className="self-center text-sm text-[#E50606]">{createError}</p>}
        <button onClick={onCancel} disabled={isCreating} className="py-2 px-5 bg-[#DDD6F6] text-[#1E1636] rounded-lg text-sm hover:bg-[#BEB6E5] transition-colors disabled:opacity-60">
          Cancel
        </button>
        <button onClick={onCreate} disabled={isCreating} className="py-2 px-6 bg-[#775ADA] text-white rounded-lg text-sm hover:bg-[#5F48C2] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
          {isCreating && <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
          {isCreating ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}
