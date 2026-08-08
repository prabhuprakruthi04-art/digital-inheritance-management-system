import { Router } from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env relative to routes directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") }); // Points to backend/.env

const router = Router();

let rawKey = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.trim() : "";
if (rawKey && !rawKey.startsWith("0x")) {
  rawKey = `0x${rawKey}`;
}

const ganacheUrl = process.env.GANACHE_URL || "http://127.0.0.1:7545";
const provider = new ethers.JsonRpcProvider(ganacheUrl);

let wallet;

if (rawKey && rawKey.length === 66) {
  wallet = new ethers.Wallet(rawKey, provider);
} else {
  console.warn("⚠️ WARNING: PRIVATE_KEY in backend/.env is invalid or missing.");
  console.warn("⚠️ Generating temporary random wallet so server can run.");
  wallet = ethers.Wallet.createRandom().connect(provider);
}

router.get("/status", async (req, res) => {
  try {
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(wallet.address);
    
    res.json({
      success: true,
      networkChainId: network.chainId.toString(),
      walletAddress: wallet.address,
      balanceEth: ethers.formatEther(balance),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;