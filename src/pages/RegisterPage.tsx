import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, Mail, Lock, Wallet, ArrowRight, ShieldAlert } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { setActivePage, setUserRole, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [walletAddr, setWalletAddr] = useState('0x4A18...92E3');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return { label: 'None', score: 0, color: 'bg-slate-200' };
    if (password.length < 6) return { label: 'Weak', score: 25, color: 'bg-rose-500' };
    if (password.length < 10) return { label: 'Fair', score: 50, color: 'bg-amber-500' };
    if (password.length < 14) return { label: 'Good', score: 75, color: 'bg-blue-500' };
    return { label: 'Strong (AES-256 Safe)', score: 100, color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      showToast('Please accept terms & non-custodial disclaimer.');
      return;
    }
    setUserRole('owner');
    setActivePage('owner-dashboard');
    showToast('Vault created! Initializing Shamir seed key backup.');
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-8 text-slate-800">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-blue-900/5 backdrop-blur-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-md shadow-blue-500/20">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Inheritance Vault</h2>
          <p className="mt-1 text-xs text-slate-500">Non-custodial digital asset estate protection</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alexander Vance"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alexander@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Wallet Address (Owner Public Key)
            </label>
            <div className="relative">
              <Wallet className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={walletAddr}
                onChange={(e) => setWalletAddr(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 font-mono text-xs text-blue-700 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Master Vault Encryption Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 12 characters recommended"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Strength:</span>
                  <span className="font-bold text-slate-700">{strength.label}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Seed Phrase Warning Banner */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Non-Custodial Notice:</span> Your vault key is generated locally on client side. Neither CipherInherit nor smart contract validators can recover a lost master password.
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 bg-slate-50 text-blue-600 focus:ring-blue-500"
              />
              <span>
                I agree to the Smart Contract Terms of Service and acknowledge my responsibility in maintaining my Dead Man's Switch heartbeat interval.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition"
          >
            Generate Vault & Continue <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an inheritance vault?{' '}
          <button
            onClick={() => setActivePage('login')}
            className="font-bold text-blue-600 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
