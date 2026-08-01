import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Mail, Wallet, ArrowRight, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setActivePage, setUserRole, showToast, toggleWalletConnect, walletConnected } = useApp();
  const [loginMethod, setLoginMethod] = useState<'email' | 'wallet'>('email');
  const [email, setEmail] = useState('owner@ciphervault.eth');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole('owner');
    setActivePage('owner-dashboard');
    showToast('Successfully authenticated as Asset Owner!');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8 text-slate-800">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-blue-900/5 backdrop-blur-md">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-md shadow-blue-500/20">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Vault Sign In</h2>
          <p className="mt-1 text-xs text-slate-500">Access your digital inheritance vault & threshold keys</p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setLoginMethod('email')}
            className={`rounded-lg py-2 transition ${
              loginMethod === 'email'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email & Password
          </button>
          <button
            onClick={() => setLoginMethod('wallet')}
            className={`rounded-lg py-2 transition ${
              loginMethod === 'wallet'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Web3 Signature
          </button>
        </div>

        {loginMethod === 'email' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@ciphervault.eth"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Vault Password</label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to registered email.')}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 bg-slate-50 text-blue-600 focus:ring-blue-500"
                />
                Remember this device
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Sign In to Vault <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
              <Wallet className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <h4 className="text-sm font-bold text-slate-900">Connect Web3 Wallet to Sign</h4>
              <p className="mt-1 text-xs text-slate-600">
                Sign a cryptographic challenge message using your private key (MetaMask / WalletConnect).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!walletConnected) toggleWalletConnect();
                setUserRole('owner');
                setActivePage('owner-dashboard');
                showToast('Wallet challenge verified successfully!');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm"
            >
              <KeyRound className="h-4 w-4" /> Sign In with Wallet Signature
            </button>
          </div>
        )}

        {/* Demo Quick Jump Buttons */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="mb-2 text-center text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Instant Demo Role Login
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => {
                setUserRole('owner');
                setActivePage('owner-dashboard');
                showToast('Logged in as Asset Owner');
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition"
            >
              Owner
            </button>
            <button
              onClick={() => {
                setUserRole('nominee');
                setActivePage('nominee-dashboard');
                showToast('Logged in as Nominee');
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition"
            >
              Nominee
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                setActivePage('admin-dashboard');
                showToast('Logged in as Admin Auditor');
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Register CTA */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have a vault account?{' '}
          <button
            onClick={() => setActivePage('register')}
            className="font-bold text-blue-600 hover:underline"
          >
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};
