import path from "path";
import fs from "fs";
import { split, combine } from "shamir-secret-sharing";
import { encryptFile, decryptFile } from "../utils/encryption.js";
import { uploadToIPFS } from "../utils/ipfs.js";
import DocumentMetadata from "../models/DocumentMetadata.js";

// Helper: Convert AES key string/buffer into 3 SSS shares (2-of-3 threshold)
const splitKeyWithSSS = async (aesKeyBuffer) => {
  const keyUint8 = new Uint8Array(aesKeyBuffer);
  // Total = 3 shares, Threshold = 2
  const sharesUint8 = await split(keyUint8, 3, 2);
  return sharesUint8.map((s) => Buffer.from(s).toString("hex"));
};

// Helper: Combine 2 Hex Shares to recover AES key Buffer
const combineSSSKeys = async (shareHexA, shareHexB) => {
  const sharesUint8 = [
    new Uint8Array(Buffer.from(shareHexA, "hex")),
    new Uint8Array(Buffer.from(shareHexB, "hex"))
  ];
  const recoveredUint8 = await combine(sharesUint8);
  return Buffer.from(recoveredUint8);
};

// 1. List all documents
export const listDocuments = async (req, res, next) => {
  try {
    const documents = await DocumentMetadata.find();
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

// 2. Get single document by ID
export const getDocument = async (req, res, next) => {
  try {
    const document = await DocumentMetadata.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    res.status(200).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

// 3. Create document metadata with file encryption & IPFS upload & SSS key splitting
export const createDocumentMetadata = async (req, res, next) => {
  let encryptedPath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const uploadsDir = path.join(process.cwd(), "backend", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const encryptedFileName = `encrypted-${Date.now()}-${req.file.originalname}`;
    encryptedPath = path.join(uploadsDir, encryptedFileName);

    // 1. Encrypt uploaded file on disk (stream-based AES encryption)
    const encryptionMeta = await encryptFile(req.file.path, encryptedPath);

    // Extract raw AES key
    const masterKeyBuffer = Buffer.from(encryptionMeta.key, "hex");

    // 2. Split AES Key into 3 SSS Shares (Threshold = 2)
    const [share1_Nominee, share2_Database, share3_Backup] = await splitKeyWithSSS(masterKeyBuffer);

    console.log("\n====== SSS KEYS GENERATED ======");
    console.log("Share 1 (Nominee) :", share1_Nominee);
    console.log("Share 2 (Database):", share2_Database);
    console.log("Share 3 (Backup)  :", share3_Backup);
    console.log("================================\n");

    // 3. Sanitize encryption metadata (never store master key in DB)
    const sanitizedEncryptionMeta = { ...encryptionMeta };
    delete sanitizedEncryptionMeta.key;

    // 4. Upload encrypted file to IPFS via Pinata
    let ipfsHash = "";
    try {
      ipfsHash = await uploadToIPFS(encryptedPath);
    } catch (ipfsErr) {
      console.error("IPFS Upload Failed:", ipfsErr.message);
    }

    // 5. Clean up unencrypted temp file created by Multer
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // --- FIX FOR REQUIRED SCHEMA VALIDATION ERRORS ---
    const name = req.body.name || req.file.originalname || "Untitled Document";
    const category = req.body.category || "General";
    
    // Extract ownerId from logged in req.user or req.body (fallback to system/demo owner ID if not set)
    const ownerId =
      req.user?._id ||
      req.user?.id ||
      req.body.ownerId ||
      "650000000000000000000000";

    // 6. Save details to MongoDB with required Mongoose schema fields
    const docData = {
      ...req.body,
      name,
      title: name,
      category,
      ownerId,
      originalFileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      encryptedStoragePath: encryptedPath,
      ipfsCid: ipfsHash || null,
      ipfsGatewayUrl: ipfsHash ? `https://gateway.pinata.cloud/ipfs/${ipfsHash}` : null,
      encryptionMeta: sanitizedEncryptionMeta,
      sha256Hash: encryptionMeta.sha256Hash || null,
      integrityHash: encryptionMeta.sha256Hash || null,
      dbShare: share2_Database,     // Share 2
      backupShare: share3_Backup,   // Share 3
      status: ipfsHash ? "synced" : "failed"
    };

    const newDocument = await DocumentMetadata.create(docData);

    // Also persist in Asset model for complete database parity
    try {
      await (await import("../models/Asset.js")).default.create({
        ...docData,
        status: ipfsHash ? "SYNCED" : "ENCRYPTED"
      });
    } catch (assetErr) {
      console.warn("Asset model sync warning:", assetErr.message);
    }

    // 7. Return Nominee Share (Share 1) in API response
    res.status(201).json({
      success: true,
      message: "Document encrypted via AES-256-GCM and key split into 2-of-3 SSS shares successfully",
      data: newDocument,
      sha256Hash: encryptionMeta.sha256Hash,
      nomineeShare: share1_Nominee
    });
  } catch (error) {
    // Clean up temporary files on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    if (encryptedPath && fs.existsSync(encryptedPath)) {
      fs.unlinkSync(encryptedPath);
    }
    next(error);
  }
};

// 4. Download / Decrypt document using Nominee Share + DB Share
export const downloadDocument = async (req, res, next) => {
  let tempOutputPath = null;
  try {
    const document = await DocumentMetadata.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Safely extract nomineeShare from query or body (or fallback to backupShare for testing)
    const nomineeShare =
      req.query?.nomineeShare ||
      req.body?.nomineeShare ||
      document.backupShare;

    if (!nomineeShare) {
      return res.status(400).json({
        success: false,
        message: "Missing nomineeShare required for SSS key reconstruction"
      });
    }

    const filename = path.basename(document.encryptedStoragePath);

    const possiblePaths = [
      path.join(process.cwd(), "backend", "uploads", filename),
      path.join(process.cwd(), "uploads", filename),
      document.encryptedStoragePath
    ];

    const filePath = possiblePaths.find((p) => p && fs.existsSync(p));

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: `File not found on disk: ${filename}`
      });
    }

    const uploadsDir = path.dirname(filePath);
    tempOutputPath = path.join(
      uploadsDir,
      `temp-${Date.now()}-${document.originalFileName}`
    );

    // 1. Reconstruct Master AES Key from (Nominee Share + DB Share)
    const recoveredKeyBuffer = await combineSSSKeys(nomineeShare, document.dbShare);

    // 2. Rebuild encryption metadata with reconstructed key
    const fullEncryptionMeta = {
      ...document.encryptionMeta,
      key: recoveredKeyBuffer.toString("hex")
    };

    // 3. Decrypt file using recovered key
    await decryptFile(filePath, tempOutputPath, fullEncryptionMeta);

    // 4. Stream decrypted file back to client safely
    res.setHeader("Content-Type", document.mimeType || "application/octet-stream");
    res.download(tempOutputPath, document.originalFileName, (err) => {
      if (tempOutputPath && fs.existsSync(tempOutputPath)) {
        try {
          fs.unlinkSync(tempOutputPath);
        } catch (cleanupErr) {
          console.error("Failed to delete temp file:", cleanupErr.message);
        }
      }
      if (err && !res.headersSent) {
        return next(err);
      }
    });
  } catch (error) {
    if (tempOutputPath && fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath);
    }
    next(error);
  }
};

// 5. Delete document (also cleans up disk file)
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await DocumentMetadata.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Clean up local encrypted file if present
    if (document.encryptedStoragePath && fs.existsSync(document.encryptedStoragePath)) {
      fs.unlinkSync(document.encryptedStoragePath);
    }

    res.status(200).json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    next(error);
  }
};