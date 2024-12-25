"use client"
import { FaceSmileIcon, LinkIcon, Square2StackIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon, BoldIcon, ItalicIcon, ListBulletIcon, NumberedListIcon, PlusCircleIcon, PlusIcon, UnderlineIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React,  { useEffect, useRef, useState } from 'react'
import TagsModal from './TagsModal';
import PlaceholderModal from './PlaceholderModal';
import WritingStylesModal from './WritingStylesModal';

const Template = ({templateModal, handleTemplateModal}) => {
  
    const [tag, setTag] = useState("");
    const [message, setMessage] = useState("");
    const [tagModal, setTagModal] = useState(false);
    const [placeholderModal, setPlaceholderModal] = useState(false);
    const [stylesModal, setStylesModal] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState(null); // Selected style state
    const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State for confirmation modal
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]); // State to store selected tags
    const [selectedPlaceholders, setSelectedPlaceholders] = useState([]); // State to store selected tags
    

   

    //Function to handle the add tag modal
    const handleTagModal = () => {
     setTagModal(!tagModal);
   }
    
   
   //Function to handle the add placeholder modal
   const handlePlaceholderModal = () => {
    setPlaceholderModal(!placeholderModal);
  }

  
  //Function to handle the add Writing style modal
  const handleStylesModal = () => {
   setStylesModal(!stylesModal);
 }



 const handleStyleSelect = (style) => {
  setSelectedStyle(style);
  setStylesModal(false); // Close modal after selection
};


const handleCreate = () => {
  // Close the current modal and show confirmation modal
  handleTemplateModal(); // Close the template modal
  setShowConfirmationModal(true); // Show confirmation modal

  // Set a timeout to hide the confirmation modal after 3 seconds
  setTimeout(() => {
    setShowConfirmationModal(false); // Hide the confirmation modal after 3 seconds
  }, 1500); 
};
   

const handleCopyToClipboard = () => {
  const textToCopy = "Sample text to copy"; // Replace with your desired text
  navigator.clipboard.writeText(textToCopy).then(() => {
    setShowCopiedMessage(true); // Show "Copied to clipboard" message

    
     // Hide the message after 2 seconds
     setTimeout(() => {
      setShowCopiedMessage(false);
    }, 2000);
    
    
   
    
  })
 };

 const handleTagSelect = (selectedTag) => {
  // Add tag if not already selected
  if (!selectedTags.includes(selectedTag)) {
    setSelectedTags((prevTags) => [...prevTags, selectedTag]);
  }
};

const removeTag = (tagToRemove) => {
  // Remove the selected tag
  setSelectedTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
};

const handlePlaceholderSelect = (selectedPlaceholder) => {
  // Add tag if not already selected
  if (!selectedPlaceholders.includes(selectedPlaceholder)) {
    setSelectedPlaceholders((prevPlaceholders) => [...prevPlaceholders, selectedPlaceholder]);
  }
};

const removePlaceholder = (placeholderToRemove) => {
  // Remove the selected tag
  setSelectedPlaceholders((prevPlaceholders) => prevPlaceholders.filter((placeholder) => placeholder!== placeholderToRemove));
};
    return (
    <>
    {/* Modal for adding new address */}
    <div
    
      className={`${
        templateModal == false ? "hidden opacity-0" : "opacity-100" // Conditional rendering of modal based on addAddressModal prop
      } fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-60 z-[1000] `}
    >
      {/* Modal content */}
      <div
      
       className="bg-white w-[60%] h-[98%] overflow-y-auto  rounded-2xl">
        {/* Modal header */}
        <div className="flex justify-between px-7 py-3">
       
          <p className="font-bold text-lg text-[#000000] tracking-wider">Create a new template</p>
        
        <XMarkIcon
        onClick={handleTemplateModal}
         className='h-6 w-6 cursor-pointer' />
      </div>

      {/* Divider */}
      <div className="border-t-4 w-full border-[#EDEDED] " />
        <div className='px-7 mt-6 '>
        {/* Template input field */}
        <div className='border-[#DEDEDE] bg-[#F5F5F5] border-2 w-full rounded-xl p-6 space-y-6 '>
        <div className="space-y-2">
        
                <p className="text-sm text-[#000] font-medium">
                  Create a tag or add from previously created tags
                </p>
                <div className='flex justify-between space-x-4'>
  <div
    className="flex items-center space-x-2 border bg-white border-[#BABABA] h-12 w-[93%] rounded-lg px-3 overflow-x-auto "
    onClick={handleTagModal}
  >
    {/* Display selected tags as badges */}
    {selectedTags.map((tag, index) => (
      <span
        key={index}
        className="flex items-center space-x-1 text-[#5943A3] bg-[#DDD6F6] px-3 py-1 rounded-full text-xs font-medium"
      >
        {tag}
        <XMarkIcon
          className="h-4 w-4 cursor-pointer text-[#5943A3]"
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal from toggling
            removeTag(tag);
          }}
        />
      </span>
    ))}

    {/* Input field for adding new tags */}
    <input
      type="text"
      placeholder="Enter tag name"
      className="outline-none border-none text-sm text-gray-600"
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.value.trim() !== "") {
          const newTag = e.target.value.trim();
          if (!selectedTags.includes(newTag)) {
            setSelectedTags((prevTags) => [...prevTags, newTag]);
          }
          e.target.value = ""; // Clear input field
        }
      }}
    />
  </div>
  <div
    className="bg-[#DDD6F6] w-fit h-fit rounded-full p-2 cursor-pointer"
    onClick={handleTagModal}
  >
    <div
      className={`w-7 h-7 text-[#5943A3] transition-transform duration-300 ease-in-out ${
        tagModal ? "rotate-180" : "rotate-0"
      }`}
    >
      {tagModal ? <XMarkIcon /> : <PlusIcon />}
    </div>
  </div>
</div>

                </div>
            

                <div className="space-y-2 ">
  <p className="text-sm text-[#000] font-medium">Write message content</p>
  <div className='flex space-x-4'>
  <div className="flex flex-col space-y-2 border bg-white border-[#BABABA] w-[93%] rounded-lg px-3 py-2 h-52 overflow-y-auto">
    {/* Display selected placeholders */}
    <div className="flex flex-wrap gap-2">
      {selectedPlaceholders.map((placeholder, index) => (
        <span
          key={index}
          className="flex items-center space-x-1 text-[#4D4D4D] bg-[#D9D9D9] px-3 py-1 rounded-full text-xs font-medium w-fit"
        >
          {placeholder}
          <XMarkIcon
            className="h-4 w-4 cursor-pointer"
            onClick={() => removePlaceholder(placeholder)}
          />
        </span>
      ))}
    </div>

    {/* Textarea for adding new placeholders */}
    <textarea
      placeholder="Write content here, use the plus icon to add placeholders while writing"
      className="outline-none border-none text-sm text-black w-full mt-2 focus:outline-none focus:ring-0 focus:text-black"
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.value.trim() !== "") {
          e.preventDefault(); // Prevent newline in textarea
          const newPlaceholder = e.target.value.trim();
          if (!selectedPlaceholders.includes(newPlaceholder)) {
            setSelectedPlaceholders((prev) => [...prev, newPlaceholder]);
          }
          e.target.value = ""; // Clear textarea
        }
      }}
    ></textarea>
  </div>
  <div
    className="bg-[#DDD6F6] w-fit h-fit rounded-full p-2 cursor-pointer"
    onClick={handlePlaceholderModal}
  >
    <div
      className={`w-7 h-7 text-[#5943A3] transition-transform duration-300 ease-in-out ${
        placeholderModal ? "rotate-180" : "rotate-0"
      }`}
    >
      {placeholderModal ? <XMarkIcon /> : <PlusIcon />}
    </div>
  </div>
  </div>
</div>


            <div  className='flex justify-between text-[#737373]  md:w-[92%] '>
            <div className='flex space-x-4'>
            <BoldIcon className='w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110'/>
            <ItalicIcon  className='w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
            <UnderlineIcon  className='w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
            <div className='border-l-2 h-8 border-[#737373]'/>
            <ListBulletIcon className='w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
             <NumberedListIcon className='w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
             <div className='border-l-2 h-8 border-[#737373]'/>
             <LinkIcon  className='w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110 '/>
             <FaceSmileIcon className='w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110 '/>

            </div>

            <div className='flex space-x-4 relative'>
                <ArrowUturnLeftIcon className='w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
                <ArrowUturnRightIcon className='w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110'/>
                <Square2StackIcon
                 onClick={handleCopyToClipboard}
                  className="w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110"

                />
                <TrashIcon
                  className="w-6 h-6 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110 " />
                    {/* Copied to Clipboard Message */}
       {showCopiedMessage && (
        <div className="absolute -top-10 left-0 bg-[#1E95BB] text-[#FFFFFF] text-sm w-max px-4 py-2 rounded-md shadow-md">
        Copied to clipboard!
        </div>
      )}
            </div>
            
            </div>
           
        </div>
        </div>
       
        <div className="mt-6 flex justify-between  px-7">
  <div>
    {/* Gradient Text Button */}
    <button
  onClick={handleStylesModal}
  className="border-2 border-blue-700 w-fit py-2 px-6 rounded-full transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
>
  <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#775ADA] to-[#1E95BB] text-base">
    <span className={selectedStyle ? "font-semibold" : ""}>
      {selectedStyle ? `Writing style: ${selectedStyle}` : "Change writing style with AI"}
    </span>
  </p>
</button>

  </div>

  <div className="space-x-10">
    {/* Cancel Button */}
    <button
    onClick={handleTemplateModal}
     className="w-fit py-3 px-7 bg-[#DDD6F6] text-[#1E1636] rounded-lg text-base transition-transform duration-300 ease-in-out hover:bg-[#BEB6E5] hover:scale-105 hover:shadow-md">
      Cancel
    </button>

    {/* Create Button */}
    <button
    onClick={handleCreate}
     className="w-fit py-3 px-7 bg-[#775ADA] text-base text-[#FFFFFF] rounded-lg transition-transform duration-300 ease-in-out
      hover:bg-[#5F48C2] hover:scale-105 hover:shadow-md">
      Create
    </button>
  </div>
</div>

      </div>
    </div>
      {/* Add Tag modal */}
      <TagsModal
            tagModal={tagModal}
            handleTagModal={handleTagModal}
            onTagSelect={handleTagSelect}
          />

{placeholderModal && (
            <PlaceholderModal
              placeholderModal={placeholderModal}
              handlePlaceholderModal={handlePlaceholderModal}
              onPlaceholderSelect={handlePlaceholderSelect}
            />
          )}
   
   
   
     {/* Writing Styles Modal */}
     <WritingStylesModal
        stylesModal={stylesModal}
        handleStylesModal={handleStylesModal}
        onStyleSelect={handleStyleSelect} // Pass handler to capture selected style
      />

       {/* Confirmation template Modal */}
       {showConfirmationModal && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-60 z-[1000]"
        >
          <div className="bg-green-700 w-[20%] p-5 rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-base text-center font-semibold text-[#FFFFFF]">Template created </p>
            
          </div>
        </div>
      )}

     
  </>
    )
}

export default Template
