import { Router } from "express";
import {
  listKeys,
  getKey,
  createKey,
  pingKeyHeartbeat,
  pingAllKeys,
} from "../controllers/keyController.js";

const router = Router();

router.get("/", listKeys);
router.post("/heartbeat/all", pingAllKeys);
router.get("/:id", getKey);
router.post("/", createKey);
router.post("/:id/heartbeat", pingKeyHeartbeat);

export default router;
