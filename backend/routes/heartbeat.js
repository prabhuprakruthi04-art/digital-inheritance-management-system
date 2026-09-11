import { Router } from "express";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const router = Router();

// GET /api/heartbeat/status?ownerId=...
router.get("/status", async (req, res) => {
  try {
    const ownerId = req.query.ownerId || req.user?.id;

    if (!ownerId) {
      return res.status(400).json({ success: false, message: "Owner ID is required." });
    }

    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const now = new Date();
    const lastActive = new Date(user.lastActiveDate || now);
    const diffInSeconds = Math.floor((now - lastActive) / 1000);
    const threshold = user.inactivityThresholdSeconds || 120;
    const remainingSeconds = Math.max(0, threshold - diffInSeconds);

    res.status(200).json({
      success: true,
      lastActiveDate: user.lastActiveDate,
      inactivityThresholdSeconds: threshold,
      remainingSeconds,
      inheritanceStatus: user.inheritanceStatus || "active",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/heartbeat/history?ownerId=...
router.get("/history", async (req, res) => {
  try {
    const ownerId = req.query.ownerId || req.user?.id;

    if (!ownerId) {
      return res.status(400).json({ success: false, message: "Owner ID is required." });
    }

    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      history: user.verificationHistory || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/heartbeat/verify
router.post("/verify", async (req, res) => {
  try {
    const { ownerId, method } = req.body;
    const targetId = ownerId || req.user?.id;

    if (!targetId) {
      return res.status(400).json({ success: false, message: "Owner ID is required." });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Reset last active timestamp to now
    user.lastActiveDate = new Date();
    user.verificationHistory.unshift({
      timestamp: new Date(),
      status: "Verified",
      method: method || "Biometric Verification",
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Heartbeat timer successfully refreshed.",
      lastActiveDate: user.lastActiveDate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/heartbeat/ping
router.post("/ping", async (req, res) => {
  try {
    const { ownerId, verifiedAt } = req.body;
    const targetId = ownerId || req.user?.id;

    if (!targetId) {
      return res.status(400).json({ success: false, message: "Owner ID is required." });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const pingTime = verifiedAt ? new Date(verifiedAt) : new Date();

    user.lastActiveDate = pingTime;
    user.verificationHistory.unshift({
      timestamp: pingTime,
      status: "Verified",
      method: "Face Verification Ping",
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Heartbeat status updated successfully.",
      lastActiveDate: user.lastActiveDate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/heartbeat/simulate-expiration (Demo Utility with Notifications)
router.post("/simulate-expiration", async (req, res) => {
  try {
    const { ownerId, daysAgo } = req.body;
    const targetId = ownerId || req.user?.id;

    if (!targetId) {
      return res.status(400).json({ success: false, message: "Owner ID is required." });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const days = Number(daysAgo || 30);
    const simulatedDate = new Date();
    simulatedDate.setDate(simulatedDate.getDate() - days);

    user.lastActiveDate = simulatedDate;
    user.inheritanceStatus = "expired";
    user.status = "INACTIVE";

    user.verificationHistory.unshift({
      timestamp: new Date(),
      status: "Expired",
      method: `Demo Simulation (${days} Days Inactivity)`,
    });

    await user.save();

    // Create the appropriate notification based on the days threshold
    let alertMessage = `URGENT: ${user.fullName || "The Owner"} has been inactive for ${days} days. Digital inheritance claims are now unlocked.`;
    
    await Notification.create({
      recipientModel: "Nominee",
      ownerId: user._id,
      message: alertMessage,
      type: `INHERITANCE_TRIGGERED_${days}_DAYS`,
    });

    res.status(200).json({
      success: true,
      message: `Successfully simulated ${days}-day inactivity expiration and dispatched nominee notification.`,
      lastActiveDate: user.lastActiveDate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;