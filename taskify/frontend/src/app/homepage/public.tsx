"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function PublicHomePage() {
  const fullText = "Welcome to Taskify";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 70);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .animate-fadeInUp { animation: fadeInUp 1.2s cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>
      <div className="flex flex-col items-center gap-8 animate-fadeInUp">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-2 drop-shadow-lg">
          {displayed}
          <span className="inline-block w-2 h-8 bg-white align-middle animate-pulse ml-1" style={{verticalAlign: '0.1em'}}></span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-4 text-center max-w-xl">Organize your tasks, boost your productivity, and achieve more every day. Join our community and start your journey!</p>
        <div className="flex gap-6 mt-4">
          <Link
            href="/auth/login"
            className="bg-white text-black px-12 py-4 rounded-2xl font-extrabold text-xl shadow-xl border-2 border-transparent hover:bg-neutral-700 hover:border-white focus:outline-none focus:ring-4 focus:ring-neutral-400 focus:ring-offset-2 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-neutral-800 text-white px-12 py-4 rounded-2xl font-extrabold text-xl shadow-xl border-2 border-transparent hover:bg-white hover:text-black hover:border-white focus:outline-none focus:ring-4 focus:ring-neutral-400 focus:ring-offset-2 transition-all duration-200"
            style={{ boxShadow: '0 2px 16px #312e8133' }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
} 