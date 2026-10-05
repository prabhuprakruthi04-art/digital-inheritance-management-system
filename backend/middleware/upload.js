import multer from "multer";
import path from "path";

// Allowed MIME type prefixes
const allowedPrefixes = ["image/", "video/", "application/pdf", "audio/"];

const fileFilter = (req, file, cb) => {
  // 1. Check if MIME type is allowed
  const isAllowed = allowedPrefixes.some((prefix) =>
    file.mimetype.startsWith(prefix)
  );

  if (!isAllowed) {
    return cb(
      new Error("Invalid file type. Allowed: Images, Videos, PDFs, and Audio files."),
      false
    );
  }

  // 2. Check size limits per type from Content-Length header
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

export const upload = multer({
  dest: path.join(process.cwd(), "backend", "uploads", "temp"),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // Outer cap set to 2 GB
  },
  fileFilter,
});