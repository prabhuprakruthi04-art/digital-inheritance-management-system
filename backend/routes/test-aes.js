import crypto from "crypto";

// 1. Plain text input
const originalText = "CONFIDENTIAL WILL";
console.log("\n--- 1. ORIGINAL INPUT ---");
console.log("Plaintext:", originalText);

// 2. Encryption Setup (AES-256-CBC)
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16);  // 16-byte initialization vector

// 3. Encrypt the data
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
let encrypted = cipher.update(originalText, "utf8", "hex");
encrypted += cipher.final("hex");

console.log("\n--- 2. AES ENCRYPTED OUTPUT ---");
console.log("Scrambled Hex String:", encrypted);

// 4. Decrypt the data back
const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");

console.log("\n--- 3. DECRYPTED OUTPUT ---");
console.log("Restored Text:", decrypted);
console.log("-----------------------------\n");

