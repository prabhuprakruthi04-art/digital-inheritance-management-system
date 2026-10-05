import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../../../components/layout/AppLayout";

import HeartbeatCard from "../../../components/heartbeat/HeartbeatCard";
import VerificationHistory from "../../../components/heartbeat/VerificationHistory";
import CountdownTimer from "../../../components/heartbeat/CountdownTimer";
import ReminderBanner from "../../../components/heartbeat/ReminderBanner";

import {
  getHeartbeatStatus,
  getVerificationHistory,
} from "../../../services/heartbeatService";

export default function HeartbeatDashboard() {
  const navigate = useNavigate();

  const [heartbeat, setHeartbeat] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const statusRes = await getHeartbeatStatus();
      const historyRes = await getVerificationHistory();

      // Handle raw response or nested response data formats cleanly
      const statusData = statusRes?.data || statusRes || {
        status: "Active",
        lastPing: new Date().toISOString(),
        nextVerification: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        intervalDays: 30,
      };

      const historyData = Array.isArray(historyRes?.data)
        ? historyRes.data
        : Array.isArray(historyRes)
        ? historyRes
        : [];

      setHeartbeat(statusData);
      setHistory(historyData);
    } catch (err) {
      console.error("Failed to load heartbeat data:", err);
      // Fallback state so the UI renders during development or backend disconnects
      setHeartbeat({
        status: "Active",
        lastPing: new Date().toISOString(),
        nextVerification: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        intervalDays: 30,
      });
      setHistory([]);
    } font-medium {
      setLoading(false);
    }
  }

  if (loading && !heartbeat) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500 font-medium">Loading Heartbeat Status...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6 py-4">
        {heartbeat?.status && <ReminderBanner status={heartbeat.status} />}

        <div className="grid lg:grid-cols-2 gap-6">
          <HeartbeatCard heartbeat={heartbeat} />

          <div className="bg-white rounded-xl shadow-lg p-6 border flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Next Verification
              </h2>

              <CountdownTimer
                targetDate={
                  heartbeat?.nextVerification ||
                  heartbeat?.nextPingDue ||
                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                }
              />
            </div>

            <button
              onClick={() => navigate("/owner/alive-verification")}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow transition"
            >
              Verify Now
            </button>
          </div>
        </div>

        <div className="mt-8">
          <VerificationHistory history={history} />
        </div>
      </div>
    </AppLayout>
  );
}