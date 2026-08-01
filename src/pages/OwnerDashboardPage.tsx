import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Coins,
  Users,
  Clock,
  CheckCircle,
  Activity,
  Plus,
  KeyRound,
  UserPlus,
  Upload,
  ShieldCheck,
  Lock,
  ChevronRight,
  RefreshCcw,
} from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const {
    assets,
    nominees,
    setActivePage,
    pingHeartbeat,
    deleteAsset,
  } = useApp();

  const totalAssetsCount = assets.length;
  const totalNomineesCount = nominees.length;
  const pendingRequestsCount = 2; // Pending verification requests
  const releasedAssetsCount = 1; // Released vaults

  return (
    <div className="space-y-6 text-slate-800 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Owner Vault Dashboard</h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              Heartbeat Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Overview of your non-custodial digital inheritance assets, threshold keys, and nominees.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => pingHeartbeat()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition"
          >
            <Activity className="h-4 w-4 animate-pulse" /> Send Heartbeat Ping ("I'm Alive")
          </button>
          <button
            onClick={() => setActivePage('create-key')}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
          >
            <Plus className="h-4 w-4" /> Create Key
          </button>
        </div>
      </div>

      {/* Dead Man's Switch Heartbeat Status Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-r from-white via-blue-50/70 to-indigo-50/50 p-6 shadow-md shadow-blue-900/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 border border-blue-200 shrink-0 mt-0.5 shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span>Heartbeat Status: Healthy & Active</span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="mt-0.5 text-xs text-slate-600 max-w-xl">
                Last Heartbeat recorded on <span className="text-slate-800 font-semibold">2026-07-28 14:30 UTC</span>.
                Next ping due in <span className="text-blue-700 font-bold">89 days</span> before automated key threshold triggers release.
              </p>
            </div>
          </div>

          <button
            onClick={() => pingHeartbeat()}
            className="self-start md:self-auto flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition shrink-0 shadow-xs"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Reset Countdown Timer
          </button>
        </div>
      </div>

      {/* 4 TOP CARDS EXPLICITLY REQUESTED IN PROMPT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Digital Assets */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden group hover:border-blue-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Digital Assets</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">$2,485,900</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-bold text-blue-600">{totalAssetsCount} Enrolled Vaults</span>
              <span>across crypto & legal</span>
            </div>
          </div>
        </div>

        {/* Card 2: Number of Nominees */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden group hover:border-indigo-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Number of Nominees</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{totalNomineesCount} Nominees</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-bold text-emerald-600">3 Verified</span>
              <span>• 1 Pending ID</span>
            </div>
          </div>
        </div>

        {/* Card 3: Pending Requests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden group hover:border-amber-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Requests</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-700">{pendingRequestsCount} Pending</div>
            <div className="mt-1 text-xs text-slate-500">
              Key #103 ping & ID verification
            </div>
          </div>
        </div>

        {/* Card 4: Released Assets */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden group hover:border-emerald-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Released Assets</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600">{releasedAssetsCount} Archived Vault</div>
            <div className="mt-1 text-xs text-slate-500">
              Test Vault #009 successfully handed off
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActivePage('create-key')}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:bg-blue-50/50 transition shadow-xs text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Create Digital Key</div>
              <div className="text-[11px] text-slate-500">Setup Shamir secret sharing</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition" />
        </button>

        <button
          onClick={() => setActivePage('add-nominee')}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:bg-indigo-50/50 transition shadow-xs text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Add Nominee</div>
              <div className="text-[11px] text-slate-500">Set allocation % & access rules</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition" />
        </button>

        <button
          onClick={() => setActivePage('upload-docs')}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-300 hover:bg-emerald-50/50 transition shadow-xs text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">Upload Documents</div>
              <div className="text-[11px] text-slate-500">AES-256 IPFS storage</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition" />
        </button>
      </div>

      {/* Main Asset & Nominee Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Enrolled Assets List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Coins className="h-4 w-4 text-blue-600" /> Managed Digital Assets ({assets.length})
            </h3>
            <button
              onClick={() => setActivePage('asset-list')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View All Assets →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Asset Name & Type</th>
                    <th className="px-4 py-3">Est. Value</th>
                    <th className="px-4 py-3">Primary Nominee</th>
                    <th className="px-4 py-3">Encryption</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.slice(0, 4).map((ast) => (
                    <tr key={ast.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Lock className="h-3.5 w-3.5 text-blue-600" />
                          <span>{ast.name}</span>
                        </div>
                        <div className="text-[10px] font-medium text-slate-400">{ast.category}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">{ast.value}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 border border-blue-100">
                          {ast.nomineeName} ({ast.allocationPercentage}%)
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                          {ast.encryptionLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteAsset(ast.id)}
                          className="text-[11px] font-bold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Nominees Quick Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" /> Designated Nominees
            </h3>
            <button
              onClick={() => setActivePage('add-nominee')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              + Add Nominee
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
            {nominees.slice(0, 3).map((nom) => (
              <div
                key={nom.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={nom.avatar}
                    alt={nom.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{nom.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {nom.relationship} • {nom.allocatedPercentage}% Share
                    </div>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    nom.verificationStatus === 'Verified'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {nom.verificationStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
