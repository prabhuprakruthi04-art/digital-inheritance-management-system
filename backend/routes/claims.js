import { Router } from "express";
import {
  requestOtp,
  verifyOtp,
  listClaimableAssets,
  downloadDecryptedClaim,
} from "../controllers/claimsController.js";

const router = Router();

// 1. Request OTP for Transfer Authorization ID & Asset
router.post("/request-otp", requestOtp);

// 2. Verify OTP & Reconstruct Master AES-256 Key via SSS
router.post("/verify-otp", verifyOtp);

// 3. List Assigned Encrypted Assets for Nominee
router.get("/assets", listClaimableAssets);

// 4. Download / Decrypt Asset
router.get("/download/:id", downloadDecryptedClaim);

export default router;
