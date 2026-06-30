// lib/workflows/channel-workflow.ts
// LangGraph workflow for social channel management

import { StateGraph, START, END, MessagesState } from '@langchain/langgraph';
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import { PlaywrightService, SocialPlatform } from '../services/playwright-service';
import { prisma } from '../prisma';

interface ChannelWorkflowState extends MessagesState {
  channelId?: string;
  platform?: SocialPlatform;
  action?: 'connect' | 'disconnect' | 'test' | 'upload' | 'schedule' | 'analytics';
  email?: string;
  password?: string;
  contentData?: any;
  scheduledTime?: Date;
  errorMessage?: string;
  result?: any;
  requiresApproval?: boolean;
  approved?: boolean;
}

export class ChannelWorkflow {
  private graph: StateGraph;
  private playwrightService: PlaywrightService;

  constructor() {
    this.playwrightService = new PlaywrightService();
    this.graph = new StateGraph({ channels: ['messages'] });
  }

  /**
   * Build the workflow graph
   */
  build() {
    // Workflow nodes
    this.graph.addNode('validate_input', this.validateInput.bind(this));
    this.graph.addNode('check_approval', this.checkApproval.bind(this));
    this.graph.addNode('connect_channel', this.connectChannel.bind(this));
    this.graph.addNode('test_connection', this.testConnection.bind(this));
    this.graph.addNode('upload_content', this.uploadContent.bind(this));
    this.graph.addNode('schedule_post', this.schedulePost.bind(this));
    this.graph.addNode('collect_analytics', this.collectAnalytics.bind(this));
    this.graph.addNode('disconnect_channel', this.disconnectChannel.bind(this));
    this.graph.addNode('handle_error', this.handleError.bind(this));
    this.graph.addNode('save_result', this.saveResult.bind(this));

    // Edges
    this.graph.addEdge(START, 'validate_input');
    
    // Conditional routing based on action
    this.graph.addConditionalEdges(
      'validate_input',
      this.routeByAction.bind(this),
      {
        connect: 'check_approval',
        disconnect: 'check_approval',
        test: 'test_connection',
        upload: 'check_approval',
        schedule: 'check_approval',
        analytics: 'collect_analytics',
        error: 'handle_error',
      }
    );

    // Approval check
    this.graph.addConditionalEdges(
      'check_approval',
      this.requiresUserApproval.bind(this),
      {
        approved: 'execute_action',
        pending: 'handle_error',
      }
    );

    // Route to appropriate action
    this.graph.addConditionalEdges(
      'execute_action',
      this.routeAction.bind(this),
      {
        connect: 'connect_channel',
        disconnect: 'disconnect_channel',
        upload: 'upload_content',
        schedule: 'schedule_post',
      }
    );

    // End paths
    this.graph.addEdge('connect_channel', 'save_result');
    this.graph.addEdge('disconnect_channel', 'save_result');
    this.graph.addEdge('upload_content', 'save_result');
    this.graph.addEdge('schedule_post', 'save_result');
    this.graph.addEdge('collect_analytics', 'save_result');
    this.graph.addEdge('test_connection', 'save_result');
    this.graph.addEdge('handle_error', 'save_result');
    this.graph.addEdge('save_result', END);

    return this.graph.compile();
  }

  /**
   * Validate input data
   */
  private async validateInput(state: ChannelWorkflowState) {
    try {
      const { action, platform, email, channelId } = state;

      if (!action || !['connect', 'disconnect', 'test', 'upload', 'schedule', 'analytics'].includes(action)) {
        throw new Error('Invalid action');
      }

      if (action !== 'analytics' && (!platform || !email)) {
        throw new Error('Platform and email required');
      }

      return {
        messages: [
          ...state.messages,
          new AIMessage({
            content: `Validation passed. Action: ${action}, Platform: ${platform}`,
          }),
        ],
      };
    } catch (error) {
      return {
        messages: [
          ...state.messages,
          new AIMessage({ content: `Validation failed: ${error}` }),
        ],
        errorMessage: String(error),
      };
    }
  }

  /**
   * Route workflow by action type
   */
  private routeByAction(state: ChannelWorkflowState): string {
    if (state.errorMessage) return 'error';
    return state.action || 'error';
  }

  /**
   * Check if action requires user approval
   */
  private requiresUserApproval(state: ChannelWorkflowState): string {
    const requiresApproval = ['connect', 'disconnect', 'upload', 'schedule'].includes(state.action!);
    
    // In real implementation, this would check with user/admin
    state.requiresApproval = requiresApproval;
    state.approved = true; // Auto-approve for now

    return state.approved ? 'approved' : 'pending';
  }

  /**
   * Route to appropriate action
   */
  private routeAction(state: ChannelWorkflowState): string {
    return state.action || 'error';
  }

  /**
   * Connect to social channel
   */
  private async connectChannel(state: ChannelWorkflowState) {
    try {
      const { platform, email, password } = state;

      await this.playwrightService.initializeBrowser(true);

      let sessionData;
      switch (platform) {
        case 'youtube':
          sessionData = await this.playwrightService.loginYouTube(email!, password!);
          break;
        case 'tiktok':
          sessionData = await this.playwrightService.loginTikTok(email!, password!);
          break;
        case 'instagram':
          sessionData = await this.playwrightService.loginInstagram(email!, password!);
          break;
        case 'twitter':
          sessionData = await this.playwrightService.loginTwitter(email!, password!);
          break;
        case 'linkedin':
          sessionData = await this.playwrightService.loginLinkedIn(email!, password!);
          break;
        case 'facebook':
          sessionData = await this.playwrightService.loginFacebook(email!, password!);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      const encrypted = this.playwrightService.encryptSession(sessionData);

      // Save to database
      const channel = await prisma.socialChannel.create({
        data: {
          name: `${platform} - ${email}`,
          platform: platform!.toUpperCase() as any,
          accountEmail: email!,
          sessionData: JSON.stringify(encrypted),
          isAuthenticated: true,
          status: 'AUTHENTICATED',
          companyId: state.channelId || 'default', // Should get from auth context
          canPost: true,
          canSchedule: true,
          canAnalytics: true,
        },
      });

      return {
        messages: [
          ...state.messages,
          new AIMessage({
            content: `Successfully connected to ${platform}`,
          }),
        ],
        result: channel,
      };
    } catch (error) {
      return {
        messages: [
          ...state.messages,
          new AIMessage({ content: `Connection failed: ${error}` }),
        ],
        errorMessage: String(error),
      };
    }
  }

  /**
   * Test channel connection
   */
  private async testConnection(state: ChannelWorkflowState) {
    try {
      const { channelId } = state;

      const channel = await prisma.socialChannel.findUnique({
        where: { id: channelId! },
      });

      if (!channel) {
        throw new Error('Channel not found');
      }

      const isValid = channel.isAuthenticated && channel.sessionExpiry! > new Date();

      return {
        messages: [
          ...state.messages,
          new AIMessage({
            content: isValid ? 'Channel connection is valid' : 'Channel connection is invalid or expired',
          }),
        ],
        result: { valid: isValid },
      };
    } catch (error) {
      return {
        messages: [
          ...state.messages,
          new AIMessage({ content: `Test failed: ${error}` }),
        ],
        errorMessage: String(error),
      };
    }
  }

  /**
   * Upload content to channel
   */
  private async uploadContent(state: ChannelWorkflowState) {
    try {
      const { channelId, contentData } = state;

      const channel = await prisma.socialChannel.findUnique({
        where: { id: channelId! },
      });

      if (!channel || !channel.canPost) {
        throw new Error('Channel does not have post permissions');
      }

      await this.playwrightService.initializeBrowser(true);

      const result = await this.playwrightService.uploadContent(
        channel.platform.toLowerCase() as SocialPlatform,
        contentData
      );

      // Save published content
      await prisma.publishedContent.create({
        data: {
          channelId: channel.id,
          platformPostId: result.platformPostId,
          content: contentData.description,
          mediaUrls: contentData.mediaUrls,
          publishedUrl: result.url,
          publishedAt: new Date(),
        },
      });

      return {
        messages: [
          ...state.messages,
          new AIMessage({
            content: `Content uploaded successfully to ${channel.platform}`,
          }),
        ],
        result,
      };
    } catch (error) {
      return {
        messages: [
          ...state.messages,
          new AIMessage({ content: `Upload failed: ${error}` }),
        ],
        errorMessage: String(error),
      };
    }
  }

  /**
   * Schedule post for later
   */
  private async schedulePost(state: ChannelWorkflowState) {
    try {
      const { channelId, contentData, scheduledTime } = state;

      const channel = await prisma.socialChannel.findUnique({
        where: { id: channelId! },
      });

      if (!channel || !channel.canSchedule) {
        throw new Error('Channel does not have scheduling permissions');
      }

      const scheduled = await prisma.scheduledPost.create({
        data: {
          channelId: channel.id,
          title: contentData.title,
          content: contentData.description,
          mediaUrls: contentData.mediaUrls,
          scheduledFor: scheduledTime || new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'SCHEDULED',
          hashtags: contentData.hashtags,
        },
      });

      return {
        messages: [
          ...state.messages,
          new AIMessage({
            content: `Post scheduled for ${scheduled.scheduledFor}`,
          }),
        ],
        result: scheduled,
      };
    } catch (error) {
      return {
        messages: [
          ...state.messages,
          new AIMessage({ content: `Scheduling failed: ${error}` }),
        ],
        errorMessage: String(error),
      };
    }
  }

  /**
   * Collect analytics for channel
   */
  private async collectAnalytics(state: ChannelWorkflowState) {
    try {
      const { channelId } = state;

      const publishedContent = await prisma.publishedContent.findMany({
        where: { channelId: channelId! },
      });

      const totalViews = publishedContent.reduce((sum, p) => sum + p.views, 0);
      const totalLikes = publishedContent.reduce((sum, p) => sum + p.likes, 0);
      const totalComments = publishedContent.reduce((sum, p) => sum + p.comments, 0);

      const analytics = {
        totalPosts: publishedContent.length,
        totalViews,
        totalLikes,
        totalComments,
        avgEngagement: totalComments > 0 ? (totalViews + totalLikes) / totalComments : 0,
      };

      return {
        messages: [
          ...state.messages,
          new AIMessage({
            content: `Analytics collected: ${JSON.stringify(analytics)}`,
          }),
        ],
        result: analytics,
      };
    } catch (error) {
      return {
        messages: [
          ...state.messages,
          new AIMessage({ content: `Analytics collection failed: ${error}` }),
        ],
        errorMessage: String(error),
      };
    }
  }

  /**
   * Disconnect from channel
   */
  private async disconnectChannel(state: ChannelWorkflowState) {
    try {
      const { channelId } = state;

      const channel = await prisma.socialChannel.findUnique({
        where: { id: channelId! },
      });

      if (!channel) {
        throw new Error('Channel not found');
      }

      await this.playwrightService.initializeBrowser(true);
      await this.playwrightService.disconnectChannel(
        channel.platform.toLowerCase() as SocialPlatform
      );

      // Update channel status
      await prisma.socialChannel.update({
        where: { id: channelId! },
        data: {
          isAuthenticated: false,
          status: 'DISCONNECTED',
          sessionData: null,
        },
      });

      return {
        messages: [
          ...state.messages,
          new AIMessage({
            content: `Disconnected from ${channel.platform}`,
          }),
        ],
        result: { disconnected: true },
      };
    } catch (error) {
      return {
        messages: [
          ...state.messages,
          new AIMessage({ content: `Disconnection failed: ${error}` }),
        ],
        errorMessage: String(error),
      };
    }
  }

  /**
   * Handle errors
   */
  private async handleError(state: ChannelWorkflowState) {
    return {
      messages: [
        ...state.messages,
        new AIMessage({
          content: `Workflow error: ${state.errorMessage}`,
        }),
      ],
      errorMessage: state.errorMessage,
    };
  }

  /**
   * Save workflow result
   */
  private async saveResult(state: ChannelWorkflowState) {
    if (state.channelId) {
      await prisma.automationRun.create({
        data: {
          channelId: state.channelId,
          workflowType: state.action!.toUpperCase() as any,
          status: state.errorMessage ? 'FAILED' : 'COMPLETED',
          inputData: JSON.stringify({
            platform: state.platform,
            email: state.email,
            contentData: state.contentData,
          }),
          outputData: JSON.stringify(state.result),
          errorMessage: state.errorMessage,
          completedAt: new Date(),
        },
      });
    }

    await this.playwrightService.closeBrowser();

    return state;
  }
}
