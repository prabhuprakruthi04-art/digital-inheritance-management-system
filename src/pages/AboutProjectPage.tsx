import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';

export const AboutProjectPage: React.FC = () => {
  const { setActivePage, setUserRole } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Dead Man’s Switch heartbeat work?',
      a: 'The Asset Owner configures a heartbeat interval (e.g., 90 days). As long as the owner logs in or clicks "Send Heartbeat Ping", the smart contract timer resets. If no heartbeat is received before timer expiration, the smart contract transitions into the Key Release phase.',
    },
    {
      q: 'What is Shamir’s Secret Sharing threshold scheme?',
      a: 'Shamir’s Secret Sharing mathematically splits a master decryption key into multiple encrypted shards (e.g. 3 pieces). A pre-configured quorum threshold (e.g., 2 of 3) must combine their shards to reconstruct the original key. No single nominee can access assets prematurely.',
    },
    {
      q: 'Are my private keys or documents stored on a central server?',
      a: 'No. CipherInherit is 100% non-custodial. All files are encrypted client-side with AES-256 before being anchored to IPFS (InterPlanetary File System). Smart contracts only store state proofs, cryptographic hashes, and timelocks.',
    },
    {
      q: 'Can a nominee claim inheritance assets while the owner is alive?',
      a: 'No. As long as the owner continues to ping their heartbeat, the smart contract blocks key reconstruction requests. Nominee claims are strictly locked until the heartbeat countdown expires.',
    },
  ];

  return (
    <div className="space-y-12 text-slate-800 pb-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700">
          <Shield className="h-4 w-4 text-blue-600" /> Decentralized Protocol Architecture
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Blockchain Digital Inheritance System
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
          A non-custodial, trustless digital estate management protocol combining Smart Contracts, Shamir Secret Sharing, and Zero-Knowledge Proofs.
        </p>
      </div>

      {/* Protocol Workflow Diagram Steps */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 text-center">4-Step Inheritance Lifecycle</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-xs">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-900">Vault Asset Enrolment</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
              Owner client-side encrypts crypto wallets, cloud passwords, and legal estate deeds, uploading encrypted blobs to IPFS.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white text-xs">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900">Key Shard Distribution</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
              Master keys are split into Shamir secret shards and bound to nominated beneficiary Web3 wallet public addresses.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 font-bold text-white text-xs">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-900">Dead Man's Switch Heartbeat</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
              Owner sends periodic "heartbeat pings" to on-chain smart contract state to confirm vitality and reset countdown timers.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white text-xs">
                4
              </span>
              <h3 className="text-sm font-bold text-slate-900">Quorum Key Reconstruction</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
              Upon heartbeat expiry, nominees combine required threshold shards to decrypt assets with zero intermediary required.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 text-center">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between p-4 text-left text-xs font-bold text-slate-900 hover:bg-slate-50 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="h-4 w-4 text-blue-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {openFaq === idx && (
                <div className="border-t border-slate-100 p-4 text-xs text-slate-600 leading-relaxed bg-slate-50/70 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 text-center space-y-4 text-white shadow-md shadow-blue-600/10">
        <h3 className="text-xl font-extrabold text-white">Ready to secure your digital legacy?</h3>
        <p className="text-xs text-blue-100 max-w-md mx-auto font-medium">
          Start building your threshold keys and designated nominee vaults in under 2 minutes.
        </p>
        <button
          onClick={() => {
            setUserRole('owner');
            setActivePage('owner-dashboard');
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-blue-700 hover:bg-blue-50 transition shadow-xs"
        >
          Open Owner Dashboard <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
