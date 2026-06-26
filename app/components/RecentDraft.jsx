"use client";

import {
  ArchiveBoxIcon,
  PencilSquareIcon,
  TrashIcon,
  StarIcon as StarOutlineIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { LoadingState, Spinner } from "./LoadingState";

export const RecentDraft = ({ drafts = [], isLoading = false, deletingDraftId, onDeleteDraft, onToggleStar }) => {
  const [deleteModalDraftId, setDeleteModalDraftId] = useState(null);
  const recentDrafts = drafts.slice(0, 5);

  const handleDeleteDraft = (id) => {
    setDeleteModalDraftId(id);
  };

  const confirmDeleteDraft = () => {
    if (deleteModalDraftId) onDeleteDraft?.(deleteModalDraftId);
    setDeleteModalDraftId(null);
  };

  return (
    <section className="h-auto w-full bg-white rounded-xl border border-[#E7E4F0] shadow-sm space-y-4 pb-6 overflow-hidden">
      <div className="flex justify-between gap-3 px-4 sm:px-6 pt-5">
        <div className="flex space-x-2 items-center">
          <Image
            className="w-5 h-5"
            src="/images/pen.png"
            alt="Dashboard Icon"
            height={40}
            width={40}
          />
          <p className="font-medium text-base text-[#001C3D]">Recent drafts</p>
        </div>
        <Link href="/drafts">
          <p className="text-base text-[#775ADA] cursor-pointer hover:underline">View all</p>
        </Link>
      </div>

      <div className="border-t-4 w-full border-[#EDEDED]" />

      {isLoading ? (
        <LoadingState label="Loading drafts..." />
      ) : recentDrafts.length > 0 ? (
        <div className="space-y-1">
          {recentDrafts.map((draft) => (
            <div
              key={draft.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(120px,0.75fr)_minmax(0,1.4fr)_auto] items-center gap-3 px-4 sm:px-6 py-2.5 text-sm hover:bg-[#FAFAFD]"
            >
              <p className="truncate font-semibold text-[#1C1C1C]">{draft.title}</p>
              <p className="hidden sm:block font-light truncate text-[#4D4D4D]">{draft.description}</p>
              <div className="flex items-center justify-end gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm font-medium text-[#4D4D4D] whitespace-nowrap">{draft.time}</p>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <Link href={`/drafts?draft=${encodeURIComponent(draft.id)}`} aria-label={`Edit ${draft.title}`}>
                    <PencilSquareIcon className="h-5 w-5 text-[#737373] cursor-pointer hover:text-black" />
                  </Link>
                  {draft.isStarred ? (
                    <StarSolidIcon
                      onClick={() => onToggleStar?.(draft.id)}
                      className="h-5 w-5 text-[#FF304F] cursor-pointer"
                    />
                  ) : (
                    <StarOutlineIcon
                      onClick={() => onToggleStar?.(draft.id)}
                      className="h-5 w-5 text-[#737373] cursor-pointer hover:text-[#FF304F]"
                    />
                  )}
                  <ArchiveBoxIcon className="h-5 w-5 text-[#737373]" />
                  <TrashIcon
                    onClick={() => !deletingDraftId && handleDeleteDraft(draft.id)}
                    className={`h-5 w-5 text-[#737373] hover:text-[#E50606] ${deletingDraftId === draft.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  />
                  {deletingDraftId === draft.id && <Spinner />}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6 h-44">
          <p className="text-lg text-[#AAAAAA]">You have no recent drafts yet</p>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalDraftId !== null}
        onClose={() => setDeleteModalDraftId(null)}
        onConfirm={confirmDeleteDraft}
        isLoading={Boolean(deletingDraftId)}
        itemLabel="draft"
      />
    </section>
  );
};
