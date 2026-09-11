import mongoose from "mongoose";

const claimLogSchema = new mongoose.Schema(
  {
    transferAuthId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    nomineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nominee",
    },
    nomineeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
    },
    assetCid: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
      trim: true,
    },
    otpExpiresAt: {
      type: Date,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["PENDING", "OTP_SENT", "VERIFIED", "CLAIMED", "EXPIRED", "REJECTED"],
      default: "PENDING",
    },
    keyShareReleased: {
      type: Boolean,
      default: false,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
    claimedAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
    auditTrail: [
      {
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        details: { type: String },
      },
    ],
  },
  { timestamps: true }
);

claimLogSchema.index({ transferAuthId: 1, nomineeEmail: 1 });

const ClaimLog = mongoose.model("ClaimLog", claimLogSchema);

export default ClaimLog;
