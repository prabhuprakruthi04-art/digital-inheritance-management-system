import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";

dotenv.config();

// Contract ABI definition for DigitalInheritance
const DIGITAL_INHERITANCE_ABI = [
  "function createPlan(address nominee, string memory verificationHash, string memory ipfsCid) external returns (bool)",
  "function recordHeartbeat() external returns (bool)",
  "function transitionState(address planOwner, uint8 newState) external returns (bool)",
  "function releaseKeyShare(address planOwner, string memory authId) external returns (bool)",
  "function getPlan(address planOwner) external view returns (address owner, address nominee, string memory verificationHash, string memory ipfsCid, uint8 state, uint256 lastHeartbeat, uint256 createdAt, uint256 inheritedAt)",
  "function verifyNominee(address planOwner, address candidateNominee) external view returns (bool)",
  "event PlanCreated(address indexed owner, address indexed nominee, string ipfsCid, uint256 timestamp)",
  "event HeartbeatRecorded(address indexed owner, uint256 timestamp)",
  "event StateChanged(address indexed owner, uint8 indexed newState, uint256 timestamp)",
  "event KeyShareReleased(address indexed owner, address indexed nominee, string authId, uint256 timestamp)"
];

// Numeric map for Solidity enum InheritanceState { ACTIVE, PENDING_VERIFICATION, INHERITED }
export const INHERITANCE_STATES = {
  ACTIVE: 0,
  PENDING_VERIFICATION: 1,
  INHERITED: 2
};

class BlockchainService {
  constructor() {
    this.rpcUrl = process.env.RPC_URL || process.env.GANACHE_URL || "http://127.0.0.1:7545";
    this.contractAddress = process.env.CONTRACT_ADDRESS || "0x45B3F9048F9f46a72C36570FD128813442113CDd";
    this.privateKey = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.trim() : "";
    
    if (this.privateKey && !this.privateKey.startsWith("0x") && this.privateKey.length === 64) {
      this.privateKey = `0x${this.privateKey}`;
    }

    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.wallet = null;
    this.contract = null;
    this.isOnline = false;

    this.initialize();
  }

  async initialize() {
    try {
      if (this.privateKey && this.privateKey.length === 66) {
        this.wallet = new ethers.Wallet(this.privateKey, this.provider);
      } else {
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
      }

      this.contract = new ethers.Contract(
        this.contractAddress,
        DIGITAL_INHERITANCE_ABI,
        this.wallet
      );

      // Probe connection
      await this.provider.getBlockNumber();
      this.isOnline = true;
      console.log(`⛓️ [BlockchainService] Connected to Ganache at ${this.rpcUrl}`);
    } catch (err) {
      this.isOnline = false;
      console.warn(`⚠️ [BlockchainService] Ganache RPC offline (${this.rpcUrl}). Resilient mock mode active.`);
    }
  }

  /**
   * Health status of blockchain connection
   */
  async getStatus() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(this.wallet.address);

      return {
        online: true,
        rpcUrl: this.rpcUrl,
        chainId: network.chainId.toString(),
        contractAddress: this.contractAddress,
        adminWallet: this.wallet.address,
        balanceEth: ethers.formatEther(balance),
        latestBlock: blockNumber,
      };
    } catch (error) {
      return {
        online: false,
        rpcUrl: this.rpcUrl,
        contractAddress: this.contractAddress,
        adminWallet: this.wallet ? this.wallet.address : null,
        error: error.message,
        mode: "Simulated Resilient Fallback",
      };
    }
  }

  /**
   * Registers a digital inheritance plan on-chain
   */
  async createInheritancePlan(ownerAddress, nomineeAddress, verificationHash, ipfsCid) {
    console.log(`[Blockchain] Creating inheritance plan for owner: ${ownerAddress}`);
    try {
      if (!this.isOnline) await this.initialize();

      if (this.isOnline && this.contract) {
        const tx = await this.contract.createPlan(nomineeAddress, verificationHash, ipfsCid);
        const receipt = await tx.wait();
        console.log(`[Blockchain] Plan confirmed in block ${receipt.blockNumber}, txHash: ${tx.hash}`);
        return { success: true, txHash: tx.hash, blockNumber: receipt.blockNumber, simulated: false };
      }
    } catch (err) {
      console.warn(`[Blockchain] Live tx failed (${err.message}). Logging simulated record.`);
    }

    const mockHash = `0x${crypto.randomBytes(32).toString("hex")}`;
    return { success: true, txHash: mockHash, simulated: true };
  }

  /**
   * Records a proof-of-life biometric heartbeat on-chain
   */
  async recordHeartbeat(ownerAddress) {
    console.log(`[Blockchain] Recording heartbeat on-chain for: ${ownerAddress}`);
    try {
      if (!this.isOnline) await this.initialize();

      if (this.isOnline && this.contract) {
        const tx = await this.contract.recordHeartbeat();
        const receipt = await tx.wait();
        console.log(`[Blockchain] Heartbeat confirmed in block ${receipt.blockNumber}, txHash: ${tx.hash}`);
        return { success: true, txHash: tx.hash, blockNumber: receipt.blockNumber, simulated: false };
      }
    } catch (err) {
      console.warn(`[Blockchain] Heartbeat live tx error (${err.message}).`);
    }

    const mockHash = `0x${crypto.randomBytes(32).toString("hex")}`;
    return { success: true, txHash: mockHash, simulated: true };
  }

  /**
   * Transitions plan state: ACTIVE(0), PENDING_VERIFICATION(1), INHERITED(2)
   */
  async transitionState(ownerAddress, newStateName) {
    const stateCode = typeof newStateName === "number" ? newStateName : (INHERITANCE_STATES[newStateName] ?? 1);
    console.log(`[Blockchain] Transitioning state for ${ownerAddress} to ${newStateName} (${stateCode})`);

    try {
      if (!this.isOnline) await this.initialize();

      if (this.isOnline && this.contract) {
        const targetAddress = (ownerAddress && ethers.isAddress(ownerAddress)) ? ownerAddress : this.wallet.address;
        const tx = await this.contract.transitionState(targetAddress, stateCode);
        const receipt = await tx.wait();
        console.log(`[Blockchain] State change mined in block ${receipt.blockNumber}, txHash: ${tx.hash}`);
        return { success: true, txHash: tx.hash, blockNumber: receipt.blockNumber, simulated: false };
      }
    } catch (err) {
      console.warn(`[Blockchain] State transition fallback: ${err.message}`);
    }

    const mockHash = `0x${crypto.randomBytes(32).toString("hex")}`;
    return { success: true, txHash: mockHash, simulated: true };
  }

  /**
   * Releases key share on-chain and marks plan as INHERITED
   */
  async releaseKeyShare(ownerAddress, authId) {
    console.log(`[Blockchain] Releasing key share for ${ownerAddress}, Auth ID: ${authId}`);
    try {
      if (!this.isOnline) await this.initialize();

      if (this.isOnline && this.contract) {
        const targetAddress = (ownerAddress && ethers.isAddress(ownerAddress)) ? ownerAddress : this.wallet.address;
        const tx = await this.contract.releaseKeyShare(targetAddress, authId);
        const receipt = await tx.wait();
        console.log(`[Blockchain] KeyShareReleased confirmed in block ${receipt.blockNumber}, txHash: ${tx.hash}`);
        return { success: true, txHash: tx.hash, blockNumber: receipt.blockNumber, simulated: false };
      }
    } catch (err) {
      console.warn(`[Blockchain] Key share release fallback: ${err.message}`);
    }

    const mockHash = `0x${crypto.randomBytes(32).toString("hex")}`;
    return { success: true, txHash: mockHash, simulated: true };
  }
}

export const blockchainService = new BlockchainService();
export default blockchainService;
