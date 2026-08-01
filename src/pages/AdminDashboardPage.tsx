import React from 'react';
import { useApp } from '../context/AppContext';
import { initialAuditLogs } from '../data/mockData';
import {
  Database,
  UserCheck,
  FileCheck,
  Server,
  Activity,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { showToast } = useApp();

  return (
    <div className="space-y-6 text-slate-800 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Admin Protocol Auditor</h1>
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
              Auditor Level 3
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Monitor protocol smart contracts, verification queues, IPFS node integrity, and key release audits.
          </p>
        </div>
      </div>

      {/* Admin Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Protocol Locked TVL</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">$42,850,000</div>
          <div className="mt-1 text-[11px] font-bold text-emerald-600">1,842 Active Vaults</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Smart Contract Health</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Server className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">100% Operational</div>
          <div className="mt-1 text-[11px] font-medium text-slate-500">Sepolia & Ethereum Mainnet</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-300 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Pending ID Verifications</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-700">14 Reviews</div>
          <div className="mt-1 text-[11px] font-medium text-slate-500">Avg resolution: 12 minutes</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>IPFS Storage Nodes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">128 Nodes Online</div>
          <div className="mt-1 text-[11px] font-bold text-indigo-600">99.98% Redundancy</div>
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-amber-600" /> Nominee Identity Verification Queue
          </h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">14 pending approvals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Applicant Name</th>
                <th className="px-4 py-3">Wallet Address</th>
                <th className="px-4 py-3">Estate Vault</th>
                <th className="px-4 py-3">ZK Proof Hash</th>
                <th className="px-4 py-3 text-right">Auditor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80 transition">
                <td className="px-4 py-3 font-bold text-slate-900">David Sterling</td>
                <td className="px-4 py-3 font-mono font-bold text-blue-600">0x5D4...11F8</td>
                <td className="px-4 py-3 font-medium text-slate-700">#VANCE-2026</td>
                <td className="px-4 py-3 font-mono text-[10px] text-slate-500">0x918f...a421</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => showToast('Nominee identity approved on-chain!')}
                    className="rounded-xl bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => showToast('Verification flagged for review.')}
                    className="rounded-xl bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
                  >
                    Flag
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition">
                <td className="px-4 py-3 font-bold text-slate-900">Samantha Wright</td>
                <td className="px-4 py-3 font-mono font-bold text-blue-600">0x2A9...88C1</td>
                <td className="px-4 py-3 font-medium text-slate-700">#WRIGHT-8812</td>
                <td className="px-4 py-3 font-mono text-[10px] text-slate-500">0x773a...e890</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => showToast('Nominee identity approved on-chain!')}
                    className="rounded-xl bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => showToast('Verification flagged for review.')}
                    className="rounded-xl bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
                  >
                    Flag
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-blue-600" /> Smart Contract Execution Audit Logs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Event Action</th>
                <th className="px-4 py-3">Signer User</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">On-Chain Proof</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-bold text-slate-900">{log.action}</td>
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{log.user}</td>
                  <td className="px-4 py-3 text-slate-500 font-medium">{log.timestamp}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500">{log.ipfsProof}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
