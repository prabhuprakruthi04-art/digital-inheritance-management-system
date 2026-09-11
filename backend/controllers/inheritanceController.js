import InheritanceRecord from "../models/InheritanceRecord.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Helper: Calculate Euclidean distance between two 128D facial vectors
const getEuclideanDistance = (desc1, desc2) => {
  if (!desc1 || !desc2 || desc1.length !== desc2.length) return Infinity;
  return Math.sqrt(
    desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0)
  );
};

// 1. List all inheritance records (filtered by ownerId if provided)
export const listInheritanceRecords = asyncHandler(async (req, res) => {
  const { ownerId } = req.query;
  const filter = ownerId ? { ownerId } : {};
  const records = await InheritanceRecord.find(filter)
    .populate("nomineeIds")
    .populate("keyIds")
    .sort({ createdAt: -1 });
    
  res.json({ success: true, data: records });
});

// 2. Get a single inheritance record by ID
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

// 3. Create a new inheritance record
export const createInheritanceRecord = asyncHandler(async (req, res) => {
  const record = await InheritanceRecord.create(req.body);
  res.status(201).json({ success: true, data: record });
});

// 4. Update an existing inheritance record
export const updateInheritanceRecord = asyncHandler(async (req, res) => {
  const record = await InheritanceRecord.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!record) {
    const err = new Error("Inheritance record not found");
    err.statusCode = 404;
    throw err;
  }
  
  res.json({ success: true, data: record });
});

// 5. Biometric-Verified Heartbeat Reset (Dead Man's Switch Timer Reset)
export const recordHeartbeat = asyncHandler(async (req, res) => {
  const { liveDescriptor } = req.body;
  const record = await InheritanceRecord.findById(req.params.id);

  if (!record) {
    const err = new Error("Inheritance record not found");
    err.statusCode = 404;
    throw err;
  }

  // Fetch the asset owner's user account to get their face baseline
  const owner = await User.findById(record.ownerId);
  if (!owner) {
    const err = new Error("Asset owner account not found");
    err.statusCode = 404;
    throw err;
  }

  // Enforce face verification if liveDescriptor is provided or required
  if (liveDescriptor && Array.isArray(liveDescriptor)) {
    if (!owner.faceDescriptor || owner.faceDescriptor.length === 0) {
      const err = new Error(
        "No baseline face profile found for this owner. Please complete biometric onboarding."
      );
      err.statusCode = 400;
      throw err;
    }

    const distance = getEuclideanDistance(owner.faceDescriptor, liveDescriptor);
    const THRESHOLD = 0.55;

    if (distance >= THRESHOLD) {
      const err = new Error("Biometric verification failed. Heartbeat timer was NOT reset.");
      err.statusCode = 401;
      throw err;
    }
  }

  const now = new Date();
  
  // SUPPORT FOR SECONDS (TESTING) OR DAYS (PRODUCTION)
  // Check if testing threshold in seconds exists, otherwise use days (default: 90 days)
  const nextDue = new Date(now);
  if (record.heartbeatIntervalSeconds) {
    nextDue.setSeconds(nextDue.getSeconds() + record.heartbeatIntervalSeconds);
  } else {
    const days = record.heartbeatIntervalDays || 90;
    nextDue.setDate(nextDue.getDate() + days);
  }

  // Update record dates and status
  record.lastHeartbeatAt = now;
  record.nextHeartbeatDue = nextDue;
  record.status = "active";
  await record.save();

  // Also sync owner's lastActiveDate in User model
  owner.lastActiveDate = now;
  owner.inheritanceStatus = "active";
  await owner.save();

  res.json({
    success: true,
    verified: liveDescriptor ? true : false,
    message: "Heartbeat recorded — dead man's switch timer reset successfully!",
    data: record,
  });
});