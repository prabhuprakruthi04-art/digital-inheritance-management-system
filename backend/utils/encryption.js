import crypto from "crypto";
import fs from "fs";

const algorithm = "aes-256-cbc";

const key = crypto
  .createHash("sha256")
  .update("digital-inheritance-secret-key")
  .digest();

export function encryptFile(inputPath, outputPath) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    algorithm,
    key,
    iv
  );

  const input = fs.createReadStream(inputPath);
  const output = fs.createWriteStream(outputPath);

  input.pipe(cipher).pipe(output);

  return new Promise((resolve, reject) => {
    output.on("finish", () => {
      resolve({
        iv: iv.toString("hex"),
        algorithm
      });
    });

    output.on("error", reject);
  });
}

export function decryptFile(encryptedPath, outputPath, encryptionMeta) {
  const iv = Buffer.from(encryptionMeta.iv, "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    iv
  );

  const input = fs.createReadStream(encryptedPath);
  const output = fs.createWriteStream(outputPath);

  input.pipe(decipher).pipe(output);

  return new Promise((resolve, reject) => {
    output.on("finish", () => resolve(true));
    output.on("error", reject);
    input.on("error", reject);
  });
}