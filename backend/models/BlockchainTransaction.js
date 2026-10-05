import mongoose from "mongoose";

const blockchainTransactionSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, index: true },
    relatedEntityType: {
      type: String,
      enum: ["document", "inheritance", "key", "nominee", "heartbeat", "release"],
      required: true,
    },
    relatedEntityId: { type: String },
    network: { type: String, default: "sepolia" },
    txHash: { type: String, required: true, unique: true, index: true },
    blockNumber: { type: Number },
    contractAddress: { type: String },
    method: { type: String },
    payloadHash: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
    gasUsed: { type: String },
    walletAddress: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model("BlockchainTransaction", blockchainTransactionSchema);
