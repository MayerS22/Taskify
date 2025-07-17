"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationToast from "../homepage/components/NotificationToast";
import { getProfile, updateProfile } from "../api";
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';
import Link from "next/link";
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Sidebar from "../components/Sidebar";

const TABS = [
  { key: "profile", label: "Profile" },
  // Future: { key: "security", label: "Security" },
];

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  // ... add more as needed
];

const getProfileImageUrl = (profile: string | null) => {
  if (!profile) return null;
  if (profile.startsWith('http')) return profile;
  return `http://localhost:3001${profile}`;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    phone: "",
    profile: "",
    country: ""
  });
  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error'; open: boolean }>({ message: '', type: 'success', open: false });
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;[{
            "resource": "/d:/Courses/Taskify/taskify/frontend/src/app/profile/page.tsx",
            "owner": "typescript",
            "code": "2339",
            "severity": 8,
            "message": "Property 'bio' does not exist on type 'User'.",
            "source": "ts",
            "startLineNumber": 73,
            "startColumn": 21,
            "endLineNumber": 73,
            "endColumn": 24,
            "modelVersionId": 123
        }]
      }
      try {
        const data = await getProfile(token);
        setUser(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          bio: data.bio || "",
          phone: data.phone || "",
          profile: data.profile || "",
          country: data.country || ""
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type, open: true });
    setTimeout(() => setNotification(n => ({ ...n, open: false })), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:3001/users/profile-picture", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload profile picture");
      const data = await res.json();
      setForm(f => ({ ...f, profile: data.url }));
      showNotification("Profile picture updated", "success");
    } catch {
      showNotification("Failed to upload profile picture", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");
      await updateProfile(form, token);
      showNotification("Profile updated successfully", "success");
    } catch (err) {
      setFormError("Failed to update profile");
      showNotification("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-neutral-900">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentTab: string = 'profile';
  const profileImgUrl = user ? getProfileImageUrl(form.profile) : null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-black to-neutral-900">
      {/* Sidebar */}
      <Sidebar user={user} currentTab={currentTab} profileImgUrl={getProfileImageUrl(form.profile)} />
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="w-full h-20 bg-neutral-900 shadow flex items-center justify-between px-10 border-b border-neutral-800 sticky top-0 z-10">
          <div className="text-2xl font-bold text-white">Profile</div>
          
        </header>
        <NotificationToast message={notification.message} type={notification.type} open={notification.open} />
        <div className="w-full max-w-xl bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 p-0 flex flex-col items-center relative overflow-hidden mt-10 mx-auto" style={{ minHeight: 'calc(100vh - 8rem)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Tab Bar */}
          <div className="w-full flex border-b border-neutral-800 bg-gradient-to-r from-indigo-800/60 via-neutral-900/80 to-indigo-900/60">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`flex-1 py-4 text-lg font-bold transition relative
                ${activeTab === tab.key ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}
              `}
                style={{ fontFamily: 'Inter, sans-serif' }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-1 w-2/3 bg-indigo-500 rounded-full transition-all duration-300"></span>
                )}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="w-full p-8 pt-20 flex flex-col items-center animate-fadeInUp">
            {activeTab === "profile" && (
              <>
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative group">
                    {form.profile ? (
                      <img src={getProfileImageUrl(form.profile) || undefined} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-800 shadow mb-2 profile-anim" />
                    ) : (
                      <span className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold text-white bg-indigo-600 border-4 border-indigo-800 shadow select-none mb-2 profile-anim" style={{fontFamily: 'Inter, sans-serif'}}>
                        {form.firstName ? form.firstName[0] : "?"}
                      </span>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full" style={{bottom: '8px'}}>
                      <CloudArrowUpIcon className="w-8 h-8 text-indigo-300" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  <div className="text-lg font-semibold text-white mt-2">{form.firstName} {form.lastName}</div>
                  <div className="text-sm text-gray-400">{form.email}</div>
                </div>
                <form id="profile-form" className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-300 mb-1">First Name</label>
                      <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-300 mb-1">Last Name</label>
                      <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Email</label>
                    <input type="email" name="email" value={form.email} readOnly className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-gray-400 border border-neutral-700 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Bio</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-300 mb-1">Phone</label>
                      <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-300 mb-1">Country</label>
                      <Listbox value={form.country} onChange={value => setForm(f => ({ ...f, country: value }))}>
                        <div className="relative">
                          <Listbox.Button className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex items-center justify-between">
                            {form.country ? (
                              <span className="flex items-center">
                                <img src={`https://flagcdn.com/24x18/${form.country.toLowerCase()}.png`} alt="flag" className="inline mr-2 rounded-sm" width={24} height={18} />
                                {COUNTRIES.find(c => c.code === form.country)?.name || 'Select a country'}
                              </span>
                            ) : (
                              <span className="text-gray-400">Select a country</span>
                            )}
                            <ChevronUpDownIcon className="w-5 h-5 text-gray-400 ml-2" />
                          </Listbox.Button>
                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {COUNTRIES.map(c => (
                              <Listbox.Option key={c.code} value={c.code} className={({ active }) => `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'bg-indigo-700 text-white' : 'text-white'}`}>
                                {({ selected }) => (
                                  <>
                                    <span className="flex items-center">
                                      <img src={`https://flagcdn.com/24x18/${c.code.toLowerCase()}.png`} alt="flag" className="inline mr-2 rounded-sm" width={24} height={18} />
                                      {c.name}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <CheckIcon className="w-5 h-5 text-indigo-400" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>
                  </div>
                  {formError && <div className="text-red-400 text-sm">{formError}</div>}
                  <button type="submit" disabled={saving} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold shadow hover:bg-indigo-700 transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
        <style>{`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
          .animate-fadeInUp { animation: fadeInUp 1.1s cubic-bezier(0.4,0,0.2,1) both; }
          .profile-anim:hover { transform: scale(1.08); box-shadow: 0 4px 24px #6366f155; }
        `}</style>
      </div>
    </div>
  );
} 