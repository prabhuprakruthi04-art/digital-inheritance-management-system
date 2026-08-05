import { Router } from "express";
import healthRoutes from "./health.js";
import documentRoutes from "./documents.js";
import inheritanceRoutes from "./inheritance.js";
import nomineeRoutes from "./nominees.js";
import keyRoutes from "./keys.js";
import blockchainRoutes from "./blockchain.js";

const router = Router();

router.use("/", healthRoutes);
router.use("/api/documents", documentRoutes);
router.use("/api/inheritance", inheritanceRoutes);
router.use("/api/nominees", nomineeRoutes);
router.use("/api/keys", keyRoutes);
router.use("/api/blockchain", blockchainRoutes);

export default router;
