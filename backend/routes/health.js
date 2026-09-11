import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

// GET /api/health
router.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  res.status(200).json({
    status: "OK",
    message: "Backend operational",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;