# MOAIZA AI - Quick Start Guide

## 5-Minute Setup

### Step 1: Start PostgreSQL (Docker)

```bash
docker-compose up -d postgres
```

Wait for PostgreSQL to be ready:
```bash
docker-compose logs postgres
```

### Step 2: Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local`:
```env
DATABASE_URL=postgresql://moaiza:moaiza_dev_password@localhost:5432/moaiza
OPENAI_API_KEY=sk-your-api-key-here
NEXTAUTH_SECRET=your-secret-key-here
```

### Step 3: Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Create tables
npm run db:push

# Add sample data
npm run db:seed
```

### Step 4: Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## First Steps in the App

### 1. Register Your Company

- Click "Get Started" on homepage
- Enter company details:
  - Company Name
  - Email
  - Country (Egypt, Saudi Arabia, UAE, etc.)
  - City

### 2. Create a Tender

- Click "Dashboard" after login
- Click "+ New Tender"
- Fill in:
  - Project Title
  - Client Name
  - Project Location
  - Description

### 3. Upload a Document

- Click on a tender
- Click "Upload Document"
- Select PDF, Excel, or DOCX file
- Click "Analyze"

### 4. Review AI Extraction

- View extracted BOQ items
- Check confidence scores
- Edit any incorrect items
- Review identified risks

### 5. Calculate Costs

- Navigate to "Pricing" tab
- Set material, labor, equipment costs
- Choose bid strategy (Aggressive/Balanced/Conservative)
- View recommended bid

### 6. Generate Reports

- Click "Generate Report"
- Choose format: Excel, PDF, or Proposal
- Download and share with stakeholders

---

## Key Features Demo

### Cost Estimation

The app automatically calculates:
- Total material cost
- Labor cost
- Equipment cost
- Transport cost
- Waste (5%)
- Overhead (10%)
- Profit margin (15%)
- Risk allowance (5%)

### Bid Strategies

**Aggressive**: 1.05x multiplier (5% margin)
**Balanced**: 1.15x multiplier (15% margin)
**Conservative**: 1.25x multiplier (25% margin)

### Risk Scoring

The system detects:
- Quantity discrepancies (0-25 points)
- Missing specifications (0-20 points)
- Incomplete drawings (20 points)
- Price volatility (0-25 points)
- **Total: 0-100 risk score**

---

## User Roles

### Owner
- Full access
- Company management
- Team management
- Billing

### Manager
- Tender management
- Team oversight
- Report access
- No billing access

### Estimator
- Tender analysis
- Cost estimation
- Bid generation
- Read-only reports

### Viewer
- Read-only access
- Can view reports
- Cannot modify

---

## Troubleshooting

### "Database connection refused"
```bash
docker-compose ps  # Check if postgres is running
docker-compose logs postgres  # Check logs
```

### "OpenAI API error"
- Verify API key is correct
- Check API quota
- Ensure account has credits

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### "Prisma schema sync error"
```bash
npx prisma migrate resolve --rolled-back migration_name
npm run db:push
```

---

## Development Tools

### Database Management

```bash
# Open Prisma Studio
npm run db:studio

# View migrations
npx prisma migrate status

# Create new migration
npx prisma migrate dev --name add_new_feature
```

### Code Generation

```bash
# Generate Prisma types
npx prisma generate

# Generate API types
npm run type:generate
```

---

## API Testing

### Test with cURL

Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

Create Tender:
```bash
curl -X POST http://localhost:3000/api/tenders \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Project",
    "clientName":"Client Name",
    "projectLocation":"Cairo"
  }'
```

Analyze Document:
```bash
curl -X POST http://localhost:3000/api/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "documentContent":"...",
    "documentType":"tender"
  }'
```

---

## Performance Tips

1. **Use Prisma Caching**
   ```typescript
   const tenders = await prisma.tender.findMany({
     select: { id: true, title: true },
     take: 10
   });
   ```

2. **Implement Pagination**
   ```typescript
   const page = 1;
   const pageSize = 20;
   const skip = (page - 1) * pageSize;
   ```

3. **Use Database Indexes** (already configured in schema)

4. **Cache API Responses**
   ```typescript
   revalidate: 60  // ISR
   ```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API keys verified
- [ ] CORS configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Backups configured
- [ ] CDN configured
- [ ] SSL/TLS enabled

---

## Next Steps

1. **Customize Branding**
   - Update logo in `public/`
   - Modify colors in `tailwind.config.js`
   - Update company name in layout

2. **Implement Authentication**
   - Set up NextAuth.js
   - Configure OAuth providers
   - Add password reset flow

3. **Integrate with Supabase**
   - Create Supabase project
   - Set up storage for files
   - Configure real-time updates

4. **Add Localization**
   - Install `next-intl`
   - Add Arabic translations
   - Implement RTL support

5. **Set up Monitoring**
   - Configure Sentry
   - Add analytics
   - Set up uptime monitoring

---

## Support

For issues and questions:
- GitHub Issues: [Create Issue]
- Email: support@moaiza.ai
- Documentation: [Visit Docs]

**Happy building! 🚀**
