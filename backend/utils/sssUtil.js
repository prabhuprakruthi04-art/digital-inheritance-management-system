import secrets from "secrets.js-grempe";
import { split as sssSplit, combine as sssCombine } from "shamir-secret-sharing";

/**
 * Splits a 64-char Hex AES master key into Shamir's Secret Sharing shares.
 * Default: 3 shares generated, 2 required to reconstruct (2-of-3 threshold).
 * 
 * @param {string|Buffer} secretKey Hex string (64 chars) or Buffer
 * @param {number} totalShares Number of shares to create (default 3)
 * @param {number} threshold Minimum shares required to recover secret (default 2)
 * @returns {Array<string>} Array of hex-encoded secret shares
 */
export function splitSecret(secretKey, totalShares = 3, threshold = 2) {
  const hexKey = typeof secretKey === "string" ? secretKey : secretKey.toString("hex");
  try {
    // Primary: secrets.js-grempe generates clean hex shards
    return secrets.share(hexKey, totalShares, threshold);
  } catch (err) {
    console.warn("secrets.js-grempe fallback triggered:", err.message);
    // Fallback: simple deterministic split
    const hex = secrets.str2hex(hexKey);
    return secrets.share(hex, totalShares, threshold);
  }
}

/**
 * Reconstructs the original 64-char Hex AES master key from 2 or more shares.
 * 
 * @param {Array<string>} sharesArray Array containing at least threshold valid shares
 * @returns {string} Reconstructed master key in hex format
 */
export function combineShares(sharesArray) {
  if (!Array.isArray(sharesArray) || sharesArray.length < 2) {
    throw new Error("At least 2 key shares are required to reconstruct the master key");
  }

  try {
    const combined = secrets.combine(sharesArray);
    // Validate if output is valid 64-char hex key
    if (combined && combined.length === 64) {
      return combined;
    }
    // If str2hex was used originally
    try {
      const decoded = secrets.hex2str(combined);
      if (decoded && decoded.length === 64) {
        return decoded;
      }
    } catch {
      // ignore
    }
    return combined;
  } catch (error) {
    throw new Error(`Failed to reconstruct secret key from shares: ${error.message}`);
  }
}

/**
 * Buffer-level async helper using shamir-secret-sharing package
 */
export async function splitKeyBuffer(keyBuffer, total = 3, threshold = 2) {
  const keyUint8 = new Uint8Array(keyBuffer);
  const sharesUint8 = await sssSplit(keyUint8, total, threshold);
  return sharesUint8.map((s) => Buffer.from(s).toString("hex"));
}

export async function combineKeyBuffers(shareHexA, shareHexB) {
  const sharesUint8 = [
    new Uint8Array(Buffer.from(shareHexA, "hex")),
    new Uint8Array(Buffer.from(shareHexB, "hex")),
  ];
  const recoveredUint8 = await sssCombine(sharesUint8);
  return Buffer.from(recoveredUint8).toString("hex");
}

export default {
  splitSecret,
  combineShares,
  splitKeyBuffer,
  combineKeyBuffers,
};