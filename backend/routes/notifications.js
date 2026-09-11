import { Router } from "express";
import Notification from "../models/Notification.js";

const router = Router();

// GET /api/notifications
router.get("/", async (req, res) => {
  try {
    const userId = req.query.ownerId || req.user?._id;

    if (!userId) {
      return res.status(200).json({ success: true, notifications: [] });
    }

    // Fetch user notifications sorted by latest first
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/notifications/read-all
router.put("/read-all", async (req, res) => {
  try {
    const userId = req.body.ownerId || req.user?._id;

    await Notification.updateMany({ userId, read: false }, { read: true });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;