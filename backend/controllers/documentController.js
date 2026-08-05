import path from "path";
import fs from "fs";
import { decryptFile } from "../utils/encryption.js";
import Document from "../models/document.js";

export const downloadDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const filename = path.basename(document.encryptedStoragePath);

    // Look for the encrypted file in all potential upload locations
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

    // Decrypt source file to temporary location
    await decryptFile(filePath, tempOutputPath, document.encryptionMeta);

    // Stream original file back to user and remove temporary decrypted copy
    res.download(tempOutputPath, document.originalFileName, (err) => {
      if (fs.existsSync(tempOutputPath)) {
        fs.unlinkSync(tempOutputPath);
      }
    });
  } catch (error) {
    next(error);
  }
};