import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <a
        href="/auth/signup"
        className="rounded-full border border-blue-600 bg-blue-600 text-white font-semibold text-lg px-6 py-3 shadow hover:bg-blue-700 transition text-center"
      >
        Sign Up
      </a>
    </div>
  );
}
