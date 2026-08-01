import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  KeyRound,
  Users,
  ArrowRight,
  Cpu,
  RefreshCw,
  FileCode,
  ShieldCheck,
  ChevronRight,
  Database,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActivePage, setUserRole } = useApp();

  return (
    <div className="space-y-16 py-4 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/40 p-8 md:p-14 shadow-xl shadow-blue-900/5">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-blue-600" /> Decentralized Non-Custodial Inheritance Vault
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 leading-tight">
            Protect & Transfer Digital Assets to Loved Ones Safely
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            A blockchain-backed digital inheritance vault powered by Smart Contracts, Shamir’s Secret
            Sharing, and Dead Man’s Switch heartbeats. Ensure seamless crypto, document, and key
            release without third-party intermediaries.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                setUserRole('owner');
                setActivePage('owner-dashboard');
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Launch Owner Vault <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActivePage('register')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              Register Account
            </button>
            <button
              onClick={() => setActivePage('about')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 underline transition"
            >
              Read Architecture & FAQ →
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-slate-200/80 pt-8 sm:grid-cols-4">
          <div>
            <div className="text-2xl font-extrabold text-slate-900">$42.8M+</div>
            <div className="text-xs font-medium text-slate-500">Total Asset TVL Protected</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-blue-600">1,840+</div>
            <div className="text-xs font-medium text-slate-500">Active Digital Keys</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">100%</div>
            <div className="text-xs font-medium text-slate-500">Non-Custodial Architecture</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600">0.0s</div>
            <div className="text-xs font-medium text-slate-500">Central Party Risk</div>
          </div>
        </div>
      </section>

      {/* Quick Dashboard Entry Persona Switcher Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Explore Interactive Dashboards</h2>
          <p className="text-xs text-slate-500">Experience the platform from three core stakeholder viewpoints</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div
            onClick={() => {
              setUserRole('owner');
              setActivePage('owner-dashboard');
            }}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 transition shadow-xs hover:shadow-md hover:border-blue-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-4 group-hover:scale-105 transition">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600">Asset Owner View</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Manage crypto wallets, passwords, legal documents, create threshold digital keys, assign nominees, and ping heartbeats.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600">
              Open Owner Dashboard <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <div
            onClick={() => {
              setUserRole('nominee');
              setActivePage('nominee-dashboard');
            }}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 transition shadow-xs hover:shadow-md hover:border-indigo-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-4 group-hover:scale-105 transition">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600">Nominee View</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Check claim verification status, submit proof documents, track unlock timelocks, and claim released inheritance assets.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
              Open Nominee Dashboard <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <div
            onClick={() => {
              setUserRole('admin');
              setActivePage('admin-dashboard');
            }}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 transition shadow-xs hover:shadow-md hover:border-emerald-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-4 group-hover:scale-105 transition">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600">Admin Auditor View</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Audit smart contract key releases, monitor platform TVL, verify identity documents, and review system execution logs.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              Open Admin Auditor <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Protocol Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900">Core Pillars of Decentralized Inheritance</h2>
          <p className="text-xs text-slate-500 mt-1">
            Engineered with zero central points of failure and cryptographic mathematical guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Dead Man’s Switch</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Set customizable heartbeat timers (30 to 365 days). If you fail to ping before expiry, automated key distribution triggers.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <KeyRound className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Shamir's Secret Sharing</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Splits master private keys into multiple encrypted shards (e.g., 2-of-3 threshold) so no single nominee can access early.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Database className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">IPFS Storage</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Encrypted estate documents are distributed across decentralized IPFS nodes with immutable hash referencing.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileCode className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Smart Contract Execution</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Timelocks and identity proofs are verified strictly on-chain by non-custodial smart contracts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
