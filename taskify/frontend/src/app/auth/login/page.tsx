"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { login } from '../../api';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [imgBoxSize, setImgBoxSize] = useState({ width: 384, height: 384 });

  useEffect(() => {
    if (formRef.current) {
      const { width, height } = formRef.current.getBoundingClientRect();
      setImgBoxSize({ width, height });
    }
  }, [formRef.current, error]); // update on error to handle form height changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("All fields are required.");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 1300);
      return;
    }
    try {
      const result = await login(form.email, form.password);
      if (result.access_token) {
        setError("");
        setShowModal(true); // Show modal on success
        setTimeout(() => {
          setShowModal(false);
          router.push("/homepage");
        }, 1300);
      } else if (result.message) {
        setError(result.message);
        setSuccess("");
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 1300);
      } else {
        setError("Unknown error occurred.");
        setSuccess("");
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 1300);
      }
    } catch (err) {
      setError("Network or server error.");
      setSuccess("");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 1300);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push("/");
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
            <h2 className="text-3xl font-extrabold mb-2 text-gray-800">Sign In Successful!</h2>
            <p className="mb-8 text-gray-700 text-lg">You have signed in successfully.<br/>Welcome back!</p>
          </div>
        </div>
      )}
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
          <div
            className="bg-gradient-to-br from-white via-red-50 to-red-100 rounded-2xl shadow-2xl p-10 max-w-sm w-full text-center border border-red-200 relative animate-modalBounceIn"
            style={{ animationDelay: '0s', animationFillMode: 'forwards' }}
          >
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 shadow-md animate-iconPop">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold mb-2 text-gray-800">Error</h2>
            <p className="mb-8 text-gray-700 text-lg">{error}</p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: none; } }
        .animate-fadeInLeft { animation: fadeInLeft 1.1s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: none; } }
        .animate-fadeInRight { animation: fadeInRight 1.1s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes dividerGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .animate-dividerGrow { animation: dividerGrow 0.7s cubic-bezier(0.4,0,0.2,1) both; transform-origin: center; }
        @keyframes modalBounceIn { 0% { opacity: 0; transform: scale(0.7); } 60% { opacity: 1; transform: scale(1.05); } 80% { transform: scale(0.97); } 100% { opacity: 1; transform: scale(1); } }
        .animate-modalBounceIn { animation: modalBounceIn 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes iconPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-iconPop { animation: iconPop 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
      `}</style>
      <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 animate-fadeInUp">
        {/* Image (left on desktop, top on mobile) */}
        <div className="hidden md:flex items-center justify-center bg-black p-8 md:w-1/2">
          <div className="flex items-center justify-center p-4">
            <Image
              src="/assets/SignIn.svg"
              alt="Sign In Illustration"
              width={350}
              height={350}
              className="w-full h-auto max-w-xs"
              priority
            />
          </div>
        </div>
        {/* Form */}
        <div className="flex-1 flex flex-col items-center">
          <div ref={formRef} className="w-full max-w-md bg-neutral-900/90 rounded-2xl shadow-2xl border border-gray-800 p-8 flex flex-col items-center transition-all duration-300" style={{ minHeight: '384px' }}>
            <h2 className="text-3xl font-extrabold text-white mb-2">Sign In</h2>
            <p className="text-gray-400 text-sm mb-6 text-center">Welcome back! Please sign in to continue.</p>
            {error && <div className="mb-2 text-red-400 text-center font-medium bg-red-900/30 border border-red-700 rounded py-2 animate-fadeInUp">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
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
                  autoComplete="current-password"
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
              <div className="flex justify-end mt-1">
                <a href="/auth/forgot-password" className="text-gray-400 hover:underline text-sm font-medium">Forgot Password?</a>
              </div>
              <button
                type="submit"
                className="w-full bg-neutral-800 text-white py-4 rounded-2xl font-extrabold text-xl shadow-xl border-2 border-transparent hover:bg-neutral-700 hover:border-white focus:outline-none focus:ring-4 focus:ring-neutral-400 focus:ring-offset-2 transition-all duration-200"
              >
                Sign In
              </button>
              <div className="text-center mt-2 text-gray-400 text-base">
                Don&apos;t have an account?{' '}
                <a href="/auth/signup" className="text-white hover:underline font-medium">Sign up</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 