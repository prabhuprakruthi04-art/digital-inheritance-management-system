import { registryContract } from "./routes/blockchain.js";

async function testBlockchainConnection() {
  try {
    console.log("-----------------------------------------");
    console.log("1. Connecting to Ganache & Contract...");
    
    // Sample dummy data to test contract write function
    const testDocId = "DOC_TEST_" + Date.now();
    const testIpfsCid = "QmTestIPFS1234567890Hash";
    const testFileHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

    console.log(`2. Sending 'registerDocument' transaction for ID: ${testDocId}`);
    const tx = await registryContract.registerDocument(testDocId, testIpfsCid, testFileHash);
    
    console.log(`   Transaction Hash: ${tx.hash}`);
    console.log("3. Waiting for block to be mined on Ganache...");
    
    const receipt = await tx.wait();
    console.log(`   Success! Mined in Block Number: ${receipt.blockNumber}`);

    console.log("4. Reading record back from smart contract...");
    const record = await registryContract.getDocument(testDocId);
    
    console.log("-----------------------------------------");
    console.log("ON-CHAIN RECORD STORED:");
    console.log(" - IPFS CID:", record[0]);
    console.log(" - File Hash:", record[1]);
    console.log(" - Owner Address:", record[2]);
    console.log(" - Timestamp:", new Date(Number(record[3]) * 1000).toLocaleString());
    console.log("-----------------------------------------");
    
  } catch (error) {
    console.error("\n❌ Blockchain Test Failed:", error.message);
  }
}

testBlockchainConnection();