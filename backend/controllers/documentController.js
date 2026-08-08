import path from "path";
import fs from "fs";
import { encryptFile, decryptFile } from "../utils/encryption.js";
import { uploadToIPFS } from "../utils/ipfs.js";
import DocumentMetadata from "../models/DocumentMetadata.js";

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

// 3. Create document metadata with file encryption & IPFS upload
export const createDocumentMetadata = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const encryptedFileName = `encrypted-${Date.now()}-${req.file.originalname}`;
    const encryptedPath = path.join(process.cwd(), "backend", "uploads", encryptedFileName);

    // 1. Encrypt uploaded file on disk
    const encryptionMeta = await encryptFile(req.file.path, encryptedPath);

    // 2. Upload encrypted file to IPFS via Pinata
    let ipfsHash = "";
    try {
      ipfsHash = await uploadToIPFS(encryptedPath);
    } catch (ipfsErr) {
      console.error("IPFS Upload Failed:", ipfsErr.message);
    }

    // 3. Clean up unencrypted temp file created by Multer
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // 4. Save details to MongoDB matching your Schema names (ipfsCid)
    const newDocument = await DocumentMetadata.create({
      ...req.body,
      originalFileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      encryptedStoragePath: encryptedPath,
      ipfsCid: ipfsHash || null,
      ipfsGatewayUrl: ipfsHash ? `https://gateway.pinata.cloud/ipfs/${ipfsHash}` : null,
      encryptionMeta: encryptionMeta,
      status: ipfsHash ? "synced" : "failed"
    });

    res.status(201).json({ success: true, data: newDocument });
  } catch (error) {
    next(error);
  }
};

// 4. Download document
export const downloadDocument = async (req, res, next) => {
  try {
    const document = await DocumentMetadata.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const filename = path.basename(document.encryptedStoragePath);

    const possiblePaths = [
      path.join(process.cwd(), "backend", "uploads", filename),
      path.join(process.cwd(), "uploads", filename),
      path.join(process.cwd(), "backend", "uploads", filename.replace(/^encrypted-/, "")),
      path.join(process.cwd(), "uploads", filename.replace(/^encrypted-/, ""))
    ];

    const filePath = possiblePaths.find((p) => fs.existsSync(p));

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: `File not found on disk for filename: ${filename}`
      });
    }

    const tempOutputPath = path.join(
      process.cwd(),
      "backend",
      "uploads",
      `temp-${Date.now()}-${document.originalFileName}`
    );

    await decryptFile(filePath, tempOutputPath, document.encryptionMeta);

    res.download(tempOutputPath, document.originalFileName, (err) => {
      if (fs.existsSync(tempOutputPath)) {
        fs.unlinkSync(tempOutputPath);
      }
    });
  } catch (error) {
    next(error);
  }
};

// 5. Delete document
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await DocumentMetadata.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    res.status(200).json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    next(error);
  }
};