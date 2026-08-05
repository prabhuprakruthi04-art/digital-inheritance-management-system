import { Router } from "express";
import {
  listDocuments,
  getDocument,
  createDocumentMetadata,
  deleteDocument,
} from "../controllers/documentController.js";

const router = Router();

router.get("/", listDocuments);
router.get("/:id", getDocument);
router.post("/", createDocumentMetadata);
router.delete("/:id", deleteDocument);

export default router;
