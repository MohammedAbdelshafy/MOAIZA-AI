// components/ChannelManager/ChannelList.tsx
// Display connected channels

import React from 'react';
import { CheckCircle, AlertCircle, Trash2, RefreshCw } from 'react-icons/fa';

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

interface Props {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onDisconnect: (channelId: string) => void;
  onRefresh: () => void;
}

const platformColors: Record<string, string> = {
  YOUTUBE: 'bg-red-100 text-red-800',
  TIKTOK: 'bg-gray-100 text-gray-800',
  INSTAGRAM: 'bg-pink-100 text-pink-800',
  FACEBOOK: 'bg-blue-100 text-blue-800',
  TWITTER: 'bg-sky-100 text-sky-800',
  LINKEDIN: 'bg-cyan-100 text-cyan-800',
  THREADS: 'bg-purple-100 text-purple-800',
};

export default function ChannelList({
  channels,
  onSelectChannel,
  onDisconnect,
  onRefresh,
}: Props) {
  if (channels.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 mb-4">No channels connected yet</p>
        <p className="text-sm text-gray-400">Connect your first social media channel to get started</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Connected Channels</h2>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            onClick={() => onSelectChannel(channel)}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 flex-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${platformColors[channel.platform] || 'bg-gray-100'}`}>
                  {channel.platform}
                </span>
                {channel.isAuthenticated ? (
                  <CheckCircle className="text-green-500" size={16} />
                ) : (
                  <AlertCircle className="text-red-500" size={16} />
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDisconnect(channel.id);
                }}
                className="p-2 hover:bg-red-50 text-red-600 rounded transition"
                title="Disconnect"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Channel Info */}
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Account</p>
                <p className="font-medium text-gray-900">{channel.accountEmail}</p>
              </div>

              {channel.name && (
                <div>
                  <p className="text-gray-600">Display Name</p>
                  <p className="font-medium text-gray-900">{channel.name}</p>
                </div>
              )}

              {channel.lastLoginAt && (
                <div>
                  <p className="text-gray-600">Last Login</p>
                  <p className="text-gray-700">{new Date(channel.lastLoginAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Permissions</p>
              <div className="flex gap-2">
                {channel.canPost && (
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Post</span>
                )}
                {channel.canSchedule && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Schedule</span>
                )}
                {channel.canAnalytics && (
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Analytics</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
