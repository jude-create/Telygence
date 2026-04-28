"use client";
import { BookmarkIcon, Square2StackIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ShareIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Share from "../modals/Share";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

const RECENT_TEMPLATES = [
  {
    id: 1,
    tag: "Job hunt cold emails",
    title: "Hi Joel",
    message: `I sent you a message a few weeks back. To follow up, I'd love to connect to discuss Topic.\nAre you free sometime in the next couple of days for a quick chat? Let me know, thanks!`,
    meta: { author: "David", date: "09/26/2024" },
  },
  {
    id: 2,
    tag: "Networking",
    title: "Hello Alex",
    message: `It was great meeting you at the conference. I'd love to stay in touch and learn more about your work.\nAre you available for a quick call this week?`,
    meta: { author: "Sophia", date: "09/25/2024" },
  },
];

export default function RecentTemplates() {
  const [templates, setTemplates] = useState(RECENT_TEMPLATES);
  const [activeShareId, setActiveShareId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const handleCopy = (id) => {
    const t = templates.find((t) => t.id === id);
    navigator.clipboard.writeText(`${t.title}\n${t.message}`).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = () => {
    setTemplates((prev) => prev.filter((t) => t.id !== deleteModalId));
    setDeleteModalId(null);
  };

  return (
    <div className="h-auto w-full bg-white rounded-xl mt-4 sm:mt-6 pb-8">
      {/* Header */}
      <div className="flex justify-between px-4 sm:px-7 pt-5">
        <div className="flex items-center gap-2">
          <Image src="/images/temp.png" alt="Templates" height={20} width={20} className="w-5 h-5" />
          <p className="font-light text-base text-[#001C3D]">Recently used templates</p>
        </div>
        <Link href="/templates">
          <p className="text-sm text-[#775ADA] cursor-pointer hover:underline">View all</p>
        </Link>
      </div>

      <div className="border-t-4 w-full border-[#EDEDED] mt-4" />

      {templates.length > 0 ? (
        <div className="space-y-5 mt-5">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-[#BABABA] bg-[#EDEDED] px-4 sm:px-7 mx-4 sm:mx-6 rounded-xl pb-5 space-y-4"
            >
              {/* Tag */}
              <div className="flex items-center gap-2 bg-[#DDD6F6] w-fit py-1.5 px-3 rounded-full mt-4">
                <BookmarkIcon className="h-4 w-4 text-[#5943A3]" />
                <p className="text-[#5943A3] text-xs font-medium">{template.tag}</p>
              </div>

              {/* Content */}
              <p className="font-semibold text-sm text-[#4D4D4D]">{template.title}</p>
              <p className="text-sm text-[#4D4D4D] whitespace-pre-line leading-relaxed">
                {template.message}
              </p>

              {/* Meta chips */}
              <div className="flex gap-2 flex-wrap">
                <span className="bg-[#D9D9D9] rounded-full px-4 py-1 text-xs text-[#4D4D4D]">
                  {template.meta.author}
                </span>
                <span className="bg-[#D9D9D9] rounded-full px-4 py-1 text-xs text-[#4D4D4D]">
                  {template.meta.date}
                </span>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#4D4D4D]">Cheers</p>
                <div className="flex gap-5 relative">
                  <ShareIcon
                    onClick={() => setActiveShareId((p) => (p === template.id ? null : template.id))}
                    className="w-5 h-5 text-[#737373] cursor-pointer hover:text-black transition-transform hover:scale-110"
                  />
                  <Square2StackIcon
                    onClick={() => handleCopy(template.id)}
                    className="w-5 h-5 text-[#737373] cursor-pointer hover:text-black transition-transform hover:scale-110"
                  />
                  <TrashIcon
                    onClick={() => setDeleteModalId(template.id)}
                    className="w-5 h-5 text-[#737373] cursor-pointer hover:text-black transition-transform hover:scale-110"
                  />
                  {copiedId === template.id && (
                    <div className="absolute -top-9 right-0 bg-[#1E95BB] text-white text-xs px-3 py-1.5 rounded-md shadow whitespace-nowrap">
                      Copied to clipboard!
                    </div>
                  )}
                  {activeShareId === template.id && (
                    <Share isOpen onClose={() => setActiveShareId(null)} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-5 py-14">
          <p className="text-base text-[#AAAAAA]">You have no recent templates yet</p>
          <Image src="/images/floating.png" alt="No templates" height={200} width={200} />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalId !== null}
        onClose={() => setDeleteModalId(null)}
        onConfirm={handleDelete}
        itemLabel="template"
      />
    </div>
  );
}