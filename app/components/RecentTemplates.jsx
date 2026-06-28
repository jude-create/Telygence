"use client";
import { BookmarkIcon, Square2StackIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ShareIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Share from "../modals/Share";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { LoadingState, Spinner } from "./LoadingState";

export default function RecentTemplates({ templates = [], isLoading = false, deletingTemplateId, onDeleteTemplate }) {
  const [activeShareId, setActiveShareId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const recentTemplates = templates.slice(0, 3);

  const handleCopy = (id) => {
    const t = templates.find((t) => t.id === id);
    if (!t) return;
    navigator.clipboard.writeText(t.message).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = () => {
    if (deleteModalId) onDeleteTemplate?.(deleteModalId);
    setDeleteModalId(null);
  };

  return (
    <section className="h-auto w-full bg-white rounded-xl border border-[#E7E4F0] shadow-sm pb-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between gap-3 px-4 sm:px-6 pt-5">
        <div className="flex items-center gap-2">
          <Image src="/images/temp.png" alt="Templates" height={20} width={20} className="w-5 h-5" />
          <p className="font-medium text-base text-[#001C3D]">Recently used templates</p>
        </div>
        <Link href="/templates">
          <p className="text-sm text-[#775ADA] cursor-pointer hover:underline">View all</p>
        </Link>
      </div>

      <div className="border-t-4 w-full border-[#EDEDED] mt-4" />

      {isLoading ? (
        <LoadingState label="Loading templates..." />
      ) : recentTemplates.length > 0 ? (
        <div className="space-y-4 mt-5 pb-1">
          {recentTemplates.map((template) => (
            <div
              key={template.id}
              className="border border-[#E0DDEA] bg-[#FAFAFD] px-4 sm:px-5 mx-3 sm:mx-5 rounded-xl pb-5 space-y-4 shadow-sm"
            >
              {/* Tag */}
              <div className="flex items-center gap-2 bg-[#DDD6F6] w-fit py-1.5 px-3 rounded-full mt-4">
                <BookmarkIcon className="h-4 w-4 text-[#5943A3]" />
                <p className="text-[#5943A3] text-xs font-medium">{template.tags?.[0] || "Template"}</p>
              </div>

              {/* Content */}
              <p className="text-sm text-[#4D4D4D] whitespace-pre-line leading-relaxed">
                {template.message}
              </p>

              {/* Meta */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium text-[#8093A8]">
                  Created {template.createdAtLabel || "recently"}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {(template.placeholders || []).slice(0, 3).map((placeholder) => (
                    <span key={placeholder} className="bg-[#D9D9D9] rounded-full px-4 py-1 text-xs text-[#4D4D4D]">
                      {placeholder}
                    </span>
                  ))}
                </div>
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
                    onClick={() => !deletingTemplateId && setDeleteModalId(template.id)}
                    className={`w-5 h-5 text-[#737373] hover:text-black transition-transform hover:scale-110 ${deletingTemplateId === template.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  />
                  {deletingTemplateId === template.id && <Spinner />}
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
        isLoading={Boolean(deletingTemplateId)}
        itemLabel="template"
      />
    </section>
  );
}
