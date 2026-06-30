// components/ChannelManager/AnalyticsDashboard.tsx
// Display channel analytics

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Channel {
  id: string;
  platform: string;
}

interface Analytics {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgEngagement: string;
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    publishedAt: string;
  }>;
}

interface Props {
  channel: Channel;
}

export default function AnalyticsDashboard({ channel }: Props) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [channel.id]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/channels/analytics?channelId=${channel.id}`);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading analytics...</div>;
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics - {channel.platform}</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Total Posts</p>
          <p className="text-2xl font-bold text-blue-600">{analytics.totalPosts}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Views</p>
          <p className="text-2xl font-bold text-green-600">{analytics.totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
          <p className="text-sm text-gray-600">Likes</p>
          <p className="text-2xl font-bold text-pink-600">{analytics.totalLikes.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">Comments</p>
          <p className="text-2xl font-bold text-purple-600">{analytics.totalComments.toLocaleString()}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-sm text-gray-600">Engagement</p>
          <p className="text-2xl font-bold text-orange-600">{analytics.avgEngagement}</p>
        </div>
      </div>

      {/* Top Posts */}
      {analytics.topPosts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
          <div className="space-y-3">
            {analytics.topPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{post.title || 'Untitled'}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Views</p>
                    <p className="font-semibold text-gray-900">{post.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Likes</p>
                    <p className="font-semibold text-gray-900">{post.likes.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Comments</p>
                    <p className="font-semibold text-gray-900">{post.comments.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Shares</p>
                    <p className="font-semibold text-gray-900">{post.shares.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Analytics
        </button>
      </div>
    </div>
  );
}
