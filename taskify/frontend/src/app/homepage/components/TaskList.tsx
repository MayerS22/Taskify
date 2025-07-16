import React from "react";
import TaskCard, { Task } from "./TaskCard";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UniqueIdentifier } from '@dnd-kit/core';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  variant?: 'default' | 'mytasks' | 'dashboard';
  dnd?: boolean;
}

function SortableTaskCard({ task, ...props }: { task: Task; onEdit: (task: Task) => void; onDelete: (id: number) => void; onToggleComplete: (id: number) => void; variant: string; style: React.CSSProperties; }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id as UniqueIdentifier });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 50 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard {...props} task={task} />
    </div>
  );
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleComplete, variant = 'default', dnd }) => (
  <div className={variant === 'mytasks' ? "flex flex-col gap-8 w-full items-center" : "grid gap-4"}>
    {tasks.map((task) => (
      dnd && variant === 'mytasks' ? (
        <SortableTaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          variant={variant}
          style={{ maxWidth: '42rem', width: '100%' }}
        />
      ) : (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          variant={variant}
          {...(variant === 'mytasks' ? { style: { maxWidth: '42rem', width: '100%' } } : {})}
        />
      )
    ))}
    {tasks.length === 0 && (
      <div className="text-gray-400 text-center py-8 col-span-full">No tasks yet. Create your first task!</div>
    )}
  </div>
);

export default TaskList; 