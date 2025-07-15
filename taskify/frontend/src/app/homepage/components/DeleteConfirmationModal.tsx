import React, { useRef, useEffect } from "react";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ open, onClose, onConfirm }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (open && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        ref={modalRef}
        className="bg-neutral-900 rounded-2xl shadow-2xl p-0 w-full max-w-sm relative animate-modalIn border border-neutral-800"
        style={{ minWidth: 280 }}
      >
        <div className="h-2 w-full bg-red-600 rounded-t-2xl" />
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 bg-neutral-800"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="p-8 pt-4 flex flex-col items-center">
          <ExclamationTriangleIcon className="h-10 w-10 text-red-500 mb-2" />
          <h2 className="text-xl font-extrabold mb-2 text-white text-center">Delete Task?</h2>
          <p className="text-gray-300 text-center mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
          <div className="flex gap-4 w-full justify-center">
            <button
              className="px-4 py-2 rounded-xl font-bold bg-neutral-700 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-modalIn { animation: modalIn 0.2s cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>
    </div>
  );
};

export default DeleteConfirmationModal; 