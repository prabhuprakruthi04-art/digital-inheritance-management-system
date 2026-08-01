import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  KeyRound,
  FileText,
  Lock,
  Unlock,
  Download,
  Upload,
  CheckCircle2,
} from 'lucide-react';

export const NomineeDashboardPage: React.FC = () => {
  const { showToast } = useApp();
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);

  const nomineeAllocations = [
    {
      id: 'nom-ast-1',
      assetName: 'Bitcoin Cold Storage Vault (18.5 BTC)',
      owner: 'Alexander Vance',
      allocatedShare: '50% Share ($625,000 value)',
      status: 'Timelocked - Heartbeat Active',
      keyThreshold: '2 of 3 Nominees required',
      heartbeatInterval: 'Ping required every 90 days',
      unlocked: false,
    },
    {
      id: 'nom-ast-2',
      assetName: 'Master Passwords & Security Keys Vault',
      owner: 'Alexander Vance',
      allocatedShare: '100% Primary Beneficiary',
      status: 'Timelocked - Ping Warning Overdue',
      keyThreshold: '1 of 2 Nominees required',
      heartbeatInterval: 'Ping overdue by 4 days',
      unlocked: false,
    },
    {
      id: 'nom-ast-3',
      assetName: 'Family Real Estate Deeds & Titles',
      owner: 'Alexander Vance',
      allocatedShare: '33% Joint Heir',
      status: 'Verified & Claimable (Test Vault)',
      keyThreshold: 'Claim Verified',
      heartbeatInterval: 'Heartbeat Expired',
      unlocked: true,
    },
  ];

  const handleClaimRequest = () => {
    setClaimSubmitted(true);
    showToast('Inheritance claim petition broadcast to smart contract quorum.');
  };

  return (
    <div className="space-y-6 text-slate-800 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Nominee Inheritance Hub</h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">
              Verified Beneficiary: Eleanor Vance
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            View allocated digital assets, identity verification status, and claim timelocks.
          </p>
        </div>
      </div>

      {/* Nominee Verification Status Banner */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-white via-indigo-50/70 to-blue-50/50 p-6 shadow-md shadow-indigo-900/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 border border-indigo-200 shrink-0 shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                Identity Status: ZK-Identity Verified
              </div>
              <p className="mt-0.5 text-xs text-slate-600">
                Wallet <span className="font-mono text-indigo-700 font-bold">0x71C...39A1</span> is bound to Estate #VANCE-2026. Zero-Knowledge proof active.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Assigned Vaults:</span>
            <span className="font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl">3 Vaults</span>
          </div>
        </div>
      </div>

      {/* Allocated Inheritance Assets */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-indigo-600" /> Designated Digital Assets & Keys
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {nomineeAllocations.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition ${
                item.unlocked
                  ? 'border-emerald-300 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm'
                  : 'border-slate-200 bg-white shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Vault Asset
                  </span>
                  {item.unlocked ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <Unlock className="h-3 w-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                      <Lock className="h-3 w-3" /> Encrypted
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900">{item.assetName}</h4>
                <div className="text-xs font-bold text-indigo-600">{item.allocatedShare}</div>
                <div className="text-[11px] text-slate-500">Vault Owner: {item.owner}</div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Threshold:</span>
                  <span className="font-mono font-bold text-slate-800">{item.keyThreshold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Heartbeat:</span>
                  <span className="text-slate-800 font-semibold">{item.heartbeatInterval}</span>
                </div>
              </div>

              {item.unlocked ? (
                <button
                  onClick={() => showToast('Decrypted key shard downloaded to secure enclave.')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs"
                >
                  <Download className="h-4 w-4" /> Download Decrypted Key & Asset
                </button>
              ) : (
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed border border-slate-200"
                >
                  <Lock className="h-3.5 w-3.5" /> Timelocked Until Heartbeat Expiry
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Claim Petition & Verification Proof Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" /> Nominee Claim Petition & Proof Submission
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit formal proof of claim or legal certificate to request smart contract key release review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selected Estate Vault
              </label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium">
                <option>Vault #101 - Main Wealth & Crypto Vault Key</option>
                <option>Vault #102 - Real Estate & Legal Documents Key</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Claim Justification Note
              </label>
              <textarea
                rows={3}
                placeholder="Provide notes or legal trustee reference details..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Upload Verification Document (Death Certificate / Court Authorization)
            </label>
            <div
              onClick={() => {
                setDocUploaded(true);
                showToast('Legal proof document encrypted & attached to petition.');
              }}
              className="cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-6 hover:border-blue-400 hover:bg-blue-50/40 transition"
            >
              <Upload className="h-6 w-6 text-blue-600 mb-2" />
              {docUploaded ? (
                <div className="text-center text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Proof_Document_Encrypted.pdf Attached
                </div>
              ) : (
                <>
                  <div className="text-xs font-bold text-slate-700">Click to upload ZK-Encrypted Proof</div>
                  <div className="text-[10px] text-slate-500 mt-1">PDF, PNG or JPG up to 25MB</div>
                </>
              )}
            </div>

            <button
              onClick={handleClaimRequest}
              disabled={claimSubmitted}
              className={`w-full rounded-xl py-3 text-xs font-bold text-white transition shadow-xs ${
                claimSubmitted
                  ? 'bg-emerald-600 opacity-90 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {claimSubmitted ? 'Claim Petition Broadcasted to Quorum' : 'Submit Claim Petition to Smart Contract'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
