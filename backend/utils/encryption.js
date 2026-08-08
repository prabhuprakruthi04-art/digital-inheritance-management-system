import crypto from "crypto";
import fs from "fs";

const algorithm = "aes-256-cbc";

/*
  Generate a random AES-256 key
  32 bytes = 256 bits
*/
export function generateAESKey() {
  return crypto.randomBytes(32);
}


/*
  Encrypt file using AES-256-CBC

  Returns:
  - iv
  - key (for SSS splitting)
  - algorithm
*/
export function encryptFile(inputPath, outputPath) {

  const key = generateAESKey();
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

        // store these in MongoDB
        iv: iv.toString("hex"),

        algorithm,

        // this key will be split using Shamir
        key: key.toString("hex")

      });

    });


    output.on("error", reject);
    input.on("error", reject);

  });

}


/*
  Decrypt file using AES key + IV
*/
export function decryptFile(
  encryptedPath,
  outputPath,
  encryptionMeta
) {

  const key = Buffer.from(
    encryptionMeta.key,
    "hex"
  );

  const iv = Buffer.from(
    encryptionMeta.iv,
    "hex"
  );


  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    iv
  );


  const input = fs.createReadStream(encryptedPath);
  const output = fs.createWriteStream(outputPath);


  input.pipe(decipher).pipe(output);


  return new Promise((resolve, reject)=>{

    output.on("finish",()=>{
      resolve(true);
    });


    output.on("error",reject);
    input.on("error",reject);

  });

}