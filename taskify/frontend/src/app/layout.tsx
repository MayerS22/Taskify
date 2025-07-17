"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { getProfile } from "./api";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<any>(null);
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      if (!token) return;
      try {
        const data = await getProfile(token);
        setUser(data);
        if (data.profile) {
          setProfileImgUrl(data.profile.startsWith("http") ? data.profile : `http://localhost:3001${data.profile}`);
        } else {
          setProfileImgUrl(null);
        }
      } catch {
        setUser(null);
        setProfileImgUrl(null);
      }
    };
    fetchUser();
  }, []);

  // Determine currentTab from window.location.pathname
  let currentTab = "dashboard";
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path.startsWith("/tasks")) currentTab = "tasks";
    else if (path.startsWith("/kubran-board")) currentTab = "kubran-board";
    else if (path.startsWith("/profile")) currentTab = "profile";
    else if (path.startsWith("/help")) currentTab = "help";
    else if (path.startsWith("/homepage")) currentTab = "dashboard";
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-gradient-to-br from-indigo-900 via-black to-neutral-900 min-h-screen`}>
        {user && <Sidebar user={user} currentTab={currentTab} profileImgUrl={profileImgUrl} />}
        {children}
      </body>
    </html>
  );
}
