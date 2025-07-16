import React from "react";
import TaskCard, { Task } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  variant?: 'default' | 'mytasks' | 'dashboard';
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleComplete, variant = 'default' }) => (
  <div className={variant === 'mytasks' ? "flex flex-col gap-8 w-full items-center" : "grid gap-4"}>
    {tasks.map(task => (
      <TaskCard
        key={task.id}
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        variant={variant}
        {...(variant === 'mytasks' ? { style: { maxWidth: '42rem', width: '100%' } } : {})}
      />
    ))}
    {tasks.length === 0 && (
      <div className="text-gray-400 text-center py-8 col-span-full">No tasks yet. Create your first task!</div>
    )}
  </div>
);

export default TaskList; 