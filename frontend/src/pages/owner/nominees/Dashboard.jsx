import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FolderLock, 
  Lock, 
  UserCheck, 
  Info, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import AppLayout from "../../../components/layout/AppLayout";

export default function NomineeDashboard() {
  const [ownerDetails] = useState({
    name: "Alex Morgan",
    wallet: "0x71C...3a29",
    status: "Active & Protected",
    lastHeartbeat: "2 hours ago",
  });

  const [assignedAssets] = useState([
    { id: 1, name: "Crypto Recovery Keys & Seed Phrase", type: "Credentials", size: "12 KB", status: "Locked", cid: "QmTeGRzjJFmy1QekpkyXgUNjrpu1Mo1LsF3RdW" },
    { id: 2, name: "Legal Will & Property Deeds", type: "PDF Document", size: "4.2 MB", status: "Locked", cid: "QmW2WQi7j6c7MgJ8k9Lp3x5q8RtY2vB1n4m6K" },
    { id: 3, name: "Family Digital Vault Archive", type: "Encrypted Zip", size: "1.8 GB", status: "Locked", cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
  ]);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto font-sans">
        
        {/* Hello to the Nominee */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/30 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Nominee Portal Authenticated
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Hello, Trusted Nominee 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Welcome to your decentralized custody portal. You are officially designated to securely oversee and inherit mapped assets if owner inactivity thresholds trigger.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center min-w-[180px]">
            <p className="text-xs text-slate-400 font-medium">Assigned Vaults</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{assignedAssets.length}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Encrypted via IPFS</p>
          </div>
        </div>

        {/* Assigned Details & Owner Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Owner Profile</h3>
                <p className="text-xs text-slate-500">Account Mapping Status</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Owner Name:</span>
                <span className="font-bold text-slate-800">{ownerDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Wallet / ID:</span>
                <span className="font-mono text-indigo-600">{ownerDetails.wallet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">{ownerDetails.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Last Heartbeat:</span>
                <span className="text-slate-700">{ownerDetails.lastHeartbeat}</span>
              </div>
            </div>

            <a 
              href="/nominee/claims"
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              Initiate Claim Process <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                  <FolderLock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Assigned Vault Assets</h3>
                  <p className="text-xs text-slate-500">Decentralized IPFS records linked to you</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                {assignedAssets.length} Files Mapped
              </span>
            </div>

            <div className="space-y-3">
              {assignedAssets.map((asset) => (
                <div key={asset.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-white rounded-xl shadow-xs flex items-center justify-center text-slate-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{asset.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">CID: {asset.cid.substring(0, 24)}...</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* About Website / DIMS Project */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">About Digital Inheritance Management System (DIMS)</h3>
              <p className="text-xs text-slate-400">Decentralized custody, encryption, and automated dead man's switch workflow.</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            <strong>DIMS</strong> ensures that critical digital records, cryptocurrency recovery keys, and legal wills are safely transferred to trusted nominees without relying on centralized third parties. Utilizing <strong>AES-256 encryption</strong>, <strong>Shamir's Secret Sharing</strong>, and <strong>IPFS decentralized storage</strong>, your assets remain completely private and secure until inactivity timers lapse and multi-factor verification passes.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}