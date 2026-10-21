import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import AppLayout from "../../../components/layout/AppLayout";
import OwnerNotificationBanner from "../../../components/notifications/OwnerNotificationBanner";
import API from "../../../services/api";
import {
  FolderLock,
  Users,
  Activity,
  HardDrive,
  Plus,
  ShieldCheck,
  FileText,
  Key,
  Database,
  ArrowRight,
  Clock,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  BellRing,
  PieChart as PieIcon,
  BarChart3,
  Lock
} from "lucide-react";

// Palette for Recharts
const CHART_COLORS = ["#6366f1", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4"];

export default function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Owner");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Live status from backend
  const [vaultStatus, setVaultStatus] = useState({
    status: "ACTIVE", // ACTIVE or INACTIVE
    inheritanceStatus: "ACTIVE",
    inactivityWarningCount: 0,
    maxWarnings: 3,
    remainingSeconds: 120,
    inactivityThresholdSeconds: 120,
    isShareUnlocked: false,
    transferAuthId: null,
    lastActiveDate: new Date(),
  });

  const [stats, setStats] = useState({
    totalAssets: 4,
    totalNominees: 3,
    storageUsed: "2.4 MB",
  });

  const [recentAssets, setRecentAssets] = useState([]);

  // Asset Distribution Data for Recharts Pie & Bar Charts
  const [categoryData, setCategoryData] = useState([
    { name: "Legal Documents", value: 4, count: 4, fill: "#6366f1" },
    { name: "Financial & Banking", value: 3, count: 3, fill: "#10b981" },
    { name: "Crypto Recovery Seeds", value: 2, count: 2, fill: "#8b5cf6" },
    { name: "Identity & Personal", value: 2, count: 2, fill: "#f59e0b" },
  ]);

  // Fetch status and assets on mount
  const fetchDashboardData = async () => {
    try {
      // 1. User from local storage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.fullName || user.name) {
        setUserName(user.fullName || user.name);
      }

      // 2. Fetch live heartbeat & warning status from backend
      const ownerId = user._id || user.id;
      try {
        const res = await API.get(`/heartbeat/status${ownerId ? `?ownerId=${ownerId}` : ""}`);
        if (res.data?.success) {
          setVaultStatus((prev) => ({
            ...prev,
            ...res.data,
            status: res.data.status || (res.data.inactivityWarningCount >= 3 ? "INACTIVE" : "ACTIVE"),
            inactivityWarningCount: res.data.inactivityWarningCount || 0,
          }));
        }
      } catch (hbErr) {
        console.warn("Using local status fallback:", hbErr.message);
      }

      // 3. Fetch assets and nominees dynamically from API (/documents, /assets, /nominees)
      try {
        const [docRes, assetRes, nomineeRes] = await Promise.all([
          API.get("/documents").catch(() => null),
          API.get("/assets").catch(() => null),
          API.get("/nominees").catch(() => null),
        ]);

        const docList = docRes?.data?.data || docRes?.data || [];
        const assetList = Array.isArray(assetRes?.data) ? assetRes.data : assetRes?.data?.assets || [];
        const localAssets = JSON.parse(localStorage.getItem("shared_assets") || "[]");
        const nomineeList = nomineeRes?.data?.data || nomineeRes?.data || [];
        const totalNominees = Array.isArray(nomineeList) && nomineeList.length > 0 ? nomineeList.length : 3;

        // Merge and deduplicate by _id or cid
        const combined = [
          ...(Array.isArray(docList) ? docList : []),
          ...(Array.isArray(assetList) ? assetList : []),
          ...(Array.isArray(localAssets) ? localAssets : []),
        ];
        const seen = new Set();
        const unique = [];

        combined.forEach((item) => {
          if (!item) return;
          const key = item._id || item.id || item.cid || item.ipfsCid;
          if (key && !seen.has(key)) {
            seen.add(key);
            unique.push(item);
          }
        });

        if (unique.length > 0) {
          setRecentAssets(unique.slice(0, 4));
          setStats((prev) => {
            const totalBytes = unique.reduce((sum, item) => sum + (parseInt(item.fileSize, 10) || 1024 * 1024), 0);
            const formattedStorage =
              totalBytes >= 1024 * 1024 * 1024
                ? (totalBytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
                : (totalBytes / (1024 * 1024)).toFixed(1) + " MB";

            return {
              ...prev,
              totalAssets: unique.length,
              totalNominees,
              storageUsed: formattedStorage,
            };
          });

          // Compute exact dynamic categories for Recharts derived directly from records
          const counts = {};
          unique.forEach((a) => {
            const cat = (a.category || a.assetType || "General").toLowerCase();
            let label = "General Vault Items";
            if (cat.includes("legal") || cat.includes("will") || cat.includes("deed") || cat.includes("estate")) {
              label = "Legal Documents";
            } else if (cat.includes("financial") || cat.includes("bank") || cat.includes("sbi")) {
              label = "Financial & Banking";
            } else if (cat.includes("crypto") || cat.includes("seed") || cat.includes("key") || cat.includes("bitcoin")) {
              label = "Crypto Recovery Seeds";
            } else if (cat.includes("media") || cat.includes("video") || cat.includes("photo") || cat.includes("mp4")) {
              label = "Media & Video Assets";
            } else if (cat.includes("identity") || cat.includes("passport") || cat.includes("credentials")) {
              label = "Identity & Personal";
            }
            counts[label] = (counts[label] || 0) + 1;
          });

          const mapped = Object.keys(counts).map((key, idx) => ({
            name: key,
            value: counts[key],
            count: counts[key],
            fill: CHART_COLORS[idx % CHART_COLORS.length],
          }));

          if (mapped.length > 0) setCategoryData(mapped);
        } else {
          loadFallbackAssets();
        }
      } catch {
        loadFallbackAssets();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackAssets = () => {
    const fallback = [
      {
        _id: "ast-1",
        title: "Property Deed & Will",
        category: "Legal Documents",
        nominee: "Rahul",
        security: "AES-256-GCM",
        fileName: "registered_will_2026.pdf",
        ipfsCid: "QmTeGRzjJFmy1QekpkyXgUNjrpu1Mo1LsF3RdW",
      },
      {
        _id: "ast-2",
        title: "SBI Bank Account Access",
        category: "Financial & Banking",
        nominee: "Anita",
        security: "AES-256-GCM",
        fileName: "bank_access_credentials.pdf",
        ipfsCid: "QmW2WQi7j6c7MgJ8k9Lp3x5q8RtY2vB1n4m6K",
      },
      {
        _id: "ast-3",
        title: "Master Bitcoin Seed Phrase",
        category: "Crypto Recovery Seeds",
        nominee: "Mithila",
        security: "AES-256-GCM",
        fileName: "crypto_master_seed.txt",
        ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      },
      {
        _id: "ast-4",
        title: "Passport & Identity Vault",
        category: "Identity & Personal",
        nominee: "Rahul",
        security: "AES-256-GCM",
        fileName: "passport_national_id.pdf",
        ipfsCid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
      },
    ];
    setRecentAssets(fallback);
  };

  useEffect(() => {
    fetchDashboardData();

    // Instant cross-page and cross-tab synchronizer
    const handleSync = () => {
      fetchDashboardData();
    };

    window.addEventListener("dims-vault-updated", handleSync);
    let channel;
    try {
      channel = new BroadcastChannel("dims_vault_sync");
      channel.onmessage = handleSync;
    } catch (e) {}

    const interval = setInterval(fetchDashboardData, 10000); // Polling every 10s for live updates
    return () => {
      clearInterval(interval);
      window.removeEventListener("dims-vault-updated", handleSync);
      if (channel) channel.close();
    };
  }, []);

  // Quick Heartbeat Reset Handler (resets warning count back to 0/3)
  const handleHeartbeatCheckIn = async () => {
    try {
      setActionLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await API.post("/heartbeat/ping", {
        ownerId: user._id || user.id,
        verifiedAt: new Date().toISOString(),
      });
      await fetchDashboardData();
    } catch (err) {
      console.error("Check-in error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Test / Simulate Inactivity Warning Increment (1 -> 2 -> 3 Inactive & SSS Release)
  const handleTriggerInactivityWarning = async () => {
    try {
      setActionLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await API.post("/heartbeat/trigger-warning", {
        ownerId: user._id || user.id,
      });

      if (res.data?.success) {
        setVaultStatus((prev) => ({
          ...prev,
          inactivityWarningCount: res.data.warningCount,
          status: res.data.status,
          isShareUnlocked: res.data.triggered || prev.isShareUnlocked,
          transferAuthId: res.data.transferAuthId || prev.transferAuthId,
        }));
      }
    } catch (err) {
      console.warn("Trigger warning fallback:", err.message);
      setVaultStatus((prev) => {
        const next = Math.min(3, prev.inactivityWarningCount + 1);
        return {
          ...prev,
          inactivityWarningCount: next,
          status: next >= 3 ? "INACTIVE" : "ACTIVE",
          isShareUnlocked: next >= 3 ? true : prev.isShareUnlocked,
        };
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Evaluate Active vs Inactive State
  const isVaultInactive =
    vaultStatus.status === "INACTIVE" ||
    vaultStatus.inactivityWarningCount >= 3 ||
    vaultStatus.inheritanceStatus === "EXPIRED";

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 max-w-7xl mx-auto font-sans"
      >
        {/* Welcome Header & Dynamic Status Badges */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-xl border border-slate-800">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              {/* Dynamic Status Badges for ACTIVE / INACTIVE */}
              <div className="flex flex-wrap items-center gap-2.5">
                {isVaultInactive ? (
                  <motion.span
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-950/40"
                  >
                    <XCircle size={14} className="text-rose-400" />
                    Vault Status: INACTIVE (3/3 Warnings Exceeded)
                  </motion.span>
                ) : vaultStatus.inactivityWarningCount > 0 ? (
                  <motion.span
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-950/40"
                  >
                    <AlertTriangle size={14} className="text-amber-400 animate-bounce" />
                    Heartbeat Warning ({vaultStatus.inactivityWarningCount}/3 Sent)
                  </motion.span>
                ) : (
                  <motion.span
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/40"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Vault Status: ACTIVE & SECURED
                  </motion.span>
                )}

                {vaultStatus.isShareUnlocked && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Key size={13} /> SSS Share 2 Released
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Welcome Back, {userName} 👋
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Your encrypted document vault is protected via Shamir's Secret Sharing (2-of-3) and
                continuous proof-of-life monitoring. Automated triggers release key shares only if 3
                consecutive warning notices expire.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleHeartbeatCheckIn}
                disabled={actionLoading}
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/50 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck size={16} />
                {actionLoading ? "Processing..." : "Verify Heartbeat"}
              </button>

              <button
                onClick={() => navigate("/owner/assets/add")}
                className="px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-950/50 flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} /> Add Asset
              </button>
            </div>
          </div>

          {/* Interactive 3-Warning Inactivity Progress Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3">
              <div className="flex items-center gap-2">
                <BellRing size={15} className="text-indigo-400" />
                <span className="font-bold text-slate-200">
                  Inactivity Notification Monitor (Exact 3-Warning Protocol):
                </span>
                <span className="font-mono text-emerald-400 font-extrabold">
                  {vaultStatus.inactivityWarningCount} of 3 Warnings Sent
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerInactivityWarning}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-[11px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Simulate advancing the warning counter by 1 notification"
                >
                  <AlertTriangle size={13} />
                  Simulate Next Warning ({vaultStatus.inactivityWarningCount}/3)
                </button>
                {vaultStatus.inactivityWarningCount > 0 && (
                  <button
                    onClick={handleHeartbeatCheckIn}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg text-[11px] font-bold uppercase tracking-wider transition flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={12} /> Reset to 0/3
                  </button>
                )}
              </div>
            </div>

            {/* Visual Step Segments */}
            <div className="grid grid-cols-3 gap-3">
              {/* Step 1 */}
              <div
                className={`p-3 rounded-xl border text-xs transition-all ${
                  vaultStatus.inactivityWarningCount >= 1
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                    : "bg-slate-800/40 border-slate-800 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>Warning 1</span>
                  {vaultStatus.inactivityWarningCount >= 1 && <CheckCircle2 size={14} className="text-amber-400" />}
                </div>
                <p className="text-[10px] mt-0.5 text-slate-400">Inactivity detected; reminder issued.</p>
              </div>

              {/* Step 2 */}
              <div
                className={`p-3 rounded-xl border text-xs transition-all ${
                  vaultStatus.inactivityWarningCount >= 2
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                    : "bg-slate-800/40 border-slate-800 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>Warning 2</span>
                  {vaultStatus.inactivityWarningCount >= 2 && <CheckCircle2 size={14} className="text-amber-400" />}
                </div>
                <p className="text-[10px] mt-0.5 text-slate-400">Urgent notice; 1 notification left.</p>
              </div>

              {/* Step 3 (Final -> SSS Release) */}
              <div
                className={`p-3 rounded-xl border text-xs transition-all ${
                  vaultStatus.inactivityWarningCount >= 3
                    ? "bg-rose-500/20 border-rose-500/50 text-rose-200 shadow-md shadow-rose-950/50"
                    : "bg-slate-800/40 border-slate-800 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>Warning 3 (Final)</span>
                  {vaultStatus.inactivityWarningCount >= 3 && <XCircle size={14} className="text-rose-400" />}
                </div>
                <p className="text-[10px] mt-0.5 text-slate-400">Status set INACTIVE; SSS released.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Notification Banner */}
        <OwnerNotificationBanner />

        {/* Metric Cards with Smooth Stagger Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => navigate("/owner/assets")}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Vault Assets</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalAssets}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Encrypted via AES-256-GCM</p>
            </div>
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <FolderLock size={26} />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => navigate("/owner/nominees")}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Nominees</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalNominees}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Beneficiary shards allocated</p>
            </div>
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Users size={26} />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => navigate("/owner/heartbeat")}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vault Lifecycle</p>
              <h3
                className={`text-xl font-extrabold mt-1 flex items-center gap-2 ${
                  isVaultInactive ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {isVaultInactive ? (
                  <>
                    <XCircle size={18} /> Inactive
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" /> Active
                  </>
                )}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Warnings: {vaultStatus.inactivityWarningCount}/3 sent
              </p>
            </div>
            <div
              className={`p-3.5 rounded-2xl ${
                isVaultInactive ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Activity size={26} />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => navigate("/owner/documents")}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">IPFS Storage Anchor</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.storageUsed}</h3>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">Pinata IPFS Pinning</p>
            </div>
            <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
              <HardDrive size={26} />
            </div>
          </motion.div>
        </div>

        {/* VISUAL RECHARTS SECTION: Asset Distribution & Storage Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Chart 1: Donut/Pie Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <PieIcon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Asset Distribution by Category</h3>
                  <p className="text-xs text-slate-500">Cryptographic allocation across estate buckets</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {categoryData.reduce((acc, curr) => acc + curr.value, 0)} Total Items
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#38bdf8" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-medium text-slate-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Vault Item Density Analysis</h3>
                  <p className="text-xs text-slate-500">Asset counts grouped by designated custody domain</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Recharts Visual Engine
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 15, right: 20, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    tickFormatter={(val) => (val.length > 12 ? `${val.substring(0, 10)}...` : val)}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Recent Assets & Protocol Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Assets List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Recent Custodied Assets</h2>
                <p className="text-xs text-slate-500">
                  Encrypted files sharded using 2-of-3 Shamir's Secret Sharing
                </p>
              </div>
              <Link
                to="/owner/assets"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                Explore Vault <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentAssets.map((asset, index) => (
                <motion.div
                  key={asset._id || index}
                  whileHover={{ scale: 1.01 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/60 transition duration-200"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                      {asset.category?.toLowerCase().includes("legal") ? (
                        <FileText size={20} />
                      ) : (
                        <Key size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{asset.title || asset.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Category: <span className="font-semibold text-slate-600">{asset.category || "General"}</span> | File:{" "}
                        <span className="font-mono text-slate-500">{asset.fileName || "document.pdf"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      Nominee: {asset.nominee || "Rahul"}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                      <Lock size={11} /> {asset.security || "AES-256-GCM"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Project Architecture & Security Protocols */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-6 flex flex-col justify-between border border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Database size={16} /> Autonomous Protocol
              </div>
              <h3 className="text-xl font-black leading-snug">
                3-Warning Cryptographic Inheritance Enforcement
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When inactivity is detected, DIMS sends up to 3 tracked notifications. If unacknowledged
                after the 3rd notice, the owner status automatically switches to INACTIVE, triggering the
                on-chain state update and unlocking Shamir Share 2 for the assigned nominee.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                  <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Shamir Key Sharding</h5>
                    <p className="text-[11px] text-slate-400">
                      Master keys require 2-of-3 threshold shares to decrypt on Pinata IPFS.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                  <Clock className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Proof-of-Life Tracking</h5>
                    <p className="text-[11px] text-slate-400">
                      Heartbeat check-ins reset warning counters back to 0/3 immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/owner/settings")}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-950/60"
            >
              Configure Protocol Thresholds <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}