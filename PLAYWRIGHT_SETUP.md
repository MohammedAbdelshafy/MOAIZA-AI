// PLAYWRIGHT_SETUP.md
# Playwright Social Channel Manager - Setup Guide

## Overview
This is a complete Playwright-based social media channel automation system integrated into Jarvis MBM.

## Architecture Components

### 1. Database Schema
- **SocialChannel**: Stores channel credentials and metadata
- **ScheduledPost**: Tracks scheduled posts
- **PublishedContent**: Tracks published posts and analytics
- **AutomationRun**: Audit log for all automation executions

### 2. Services
- **PlaywrightService** (`lib/services/playwright-service.ts`): Core browser automation
  - Multi-platform login workflows (YouTube, TikTok, Instagram, Twitter, LinkedIn, Facebook)
  - Session encryption/decryption
  - Cookie and localStorage management

### 3. Orchestration
- **ChannelWorkflow** (`lib/workflows/channel-workflow.ts`): LangGraph state machine
  - Actions: connect, disconnect, test, upload, schedule, analytics
  - Approval gates for sensitive operations
  - Audit logging and error handling

### 4. API Routes
- `POST /api/channels/connect` - Connect a new channel
- `GET /api/channels/list` - List connected channels
- `POST /api/channels/disconnect` - Disconnect a channel
- `POST /api/channels/publish` - Publish or schedule content
- `GET /api/channels/analytics` - Get channel analytics

### 5. UI Components
- **ChannelDashboard**: Main management interface
- **ChannelList**: Display connected channels
- **ChannelConnector**: Connect new channels
- **PublishPanel**: Create and schedule posts
- **AnalyticsDashboard**: View channel analytics

## Setup Instructions

### 1. Install Dependencies
```bash
cd MOAIZA-AI
npm install playwright @langchain/langgraph @langchain/core crypto
npm install --save-dev @types/crypto
```

### 2. Environment Configuration
```bash
# Copy .env.example.playwright to .env
cp .env.example.playwright .env

# Generate SESSION_ENCRYPTION_KEY (32-byte hex)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Add to .env
SESSION_ENCRYPTION_KEY=<generated-key>
PLAYWRIGHT_HEADLESS=false  # Set to true for production
```

### 3. Database Setup
```bash
# Update schema.prisma to include social-channels.schema.prisma content
# (See prisma/social-channels.schema.prisma)

# Push schema to database
npm run db:push

# Optional: Generate Prisma client
npm run db:generate
```

### 4. Usage in Application

#### Connect a Channel
```typescript
import { ChannelWorkflow } from '@/lib/workflows/channel-workflow';

const workflow = new ChannelWorkflow();
const compiled = workflow.build();

const result = await compiled.invoke({
  messages: [],
  action: 'connect',
  platform: 'youtube',
  email: 'user@example.com',
  password: 'password123',
  channelId: 'company-id-123',
});
```

#### List Connected Channels
```typescript
import { prisma } from '@/lib/prisma';

const channels = await prisma.socialChannel.findMany({
  where: { companyId: 'company-id' },
});
```

#### Publish Content
```typescript
const result = await compiled.invoke({
  messages: [],
  action: 'upload',
  channelId: 'channel-uuid',
  contentData: {
    title: 'My Post',
    description: 'Post content',
    mediaUrls: [],
  },
});
```

## Security Considerations

### Credential Encryption
- All session data is encrypted using AES-256-CBC
- `SESSION_ENCRYPTION_KEY` must be a 32-byte hex string
- Credentials are never stored in plain text

### Session Management
- Playwright sessions include cookies and localStorage
- Sessions are automatically encrypted before database storage
- Decryption happens on-demand during browser initialization

### Approval Gates
- All account-modifying actions require approval
- Approval logic can be customized per company
- All actions are logged for audit trail

## Platform-Specific Notes

### YouTube
- Login flow: Email → Password → Service account selection
- Supports scheduled upload
- Analytics via API
- Requires channel selection after authentication

### TikTok
- Login flow: Email → Password → 2FA (if enabled)
- Browser automation required (no direct API for all features)
- May trigger security prompts

### Instagram
- Login flow: Email → Password → 2FA/Security code
- Strict anti-bot detection
- May require email verification after login

### Twitter/X
- Login flow: Email → Password → Phone verification (if enabled)
- API recommended for most operations
- Browser automation for edge cases

### LinkedIn
- Login flow: Email → Password → 2FA (if enabled)
- Company pages require additional authentication
- Browser automation for content scheduling

### Facebook
- Login flow: Email → Password → 2FA (if enabled)
- Supports Page posts and personal timeline
- Graph API recommended for most operations

## Troubleshooting

### Issue: Login fails with "Session not found"
- Ensure SESSION_ENCRYPTION_KEY is set correctly
- Check database connectivity
- Verify credentials are correct

### Issue: Playwright timeout
- Increase PLAYWRIGHT_TIMEOUT in .env
- Check network connectivity
- Ensure PLAYWRIGHT_HEADLESS=false for debugging

### Issue: "Anti-bot detection triggered"
- Add delays between actions: PLAYWRIGHT_SLOW_MO=500
- Use residential proxy if available
- Implement retry logic with exponential backoff

### Issue: 2FA/MFA blocks login
- Implement 2FA bypass using backup codes
- Store and use app-specific passwords where available
- Manual intervention may be required

## Future Enhancements

1. **Official API Integration**: Use official APIs where available (YouTube, LinkedIn, Buffer)
2. **Proxy Support**: Add residential proxy support for TikTok/Instagram
3. **Analytics Aggregation**: Combine analytics from all platforms
4. **Content Calendar**: UI for content planning
5. **Auto-posting Scheduler**: Cron-based automatic posting
6. **Mem0 Integration**: Store conversation context and recommendations
7. **GitHub MCP**: Version control for automation workflows
8. **Kimi API Integration**: AI content generation for posts

## Integration with Jarvis

### CEO Agent
- CEO Agent approves all high-value content posts
- Uses Mem0 for context about company brand guidelines
- Logs all approvals for audit trail

### Content Agent
- Generates content proposals
- Submits to CEO Agent for approval
- Uses Analytics Agent results for trend analysis

### Analytics Agent
- Collects analytics from all platforms
- Generates insights and recommendations
- Identifies top-performing content types

### Scheduling Agent
- Manages publication schedule
- Ensures optimal posting times per platform
- Handles timezone conversions

## API Documentation

### POST /api/channels/connect
Connect a new social media channel.

**Request:**
```json
{
  "platform": "youtube",
  "email": "user@example.com",
  "password": "password123",
  "companyId": "company-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "channel": {
    "id": "channel-uuid",
    "platform": "YOUTUBE",
    "status": "AUTHENTICATED",
    "isAuthenticated": true
  }
}
```

### GET /api/channels/list
List all connected channels for a company.

**Query Parameters:**
- `companyId` (required): Company ID

**Response:**
```json
{
  "success": true,
  "channels": [
    {
      "id": "channel-uuid",
      "platform": "YOUTUBE",
      "accountEmail": "user@example.com",
      "status": "AUTHENTICATED",
      "isAuthenticated": true,
      "lastLoginAt": "2024-01-15T10:30:00Z",
      "canPost": true,
      "canSchedule": true,
      "canAnalytics": true
    }
  ],
  "total": 1
}
```

### POST /api/channels/publish
Publish or schedule content to a channel.

**Request:**
```json
{
  "channelId": "channel-uuid",
  "action": "upload",
  "content": {
    "title": "My Post",
    "description": "Post content here",
    "mediaUrls": ["https://example.com/image.jpg"]
  },
  "scheduledTime": "2024-01-20T15:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content published",
  "result": {
    "postId": "post-uuid",
    "status": "PUBLISHED",
    "url": "https://youtube.com/watch?v=..."
  }
}
```

## Development Checklist

- [ ] Install dependencies: `npm install playwright @langchain/langgraph @langchain/core`
- [ ] Create .env with SESSION_ENCRYPTION_KEY
- [ ] Run database migrations: `npm run db:push`
- [ ] Test channel connection with one platform
- [ ] Test publish workflow
- [ ] Test analytics collection
- [ ] Add Mem0 integration for memory
- [ ] Add GitHub MCP for workflow versioning
- [ ] Integrate with CEO Agent for approvals
- [ ] Add comprehensive error handling
- [ ] Document API contracts for other agents
- [ ] Set up monitoring and error logging
- [ ] Load test with multiple concurrent posts
- [ ] Test 2FA/MFA handling

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review Playwright documentation: https://playwright.dev
3. Check LangGraph documentation: https://langchain.com/langgraph
4. Contact Jarvis team for integration support
