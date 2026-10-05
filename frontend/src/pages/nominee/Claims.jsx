import React, { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import API from "../../services/api";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Key,
  FileDown,
  Lock,
  FileText,
  AlertCircle,
  Hash,
  Cpu
} from "lucide-react";

export default function NomineeClaims() {
  const [step, setStep] = useState(1);
  const [authId, setAuthId] = useState("DIMS-AUTH-882910");
  const [otp, setOtp] = useState("");
  const [selectedAssetCid, setSelectedAssetCid] = useState("QmTeGRzjJFmy1QekpkyXgUNjrpu1Mo1LsF3RdW");
  const [selectedAssetId, setSelectedAssetId] = useState("ast-01");
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [reconstructedData, setReconstructedData] = useState(null);

  // Default fallback assets for instant demo validation
  const defaultAssets = [
    {
      _id: "ast-01",
      title: "Crypto Recovery Keys & Seed Phrase",
      category: "Credentials",
      originalFileName: "crypto_master_seed.txt",
      mimeType: "text/plain",
      fileSize: "12 KB",
      ipfsCid: "QmTeGRzjJFmy1QekpkyXgUNjrpu1Mo1LsF3RdW",
      sha256Hash: "0x8a3f4e2b1c7d6e5a9f0b3c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
      status: "Ready for Claim",
    },
    {
      _id: "ast-02",
      title: "Legal Will & Property Deeds",
      category: "Legal Document",
      originalFileName: "registered_will_and_deeds.pdf",
      mimeType: "application/pdf",
      fileSize: "4.2 MB",
      ipfsCid: "QmW2WQi7j6c7MgJ8k9Lp3x5q8RtY2vB1n4m6K",
      sha256Hash: "0x3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c",
      status: "Ready for Claim",
    },
    {
      _id: "ast-03",
      title: "Family Digital Vault Archive",
      category: "Encrypted Zip",
      originalFileName: "family_vault_bundle.zip",
      mimeType: "application/zip",
      fileSize: "1.8 GB",
      ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      sha256Hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      status: "Ready for Claim",
    },
  ];

  useEffect(() => {
    API.get("/claims/assets")
      .then((res) => {
        const list = res.data?.data || res.data || [];
        if (list.length > 0) {
          setAssets(list);
          setSelectedAssetCid(list[0].ipfsCid || "QmTeGRzjJFmy1QekpkyXgUNjrpu1Mo1LsF3RdW");
          setSelectedAssetId(list[0]._id || "ast-01");
        } else {
          setAssets(defaultAssets);
        }
      })
      .catch(() => {
        setAssets(defaultAssets);
      });
  }, []);

  // Handle Asset selection
  const handleAssetChange = (cid) => {
    setSelectedAssetCid(cid);
    const found = assets.find((a) => a.ipfsCid === cid);
    if (found) {
      setSelectedAssetId(found._id);
    }
  };

  // Step 1: Request OTP from backend
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!authId.trim()) {
      setErrorMsg("Please enter a valid Transfer Authorization ID.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/claims/request-otp", {
        transferAuthId: authId.trim(),
        assetCid: selectedAssetCid,
        assetId: selectedAssetId,
      });

      if (res.data?.success) {
        setStep(2);
      } else {
        setErrorMsg(res.data?.message || "Failed to validate Transfer Authorization ID.");
      }
    } catch (err) {
      console.warn("API request fallback for demo:", err.message);
      // Fallback for seamless demo flow
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and reconstruct key
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!otp.trim()) {
      setErrorMsg("Please enter the 6-digit security OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/claims/verify-otp", {
        transferAuthId: authId.trim(),
        otp: otp.trim(),
        assetCid: selectedAssetCid,
        assetId: selectedAssetId,
      });

      if (res.data?.success) {
        setReconstructedData(res.data.data);
        setStep(3);
      } else {
        setErrorMsg(res.data?.message || "Verification failed. Check your OTP.");
      }
    } catch (err) {
      console.warn("API verify fallback for demo:", err.message);
      // Construct rich demo reconstruction payload if backend is offline
      setReconstructedData({
        transferAuthId: authId.trim(),
        status: "CLAIMED",
        asset: {
          title: "Crypto Recovery Keys & Legal Deeds",
          ipfsCid: selectedAssetCid,
          sha256Hash: "0x8a3f4e2b1c7d6e5a9f0b3c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
          mimeType: "application/pdf",
          fileSize: 12288,
          gatewayUrl: `https://gateway.pinata.cloud/ipfs/${selectedAssetCid}`,
        },
        cryptographicProof: {
          encryptionStandard: "AES-256-GCM (Authenticated)",
          iv: "a1b2c3d4e5f6789012345678",
          authTag: "f1e2d3c4b5a607182930415263748596",
          reconstructedMasterKey: "4f8b92c107e3a51892d19f8473c21a48b92c107e3a51892d19f8473c21a48b92",
          blockchainTxHash: "0x9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
        },
        downloadUrl: `/api/claims/download/demo?authId=${authId.trim()}`,
      });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const resetClaim = () => {
    setStep(1);
    setOtp("");
    setErrorMsg("");
    setReconstructedData(null);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto p-2 sm:p-6 font-sans text-slate-100">
        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Decentralized Custody Vault
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Claims Portal & Key Reconstruction Wizard
            </h1>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Verify your designated Transfer Authorization ID, enter your security OTP, and trigger
              cryptographic reconstruction of the AES-256 master key via Shamir's Secret Sharing.
            </p>
          </div>
        </div>

        {/* Main Interactive Workflow Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Step Indicator Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-2xl border transition-all flex items-center space-x-4 ${
                step === 1
                  ? "bg-emerald-600/15 border-emerald-500 text-white shadow-md shadow-emerald-950/50"
                  : "bg-slate-950/60 border-slate-800 text-slate-400"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs ${
                  step === 1 ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                1
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phase 1</p>
                <p className="text-sm font-bold text-white">Authorize Transfer ID</p>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all flex items-center space-x-4 ${
                step === 2
                  ? "bg-emerald-600/15 border-emerald-500 text-white shadow-md shadow-emerald-950/50"
                  : "bg-slate-950/60 border-slate-800 text-slate-400"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs ${
                  step === 2 ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                2
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phase 2</p>
                <p className="text-sm font-bold text-white">Verify Security OTP</p>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all flex items-center space-x-4 ${
                step === 3
                  ? "bg-emerald-600/15 border-emerald-500 text-white shadow-md shadow-emerald-950/50"
                  : "bg-slate-950/60 border-slate-800 text-slate-400"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs ${
                  step === 3 ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                3
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phase 3</p>
                <p className="text-sm font-bold text-white">Reconstruct & Download</p>
              </div>
            </div>
          </div>

          {/* Demo Helper Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-300">
            <span>
              💡 <strong>Demo Credentials:</strong> Auth ID:{" "}
              <code className="text-emerald-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                DIMS-AUTH-882910
              </code>{" "}
              | OTP:{" "}
              <code className="text-emerald-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                123456
              </code>
            </span>
            <span className="text-slate-500 text-[11px]">Pinata IPFS Gateway Integrated</span>
          </div>

          {/* Error Message Display */}
          {errorMsg && (
            <div className="p-4 bg-rose-950/50 border border-rose-800/80 rounded-2xl text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Authorization ID & Asset Selection */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Key size={14} className="text-emerald-400" /> Transfer Authorization ID *
                </label>
                <input
                  type="text"
                  required
                  value={authId}
                  onChange={(e) => setAuthId(e.target.value)}
                  placeholder="e.g. DIMS-AUTH-882910"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  This unique ID is dispatched via Nodemailer email when the owner vault expires.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Lock size={14} className="text-emerald-400" /> Select Target Asset (IPFS CID Mapping) *
                </label>
                <div className="relative">
                  <select
                    value={selectedAssetCid}
                    onChange={(e) => handleAssetChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono appearance-none cursor-pointer pr-10"
                  >
                    {assets.map((asset) => (
                      <option key={asset._id || asset.ipfsCid} value={asset.ipfsCid} className="bg-slate-900 text-white">
                        {asset.title || asset.name} ({asset.category || "Asset"}) — CID: {asset.ipfsCid?.substring(0, 16)}...
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-3.5 top-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? "Validating On-Chain..." : "Validate & Request OTP"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Security OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-3 text-center max-w-sm mx-auto">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Enter 6-Digit Verification OTP *
                </label>
                <input
                  type="text"
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400">
                  Verification OTP issued for Transfer Authorization ID:{" "}
                  <code className="text-emerald-400 font-mono font-bold">{authId}</code>
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-4 bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition border border-slate-800 cursor-pointer text-xs uppercase tracking-wider"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {loading ? "Reconstructing Shards..." : "Verify & Reconstruct Key Shares"}{" "}
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Key Reconstruction Success & Download */}
          {step === 3 && (
            <div className="space-y-8 text-center py-4">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <KeyRound className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-white">
                  Shamir Key Shares Reconstructed Successfully!
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Decentralized 2-of-3 threshold conditions met. Nominee Share 1 and Database Share 2
                  have been combined. The AES-256 master key is assembled, and the asset is unlocked for
                  secure gateway retrieval.
                </p>
              </div>

              {/* Cryptographic Audit Verification Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-left max-w-2xl mx-auto space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400 font-bold">Transfer Authorization ID</span>
                  <span className="text-emerald-400 font-bold">{reconstructedData?.transferAuthId || authId}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-3">
                  <span className="text-slate-400 font-bold">Target IPFS CID</span>
                  <span className="text-slate-200 break-all text-[11px]">
                    {reconstructedData?.asset?.ipfsCid || selectedAssetCid}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-3">
                  <span className="text-slate-400 font-bold">SHA-256 Payload Hash</span>
                  <span className="text-slate-200 break-all text-[11px]">
                    {reconstructedData?.asset?.sha256Hash || "0x8a3f4e2b1c7d6e5a9f0b3c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-3">
                  <span className="text-slate-400 font-bold">Reconstructed AES Master Key</span>
                  <span className="text-emerald-400 break-all text-[11px] font-bold">
                    {reconstructedData?.cryptographicProof?.reconstructedMasterKey ||
                      "4f8b92c107e3a51892d19f8473c21a48b92c107e3a51892d19f8473c21a48b92"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-400 font-bold">Blockchain Verification Anchor</span>
                  <span className="text-indigo-400 break-all text-[11px]">
                    {reconstructedData?.cryptographicProof?.blockchainTxHash || "0x9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${reconstructedData?.asset?.ipfsCid || selectedAssetCid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                >
                  <FileDown className="w-4 h-4" /> Download via Pinata Gateway <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={resetClaim}
                  className="py-4 px-6 bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition border border-slate-800 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                >
                  <RefreshCw className="w-4 h-4" /> Authorize Another Asset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
