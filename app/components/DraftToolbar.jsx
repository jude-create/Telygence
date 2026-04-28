"use client";
import {
  ArrowUturnLeftIcon, ArrowUturnRightIcon,
} from "@heroicons/react/24/solid";
import {
  PrinterIcon, LinkIcon, FaceSmileIcon,
} from "@heroicons/react/24/outline";
import {
  BoldIcon, ItalicIcon, UnderlineIcon,
  ListBulletIcon, NumberedListIcon,
} from "@heroicons/react/24/solid";

const ICON_CLS = "w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-black transition-transform hover:scale-110 shrink-0";

function Divider() {
  return <span className="border-l h-5 border-[#737373]" />;
}

/**
 * DraftToolbar
 *
 * Calls `document.execCommand` for basic rich-text formatting on the
 * contentEditable editor div. execCommand is deprecated but still
 * universally supported for this use-case without pulling in a
 * rich-text library.
 *
 * Props:
 *   editorRef  React.RefObject  — ref attached to the contentEditable div
 *   font       string
 *   size       number
 *   onFontClick  () => void
 *   onSizeClick  () => void
 *   showFontDropdown  boolean
 *   showSizeDropdown  boolean
 *   fontDropdownRef   React.RefObject
 *   sizeDropdownRef   React.RefObject
 */
export default function DraftToolbar({
  editorRef,
  font,
  size,
  onFontClick,
  onSizeClick,
  showFontDropdown,
  showSizeDropdown,
  fontDropdownRef,
  sizeDropdownRef,
}) {
  const exec = (cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) exec("createLink", url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#737373]">
      {/* Undo / Redo / Print */}
      <ArrowUturnLeftIcon
        title="Undo (Ctrl+Z)"
        className={ICON_CLS}
        onClick={() => exec("undo")}
      />
      <ArrowUturnRightIcon
        title="Redo (Ctrl+Y)"
        className={ICON_CLS}
        onClick={() => exec("redo")}
      />
      <PrinterIcon
        title="Print (Ctrl+P)"
        className={ICON_CLS}
        onClick={() => window.print()}
      />

      <Divider />

      {/* Text formatting */}
      <BoldIcon      title="Bold (Ctrl+B)"      className={ICON_CLS} onClick={() => exec("bold")} />
      <ItalicIcon    title="Italic (Ctrl+I)"    className={ICON_CLS} onClick={() => exec("italic")} />
      <UnderlineIcon title="Underline (Ctrl+U)" className={ICON_CLS} onClick={() => exec("underline")} />

      <Divider />

      {/* Lists */}
      <ListBulletIcon
        title="Bullet list"
        className={ICON_CLS}
        onClick={() => exec("insertUnorderedList")}
      />
      <NumberedListIcon
        title="Numbered list"
        className={ICON_CLS}
        onClick={() => exec("insertOrderedList")}
      />

      <Divider />

      {/* Link + Emoji */}
      <LinkIcon
        title="Insert link (Ctrl+K)"
        className={ICON_CLS}
        onClick={insertLink}
      />
      <FaceSmileIcon
        title="Add emoji"
        className={ICON_CLS}
        onClick={() => {
          const emoji = window.prompt("Enter emoji:");
          if (emoji) exec("insertText", emoji);
        }}
      />

      <Divider />

      {/* Font family dropdown */}
      <div className="relative" ref={fontDropdownRef}>
        <button
          onClick={onFontClick}
          className="flex items-center gap-2 h-9 border border-[#999999] rounded-lg px-3 text-sm text-black"
        >
          <span>{font}</span>
          <svg className="w-3 h-3" viewBox="0 0 10 6" fill="currentColor">
            <path d={showFontDropdown ? "M0 6L5 0l5 6H0z" : "M0 0l5 6 5-6H0z"} />
          </svg>
        </button>
        {showFontDropdown && (
          <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-md z-30 w-32">
            {["Sora", "Arial", "Georgia", "Courier New", "Verdana"].map((f) => (
              <button
                key={f}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                style={{ fontFamily: f }}
                onClick={() => { exec("fontName", f); onFontClick(); }}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font size dropdown */}
      <div className="relative" ref={sizeDropdownRef}>
        <button
          onClick={onSizeClick}
          className="flex items-center gap-1 h-9 border border-[#999999] rounded-lg px-3 text-sm text-black"
        >
          <span>{size}</span>
          <svg className="w-3 h-3" viewBox="0 0 10 6" fill="currentColor">
            <path d={showSizeDropdown ? "M0 6L5 0l5 6H0z" : "M0 0l5 6 5-6H0z"} />
          </svg>
        </button>
        {showSizeDropdown && (
          <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-md z-30 w-20 max-h-48 overflow-y-auto">
            {[10, 12, 14, 15, 16, 18, 20, 24, 28, 32, 36].map((s) => (
              <button
                key={s}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  // execCommand fontSize uses 1-7; we map roughly
                  const htmlSize = s <= 10 ? 1 : s <= 13 ? 2 : s <= 16 ? 3 : s <= 18 ? 4 : s <= 24 ? 5 : s <= 32 ? 6 : 7;
                  exec("fontSize", String(htmlSize));
                  onSizeClick();
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}