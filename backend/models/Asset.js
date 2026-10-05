import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    nomineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nominee",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    originalFileName: {
      type: String,
    },
    mimeType: {
      type: String,
      default: "application/octet-stream",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    // AES-256-GCM Encrypted file location on server/temp disk
    encryptedStoragePath: {
      type: String,
    },
    // Cryptographic metadata required for authenticated AES-256-GCM decryption
    encryptionMeta: {
      iv: { type: String, required: true },
      authTag: { type: String, required: true },
      algorithm: { type: String, default: "aes-256-gcm" },
    },
    // Pinata / IPFS CID & Gateway URL
    ipfsCid: {
      type: String,
      index: true,
    },
    ipfsGatewayUrl: {
      type: String,
    },
    // SHA-256 integrity hash of the encrypted payload before IPFS pinning
    sha256Hash: {
      type: String,
      index: true,
    },
    // Shamir's Secret Sharing (2-of-3 threshold) key shares
    dbShare: {
      type: String,
      required: true,
    }, // Share 2 (stored safely in DB, released upon verified claim)
    backupShare: {
      type: String,
    }, // Share 3 (held for disaster recovery / legal escrow)
    status: {
      type: String,
      enum: ["PENDING", "ENCRYPTED", "SYNCED", "CLAIMED", "synced", "pending", "failed"],
      default: "ENCRYPTED",
    },
    blockchainTxHash: {
      type: String,
      index: true,
      default: null,
    },
  },
  { timestamps: true }
);

// Virtual property to support legacy frontends looking for 'docId' or 'fileName'
assetSchema.virtual("fileName").get(function () {
  return this.originalFileName || this.title;
});

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
