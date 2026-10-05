import crypto from "crypto";
import fs from "fs";

const ALGORITHM = "aes-256-gcm";

/**
 * Generates a cryptographically strong 256-bit (32-byte) AES master key
 * @returns {Buffer}
 */
export function generateMasterKey() {
  return crypto.randomBytes(32);
}

/**
 * Calculates SHA-256 integrity hash of a Buffer or string
 * @param {Buffer|string} data
 * @returns {string} 0x prefixed hex hash
 */
export function calculateSHA256(data) {
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  return `0x${hash}`;
}

/**
 * Encrypts a file on disk using authenticated AES-256-GCM.
 * Computes the SHA-256 hash of the resulting ciphertext for integrity verification.
 * 
 * @param {string} inputPath Path to plaintext file
 * @param {string} outputPath Path where encrypted file will be written
 * @param {Buffer|string} [explicitKey] Optional predefined master key
 * @returns {Promise<{ algorithm: string, key: string, iv: string, authTag: string, sha256Hash: string }>}
 */
export async function encryptFile(inputPath, outputPath, explicitKey = null) {
  let keyBuffer;
  if (!explicitKey) {
    keyBuffer = generateMasterKey();
  } else if (typeof explicitKey === "string") {
    keyBuffer = Buffer.from(explicitKey, "hex");
  } else {
    keyBuffer = explicitKey;
  }

  // 12-byte IV is the recommended standard for GCM to prevent collision and maximize speed
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

  const input = fs.createReadStream(inputPath);
  const output = fs.createWriteStream(outputPath);

  return new Promise((resolve, reject) => {
    input.pipe(cipher).pipe(output);

    output.on("finish", () => {
      try {
        const authTag = cipher.getAuthTag();
        const encryptedBytes = fs.readFileSync(outputPath);
        const sha256Hash = calculateSHA256(encryptedBytes);

        resolve({
          algorithm: ALGORITHM,
          key: keyBuffer.toString("hex"),
          iv: iv.toString("hex"),
          authTag: authTag.toString("hex"),
          sha256Hash,
        });
      } catch (err) {
        reject(err);
      }
    });

    output.on("error", reject);
    input.on("error", reject);
  });
}

/**
 * Decrypts an AES-256-GCM encrypted file using the reconstructed key and authenticated tag
 * 
 * @param {string} encryptedPath Path to encrypted file
 * @param {string} outputPath Path for decrypted plaintext file
 * @param {Object} encryptionMeta Cryptographic metadata containing iv, authTag, and algorithm
 * @param {string} [customKey] Hex string of the reconstructed master key
 * @returns {Promise<boolean>}
 */
export async function decryptFile(encryptedPath, outputPath, encryptionMeta, customKey = null) {
  const keyHex = customKey || encryptionMeta?.key;
  if (!keyHex) {
    throw new Error("Missing decryption key for AES-256-GCM");
  }

  const keyBuffer = Buffer.from(keyHex, "hex");
  const ivBuffer = Buffer.from(encryptionMeta.iv, "hex");
  const authTagBuffer = Buffer.from(encryptionMeta.authTag, "hex");

  const decipher = crypto.createDecipheriv(
    encryptionMeta.algorithm || ALGORITHM,
    keyBuffer,
    ivBuffer
  );
  decipher.setAuthTag(authTagBuffer);

  const input = fs.createReadStream(encryptedPath);
  const output = fs.createWriteStream(outputPath);

  return new Promise((resolve, reject) => {
    input.pipe(decipher).pipe(output);

    output.on("finish", () => {
      resolve(true);
    });

    output.on("error", (err) => {
      reject(new Error(`Decryption failed (Authentication Tag mismatch or corrupted key): ${err.message}`));
    });
    input.on("error", reject);
  });
}

/**
 * In-memory buffer encryption helper (for small payloads / credentials)
 */
export function encryptBuffer(buffer, keyBuffer = null) {
  const key = keyBuffer || generateMasterKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const sha256Hash = calculateSHA256(encrypted);

  return {
    algorithm: ALGORITHM,
    key: key.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    encryptedData: encrypted.toString("hex"),
    sha256Hash,
  };
}

/**
 * In-memory buffer decryption helper
 */
export function decryptBuffer(encryptedBuffer, keyHex, ivHex, authTagHex) {
  const key = Buffer.from(keyHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}

export default {
  generateMasterKey,
  calculateSHA256,
  encryptFile,
  decryptFile,
  encryptBuffer,
  decryptBuffer,
};