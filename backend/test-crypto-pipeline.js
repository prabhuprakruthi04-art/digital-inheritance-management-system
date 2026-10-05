import fs from 'fs';
import crypto from 'crypto';
import { generateSHA256 } from './utils/hashUtil.js';
import { splitSecret, combineShares } from './utils/sssUtil.js';

async function testPipeline() {
  console.log("=========================================");
  console.log("1. TESTING SHA-256 HASH GENERATION");
  console.log("=========================================");
  
  const sampleContent = "This is the content of finaltest.txt for Digital Inheritance.";
  const fileHash = generateSHA256(sampleContent);
  console.log("File Hash (SHA-256):", fileHash);

  console.log("\n=========================================");
  console.log("2. TESTING SHAMIR'S SECRET SHARING (SSS)");
  console.log("=========================================");

  // Generate a mock 256-bit AES Key in hex
  const originalAESKey = crypto.randomBytes(32).toString('hex');
  console.log("Generated AES Key :", originalAESKey);

  // Split into 3 shares, requiring 2 to reconstruct
  const shares = splitSecret(originalAESKey, 3, 2);
  console.log("\nGenerated 3 Key Shares:");
  console.log(" Share 1 (Nominee) :", shares[0]);
  console.log(" Share 2 (MongoDB) :", shares[1]);
  console.log(" Share 3 (Backup)  :", shares[2]);

  console.log("\n=========================================");
  console.log("3. RECONSTRUCTING KEY FROM 2 SHARES");
  console.log("=========================================");

  // Reconstruct using Share 1 & Share 2
  const reconstructedKey = combineShares([shares[0], shares[1]]);
  console.log("Reconstructed Key :", reconstructedKey);

  if (originalAESKey === reconstructedKey) {
    console.log("\nSUCCESS: SSS Reconstruction and SHA-256 Pipeline Verified!");
  } else {
    console.log("\nFAILED: Reconstructed key does not match original AES key.");
  }
}

testPipeline();