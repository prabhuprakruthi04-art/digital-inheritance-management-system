import React from 'react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import {
  Home,
  LayoutDashboard,
  UserCheck,
  ShieldAlert,
  KeyRound,
  UserPlus,
  Coins,
  Upload,
  Activity,
  Bell,
  Settings,
  HelpCircle,
  LogIn,
  UserPlus2,
  Lock,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { activePage, setActivePage, notifications } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navGroups: {
    title: string;
    items: { page: Page; label: string; icon: React.ReactNode; badge?: string | number }[];
  }[] = [
    {
      title: 'Dashboards',
      items: [
        {
          page: 'owner-dashboard',
          label: 'Owner Dashboard',
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          page: 'nominee-dashboard',
          label: 'Nominee Dashboard',
          icon: <UserCheck className="h-4 w-4" />,
        },
        {
          page: 'admin-dashboard',
          label: 'Admin Dashboard',
          icon: <ShieldAlert className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Digital Keys & Assets',
      items: [
        {
          page: 'create-key',
          label: 'Create Digital Key',
          icon: <KeyRound className="h-4 w-4" />,
        },
        {
          page: 'key-status',
          label: 'Key Status & Ping',
          icon: <Activity className="h-4 w-4" />,
          badge: 'PING',
        },
        {
          page: 'asset-list',
          label: 'Asset List',
          icon: <Coins className="h-4 w-4" />,
        },
        {
          page: 'upload-docs',
          label: 'Upload Documents',
          icon: <Upload className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Nominee Management',
      items: [
        {
          page: 'add-nominee',
          label: 'Add Nominee',
          icon: <UserPlus className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Account & Info',
      items: [
        {
          page: 'profile',
          label: 'Profile Page',
          icon: <UserCheck className="h-4 w-4" />,
        },
        {
          page: 'notifications',
          label: 'Notifications',
          icon: <Bell className="h-4 w-4" />,
          badge: unreadNotifs > 0 ? unreadNotifs : undefined,
        },
        {
          page: 'settings',
          label: 'Settings',
          icon: <Settings className="h-4 w-4" />,
        },
        {
          page: 'about',
          label: 'About & FAQ',
          icon: <HelpCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Public & Auth',
      items: [
        {
          page: 'landing',
          label: 'Landing Page',
          icon: <Home className="h-4 w-4" />,
        },
        {
          page: 'login',
          label: 'Login Form',
          icon: <LogIn className="h-4 w-4" />,
        },
        {
          page: 'register',
          label: 'Registration Form',
          icon: <UserPlus2 className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 border-r border-slate-200/80 bg-white px-3 py-4 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto`}
      >
        <div className="space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activePage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => {
                        setActivePage(item.page);
                        onCloseMobile();
                      }}
                      className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`${
                            isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            typeof item.badge === 'string'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Widget */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-sky-50/70 p-3.5 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <Lock className="h-4 w-4 text-blue-600" />
            <span>Dead Man's Switch Active</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 leading-snug">
            Next heartbeat ping due in 89 days.
          </p>
        </div>
      </aside>
    </>
  );
};
