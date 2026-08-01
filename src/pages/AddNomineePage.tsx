import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus, Mail, Wallet, User, Phone, ArrowRight } from 'lucide-react';

export const AddNomineePage: React.FC = () => {
  const { addNominee, setActivePage, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [walletAddress, setWalletAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [allocatedPercentage, setAllocatedPercentage] = useState(25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !walletAddress) {
      showToast('Please fill in all required nominee fields.');
      return;
    }

    addNominee({
      name,
      email,
      relationship,
      walletAddress,
      phone,
      allocatedPercentage,
      verificationStatus: 'Pending ID',
    });

    setActivePage('owner-dashboard');
  };

  return (
    <div className="space-y-6 text-slate-800 pb-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Add Nominee Beneficiary</h1>
        <p className="mt-1 text-xs text-slate-500">
          Designate a trusted individual or legal executor to receive threshold key shards upon heartbeat expiry.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nominee Full Name *</label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marcus Vance"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marcus.vance@example.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
            >
              <option value="Spouse">Spouse</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Sibling">Sibling</option>
              <option value="Legal Executor">Legal Executor</option>
              <option value="Estate Trustee">Estate Trustee</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nominee Web3 Public Wallet Address *</label>
          <div className="relative">
            <Wallet className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 font-mono text-xs font-bold text-blue-600 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700">Default Asset Allocation Share</label>
            <span className="text-xs font-bold text-blue-600">{allocatedPercentage}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={allocatedPercentage}
            onChange={(e) => setAllocatedPercentage(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <button
          type="submit"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/10 hover:from-blue-700 hover:to-indigo-700 transition"
        >
          <UserPlus className="h-4 w-4" /> Save Nominee Beneficiary <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
