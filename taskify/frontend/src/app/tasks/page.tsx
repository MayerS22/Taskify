"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getProfile, getTasks, createTask, updateTask, deleteTask } from "../homepage/../api";
import { Task } from "../homepage/components/TaskCard";
import TaskList from "../homepage/components/TaskList";
import TaskModal from "../homepage/components/TaskModal";
import DeleteConfirmationModal from "../homepage/components/DeleteConfirmationModal";
import NotificationToast from "../homepage/components/NotificationToast";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const CATEGORIES = ["Work", "Personal", "Other"];

export default function MyTasksPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [todos, setTodos] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: CATEGORIES[0], status: 'todo' as 'todo' | 'in_progress' | 'completed' });
  const [formError, setFormError] = useState("");
  const [editModal, setEditModal] = useState<{ open: boolean; taskId: number | null }>({ open: false, taskId: null });
  const [editForm, setEditForm] = useState({ title: "", description: "", category: CATEGORIES[0], status: 'todo' as 'todo' | 'in_progress' | 'completed' });
  const [editFormError, setEditFormError] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; taskId: number | null }>({ open: false, taskId: null });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error'; open: boolean }>({ message: '', type: 'success', open: false });
  const currentTab: string = 'tasks';
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor));

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
        const backendTasks = await getTasks(token);
        setTodos(backendTasks);
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

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Title is required");
      return;
    }
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");
      const newTask = await createTask(form, token);
      setTodos(prev => [newTask, ...prev]);
      setForm({ title: "", description: "", category: CATEGORIES[0], status: 'todo' });
      setShowModal(false);
      setFormError("");
      showNotification("Task added successfully", "success");
    } catch (err) {
      setFormError("Failed to create task");
    }
  };

  // Handler for editing a task
  const handleEditClick = (task: Task) => {
    setEditForm({ title: task.title, description: task.description, category: task.category, status: task.status });
    setEditFormError("");
    setEditModal({ open: true, taskId: task.id });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      setEditFormError("Title is required");
      return;
    }
    if (editModal.taskId === null) return;
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");
      const updated = await updateTask(editModal.taskId, editForm, token);
      setTodos(todos.map(todo =>
        todo.id === editModal.taskId ? updated : todo
      ));
      setEditModal({ open: false, taskId: null });
      setEditForm({ title: "", description: "", category: CATEGORIES[0], status: 'todo' });
      setEditFormError("");
    } catch (err) {
      setEditFormError("Failed to update task");
    }
  };

  // Handler for deleting a task
  const handleDeleteClick = (id: number) => {
    setDeleteModal({ open: true, taskId: id });
  };

  const confirmDelete = async () => {
    if (deleteModal.taskId !== null) {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Not authenticated");
        await deleteTask(deleteModal.taskId, token);
        setTodos(todos.filter(todo => todo.id !== deleteModal.taskId));
        showNotification("Task deleted successfully", "success");
      } catch (err) {
        // Optionally show error
      }
    }
    setDeleteModal({ open: false, taskId: null });
  };

  // Handler for toggling complete
  const handleToggleComplete = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    (async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Not authenticated");
        let newStatus: 'todo' | 'in_progress' | 'completed' = todo.status === 'completed' ? 'todo' : 'completed';
        const updated = await updateTask(id, { ...todo, status: newStatus }, token);
        setTodos(todos.map(t => t.id === id ? updated : t));
      } catch (err) {
        // Optionally show error
      }
    })();
  };

  // DnD handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex(t => t.id === active.id);
        const newIndex = items.findIndex(t => t.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
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
      {/* Sidebar (reuse from homepage) */}
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
          <div className="text-2xl font-bold text-white">My Tasks</div>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-indigo-700 transition"
            onClick={() => setShowModal(true)}
          >
            + Add Task
          </button>
        </header>
        <main className="flex-1 flex flex-col items-center justify-start p-10 animate-fadeInUp">
          <TaskList
            tasks={todos}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onToggleComplete={handleToggleComplete}
            variant="mytasks"
          />
        </main>
        <TaskModal
          open={showModal || editModal.open}
          mode={showModal ? "create" : "edit"}
          form={showModal ? form : editForm}
          setForm={showModal ? setForm : setEditForm}
          formError={showModal ? formError : editFormError}
          setFormError={showModal ? setFormError : setEditFormError}
          categories={CATEGORIES}
          onClose={() => {
            setShowModal(false);
            setEditModal({ open: false, taskId: null });
          }}
          onSubmit={showModal ? handleAddTodo : handleEditSubmit}
        />
        <DeleteConfirmationModal
          open={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, taskId: null })}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
} 