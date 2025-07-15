import React from "react";
import TaskCard, { Task } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleComplete }) => (
  <div className="grid gap-4">
    {tasks.map(task => (
      <TaskCard
        key={task.id}
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
      />
    ))}
    {tasks.length === 0 && (
      <div className="text-gray-400 text-center py-8">No tasks yet. Create your first task!</div>
    )}
  </div>
);

export default TaskList; 