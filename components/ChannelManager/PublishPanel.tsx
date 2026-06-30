// components/ChannelManager/PublishPanel.tsx
// Publish or schedule content to channel

import React, { useState } from 'react';
import axios from 'axios';

interface Channel {
  id: string;
  platform: string;
  name: string;
  canPost: boolean;
  canSchedule: boolean;
}

interface Props {
  channel: Channel;
  onPublished: () => void;
}

export default function PublishPanel({ channel, onPublished }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [action, setAction] = useState<'upload' | 'schedule'>('upload');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.post('/api/channels/publish', {
        channelId: channel.id,
        action,
        content: {
          title,
          description,
          mediaUrls: [],
        },
        scheduledTime: action === 'schedule' ? scheduledTime : undefined,
      });

      setMessage(
        action === 'upload'
          ? 'Content published successfully!'
          : 'Content scheduled successfully!'
      );

      setTimeout(() => {
        setTitle('');
        setDescription('');
        onPublished();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to publish content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Publish to {channel.platform}
      </h2>
      <p className="text-gray-600 mb-6">Create and publish content directly to your channel</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Action Selection */}
        {channel.canPost && channel.canSchedule && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="upload"
                  checked={action === 'upload'}
                  onChange={(e) => setAction(e.target.value as 'upload' | 'schedule')}
                  className="mr-2"
                />
                <span className="text-gray-700">Publish Now</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="schedule"
                  checked={action === 'schedule'}
                  onChange={(e) => setAction(e.target.value as 'upload' | 'schedule')}
                  className="mr-2"
                />
                <span className="text-gray-700">Schedule</span>
              </label>
            </div>
          </div>
        )}

        {/* Title */}
        {['youtube', 'linkedin'].includes(channel.platform.toLowerCase()) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title..."
            />
          </div>
        )}

        {/* Description/Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your content here..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {description.length} characters
          </p>
        </div>

        {/* Scheduled Time */}
        {action === 'schedule' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule For
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={action === 'schedule'}
            />
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
        >
          {loading
            ? action === 'upload'
              ? 'Publishing...'
              : 'Scheduling...'
            : action === 'upload'
              ? 'Publish Now'
              : 'Schedule Post'}
        </button>
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>💡 Tip:</strong> Always review your content before publishing. Scheduled posts will be automatically published at the specified time.
      </div>
    </div>
  );
}
