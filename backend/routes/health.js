import { Router } from "express";
import { getConnectionState } from "../config/db.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    service: "Cloud-Based Digital Inheritance Management System API",
    version: "1.0.0",
    architecture: "Hybrid: Firebase (auth/UI) + MongoDB Atlas (inheritance records)",
    timestamp: new Date().toISOString(),
  });
});

router.get("/health", (req, res) => {
  const db = getConnectionState();
  const dbHealthy = db.readyState === 1;

  res.status(dbHealthy ? 200 : 503).json({
    success: dbHealthy,
    status: dbHealthy ? "healthy" : "degraded",
    checks: {
      api: "up",
      mongodb: dbHealthy ? "connected" : "disconnected",
    },
    database: db,
  });
});

export default router;
