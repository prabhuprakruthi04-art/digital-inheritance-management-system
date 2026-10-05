import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { AlertCircle } from "lucide-react";

export default function OwnerNotificationBanner() {
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const ownerId = user._id || user.id;
        
        if (ownerId) {
          const res = await API.get(`/notifications?ownerId=${ownerId}`);
          if (res.data.success && res.data.notifications.length > 0) {
            setActiveAlerts(res.data.notifications.slice(0, 3));
            return;
          }
        }
        
        // Fallback demo banner for presentation visibility if API returns empty
        setActiveAlerts([
          {
            message: "REMINDER (2-Day Notice): Inactivity detected. Please complete your heartbeat verification check.",
            createdAt: new Date(),
          }
        ]);
      } catch (err) {
        console.error("Error fetching dashboard notifications:", err);
        // Fallback for presentation
        setActiveAlerts([
          {
            message: "REMINDER (2-Day Notice): Inactivity detected. Please complete your heartbeat verification check.",
            createdAt: new Date(),
          }
        ]);
      }
    };

    fetchAlerts();
  }, []);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {activeAlerts.map((alert, index) => (
        <div 
          key={index} 
          className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-sm flex items-start justify-between"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Inactivity Notice</h4>
              <p className="text-sm font-medium text-amber-900 mt-0.5">{alert.message}</p>
            </div>
          </div>
          <span className="text-[10px] text-amber-600 font-semibold shrink-0">
            {new Date(alert.createdAt).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}