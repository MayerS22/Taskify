import React from "react";
import { TrashIcon, ArrowRightIcon, ArrowLeftIcon, FolderIcon, CheckCircleIcon, RocketLaunchIcon, ClockIcon } from "@heroicons/react/24/solid";

export interface TaskCategoryCardProps {
  task: {
    id: number;
    title: string;
    category: string;
    status: 'todo' | 'in_progress' | 'completed';
  };
  onDelete: (id: number) => void;
  onMove: (id: number, direction: 'left' | 'right') => void;
  onEdit?: (task: any) => void;
  dragHandleProps?: React.HTMLAttributes<any>;
  dragAttributes?: React.HTMLAttributes<any>;
}

const statusLabel = (status: 'todo' | 'in_progress' | 'completed') => {
  switch (status) {
    case 'todo': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-500 text-white"><ClockIcon className="h-4 w-4" />To Do</span>;
    case 'in_progress': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500 text-white"><RocketLaunchIcon className="h-4 w-4" />In Progress</span>;
    case 'completed': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-600 text-white"><CheckCircleIcon className="h-4 w-4" />Done</span>;
    default: return null;
  }
};

const categoryBadgeColor = (category: string) => {
  switch (category) {
    case "Work": return "bg-blue-600";
    case "Personal": return "bg-green-600";
    case "Other": return "bg-purple-600";
    default: return "bg-gray-500";
  }
};

const categoryIcon = (category: string) => {
  switch (category) {
    case "Work": return <FolderIcon className="h-4 w-4 text-blue-200 mr-1" />;
    case "Personal": return <FolderIcon className="h-4 w-4 text-green-200 mr-1" />;
    case "Other": return <FolderIcon className="h-4 w-4 text-purple-200 mr-1" />;
    default: return <FolderIcon className="h-4 w-4 text-gray-200 mr-1" />;
  }
};

const TaskCategoryCard: React.FC<TaskCategoryCardProps> = ({ task, onEdit, dragHandleProps, dragAttributes }) => {
  return (
    <div
      className="relative bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 rounded-2xl shadow-2xl border border-neutral-700 p-6 flex flex-col gap-3 w-full min-w-[320px] max-w-[384px] transition-shadow hover:shadow-indigo-700/30 cursor-pointer"
      onClick={() => onEdit && onEdit(task)}
      tabIndex={0}
      role="button"
      aria-label={`Edit task: ${task.title}`}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && onEdit) { onEdit(task); } }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold text-white ${categoryBadgeColor(task.category)}`}>{categoryIcon(task.category)}{task.category}</span>
        {statusLabel(task.status)}
      </div>
      <div className="font-extrabold text-2xl text-white break-words">{task.title}</div>
      <div className="my-2 border-t border-neutral-700" />
      <div className="flex items-center gap-2 mt-1">
        {dragHandleProps && dragAttributes && (
          <div
            {...dragHandleProps}
            {...dragAttributes}
            className="cursor-grab p-2 rounded-full hover:bg-neutral-700 transition text-neutral-400 hover:text-indigo-400 focus:text-indigo-400 focus:bg-neutral-700"
            title="Drag"
            tabIndex={0}
            aria-label="Drag task"
            onClick={e => e.stopPropagation()}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" className="opacity-60"><circle cx="5" cy="6" r="1.5"/><circle cx="5" cy="10" r="1.5"/><circle cx="5" cy="14" r="1.5"/><circle cx="11" cy="6" r="1.5"/><circle cx="11" cy="10" r="1.5"/><circle cx="11" cy="14" r="1.5"/></svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCategoryCard; 