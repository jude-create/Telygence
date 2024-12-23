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
import React, { useState } from "react";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

export const RecentDraft = () => {
  const [deleteModalDraftId, setDeleteModalDraftId] = useState(null);
  const [drafts, setDrafts] = useState([
    {
      id: 1,
      title: "Professional Summary",
      description: "Thank you for signing up on Telygence. Begin your journey now!",
      time: "11:45 AM",
      isStarred: false, // Initial star status
    },
    {
      id: 2,
      title: "Company Overview",
      description: "Draft an outline for your organization's key services and values.",
      time: "10:30 AM",
      isStarred: true,
    },
    {
      id: 3,
      title: "Investor Proposal",
      description: "Prepare a detailed proposal letter for potential investors.",
      time: "9:15 AM",
      isStarred: false,
    },
    {
      id: 4,
      title: "Marketing Strategy",
      description: "Plan a comprehensive strategy for launching new products.",
      time: "Yesterday",
      isStarred: false,
    },
    {
      id: 5,
      title: "Project Timeline",
      description: "Create a timeline for completing key deliverables in Q4.",
      time: "2 days ago",
      isStarred: true,
    },
  ]);

  const handleDeleteDraft = (id) => {
    setDeleteModalDraftId(id); // Show the delete modal for this draft
  };

  const confirmDeleteDraft = () => {
    console.log(`Draft with ID ${deleteModalDraftId} deleted!`);
    setDrafts((prevDrafts) =>
      prevDrafts.filter((draft) => draft.id !== deleteModalDraftId)
    ); // Remove the draft from the list
    setDeleteModalDraftId(null); // Close the modal
  };

  const toggleStarDraft = (id) => {
    setDrafts((prevDrafts) =>
      prevDrafts.map((draft) =>
        draft.id === id ? { ...draft, isStarred: !draft.isStarred } : draft
      )
    );
  };

  return (
    <div className="h-auto w-full bg-[#FFFFFF] rounded-xl mt-5 space-y-5 pb-10">
      {/* Header Section */}
      <div className="flex justify-between px-8 pt-5">
        <div className="flex space-x-2 items-center">
          <Image
            className="w-5 h-5"
            src="/images/pen.png"
            alt="Dashboard Icon"
            height={40}
            width={40}
          />
          <p className="font-light text-lg text-[#001C3D]">Recently Drafts</p>
        </div>
        <Link href="/drafts">
          <p className="text-base text-[#775ADA] cursor-pointer hover:underline">
            View all
          </p>
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED]" />

      {/* Recent Drafts */}
      <div className="space-y-1">
        {drafts.map((draft) => (
          <div key={draft.id} className="flex justify-between px-4 text-base h-10 group">
            <p className="truncate w-[30%] font-semibold">{draft.title}</p>
            <p className="font-extralight truncate w-[50%]">{draft.description}</p>
            <div className="w-[35%] flex justify-end font-medium transition-all ease-in-out duration-500">
              {/* Initially visible */}
              <p className="group-hover:opacity-0 group-hover:translate-y-2 transition-all ease-in-out duration-500">
                {draft.time}
              </p>

              {/* Hidden initially, shown on hover */}
              <div className="hidden group-hover:flex xl:space-x-7 items-center transition-all ease-in-out duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                <PencilSquareIcon className="h-5 w-5 text-[#737373]" />
                {draft.isStarred ? (
                  <StarSolidIcon
                    onClick={() => toggleStarDraft(draft.id)}
                    className="h-5 w-5 text-[#FF304F] cursor-pointer"
                  />
                ) : (
                  <StarOutlineIcon
                    onClick={() => toggleStarDraft(draft.id)}
                    className="h-5 w-5 text-[#FF304F] cursor-pointer"
                  />
                )}
                <ArchiveBoxIcon className="h-5 w-5 text-[#737373]" />
                <TrashIcon
                  onClick={() => handleDeleteDraft(draft.id)}
                  className="h-5 w-5 text-[#737373] cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalDraftId !== null}
        onClose={() => setDeleteModalDraftId(null)}
        onConfirm={confirmDeleteDraft}
        itemLabel="draft"
      />
    </div>
  );
};
