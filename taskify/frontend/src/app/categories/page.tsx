"use client";
import React, { useEffect, useState } from "react";
import { getProfile, getTasksByState, createTask, updateTask } from "../api";
import { Task } from "../homepage/components/TaskCard";
import TaskModal from "../homepage/components/TaskModal";
import NotificationToast from "../homepage/components/NotificationToast";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from "next/link";
import { useRouter } from "next/navigation";
import TaskCategoryCard from "./TaskCategoryCard";

const CATEGORIES = ["Work", "Personal", "Other"];
const STATES = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Done' },
];

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tasksByState, setTasksByState] = useState<{ todo: Task[]; in_progress: Task[]; completed: Task[] }>({ todo: [], in_progress: [], completed: [] });
  const [modalState, setModalState] = useState<{ open: boolean; status: 'todo' | 'in_progress' | 'completed' }>({ open: false, status: 'todo' });
  const [form, setForm] = useState({ title: "", description: "", category: CATEGORIES[0], status: 'todo' as 'todo' | 'in_progress' | 'completed' });
  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error'; open: boolean }>({ message: '', type: 'success', open: false });
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeTask, setActiveTask] = useState<Task | null>(null);
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

  // Helper to reorder tasks in a column
  function reorder(list: Task[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  // DnD handlers
  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = Object.values(tasksByState).flat().find(t => t.id === active.id);
    setActiveTask(task || null);
  };
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;
    // Find source column
    const fromCol = Object.keys(tasksByState).find(state => tasksByState[state as keyof typeof tasksByState].some(t => t.id === active.id));
    // Check if dropped on a column or a card
    const columnKeys = STATES.map(s => s.key);
    let toCol = columnKeys.includes(over.id) ? over.id : null;
    if (!toCol) {
      // If dropped on a card, find its column
      toCol = Object.keys(tasksByState).find(state => tasksByState[state as keyof typeof tasksByState].some(t => t.id === over.id));
    }
    if (!fromCol || !toCol) return;
    if (fromCol === toCol) {
      // Reorder within column
      const oldIndex = tasksByState[fromCol as keyof typeof tasksByState].findIndex(t => t.id === active.id);
      const newIndex = tasksByState[toCol as keyof typeof tasksByState].findIndex(t => t.id === over.id);
      setTasksByState(prev => ({
        ...prev,
        [fromCol]: arrayMove(prev[fromCol as keyof typeof prev], oldIndex, newIndex),
      }));
    } else {
      // Move to another column and update state
      const task = tasksByState[fromCol as keyof typeof tasksByState].find(t => t.id === active.id);
      if (!task) return;
      const updatedTask = { ...task, status: toCol };
      setTasksByState(prev => ({
        ...prev,
        [fromCol]: prev[fromCol as keyof typeof prev].filter(t => t.id !== task.id),
        [toCol]: [updatedTask, ...prev[toCol as keyof typeof prev]],
      }));
      // Persist status change
      (async () => {
        try {
          const token = localStorage.getItem("access_token");
          if (!token) throw new Error("Not authenticated");
          await updateTask(task.id, { ...task, status: toCol }, token);
        } catch {}
      })();
    }
  };
  const handleDragCancel = () => setActiveTask(null);

  // Handler for editing a task
  const handleEditClick = (task: Task) => {
    setForm({ title: task.title, description: task.description, category: task.category, status: task.status });
    setFormError("");
    setModalState({ open: true, status: task.status as 'todo' | 'in_progress' | 'completed' });
  };

  // Handler for deleting a task
  const handleDeleteClick = (id: number) => {
    const task = Object.values(tasksByState).flat().find(t => t.id === id);
    if (task) setModalState({ open: true, status: task.status as 'todo' | 'in_progress' | 'completed' });
  };

  // Handler for toggling complete
  const handleToggleComplete = (id: number) => {
    const task = Object.values(tasksByState).flat().find(t => t.id === id);
    if (!task) return;
    (async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Not authenticated");
        let newStatus: 'todo' | 'in_progress' | 'completed' = task.status === 'completed' ? 'todo' : 'completed';
        const updated = await updateTask(task.id, { ...task, status: newStatus }, token);
        setTasksByState(prev => {
          let newTasks = { ...prev };
          newTasks[task.status] = newTasks[task.status].filter(t => t.id !== task.id);
          newTasks[newStatus] = [updated, ...newTasks[newStatus]];
          return newTasks;
        });
        showNotification("Task status updated", "success");
      } catch {
        showNotification("Failed to update status", "error");
      }
    })();
  };

  // Add the onMove handler
  const handleMoveTask = (id: number, direction: 'left' | 'right') => {
    // Find the current state and index
    const stateKeys = STATES.map(s => s.key);
    const currentState = stateKeys.find(state => tasksByState[state as keyof typeof tasksByState].some(t => t.id === id));
    if (!currentState) return;
    const currentIndex = stateKeys.indexOf(currentState);
    let newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= stateKeys.length) return;
    const newState = stateKeys[newIndex];
    const task = tasksByState[currentState as keyof typeof tasksByState].find(t => t.id === id);
    if (!task) return;
    const updatedTask = { ...task, status: newState };
    setTasksByState(prev => ({
      ...prev,
      [currentState]: prev[currentState as keyof typeof prev].filter(t => t.id !== id),
      [newState]: [updatedTask, ...prev[newState as keyof typeof prev]],
    }));
    // Persist status change
    (async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Not authenticated");
        await updateTask(task.id, { ...task, status: newState }, token);
      } catch {}
    })();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userInitials = user && user.firstName && user.lastName ? user.firstName[0] + user.lastName[0] : "?";

  // Add SortableTaskCategoryCard wrapper
  function SortableTaskCategoryCard({ task, onDelete, onMove, onEdit }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : undefined,
      opacity: isDragging ? 0.7 : 1,
      position: 'relative',
    };
    return (
      <div ref={setNodeRef} style={style}>
        <TaskCategoryCard
          task={task}
          onDelete={onDelete}
          onMove={onMove}
          onEdit={onEdit}
          dragHandleProps={listeners}
          dragAttributes={attributes}
        />
      </div>
    );
  }

  // Add DroppableColumn component
  function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
      <div ref={setNodeRef} className={isOver ? 'bg-neutral-800/80' : ''}>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-black to-neutral-900">
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
            <Link href="/categories" className={`py-2 px-4 rounded-lg font-medium transition sidebar-link ${currentTab === 'categories' ? 'bg-indigo-600 text-white' : 'text-white hover:bg-neutral-800'}`}>Kubran Board</Link>
            <Link href="/profile" className={`py-2 px-4 rounded-lg font-medium transition sidebar-link ${currentTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-white hover:bg-neutral-800'}`}>Profile</Link>
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
          <div className="text-2xl font-bold text-white">Kanban Board</div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-start p-10 animate-fadeInUp">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
            <div className="w-full flex gap-8 justify-center items-start overflow-x-auto">
              {STATES.map(state => (
                <DroppableColumn key={state.key} id={state.key}>
                  <div className="w-[384px] min-w-[384px] max-w-[384px] bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 p-4 flex flex-col">
                    <div className="text-xl font-bold text-white mb-4 text-center">{state.label}</div>
                    <SortableContext items={tasksByState[state.key as keyof typeof tasksByState].map(t => t.id)} strategy={verticalListSortingStrategy}>
                      <div className="flex flex-col gap-4 min-h-[200px]">
                        {tasksByState[state.key as keyof typeof tasksByState].map(task => (
                          <SortableTaskCategoryCard
                            key={task.id}
                            task={task}
                            onDelete={handleDeleteClick}
                            onMove={handleMoveTask}
                            onEdit={handleEditClick}
                          />
                        ))}
                      </div>
                    </SortableContext>
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
                </DroppableColumn>
              ))}
            </div>
            <DragOverlay>
              {activeTask ? (
                <div style={{ width: 384, minWidth: 384, maxWidth: 384, zIndex: 100 }}>
                  <TaskCategoryCard
                    task={activeTask}
                    onDelete={handleDeleteClick}
                    onMove={handleMoveTask}
                  />
                </div>
              ) : null}
            </DragOverlay>
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