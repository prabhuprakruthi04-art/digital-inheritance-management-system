import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import API from '../services/api';

export default function Claims() {
  const [step, setStep] = useState(1);
  const [assetId, setAssetId] = useState('');
  const [otp, setOtp] = useState('');
  const [identityId, setIdentityId] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/api/claims/request-otp', { assetId });
      alert('OTP sent! Check your registered email or backend console.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/api/claims/verify-otp', { assetId, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Identity Verification & Smart Contract Unlock
  const handleVerifyIdentity = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/api/claims/verify-identity', { assetId, identityId });
      const hash = res.data?.ipfsHash || res.data?.cid;
      const url = res.data?.ipfsUrl || (hash ? `https://gateway.pinata.cloud/ipfs/${hash}` : '#');
      
      setIpfsUrl(url);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Identity verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto my-8 bg-white p-8 rounded-xl shadow border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Inheritance Claim Verification</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Step 1: Enter Asset ID</h2>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Asset ID</label>
              <input
                type="text"
                required
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter Asset ID"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition disabled:bg-indigo-400"
            >
              {loading ? 'Sending OTP...' : 'Request Claim OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Step 2: Enter OTP</h2>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">6-Digit OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter OTP"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition disabled:bg-indigo-400"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleVerifyIdentity} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Step 3: Identity Verification</h2>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Government ID Number</label>
              <input
                type="text"
                required
                value={identityId}
                onChange={(e) => setIdentityId(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter ID number"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-medium transition disabled:bg-green-400"
            >
              {loading ? 'Verifying Smart Contract...' : 'Submit Identity & Unlock Asset'}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg text-green-800 border border-green-200">
              <h3 className="text-lg font-bold mb-2">Verification Successful!</h3>
              <p className="text-sm">Your identity has been verified by the smart contract. Access your inherited asset below:</p>
            </div>
            <a
              href={ipfsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              View Document on IPFS
            </a>
          </div>
        )}
      </div>
    </AppLayout>
  );
}