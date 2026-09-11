const hre = require("hardhat");

async function main() {
  console.log("Deploying DigitalInheritance contract to Ganache...");

  const DigitalInheritance = await hre.ethers.getContractFactory("DigitalInheritance");
  const contract = await DigitalInheritance.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`✅ DigitalInheritance deployed successfully to Ganache at: ${contractAddress}`);
  console.log(`Update CONTRACT_ADDRESS in your backend .env file with this address.`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
