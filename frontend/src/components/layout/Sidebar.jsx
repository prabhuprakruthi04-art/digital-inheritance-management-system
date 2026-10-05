import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Users,
  Activity,
  Settings,
  ShieldCheck,
  KeyRound,
  Info,
  LogOut,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Route evaluation
  const isNomineeRoute = location.pathname.startsWith("/nominee");

  // Owner specific navigation links
  const ownerNavItems = [
    { label: "Dashboard", path: "/owner", icon: LayoutDashboard },
    { label: "Assets Vault", path: "/owner/assets", icon: FolderKanban },
    { label: "Documents", path: "/owner/documents", icon: FileText },
    { label: "Nominees", path: "/owner/nominees", icon: Users },
    { label: "Heartbeat Check", path: "/owner/heartbeat", icon: Activity },
    { label: "Settings", path: "/owner/settings", icon: Settings },
  ];

  // Nominee specific navigation links (Owner-only links strictly hidden)
  const nomineeNavItems = [
    { label: "Command Center", path: "/nominee", icon: LayoutDashboard },
    { label: "Claims Portal", path: "/nominee/claims", icon: KeyRound },
    { label: "Assigned Assets", path: "/nominee/assets", icon: FolderKanban },
    { label: "About DIMS", path: "/nominee/about", icon: Info },
  ];

  const currentNavItems = isNomineeRoute ? nomineeNavItems : ownerNavItems;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside
      className={`w-64 shrink-0 min-h-screen p-6 flex flex-col justify-between transition-colors duration-300 border-r ${
        isNomineeRoute
          ? "bg-slate-950 border-slate-800/80 text-slate-100"
          : "bg-indigo-700 border-indigo-800 text-white"
      }`}
    >
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div
            className={`p-2.5 rounded-2xl flex items-center justify-center transition-all ${
              isNomineeRoute
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-950/50"
                : "bg-white/20 text-white"
            }`}
          >
            <ShieldCheck size={26} />
          </div>
          <div>
            <span className="text-2xl font-black tracking-wider block leading-tight">
              DIMS
            </span>
            <p
              className={`text-[10px] uppercase font-bold tracking-widest ${
                isNomineeRoute ? "text-emerald-400" : "text-indigo-200"
              }`}
            >
              {isNomineeRoute ? "Nominee Vault" : "Owner Portal"}
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Menu */}
        <nav className="space-y-1.5">
          <p
            className={`text-[10px] font-bold uppercase tracking-widest px-3 mb-2 ${
              isNomineeRoute ? "text-slate-500" : "text-indigo-300"
            }`}
          >
            {isNomineeRoute ? "Nominee Operations" : "Estate Management"}
          </p>

          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? isNomineeRoute
                      ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/40 translate-x-1"
                      : "bg-white/20 text-white font-bold shadow-sm translate-x-1"
                    : isNomineeRoute
                    ? "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-white"
                        : isNomineeRoute
                        ? "text-slate-400"
                        : "text-indigo-200"
                    }
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Status & Logout */}
      <div className="space-y-4 pt-6 border-t border-slate-800/60">
        {isNomineeRoute ? (
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400 font-bold">
              <span>SECURITY PROTOCOL</span>
              <span>ACTIVE</span>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-400">
              Shamir SSS (2-of-3) & IPFS custody active.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-indigo-800/40 rounded-xl text-[11px] text-indigo-200 space-y-1">
            <p className="font-bold text-white text-[11px]">Heartbeat Active</p>
            <p className="text-[10px]">Proof-of-life checks scheduled every 60s.</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-md ${
            isNomineeRoute
              ? "bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50"
              : "bg-red-600/80 hover:bg-red-600 text-white"
          }`}
        >
          <LogOut size={16} />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
}