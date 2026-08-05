import DigitalKeyRecord from "../models/DigitalKeyRecord.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const listKeys = asyncHandler(async (req, res) => {
  const { ownerId } = req.query;
  const filter = ownerId ? { ownerId } : {};
  const keys = await DigitalKeyRecord.find(filter)
    .populate("assignedNomineeIds")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: keys });
});

export const getKey = asyncHandler(async (req, res) => {
  const key = await DigitalKeyRecord.findById(req.params.id).populate("assignedNomineeIds");
  if (!key) {
    const err = new Error("Digital key not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: key });
});

export const createKey = asyncHandler(async (req, res) => {
  const now = new Date();
  const days = req.body.deadMansSwitchDays || 90;
  const nextDue = new Date(now);
  nextDue.setDate(nextDue.getDate() + days);

  const key = await DigitalKeyRecord.create({
    ...req.body,
    lastHeartbeatAt: now,
    nextHeartbeatDue: nextDue,
    status: "active",
  });
  res.status(201).json({ success: true, data: key });
});

export const pingKeyHeartbeat = asyncHandler(async (req, res) => {
  const key = await DigitalKeyRecord.findById(req.params.id);
  if (!key) {
    const err = new Error("Digital key not found");
    err.statusCode = 404;
    throw err;
  }

  const now = new Date();
  const nextDue = new Date(now);
  nextDue.setDate(nextDue.getDate() + key.deadMansSwitchDays);

  key.lastHeartbeatAt = now;
  key.nextHeartbeatDue = nextDue;
  key.status = "active";
  await key.save();

  res.json({
    success: true,
    message: "Key heartbeat ping recorded",
    data: key,
  });
});

export const pingAllKeys = asyncHandler(async (req, res) => {
  const { ownerId } = req.body;
  const filter = ownerId ? { ownerId } : {};
  const keys = await DigitalKeyRecord.find(filter);
  const now = new Date();

  await Promise.all(
    keys.map(async (key) => {
      const nextDue = new Date(now);
      nextDue.setDate(nextDue.getDate() + key.deadMansSwitchDays);
      key.lastHeartbeatAt = now;
      key.nextHeartbeatDue = nextDue;
      key.status = "active";
      await key.save();
    })
  );

  res.json({
    success: true,
    message: "Global heartbeat recorded for all keys",
    data: keys,
  });
});
