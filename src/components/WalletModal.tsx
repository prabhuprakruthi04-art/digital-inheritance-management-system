import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Wallet, ShieldCheck, ExternalLink, Copy, Check } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { walletConnected, walletAddress, walletBalance, toggleWalletConnect, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const wallets = [
    { name: 'MetaMask', icon: '🦊', desc: 'Popular Ethereum browser extension' },
    { name: 'Coinbase Wallet', icon: '🔵', desc: 'Self-custody Web3 mobile & extension' },
    { name: 'WalletConnect', icon: '🌐', desc: 'Connect via QR code or mobile app' },
    { name: 'Ledger Hardware', icon: '🔒', desc: 'Hardware wallet cold storage key' },
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText('0x4A1829B72c6F304128919A42b109e23E901292E3');
    setCopied(true);
    showToast('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Web3 Wallet Connection</h3>
            <p className="text-xs text-slate-500">Decentralized key signing & smart contract access</p>
          </div>
        </div>

        {walletConnected ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Connected Address</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Sepolia Testnet
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-sm font-bold text-blue-700">
                <span>{walletAddress}</span>
                <button
                  onClick={copyAddress}
                  className="rounded-lg p-1 text-slate-400 hover:bg-blue-100 hover:text-slate-700 transition"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-100 flex justify-between text-xs text-slate-600">
                <span>Vault Balance:</span>
                <span className="font-bold text-slate-900">{walletBalance}</span>
              </div>
            </div>

            <button
              onClick={() => {
                toggleWalletConnect();
                onClose();
              }}
              className="w-full rounded-xl border border-rose-200 bg-rose-50 py-3 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.map((w) => (
              <button
                key={w.name}
                onClick={() => {
                  toggleWalletConnect();
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-left transition hover:border-blue-400 hover:bg-blue-50/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{w.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{w.name}</div>
                    <div className="text-xs text-slate-500">{w.desc}</div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
        )}

        <p className="mt-5 text-center text-xs text-slate-400">
          UI Demonstration • No real crypto signatures required
        </p>
      </div>
    </div>
  );
};
