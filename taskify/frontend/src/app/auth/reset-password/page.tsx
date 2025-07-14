"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.newPassword || !form.confirmPassword) {
      setError("All fields are required.");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 1300);
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 1300);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setSuccess(data.message);
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        setError(data.message || "Something went wrong.");
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 1300);
      }
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
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-2 text-gray-800">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
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
    </div>
  );
} 