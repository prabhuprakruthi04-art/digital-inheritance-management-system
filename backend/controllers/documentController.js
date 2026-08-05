import DocumentMetadata from "../models/DocumentMetadata.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const listDocuments = asyncHandler(async (req, res) => {
  const { ownerId } = req.query;
  const filter = ownerId ? { ownerId } : {};
  const documents = await DocumentMetadata.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: documents });
});

export const getDocument = asyncHandler(async (req, res) => {
  const doc = await DocumentMetadata.findById(req.params.id);
  if (!doc) {
    const err = new Error("Document not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: doc });
});

export const createDocumentMetadata = asyncHandler(async (req, res) => {
  const doc = await DocumentMetadata.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await DocumentMetadata.findByIdAndDelete(req.params.id);
  if (!doc) {
    const err = new Error("Document not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, message: "Document metadata removed" });
});
