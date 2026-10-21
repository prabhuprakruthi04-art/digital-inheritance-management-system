import React, { useState } from 'react';
import { 
  FolderLock, 
  Lock, 
  FileDown, 
  FileText, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Key
} from 'lucide-react';

export default function NomineeAssets() {
  const [step, setStep] = useState(1);
  const [authId, setAuthId] = useState("DIMS-AUTH-882910");
  const [otp, setOtp] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("QmTeGRzjJFmy1QekpkyXgUNjrpu1Mo1LsF3RdW");

  // Assigned assets linked to the nominee profile
  const [assignedAssets] = useState([
    { id: 1, name: "Crypto Recovery Keys & Seed Phrase", type: "Credentials", size: "12 KB", cid: "QmTeGRzjJFmy1QekpkyXgUNjrpu1Mo1LsF3RdW", status: "Ready for Claim" },
    { id: 2, name: "Legal Will & Property Deeds", type: "PDF Document", size: "4.2 MB", cid: "QmW2WQi7j6c7MgJ8k9Lp3x5q8RtY2vB1n4m6K", status: "Locked" },
    { id: 3, name: "Family Digital Vault Archive", type: "Encrypted Zip", size: "1.8 GB", cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco", status: "Locked" },
  ]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-6 font-sans text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Decentralized Custody Vault
          </span>
          <h3 className="text-2xl font-extrabold text-white">Assigned Assets & Inheritance Claims</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Securely manage and trigger the cryptographic reconstruction of assets assigned to your nominee profile via IPFS and Shamir's Secret Sharing.
          </p>
        </div>
      </div>

      {/* Main Interactive Workflow Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
        
        {/* Step Indicator Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-2xl border transition-all flex items-center space-x-4 ${step === 1 ? 'bg-emerald-600/10 border-emerald-500/50 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs ${step === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1</div>
            <div>
              <p className="text-xs font-semibold">Step 1</p>
              <p className="text-sm font-bold">Authorize Transfer ID</p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all flex items-center space-x-4 ${step === 2 ? 'bg-emerald-600/10 border-emerald-500/50 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs ${step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2</div>
            <div>
              <p className="text-xs font-semibold">Step 2</p>
              <p className="text-sm font-bold">Verify Security OTP</p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all flex items-center space-x-4 ${step === 3 ? 'bg-emerald-600/10 border-emerald-500/50 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>3</div>
            <div>
              <p className="text-xs font-semibold">Step 3</p>
              <p className="text-sm font-bold">Reconstruct & Download</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-300">
          <span>🔒 <strong>Estate Verification:</strong> Enter the Transfer Authorization ID and the confidential 6-digit verification OTP dispatched to your nominee email.</span>
          <span className="text-slate-500 font-mono">Zero-Knowledge Verification</span>
        </div>

        {/* STEP 1 FORM */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Key size={14} className="text-emerald-400" /> Transfer Authorization ID *
              </label>
              <input 
                type="text" 
                value={authId}
                onChange={(e) => setAuthId(e.target.value)}
                placeholder="e.g. DIMS-AUTH-882910"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Assigned Asset (IPFS CID Mapping) *</label>
              <div className="relative">
                <select 
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono appearance-none cursor-pointer pr-10"
                >
                  {assignedAssets.map((asset) => (
                    <option key={asset.id} value={asset.cid} className="bg-slate-900 text-white">
                      {asset.name} ({asset.type}) — {asset.size}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              Validate & Request OTP <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Enter 6-Digit Verification OTP *</label>
              <input 
                type="text" 
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                className="w-full max-w-xs mx-auto bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono tracking-widest text-center text-xl"
              />
              <p className="text-xs text-slate-500 pt-1">Enter the confidential 6-digit OTP received via email to reconstruct key shares.</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="w-1/3 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition border border-slate-800 cursor-pointer"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  if (otp.length === 6) {
                    setStep(3);
                  } else {
                    alert("Please enter the 6-digit security OTP sent to your email.");
                  }
                }}
                className="w-2/3 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                Verify & Reconstruct Key Shares <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 SUCCESS & DOWNLOAD */}
        {step === 3 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="text-xl font-bold text-white">Shamir Key Shares Reconstructed Successfully!</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The decentralized threshold conditions have been met. AES-256 decryption key has been assembled. You can now safely decrypt and download your assigned asset from IPFS.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left max-w-lg mx-auto space-y-2 font-mono text-xs">
              <p className="text-emerald-400 font-bold">Target IPFS CID:</p>
              <p className="text-slate-400 break-all">{selectedAsset}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <a 
                href={`https://gateway.pinata.cloud/ipfs/${selectedAsset}`}
                target="_blank"
                rel="noreferrer"
                className="py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
              >
                <FileDown className="w-5 h-5" /> Download Decrypted Asset <ExternalLink className="w-4 h-4" />
              </a>
              <button 
                onClick={() => { setStep(1); setOtp(""); }}
                className="py-4 px-6 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition border border-slate-800 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
              >
                <RefreshCw className="w-4 h-4" /> Reset Claim
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}