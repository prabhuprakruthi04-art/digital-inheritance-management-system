import multer from "multer";

// Async Handler Wrapper to eliminate try-catch blocks in controllers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 Not Found Middleware
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handling Middleware
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Handle Multer-specific errors (File size limits, invalid fields, etc.)
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size is too large. Maximum allowed size is 2 GB.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected field name in form-data upload.";
    } else {
      message = `Upload Error: ${err.message}`;
    }
  }

  // Handle custom file filter errors (e.g. invalid file extension/mimetype)
  if (err.message && err.message.includes("Invalid file type")) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};