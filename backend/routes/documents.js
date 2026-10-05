import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  listDocuments,
  getDocument,
  createDocumentMetadata,
  downloadDocument,
  deleteDocument,
} from "../controllers/documentController.js";

const router = Router();

// 1. Define allowed MIME types
const allowedPrefixes = ["image/", "video/", "application/pdf", "audio/"];

// 2. Custom file filter for dynamic size checking (2 GB for Video, 100 MB for others)
const fileFilter = (req, file, cb) => {
  const isAllowed = allowedPrefixes.some((prefix) =>
    file.mimetype.startsWith(prefix)
  );

  if (!isAllowed) {
    return cb(
      new Error(
        "Invalid file type. Only Images, Videos, PDFs, and Audio files are allowed."
      ),
      false
    );
  }

  const fileSize = parseInt(req.headers["content-length"] || "0", 10);
  const isVideo = file.mimetype.startsWith("video/");

  const maxVideoSize = 2 * 1024 * 1024 * 1024; // 2 GB
  const maxOtherSize = 100 * 1024 * 1024;       // 100 MB

  if (isVideo && fileSize > maxVideoSize) {
    return cb(new Error("Video file size exceeds the 2 GB limit."), false);
  }

  if (!isVideo && fileSize > maxOtherSize) {
    return cb(new Error("File size exceeds the 100 MB limit."), false);
  }

  cb(null, true);
};

// 3. Configure Multer middleware instance
const upload = multer({
  dest: path.join(process.cwd(), "backend", "uploads", "temp"),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // Outer limit cap set to 2 GB
  },
  fileFilter,
});

// Helper middleware to accept either "file" or "document" field names
const handleFileUpload = (req, res, next) => {
  const uploadSingle = upload.fields([
    { name: "file", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]);

  uploadSingle(req, res, (err) => {
    if (err) return next(err);
    // Normalize uploaded file object to req.file
    if (req.files) {
      req.file = req.files["file"]?.[0] || req.files["document"]?.[0];
    }
    next();
  });
};

// 4. Document Routes
router.get("/", listDocuments);
router.get("/:id", getDocument);

// Handle POST to both / and /upload
router.post("/", handleFileUpload, createDocumentMetadata);
router.post("/upload", handleFileUpload, createDocumentMetadata);

router.get("/:id/download", downloadDocument);
router.delete("/:id", deleteDocument);

export default router;