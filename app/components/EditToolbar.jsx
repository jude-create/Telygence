"use client";
import { FaceSmileIcon, LinkIcon } from "@heroicons/react/24/outline";
import {
  BoldIcon, ItalicIcon, ListBulletIcon,
  NumberedListIcon, UnderlineIcon,
} from "@heroicons/react/24/solid";

const ICON_BTN = "w-4 h-4 cursor-pointer hover:text-black transition-colors";

export default function EditToolbar({ onSave, onCancel }) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-gray-200">
      {/* Formatting icons */}
      <div className="flex items-center gap-3 text-[#737373] flex-wrap">
        <BoldIcon className={ICON_BTN} />
        <ItalicIcon className={ICON_BTN} />
        <UnderlineIcon className={ICON_BTN} />
        <span className="border-l h-5 border-[#737373]" />
        <ListBulletIcon className={ICON_BTN} />
        <NumberedListIcon className={ICON_BTN} />
        <span className="border-l h-5 border-[#737373]" />
        <LinkIcon className={ICON_BTN} />
        <FaceSmileIcon className={ICON_BTN} />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="py-1.5 px-4 bg-[#DDD6F6] text-[#1E1636] rounded-lg text-sm hover:bg-[#BEB6E5] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="py-1.5 px-4 bg-[#775ADA] text-white rounded-lg text-sm hover:bg-[#5F48C2] transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}