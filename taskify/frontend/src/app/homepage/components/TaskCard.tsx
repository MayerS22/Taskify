import React from "react";
import { CheckCircleIcon, TrashIcon, PencilSquareIcon, ClockIcon, RocketLaunchIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";

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
    case "Work": return <RocketLaunchIcon className="h-4 w-4 mr-1 text-blue-200" />;
    case "Personal": return <CheckBadgeIcon className="h-4 w-4 mr-1 text-green-200" />;
    case "Other": return <ClockIcon className="h-4 w-4 mr-1 text-purple-200" />;
    default: return null;
  }
};

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'todo' | 'in_progress' | 'completed';
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  variant?: 'default' | 'mytasks' | 'dashboard';
  style?: React.CSSProperties;
}

const statusBadge = (status: Task["status"]) => {
  switch (status) {
    case "todo": return <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-gray-500 text-white flex items-center gap-1"><ClockIcon className="h-4 w-4 inline" />To Do</span>;
    case "in_progress": return <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-yellow-500 text-white flex items-center gap-1"><RocketLaunchIcon className="h-4 w-4 inline" />In Progress</span>;
    case "completed": return <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-green-600 text-white flex items-center gap-1"><CheckCircleIcon className="h-4 w-4 inline" />Completed</span>;
    default: return null;
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleComplete, variant = 'default', style }) => {
  if (variant === 'mytasks') {
    return (
      <div
        className="relative group bg-gradient-to-br from-neutral-800 via-neutral-900 to-black rounded-2xl shadow-2xl border border-neutral-700 p-6 transition-transform transform hover:scale-[1.025] hover:shadow-indigo-700/30 flex flex-col gap-3 min-w-[320px] w-full cursor-pointer"
        style={style}
        onClick={() => onEdit(task)}
        tabIndex={0}
        role="button"
        aria-label={`Edit task: ${task.title}`}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onEdit(task); }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold text-white ${categoryBadgeColor(task.category)}`}>{categoryIcon(task.category)}{task.category}</span>
          {statusBadge(task.status)}
        </div>
        <div className={`font-extrabold text-2xl ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-white'}`}>{task.title}</div>
        {task.description && <div className="text-gray-300 text-base whitespace-pre-line break-words">{task.description}</div>}
        <div className="flex items-center gap-3 mt-2">
          <button
            className="p-2 rounded-full border border-indigo-700 bg-indigo-600 hover:bg-indigo-700 text-white transition shadow"
            onClick={e => { e.stopPropagation(); onEdit(task); }}
            title="Edit"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-full border border-red-700 bg-red-600 hover:bg-red-700 text-white transition shadow"
            onClick={e => { e.stopPropagation(); onDelete(task.id); }}
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-full border ${task.status === 'completed' ? 'border-green-700 bg-green-600' : 'border-gray-700 bg-gray-600'} hover:bg-green-700 text-white transition shadow`}
            onClick={e => { e.stopPropagation(); onToggleComplete(task.id); }}
            title={task.status === 'completed' ? "Mark as To Do" : "Mark as Completed"}
          >
            <CheckCircleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }
  // Default card (dashboard and other places)
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-800 rounded-xl shadow-lg p-4 border border-neutral-700 transition group min-h-[64px] cursor-pointer hover:scale-[1.015] hover:shadow-indigo-700/20 duration-200"
      style={style}
      onClick={() => onEdit(task)}
      tabIndex={0}
      role="button"
      aria-label={`Edit task: ${task.title}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onEdit(task); }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white ${categoryBadgeColor(task.category)}`}>{task.category}</span>
          {statusBadge(task.status)}
        </div>
        <div className={`font-bold text-base truncate ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-white'}`}>{task.title}</div>
        {task.description && <div className="text-gray-300 text-xs truncate mt-0.5">{task.description}</div>}
      </div>
      <div className="flex items-center gap-2 mt-1 sm:mt-0 sm:ml-4">
        <button
          className="p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition"
          onClick={e => { e.stopPropagation(); onEdit(task); }}
          title="Edit"
        >
          <PencilSquareIcon className="h-4 w-4" />
        </button>
        <button
          className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
          onClick={e => { e.stopPropagation(); onDelete(task.id); }}
          title="Delete"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
        <button
          className={`p-1.5 rounded-full ${task.status === 'completed' ? 'bg-green-600' : 'bg-gray-600'} hover:bg-green-700 text-white transition`}
          onClick={e => { e.stopPropagation(); onToggleComplete(task.id); }}
          title={task.status === 'completed' ? "Mark as To Do" : "Mark as Completed"}
        >
          <CheckCircleIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard; 