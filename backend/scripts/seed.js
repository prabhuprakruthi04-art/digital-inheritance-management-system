import NomineeRecord from "../models/NomineeRecord.js";
import DigitalKeyRecord from "../models/DigitalKeyRecord.js";
import DocumentMetadata from "../models/DocumentMetadata.js";
import InheritanceRecord from "../models/InheritanceRecord.js";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const DEMO_OWNER_ID = "demo-owner-vance";

const nominees = [
  {
    ownerId: DEMO_OWNER_ID,
    name: "Eleanor Vance",
    email: "eleanor.vance@example.com",
    relationship: "Spouse",
    walletAddress: "0x71C...39A1",
    verificationStatus: "verified",
    allocatedPercentage: 50,
    assignedAssetCount: 3,
    phone: "+1 (555) 234-5678",
  },
  {
    ownerId: DEMO_OWNER_ID,
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    relationship: "Son",
    walletAddress: "0x92F...81B4",
    verificationStatus: "verified",
    allocatedPercentage: 30,
    assignedAssetCount: 2,
    phone: "+1 (555) 345-6789",
  },
  {
    ownerId: DEMO_OWNER_ID,
    name: "Sophia Vance",
    email: "sophia.vance@example.com",
    relationship: "Daughter",
    walletAddress: "0x3E1...99C2",
    verificationStatus: "verified",
    allocatedPercentage: 20,
    assignedAssetCount: 2,
    phone: "+1 (555) 456-7890",
  },
];

async function seed() {
  await connectDB();

  await Promise.all([
    NomineeRecord.deleteMany({ ownerId: DEMO_OWNER_ID }),
    DigitalKeyRecord.deleteMany({ ownerId: DEMO_OWNER_ID }),
    DocumentMetadata.deleteMany({ ownerId: DEMO_OWNER_ID }),
    InheritanceRecord.deleteMany({ ownerId: DEMO_OWNER_ID }),
  ]);

  const createdNominees = await NomineeRecord.insertMany(nominees);

  const now = new Date();
  const nextDue = new Date(now);
  nextDue.setDate(nextDue.getDate() + 90);

  const key = await DigitalKeyRecord.create({
    ownerId: DEMO_OWNER_ID,
    keyName: "Main Wealth & Crypto Vault Key",
    deadMansSwitchDays: 90,
    lastHeartbeatAt: now,
    nextHeartbeatDue: nextDue,
    thresholdRequired: "2 of 3 Nominees",
    thresholdNumerator: 2,
    thresholdDenominator: 3,
    assignedNomineeIds: createdNominees.map((n) => n._id),
    secretPiecesCount: 3,
    shamirConfig: { totalShares: 3, threshold: 2 },
  });

  const inheritance = await InheritanceRecord.create({
    ownerId: DEMO_OWNER_ID,
    ownerEmail: "owner@ciphervault.eth",
    ownerWalletAddress: "0x4A18...92E3",
    title: "Vance Family Digital Estate",
    description: "Cloud-Based Digital Inheritance with blockchain integrity verification",
    status: "active",
    totalAssetValue: "$2,485,900",
    nomineeIds: createdNominees.map((n) => n._id),
    keyIds: [key._id],
    lastHeartbeatAt: now,
    heartbeatIntervalDays: 90,
    nextHeartbeatDue: nextDue,
  });

  await DocumentMetadata.create({
    ownerId: DEMO_OWNER_ID,
    ownerEmail: "owner@ciphervault.eth",
    name: "Last Will & Testament 2026.pdf",
    category: "Legal Estate",
    fileSize: 4404019,
    ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    status: "synced",
    integrityHash: "sha256:demo-will-hash",
  });

  console.log("Seed complete:", {
    inheritanceId: inheritance._id.toString(),
    nominees: createdNominees.length,
    keyId: key._id.toString(),
  });

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
