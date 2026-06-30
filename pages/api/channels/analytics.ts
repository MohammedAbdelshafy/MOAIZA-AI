// pages/api/channels/analytics.ts
// Get analytics for a channel

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { channelId } = req.query;

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID required' });
    }

    const publishedContent = await prisma.publishedContent.findMany({
      where: { channelId: String(channelId) },
    });

    const totalViews = publishedContent.reduce((sum, p) => sum + p.views, 0);
    const totalLikes = publishedContent.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = publishedContent.reduce((sum, p) => sum + p.comments, 0);
    const totalShares = publishedContent.reduce((sum, p) => sum + p.shares, 0);

    const analytics = {
      totalPosts: publishedContent.length,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      avgEngagement: totalViews > 0 ? ((totalLikes + totalComments + totalShares) / totalViews * 100).toFixed(2) + '%' : '0%',
      topPosts: publishedContent
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          title: p.title,
          views: p.views,
          likes: p.likes,
          comments: p.comments,
          shares: p.shares,
          publishedAt: p.publishedAt,
        })),
    };

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({
      error: 'Failed to get analytics',
      details: String(error),
    });
  }
}
