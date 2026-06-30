// pages/api/channels/publish.ts
// Publish or schedule content to channel

import { NextApiRequest, NextApiResponse } from 'next';
import { ChannelWorkflow } from '@/lib/workflows/channel-workflow';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { channelId, action, content, scheduledTime } = req.body;

    if (!channelId || !action || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['upload', 'schedule'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Run workflow
    const workflow = new ChannelWorkflow();
    const compiled = workflow.build();

    const result = await compiled.invoke({
      messages: [],
      action,
      channelId,
      contentData: content,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
    });

    return res.status(200).json({
      success: true,
      result: result.result,
      message: action === 'upload' ? 'Content published' : 'Content scheduled',
    });
  } catch (error) {
    console.error('Publish error:', error);
    return res.status(500).json({
      error: 'Failed to publish content',
      details: String(error),
    });
  }
}
