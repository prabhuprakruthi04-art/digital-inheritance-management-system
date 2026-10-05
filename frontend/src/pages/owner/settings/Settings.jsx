import React, { useState, useEffect } from "react";
import AppLayout from "../../../components/layout/AppLayout";
import { User, Clock, Bell, Save, CheckCircle } from "lucide-react";
import API from "../../../services/api";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("heartbeat");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [heartbeat, setHeartbeat] = useState({
    heartbeatIntervalMinutes: 2, // Default to 2 minutes for demo
    reminderMinutesBefore: 1,
  });

  const [notifications, setNotifications] = useState({
    notifyEmail: true,
    notifySms: false,
    notifyInApp: true,
  });

  // Load existing settings
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setProfile({
      name: user.name || "Owner User",
      email: user.email || "owner@gmail.com",
      phone: user.phone || "+91 9876543210",
    });

    const localSettings = JSON.parse(localStorage.getItem("owner_settings") || "null");
    if (localSettings) {
      if (localSettings.profile) setProfile(localSettings.profile);
      if (localSettings.heartbeat) setHeartbeat(localSettings.heartbeat);
      if (localSettings.notifications) setNotifications(localSettings.notifications);
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    const fullSettings = { profile, heartbeat, notifications };

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const ownerId = user._id || user.id || "demo-owner-id";

      try {
        await API.post("/owner/settings", { ownerId, ...fullSettings });
      } catch (apiErr) {
        console.warn("API offline, saving settings locally:", apiErr.message);
      }

      // Persist across the entire application
      localStorage.setItem("user", JSON.stringify({ ...user, ...profile }));
      localStorage.setItem("owner_settings", JSON.stringify(fullSettings));

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your personal profile, heartbeat timing, and safety preferences.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle size={16} /> Settings saved! Heartbeat interval set to {heartbeat.heartbeatIntervalMinutes} minute(s).
          </div>
        )}

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-slate-200 gap-4 bg-white px-4 rounded-t-2xl pt-2">
          {[
            { id: "heartbeat", label: "Heartbeat & Schedule", icon: Clock },
            { id: "profile", label: "Profile Settings", icon: User },
            { id: "notifications", label: "Notification Channels", icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold transition border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="bg-white p-8 rounded-b-2xl border border-slate-200 shadow-sm space-y-6">
          {/* TAB 1: HEARTBEAT & PERIOD SETTINGS */}
          {activeTab === "heartbeat" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Proof-of-Life Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Heartbeat Verification Frequency
                  </label>
                  <select
                    value={heartbeat.heartbeatIntervalMinutes}
                    onChange={(e) => setHeartbeat({ ...heartbeat, heartbeatIntervalMinutes: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white cursor-pointer font-bold text-indigo-600"
                  >
                    <option value={2}>⚡ 2 Minutes (Project Demo Mode)</option>
                    <option value={5}>⚡ 5 Minutes (Fast Test)</option>
                    <option value={1440}>1 Day</option>
                    <option value={10080}>7 Days</option>
                    <option value={43200}>30 Days (Production)</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Controls how frequently proof-of-life verification checks trigger across the app.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Grace Period Lead Time
                  </label>
                  <select
                    value={heartbeat.reminderMinutesBefore}
                    onChange={(e) => setHeartbeat({ ...heartbeat, reminderMinutesBefore: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white cursor-pointer"
                  >
                    <option value={1}>1 Minute Before Expiry</option>
                    <option value={2}>2 Minutes Before Expiry</option>
                    <option value={5}>5 Minutes Before Expiry</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Owner Profile Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Reminder Preferences</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 border rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span className="text-sm font-semibold text-slate-800">In-App Dashboard Alerts & Banners</span>
                  <input
                    type="checkbox"
                    checked={notifications.notifyInApp}
                    onChange={(e) => setNotifications({ ...notifications, notifyInApp: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3.5 border rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span className="text-sm font-semibold text-slate-800">Email Alerts</span>
                  <input
                    type="checkbox"
                    checked={notifications.notifyEmail}
                    onChange={(e) => setNotifications({ ...notifications, notifyEmail: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3.5 border rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span className="text-sm font-semibold text-slate-800">SMS / Mobile Notifications</span>
                  <input
                    type="checkbox"
                    checked={notifications.notifySms}
                    onChange={(e) => setNotifications({ ...notifications, notifySms: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase rounded-xl transition shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Save size={16} />
              {loading ? "Saving Settings..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}