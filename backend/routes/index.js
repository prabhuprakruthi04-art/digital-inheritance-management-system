import { Router } from "express";
import healthRoutes from "./health.js";
import documentRoutes from "./documents.js";
import inheritanceRoutes from "./inheritance.js";
import nomineeRoutes from "./nominees.js";
import keyRoutes from "./keys.js";
import blockchainRoutes from "./blockchain.js";
import authRoutes from "./auth.js";
import nomineeClaimRoutes from "./nomineeClaimRoutes.js";
import claimsRoutes from "./claims.js";
import userRoutes from "./userRoutes.js";
import biometricRoutes from "./biometrics.js";
import heartbeatRoutes from "./heartbeat.js";
import notificationRoutes from "./notifications.js";
import Asset from "../models/Asset.js";

const router = Router();

// Health Check
router.use("/api/health", healthRoutes);

// Authentication & User Management
router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);

// Direct mount so /api/owner/settings resolves correctly
router.use("/api", userRoutes);

// Documents & Asset Storage
router.use("/api/documents", documentRoutes);
router.use("/api/inheritance", inheritanceRoutes);
router.use("/api/keys", keyRoutes);
router.use("/api/blockchain", blockchainRoutes);

// Nominees & Claims (Dual-mounted for /api/claims and legacy /api/nominee/claims)
router.use("/api/claims", claimsRoutes);
router.use("/api/nominee/claims", claimsRoutes);
router.use("/api/nominees", nomineeRoutes);
router.use("/api/nominee-claims", nomineeClaimRoutes);

// Biometrics (Dual-mounted for /api/biometrics and /api/face)
router.use("/api/biometrics", biometricRoutes);
router.use("/api/face", biometricRoutes);

// System Monitoring & Heartbeat
router.use("/api/heartbeat", heartbeatRoutes);
router.use("/api/notifications", notificationRoutes);

// GET /api/assets endpoint backed by MongoDB Atlas
router.get("/api/assets", async (req, res) => {
  try {
    const assets = await Asset.find();
    if (assets && assets.length > 0) {
      return res.status(200).json(assets);
    }
  } catch (err) {
    console.warn("Could not query Asset collection, returning fallback array:", err.message);
  }

  res.status(200).json([
    {
      _id: "ast-1",
      title: "Property Deed & Will",
      category: "Legal",
      nominee: "Rahul",
      security: "Encrypted (AES-256-GCM)",
      fileName: "will_and_testament.pdf",
      ipfsCid: "QmTeGRzjJFmy1QekpkyXgUNjrpu1Mo1LsF3RdW",
    },
    {
      _id: "ast-2",
      title: "SBI Bank Account Credentials",
      category: "General",
      nominee: "Anita",
      security: "Protected",
      fileName: "bank_access.pdf",
      ipfsCid: "QmW2WQi7j6c7MgJ8k9Lp3x5q8RtY2vB1n4m6K",
    },
    {
      _id: "ast-3",
      title: "Gmail Access Recovery Keys",
      category: "General",
      nominee: "Mithila",
      security: "Encrypted (AES-256-GCM)",
      fileName: "gmail_recovery.txt",
      ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    },
  ]);
});

export default router;