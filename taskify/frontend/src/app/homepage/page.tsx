import Link from "next/link";

export default function HomePage() {
  // Placeholder user info; replace with real data when backend is connected
  const user = {
    firstName: "User",
    lastName: "Name",
    email: "user@example.com",
    profilePic: null, // null means use initials
  };
  const userInitials = user.firstName[0] + user.lastName[0];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-white to-purple-100">
        
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-2xl flex flex-col justify-between h-screen fixed left-0 top-0 z-20 border-r border-gray-100">
        <div>
        <div className="px-8 py-6 text-2xl font-extrabold text-blue-700 tracking-tight">Taskify</div>
          <div className="flex flex-col items-center gap-2 pt-8 pb-6 border-b border-gray-100">
            {/* Profile Picture */}
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow" />
            ) : (
              <span className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700 border-4 border-blue-200 shadow">
                {userInitials}
              </span>
            )}
            {/* User Name */}
            <div className="text-lg font-semibold text-gray-800 mt-2">{user.firstName} {user.lastName}</div>
            {/* User Email */}
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
         
          <nav className="flex flex-col gap-2 mt-4 px-4">
            <Link href="/homepage" className="py-2 px-4 rounded-lg font-medium text-gray-800 hover:bg-blue-50 transition">Dashboard</Link>
            <Link href="/tasks" className="py-2 px-4 rounded-lg font-medium text-gray-800 hover:bg-blue-50 transition">My Tasks</Link>
            <Link href="/categories" className="py-2 px-4 rounded-lg font-medium text-gray-800 hover:bg-blue-50 transition">Task Categories</Link>
            <Link href="/settings" className="py-2 px-4 rounded-lg font-medium text-gray-800 hover:bg-blue-50 transition">Settings</Link>
            <Link href="/help" className="py-2 px-4 rounded-lg font-medium text-gray-800 hover:bg-blue-50 transition">Help</Link>
          </nav>
        </div>
        <div className="px-4 pb-6">
          <Link href="/auth/login" className="block w-full text-center py-2 rounded-lg font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition">Logout</Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full h-20 bg-white shadow flex items-center justify-between px-10 border-b border-gray-100 sticky top-0 z-10">
          <div className="text-2xl font-bold text-gray-800">Welcome back, {user.firstName}!</div>
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-blue-700 border-2 border-blue-400">
              {userInitials}
            </span>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-10">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome to your dashboard!</h1>
          <p className="text-gray-700 text-lg mb-4">Get started by creating a new task or exploring your lists.</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition mb-2" disabled>
            + Create Task
          </button>
        </main>
      </div>
    </div>
  );
} 