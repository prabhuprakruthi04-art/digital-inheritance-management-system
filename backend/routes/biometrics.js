import { Router } from "express";
import User from "../models/User.js";

const router = Router();

// POST /enroll-face
router.post("/enroll-face", async (req, res) => {
  try {
    const { ownerId, faceDescriptor } = req.body;

    if (!ownerId || !faceDescriptor) {
      return res.status(400).json({
        success: false,
        message: "Missing ownerId or faceDescriptor.",
      });
    }

    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database.",
      });
    }

    user.faceDescriptor = faceDescriptor;
    user.status = "ACTIVE";
    user.lastActiveDate = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Face profile registered successfully!",
      user: {
        id: user._id,
        status: user.status,
        lastActiveDate: user.lastActiveDate,
      },
    });
  } catch (error) {
    console.error("Enrollment Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to enroll face profile.",
    });
  }
});

// POST /verify-face
router.post("/verify-face", async (req, res) => {
  try {
    const { ownerId, faceDescriptor } = req.body;

    if (!ownerId || !faceDescriptor) {
      return res.status(400).json({
        success: false,
        message: "Missing ownerId or faceDescriptor.",
      });
    }

    const user = await User.findById(ownerId);
    if (!user || !user.faceDescriptor || user.faceDescriptor.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No enrolled face profile found. Please enroll first.",
      });
    }

    const calculateDistance = (a, b) =>
      Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));

    const distance = calculateDistance(user.faceDescriptor, faceDescriptor);
    const THRESHOLD = 0.6;

    if (distance <= THRESHOLD) {
      const now = new Date();
      user.lastActiveDate = now;
      user.status = "ACTIVE";

      if (!user.verificationHistory) {
        user.verificationHistory = [];
      }

      user.verificationHistory.unshift({
        verifiedAt: now,
        method: "Face Biometrics",
        status: "SUCCESS",
        confidenceScore: (100 - distance * 100).toFixed(1) + "%",
      });

      await user.save();

      return res.status(200).json({
        success: true,
        match: true,
        message: "Identity verified! Heartbeat timer reset successfully.",
        user: {
          status: user.status,
          lastActiveDate: user.lastActiveDate,
          verificationHistory: user.verificationHistory,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        match: false,
        message: "Face verification failed. Facial features do not match.",
      });
    }
  } catch (err) {
    console.error("Verification Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error during face verification.",
    });
  }
});

// GET /history
router.get("/history", async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (!ownerId) {
      return res.status(400).json({ success: false, message: "Missing ownerId parameter." });
    }

    const user = await User.findById(ownerId).select(
      "status lastActiveDate verificationHistory"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      data: {
        status: user.status || "ACTIVE",
        lastActiveDate: user.lastActiveDate || null,
        history: user.verificationHistory || [],
      },
    });
  } catch (err) {
    console.error("Fetch History Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;