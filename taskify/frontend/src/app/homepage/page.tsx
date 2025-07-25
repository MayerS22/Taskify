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
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

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

const getProfileImageUrl = (profile: string | null) => {
  if (!profile) return null;
  if (profile.startsWith('http')) return profile;
  return `http://localhost:3001${profile}`;
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  // To-do state
  const [showModal, setShowModal] = useState(false);
  const [todos, setTodos] = useState<{ id: number; title: string; description: string; category: string; status: 'todo' | 'in_progress' | 'completed' }[]>([]);
  const [form, setForm] = useState({ title: "", description: "", category: CATEGORIES[0], status: 'todo' as 'todo' | 'in_progress' | 'completed' });
  const modalRef = useRef<HTMLDivElement>(null);
  const [formError, setFormError] = useState("");
  const [editModal, setEditModal] = useState<{ open: boolean; taskId: number | null }>({ open: false, taskId: null });
  const [editForm, setEditForm] = useState({ title: "", description: "", category: CATEGORIES[0], status: 'todo' as 'todo' | 'in_progress' | 'completed' });
  const [editFormError, setEditFormError] = useState("");
  const editModalRef = useRef<HTMLDivElement>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; taskId: number | null }>({ open: false, taskId: null });
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error'; open: boolean }>({ message: '', type: 'success', open: false });
  // Track the current tab for sidebar highlighting
  const currentTab: string = 'dashboard';
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
  const profileImgUrl = user ? getProfileImageUrl(user.profile) : null;

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
      setForm({ title: "", description: "", category: CATEGORIES[0], status: 'todo' });
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
      // Toggle between completed and todo (or in_progress)
      let newStatus: 'todo' | 'in_progress' | 'completed' = todo.status === 'completed' ? 'todo' : 'completed';
      const updated = await updateTask(id, { ...todo, status: newStatus }, token);
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
    setEditForm({ title: task.title, description: task.description, category: task.category, status: task.status });
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
      setEditForm({ title: "", description: "", category: CATEGORIES[0], status: 'todo' });
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
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-black to-neutral-900">
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
      <Sidebar user={user} currentTab={currentTab} profileImgUrl={profileImgUrl} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full h-20 bg-neutral-900 shadow flex items-center justify-between px-10 border-b border-neutral-800 sticky top-0 z-10">
          <div className="text-2xl font-bold text-white">Welcome Back, {user ? user.firstName : "User"}!</div>
          <div className="flex items-center gap-4">
            {profileImgUrl ? (
              <img src={profileImgUrl || undefined} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-800 shadow select-none profile-anim transition-transform duration-200" />
            ) : (
              <span className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold text-white bg-indigo-600 border-2 border-indigo-800 shadow select-none profile-anim transition-transform duration-200" style={{fontFamily: 'Inter, sans-serif'}}>
                {user && user.firstName ? user.firstName[0] : "?"}
              </span>
            )}
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
              <button
                onClick={() => router.push('/tasks')}
                className="text-indigo-400 hover:underline text-sm font-semibold bg-transparent border-none cursor-pointer"
              >
                View all
              </button>
            </div>
            <TaskList
              tasks={todos.slice(0, 3)}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onToggleComplete={handleToggleComplete}
              variant="dashboard"
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