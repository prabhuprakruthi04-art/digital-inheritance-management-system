import InheritanceRecord from "../models/InheritanceRecord.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const listInheritanceRecords = asyncHandler(async (req, res) => {
  const { ownerId } = req.query;
  const filter = ownerId ? { ownerId } : {};
  const records = await InheritanceRecord.find(filter)
    .populate("nomineeIds")
    .populate("keyIds")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: records });
});

export const getInheritanceRecord = asyncHandler(async (req, res) => {
  const record = await InheritanceRecord.findById(req.params.id)
    .populate("nomineeIds")
    .populate("keyIds")
    .populate("documentIds");
  if (!record) {
    const err = new Error("Inheritance record not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: record });
});

export const createInheritanceRecord = asyncHandler(async (req, res) => {
  const record = await InheritanceRecord.create(req.body);
  res.status(201).json({ success: true, data: record });
});

export const updateInheritanceRecord = asyncHandler(async (req, res) => {
  const record = await InheritanceRecord.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!record) {
    const err = new Error("Inheritance record not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: record });
});

export const recordHeartbeat = asyncHandler(async (req, res) => {
  const record = await InheritanceRecord.findById(req.params.id);
  if (!record) {
    const err = new Error("Inheritance record not found");
    err.statusCode = 404;
    throw err;
  }

  const now = new Date();
  const days = record.heartbeatIntervalDays || 90;
  const nextDue = new Date(now);
  nextDue.setDate(nextDue.getDate() + days);

  record.lastHeartbeatAt = now;
  record.nextHeartbeatDue = nextDue;
  record.status = "active";
  await record.save();

  res.json({
    success: true,
    message: "Heartbeat recorded — dead man's switch timer reset",
    data: record,
  });
});
