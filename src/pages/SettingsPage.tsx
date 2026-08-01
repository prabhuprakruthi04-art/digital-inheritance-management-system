import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Lock, Save, Globe } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useApp();

  const [defaultTimer, setDefaultTimer] = useState('90');
  const [network, setNetwork] = useState('Sepolia Testnet');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoPingOnLogin, setAutoPingOnLogin] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform preferences and Dead Man\'s Switch configurations saved.');
  };

  return (
    <div className="space-y-6 text-slate-800 pb-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Vault & Protocol Settings</h1>
        <p className="mt-1 text-xs text-slate-500">
          Configure default heartbeat frequencies, Web3 RPC network endpoints, and automated ping alert triggers.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Dead Man's Switch Config */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600" /> Default Dead Man's Switch Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Heartbeat Interval
              </label>
              <select
                value={defaultTimer}
                onChange={(e) => setDefaultTimer(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
              >
                <option value="30">30 Days (~1 Month)</option>
                <option value="90">90 Days (~3 Months)</option>
                <option value="180">180 Days (~6 Months)</option>
                <option value="365">365 Days (1 Year)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Shamir Threshold Quorum
              </label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium">
                <option>2 of 3 Nominees (Recommended)</option>
                <option>3 of 5 Nominees</option>
                <option>Majority Quorum (&gt;50%)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoPingOnLogin}
                onChange={(e) => setAutoPingOnLogin(e.target.checked)}
                className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
              />
              Auto-send heartbeat ping whenever I log into the application
            </label>
          </div>
        </div>

        {/* Section 2: Notifications & Ping Warnings */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-4 w-4 text-indigo-600" /> Ping Reminder Dispatch Channels
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200 cursor-pointer">
              <span className="font-semibold text-slate-800">Send Email Reminders 14 & 7 Days Before Expiry</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200 cursor-pointer">
              <span className="font-semibold text-slate-800">Send SMS Heartbeat Warning Alerts</span>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Web3 RPC Network */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-600" /> Blockchain RPC & Smart Contract Network
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target EVM Chain</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
            >
              <option value="Sepolia Testnet">Sepolia Testnet (Default)</option>
              <option value="Ethereum Mainnet">Ethereum Mainnet</option>
              <option value="Arbitrum One">Arbitrum One L2</option>
              <option value="Polygon Pos">Polygon PoS</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
        >
          <Save className="h-4 w-4" /> Save Preferences
        </button>
      </form>
    </div>
  );
};
