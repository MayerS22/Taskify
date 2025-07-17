"use client";
import React from "react";
import Link from "next/link";

export type SidebarProps = {
  user: any;
  currentTab: string;
  profileImgUrl?: string | null;
};

export default function Sidebar({ user, currentTab, profileImgUrl }: SidebarProps) {
  const userInitials = user && user.firstName ? user.firstName[0] : "?";
  return (
    <aside className="w-64 bg-neutral-900 shadow-2xl flex flex-col justify-between h-screen fixed left-0 top-0 z-20 border-r border-neutral-800">
      <div>
        <div className="flex flex-col items-center gap-2 pt-8 pb-6 border-b border-neutral-800">
          {profileImgUrl ? (
            <img src={profileImgUrl || undefined} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-blue-800 shadow profile-anim transition-transform duration-200" />
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
          <Link href="/kubran-board" className={`py-2 px-4 rounded-lg font-medium transition sidebar-link ${currentTab === 'kubran-board' ? 'bg-indigo-600 text-white' : 'text-white hover:bg-neutral-800'}`}>Kubran-Board</Link>
          <Link href="/profile" className={`py-2 px-4 rounded-lg font-medium transition sidebar-link ${currentTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-white hover:bg-neutral-800'}`}>Profile</Link>
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
  );
} 