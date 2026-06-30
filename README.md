# MOAIZA AI - Construction Tender Analysis Platform

A production-ready, AI-powered web application that helps construction companies analyze tenders, extract BOQs, estimate costs, and generate winning bids.

## 🎯 Overview

MOAIZA AI is a comprehensive SaaS platform designed for construction professionals across Egypt and GCC markets. It leverages AI to automate tender analysis, cost estimation, and bid optimization.

### Key Features

- **Tender Upload**: Support for PDF, Excel, DOCX, and ZIP files
- **AI Analysis**: Automatic BOQ extraction with confidence scoring
- **Cost Estimation**: Intelligent cost calculation with multiple strategies
- **Risk Detection**: Identify risks and missing information
- **Pricing Engine**: Dynamic material pricing from multiple suppliers
- **Bid Strategy**: Aggressive, Balanced, or Conservative bidding modes
- **Report Generation**: Excel, PDF, and proposal exports
- **Multi-language**: Arabic and English support with RTL
- **Dark Mode**: Full dark mode support
- **PWA**: Mobile-first progressive web app

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Supabase Storage for file uploads
- **AI**: OpenAI API for document analysis
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+ (local or Supabase)
- OpenAI API key
- Supabase account (optional, for managed database)

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
cd MOAIZA-AI
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/moaiza

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Application
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
MOAIZA-AI/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── dashboard/         # Dashboard components
│   └── layout/           # Layout components
├── lib/                   # Utility functions and services
│   ├── ai-service.ts     # OpenAI integration
│   ├── calculations.ts   # Cost calculations
│   └── ...
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Data models
│   └── seed.js          # Sample data
├── styles/              # Global styles
├── types/               # TypeScript types
├── public/              # Static assets
└── README.md           # This file
```

## 🗄️ Database Schema

### Core Tables

- **companies**: Organization information
- **users**: User accounts with roles (Owner, Manager, Estimator, Viewer)
- **tenders**: Tender projects
- **tender_files**: Uploaded documents
- **boq_items**: Bill of Quantity items extracted from tenders
- **materials**: Material database
- **suppliers**: Supplier information
- **material_prices**: Price history
- **risk_flags**: Identified risks
- **historical_bids**: Previous bids and results
- **reports**: Generated reports

## 🔐 Authentication

The application uses role-based access control:

- **Owner**: Full access, company management
- **Manager**: Tender management, reporting
- **Estimator**: Tender analysis, cost estimation
- **Viewer**: Read-only access

## 🤖 AI Features

### Document Analysis

Analyze tender documents to automatically extract:
- BOQ items with quantities and specifications
- Trade categories
- Missing information
- Duplicate items
- Scope gaps

### Cost Estimation

Calculate costs based on:
- Materials cost
- Labor costs
- Equipment costs
- Transport costs
- Waste percentage
- Overhead percentage
- Profit margin
- Risk allowance

### Risk Detection

Identify risks including:
- Quantity discrepancies
- Missing specifications
- Price volatility
- Incomplete drawings
- Unusual unit rates
- Scope gaps

### Bid Recommendation

Generate recommended bid amounts using:
- Estimated cost analysis
- Risk assessment
- Historical win rates
- Market conditions

## 📊 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Tenders

- `GET /api/tenders` - List tenders
- `POST /api/tenders` - Create tender
- `GET /api/tenders/[id]` - Get tender details
- `PUT /api/tenders/[id]` - Update tender
- `DELETE /api/tenders/[id]` - Delete tender

### Analysis

- `POST /api/analysis` - Analyze tender document
- `POST /api/analysis/risks` - Analyze risks
- `POST /api/analysis/boq` - Extract BOQ

### Costs

- `POST /api/costs/calculate` - Calculate cost estimate
- `POST /api/costs/bid` - Generate bid recommendation

### Reports

- `POST /api/reports/generate` - Generate report
- `GET /api/reports/[id]` - Get report

## 📱 Mobile Support

The application is fully responsive and includes:
- Mobile-first design
- Touch-friendly interface
- PWA capabilities
- Offline support (planned)
- Native app wrappers (planned)

## 🌍 Localization

Supports English and Arabic with:
- RTL support for Arabic
- Date formatting per locale
- Currency conversion
- Number formatting

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t moaiza-ai .

# Run container
docker run -p 3000:3000 moaiza-ai
```

### Traditional Server

```bash
# Build
npm run build

# Start production server
npm start
```

## 📈 Performance

- Next.js automatic code splitting
- Image optimization
- CSS minification
- API route compression
- Database query optimization

## 🧪 Testing

```bash
# Run tests (when available)
npm test

# Run E2E tests
npm run test:e2e

# Check code coverage
npm run test:coverage
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db execute --stdin

# Check migrations status
npx prisma migrate status
```

### OpenAI API Errors

Ensure your API key is valid and has sufficient credits.

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For support and inquiries, contact: support@moaiza.ai

## 🎓 Learning Resources

- [Next.js Tutorial](https://nextjs.org/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Course](https://www.tailwindcss.com/)
- [Prisma Tutorial](https://www.prisma.io/docs/getting-started)

## 🚧 Roadmap

- [ ] Mobile native app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with accounting software
- [ ] Multi-currency support
- [ ] Team collaboration features
- [ ] Advanced AI models
- [ ] Offline support
- [ ] API for third-party integrations

---

**Made with ❤️ for construction professionals**
