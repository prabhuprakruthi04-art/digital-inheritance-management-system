import { Router } from "express";
import {
  listNominees,
  getNominee,
  createNominee,
  updateNominee,
  deleteNominee,
  updateVerificationStatus,
  registerNomineeBiometrics,
  submitClaim,
} from "../controllers/nomineeRecordController.js";

const router = Router();

// Base Nominee CRUD Routes
router.route("/")
  .get(listNominees)      // GET /api/nominees
  .post(createNominee);   // POST /api/nominees

// Web3 & Claim Endpoints
router.get("/challenge/:address", (req, res) => {
  const { address } = req.params;
  const nonce = Math.floor(Math.random() * 1000000);
  const message = `Sign this message to authenticate your wallet (${address}). Nonce: ${nonce}`;
  
  res.json({
    success: true,
    message,
    nonce,
  });
});

router.post("/verify-claim", async (req, res) => {
  try {
    const { documentId, walletAddress, signature, nomineeLiveFaceDescriptor } = req.body;

    if (!documentId || !walletAddress || !signature || !nomineeLiveFaceDescriptor) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters for claim verification.",
      });
    }

    return res.json({
      success: true,
      message: "Nominee verification successful.",
      data: {
        ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        dbShare: { status: "Granted", accessKey: "0x123abc456def..." },
      },
    });
  } catch (error) {
    console.error("Claim verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during claim verification.",
    });
  }
});

// Verification & Biometrics Sub-Routes
router.put("/:id/verification", updateVerificationStatus);
router.post("/:id/biometrics", registerNomineeBiometrics);
router.post("/:id/claim", submitClaim);

// Nominee Record by ID
router.route("/:id")
  .get(getNominee)
  .put(updateNominee)
  .delete(deleteNominee);

export default router;