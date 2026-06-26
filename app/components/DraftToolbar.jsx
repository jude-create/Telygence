"use client";
import {
  ArrowUturnLeftIcon, ArrowUturnRightIcon, Bars3BottomLeftIcon,
  Bars3BottomRightIcon, Bars3Icon, Bars4Icon,
} from "@heroicons/react/24/solid";
import {
  PrinterIcon, LinkIcon, FaceSmileIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  BoldIcon, ItalicIcon, UnderlineIcon,
  ListBulletIcon, NumberedListIcon,
} from "@heroicons/react/24/solid";

const ICON_CLS = "w-4 h-4 sm:w-5 sm:h-5 shrink-0";
const TOOL_BUTTON =
  "grid h-9 w-9 place-items-center rounded-lg text-[#737373] transition-colors hover:bg-[#F3F0FF] hover:text-[#1E1636] focus:outline-none focus:ring-2 focus:ring-[#775ADA]";
const SELECT_BUTTON =
  "h-9 rounded-lg border border-[#D8D4E6] bg-white px-3 text-sm text-[#1E1636] transition-colors hover:border-[#775ADA] focus:outline-none focus:ring-2 focus:ring-[#775ADA]";
const FONTS = ["Sora", "Arial", "Georgia", "Courier New", "Verdana"];
const SIZES = [10, 12, 14, 15, 16, 18, 20, 24, 28, 32, 36];

function Divider() {
  return <span className="hidden h-6 border-l border-[#D8D4E6] sm:block" />;
}

/**
 * DraftToolbar
 * Tiptap toolbar for the draft editor.
 */
export default function DraftToolbar({
  editor,
  font,
  size,
  onFontSelect,
  onSizeSelect,
}) {
  const run = (command) => {
    if (!editor) return;
    command(editor.chain().focus()).run();
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    run((chain) => chain.extendMarkRange("link").setLink({ href: url }));
  };

  const isActive = (name, attributes) => editor?.isActive(name, attributes);

  const buttonClass = (active) => `${TOOL_BUTTON} ${active ? "bg-[#EDE8FF] text-[#1E1636]" : ""}`;

  const ToolbarButton = ({ title, onClick, active, children }) => (
    <button type="button" title={title} aria-label={title} className={buttonClass(active)} onClick={onClick} disabled={!editor}>
      {children}
    </button>
  );

  const setFont = (nextFont) => {
    run((chain) => chain.setFontFamily(nextFont));
    onFontSelect(nextFont);
  };

  const setSize = (nextSize) => {
    run((chain) => chain.setFontSize(`${nextSize}px`));
    onSizeSelect(nextSize);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-[#737373]">
      <ToolbarButton title="Undo (Ctrl+Z)" onClick={() => run((chain) => chain.undo())}>
        <ArrowUturnLeftIcon className={ICON_CLS} />
      </ToolbarButton>
      <ToolbarButton title="Redo (Ctrl+Y)" onClick={() => run((chain) => chain.redo())}>
        <ArrowUturnRightIcon className={ICON_CLS} />
      </ToolbarButton>
      <ToolbarButton title="Print (Ctrl+P)" onClick={() => window.print()}>
        <PrinterIcon className={ICON_CLS} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Bold (Ctrl+B)" active={isActive("bold")} onClick={() => run((chain) => chain.toggleBold())}>
        <BoldIcon className={ICON_CLS} />
      </ToolbarButton>
      <ToolbarButton title="Italic (Ctrl+I)" active={isActive("italic")} onClick={() => run((chain) => chain.toggleItalic())}>
        <ItalicIcon className={ICON_CLS} />
      </ToolbarButton>
      <ToolbarButton title="Underline (Ctrl+U)" active={isActive("underline")} onClick={() => run((chain) => chain.toggleUnderline())}>
        <UnderlineIcon className={ICON_CLS} />
      </ToolbarButton>
      <ToolbarButton title="Clear formatting" onClick={() => run((chain) => chain.unsetAllMarks().clearNodes())}>
        <XMarkIcon className={ICON_CLS} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Bullet list" active={isActive("bulletList")} onClick={() => run((chain) => chain.toggleBulletList())}>
        <ListBulletIcon className={ICON_CLS} />
      </ToolbarButton>
      <ToolbarButton title="Numbered list" active={isActive("orderedList")} onClick={() => run((chain) => chain.toggleOrderedList())}>
        <NumberedListIcon className={ICON_CLS} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Align left" active={isActive({ textAlign: "left" })} onClick={() => run((chain) => chain.setTextAlign("left"))}>
        <Bars3BottomLeftIcon className={ICON_CLS} />
      </ToolbarButton>
      <ToolbarButton title="Align center" active={isActive({ textAlign: "center" })} onClick={() => run((chain) => chain.setTextAlign("center"))}>
        <Bars3Icon className={ICON_CLS} />
      </ToolbarButton>
      <ToolbarButton title="Align right" active={isActive({ textAlign: "right" })} onClick={() => run((chain) => chain.setTextAlign("right"))}>
        <Bars3BottomRightIcon className={ICON_CLS} />
      </ToolbarButton>
      <ToolbarButton title="Justify text" active={isActive({ textAlign: "justify" })} onClick={() => run((chain) => chain.setTextAlign("justify"))}>
        <Bars4Icon className={ICON_CLS} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Insert link (Ctrl+K)" onClick={insertLink}>
        <LinkIcon className={ICON_CLS} />
      </ToolbarButton>
      <ToolbarButton
        title="Add emoji"
        onClick={() => {
          const emoji = window.prompt("Enter emoji:");
          if (emoji) run((chain) => chain.insertContent(emoji));
        }}
      >
        <FaceSmileIcon className={ICON_CLS} />
      </ToolbarButton>

      <Divider />

      <label className="sr-only" htmlFor="draft-font-family">Font style</label>
      <select
        id="draft-font-family"
        value={font}
        onChange={(event) => setFont(event.target.value)}
        className={`${SELECT_BUTTON} min-w-36 cursor-pointer appearance-auto`}
        style={{ fontFamily: font }}
      >
        {FONTS.map((nextFont) => (
          <option key={nextFont} value={nextFont} style={{ fontFamily: nextFont }}>
            {nextFont}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="draft-font-size">Font size</label>
      <select
        id="draft-font-size"
        value={size}
        onChange={(event) => setSize(Number(event.target.value))}
        className={`${SELECT_BUTTON} min-w-20 cursor-pointer appearance-auto`}
      >
        {SIZES.map((nextSize) => (
          <option key={nextSize} value={nextSize}>
            {nextSize}
          </option>
        ))}
      </select>
    </div>
  );
}
