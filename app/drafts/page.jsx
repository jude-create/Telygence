"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import DraftsList from "../components/DraftsList";
import DraftEditorPanel from "../components/drafts/DraftEditorPanel";
import { CreatingModal, DiscardModal } from "../components/drafts/DraftModals";
import { ErrorState, LoadingState } from "../components/LoadingState";
import { useDrafts } from "../hooks/useDrafts";
import { useDraftToolbarState } from "../hooks/useDraftToolbarState";

export default function Drafts() {
  const drafts = useDrafts();
  const toolbar = useDraftToolbarState();

  return (
    <>
      <div className="p-3 sm:p-5 lg:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_140px] gap-3 w-full">
          <div className="w-full flex justify-between items-center gap-3 px-4 sm:px-6 py-3 bg-white rounded-xl border border-[#E7E4F0] shadow-sm">
            <p className="text-base sm:text-xl font-medium">Drafts</p>
            <p className="text-[#8093A8] text-sm">{drafts.isLoadingDrafts ? "Loading..." : drafts.saveStatus}</p>
          </div>
          <div className="w-full">
            <button onClick={drafts.handleNewDraft} className="flex justify-center items-center gap-2 rounded-lg bg-custom-radial w-full h-12 sm:h-14 text-sm sm:text-base font-bold tracking-wider text-white transition-all ease-in-out duration-500 hover:opacity-90">
              New draft
              <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            </button>
          </div>
        </div>

        <DraftEditorPanel
          title={drafts.title}
          setTitle={drafts.setTitle}
          editorRef={drafts.editorRef}
          font={toolbar.font}
          size={toolbar.size}
          isStarred={drafts.isStarred}
          setIsStarred={drafts.setIsStarred}
          isSavingDraft={drafts.isSavingDraft}
          handleSaveDraft={drafts.handleSaveDraft}
          toolbarState={toolbar.toolbarState}
        />

        {drafts.isLoadingDrafts ? (
          <div className="bg-white rounded-xl border border-[#E7E4F0] shadow-sm mt-4">
            <LoadingState label="Loading drafts..." />
          </div>
        ) : (
          <DraftsList
            drafts={drafts.drafts}
            deleteModalId={drafts.deleteModalId}
            onDeleteClick={drafts.setDeleteModalId}
            onConfirmDelete={drafts.handleConfirmDelete}
            onCloseDeleteModal={() => drafts.setDeleteModalId(null)}
            onToggleStar={drafts.handleToggleStar}
            busyDraftIds={drafts.updatingStarIds}
            deletingDraftId={drafts.deletingDraftId}
            showStatusDropdown={toolbar.showStatusDropdown}
            onToggleStatusDropdown={() => toolbar.setShowStatusDropdown((open) => !open)}
            onStatusSelect={() => toolbar.setShowStatusDropdown(false)}
            statusDropdownRef={toolbar.statusDropdownRef}
          />
        )}

        <div className="mt-3">
          <ErrorState message={drafts.draftError} />
        </div>
      </div>

      {drafts.isDiscardModalOpen && (
        <DiscardModal onCancel={() => drafts.setIsDiscardModalOpen(false)} onConfirm={drafts.createBlankDraft} />
      )}
      {drafts.isCreatingModalOpen && <CreatingModal />}
    </>
  );
}
