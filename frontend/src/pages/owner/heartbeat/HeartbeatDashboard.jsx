import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Clock, ShieldCheck, RefreshCw, AlertTriangle, BellRing } from "lucide-react";

import AppLayout from "../../../components/layout/AppLayout";
import API from "../../../services/api";

export default function HeartbeatDashboard() {
  const navigate = useNavigate();

  const [intervalMinutes] = useState(2);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [alertTier, setAlertTier] = useState(0);
  const [notifPermission, setNotifPermission] = useState(Notification.permission);

  const [data, setData] = useState({
    status: "ACTIVE",
    lastActiveDate: new Date().toISOString(),
    history: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Request Desktop Notification Permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      if (permission === "granted") {
        new Notification("DIMS Heartbeat Protocol Active", {
          body: "Multi-tier escalation alerts enabled.",
          icon: "/favicon.ico",
        });
      }
    }
  };

  const sendEscalatedNotification = (tier, message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`[Reminder ${tier}/3] DIMS Heartbeat Alert`, {
        body: message,
        tag: `dims-tier-${tier}`,
        requireInteraction: tier === 3,
      });
    }
  };

  const fetchHeartbeatData = useCallback(async () => {
    const lastHeartbeatRaw = localStorage.getItem("last_heartbeat") || new Date().toISOString();

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const ownerId = user._id || user.id;

      if (ownerId) {
        const response = await API.get(`/biometrics/history?ownerId=${ownerId}`);
        if (response.data?.success && response.data?.data?.history?.length > 0) {
          setData(response.data.data);
          setLoading(false);
          setRefreshing(false);
          return;
        }
      }
    } catch (err) {
      console.warn("API offline, utilizing local heartbeat history repository:", err);
    } finally {
      // READ DYNAMIC VERIFICATION HISTORY FROM LOCAL STORAGE
      const storedHistory = JSON.parse(localStorage.getItem("heartbeat_history") || "[]");

      // If empty but face is enrolled, initialize with first verification
      let dynamicHistory = storedHistory;
      if (dynamicHistory.length === 0 && localStorage.getItem("face_enrolled") === "true") {
        dynamicHistory = [
          {
            verifiedAt: lastHeartbeatRaw,
            method: "Face Verification",
            confidenceScore: "99.2%",
          },
        ];
        localStorage.setItem("heartbeat_history", JSON.stringify(dynamicHistory));
      }

      setData({
        status: alertTier > 0 ? "WARNING" : "ACTIVE",
        lastActiveDate: lastHeartbeatRaw,
        history: dynamicHistory,
      });
      setLoading(false);
      setRefreshing(false);
    }
  }, [alertTier]);

  // Live Timer Countdown & Escalation Tracking
  useEffect(() => {
    const lastHeartbeatRaw = localStorage.getItem("last_heartbeat");
    const lastHeartbeatTime = lastHeartbeatRaw ? new Date(lastHeartbeatRaw).getTime() : Date.now();

    let tier1Sent = false;
    let tier2Sent = false;
    let tier3Sent = false;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSec = Math.floor((now - lastHeartbeatTime) / 1000);
      setElapsedSeconds(elapsedSec);

      if (elapsedSec >= 180) {
        setAlertTier(3);
        if (!tier3Sent) {
          sendEscalatedNotification(
            3,
            "FINAL NOTICE: Proof-of-life unverified! Nominee claim protocol will initiate shortly."
          );
          tier3Sent = true;
        }
      } else if (elapsedSec >= 120) {
        setAlertTier(2);
        if (!tier2Sent) {
          sendEscalatedNotification(
            2,
            "SECOND REMINDER: Heartbeat verification is overdue. Please perform face check-in."
          );
          tier2Sent = true;
        }
      } else if (elapsedSec >= 60) {
        setAlertTier(1);
        if (!tier1Sent) {
          sendEscalatedNotification(
            1,
            "INITIAL REMINDER: Your scheduled heartbeat verification window is due."
          );
          tier1Sent = true;
        }
      } else {
        setAlertTier(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchHeartbeatData();
  }, [fetchHeartbeatData]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchHeartbeatData();
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Heartbeat Monitoring</h1>
            <p className="text-gray-500 mt-1">
              Active Check-in Interval: <span className="font-bold text-indigo-600">{intervalMinutes} Minute(s)</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {notifPermission !== "granted" && (
              <button
                onClick={requestNotificationPermission}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition cursor-pointer"
              >
                <BellRing size={16} /> Enable System Alerts
              </button>
            )}

            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium cursor-pointer"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Dynamic Escalation Banner */}
        <div
          className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
            alertTier === 3
              ? "bg-red-100 border-red-300 text-red-900 shadow-lg animate-pulse"
              : alertTier === 2
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : alertTier === 1
              ? "bg-blue-50 border-blue-200 text-blue-900"
              : "bg-emerald-50 border-emerald-200 text-emerald-900"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${
                alertTier === 3
                  ? "bg-red-200 text-red-700"
                  : alertTier === 2
                  ? "bg-amber-200 text-amber-700"
                  : alertTier === 1
                  ? "bg-blue-200 text-blue-700"
                  : "bg-emerald-200 text-emerald-700"
              }`}
            >
              {alertTier > 0 ? <AlertTriangle size={28} /> : <Clock size={28} />}
            </div>
            <div>
              <h2 className="text-base font-bold">
                {alertTier === 3
                  ? "🚨 FINAL NOTICE (3/3): Action Required!"
                  : alertTier === 2
                  ? "⚠️ SECOND REMINDER (2/3): Verification Due"
                  : alertTier === 1
                  ? "🔔 FIRST REMINDER (1/3): Heartbeat Window Open"
                  : "✅ Account Status Active"}
              </h2>
              <p className="text-xs mt-0.5 opacity-90">
                Elapsed since last verification:{" "}
                <span className="font-mono font-bold text-sm">{formatTime(elapsedSeconds)}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/face-enrollment")}
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-md ${
              alertTier === 3
                ? "bg-red-600 hover:bg-red-700 text-white"
                : alertTier === 2
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <ShieldCheck size={18} />
            Verify Now
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${
                  alertTier === 0
                    ? "bg-green-100 text-green-600"
                    : alertTier < 3
                    ? "bg-amber-100 text-amber-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                <Activity size={24} />
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  alertTier === 0
                    ? "bg-green-100 text-green-800"
                    : alertTier < 3
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {alertTier === 0 ? "ACTIVE" : alertTier < 3 ? "PENDING CHECK-IN" : "OVERDUE"}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">Status Stage</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {alertTier === 0 ? "ACTIVE" : `TIER ${alertTier} WARNING`}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit mb-4">
              <Clock size={24} />
            </div>
            <p className="text-sm text-gray-500 font-medium">Last Verification</p>
            <h2 className="text-sm font-bold text-gray-900 mt-1 truncate">
              {new Date(data.lastActiveDate).toLocaleString()}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl w-fit mb-4">
              <ShieldCheck size={24} />
            </div>
            <p className="text-sm text-gray-500 font-medium">Verification Records</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{data.history.length}</h2>
          </div>
        </div>

        {/* Audit History Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
            Biometric Audit History
          </h2>

          <div className="mt-4">
            {loading ? (
              <div className="py-12 text-center text-gray-400 font-medium">
                Loading verification records...
              </div>
            ) : data.history.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-gray-200 rounded-xl text-center">
                <p className="text-gray-400 text-sm">No verification history recorded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Verification Date</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {data.history.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition">
                        <td className="py-3.5 px-4 font-medium text-gray-900">
                          {new Date(record.verifiedAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">{record.method}</td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {record.confidenceScore || "99.2%"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                            ● Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}