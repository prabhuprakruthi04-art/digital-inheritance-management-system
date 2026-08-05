import NomineeRecord from "../models/NomineeRecord.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const listNominees = asyncHandler(async (req, res) => {
  const { ownerId, email } = req.query;
  const filter = {};
  if (ownerId) filter.ownerId = ownerId;
  if (email) filter.email = email.toLowerCase();

  const nominees = await NomineeRecord.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: nominees });
});

export const getNominee = asyncHandler(async (req, res) => {
  const nominee = await NomineeRecord.findById(req.params.id);
  if (!nominee) {
    const err = new Error("Nominee not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: nominee });
});

export const createNominee = asyncHandler(async (req, res) => {
  const nominee = await NomineeRecord.create(req.body);
  res.status(201).json({ success: true, data: nominee });
});

export const updateNominee = asyncHandler(async (req, res) => {
  const nominee = await NomineeRecord.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!nominee) {
    const err = new Error("Nominee not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: nominee });
});

export const deleteNominee = asyncHandler(async (req, res) => {
  const nominee = await NomineeRecord.findByIdAndDelete(req.params.id);
  if (!nominee) {
    const err = new Error("Nominee not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, message: "Nominee removed" });
});

export const updateVerificationStatus = asyncHandler(async (req, res) => {
  const { verificationStatus } = req.body;
  const nominee = await NomineeRecord.findByIdAndUpdate(
    req.params.id,
    { verificationStatus },
    { new: true, runValidators: true }
  );
  if (!nominee) {
    const err = new Error("Nominee not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: nominee });
});

export const submitClaim = asyncHandler(async (req, res) => {
  const nominee = await NomineeRecord.findById(req.params.id);
  if (!nominee) {
    const err = new Error("Nominee not found");
    err.statusCode = 404;
    throw err;
  }

  nominee.claimStatus = "submitted";
  nominee.claimSubmittedAt = new Date();
  await nominee.save();

  res.json({
    success: true,
    message: "Inheritance claim submitted for quorum review",
    data: nominee,
  });
});
