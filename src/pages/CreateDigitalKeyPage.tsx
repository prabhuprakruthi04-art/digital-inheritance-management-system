import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KeyRound, ArrowRight } from 'lucide-react';

export const CreateDigitalKeyPage: React.FC = () => {
  const { nominees, addDigitalKey, setActivePage, showToast } = useApp();

  const [keyName, setKeyName] = useState('');
  const [deadMansSwitchDays, setDeadMansSwitchDays] = useState(90);
  const [selectedNominees, setSelectedNominees] = useState<string[]>(
    nominees.slice(0, 2).map((n) => n.id)
  );

  const toggleNomineeSelection = (id: string) => {
    setSelectedNominees((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      showToast('Please enter a name for the digital key.');
      return;
    }

    addDigitalKey({
      keyName,
      deadMansSwitchDays,
      nextHeartbeatDue: `In ${deadMansSwitchDays} days`,
      thresholdRequired: `${Math.min(selectedNominees.length, 2)} of ${selectedNominees.length || 1} Nominees`,
      assignedNomineesCount: selectedNominees.length,
      secretPiecesCount: selectedNominees.length,
    });

    setActivePage('key-status');
  };

  return (
    <div className="space-y-6 text-slate-800 pb-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Create Digital Inheritance Key</h1>
        <p className="mt-1 text-xs text-slate-500">
          Configure a Shamir threshold digital key bound to an automated Dead Man's Switch heartbeat timer.
        </p>
      </div>

      <form onSubmit={handleCreateKey} className="rounded-3xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
        {/* Step 1: Key Metadata */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-blue-600">
            Step 1: Key Identifier & Purpose
          </label>
          <input
            type="text"
            required
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="e.g., Master Crypto Vault Key #2026"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
          />
        </div>

        {/* Step 2: Dead Man's Switch Timer */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-blue-600">
            Step 2: Dead Man's Switch Heartbeat Interval
          </label>
          <p className="text-xs text-slate-500">
            Select how often you must send a "heartbeat ping" to keep this key locked.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[30, 60, 90, 180].map((days) => (
              <button
                type="button"
                key={days}
                onClick={() => setDeadMansSwitchDays(days)}
                className={`rounded-xl border p-3 text-center transition ${
                  deadMansSwitchDays === days
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-base font-extrabold">{days} Days</div>
                <div className="text-[10px] text-slate-500 mt-0.5">~{Math.round(days / 30)} Months</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Assign Nominees & Threshold */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-blue-600">
            Step 3: Assign Nominee Key Shards
          </label>
          <p className="text-xs text-slate-500">
            Select which nominees receive encrypted secret pieces under Shamir's scheme.
          </p>

          <div className="space-y-2">
            {nominees.map((nom) => {
              const selected = selectedNominees.includes(nom.id);
              return (
                <div
                  key={nom.id}
                  onClick={() => toggleNomineeSelection(nom.id)}
                  className={`cursor-pointer flex items-center justify-between rounded-xl border p-3 transition ${
                    selected
                      ? 'border-blue-300 bg-blue-50/70 text-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={nom.avatar}
                      alt={nom.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-100"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{nom.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {nom.relationship} • {nom.walletAddress}
                      </div>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => {}}
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-600/10 hover:from-blue-700 hover:to-indigo-700 transition"
        >
          <KeyRound className="h-4 w-4" /> Generate & Distribute Digital Key <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
