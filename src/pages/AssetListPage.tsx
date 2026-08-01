import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Lock,
  Trash2,
} from 'lucide-react';

export const AssetListPage: React.FC = () => {
  const { assets, addAsset, deleteAsset, searchQuery, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Asset Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<any>('Crypto Wallet');
  const [value, setValue] = useState('');
  const [nomineeName, setNomineeName] = useState('Eleanor Vance');
  const [allocationPercentage, setAllocationPercentage] = useState(50);
  const [encryptionLevel, setEncryptionLevel] = useState<any>('Shamir Threshold');

  const categories = [
    'All',
    'Crypto Wallet',
    'Cloud Vault',
    'NFT Portfolio',
    'Legal Document',
    'Password Vault',
    'Intellectual Property',
  ];

  const filteredAssets = assets.filter((ast) => {
    const matchesCat = selectedCategory === 'All' || ast.category === selectedCategory;
    const matchesSearch =
      ast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.nomineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) {
      showToast('Please enter asset name and value.');
      return;
    }

    addAsset({
      name,
      category,
      value,
      nomineeName,
      allocationPercentage,
      encryptionLevel,
      status: 'Active',
      keyId: 'key-101',
    });

    setShowAddModal(false);
    setName('');
    setValue('');
  };

  return (
    <div className="space-y-6 text-slate-800 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Digital Assets Inventory</h1>
          <p className="mt-1 text-xs text-slate-500">
            Encrypted non-custodial digital vault records, wallet reserves, and estate documents.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/10 hover:from-blue-700 hover:to-indigo-700 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Enroll New Digital Asset
        </button>
      </div>

      {/* Filter Categories Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map((ast) => (
          <div
            key={ast.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                  {ast.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Lock className="h-3 w-3" /> {ast.encryptionLevel}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{ast.name}</h3>
                <div className="text-base font-extrabold text-blue-600 mt-1">{ast.value}</div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Assigned Nominee:</span>
                  <span className="font-bold text-slate-900">{ast.nomineeName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Allocation Percentage:</span>
                  <span className="font-bold text-blue-600">{ast.allocationPercentage}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-[10px] text-slate-400 font-medium">Added {ast.dateAdded}</span>
              <button
                onClick={() => deleteAsset(ast.id)}
                className="flex items-center gap-1 text-rose-600 hover:underline text-[11px] font-bold"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Enroll New Digital Asset</h3>

            <form onSubmit={handleAddAsset} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ethereum Staking Reserve"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
                >
                  <option value="Crypto Wallet">Crypto Wallet</option>
                  <option value="Cloud Vault">Cloud Vault</option>
                  <option value="NFT Portfolio">NFT Portfolio</option>
                  <option value="Legal Document">Legal Document</option>
                  <option value="Password Vault">Password Vault</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Value / Description</label>
                <input
                  type="text"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. $450,000 (120 ETH)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
