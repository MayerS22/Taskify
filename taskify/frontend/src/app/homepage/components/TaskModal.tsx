import React, { useRef, useEffect } from "react";
import { XMarkIcon, PlusCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

interface TaskModalProps {
  open: boolean;
  mode: "create" | "edit";
  form: { title: string; description: string; category: string; status: 'todo' | 'in_progress' | 'completed' };
  setForm: (form: { title: string; description: string; category: string; status: 'todo' | 'in_progress' | 'completed' }) => void;
  formError: string;
  setFormError: (err: string) => void;
  categories: string[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, mode, form, setForm, formError, setFormError, categories, onClose, onSubmit }) => {
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
        className="bg-neutral-900 rounded-2xl shadow-2xl p-0 w-full max-w-md relative animate-modalIn border border-neutral-800"
        style={{ minWidth: 320 }}
      >
        <div className="h-2 w-full bg-indigo-600 rounded-t-2xl" />
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-neutral-800"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="p-8 pt-4">
          <h2 className="text-2xl font-extrabold mb-4 text-white flex items-center gap-2">
            {mode === "edit" ? (
              <><PencilSquareIcon className="h-7 w-7 text-indigo-500" /> Edit Task</>
            ) : (
              <><PlusCircleIcon className="h-7 w-7 text-indigo-500" /> Create New Task</>
            )}
          </h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-200 font-semibold mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder-gray-400"
                placeholder="Task title"
                value={form.title}
                onChange={e => { setForm({ ...form, title: e.target.value }); setFormError(""); }}
                required
              />
              {formError && <div className="text-red-400 text-sm mt-1">{formError}</div>}
            </div>
            <div>
              <label className="block text-gray-200 font-semibold mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder-gray-400"
                placeholder="Task description (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-gray-200 font-semibold mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-200 font-semibold mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as 'todo' | 'in_progress' | 'completed' })}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400 text-white px-4 py-2 rounded-xl font-bold focus:outline-none focus:ring-2 transition text-lg mt-2"
            >
              {mode === "edit" ? <><PencilSquareIcon className="h-5 w-5" /> Save Changes</> : <><PlusCircleIcon className="h-5 w-5" /> Add Task</>}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-modalIn { animation: modalIn 0.2s cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>
    </div>
  );
};

export default TaskModal; 