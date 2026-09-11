import { splitSecret, combineShares } from "./utils/sssUtil.js";

const aesKey = "my-secret-aes-key";

const shares = splitSecret(aesKey, 3, 2);

console.log("Original Key:", aesKey);

console.log("\nGenerated Shares:");

shares.forEach((share, index) => {
    console.log(`Share ${index + 1}:`, share);
});

const recoveredKey = combineShares([shares[0], shares[1]]);

console.log("\nRecovered Key:", recoveredKey);