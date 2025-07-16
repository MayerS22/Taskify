import React from "react";
import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

const categoryBadgeColor = (category: string) => {
  switch (category) {
    case "Work": return "bg-blue-600";
    case "Personal": return "bg-green-600";
    case "Other": return "bg-purple-600";
    default: return "bg-gray-500";
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
}

const statusBadge = (status: Task["status"]) => {
  switch (status) {
    case "todo": return <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-gray-500 text-white">To Do</span>;
    case "in_progress": return <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-yellow-500 text-white">In Progress</span>;
    case "completed": return <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-green-600 text-white">Completed</span>;
    default: return null;
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleComplete }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-800 rounded-xl shadow-lg p-4 border border-neutral-700 hover:shadow-2xl transition group">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white ${categoryBadgeColor(task.category)}`}>{task.category}</span>
        {statusBadge(task.status)}
      </div>
      <div className={`font-bold text-lg truncate ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-white'}`}>{task.title}</div>
      {task.description && <div className="text-gray-300 text-sm truncate">{task.description}</div>}
    </div>
    <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
      <button
        className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition"
        onClick={() => onEdit(task)}
        title="Edit"
      >
        <PencilSquareIcon className="h-5 w-5" />
      </button>
      <button
        className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
        onClick={() => onDelete(task.id)}
        title="Delete"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
      <button
        className={`p-2 rounded-full ${task.status === 'completed' ? 'bg-green-600' : 'bg-gray-600'} hover:bg-green-700 text-white transition`}
        onClick={() => onToggleComplete(task.id)}
        title={task.status === 'completed' ? "Mark as To Do" : "Mark as Completed"}
      >
        <CheckCircleIcon className="h-5 w-5" />
      </button>
    </div>
  </div>
);

export default TaskCard; 