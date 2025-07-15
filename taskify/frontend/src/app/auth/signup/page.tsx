"use client";
import React, { useState } from "react";
import Image from "next/image";
import { register } from '../../api';
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const result = await register(form.email, form.password, form.firstName, form.lastName);
      if (result.userId) {
        setSuccess("Sign up successful!");
        setError("");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          router.push("/auth/login");
        }, 1300);
      } else if (result.message) {
        setError(result.message);
        setSuccess("");
      } else {
        setError("Unknown error occurred.");
        setSuccess("");
      }
    } catch (err) {
      setError("Network or server error.");
      setSuccess("");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
          <div
            className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl p-10 max-w-sm w-full text-center border border-blue-100 relative animate-modalBounceIn"
            style={{ animationDelay: '0s', animationFillMode: 'forwards' }}
          >
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 shadow-md animate-iconPop">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
            </div>
            <h2 className="text-3xl font-extrabold mb-2 text-gray-800">Sign Up Successful!</h2>
            <p className="mb-8 text-gray-700 text-lg">Your account has been created.<br/>Please log in to continue.</p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .animate-fadeInUp { animation: fadeInUp 1.2s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes dividerGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .animate-dividerGrow { animation: dividerGrow 0.7s cubic-bezier(0.4,0,0.2,1) both; transform-origin: center; }
        @keyframes modalPopUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-modalPopUp { animation: modalPopUp 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes modalBounceIn { 0% { opacity: 0; transform: scale(0.7); } 60% { opacity: 1; transform: scale(1.05); } 80% { transform: scale(0.97); } 100% { opacity: 1; transform: scale(1); } }
        .animate-modalBounceIn { animation: modalBounceIn 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes iconPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-iconPop { animation: iconPop 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
      `}</style>
      <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 animate-fadeInUp">
        {/* Image (left on desktop, top on mobile) */}
        <div className="hidden md:flex items-center justify-center bg-black p-8 md:w-1/2">
          <Image
            src="/assets/SignUp.svg"
            alt="Sign Up Illustration"
            width={320}
            height={320}
            className="w-full h-auto max-w-xs"
            priority
          />
        </div>
        {/* Form */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-md bg-neutral-900/90 rounded-2xl shadow-2xl border border-gray-800 p-8 flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-white mb-2">Sign Up</h2>
            <p className="text-gray-400 text-sm mb-6 text-center">Create your account to get started.</p>
            {error && <div className="mb-2 text-red-400 text-center font-medium bg-red-900/30 border border-red-700 rounded py-2 animate-fadeInUp">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium text-gray-200">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-white transition text-white placeholder-gray-500 text-lg"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium text-gray-200">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-white transition text-white placeholder-gray-500 text-lg"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-200">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-white transition text-white placeholder-gray-500 text-lg"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="relative min-w-0">
                <label className="block mb-1 font-medium text-gray-200">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-white transition text-white placeholder-gray-500 text-lg"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white bg-black rounded-full focus:outline-none p-1 w-8 h-8 flex items-center justify-center"
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1 2.1A9.956 9.956 0 012 9c0 5.523 4.477 10 10 10 1.657 0 3.22-.403 4.575-1.125m2.1-2.1A9.956 9.956 0 0022 15c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /></svg>
                  )}
                </button>
              </div>
              <div className="relative min-w-0">
                <label className="block mb-1 font-medium text-gray-200">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-white transition text-white placeholder-gray-500 text-lg"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white bg-black rounded-full focus:outline-none p-1 w-8 h-8 flex items-center justify-center"
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1 2.1A9.956 9.956 0 012 9c0 5.523 4.477 10 10 10 1.657 0 3.22-.403 4.575-1.125m2.1-2.1A9.956 9.956 0 0022 15c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /></svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-neutral-800 text-white py-4 rounded-2xl font-extrabold text-xl shadow-xl border-2 border-transparent hover:bg-neutral-700 hover:border-white focus:outline-none focus:ring-4 focus:ring-neutral-400 focus:ring-offset-2 transition-all duration-200"
              >
                Sign Up
              </button>
              <div className="text-center mt-2 text-gray-400 text-base">
                Already have an account?{' '}
                <a href="/auth/login" className="text-white hover:underline font-medium">Log in</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 