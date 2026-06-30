// components/ChannelManager/ChannelDashboard.tsx
// Main channel management dashboard

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChannelList from './ChannelList';
import ChannelConnector from './ChannelConnector';
import PublishPanel from './PublishPanel';
import AnalyticsDashboard from './AnalyticsDashboard';

interface Channel {
  id: string;
  name: string;
  platform: string;
  accountEmail: string;
  status: string;
  isAuthenticated: boolean;
  lastLoginAt: string;
  canPost: boolean;
  canSchedule: boolean;
  canAnalytics: boolean;
}

export default function ChannelDashboard({ companyId }: { companyId: string }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'connect' | 'publish' | 'analytics'>('list');

  useEffect(() => {
    fetchChannels();
  }, [companyId]);

  const fetchChannels = async () => {
    try {
      const response = await axios.get(`/api/channels/list?companyId=${companyId}`);
      setChannels(response.data.channels);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelConnected = () => {
    fetchChannels();
    setView('list');
  };

  const handleChannelDisconnect = async (channelId: string) => {
    if (!confirm('Are you sure you want to disconnect this channel?')) return;

    try {
      await axios.post('/api/channels/disconnect', { channelId });
      fetchChannels();
    } catch (error) {
      console.error('Failed to disconnect channel:', error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading channels...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Social Channel Manager</h1>
          <p className="text-gray-600 mt-2">Manage and publish to your social media channels</p>
        </div>

        {/* Navigation tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 font-medium ${
              view === 'list'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Connected Channels ({channels.length})
          </button>
          <button
            onClick={() => setView('connect')}
            className={`px-4 py-2 font-medium ${
              view === 'connect'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Add Channel
          </button>
          {selectedChannel && (
            <>
              <button
                onClick={() => setView('publish')}
                className={`px-4 py-2 font-medium ${
                  view === 'publish'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Publish
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`px-4 py-2 font-medium ${
                  view === 'analytics'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {view === 'list' && (
            <ChannelList
              channels={channels}
              onSelectChannel={setSelectedChannel}
              onDisconnect={handleChannelDisconnect}
              onRefresh={fetchChannels}
            />
          )}

          {view === 'connect' && (
            <ChannelConnector
              companyId={companyId}
              onSuccess={handleChannelConnected}
            />
          )}

          {view === 'publish' && selectedChannel && (
            <PublishPanel
              channel={selectedChannel}
              onPublished={fetchChannels}
            />
          )}

          {view === 'analytics' && selectedChannel && (
            <AnalyticsDashboard channel={selectedChannel} />
          )}
        </div>
      </div>
    </div>
  );
}
