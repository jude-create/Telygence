export function DiscardModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-200 rounded-lg w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-4 pb-2 text-center">
          <h2 className="text-base font-semibold">New draft</h2>
        </div>
        <div className="border-t border-[#737373]" />
        <div className="px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Are you sure you want to discard the current draft and create a new one?
          </p>
        </div>
        <div className="flex justify-center gap-4 px-6 pb-5">
          <button onClick={onCancel} className="px-5 py-2 bg-[#D9D9D9] rounded-md text-sm hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-7 py-2 bg-[#775ADA] text-white rounded-md text-sm hover:bg-[#5F48C2] transition-colors">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreatingModal() {
  return (
    <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-72 text-center">
        <h2 className="text-base font-semibold">Creating new draft...</h2>
        <div className="mt-3 flex justify-center">
          <div className="w-5 h-5 border-2 border-[#775ADA] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
