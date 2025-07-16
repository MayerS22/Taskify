"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getProfile } from "../api";
import { createTask, getTasks, updateTask, deleteTask } from "../api";
// Add Heroicons for icons
import { XMarkIcon, PlusCircleIcon, CheckCircleIcon, TrashIcon, PencilSquareIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Task } from "./components/TaskCard";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import NotificationToast from "./components/NotificationToast";

const CATEGORIES = ["Work", "Personal", "Other"];

// Helper for category badge color
const categoryBadgeColor = (category: string) => {
  switch (category) {
    case "Work": return "bg-blue-600";
    case "Personal": return "bg-green-600";
    case "Other": return "bg-purple-600";
    default: return "bg-gray-500";
  }
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  // To-do state
  const [showModal, setShowModal] = useState(false);
  const [todos, setTodos] = useState<{ id: number; title: string; description: string; category: string; completed: boolean }[]>([]);
  const [form, setForm] = useState({ title: "", description: "", category: CATEGORIES[0], completed: false });
  const modalRef = useRef<HTMLDivElement>(null);
  const [formError, setFormError] = useState("");
  const [editModal, setEditModal] = useState<{ open: boolean; taskId: number | null }>({ open: false, taskId: null });
  const [editForm, setEditForm] = useState({ title: "", description: "", category: CATEGORIES[0], completed: false });
  const [editFormError, setEditFormError] = useState("");
  const editModalRef = useRef<HTMLDivElement>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; taskId: number | null }>({ open: false, taskId: null });
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error'; open: boolean }>({ message: '', type: 'success', open: false });

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
        // Fetch tasks from backend
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

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    }
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  // Close edit modal on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editModal.open && editModalRef.current && !editModalRef.current.contains(event.target as Node)) {
        setEditModal({ open: false, taskId: null });
      }
    }
    if (editModal.open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editModal]);

  // Close delete modal on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deleteModal.open && deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        setDeleteModal({ open: false, taskId: null });
      }
    }
    if (deleteModal.open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [deleteModal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userInitials = user && user.firstName && user.lastName ? user.firstName[0] + user.lastName[0] : "?";

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type, open: true });
    setTimeout(() => setNotification(n => ({ ...n, open: false })), 2000);
  };

  // To-do handlers
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
      setForm({ title: "", description: "", category: CATEGORIES[0], completed: false });
      setShowModal(false);
      setFormError("");
      showNotification("Task added successfully", "success");
    } catch (err) {
      setFormError("Failed to create task");
    }
  };

  const handleToggleComplete = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");
      const updated = await updateTask(id, { ...todo, completed: !todo.completed }, token);
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) {
      // Optionally show error
    }
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Open edit modal and prefill form
  const handleEditClick = (task: typeof todos[0]) => {
    setEditForm({ title: task.title, description: task.description, category: task.category, completed: task.completed });
    setEditFormError("");
    setEditModal({ open: true, taskId: task.id });
  };

  // Edit submit handler
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
      setEditForm({ title: "", description: "", category: CATEGORIES[0], completed: false });
      setEditFormError("");
    } catch (err) {
      setEditFormError("Failed to update task");
    }
  };

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

  return (
    <div className="min-h-screen flex bg-black">
      {/* Notification Toast */}
      <NotificationToast message={notification.message} type={notification.type} open={notification.open} />
      {/* Animation styles */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .animate-fadeInUp { animation: fadeInUp 1.1s cubic-bezier(0.4,0,0.2,1) both; }
        .profile-anim:hover { transform: scale(1.08); box-shadow: 0 4px 24px #6366f155; }
        .sidebar-link { position: relative; transition: color 0.2s; }
        .sidebar-link::after {
          content: "";
          position: absolute;
          left: 1rem; right: 1rem; bottom: 0.3rem;
          height: 2px;
          background: #818cf8;
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar-link:hover::after { transform: scaleX(1); }
      `}</style>
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 shadow-2xl flex flex-col justify-between h-screen fixed left-0 top-0 z-20 border-r border-neutral-800">
        <div>
          <div className="flex flex-col items-center gap-2 pt-8 pb-6 border-b border-neutral-800">
            {/* Profile Picture */}
            {user && user.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-blue-800 shadow profile-anim transition-transform duration-200" />
            ) : (
              <span className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-extrabold text-white bg-indigo-600 border-4 border-indigo-800 shadow select-none profile-anim transition-transform duration-200" style={{fontFamily: 'Inter, sans-serif'}}>
                {userInitials}
              </span>
            )}
            {/* User Name */}
            <div className="text-lg font-semibold text-white mt-2">{user ? `${user.firstName} ${user.lastName}` : "User"}</div>
            {/* User Email */}
            <div className="text-sm text-gray-400">{user ? user.email : "user@example.com"}</div>
          </div>
          <div className="px-8 py-6 text-2xl font-extrabold text-white tracking-tight">Taskify</div>
          <nav className="flex flex-col gap-2 mt-4 px-4">
            <Link href="/homepage" className="py-2 px-4 rounded-lg font-medium text-white hover:bg-neutral-800 transition sidebar-link">Dashboard</Link>
            <Link href="/tasks" className="py-2 px-4 rounded-lg font-medium text-white hover:bg-neutral-800 transition sidebar-link">My Tasks</Link>
            <Link href="/categories" className="py-2 px-4 rounded-lg font-medium text-white hover:bg-neutral-800 transition sidebar-link">Task Categories</Link>
            <Link href="/settings" className="py-2 px-4 rounded-lg font-medium text-white hover:bg-neutral-800 transition sidebar-link">Settings</Link>
            <Link href="/help" className="py-2 px-4 rounded-lg font-medium text-white hover:bg-neutral-800 transition sidebar-link">Help</Link>
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
        {/* Header */}
        <header className="w-full h-20 bg-neutral-900 shadow flex items-center justify-between px-10 border-b border-neutral-800 sticky top-0 z-10">
          <div className="text-2xl font-bold text-white">Welcome Back, {user ? user.firstName : "User"}!</div>
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold text-white bg-indigo-600 border-2 border-indigo-800 shadow select-none profile-anim transition-transform duration-200" style={{fontFamily: 'Inter, sans-serif'}}>
              {userInitials}
            </span>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-10 animate-fadeInUp">
          <h1 className="text-4xl font-extrabold text-white mb-2">Welcome to your dashboard{user && user.firstName ? `, ${user.firstName}` : ""}!</h1>
          <p className="text-gray-300 text-lg mb-4">Get started by creating a new task or exploring your lists.</p>
          <button
            className="bg-white text-black px-8 py-3 rounded-2xl font-extrabold text-lg shadow-xl border-2 border-transparent hover:bg-neutral-700 hover:text-white hover:border-white focus:outline-none focus:ring-4 focus:ring-neutral-400 focus:ring-offset-2 transition-all duration-200 mb-2"
            onClick={() => setShowModal(true)}
          >
            + Create Task
          </button>
          {/* Task Overview */}
          <div className="w-full max-w-2xl mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Recent Tasks</h3>
              <a href="/tasks" className="text-indigo-400 hover:underline text-sm font-semibold">View all</a>
            </div>
            <TaskList
              tasks={todos.slice(-5).reverse()}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onToggleComplete={handleToggleComplete}
            />
          </div>
          {/* Create/Edit Modal */}
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
          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            open={deleteModal.open}
            onClose={() => setDeleteModal({ open: false, taskId: null })}
            onConfirm={confirmDelete}
          />
        </main>
      </div>
    </div>
  );
} 