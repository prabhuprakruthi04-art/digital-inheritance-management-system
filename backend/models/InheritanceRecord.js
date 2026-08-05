import mongoose from "mongoose";

const inheritanceRecordSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, index: true },
    ownerEmail: { type: String, trim: true },
    ownerWalletAddress: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["draft", "active", "heartbeat_warning", "released", "revoked"],
      default: "draft",
    },
    totalAssetValue: { type: String },
    assetIds: [{ type: String }],
    nomineeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "NomineeRecord" }],
    keyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "DigitalKeyRecord" }],
    documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "DocumentMetadata" }],
    lastHeartbeatAt: { type: Date },
    heartbeatIntervalDays: { type: Number, default: 90 },
    nextHeartbeatDue: { type: Date },
    releaseTriggeredAt: { type: Date },
    blockchainAnchorTx: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("InheritanceRecord", inheritanceRecordSchema);
