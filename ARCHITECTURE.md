# MOAIZA AI - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  (Next.js Frontend - React Components, TypeScript)              │
└────────────────────┬────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼────────┐  ┌──────────▼─────────┐
│  API Routes     │  │  Static Assets     │
│  (Next.js API)  │  │  (Images, Fonts)   │
└────────┬────────┘  └────────────────────┘
         │
    ┌────┴─────────────────┐
    │                      │
┌───▼────────┐  ┌──────────▼──────────┐
│ Prisma ORM │  │  External Services  │
│ (Database) │  │  (OpenAI, Supabase) │
└────────────┘  └─────────────────────┘
         │
    ┌────▼──────────────┐
    │  PostgreSQL       │
    │  (Data Storage)   │
    └───────────────────┘
```

## Application Layers

### 1. Presentation Layer (Frontend)

**Technology**: Next.js 15, React 18, TypeScript, Tailwind CSS

**Key Components**:
- `app/` - Page routes and layouts
- `components/` - Reusable UI components
- `pages/` - API routes

**Responsibilities**:
- User interface rendering
- Form validation
- Local state management
- API communication

### 2. Business Logic Layer (Services)

**Location**: `lib/`

**Services**:
- `ai-service.ts` - Document analysis and AI integration
- `calculations.ts` - Cost estimation and formulas
- `auth-service.ts` - Authentication logic (planned)
- `file-service.ts` - File upload/download (planned)

**Responsibilities**:
- Business rule implementation
- Data transformation
- External API integration
- Complex calculations

### 3. API Layer (Routes)

**Location**: `app/api/`

**Routes**:
- `auth/` - Authentication endpoints
- `tenders/` - Tender CRUD operations
- `analysis/` - Document analysis
- `costs/` - Cost calculations
- `reports/` - Report generation

**Responsibilities**:
- Request validation
- Response formatting
- Error handling
- Database operations

### 4. Data Layer (Database)

**Technology**: PostgreSQL, Prisma ORM

**Schema**:
```
Companies
  ├─ Users
  ├─ Tenders
  │   ├─ TenderFiles
  │   ├─ BOQItems
  │   └─ RiskFlags
  ├─ Materials
  ├─ Suppliers
  └─ HistoricalBids
```

**Responsibilities**:
- Data persistence
- Data integrity
- Query optimization
- Transaction management

## Data Flow

### Tender Analysis Flow

```
1. User uploads document
   ↓
2. File stored in Supabase Storage
   ↓
3. Document content extracted
   ↓
4. Sent to OpenAI for analysis
   ↓
5. BOQ items extracted
   ↓
6. Results saved to database
   ↓
7. UI updated with results
   ↓
8. User reviews and edits items
```

### Cost Estimation Flow

```
1. User selects BOQ items
   ↓
2. User enters cost components
   ↓
3. Backend calculates totals:
   - Subtotal (materials + labor + equipment + transport)
   - Add waste percentage
   - Add overhead percentage
   - Add profit percentage
   - Add risk allowance
   ↓
4. Generate bid based on strategy:
   - Aggressive: 1.05x multiplier
   - Balanced: 1.15x multiplier
   - Conservative: 1.25x multiplier
   ↓
5. Calculate margin and probabilities
   ↓
6. Display recommendations
```

## Component Architecture

### Page Components

```
app/
├── page.tsx                 # Landing page
├── dashboard/
│   ├── page.tsx            # Dashboard overview
│   ├── tenders/
│   │   ├── page.tsx        # Tenders list
│   │   ├── [id]/
│   │   │   ├── page.tsx    # Tender details
│   │   │   ├── analysis/   # Analysis view
│   │   │   ├── pricing/    # Cost estimation
│   │   │   └── reports/    # Reports view
│   │   └── new/
│   │       └── page.tsx    # Create tender
│   ├── materials/
│   │   └── page.tsx        # Material database
│   └── reports/
│       └── page.tsx        # Reports list
├── auth/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
└── layout.tsx              # Root layout
```

### Reusable Components

```
components/
├── layout/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── dashboard/
│   ├── TenderCard.tsx
│   ├── StatsGrid.tsx
│   ├── TenderTable.tsx
│   └── Charts.tsx
├── forms/
│   ├── TenderForm.tsx
│   ├── BOQForm.tsx
│   └── CostForm.tsx
├── ui/
│   ├── Modal.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   └── Alert.tsx
└── analysis/
    ├── BOQTable.tsx
    ├── RiskIndicator.tsx
    └── ConfidenceScore.tsx
```

## State Management

**Current**: React hooks + Context API
**Planned**: Zustand for global state

```
Context Structure:
├── AuthContext
│   ├── user
│   ├── isAuthenticated
│   └── login/logout
├── CompanyContext
│   ├── currentCompany
│   └── userRole
└── TenderContext
    ├── selectedTender
    ├── boqItems
    └── costEstimate
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "tender-1",
    "title": "Project Name"
  },
  "meta": {
    "timestamp": "2026-06-20T10:00:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Security Architecture

### Authentication Flow

```
1. User enters credentials
   ↓
2. Hash password with bcrypt
   ↓
3. Compare with database
   ↓
4. Generate JWT token
   ↓
5. Store in secure cookie
   ↓
6. Include in API requests
   ↓
7. Verify token on backend
```

### Authorization Flow

```
1. Get user from token
   ↓
2. Check role permissions
   ↓
3. Check resource ownership
   ↓
4. Grant/deny access
```

### Security Headers

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy: ...`

## Error Handling

### Error Hierarchy

```
ApiError
├── ValidationError (400)
├── AuthenticationError (401)
├── AuthorizationError (403)
├── NotFoundError (404)
├── ConflictError (409)
└── ServerError (500)
```

### Error Recovery Strategy

```
Client Error (4xx)
├── Show user-friendly message
├── Suggest corrective action
└── Log for debugging

Server Error (5xx)
├── Log full error with context
├── Show generic message to user
├── Alert ops team
└── Implement retry logic
```

## Performance Optimization

### Frontend Optimization

- Code splitting with Next.js
- Image optimization
- CSS-in-JS with Tailwind
- Lazy loading components
- Memoization with React.memo

### Backend Optimization

- Database indexing (configured in schema)
- Query optimization with Prisma
- API route caching (ISR)
- Response compression
- CDN for static assets

### Database Optimization

```prisma
// Indexes configured
@@index([companyId])
@@index([status])
@@index([category])
@@unique([materialId, supplierId])
```

## Scalability Strategy

### Horizontal Scaling

- Stateless API design
- Database connection pooling
- Load balancing ready
- Session management via JWT

### Vertical Scaling

- Pagination for large datasets
- Lazy loading
- Caching strategies
- Optimized queries

### Monitoring & Observability

- Error tracking (Sentry)
- Performance monitoring
- API request logging
- Database query logging
- Application metrics

## Deployment Architecture

### Development Environment

```
Local Machine
├── Node.js v18
├── PostgreSQL (Docker)
├── Next.js Dev Server
└── Hot reload enabled
```

### Staging Environment

```
Staging Server
├── Docker container
├── PostgreSQL RDS
├── Redis cache
└── Email service
```

### Production Environment

```
Vercel (Primary)
├── Automatic deployments
├── CDN + Edge Functions
├── Serverless API routes
└── Database: Managed PostgreSQL

Alternative: Self-hosted
├── Docker Compose
├── Docker Swarm/Kubernetes
├── Load Balancer
├── PostgreSQL Replica
├── Redis Cluster
└── Backup system
```

## Technology Decision Matrix

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Frontend Framework | Next.js 15 | SSR, SSG, hybrid capabilities |
| UI Components | React 18 | Component reusability |
| Styling | Tailwind CSS | Utility-first, small bundle |
| Type Safety | TypeScript | Catch errors early |
| Database | PostgreSQL | Reliability, ACID compliance |
| ORM | Prisma | Type-safe, intuitive API |
| Auth | NextAuth.js | OAuth, JWT, role-based |
| AI Integration | OpenAI API | GPT-4, document analysis |
| File Storage | Supabase Storage | S3-compatible, managed |
| Deployment | Vercel | Seamless Next.js integration |

## Future Architecture Enhancements

### Phase 2

- WebSocket for real-time collaboration
- Redis caching layer
- Message queue (Bull/RabbitMQ)
- Advanced analytics (ClickHouse)

### Phase 3

- Microservices architecture
- Kubernetes orchestration
- GraphQL API layer
- Event-driven architecture

### Phase 4

- AI/ML model training pipeline
- Advanced data visualization
- Mobile native apps
- Global CDN distribution

---

This architecture is designed for scalability, maintainability, and performance while remaining simple enough for a small team to manage.
