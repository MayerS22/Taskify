"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
const getProfileImageUrl = (profile: string | null) => {
  if (!profile) return null;
  if (profile.startsWith('http')) return profile;
  return `http://localhost:3001${profile}`;
};

export default function HelpPage() {
  const currentTab = 'help';
  // Dummy user info for sidebar
  const user = null;
  const userInitials = "?";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-black to-neutral-900">
      <Sidebar user={{ firstName: "User", lastName: "", email: "user@example.com" }} currentTab="help" profileImgUrl={null} />
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="w-full h-20 bg-neutral-900 shadow flex items-center px-10 border-b border-neutral-800 sticky top-0 z-10">
          <div className="text-2xl font-bold text-white">Help & Support</div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-start p-10 animate-fadeInUp">
          <div className="max-w-2xl w-full bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">Welcome to Taskify Help</h1>
            <p className="mb-6 text-gray-300">Taskify helps you organize your tasks with a modern, easy-to-use interface. Here’s how to get the most out of your app:</p>
            <h2 className="text-xl font-bold mt-6 mb-2">Dashboard</h2>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li>See a quick overview of your most recent tasks.</li>
              <li>Navigate to "My Tasks" or "Task Categories" for more details.</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-2">My Tasks</h2>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li>View all your tasks in a list.</li>
              <li>Add, edit, delete, and mark tasks as complete or in progress.</li>
              <li>Reorder tasks by dragging them up or down.</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-2">Task Categories (Kanban Board)</h2>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li>Organize tasks by status: To Do, In Progress, Done.</li>
              <li>Drag and drop tasks between columns to change their status.</li>
              <li>Add new tasks directly to any column using the + button.</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-2">FAQ</h2>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li><b>How do I reset my password?</b> Use the "Forgot Password" link on the login page.</li>
              <li><b>Why can’t I see my tasks?</b> Make sure you are logged in. If the problem persists, try refreshing the page.</li>
              <li><b>How do I contact support?</b> Email <a href="mailto:support@taskify.com" className="text-indigo-400 underline">support@taskify.com</a>.</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-2">Need more help?</h2>
            <p className="text-gray-300">Contact our support team at <a href="mailto:support@taskify.com" className="text-indigo-400 underline">support@taskify.com</a>.</p>
          </div>
        </main>
      </div>
    </div>
  );
} 