import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  FileText,
  CheckCircle2,
  Database,
} from 'lucide-react';

export const UploadDocumentsPage: React.FC = () => {
  const { documents, addDocument, showToast } = useApp();

  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState('Legal Estate');
  const [encryptionType, setEncryptionType] = useState('Shamir Split + ZK Proof');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      showToast('Please enter document title.');
      return;
    }

    setUploading(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          addDocument({
            name: docName,
            category,
            fileSize: `${(Math.random() * 10 + 1).toFixed(1)} MB`,
            encryptionType,
          });
          setDocName('');
          return 0;
        }
        return prev + 30;
      });
    }, 300);
  };

  return (
    <div className="space-y-6 text-slate-800 pb-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Upload Encrypted Estate Documents</h1>
        <p className="mt-1 text-xs text-slate-500">
          Store legal wills, real estate deeds, and corporate trust agreements with AES-256 client-side encryption on IPFS.
        </p>
      </div>

      {/* Upload Dropzone Form */}
      <form onSubmit={handleSimulatedUpload} className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Upload className="h-4 w-4 text-blue-600" /> Client-Side Encryption & IPFS Anchoring Form
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Family Trust Agreement 2026.pdf"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
            >
              <option value="Legal Estate">Legal Estate</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Corporate Holding">Corporate Holding</option>
              <option value="Intellectual Property">Intellectual Property</option>
              <option value="Personal Identity">Personal Identity</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Encryption Mode</label>
          <select
            value={encryptionType}
            onChange={(e) => setEncryptionType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition font-medium"
          >
            <option value="Shamir Split + ZK Proof">Shamir Split + Zero-Knowledge Proof</option>
            <option value="AES-256-GCM">AES-256-GCM Direct Encryption</option>
            <option value="Multi-Sig Threshold">Multi-Sig Nominee Quorum Lock</option>
          </select>
        </div>

        {/* Drag and Drop Area */}
        <div
          onClick={() => {
            if (!docName) setDocName('Encrypted_Estate_Record.pdf');
          }}
          className="cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-8 hover:border-blue-400 hover:bg-blue-50/40 transition text-center"
        >
          <Upload className="h-8 w-8 text-blue-600 mb-2" />
          <div className="text-xs font-bold text-slate-900">
            Drag & Drop Files or Click to Select
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Files are automatically chunked & encrypted locally prior to network transit
          </p>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-blue-600 font-bold">
              <span>Encrypting & Publishing to IPFS...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
        >
          {uploading ? 'Processing File...' : 'Encrypt & Upload Document'}
        </button>
      </form>

      {/* Uploaded Documents List */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-600" /> Anchored IPFS Document Vault ({documents.length})
        </h3>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{doc.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    IPFS CID: <span className="text-blue-600 font-bold">{doc.ipfsHash.substring(0, 20)}...</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end text-[11px]">
                <span className="rounded-lg bg-white border border-slate-200 px-2 py-0.5 text-slate-700 font-semibold">
                  {doc.fileSize}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" /> {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
