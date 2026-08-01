import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  KeyRound,
  RefreshCcw,
  Lock,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const KeyStatusPage: React.FC = () => {
  const { keys, pingHeartbeat } = useApp();

  return (
    <div className="space-y-6 text-slate-800 pb-8">
      {/* Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Digital Key Status & Heartbeat Monitor</h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time automated heartbeat ping monitoring and Shamir threshold secret shard state.
          </p>
        </div>

        <button
          onClick={() => pingHeartbeat()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/10 hover:from-emerald-700 hover:to-teal-700 transition"
        >
          <Activity className="h-4 w-4 animate-pulse" /> Ping Global Heartbeat Now
        </button>
      </div>

      {/* Keys Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {keys.map((k) => {
          const isWarning = k.status.includes('Warning') || k.status.includes('Overdue');
          return (
            <div
              key={k.id}
              className={`rounded-3xl border p-5 space-y-4 flex flex-col justify-between shadow-xs ${
                isWarning
                  ? 'border-amber-300 bg-amber-50/70'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600">Key #{k.id}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isWarning
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {k.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{k.keyName}</h3>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Switch Interval:</span>
                    <span className="font-bold text-slate-900">{k.deadMansSwitchDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Heartbeat:</span>
                    <span className="text-slate-900 font-medium">{k.lastHeartbeat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Next Due:</span>
                    <span className={`font-bold ${isWarning ? 'text-amber-700' : 'text-blue-600'}`}>
                      {k.nextHeartbeatDue}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Quorum Required:</span>
                    <span className="font-mono font-bold text-blue-600">{k.thresholdRequired}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => pingHeartbeat(k.id)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition shadow-xs ${
                  isWarning
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <RefreshCcw className="h-3.5 w-3.5" /> Send Ping for Key #{k.id}
              </button>
            </div>
          );
        })}
      </div>

      {/* Shamir Secret Sharing Key Shard Visualization */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-indigo-600" /> Shamir Threshold Key Shard Architecture
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic demonstration of how master key shards are distributed across nominee nodes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-2">
            <div className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-blue-600" /> Key Shard #1 (Spouse)
            </div>
            <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-blue-200">
              0x82f1...99a0 (Encrypted)
            </div>
            <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-bold">
              <CheckCircle2 className="h-3 w-3" /> Assigned: Eleanor Vance
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-2">
            <div className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-indigo-600" /> Key Shard #2 (Son)
            </div>
            <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-indigo-200">
              0x14b3...e21c (Encrypted)
            </div>
            <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-bold">
              <CheckCircle2 className="h-3 w-3" /> Assigned: Marcus Vance
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-4 space-y-2">
            <div className="text-xs font-bold text-cyan-800 flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-cyan-600" /> Key Shard #3 (Legal Executor)
            </div>
            <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-cyan-200">
              0x33e8...d912 (Encrypted)
            </div>
            <div className="text-[10px] text-amber-700 flex items-center gap-1 font-bold">
              <Clock className="h-3 w-3" /> Pending ID Verification
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
