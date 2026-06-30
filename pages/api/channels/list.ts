// pages/api/channels/list.ts
// Get all connected channels for a company

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ error: 'Company ID required' });
    }

    const channels = await prisma.socialChannel.findMany({
      where: { companyId: String(companyId) },
      select: {
        id: true,
        name: true,
        platform: true,
        accountEmail: true,
        displayName: true,
        profileUrl: true,
        status: true,
        isAuthenticated: true,
        lastLoginAt: true,
        lastSyncAt: true,
        canPost: true,
        canSchedule: true,
        canAnalytics: true,
      },
    });

    return res.status(200).json({
      success: true,
      channels,
      total: channels.length,
    });
  } catch (error) {
    console.error('List channels error:', error);
    return res.status(500).json({
      error: 'Failed to list channels',
      details: String(error),
    });
  }
}
