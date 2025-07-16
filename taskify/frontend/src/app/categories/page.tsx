"use client";
import React, { useEffect, useState } from "react";
import { getProfile, getTasksByState, createTask, updateTask } from "../api";
import { Task } from "../homepage/components/TaskCard";
import TaskCard from "../homepage/components/TaskCard";
import TaskModal from "../homepage/components/TaskModal";
import NotificationToast from "../homepage/components/NotificationToast";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Work", "Personal", "Other"];
const STATES = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Done' },
];

function SortableTaskCard({ task, ...props }: { task: Task; onEdit: any; onDelete: any; onToggleComplete: any; variant: string; dnd?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} {...props} />
    </div>
  );
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={isOver ? 'bg-neutral-800/80' : ''} style={{ minHeight: 200 }}>
      {children}
    </div>
  );
}

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tasksByState, setTasksByState] = useState<{ todo: Task[]; in_progress: Task[]; completed: Task[] }>({ todo: [], in_progress: [], completed: [] });
  const [modalState, setModalState] = useState<{ open: boolean; status: 'todo' | 'in_progress' | 'completed' }>({ open: false, status: 'todo' });
  const [form, setForm] = useState({ title: "", description: "", category: CATEGORIES[0], status: 'todo' as 'todo' | 'in_progress' | 'completed' });
  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error'; open: boolean }>({ message: '', type: 'success', open: false });
  const sensors = useSensors(useSensor(PointerSensor));
  const currentTab: string = 'categories';
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getProfile(token);
        setUser(data);
        const grouped = await getTasksByState(token);
        setTasksByState(grouped);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndTasks();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type, open: true });
    setTimeout(() => setNotification(n => ({ ...n, open: false })), 2000);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Title is required");
      return;
    }
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");
      const newTask = await createTask(form, token);
      setTasksByState(prev => ({
        ...prev,
        [modalState.status]: [newTask, ...prev[modalState.status]],
      }));
      setForm({ title: "", description: "", category: CATEGORIES[0], status: modalState.status });
      setModalState({ open: false, status: modalState.status });
      setFormError("");
      showNotification("Task added successfully", "success");
    } catch (err) {
      setFormError("Failed to create task");
    }
  };

  // DnD handler for moving between columns
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const allTaskIds = Object.values(tasksByState).flat().map(t => t.id);
    let toState = null;
    if (['todo', 'in_progress', 'completed'].includes(over.id)) {
      toState = over.id;
    } else if (allTaskIds.includes(over.id)) {
      // Find which column the task is in
      toState = Object.keys(tasksByState).find(state => tasksByState[state as keyof typeof tasksByState].some(t => t.id === over.id));
    }
    const fromState = Object.keys(tasksByState).find(state => tasksByState[state as keyof typeof tasksByState].some(t => t.id === active.id));
    if (!fromState || !toState) return;
    const task = tasksByState[fromState as keyof typeof tasksByState].find(t => t.id === active.id);
    if (!task) return;
    if (fromState !== toState) {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Not authenticated");
        const updated = await updateTask(task.id, { ...task, status: toState }, token);
        setTasksByState(prev => ({
          ...prev,
          [fromState]: prev[fromState as keyof typeof prev].filter(t => t.id !== task.id),
          [toState]: [updated, ...prev[toState as keyof typeof prev]],
        }));
        showNotification("Task state updated", "success");
      } catch {
        showNotification("Failed to update task state", "error");
      }
    } else if (fromState === toState && over.id !== active.id) {
      // Reorder within the same column
      const oldIndex = tasksByState[fromState as keyof typeof tasksByState].findIndex(t => t.id === active.id);
      const newIndex = tasksByState[fromState as keyof typeof tasksByState].findIndex(t => t.id === over.id);
      setTasksByState(prev => ({
        ...prev,
        [fromState]: arrayMove(prev[fromState as keyof typeof prev], oldIndex, newIndex),
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userInitials = user && user.firstName && user.lastName ? user.firstName[0] + user.lastName[0] : "?";

  return (
    <div className="min-h-screen flex bg-black">
      <NotificationToast message={notification.message} type={notification.type} open={notification.open} />
      {/* Sidebar (reuse from tasks page) */}
      <aside className="w-64 bg-neutral-900 shadow-2xl flex flex-col justify-between h-screen fixed left-0 top-0 z-20 border-r border-neutral-800">
        <div>
          <div className="flex flex-col items-center gap-2 pt-8 pb-6 border-b border-neutral-800">
            {user && user.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-blue-800 shadow profile-anim transition-transform duration-200" />
            ) : (
              <span className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-extrabold text-white bg-indigo-600 border-4 border-indigo-800 shadow select-none profile-anim transition-transform duration-200" style={{fontFamily: 'Inter, sans-serif'}}>
                {userInitials}
              </span>
            )}
            <div className="text-lg font-semibold text-white mt-2">{user ? `${user.firstName} ${user.lastName}` : "User"}</div>
            <div className="text-sm text-gray-400">{user ? user.email : "user@example.com"}</div>
          </div>
          <div className="px-8 py-6 text-2xl font-extrabold text-white tracking-tight">Taskify</div>
          <nav className="flex flex-col gap-2 mt-4 px-4">
            <Link href="/homepage" className={`py-2 px-4 rounded-lg font-medium transition sidebar-link ${currentTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-white hover:bg-neutral-800'}`}>Dashboard</Link>
            <Link href="/tasks" className={`py-2 px-4 rounded-lg font-medium transition sidebar-link ${currentTab === 'tasks' ? 'bg-indigo-600 text-white' : 'text-white hover:bg-neutral-800'}`}>My Tasks</Link>
            <Link href="/categories" className={`py-2 px-4 rounded-lg font-medium transition sidebar-link ${currentTab === 'categories' ? 'bg-indigo-600 text-white' : 'text-white hover:bg-neutral-800'}`}>Task Categories</Link>
            <Link href="/settings" className={`py-2 px-4 rounded-lg font-medium transition sidebar-link ${currentTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-white hover:bg-neutral-800'}`}>Settings</Link>
            <Link href="/help" className={`py-2 px-4 rounded-lg font-medium transition sidebar-link ${currentTab === 'help' ? 'bg-indigo-600 text-white' : 'text-white hover:bg-neutral-800'}`}>Help</Link>
          </nav>
        </div>
        <div className="px-4 pb-6">
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              window.location.href = "/";
            }}
            className="block w-full text-center py-2 rounded-lg font-semibold text-red-400 bg-neutral-800 hover:bg-red-900 transition"
          >
            Logout
          </button>
        </div>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="w-full h-20 bg-neutral-900 shadow flex items-center justify-between px-10 border-b border-neutral-800 sticky top-0 z-10">
          <div className="text-2xl font-bold text-white">Task Categories</div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-start p-10 animate-fadeInUp">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="w-full flex gap-8 justify-center">
              {STATES.map(state => (
                <SortableContext key={state.key} items={tasksByState[state.key as keyof typeof tasksByState].map(t => t.id)} strategy={verticalListSortingStrategy} id={state.key}>
                  <div className="flex-1 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 p-4 flex flex-col min-w-[320px] max-w-[400px]">
                    <div className="text-xl font-bold text-white mb-4 text-center">{state.label}</div>
                    <DroppableColumn id={state.key}>
                      <div className="flex flex-col gap-4 min-h-[200px]">
                        {tasksByState[state.key as keyof typeof tasksByState].map(task => (
                          <SortableTaskCard key={task.id} task={task} onEdit={() => {}} onDelete={() => {}} onToggleComplete={() => {}} variant="kanban" dnd />
                        ))}
                      </div>
                    </DroppableColumn>
                    <button
                      className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-xl font-bold shadow hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                      onClick={() => {
                        setForm({ title: "", description: "", category: CATEGORIES[0], status: state.key as 'todo' | 'in_progress' | 'completed' });
                        setModalState({ open: true, status: state.key as 'todo' | 'in_progress' | 'completed' });
                      }}
                    >
                      + Add Task
                    </button>
                  </div>
                </SortableContext>
              ))}
            </div>
          </DndContext>
          <TaskModal
            open={modalState.open}
            mode="create"
            form={form}
            setForm={setForm}
            formError={formError}
            setFormError={setFormError}
            categories={CATEGORIES}
            onClose={() => setModalState({ open: false, status: modalState.status })}
            onSubmit={handleAddTask}
          />
        </main>
      </div>
    </div>
  );
} 