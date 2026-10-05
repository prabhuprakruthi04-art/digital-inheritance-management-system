import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/api/notifications");

      const data = res?.data?.data || res?.data || res || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Unable to load notifications. Displaying local alerts.");

      setNotifications([
        {
          _id: "1",
          title: "System Ready",
          message: "Your digital inheritance vault is active and secured.",
          type: "info",
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          title: "Heartbeat Reminder",
          message: "Please complete your proof-of-life verification within 5 days.",
          type: "warning",
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
      );
      await API.put(`/api/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await API.put("/api/notifications/read-all");
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              System alerts, heartbeat reminders, and smart contract activity.
            </p>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Mark all as read
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            Loading alerts...
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border shadow-sm">
            <p className="text-gray-500">You're all caught up! No new notifications.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm divide-y">
            {notifications.map((notification) => {
              const id = notification._id || notification.id;
              return (
                <div
                  key={id}
                  className={`p-5 flex items-start justify-between transition-colors ${
                    !notification.isRead ? "bg-indigo-50/30" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <span className="h-2 w-2 bg-indigo-600 rounded-full"></span>
                      )}
                      <h3 className={`font-semibold text-gray-900 ${!notification.isRead ? "text-indigo-900" : ""}`}>
                        {notification.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 pl-4">{notification.message}</p>
                    <p className="text-xs text-gray-400 pl-4">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(id)}
                      className="text-xs font-medium text-gray-500 hover:text-indigo-600 px-3 py-1.5 border rounded-lg hover:bg-indigo-50 transition"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}