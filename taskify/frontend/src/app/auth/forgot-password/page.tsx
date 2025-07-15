"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotPassword } from "../../api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        router.push("/auth/login");
      }, 1300);
    } catch {
      setError("Network error. Please try again.");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 1300);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
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
            <h2 className="text-3xl font-extrabold mb-2 text-gray-800">Check Your Email</h2>
            <p className="mb-8 text-gray-700 text-lg">If this email exists, a password reset link has been sent.</p>
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
        @keyframes modalBounceIn { 0% { opacity: 0; transform: scale(0.7); } 60% { opacity: 1; transform: scale(1.05); } 80% { transform: scale(0.97); } 100% { opacity: 1; transform: scale(1); } }
        .animate-modalBounceIn { animation: modalBounceIn 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes iconPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-iconPop { animation: iconPop 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-2 text-gray-800">Forgot Password?</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="mt-6">
          <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">Back to Login</Link>
        </div>
      </div>
    </div>
  );
} 