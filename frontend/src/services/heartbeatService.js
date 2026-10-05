import api from "./api";

// Get Heartbeat Status
export const getHeartbeatStatus = async (ownerId) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const targetId = ownerId || user._id || user.id;

  const response = await api.get(`/heartbeat/status?ownerId=${targetId}`);
  return response.data;
};

// Get Heartbeat History
export const getHeartbeatHistory = async (ownerId) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const targetId = ownerId || user._id || user.id;

  const response = await api.get(`/heartbeat/history?ownerId=${targetId}`);
  return response.data;
};

// Export alias matching HeartbeatDashboard.jsx import
export const getVerificationHistory = getHeartbeatHistory;

// Verify Heartbeat
export const verifyHeartbeat = async (data) => {
  const response = await api.post("/heartbeat/verify", data);
  return response.data;
};