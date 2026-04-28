"use client";


export default function LogoutModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-[#1E1636] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <h2 className="text-base font-semibold text-white leading-snug">
            Log out of Telygence AI
          </h2>
        </div>

        <div className="border-t border-[#3B2D6D]" />

        {/* Body */}
        <div className="px-6 py-6 text-center">
          <p className="text-sm text-[#C4B8F5] leading-relaxed">
            Are you sure you want to log out of your account?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6 justify-center">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-[#3B2D6D] text-[#DDD6F6] rounded-xl text-sm font-medium
                       hover:bg-[#4A3A85] transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#775ADA] text-white rounded-xl text-sm font-medium
                       hover:bg-[#5F48C2] transition-colors duration-200"
          >
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );
}