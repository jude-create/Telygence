"use client"
import { ArchiveBoxIcon, FaceSmileIcon, LinkIcon, PrinterIcon, TrashIcon,  StarIcon as StarOutlineIcon, PencilSquareIcon, } from '@heroicons/react/24/outline';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon, BoldIcon, ChevronDownIcon, ChevronUpIcon, ItalicIcon, ListBulletIcon, NumberedListIcon, PlusIcon, UnderlineIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { RecentDraft } from '../components/RecentDraft';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

export default function Drafts()  {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isStarred, setIsStarred] = useState(false); // State to track star status
  const [deleteModalDraftId, setDeleteModalDraftId] = useState(null);
  const [status, setStatus] = useState("");
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isCreatingNewModalOpen, setIsCreatingNewModalOpen] = useState(false);
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


  const toggleStarDraft2= () => {
    setIsStarred(!isStarred); // Toggle the star status
  };

  const handleCreateDraft = () => {
    setIsDiscardModalOpen(true); // Open discard modal
  };

  const confirmDiscardDraft = () => {
    setIsDiscardModalOpen(false); // Close discard modal
    setIsCreatingNewModalOpen(true); // Open creating new modal

    // Simulate new draft creation
    setTimeout(() => {
      setIsCreatingNewModalOpen(false); // Close creating new modal
      console.log("New draft created!");
    }, 2000); // Adjust timing as needed
  };
  

  return (
    <>
    <div className="h-fit p-6 md:p-7 mt-20 ">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-5 w-full">
        {/* Welcome Section */}
        <div className="w-full md:w-[80%] flex justify-between px-4 md:px-8 items-center h-auto bg-white rounded-xl">
            <p className="text-base md:text-xl font-medium">Drafts</p>
           <div>
            <p className='text-[#8093A8] text-sm'>Saving...</p>
           </div>
          </div>

        {/* Buttons Section */}
        <div className="w-full md:w-[20%] flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4">
          {/* Create Template Button */}
          <button
           onClick={handleCreateDraft}
            className="flex justify-center items-center rounded-lg bg-custom-radial w-full h-14 
           text-base md:text-lg font-bold tracking-wider text-white transition-all ease-in-out duration-500 
           hover:bg-[#C9F1FE80] hover:tracking-widest"
          >
           draft
            <PlusIcon className="w-7 h-7 text-white ml-2" />
          </button>

         
        </div>
      </div>
      
      <div className='p-5 border bg-white w-full  mt-4 rounded-lg'>
       <div className=' flex space-x-7 items-center '>
          <div>
            <input 
              className=" border border-[#BABABA] h-10 rounded-lg px-4 placeholder:text-sm placeholder:font-light text-base tracking-wider"
                    placeholder="Enter title here..."
                    type='text'
                   value={title}
                  onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          
          
            <div className='flex space-x-6 text-[#737373] mt-3'>
            <ArrowUturnLeftIcon className='w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
            <ArrowUturnRightIcon className='w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110'/>
            <PrinterIcon
              title='Print(Ctrl + P)'
             className='w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
            <div className='border-l-2 h-7 border-[#737373]'/>
            <BoldIcon
            title='Bold(Ctrl + B)'
             className='w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110'/>
            <ItalicIcon 
            title='Italic(Ctrl + I)'
             className='w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
            <UnderlineIcon
            title='Underline(Ctrl + U)'
              className='w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
            <div className='border-l-2 h-7 border-[#737373]'/>
            <ListBulletIcon
            title='Bullet(Ctrl + -)'
             className='w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
             <NumberedListIcon
             title='Number(Ctrl + 1)'
              className='w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110' />
             <div className='border-l-2 h-7 border-[#737373]'/>
             <LinkIcon
             title='Insert link(Ctrl + K)'
               className='w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110 '/>
             <FaceSmileIcon
             title='Add emoji'
              className='w-5 h-5 cursor-pointer hover:text-[#000000] transition-transform duration-300 ease-in-out hover:scale-110 '/>
            </div>

            <div className='flex space-x-4'>
             <div className=" "> 
              <div
                className="w-full h-10 border border-[#999999] rounded-lg py-1 px-4 flex justify-center  items-center space-x-14 cursor-pointer"
                onClick={() => setShowFontDropdown(!showFontDropdown)}
              >
                <p>Sora</p>
                {showFontDropdown ? (
                  <ChevronUpIcon className="h-5 w-5 text-[#262626] font-bold" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-[#262626] font-bold" />
                )}
              </div>
              
            </div>

            <div className=" "> 
              <div
                className="w-full h-10 border border-[#999999] rounded-lg py-1 px-2 flex justify-center items-center space-x-2 cursor-pointer"
                onClick={() => setShowSizeDropdown(!showSizeDropdown)}
              >
                <p>15</p>
                {showSizeDropdown ? (
                  <ChevronUpIcon className="h-5 w-5 text-[#262626] font-bold" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-[#262626] font-bold" />
                )}
              </div>
              
              </div>
       
       </div>

       </div>
       <div className=' mt-5'>
       <textarea
                      className="w-full border border-[#EDEDED] bg-white md:h-[500px] rounded-lg p-4 placeholder:text-sm 
                      placeholder:font-light text-base resize-none  "
                    placeholder="Start writing..."
                    type='text'
                   value={message}
                  onChange={(e) => setMessage(e.target.value)} 

                   />
            </div>

            <div className='px-7 flex justify-between bg-white mt-3'>
            <div>
    {/* Gradient Text Button */}
    <button
  
  className="border-2 border-blue-700 w-fit py-2 px-5 rounded-full transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
>
  <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#775ADA] to-[#1E95BB] text-base">
  Auto-complete with AI
  </p>
</button>

  </div>
   
   <div className='flex space-x-6 '>
   
                {isStarred ? (
                  <StarSolidIcon
                    onClick={toggleStarDraft2}
                    className="h-5 w-5 text-[#FF304F] cursor-pointer"
                  />
                ) : (
                  <StarOutlineIcon
                    onClick={toggleStarDraft2}
                    className="h-5 w-5 text-[#737373]  cursor-pointer"
                  />
                )}
                <ArchiveBoxIcon className="h-5 w-5 text-[#737373] cursor-pointer" />
                <TrashIcon
                  onClick={handleDeleteDraft}
                  className="h-5 w-5 text-[#737373] cursor-pointer"
                />
   </div>

            </div>
     
      </div>
      
      <div className="h-auto w-full bg-[#FFFFFF] rounded-xl mt-5 space-y-5 pb-10">
      {/* Header Section */}
      <div className="flex justify-between px-8 pt-5 relative">
        <div className="flex space-x-2 items-center">
         
          <p className="font-light text-base text-[#001C3D]">Recent</p>
          <div
          className='cursor-pointer'
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
          {showStatusDropdown ? (
                  <ChevronUpIcon className="h-5 w-5 text-[#262626] font-bold" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-[#262626] font-bold" />
                )}
                </div>
                </div>
                {showStatusDropdown && (
                <div className="w-[12%] bg-white border border-gray-300 rounded-lg shadow-md absolute left-5 top-14  z-50">
                  {["Starred", "Archived"].map((item) => (
                    <p
                      key={item}
                      className="px-4 py-2 hover:bg-gray-300  cursor-pointer"
                      onClick={() => {
                        setStatus(item);
                        setShowStatusDropdown(false);
                      }}
                    >
                      {item}
                    </p>
                  ))}
        </div>
      )}
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
    </div>
      
    {/* Discard Confirmation Modal */}
    {isDiscardModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-gray-200 rounded-lg  space-y-4 w-[25%]">
          <div className='px-6 pt-2'>
            <h2 className="text-lg font-semibold text-center">New draft</h2>
            </div>
      <div className="border-t w-full border-[#737373] mb-5" />
      <div className='px-6 '>
            <p className="text-base text-gray-600 text-center ">
            Are you sure you want to discard current draft and a create new one?
            </p>
           </div>
            <div className="flex  space-x-7 p-6 items-center justify-center">
              <button
                onClick={() => setIsDiscardModalOpen(false)}
                className="px-4 py-2 bg-[#D9D9D9] rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDiscardDraft}
                className="px-7 py-2 bg-[#775ADA] text-white rounded-md hover:bg-[#775ADA]/70"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creating New Draft Modal */}
      {isCreatingNewModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-96">
            <h2 className="text-lg font-semibold text-center ">Creating new... </h2>
          </div>
        </div>
      )}
   
      
      </>
  )
}
