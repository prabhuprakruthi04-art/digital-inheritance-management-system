import mongoose from "mongoose";

const digitalKeyRecordSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, index: true },
    inheritanceId: { type: mongoose.Schema.Types.ObjectId, ref: "InheritanceRecord" },
    keyName: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["active", "warning", "released", "revoked"],
      default: "active",
    },
    deadMansSwitchDays: { type: Number, required: true, default: 90 },
    lastHeartbeatAt: { type: Date, default: Date.now },
    nextHeartbeatDue: { type: Date },
    thresholdRequired: { type: String },
    thresholdNumerator: { type: Number, default: 2 },
    thresholdDenominator: { type: Number, default: 3 },
    assignedNomineeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "NomineeRecord" }],
    secretPiecesCount: { type: Number, default: 3 },
    /** Master secret never stored plain — only Shamir metadata */
    shamirConfig: {
      totalShares: Number,
      threshold: Number,
    },
    blockchainTxHash: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("DigitalKeyRecord", digitalKeyRecordSchema);
