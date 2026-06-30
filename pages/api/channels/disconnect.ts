// pages/api/channels/disconnect.ts
// Disconnect a social media channel

import { NextApiRequest, NextApiResponse } from 'next';
import { ChannelWorkflow } from '@/lib/workflows/channel-workflow';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { channelId } = req.body;

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID required' });
    }

    const channel = await prisma.socialChannel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Run disconnect workflow
    const workflow = new ChannelWorkflow();
    const compiled = workflow.build();

    const result = await compiled.invoke({
      messages: [],
      action: 'disconnect',
      channelId,
    });

    return res.status(200).json({
      success: true,
      message: `Disconnected from ${channel.platform}`,
    });
  } catch (error) {
    console.error('Disconnect error:', error);
    return res.status(500).json({
      error: 'Failed to disconnect channel',
      details: String(error),
    });
  }
}
