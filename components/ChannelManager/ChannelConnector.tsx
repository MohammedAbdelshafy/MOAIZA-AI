// components/ChannelManager/ChannelConnector.tsx
// Connect new social media channel

import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  companyId: string;
  onSuccess: () => void;
}

const PLATFORMS = ['youtube', 'tiktok', 'instagram', 'facebook', 'twitter', 'linkedin'];

export default function ChannelConnector({ companyId, onSuccess }: Props) {
  const [platform, setPlatform] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/channels/connect', {
        platform,
        email,
        password,
        companyId,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect channel');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-12 text-center">
        <div className="text-green-600 text-2xl mb-2">✓</div>
        <h3 className="text-lg font-semibold text-gray-900">Channel Connected</h3>
        <p className="text-gray-600 mt-2">Your social media channel has been successfully connected</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Channel</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a platform...</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email or Username
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your-email@example.com"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Your password is encrypted and never stored in plain text
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
        >
          {loading ? 'Connecting...' : 'Connect Channel'}
        </button>
      </form>

      {/* Security Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>🔒 Security:</strong> We use browser automation with encrypted session storage. Your credentials are verified but never stored in plain text.
        </p>
      </div>
    </div>
  );
}
