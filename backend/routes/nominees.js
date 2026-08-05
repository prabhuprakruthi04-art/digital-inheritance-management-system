import { Router } from "express";
import {
  listNominees,
  getNominee,
  createNominee,
  updateNominee,
  deleteNominee,
  updateVerificationStatus,
  submitClaim,
} from "../controllers/nomineeController.js";

const router = Router();

router.get("/", listNominees);
router.get("/:id", getNominee);
router.post("/", createNominee);
router.put("/:id", updateNominee);
router.delete("/:id", deleteNominee);
router.patch("/:id/verification", updateVerificationStatus);
router.post("/:id/claim", submitClaim);

export default router;
