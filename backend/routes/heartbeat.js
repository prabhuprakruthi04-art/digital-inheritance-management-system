import { Router } from "express";
import User from "../models/User.js";
import Nominee from "../models/Nominee.js";
import Notification from "../models/Notification.js";
import { processOwnerInactivityWarning } from "../jobs/heartbeatCron.js";

const router = Router();

// GET /api/heartbeat/status?ownerId=...
router.get("/status", async (req, res) => {
  try {
    const ownerId = req.query.ownerId || req.user?.id;

    let user = null;
    if (ownerId && ownerId !== "undefined") {
      user = await User.findById(ownerId);
    }
    if (!user) {
      user = await User.findOne({ role: "owner" });
    }

    if (!user) {
      return res.status(200).json({
        success: true,
        status: "ACTIVE",
        inheritanceStatus: "ACTIVE",
        inactivityWarningCount: 0,
        maxWarnings: 3,
        inactivityThresholdSeconds: 120,
        remainingSeconds: 120,
        lastActiveDate: new Date(),
      });
    }

    const now = new Date();
    const lastActive = new Date(user.lastActiveDate || now);
    const diffInSeconds = Math.floor((now - lastActive) / 1000);
    const threshold = user.inactivityThresholdSeconds || 120;
    const remainingSeconds = Math.max(0, threshold - diffInSeconds);

    // Check if Nominee SSS Share is unlocked
    const nominee = await Nominee.findOne({ ownerId: user._id.toString() });
    const isShareUnlocked = nominee ? nominee.isShareUnlocked : false;

    res.status(200).json({
      success: true,
      ownerId: user._id,
      fullName: user.fullName,
      status: user.status || "ACTIVE",
      inheritanceStatus: user.inheritanceStatus || "ACTIVE",
      inactivityWarningCount: user.inactivityWarningCount || 0,
      maxWarnings: 3,
      isShareUnlocked,
      transferAuthId: user.transferAuthId || null,
      lastActiveDate: user.lastActiveDate,
      lastWarningSentAt: user.lastWarningSentAt || null,
      inactivityThresholdSeconds: threshold,
      remainingSeconds,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/heartbeat/history?ownerId=...
router.get("/history", async (req, res) => {
  try {
    const ownerId = req.query.ownerId || req.user?.id;

    let user = null;
    if (ownerId && ownerId !== "undefined") {
      user = await User.findById(ownerId);
    }
    if (!user) {
      user = await User.findOne({ role: "owner" });
    }

    res.status(200).json({
      success: true,
      history: user?.verificationHistory || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/heartbeat/verify - Refreshes heartbeat and resets warning count to 0
router.post("/verify", async (req, res) => {
  try {
    const { ownerId, method } = req.body;
    const targetId = ownerId || req.user?.id;

    let user = null;
    if (targetId) {
      user = await User.findById(targetId);
    }
    if (!user) {
      user = await User.findOne({ role: "owner" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Reset last active timestamp and reset warning counter back to 0
    const now = new Date();
    user.lastActiveDate = now;
    user.inactivityWarningCount = 0;
    user.status = "ACTIVE";
    user.inheritanceStatus = "ACTIVE";
    user.lastTierNotified = 0;

    user.verificationHistory.unshift({
      timestamp: now,
      status: "Verified",
      method: method || "Biometric Verification",
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Heartbeat timer refreshed and warning counter reset to 0/3.",
      status: user.status,
      inactivityWarningCount: 0,
      lastActiveDate: user.lastActiveDate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/heartbeat/ping - Refreshes heartbeat and resets warning counter to 0
router.post("/ping", async (req, res) => {
  try {
    const { ownerId, verifiedAt } = req.body;
    const targetId = ownerId || req.user?.id;

    let user = null;
    if (targetId) {
      user = await User.findById(targetId);
    }
    if (!user) {
      user = await User.findOne({ role: "owner" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const pingTime = verifiedAt ? new Date(verifiedAt) : new Date();

    user.lastActiveDate = pingTime;
    user.inactivityWarningCount = 0;
    user.status = "ACTIVE";
    user.inheritanceStatus = "ACTIVE";
    user.lastTierNotified = 0;

    user.verificationHistory.unshift({
      timestamp: pingTime,
      status: "Verified",
      method: "Face Verification Ping",
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Heartbeat verified. Status set to ACTIVE and warnings reset to 0.",
      status: user.status,
      inactivityWarningCount: 0,
      lastActiveDate: user.lastActiveDate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/heartbeat/trigger-warning - Explicitly advances warning notification (1 -> 2 -> 3: Inactive & SSS Release)
router.post("/trigger-warning", async (req, res) => {
  try {
    const { ownerId } = req.body;
    const targetId = ownerId || req.user?.id;

    let user = null;
    if (targetId) {
      user = await User.findById(targetId);
    }
    if (!user) {
      user = await User.findOne({ role: "owner" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "Owner vault account not found." });
    }

    // Process warning sequence through the central inactivity tracker
    const result = await processOwnerInactivityWarning(user);

    res.status(200).json({
      success: true,
      message: result.triggered
        ? `Final warning 3/3 reached! Vault transitioned to INACTIVE. SSS key shares released.`
        : `Warning notification ${result.warningCount}/3 sent successfully.`,
      warningCount: result.warningCount,
      maxWarnings: 3,
      status: result.status,
      triggered: result.triggered,
      transferAuthId: result.transferAuthId || user.transferAuthId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/heartbeat/simulate-expiration (Legacy demo helper)
router.post("/simulate-expiration", async (req, res) => {
  try {
    const { ownerId, daysAgo } = req.body;
    const targetId = ownerId || req.user?.id;

    let user = null;
    if (targetId) {
      user = await User.findById(targetId);
    }
    if (!user) {
      user = await User.findOne({ role: "owner" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Force user through warning 3 to test SSS release
    user.inactivityWarningCount = 2; // set to 2 so next warning is 3
    const result = await processOwnerInactivityWarning(user);

    res.status(200).json({
      success: true,
      message: `Simulated inactivity expiration: 3/3 warnings sent, status set to INACTIVE, SSS shares released.`,
      warningCount: 3,
      status: result.status,
      transferAuthId: result.transferAuthId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;