export type Page =
  | 'landing'
  | 'login'
  | 'register'
  | 'owner-dashboard'
  | 'nominee-dashboard'
  | 'admin-dashboard'
  | 'profile'
  | 'create-key'
  | 'add-nominee'
  | 'asset-list'
  | 'upload-docs'
  | 'key-status'
  | 'notifications'
  | 'settings'
  | 'about';

export type UserRole = 'owner' | 'nominee' | 'admin';

export interface DigitalAsset {
  id: string;
  name: string;
  category: 'Crypto Wallet' | 'Cloud Vault' | 'NFT Portfolio' | 'Legal Document' | 'Password Vault' | 'Intellectual Property';
  value: string;
  nomineeName: string;
  allocationPercentage: number;
  encryptionLevel: 'AES-256' | 'ZK-Encrypted' | 'Shamir Threshold';
  status: 'Active' | 'Locked' | 'Pending Release' | 'Released';
  dateAdded: string;
  keyId: string;
}

export interface Nominee {
  id: string;
  name: string;
  email: string;
  relationship: string;
  walletAddress: string;
  verificationStatus: 'Verified' | 'Pending ID' | 'Unverified';
  allocatedPercentage: number;
  assignedAssetCount: number;
  phone: string;
  avatar: string;
}

export interface DigitalKey {
  id: string;
  keyName: string;
  status: 'Active - Heartbeat OK' | 'Warning - Ping Overdue' | 'Released to Nominees' | 'Revoked';
  deadMansSwitchDays: number;
  lastHeartbeat: string;
  nextHeartbeatDue: string;
  thresholdRequired: string; // e.g. "2 of 3"
  assignedNomineesCount: number;
  secretPiecesCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'security' | 'key' | 'nominee' | 'asset' | 'system';
  read: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface UploadedDocument {
  id: string;
  name: string;
  category: string;
  fileSize: string;
  ipfsHash: string;
  uploadDate: string;
  status: 'Encrypted & Synced' | 'Encrypting' | 'Pending Storage';
  encryptionType: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  ipfsProof: string;
  status: 'Success' | 'Flagged' | 'In Progress';
}
