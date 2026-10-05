import mongoose from "mongoose";

const nomineeSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    relationship: {
      type: String,
      trim: true,
      default: "Trusted Contact",
    },
    walletAddress: {
      type: String,
      trim: true,
      default: "",
    },
    // Unique Transfer Authorization ID issued upon owner expiration
    transferAuthId: {
      type: String,
      index: true,
      default: null,
    },
    // Shamir's Secret Sharing Shard 2 (Held in DB, unlocked when owner status = EXPIRED)
    shamirShare2: {
      type: String,
      default: null,
    },
    isShareUnlocked: {
      type: Boolean,
      default: false,
    },
    allocatedPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending_id", "verified", "rejected"],
      default: "verified",
    },
    claimStatus: {
      type: String,
      enum: ["none", "submitted", "otp_sent", "approved", "released", "claimed"],
      default: "none",
    },
    assignedAssets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
      },
    ],
    lastNotificationSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

nomineeSchema.index({ ownerId: 1, email: 1 });

const Nominee = mongoose.model("Nominee", nomineeSchema);

export default Nominee;
