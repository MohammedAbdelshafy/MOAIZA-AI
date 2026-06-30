// pages/api/channels/connect.ts
// API endpoint to connect social media channel

import { NextApiRequest, NextApiResponse } from 'next';
import { ChannelWorkflow } from '@/lib/workflows/channel-workflow';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform, email, password, companyId } = req.body;

    if (!platform || !email || !password || !companyId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if channel already exists
    const existing = await prisma.socialChannel.findUnique({
      where: {
        companyId_platform_accountEmail: {
          companyId,
          platform: platform.toUpperCase(),
          accountEmail: email,
        },
      },
    });

    if (existing) {
      return res.status(409).json({ error: 'Channel already connected' });
    }

    // Run workflow
    const workflow = new ChannelWorkflow();
    const compiled = workflow.build();

    const result = await compiled.invoke({
      messages: [],
      action: 'connect',
      platform: platform.toLowerCase(),
      email,
      password,
      channelId: companyId,
    });

    return res.status(200).json({
      success: true,
      channel: result.result,
      message: `Successfully connected to ${platform}`,
    });
  } catch (error) {
    console.error('Channel connection error:', error);
    return res.status(500).json({
      error: 'Failed to connect channel',
      details: String(error),
    });
  }
}
