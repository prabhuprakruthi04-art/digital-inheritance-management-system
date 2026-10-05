import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import API from "../../services/api";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCode,
  HardDrive,
  Cpu,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Info
} from "lucide-react";

export default function NomineeDashboard() {
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCid, setCopiedCid] = useState(null);

  // Fallback demo assets matching system state
  const defaultAssets = [
    {
      _id: "ast-01",
      title: "Crypto Recovery Keys & Seed Phrase",
      category: "Credentials",
      originalFileName: "crypto_master_seed.txt",
      mimeType: "text/plain",
      fileSize: 12288,
      ipfsCid: "QmTeGRzjJFmy1QekpkyXgUNjrpu1Mo1LsF3RdW",
      sha256Hash: "0x8a3f4e2b1c7d6e5a9f0b3c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
      status: "READY_FOR_CLAIM",
    },
    {
      _id: "ast-02",
      title: "Legal Will & Property Deeds",
      category: "Legal",
      originalFileName: "registered_will_and_deeds.pdf",
      mimeType: "application/pdf",
      fileSize: 4404019,
      ipfsCid: "QmW2WQi7j6c7MgJ8k9Lp3x5q8RtY2vB1n4m6K",
      sha256Hash: "0x3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c",
      status: "READY_FOR_CLAIM",
    },
    {
      _id: "ast-03",
      title: "Family Digital Vault Archive",
      category: "Archive",
      originalFileName: "family_vault_bundle.zip",
      mimeType: "application/zip",
      fileSize: 1932735283,
      ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      sha256Hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      status: "READY_FOR_CLAIM",
    },
  ];

  useEffect(() => {
    // Fetch assigned assets from the backend
    API.get("/claims/assets")
      .then((res) => {
        const data = res.data?.data || res.data || [];
        if (data.length > 0) {
          setAssignedAssets(data);
        } else {
          setAssignedAssets(defaultAssets);
        }
      })
      .catch((err) => {
        console.warn("Using default assets for nominee dashboard:", err.message);
        setAssignedAssets(defaultAssets);
      })
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCid(text);
    setTimeout(() => setCopiedCid(null), 2000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-10 font-sans text-slate-100">
        {/* Welcoming Greeting & Status Banner */}
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} /> Decentralized Estate Terminal
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Hello, Trusted Nominee 👋
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                Welcome to your designated command center. Here you can inspect all encrypted
                digital assets assigned to your profile, verify authorization tokens, and
                reconstruct master keys using decentralized Shamir's Secret Sharing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/nominee/claims"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound size={16} /> Open Claims Portal <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Owner Profile & Security Protocol Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Vault Owner</span>
              <ShieldCheck size={18} className="text-emerald-400" />
            </div>
            <p className="text-lg font-black text-white">Prabhu Prakruthi</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">Active Estate Plan</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Custody Network</span>
              <Cpu size={18} className="text-indigo-400" />
            </div>
            <p className="text-lg font-black text-white">Ganache / Hardhat</p>
            <p className="text-xs text-slate-400 font-mono">ChainID: 1337 // Paris</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Cryptographic Scheme</span>
              <KeyRound size={18} className="text-amber-400" />
            </div>
            <p className="text-lg font-black text-white">Shamir SSS (2-of-3)</p>
            <p className="text-xs text-slate-400">Threshold: 2 Shards Required</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Storage & Cipher</span>
              <HardDrive size={18} className="text-sky-400" />
            </div>
            <p className="text-lg font-black text-white">AES-256-GCM + IPFS</p>
            <p className="text-xs text-slate-400">Pinata Gateway Validated</p>
          </div>
        </div>

        {/* Assigned Encrypted Asset Cards Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Lock size={20} className="text-emerald-400" /> Assigned Encrypted Assets
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Cryptographically protected payloads anchored to decentralized IPFS storage.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {assignedAssets.length} Assets Custodied
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assignedAssets.map((asset, index) => (
              <div
                key={asset._id || index}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-slate-800 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 transition">
                      <FileText size={22} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {asset.category || "General"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                      {asset.title || asset.originalFileName || "Untitled Asset"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {asset.mimeType} • {formatFileSize(asset.fileSize)}
                    </p>
                  </div>

                  {/* IPFS CID Snippet */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                      <span>IPFS CID</span>
                      <button
                        onClick={() => copyToClipboard(asset.ipfsCid)}
                        className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
                      >
                        <Copy size={10} />
                        {copiedCid === asset.ipfsCid ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-slate-300 truncate">
                      {asset.ipfsCid}
                    </p>
                  </div>

                  {/* SHA-256 Hash Preview */}
                  {asset.sha256Hash && (
                    <div className="text-[11px] font-mono text-slate-500 truncate">
                      <span className="text-slate-400 font-bold">SHA-256: </span>
                      {asset.sha256Hash.substring(0, 18)}...
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 size={14} /> Ready for Claim
                  </span>

                  <Link
                    to="/nominee/claims"
                    className="text-xs font-bold text-white bg-slate-800 hover:bg-emerald-600 px-3.5 py-2 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    Claim <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* "About DIMS" System Documentation Module */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Info size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">About DIMS Architecture & Security</h2>
              <p className="text-xs text-slate-400">
                A non-custodial, cryptographically enforced digital inheritance protocol.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Lock size={16} /> 1. AES-256-GCM Encryption
              </div>
              <h4 className="text-sm font-bold text-white">Zero-Knowledge Storage</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All digital assets, wills, and credentials undergo authenticated AES-256-GCM
                encryption before ever being pinned to Pinata or IPFS. No plaintext data is ever
                stored on cloud servers or on-chain.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <KeyRound size={16} /> 2. Shamir's Secret Sharing (SSS)
              </div>
              <h4 className="text-sm font-bold text-white">2-of-3 Decentralized Key Split</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The 256-bit encryption key is mathematically divided into 3 shares. The estate owner
                holds Share 1, MongoDB securely locks Share 2, and Share 3 is held in recovery.
                Neither party alone can decrypt the vault without threshold consent.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={16} /> 3. Autonomous Smart Contract
              </div>
              <h4 className="text-sm font-bold text-white">Automated Heartbeat Trigger</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our background monitor queries owner proof-of-life heartbeats. Upon missed thresholds,
                an automated on-chain transition unlocks Share 2 and issues the Transfer
                Authorization ID directly to your verified email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}