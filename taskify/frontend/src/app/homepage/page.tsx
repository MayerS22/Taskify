"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  // Placeholder user info; replace with real data when backend is connected
  const [loading, setLoading] = useState(true);
  const user = {
    firstName: "User",
    lastName: "Name",
    email: "user@example.com",
    profilePic: null, // null means use initials
  };
  const userInitials = user.firstName[0] + user.lastName[0];

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black">
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
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-blue-800 shadow profile-anim transition-transform duration-200" />
            ) : (
              <span className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-extrabold text-white bg-indigo-600 border-4 border-indigo-800 shadow select-none profile-anim transition-transform duration-200" style={{fontFamily: 'Inter, sans-serif'}}>
                {userInitials}
              </span>
            )}
            {/* User Name */}
            <div className="text-lg font-semibold text-white mt-2">{user.firstName} {user.lastName}</div>
            {/* User Email */}
            <div className="text-sm text-gray-400">{user.email}</div>
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
          <div className="text-2xl font-bold text-white">Welcome back, {user.firstName}!</div>
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold text-white bg-indigo-600 border-2 border-indigo-800 shadow select-none profile-anim transition-transform duration-200" style={{fontFamily: 'Inter, sans-serif'}}>
              {userInitials}
            </span>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-10 animate-fadeInUp">
          <h1 className="text-4xl font-extrabold text-white mb-2">Welcome to your dashboard!</h1>
          <p className="text-gray-300 text-lg mb-4">Get started by creating a new task or exploring your lists.</p>
          <button className="bg-white text-black px-8 py-3 rounded-2xl font-extrabold text-lg shadow-xl border-2 border-transparent hover:bg-neutral-700 hover:text-white hover:border-white focus:outline-none focus:ring-4 focus:ring-neutral-400 focus:ring-offset-2 transition-all duration-200 mb-2" disabled>
            + Create Task
          </button>
        </main>
      </div>
    </div>
  );
} 