# VivaahAI - Next.js Project Setup

AI-powered matrimonial platform built with modern web technologies.

## 📋 Project Overview

VivaahAI is India's most trusted AI-driven matchmaking platform targeting the premium matrimony market (₹1,800 Cr). This Next.js project provides:

- **Year 1 Goal**: 500K registered users, 50K paying (10% conversion), ₹30 Cr ARR
- **AI Matching**: 3-5x better match quality than traditional rule-based systems
- **Bank-Grade Security**: DPDP Act 2023 compliant, liveness detection, ID verification
- **Family Integration**: Unique feature allowing parents to be involved
- **Modern UX**: Native iOS/Android apps + responsive web platform

## 🏗️ Project Structure

```
vivaah-ai/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API routes (microservices)
│   ├── auth/                     # Authentication pages
│   ├── home/                     # Home/dashboard
│   ├── matches/                  # Matching pages
│   ├── chat/                     # Messaging pages
│   ├── profile/                  # User profile pages
│   ├── subscriptions/            # Payment/subscription pages
│   ├── admin/                    # Admin panel
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── auth/                     # Auth-related components
│   ├── matches/                  # Match-related components
│   ├── chat/                     # Chat-related components
│   ├── common/                   # Common UI components
│   └── forms/                    # Form components
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useApi.ts                # API query hook
│   └── ...
├── lib/                          # Utility libraries
│   ├── api.ts                   # Axios API client
│   ├── auth.ts                  # Auth utilities
│   ├── encryption.ts            # E2E encryption (TweetNaCl)
│   ├── validation.ts            # Zod validation schemas
│   ├── constants.ts             # App constants
│   └── utils.ts                 # Helper functions
├── types/                        # TypeScript type definitions
│   └── index.ts                 # All type definitions
├── config/                       # Configuration files
│   └── api.ts                   # API endpoints & error codes
├── services/                     # Business logic services
│   ├── auth.service.ts
│   ├── match.service.ts
│   ├── chat.service.ts
│   └── ...
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind CSS config
├── .env.example                 # Environment variables example
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vivaah-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Technology Stack

### Frontend
- **Framework**: Next.js 15 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **API Client**: Axios
- **Data Fetching**: TanStack React Query
- **Real-time**: Socket.IO Client
- **Encryption**: TweetNaCl.js (NaCl)
- **Validation**: Zod

### Backend Integration
- **API Pattern**: REST + WebSocket (Socket.IO)
- **Authentication**: NextAuth.js with JWT
- **Database**: PostgreSQL + MongoDB
- **Cache**: Redis
- **Storage**: AWS S3

### Security
- **Encryption**: AES-256 (at rest), TLS 1.3 (in transit)
- **E2E Chat**: TweetNaCl.js public key encryption
- **Compliance**: DPDP Act 2023, GDPR, PCI DSS
- **Auth**: JWT tokens with refresh mechanism

## 🔑 Key Features

### Phase 1 (MVP - Months 1-3)
- ✅ OTP-based authentication
- ✅ Profile creation (20+ fields)
- ✅ Photo upload with EXIF stripping
- ✅ Phone + Email + ID verification
- ✅ Liveness detection
- ✅ Rule-based matching (5 matches/day free)
- ✅ Real-time messaging with E2E encryption
- ✅ Payment integration (Razorpay)
- ✅ Freemium model (Gold ₹499/mo)

### Phase 2 (Months 4-6)
- 🚧 AI matching (embeddings + collaborative filtering)
- 🚧 Audio/video calls (WebRTC)
- 🚧 AI conversation assist
- 🚧 Family accounts
- 🚧 Advanced admin panel
- 🚧 Platinum (₹999/mo) & Diamond (₹2,499/mo) tiers

### Phase 3+ (Months 7+)
- 📋 Vendor marketplace
- 📋 B2B SaaS platform
- 📋 Financial services
- 📋 Global expansion (NRI, SE Asia)

## 🔐 Security

- **API Security**: Rate limiting, CORS, CSRF protection
- **Data Protection**: Encrypted at rest and in transit
- **Authentication**: JWT tokens with 24h expiry, 30d refresh
- **Authorization**: RBAC (User, Parent, Admin, Moderator)
- **Compliance**: DPDP Act 2023, GDPR, PCI DSS
- **Audit Logs**: All data access logged
- **Secrets**: AWS Secrets Manager for sensitive data

## 📊 Performance

- **API Response**: <200ms (p95)
- **Page Load**: <2s
- **Mobile Optimized**: Native app experience
- **Caching**: CloudFront CDN + browser cache (1h)
- **Database**: Multi-AZ, read replicas

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

### AWS Deployment
- **Compute**: AWS ECS Fargate
- **Database**: RDS PostgreSQL + DocumentDB
- **Cache**: ElastiCache Redis
- **Storage**: S3 + CloudFront CDN
- **DNS**: Route 53 with health checks
- **Load Balancing**: Application Load Balancer (ALB)

## 📝 Environment Variables

See `.env.example` for complete list. Key variables:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<min-32-chars>
DATABASE_URL=postgresql://...
MONGODB_URL=mongodb://...
REDIS_URL=redis://...
AWS_S3_BUCKET=vivaah-photos
RAZORPAY_KEY=<your-key>
TWILIO_ACCOUNT_SID=<your-sid>
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📞 Support

For questions or issues:
- Email: support@vivaah.ai
- Documentation: [Wiki](#)
- Issues: GitHub Issues

## 📄 License

This project is proprietary and confidential.

## 🎯 Roadmap

- **Month 1-3**: Launch MVP with core features
- **Month 4-6**: AI matching, family accounts, advanced admin
- **Month 7-12**: Vendor marketplace, B2B platform
- **Year 2+**: Global expansion, IPO readiness

---

**Happy coding! 🚀**

For detailed API documentation, see [API_DOCUMENTATION.md](#)
For architecture details, see [ARCHITECTURE.md](#)
