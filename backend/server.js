import dns from "dns";
// Force Node.js to use Google's Public DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { initHeartbeatCron } from "./jobs/heartbeatCron.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vite dev server
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("CRITICAL ERROR: MONGO_URI is missing from your .env file!");
} else {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB successfully.");
      // Start background heartbeat cron job after database connection
      initHeartbeatCron();
    })
    .catch((err) => console.error("MongoDB Connection Error:", err));
}

// Dedicated Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend operational",
  });
});

// Mount all API routes
app.use(routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Backend Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// JSON Fallback 404 Handler - Prevents Express from returning <!DOCTYPE html>
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});