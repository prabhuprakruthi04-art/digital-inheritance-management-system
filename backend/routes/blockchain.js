import { Router } from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env relative to the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const router = Router();

// Process and format private key safely
let rawKey = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.trim() : "";
if (rawKey && !rawKey.startsWith("0x") && rawKey.length === 64) {
  rawKey = `0x${rawKey}`;
}

const ganacheUrl = process.env.GANACHE_URL || "http://127.0.0.1:7545";
const provider = new ethers.JsonRpcProvider(ganacheUrl);

let wallet;

if (rawKey && rawKey.length === 66) {
  try {
    wallet = new ethers.Wallet(rawKey, provider);
  } catch (err) {
    console.error("❌ Invalid PRIVATE_KEY format. Using random wallet as fallback.");
    wallet = ethers.Wallet.createRandom().connect(provider);
  }
} else {
  console.warn("⚠️ WARNING: PRIVATE_KEY in .env is missing or incorrect length.");
  console.warn("⚠️ Generating temporary random wallet so backend server can run.");
  wallet = ethers.Wallet.createRandom().connect(provider);
}

// Check Web3 Provider & Wallet Connection Status
router.get("/status", async (req, res) => {
  try {
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(wallet.address);

    res.json({
      success: true,
      providerUrl: ganacheUrl,
      networkChainId: network.chainId.toString(),
      walletAddress: wallet.address,
      balanceEth: ethers.formatEther(balance),
    });
  } catch (error) {
    console.error("Blockchain Status Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Unable to connect to blockchain provider",
      details: error.message,
    });
  }
});

export default router;