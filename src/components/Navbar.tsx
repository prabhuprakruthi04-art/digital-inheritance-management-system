import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Bell,
  Search,
  Wallet,
  User,
  ChevronDown,
  Menu,
  HelpCircle,
  LogOut,
  Settings,
} from 'lucide-react';
import { WalletModal } from './WalletModal';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    activePage,
    setActivePage,
    userRole,
    setUserRole,
    walletConnected,
    walletAddress,
    notifications,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    showToast,
  } = useApp();

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 md:px-6 backdrop-blur-md shadow-xs">
        {/* Left Section: Mobile Menu + Logo / Page Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 md:hidden transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div
            onClick={() => setActivePage('landing')}
            className="flex cursor-pointer items-center gap-2.5 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold tracking-tight text-slate-900">CipherInherit</span>
              <span className="ml-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-200/60">
                PRO
              </span>
            </div>
          </div>

          {/* Quick Role Simulation Badge */}
          <div className="ml-2 hidden lg:flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50 p-1 text-xs">
            <span className="px-2 text-slate-400 font-medium">Role:</span>
            <button
              onClick={() => {
                setUserRole('owner');
                setActivePage('owner-dashboard');
                showToast('Switched persona view to Asset Owner');
              }}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                userRole === 'owner'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Owner
            </button>
            <button
              onClick={() => {
                setUserRole('nominee');
                setActivePage('nominee-dashboard');
                showToast('Switched persona view to Nominee');
              }}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                userRole === 'nominee'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Nominee
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                setActivePage('admin-dashboard');
                showToast('Switched persona view to Admin Auditor');
              }}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                userRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Center Section: Global Search Bar */}
        <div className="hidden md:flex max-w-md w-full mx-4 items-center relative">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets, nominees, keys, hashes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        {/* Right Section: Notifications + Wallet Button + Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 text-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Notifications ({notifications.length})
                  </h4>
                  <button
                    onClick={() => {
                      markAllNotificationsRead();
                      setShowNotifDropdown(false);
                    }}
                    className="text-[11px] font-medium text-blue-600 hover:underline"
                  >
                    Mark read
                  </button>
                </div>
                <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setActivePage('notifications');
                        setShowNotifDropdown(false);
                      }}
                      className={`cursor-pointer rounded-xl p-2.5 text-xs transition ${
                        !n.read
                          ? 'bg-blue-50/80 border border-blue-100 text-slate-800'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium text-slate-900">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="mt-1 text-slate-500 line-clamp-2">{n.description}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setActivePage('notifications');
                    setShowNotifDropdown(false);
                  }}
                  className="mt-3 w-full rounded-xl bg-slate-100 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>

          {/* Connect Wallet Button (UI Request) */}
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition shadow-xs ${
              walletConnected
                ? 'border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">
              {walletConnected ? walletAddress : 'Connect Wallet'}
            </span>
            <span className="sm:hidden">{walletConnected ? 'Connected' : 'Connect'}</span>
          </button>

          {/* Profile Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-2.5 hover:bg-slate-100 transition"
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                alt="Profile"
                className="h-7 w-7 rounded-lg object-cover ring-2 ring-blue-500/30"
              />
              <span className="hidden md:inline text-xs font-semibold text-slate-700">
                A. Vance
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs text-slate-800">
                <div className="p-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900">Alexander Vance</div>
                  <div className="text-[11px] text-slate-500">owner@ciphervault.eth</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActivePage('profile');
                      setShowProfileDropdown(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('settings');
                      setShowProfileDropdown(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    Account Settings
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('about');
                      setShowProfileDropdown(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
                  >
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                    Help & FAQ
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setActivePage('login');
                      setShowProfileDropdown(false);
                      showToast('Logged out of session');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-rose-600 hover:bg-rose-50 font-semibold"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
};
