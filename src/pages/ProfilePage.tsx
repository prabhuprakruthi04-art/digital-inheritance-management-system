import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { walletAddress, showToast } = useApp();

  const [name, setName] = useState('Alexander Vance');
  const [email, setEmail] = useState('alexander@ciphervault.eth');
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [emergencyContact, setEmergencyContact] = useState('Eleanor Vance (Spouse)');
  const [showSeed, setShowSeed] = useState(false);

  const mockSeedPhrase =
    'alpha horizon quantum crystal velvet shadow horizon thunder echo silver mountain anchor';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile and emergency contacts updated successfully.');
  };

  return (
    <div className="space-y-6 text-slate-800 pb-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Owner Profile & Security</h1>
        <p className="mt-1 text-xs text-slate-500">
          Manage identity metadata, wallet keys, Shamir secret backup, and emergency recovery contacts.
        </p>
      </div>

      {/* User Overview Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
            alt="User Avatar"
            className="h-16 w-16 rounded-2xl object-cover ring-4 ring-blue-100 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{name}</h2>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                Primary Vault Owner
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">{email}</div>
            <div className="mt-2 font-mono text-xs text-blue-600 bg-blue-50/70 px-2.5 py-1 rounded-lg border border-blue-200 inline-block font-bold">
              Wallet: {walletAddress}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Security Score</div>
            <div className="text-lg font-extrabold text-emerald-600">98 / 100</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Shield className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSaveProfile} className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Personal Information & Emergency Contacts</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (SMS Heartbeat Ping Alerts)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Emergency Contact</label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
        >
          Save Profile Changes
        </button>
      </form>

      {/* Shamir Recovery Seed Phrase Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-amber-600" /> Shamir Master Seed Phrase Backup
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              12-word seed used to locally reconstruct your non-custodial master key.
            </p>
          </div>

          <button
            onClick={() => setShowSeed(!showSeed)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            {showSeed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showSeed ? 'Hide Seed' : 'Reveal Seed'}</span>
          </button>
        </div>

        {showSeed ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-mono text-xs font-bold text-amber-900 leading-relaxed tracking-wider">
            {mockSeedPhrase}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-400 text-center tracking-widest font-bold">
            •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••
          </div>
        )}
      </div>
    </div>
  );
};
