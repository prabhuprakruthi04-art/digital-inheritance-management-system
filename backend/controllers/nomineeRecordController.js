import NomineeRecord from "../models/NomineeRecord.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Helper: Calculate Euclidean distance between two 128D facial vectors
const getEuclideanDistance = (desc1, desc2) => {
  if (!desc1 || !desc2 || desc1.length !== desc2.length) return Infinity;
  return Math.sqrt(
    desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0)
  );
};

// 1. List all nominees (filtered by ownerId or email)
export const listNominees = asyncHandler(async (req, res) => {
  const { ownerId, email } = req.query;
  const filter = {};
  if (ownerId) filter.ownerId = ownerId;
  if (email) filter.email = email.toLowerCase();

  const nominees = await NomineeRecord.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: nominees });
});

// 2. Get a single nominee record by ID
export const getNominee = asyncHandler(async (req, res) => {
  const nominee = await NomineeRecord.findById(req.params.id);
  if (!nominee) {
    const err = new Error("Nominee not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: nominee });
});

// 3. Create a new nominee record
export const createNominee = asyncHandler(async (req, res) => {
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }
  if (req.body.walletAddress) {
    req.body.walletAddress = req.body.walletAddress.toLowerCase();
  }

  const nominee = await NomineeRecord.create(req.body);
  res.status(201).json({ success: true, data: nominee });
});

// 4. Update an existing nominee record
export const updateNominee = asyncHandler(async (req, res) => {
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }
  if (req.body.walletAddress) {
    req.body.walletAddress = req.body.walletAddress.toLowerCase();
  }

  const nominee = await NomineeRecord.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!nominee) {
    const err = new Error("Nominee not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: nominee });
});

// 5. Delete a nominee record
export const deleteNominee = asyncHandler(async (req, res) => {
  const nominee = await NomineeRecord.findByIdAndDelete(req.params.id);
  if (!nominee) {
    const err = new Error("Nominee not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, message: "Nominee removed" });
});

// 6. Update manual verification status
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

// 7. Register or Update Nominee Biometric Face Profile
export const registerNomineeBiometrics = asyncHandler(async (req, res) => {
  const { faceDescriptor } = req.body;

  if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
    const err = new Error("A valid 128D faceDescriptor array is required.");
    err.statusCode = 400;
    throw err;
  }

  const nominee = await NomineeRecord.findById(req.params.id);
  if (!nominee) {
    const err = new Error("Nominee record not found");
    err.statusCode = 404;
    throw err;
  }

  nominee.faceDescriptor = faceDescriptor;
  nominee.verificationStatus = "verified";
  await nominee.save();

  res.json({
    success: true,
    message: "Nominee biometric baseline face descriptor saved successfully",
    data: nominee,
  });
});

// 8. Submit Claim with Biometric Verification & Owner Inactivity Check
export const submitClaim = asyncHandler(async (req, res) => {
  const { liveDescriptor } = req.body;
  const nominee = await NomineeRecord.findById(req.params.id);

  if (!nominee) {
    const err = new Error("Nominee not found");
    err.statusCode = 404;
    throw err;
  }

  // Check if owner account inactivity is triggered
  const owner = await User.findById(nominee.ownerId);
  if (!owner || owner.inheritanceStatus !== "triggered") {
    const err = new Error(
      "Claim denied: Asset owner is still active. Timer has not expired."
    );
    err.statusCode = 403;
    throw err;
  }

  // Perform face scan comparison if liveDescriptor is provided
  if (liveDescriptor && Array.isArray(liveDescriptor)) {
    if (!nominee.faceDescriptor || nominee.faceDescriptor.length === 0) {
      const err = new Error(
        "Nominee has no stored face profile. Please complete biometric onboarding first."
      );
      err.statusCode = 400;
      throw err;
    }

    const distance = getEuclideanDistance(nominee.faceDescriptor, liveDescriptor);
    const THRESHOLD = 0.55;

    if (distance >= THRESHOLD) {
      const err = new Error(
        "Biometric verification failed. Face scan does not match the nominee profile."
      );
      err.statusCode = 401;
      throw err;
    }
  }

  nominee.claimStatus = "submitted";
  nominee.claimSubmittedAt = new Date();
  await nominee.save();

  res.json({
    success: true,
    verified: liveDescriptor ? true : false,
    message: "Inheritance claim verified and submitted for quorum review",
    data: nominee,
  });
});