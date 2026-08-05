import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  listDocuments,
  getDocument,
  createDocumentMetadata,
  downloadDocument,
  deleteDocument,
} from "../controllers/documentController.js";

const router = Router();

// Ensure upload directory exists relative to project root
const uploadDir = path.join(process.cwd(), "backend", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration saving directly into backend/uploads
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Document routes
router.get("/", listDocuments);
router.get("/:id", getDocument);
router.get("/:id/download", downloadDocument);
router.post("/", upload.single("file"), createDocumentMetadata);
router.delete("/:id", deleteDocument);

export default router;