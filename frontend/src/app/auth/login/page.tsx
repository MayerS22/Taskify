"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    setSuccess("Sign in successful! (This is a placeholder)");
    setError("");
    // Here you would send the data to the backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <style>{`
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: none; } }
        .animate-fadeInLeft { animation: fadeInLeft 1.1s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: none; } }
        .animate-fadeInRight { animation: fadeInRight 1.1s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes dividerGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .animate-dividerGrow { animation: dividerGrow 0.7s cubic-bezier(0.4,0,0.2,1) both; transform-origin: center; }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row-reverse overflow-hidden border border-gray-100">
        {/* Right: Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-10 animate-fadeInRight" style={{ animationDelay: '0.1s' }}>
          <Image
            src="/assets/SignIn.svg"
            alt="Sign In Illustration"
            width={350}
            height={350}
            className="w-full h-auto max-w-xs md:max-w-sm"
            priority
          />
        </div>
        {/* Left: Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 p-8 md:p-10 flex flex-col gap-6 justify-center animate-fadeInLeft" style={{ animationDelay: '0.15s' }}
        >
          <div className="flex flex-col items-center mb-2">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-1">Sign In</h2>
            <p className="text-gray-700 text-sm">Welcome back! Please sign in to continue.</p>
          </div>
          {error && <div className="mb-2 text-red-500 text-center font-medium bg-red-50 border border-red-200 rounded py-2 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>{error}</div>}
          {success && <div className="mb-2 text-green-600 text-center font-medium bg-green-50 border border-green-200 rounded py-2 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>{success}</div>}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-800">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition max-w-full text-gray-900"
                required
                autoComplete="email"
              />
            </div>
            <div className="relative min-w-0">
              <label className="block mb-1 font-medium text-gray-800">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition max-w-full text-gray-900"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 bg-white rounded-full focus:outline-none p-1 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                style={{ pointerEvents: 'auto' }}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1 2.1A9.956 9.956 0 012 9c0 5.523 4.477 10 10 10 1.657 0 3.22-.403 4.575-1.125m2.1-2.1A9.956 9.956 0 0022 15c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125" /></svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /></svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-lg hover:bg-blue-700 hover:scale-105 transition-transform transition-shadow duration-200 shadow mt-2"
          >
            Sign In
          </button>
          <div className="text-center mt-2 text-gray-700 text-sm">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="text-blue-600 hover:underline font-medium">Sign up</a>
          </div>
          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-gray-300 animate-dividerGrow" />
            <span className="text-gray-500 font-medium text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300 animate-dividerGrow" />
          </div>
          {/* Social Sign In Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-800 font-semibold hover:bg-gray-50 hover:scale-105 transition-transform transition-shadow duration-200"
              onClick={() => alert('Google sign in (to be implemented)')}
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C.9 15.36 0 19.55 0 24c0 4.45.9 8.64 2.69 12.2l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.04 15.52-5.56l-7.19-5.6c-2.01 1.35-4.59 2.16-8.33 2.16-6.38 0-11.87-3.63-14.33-8.86l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
              Sign in with Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-800 font-semibold hover:bg-gray-50 hover:scale-105 transition-transform transition-shadow duration-200"
              onClick={() => alert('GitHub sign in (to be implemented)')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.922.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Sign in with GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 