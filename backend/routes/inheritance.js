import { Router } from "express";
import {
  listInheritanceRecords,
  getInheritanceRecord,
  createInheritanceRecord,
  updateInheritanceRecord,
  recordHeartbeat,
} from "../controllers/inheritanceController.js";

const router = Router();

router.get("/", listInheritanceRecords);
router.get("/:id", getInheritanceRecord);
router.post("/", createInheritanceRecord);
router.put("/:id", updateInheritanceRecord);
router.post("/:id/heartbeat", recordHeartbeat);

export default router;
