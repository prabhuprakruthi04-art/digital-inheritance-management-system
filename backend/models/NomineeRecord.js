import mongoose from "mongoose";

const nomineeRecordSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, index: true },
    inheritanceId: { type: mongoose.Schema.Types.ObjectId, ref: "InheritanceRecord" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true },
    walletAddress: { type: String, trim: true },
    allocatedPercentage: { type: Number, min: 0, max: 100, default: 0 },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending_id", "verified", "rejected"],
      default: "pending_id",
    },
    /** Shamir shard index assigned to this nominee (if any) */
    shamirShardIndex: { type: Number },
    shamirShardEncrypted: { type: String },
    assignedAssetCount: { type: Number, default: 0 },
    claimStatus: {
      type: String,
      enum: ["none", "submitted", "approved", "released"],
      default: "none",
    },
    claimSubmittedAt: { type: Date },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

nomineeRecordSchema.index({ ownerId: 1, email: 1 });

export default mongoose.model("NomineeRecord", nomineeRecordSchema);
