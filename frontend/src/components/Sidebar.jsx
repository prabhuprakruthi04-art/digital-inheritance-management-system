import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Users, 
  Activity 
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/owner", icon: LayoutDashboard },
    { label: "Assets", path: "/owner/assets", icon: FolderKanban },
    { label: "Documents", path: "/owner/documents", icon: FileText },
    { label: "Nominees", path: "/owner/nominees", icon: Users },
    { label: "Heartbeat", path: "/owner/heartbeat", icon: Activity },
  ];

  return (
    <aside className="w-64 min-h-screen bg-indigo-700 text-white p-6 flex flex-col justify-between">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3">
          <span className="text-2xl font-black tracking-wider">DIMS</span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-white/20 text-white font-bold shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="w-full py-3 px-4 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
      >
        Logout
      </button>
    </aside>
  );
}