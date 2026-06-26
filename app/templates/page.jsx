"use client";
import Image from "next/image";
import { useState } from "react";

import Template from "../modals/Template";
import { useTemplates } from "../hooks/useTemplates";
import TemplatesHeader from "../components/TemplatesHeader";
import TemplateCard from "../components/TemplateCard";
import TagPicker from "../components/TagPicker";
import PlaceholderPicker from "../components/PlaceholderPicker";
import { ErrorState, LoadingState } from "../components/LoadingState";

export default function Templates() {
  const [templateModal, setTemplateModal] = useState(false);

  const {
    // Data
    templates, isLoadingTemplates, templateError, isBulkMutating, mutatingTemplateIds,
    allTags, setAllTags, allPlaceholders, setAllPlaceholders,
    attachedTags, attachedPlaceholders,
    // Selection
    selectAll, selectedTemplates, setSelectedTemplates,
    handleSelectAll, handleDeleteSelected, handleDeleteAll,
    // Bulk dropdown
    bulkDropdownOpen, setBulkDropdownOpen, bulkDropdownRef,
    // Per-template UI
    activeShareId, setActiveShareId,
    copiedId, deleteModalId, setDeleteModalId,
    editModeId, editedMessages, setEditedMessages,
    // Actions
    handleCopy, handleEditStart, handleEditSave, handleEditCancel, handleConfirmDelete,
    handleCreateTemplate,
    // Pickers
    activePicker, setActivePicker,
    handleOpenPicker, handleTagSelect, handleTagRemove,
    handlePlaceholderSelect, handlePlaceholderRemove,
  } = useTemplates();

  return (
    <>
      <div className="p-3 sm:p-5 lg:p-7">

        {/* ── Top bar ────────────────────────────────────────────────────── */}
        <TemplatesHeader
          selectAll={selectAll}
          onSelectAll={handleSelectAll}
          bulkDropdownOpen={bulkDropdownOpen}
          setBulkDropdownOpen={setBulkDropdownOpen}
          bulkDropdownRef={bulkDropdownRef}
          onDeleteSelected={handleDeleteSelected}
          onDeleteAll={handleDeleteAll}
          onCreateTemplate={() => setTemplateModal(true)}
          isBulkMutating={isBulkMutating}
        />

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] gap-4 mt-4 sm:mt-6">

          {/* Template list */}
          <div className="bg-white rounded-xl border border-[#E7E4F0] shadow-sm py-4 w-full min-w-0 overflow-hidden">
            {isLoadingTemplates ? (
              <LoadingState label="Loading templates..." />
            ) : templates.length > 0 ? (
              <div className="space-y-4">
                {templates.map((template) => {
                  const openPickerType =
                    activePicker?.templateId === template.id ? activePicker.type : null;

                  return (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      allTags={allTags}
                      allPlaceholders={allPlaceholders}
                      isEditing={editModeId === template.id}
                      editedMessage={editedMessages[template.id] ?? template.message}
                      attachedTags={attachedTags[template.id] ?? []}
                      attachedPlaceholders={attachedPlaceholders[template.id] ?? []}
                      isSelected={selectedTemplates[template.id] ?? false}
                      copiedId={copiedId}
                      activeShareId={activeShareId}
                      deleteModalId={deleteModalId}
                      openPickerType={openPickerType}
                      isMutating={mutatingTemplateIds.has(template.id)}
                      onEditStart={handleEditStart}
                      onEditSave={() => handleEditSave(template.id)}
                      onEditCancel={handleEditCancel}
                      onMessageChange={(e) =>
                        setEditedMessages((p) => ({ ...p, [template.id]: e.target.value }))
                      }
                      onCheckboxChange={() =>
                        setSelectedTemplates((p) => ({ ...p, [template.id]: !p[template.id] }))
                      }
                      onCopy={handleCopy}
                      onShare={(id) => setActiveShareId((p) => (p === id ? null : id))}
                      onDeleteClick={(id) => setDeleteModalId(id)}
                      onConfirmDelete={handleConfirmDelete}
                      onCloseDeleteModal={() => setDeleteModalId(null)}
                      onOpenPicker={handleOpenPicker}
                      onClosePicker={() => setActivePicker(null)}
                      onTagSelect={handleTagSelect}
                      onTagRemove={(tag) => handleTagRemove(template.id, tag)}
                      onPlaceholderSelect={handlePlaceholderSelect}
                      onPlaceholderRemove={(p) => handlePlaceholderRemove(template.id, p)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-6 py-20">
                <p className="text-base text-[#AAAAAA]">You have no recent templates yet</p>
                <Image
                  src="/images/floating.png"
                  alt="No templates available"
                  height={200}
                  width={200}
                />
              </div>
            )}
            <div className="px-4 sm:px-6 pt-4">
              <ErrorState message={templateError} />
            </div>
          </div>

          {/* Sidebar — TagPicker + PlaceholderPicker in sidebar mode */}
          <div className="w-full min-w-0 flex flex-col">
            <TagPicker
              mode="sidebar"
              tags={allTags}
              onTagsChange={setAllTags}
            />
            <PlaceholderPicker
              mode="sidebar"
              placeholders={allPlaceholders}
              onPlaceholdersChange={setAllPlaceholders}
            />
          </div>

        </div>
      </div>

      <Template
        templateModal={templateModal}
        handleTemplateModal={() => setTemplateModal((o) => !o)}
        onTemplateCreate={handleCreateTemplate}
      />
    </>
  );
}
