import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { FontFamily, FontSize, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { ArchiveBoxIcon, SparklesIcon, TrashIcon, StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import DraftToolbar from "../DraftToolbar";

export default function DraftEditorPanel({
  title,
  setTitle,
  editorRef,
  font,
  size,
  isStarred,
  setIsStarred,
  isSavingDraft,
  handleSaveDraft,
  toolbarState,
}) {
  const [editorText, setEditorText] = useState("");
  const [aiStatus, setAiStatus] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      TextStyle,
      FontFamily,
      FontSize,
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#1E95BB] underline underline-offset-2",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      CharacterCount,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] w-full rounded-xl p-4 text-sm leading-7 text-[#1E1636] focus:outline-none sm:min-h-[460px] sm:p-6",
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;
        view.dispatch(view.state.tr.insertText(text));
        return true;
      },
    },
    immediatelyRender: false,
    onUpdate({ editor: currentEditor }) {
      setEditorText(currentEditor.getText());
    },
  });

  useEffect(() => {
    if (!editor) return undefined;

    const api = {
      clear: () => {
        editor.commands.clearContent();
        setEditorText("");
      },
      setContent: (content) => {
        editor.commands.setContent(content || "");
        setEditorText(editor.getText());
      },
      getHTML: () => editor.getHTML(),
      getText: () => editor.getText(),
    };

    editorRef.current = api;

    return () => {
      if (editorRef.current === api) editorRef.current = null;
    };
  }, [editor, editorRef]);

  useEffect(() => {
    if (!editor) return;
    editor.chain().focus().setFontFamily(font).setFontSize(`${size}px`).run();
  }, [editor, font, size]);

  const stats = useMemo(() => {
    const words = editorText.trim() ? editorText.trim().split(/\s+/).length : 0;
    const characters = editorText.replace(/\s/g, "").length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return { words, characters, minutes };
  }, [editorText]);

  const handleClearDraft = () => {
    setTitle("");
    editor?.commands.clearContent();
    setEditorText("");
  };

  const textToTiptapContent = (text) => {
    const paragraphs = String(text || "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    return paragraphs.length
      ? paragraphs.map((paragraph) => ({
          type: "paragraph",
          content: [{ type: "text", text: paragraph }],
        }))
      : "";
  };

  const runAiTool = async (tool) => {
    if (!editor || isGeneratingAi) return;

    const input = editor.getText().trim();
    if (!input) {
      setAiStatus("Write a little first");
      return;
    }

    try {
      setIsGeneratingAi(true);
      setAiStatus(tool === "autocomplete" ? "Completing..." : "Rewriting...");
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool,
          input,
          context: title ? `Draft title: ${title}` : "",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request failed");

      if (tool === "autocomplete") {
        editor.chain().focus().insertContent(textToTiptapContent(data.text)).run();
      } else {
        editor.commands.setContent(textToTiptapContent(data.text));
      }
      setEditorText(editor.getText());
      setAiStatus("AI updated draft");
    } catch (error) {
      setAiStatus(error.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="mt-4 w-full rounded-xl border border-[#E7E4F0] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <label className="w-full lg:max-w-xl">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#8093A8]">Draft title</span>
          <input
            className="min-h-11 w-full rounded-lg border border-[#D8D4E6] px-4 text-sm text-[#1E1636] placeholder:text-sm placeholder:font-light placeholder:text-[#A8A1BA] focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
            placeholder="Enter title here..."
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <div className="grid grid-cols-3 gap-2 text-center sm:flex sm:text-left">
          <div className="rounded-lg bg-[#F8F7FC] px-3 py-2">
            <p className="text-xs text-[#8093A8]">Words</p>
            <p className="text-sm font-semibold text-[#1E1636]">{stats.words}</p>
          </div>
          <div className="rounded-lg bg-[#F8F7FC] px-3 py-2">
            <p className="text-xs text-[#8093A8]">Characters</p>
            <p className="text-sm font-semibold text-[#1E1636]">{stats.characters}</p>
          </div>
          <div className="rounded-lg bg-[#F8F7FC] px-3 py-2">
            <p className="text-xs text-[#8093A8]">Read</p>
            <p className="text-sm font-semibold text-[#1E1636]">{stats.minutes} min</p>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-4 rounded-xl border border-[#E9E5F5] bg-[#FBFAFE] p-2">
        <DraftToolbar editor={editor} font={font} size={size} {...toolbarState} />
      </div>

      <div className="relative z-10 mt-4 rounded-xl border border-[#EDEDED] bg-white transition-colors focus-within:border-[#775ADA] focus-within:ring-2 focus-within:ring-[#775ADA]/20">
        <div className="tiptap-editor" style={{ fontFamily: font, fontSize: `${size}px` }}>
          <EditorContent editor={editor} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EDF7] px-4 py-3 text-xs text-[#8093A8]">
          <span>{title.trim() ? title.trim() : "Untitled draft"}</span>
          <span>Plain text paste enabled</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => runAiTool("autocomplete")}
            disabled={isGeneratingAi}
            className="flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-[#775ADA] px-4 py-2 text-sm font-medium text-[#775ADA] transition-colors hover:bg-[#F3F0FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SparklesIcon className="h-4 w-4" />
            {isGeneratingAi ? "Working..." : "Auto-complete with AI"}
          </button>
          <button
            type="button"
            onClick={() => runAiTool("rewrite")}
            disabled={isGeneratingAi}
            className="min-h-10 rounded-lg bg-[#F3F0FF] px-4 py-2 text-sm font-medium text-[#5943A3] transition-colors hover:bg-[#E6DEFF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Rewrite
          </button>
          {aiStatus && <span className="text-xs text-[#8093A8]">{aiStatus}</span>}
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {isStarred ? (
            <StarSolidIcon onClick={() => setIsStarred(false)} className="h-5 w-5 text-[#FF304F] cursor-pointer" />
          ) : (
            <StarOutlineIcon onClick={() => setIsStarred(true)} className="h-5 w-5 text-[#737373] cursor-pointer hover:text-[#FF304F]" />
          )}
          <ArchiveBoxIcon className="h-5 w-5 text-[#737373] cursor-pointer hover:text-black" />
          <TrashIcon
            onClick={handleClearDraft}
            className="h-5 w-5 text-[#737373] cursor-pointer hover:text-[#E50606]"
          />
          <button
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="min-h-10 py-2 px-5 bg-[#775ADA] text-white text-sm rounded-lg hover:bg-[#5F48C2] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSavingDraft ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
