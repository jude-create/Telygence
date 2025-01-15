"use client"
import { FaceSmileIcon, LinkIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { BoldIcon, EllipsisHorizontalCircleIcon, EllipsisVerticalIcon, ItalicIcon, ListBulletIcon, NumberedListIcon, PlusIcon, UnderlineIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Template from '../modals/Template';
import { BookmarkIcon, Square2StackIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ShareIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Share from "../modals/Share";
import Link from "next/link";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import Tags from '../components/Tags';
import Placeholder from '../components/Placeholder';
import PlaceholderModal from '../modals/PlaceholderModal';
import TagsModal from '../modals/TagsModal';


export default function Templates() {
  const [templateModal, setTemplateModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [placeholderModal, setPlaceholderModal] = useState(false);
  const [activeShareModalId, setActiveShareModalId] = useState(null);
  const [copiedTemplateId, setCopiedTemplateId] = useState(null); // Track the template that shows "Copied"
  const [deleteModalTemplateId, setDeleteModalTemplateId] = useState(null); // Track template for delete modal
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false); // Manage dropdown visibility
  const [activePlaceholderModalId, setActivePlaceholderModalId] = useState(null);
  const [editModeTemplateId, setEditModeTemplateId] = useState(null); // For edit mode
  const [editedTemplateMessage, setEditedTemplateMessage] = useState({}); // Store edited template messages
  const [selectedPlaceholders, setSelectedPlaceholders] = useState(["First Name"]); // State to store selected placeholder
  const [draggedTag, setDraggedTag] = useState(null); // Track dragged tag
  const [tagModal, setTagModal] = useState(false)
  const [activeTagModalId, setActiveTagModalId] = useState(null);
  const [selectedTags, setSelectedTags] = useState(["Job hunt cold email"]); // State to store selected tags
  
  


 

  // Function to handle the "Create Template" modal
  const handleTemplateModal = () => {
    setTemplateModal(!templateModal);
  };

  
  const templates = [
    {
      id: 1,
      tag: "Job hunt cold emails",
      message: ` Hi Joel 
      I sent you a message a few weeks back. To follow up, I'd love to connect to discuss Topic. 
      Are you free sometime in the next couple of days for a quick chat? Let me know, thanks!`,
      
    },
    {
      id: 2,
      tag: "Networking ",
      message: ` Hello Alex 
      It was great meeting you at the conference. I'd love to stay in touch and learn more about 
      your work. Are you available for a quick call this week?`,
      
    },
    {
      id: 3,
      tag: "Networking ",
      message: `
      Hello Alex
      It was great meeting you at the conference. I'd love to stay in touch and learn more about 
      your work. Are you available for a quick call this week?`,
      
    },
  ];
 
  // Close dropdown if clicked outside
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); 
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);
   
// Copy template message to clipboard
  const handleCopyToClipboard = (id) => {
    const template = templates.find((t) => t.id === id);
    const textToCopy = template.message; 

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedTemplateId(id); // Show "Copied to clipboard" message for this template

      // Hide the message after 2 seconds
      setTimeout(() => {
        setCopiedTemplateId(null);
      }, 2000);
    });
  };

  const handleShareModal = (id) => {
    if (id === activeShareModalId) {
      setActiveShareModalId(null); // Close modal if the same ID is clicked
    } else {
      setActiveShareModalId(id); // Open modal for the selected template
    }
  };

  const handleDeleteTemplate = (id) => {
    setDeleteModalTemplateId(id); // Show the delete modal for this template
  };

  const confirmDeleteTemplate = () => {
    console.log(`Template with ID ${deleteModalTemplateId} deleted!`);
    setDeleteModalTemplateId(null); // Close the modal
    // Add logic to actually delete the template from the list if needed
  };

  // Handle individual template selection
  const handleTemplateCheckbox = (id) => {
    setSelectedTemplates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const allSelected = templates.reduce((acc, template) => {
      acc[template.id] = newSelectAll;
      return acc;
    }, {});

    setSelectedTemplates(allSelected);
  };

   // Function to delete selected templates
   const deleteSelectedTemplates = () => {
    const selectedIds = Object.keys(selectedTemplates).filter((id) => selectedTemplates[id]);
    console.log("Deleting selected templates:", selectedIds);
    // Implement logic to delete selected templates
    setSelectedTemplates({});
    setDropdownOpen(false); // Close dropdown
  };

  // Function to delete all templates
  const deleteAllTemplates = () => {
    console.log("Deleting all templates!");
    // Implement logic to delete all templates
    setSelectedTemplates({});
    setDropdownOpen(false); // Close dropdown
  };

    // Function to handle the placeholder modal for a specific template
    const handlePlaceholderModal = (templateId) => {
      if (editModeTemplateId === templateId) {
        setPlaceholderModal((prev) => !prev); // Toggle the modal
        setActivePlaceholderModalId((prev) =>
          prev === templateId ? null : templateId
        ); // Track active template for the modal
      }
    };

     // Function to handle the tag modal for a specific template
     const handleTagModal = (templateId) => {
      if (editModeTemplateId === templateId) {
        setTagModal((prev) => !prev); // Toggle the modal
        setActiveTagModalId((prev) =>
          prev === templateId ? null : templateId
        ); // Track active template for the modal
      }
    };
    

  
    // Function to handle edit mode
  const handleEditTemplate = (id, message) => {
    setEditModeTemplateId(id);
    setEditedTemplateMessage({ [id]: message });
  };

  const handleSaveTemplate = (id) => {
    console.log("Template Saved:", editedTemplateMessage[id]);
    setEditModeTemplateId(null);
  };

  const handleCancelEdit = () => {
    setEditModeTemplateId(null);
    setEditedTemplateMessage({});
  };

  const handlePlaceholderSelect = (selectedPlaceholder) => {
    // Only allow placeholder selection if we are in edit mode
    if (editModeTemplateId !== null) {
      if (!selectedPlaceholders.includes(selectedPlaceholder)) {
        setSelectedPlaceholders((prevPlaceholders) => [
          ...prevPlaceholders,
          selectedPlaceholder,
        ]);
      }
    }
  };
  
  const removePlaceholder = (placeholderToRemove) => {
    // Remove the selected tag
    setSelectedPlaceholders((prevPlaceholders) => prevPlaceholders.filter((placeholder) => placeholder!== placeholderToRemove));
  };

  const handleTagSelect = (selectedTag) => {
    // Only allow placeholder selection if we are in edit mode
    if (editModeTemplateId !== null) {
      if (!selectedTags.includes(selectedTag)) {
        setSelectedTags((prevTags) => [
          ...prevTags,
          selectedTag,
        ]);
      }
    }
  };
  
  const removeTag = (TagToRemove) => {
    // Remove the selected tag
    setSelectedTags((prevTags) => prevTags.filter((tag) => tag!== TagToRemove));
  };
 


 

  

  return (
    <>
    <div className=" p-6 md:p-7 mt-20 ">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-5 w-full">
        {/* Welcome Section */}
        <div className="w-full md:w-[60%] flex justify-between px-4 md:px-8 items-center h-auto bg-white rounded-xl">
            <p className="text-base md:text-xl font-medium">Templates</p>
           <div className='flex space-x-3 items-center'>
            <input
              type="checkbox"
              className="w-4 h-4 cursor-pointer"
              checked={selectAll}
              onChange={handleSelectAll}
            />
           <EllipsisVerticalIcon
              className="w-5 h-5 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div
              ref={dropdownRef}
               className="absolute left-[50%]  top-36 bg-white border rounded-lg shadow-lg z-10 w-[12%] ">
                <div
                  className="px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={deleteSelectedTemplates}
                >
                  Delete selected
                </div>
                <div
                  className="px-4 py-2 text-left text-sm hover:bg-gray-100 text-[#E50606]"
                  onClick={deleteAllTemplates}
                >
                  Delete all
                </div>
              </div>
            )}
            </div>
          </div>

        {/* Buttons Section */}
        <div className="w-full md:w-[40%] flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4">
          {/* Create Template Button */}
          <button
            onClick={handleTemplateModal}
            className="flex justify-center items-center rounded-lg bg-custom-radial w-full h-14 
           text-base md:text-lg font-bold tracking-wider text-white transition-all ease-in-out duration-500 
           hover:bg-[#C9F1FE80] hover:tracking-widest"
          >
            Create a template
            <PlusIcon className="w-7 h-7 text-white ml-2" />
          </button>

          {/* Write Button */}
          <button
            className="flex justify-center items-center border-2 tracking-wider md:border-4 border-[#1E95BB] md:w-[50%] h-14 bg-[#C9F1FE80]
           rounded-lg text-base md:text-lg font-bold text-[#1E95BB] transition-all ease-in-out duration-500 hover:text-white hover:bg-[#775ADA]"
          >
            Write
            <PencilSquareIcon className="w-7 h-7 ml-2" />
          </button>
        </div>
      </div>
      

      <div className=' flex space-x-4'>
      <div className="  bg-[#FFFFFF] rounded-xl mt-6 w-[60%]  md:space-x-4 py-4">
    
     {/* Conditional Rendering for Templates */}
      {templates.length > 0 ? (
    <div className='space-y-4'>
      {templates.map((template) => (
  <div
    key={template.id}
    className="border border-[#BABABA] bg-[#EDEDED] px-4 mx-6 rounded-xl space-y-12 lg:space-y-8 pb-4"
  >
    {/* Tag */}
    <div className="flex justify-between items-center mt-4">
      {/** droppable area */}
      {/* Meta Info */}
    <div className="text-[#4D4D4D] flex capitalize text-sm space-x-4">
      
      <p
      
        
        className="w-fit  rounded-full p-2 cursor-pointer transition-transform duration-300 ease-in-out"
      >
       {/* Display selected placeholders */}
       <div className="flex flex-wrap gap-2">
  {selectedTags.map((tag, index) => (
    <span
      key={index}
      className="flex items-center space-x-1 text-[#5943A3] bg-[#DDD6F6] px-3 py-1 rounded-full text-xs font-medium"
    >
    <div className='flex justify-between space-x-2 '>
    <BookmarkIcon className="h-4 w-4 text-[#5943A3]" />
      <p>{tag}</p>
    </div>
      {editModeTemplateId === template.id &&   (
        <XMarkIcon
          className="h-4 w-4 cursor-pointer"
          onClick={() => removeTag(tag)}
        />
      )}
    </span>
  ))}
  <div className='w-fit  p-1 rounded-full text-[#5943A3] bg-[#DDD6F6] cursor-pointer  hover:text-[#000000]'>
  {activeTagModalId === template.id ? (
    <XMarkIcon
      className="w-5 h-5  "
      onClick={() => handleTagModal(template.id)}
    />
  ) : (
    <PlusIcon
      className="w-5 h-5   "
      onClick={() => handleTagModal(template.id)}
    />
  )}
  </div>
</div>


 
      </p>
      <div className="text-xs text-[#999999] flex space-x-2 pt-3 ">
          <span className="italic">i</span>
          <p>Tap on the label to insert/add tag</p>
        </div>
     
    </div>
      {/** droppable area */}

      {editModeTemplateId !== template.id && (
        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer"
          checked={selectedTemplates[template.id] || false}
          onChange={() => handleTemplateCheckbox(template.id)}
        />
      )}
    </div>

    {/* Message */}
    {editModeTemplateId === template.id ? (
  <textarea
    value={editedTemplateMessage[template.id] || template.message}
    onChange={(e) =>
      setEditedTemplateMessage({
        ...editedTemplateMessage,
        [template.id]: e.target.value,
      })
    }
    className="w-full p-4 border border-gray-300 rounded-lg h-48 bg-white"
  />
) : (
  <div className="text-base text-[#4D4D4D] font-normal">
    
    {/* Render new lines properly */}
    <p>{template.message.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))}</p>
  </div>
)}


    {/* Meta Info */}
    <div className="text-[#4D4D4D] flex capitalize text-sm space-x-4">
      
      <p
      
        
        className="w-fit  rounded-full p-2 cursor-pointer transition-transform duration-300 ease-in-out"
      >
       {/* Display selected placeholders */}
       <div className="flex flex-wrap gap-2">
  {selectedPlaceholders.map((placeholder, index) => (
    <span
      key={index}
      className="flex items-center space-x-1 text-[#4D4D4D] bg-[#D9D9D9] px-3 py-1 rounded-full text-xs font-medium"
    >
      {placeholder}
      {editModeTemplateId === template.id &&   (
        <XMarkIcon
          className="h-4 w-4 cursor-pointer"
          onClick={() => removePlaceholder(placeholder)}
        />
      )}
    </span>
  ))}
  <div className='w-fit  p-1 rounded-full text-[#737373] cursor-pointer bg-[#D9D9D9] hover:text-[#000000]'>
  {activePlaceholderModalId === template.id ? (
    <XMarkIcon
      className="w-5 h-5  "
      onClick={() => handlePlaceholderModal(template.id)}
    />
  ) : (
    <PlusIcon
      className="w-5 h-5   "
      onClick={() => handlePlaceholderModal(template.id)}
    />
  )}
  </div>
</div>


 
      </p>
      <div className="text-xs text-[#999999] flex space-x-2 pt-3 ">
          <span className="italic">i</span>
          <p>Tap on the label to insert/add placeholder</p>
        </div>
     
    </div>

    {/* Footer */}
    <div className="flex justify-between items-center">
      <p className="text-[#4D4D4D] text-base font-normal">Cheers</p>
      <div className="flex space-x-8 relative">
        {/* Share Icon */}
        <ShareIcon
          onClick={() => handleShareModal(template.id)} // Open modal for specific template
          className="w-6 h-6 text-[#737373] cursor-pointer hover:text-[#000000]
           transition-transform duration-300 ease-in-out hover:scale-110"
        />

        {/* Copy to Clipboard Icon */}
        <Square2StackIcon
          onClick={() => handleCopyToClipboard(template.id)}
          className="w-6 h-6 text-[#737373] cursor-pointer hover:text-[#000000]
           transition-transform duration-300 ease-in-out hover:scale-110"
        />

        {/* Delete Icon */}
        <TrashIcon
          onClick={() => handleDeleteTemplate(template.id)}
          className="w-6 h-6 text-[#737373] cursor-pointer hover:text-[#000000] 
          transition-transform duration-300 ease-in-out hover:scale-110"
        />

        {/* Copied to Clipboard Message */}
        {copiedTemplateId === template.id && (
          <div className="absolute -top-10 right-0 bg-[#1E95BB] text-[#FFFFFF] text-sm w-max px-4 py-2 rounded-md shadow-md">
            Copied to clipboard!
          </div>
        )}

        {activeShareModalId === template.id && (
             <Share
             isOpen={true} // Modal is open for this template
              onClose={() => handleShareModal(null)} // Close modal
        />
           )}

            {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalTemplateId !== null}
        onClose={() => setDeleteModalTemplateId(null)}
        onConfirm={confirmDeleteTemplate}
        itemLabel="template"
      />

 {/* Add Tag modal */}
 {tagModal && activeTagModalId === template.id && (
 <TagsModal
            tagModal={tagModal}
            handleTagModal={handleTagModal}
            onTagSelect={handleTagSelect}
          />
      )}

  {/**Placeholder Modal */}
  {placeholderModal && activePlaceholderModalId === template.id && (
  <PlaceholderModal
    placeholderModal={placeholderModal}
    handlePlaceholderModal={handlePlaceholderModal}
    onPlaceholderSelect={handlePlaceholderSelect}
  />
)}


 </div>
</div>
    

    {/* Edit Mode: Save/Cancel and Icons */}
    {editModeTemplateId === template.id ? (
      <div className="flex justify-between items-center text-[#737373] pt-3">
        <div className="flex space-x-4">
          <BoldIcon className="w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110" />
          <ItalicIcon className="w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110" />
          <UnderlineIcon className="w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110" />
          <div className="border-l-2 h-7 border-[#737373]" />
          <ListBulletIcon className="w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110" />
          <NumberedListIcon className="w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110" />
          <div className="border-l-2 h-7 border-[#737373]" />
          <LinkIcon className="w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110" />
          <FaceSmileIcon className="w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110" />
        </div>
        <div className="space-x-4">
          <button
            onClick={() => setEditModeTemplateId(null)}
            className="w-fit py-2 px-5 bg-[#DDD6F6] text-[#1E1636] rounded-lg text-base transition-transform duration-300 ease-in-out hover:bg-[#BEB6E5] hover:scale-105 hover:shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSaveTemplate(template.id)}
            className="w-fit py-2 px-5 bg-[#775ADA] text-base text-[#FFFFFF] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#5F48C2] hover:scale-105 hover:shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={() => handleEditTemplate(template.id)}
          className="w-fit py-1 px-3 bg-[#775ADA] text-base text-[#FFFFFF] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#5F48C2] hover:scale-105 hover:shadow-md"
      >
        Edit
      </button>
    )}
  </div>
))}
</div> 
  ) : (
         //not available conditional rendering 
          <div className="flex flex-col items-center justify-center  space-y-6 h-screen">
          <p className="text-lg text-[#AAAAAA]">You have no recent templates yet</p>
            <Image
              src="/images/floating.png" 
              alt="No Templates Available"
              height={250}
              width={250}
              
            />
           
          </div>
        )}

       
      </div>
      <div className='w-[40%]'>
          <Tags />
          <Placeholder />
        </div>
      </div>
      </div>
      
     
      {/* Template Modal */}
      <Template templateModal={templateModal} handleTemplateModal={handleTemplateModal} />

      
      </>
  )
} 