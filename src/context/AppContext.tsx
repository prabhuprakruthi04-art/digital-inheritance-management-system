import React, { createContext, useContext, useState } from 'react';
import {
  Page,
  UserRole,
  DigitalAsset,
  Nominee,
  DigitalKey,
  NotificationItem,
  UploadedDocument,
} from '../types';
import {
  initialAssets,
  initialNominees,
  initialKeys,
  initialNotifications,
  initialDocuments,
} from '../data/mockData';

interface AppContextType {
  activePage: Page;
  setActivePage: (page: Page) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  walletConnected: boolean;
  walletAddress: string;
  walletBalance: string;
  toggleWalletConnect: () => void;
  assets: DigitalAsset[];
  addAsset: (asset: Omit<DigitalAsset, 'id' | 'dateAdded'>) => void;
  deleteAsset: (id: string) => void;
  nominees: Nominee[];
  addNominee: (nominee: Omit<Nominee, 'id' | 'assignedAssetCount' | 'avatar'>) => void;
  deleteNominee: (id: string) => void;
  keys: DigitalKey[];
  addDigitalKey: (keyData: Omit<DigitalKey, 'id' | 'status' | 'lastHeartbeat'>) => void;
  pingHeartbeat: (keyId?: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  documents: UploadedDocument[];
  addDocument: (doc: Omit<UploadedDocument, 'id' | 'ipfsHash' | 'uploadDate' | 'status'>) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<Page>('landing');
  const [userRole, setUserRole] = useState<UserRole>('owner');
  const [walletConnected, setWalletConnected] = useState<boolean>(true);
  const [walletAddress] = useState<string>('0x4A18...92E3');
  const [walletBalance] = useState<string>('24.5 ETH ($82,400)');
  const [assets, setAssets] = useState<DigitalAsset[]>(initialAssets);
  const [nominees, setNominees] = useState<Nominee[]>(initialNominees);
  const [keys, setKeys] = useState<DigitalKey[]>(initialKeys);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [documents, setDocuments] = useState<UploadedDocument[]>(initialDocuments);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleWalletConnect = () => {
    if (walletConnected) {
      setWalletConnected(false);
      showToast('Wallet disconnected.');
    } else {
      setWalletConnected(true);
      showToast('Connected to MetaMask Web3 Wallet (0x4A18...92E3)');
    }
  };

  const addAsset = (newAssetData: Omit<DigitalAsset, 'id' | 'dateAdded'>) => {
    const newAsset: DigitalAsset = {
      ...newAssetData,
      id: `ast-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setAssets((prev) => [newAsset, ...prev]);
    showToast(`Digital Asset "${newAsset.name}" added successfully.`);
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    showToast('Asset removed from vault.');
  };

  const addNominee = (newNomineeData: Omit<Nominee, 'id' | 'assignedAssetCount' | 'avatar'>) => {
    const newNom: Nominee = {
      ...newNomineeData,
      id: `nom-${Date.now()}`,
      assignedAssetCount: 1,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?auto=format&fit=crop&q=80&w=200`,
    };
    setNominees((prev) => [...prev, newNom]);
    showToast(`Nominee ${newNom.name} added and allocation set.`);
  };

  const deleteNominee = (id: string) => {
    setNominees((prev) => prev.filter((n) => n.id !== id));
    showToast('Nominee removed.');
  };

  const addDigitalKey = (keyData: Omit<DigitalKey, 'id' | 'status' | 'lastHeartbeat'>) => {
    const newKey: DigitalKey = {
      ...keyData,
      id: `key-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Active - Heartbeat OK',
      lastHeartbeat: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    };
    setKeys((prev) => [newKey, ...prev]);
    showToast(`Digital Key "${newKey.keyName}" generated with Shamir secret sharing.`);
  };

  const pingHeartbeat = (keyId?: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    if (keyId) {
      setKeys((prev) =>
        prev.map((k) =>
          k.id === keyId
            ? {
                ...k,
                status: 'Active - Heartbeat OK',
                lastHeartbeat: now,
                nextHeartbeatDue: `In ${k.deadMansSwitchDays} days`,
              }
            : k
        )
      );
      showToast(`Heartbeat ping confirmed for Key #${keyId}. Dead man's switch timer reset.`);
    } else {
      setKeys((prev) =>
        prev.map((k) => ({
          ...k,
          status: 'Active - Heartbeat OK',
          lastHeartbeat: now,
          nextHeartbeatDue: `In ${k.deadMansSwitchDays} days`,
        }))
      );
      showToast('Global Dead Man\'s Switch Heartbeat recorded! All digital key countdowns reset.');
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared.');
  };

  const addDocument = (docData: Omit<UploadedDocument, 'id' | 'ipfsHash' | 'uploadDate' | 'status'>) => {
    const randomHash = 'Qm' + Array.from({ length: 44 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
    const newDoc: UploadedDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      ipfsHash: randomHash,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Encrypted & Synced',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Document "${newDoc.name}" encrypted and anchored to IPFS.`);
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        userRole,
        setUserRole,
        walletConnected,
        walletAddress,
        walletBalance,
        toggleWalletConnect,
        assets,
        addAsset,
        deleteAsset,
        nominees,
        addNominee,
        deleteNominee,
        keys,
        addDigitalKey,
        pingHeartbeat,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        documents,
        addDocument,
        toastMessage,
        showToast,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
