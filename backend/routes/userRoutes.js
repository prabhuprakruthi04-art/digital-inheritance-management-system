import express from "express";

const router = express.Router();

// 1. Owner Settings Endpoint (/api/owner/settings)
router.post("/owner/settings", async (req, res) => {
  try {
    const settingsData = req.body;
    console.log("Saving Owner Settings:", settingsData);

    return res.status(200).json({
      success: true,
      message: "Owner settings saved successfully.",
      data: settingsData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Heartbeat Verification Ping Endpoint (/api/heartbeat/ping)
router.post("/heartbeat/ping", async (req, res) => {
  try {
    const { ownerId, verifiedAt } = req.body;
    console.log("Heartbeat Ping Received:", ownerId, verifiedAt);

    return res.status(200).json({
      success: true,
      message: "Heartbeat status updated successfully.",
      timestamp: verifiedAt || new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Assets Listing Endpoint (/api/assets)
router.get("/assets", async (req, res) => {
  try {
    const sampleAssets = [
      {
        _id: "ast-1",
        title: "Property Deed & Will",
        category: "Legal",
        nominee: "Rahul",
        security: "Encrypted",
        fileName: "will_and_testament.pdf",
      },
      {
        _id: "ast-2",
        title: "SBI Bank Account Credentials",
        category: "General",
        nominee: "Anita",
        security: "Protected",
        fileName: "bank_access.pdf",
      },
      {
        _id: "ast-3",
        title: "Gmail Access Recovery Keys",
        category: "General",
        nominee: "Mithila",
        security: "Encrypted",
        fileName: "gmail_recovery.txt",
      },
    ];

    return res.status(200).json(sampleAssets);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;