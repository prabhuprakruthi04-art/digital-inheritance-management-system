import mongoose from "mongoose";

const documentMetadataSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, index: true },
    ownerEmail: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    originalFileName: { type: String },
    mimeType: { type: String },
    fileSize: { type: Number },
    /** AES-256 encrypted file stored locally or as blob reference */
    encryptedStoragePath: { type: String },
    /** IV + auth tag metadata for decryption (not the key) */
    encryptionMeta: {
      iv: String,
      authTag: String,
      algorithm: { type: String, default: "aes-256-gcm" },
    },
    ipfsCid: { type: String, index: true },
    ipfsGatewayUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "encrypting", "uploading", "synced", "failed"],
      default: "pending",
    },
    blockchainTxHash: { type: String, index: true },
    integrityHash: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("DocumentMetadata", documentMetadataSchema);
