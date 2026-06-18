/**
 * VivaahAI Next.js Project - Architecture & Implementation Guide
 */

# VivaahAI Next.js Architecture Guide

## 📐 System Architecture

### Frontend Layer (This Project)
```
Next.js 15 (App Router)
├─ Server Components (SSR)
├─ Client Components (CSR with 'use client')
├─ API Routes (Next.js API handlers)
└─ Static Assets (images, fonts, etc.)
```

### Backend Services (To be integrated)
```
Microservices Architecture
├─ Auth Service (JWT, OTP)
├─ User Service (profiles, preferences)
├─ Match Service (rule-based + AI matching)
├─ Chat Service (Socket.IO real-time)
├─ Verification Service (ID, liveness, fraud)
├─ Payment Service (Razorpay integration)
└─ Admin Service (moderation, analytics)
```

### Data Layer
```
PostgreSQL (Primary)
├─ users, user_profiles, user_preferences
├─ matches, likes, mutual_matches
├─ subscriptions, payments
├─ verifications, audit_logs
└─ (Indexes on frequently queried fields)

MongoDB (Secondary)
├─ user_profiles (detailed)
├─ messages (chat history)
├─ conversations (metadata)
└─ notifications (event logs)

Redis (Cache & Real-time)
├─ sessions (user auth state)
├─ cache (frequently accessed data)
├─ rate_limiting (API quotas)
├─ presence (online status)
└─ locks (distributed transactions)

S3 (Storage)
└─ photos (compressed, versioned)

Elasticsearch (Search & Analytics)
└─ logs, user activity, metrics
```

---

## 🔐 Security Architecture

### Authentication Flow
```
1. User enters phone
   ↓
2. Frontend: POST /api/auth/login
   ├─ Backend: Validate phone
   ├─ Backend: Generate 6-digit OTP
   ├─ Backend: Send via Twilio SMS
   └─ Backend: Cache OTP with 10-min TTL
   ↓
3. User receives SMS with OTP
   ↓
4. User enters OTP
   ↓
5. Frontend: POST /api/auth/verify-otp
   ├─ Backend: Validate OTP (max 5 attempts)
   ├─ Backend: Check if user exists
   ├─ Backend: Create user if new
   ├─ Backend: Generate JWT (24h expiry)
   ├─ Backend: Generate refresh token (30d)
   └─ Backend: Store in secure HttpOnly cookie
   ↓
6. Frontend: Store tokens in localStorage
   ├─ accessToken (24h)
   └─ refreshToken (30d)
   ↓
7. Frontend: Redirect to /home
```

### Token Refresh Flow
```
1. API call with expired token → 401 response
   ↓
2. Frontend: POST /api/auth/refresh with refreshToken
   ├─ Backend: Validate refresh token
   ├─ Backend: Generate new access token
   └─ Backend: Return new token
   ↓
3. Frontend: Update localStorage with new token
   ↓
4. Frontend: Retry original request with new token
   ↓
5. Success! User never sees 401
```

### Message Encryption (E2E)
```
1. User A composes message
   ↓
2. Frontend: Encrypt with User B's public key
   ├─ Use TweetNaCl.js NaCl box
   ├─ Generate random nonce
   ├─ Create ciphertext
   └─ Create EncryptedMessage { nonce, ciphertext, publicKey }
   ↓
3. Frontend: Send encrypted message to server
   ↓
4. Backend: Store encrypted message (server can't read!)
   ↓
5. User B receives encrypted message
   ↓
6. Frontend: Decrypt with User B's secret key
   ├─ Use TweetNaCl.js NaCl box
   ├─ Recover nonce from message
   ├─ Decrypt ciphertext
   └─ Display plaintext
```

---

## 🏗️ API Design

### REST Conventions
```
Authentication
POST   /api/auth/login              → Send OTP
POST   /api/auth/verify-otp         → Verify OTP, issue JWT
POST   /api/auth/refresh            → Refresh access token
POST   /api/auth/logout             → Logout (clear tokens)

Users
GET    /api/users/profile           → Get my profile
PATCH  /api/users/profile           → Update my profile
DELETE /api/users/profile           → Delete my account
GET    /api/users/profile/:id       → Get user profile by ID
GET    /api/users/preferences       → Get my preferences
PATCH  /api/users/preferences       → Update my preferences

Matches
GET    /api/matches                 → Get recommended matches
POST   /api/matches/like            → Like a user
POST   /api/matches/pass            → Pass on a user
GET    /api/matches/mutual          → Get mutual matches
POST   /api/matches/:id/report      → Report a user

Chat (REST + WebSocket)
GET    /api/chat/conversations      → List conversations
GET    /api/chat/conversations/:id/messages → Get message history
POST   /api/chat/messages           → Send message (deprecated, use WebSocket)

Verification
POST   /api/verification/phone      → Send phone OTP
POST   /api/verification/email      → Send email verification
POST   /api/verification/id-upload  → Upload government ID
POST   /api/verification/liveness   → Record liveness video
GET    /api/verification/status     → Get verification status

Payments
POST   /api/payments/subscribe      → Create subscription (Razorpay)
POST   /api/payments/webhook        → Razorpay webhook (server-only)
GET    /api/payments/billing-history → Get payment history
POST   /api/payments/cancel         → Cancel subscription

Admin (Admin only)
GET    /api/admin/users             → List users (with filters)
POST   /api/admin/users/:id/ban     → Ban user
GET    /api/admin/moderation        → Flagged profiles & messages
POST   /api/admin/moderation/:id/approve → Approve profile
GET    /api/admin/analytics         → Dashboard metrics
```

### Response Format
```typescript
// Success Response
{
  "success": true,
  "data": { /* actual data */ },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "OTP is invalid or expired"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}

// Paginated Response
{
  "success": true,
  "data": [/* array of items */],
  "meta": {
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8,
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## 🎯 Component Architecture

### Page Hierarchy
```
app/
├─ page.tsx (Landing Page)
│
├─ (auth)/                         # Auth group
│  ├─ login/page.tsx              # Login with OTP
│  └─ signup/page.tsx             # Signup flow
│
├─ (protected)/                    # Protected routes (require auth)
│  ├─ home/page.tsx               # Dashboard/home
│  ├─ matches/
│  │  ├─ page.tsx                 # Match cards (swipe-like)
│  │  └─ [id]/page.tsx            # Match detail view
│  ├─ chat/
│  │  ├─ page.tsx                 # Conversations list
│  │  └─ [id]/page.tsx            # Chat window with User ID
│  ├─ profile/
│  │  ├─ page.tsx                 # View my profile
│  │  └─ edit/page.tsx            # Edit profile
│  ├─ verification/
│  │  ├─ page.tsx                 # Verification dashboard
│  │  ├─ id/page.tsx              # Upload ID
│  │  └─ liveness/page.tsx        # Liveness detection
│  ├─ subscriptions/page.tsx       # Payment & upgrade
│  └─ settings/page.tsx           # Privacy, notifications
│
├─ admin/                          # Admin routes (admin only)
│  ├─ page.tsx                    # Admin dashboard
│  ├─ users/page.tsx              # User management
│  ├─ moderation/page.tsx         # Moderation queue
│  └─ analytics/page.tsx          # Metrics & charts
│
└─ api/                            # API routes
   ├─ auth/...
   ├─ users/...
   ├─ matches/...
   ├─ chat/...
   └─ ...
```

### Component Organization
```
components/
├─ auth/
│  ├─ OTPInput.tsx                # OTP digit input
│  ├─ VerificationForm.tsx        # ID + liveness
│  └─ AuthGuard.tsx               # Protected route wrapper
│
├─ matches/
│  ├─ MatchCard.tsx               # Single match card
│  ├─ MatchStack.tsx              # Stack of cards (swipeable)
│  ├─ FilterPanel.tsx             # Age, religion, location filters
│  └─ MatchDetail.tsx             # Full profile view
│
├─ chat/
│  ├─ ChatWindow.tsx              # Message thread
│  ├─ MessageList.tsx             # Scrollable messages
│  ├─ MessageInput.tsx            # Input with encryption
│  ├─ ConversationItem.tsx        # List item
│  └─ TypingIndicator.tsx         # "User is typing..."
│
├─ forms/
│  ├─ ProfileForm.tsx             # 20+ field form
│  ├─ PreferencesForm.tsx         # Age, religion, distance
│  └─ SubscriptionForm.tsx        # Tier selection
│
├─ common/
│  ├─ Button.tsx                  # Primary, secondary, ghost
│  ├─ Input.tsx                   # Text, email, phone
│  ├─ Modal.tsx                   # Dialog wrapper
│  ├─ Navbar.tsx                  # Navigation
│  ├─ LoadingSpinner.tsx          # Loading state
│  └─ ErrorBoundary.tsx           # Error handling
│
└─ admin/
   ├─ UserTable.tsx               # Admin user list
   ├─ ModerationQueue.tsx         # Flagged content
   └─ AnalyticsDashboard.tsx      # Charts & metrics
```

---

## 🔄 Data Flow Examples

### User Registration Flow
```
1. User Signup (Phone)
   ↓
2. AuthService.sendOTP(phone)
   └─ POST /api/auth/login
      └─ Twilio sends SMS
   ↓
3. User enters OTP
   ↓
4. AuthService.verifyOTP({ phone, otp })
   └─ POST /api/auth/verify-otp
      └─ JWT issued
   ↓
5. Redirect to /onboarding/profile
   ↓
6. User fills profile (25+ fields)
   ↓
7. UserService.updateProfile(data)
   └─ PATCH /api/users/profile
   ↓
8. Upload photos
   ↓
9. UserService.uploadPhoto(file)
   └─ POST /api/users/profile/photo
      └─ S3 upload + EXIF strip
   ↓
10. Verification (ID + Liveness)
    ↓
11. VerificationService.uploadID(payload)
    └─ POST /api/verification/id-upload
       └─ OCR + fraud score
    ↓
12. VerificationService.recordLiveness(video)
    └─ POST /api/verification/liveness
       └─ TensorFlow + face match
    ↓
13. Auto-approve or flag for manual review
    ↓
14. Redirect to /home
    ↓
15. Receive first 5 matches
```

### Matching Flow
```
1. User opens /matches
   ↓
2. useApiQuery(['/api/matches'], () => MatchService.getMatches())
   ├─ React Query caches results
   └─ Refetch on component mount
   ↓
3. Display MatchStack with 5 cards
   ↓
4. User swipes on match
   ↓
5. On LIKE:
   └─ MatchService.likeUser(userId)
      └─ POST /api/matches/like
         ├─ Record like in DB
         ├─ Check for mutual
         ├─ Send notification
         └─ Return { liked: true, isMutual: false/true }
   ↓
6. If mutual match:
   ├─ Show celebration modal
   ├─ Enable messaging
   └─ Update UI
   ↓
7. Move to next match
```

### Real-Time Chat Flow
```
1. User clicks on conversation
   ↓
2. Load message history
   └─ GET /api/chat/conversations/:id/messages
   ↓
3. Establish WebSocket connection
   └─ socket.io('/chat', { token: jwt })
   ↓
4. User types message
   ↓
5. User sends message
   ├─ Encrypt with recipient's public key
   └─ socket.emit('message', { toUserId, encryptedContent, nonce })
   ↓
6. Server receives, stores, broadcasts
   └─ server.emit('message', encryptedMessage)
   ↓
7. Recipient receives
   ├─ Decrypt with their secret key
   ├─ Display plaintext
   └─ Send read receipt
   ↓
8. Typing indicator
   └─ socket.emit('typing', { conversationId })
      └─ Broadcast to other participant
      └─ Show "User is typing..." indicator
```

---

## 🚀 Performance Optimization

### Frontend Optimization
```
Code Splitting
├─ Dynamic imports for heavy components
├─ Route-based code splitting (automatic with App Router)
└─ Component lazy loading

Image Optimization
├─ next/image for automatic optimization
├─ WebP format for supported browsers
├─ Responsive srcset
└─ Lazy loading for below-the-fold images

Caching Strategy
├─ Browser cache: 1 hour for static assets
├─ CloudFront: 1 day for images, 5 minutes for HTML
├─ React Query: stale-while-revalidate for API data
└─ Service Worker: Offline support (future)

Bundle Analysis
├─ Monitor chunk sizes
├─ Remove unused dependencies
├─ Tree-shake unused code
└─ Target < 200KB gzip for main bundle
```

### API Optimization
```
Database
├─ Indexes on frequently queried fields
├─ Connection pooling
├─ Query optimization (select only needed fields)
└─ Read replicas for scaling

Caching
├─ Redis for sessions & frequently accessed data
├─ Cache invalidation on updates
├─ Stale data serving (TTL-based)
└─ Cache warming for popular matches

Rate Limiting
├─ 1000 req/min per IP
├─ 5000 req/min per authenticated user
├─ Exponential backoff for retries
└─ Burst capacity for spikes

API Response
├─ Pagination (20 items per page)
├─ Compression (gzip)
├─ Minimal JSON payloads
└─ Selective field loading
```

---

## 📊 Monitoring & Observability

### Logging
```
Frontend Logs
├─ Application logs → CloudWatch
├─ Error logs → Sentry
├─ User interactions → Amplitude
└─ Performance metrics → Datadog

Backend Logs
├─ Request/response → CloudWatch
├─ Errors → Sentry
├─ Database queries → CloudWatch
├─ API latency → Datadog
└─ Security events → CloudTrail
```

### Metrics
```
Application Metrics
├─ DAU (Daily Active Users)
├─ MAU (Monthly Active Users)
├─ Conversion rate (Free → Paid)
├─ Churn rate (Monthly)
├─ Message volume
└─ Match acceptance rate

Technical Metrics
├─ API response time (p50, p95, p99)
├─ Error rate (4xx, 5xx)
├─ Database query latency
├─ Cache hit rate
├─ Memory usage
└─ CPU utilization

User Experience Metrics
├─ Page load time
├─ Time to interactive (TTI)
├─ Cumulative Layout Shift (CLS)
├─ First Contentful Paint (FCP)
└─ Core Web Vitals score
```

---

## 🔄 Deployment Pipeline

### Local Development
```
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run test         # Run tests
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

### Staging
```
1. Push to staging branch
2. GitHub Actions runs tests
3. Build Docker image
4. Push to AWS ECR
5. Update ECS task definition
6. Deploy to staging environment
7. Run smoke tests
8. Send Slack notification
```

### Production
```
1. Create pull request on main
2. Code review + approval required
3. Merge to main
4. GitHub Actions runs full test suite
5. Build Docker image
6. Push to ECR
7. Create production task definition
8. Blue-green deployment
9. Health checks pass
10. Remove old containers
11. Send deployment notification
12. Monitor metrics for 1 hour
```

---

## 🛡️ Security Checklist

- [ ] All secrets in environment variables (no hardcoding)
- [ ] HTTPS enforced in production
- [ ] CORS configured for allowed origins only
- [ ] CSRF protection on state-changing requests
- [ ] Rate limiting on all endpoints
- [ ] Input validation with Zod schemas
- [ ] Output sanitization (XSS prevention)
- [ ] SQL injection prevention (parameterized queries)
- [ ] Authentication required for protected routes
- [ ] Authorization checks on resources
- [ ] Sensitive data encrypted at rest
- [ ] TLS 1.3 for data in transit
- [ ] EXIF data stripped from photos
- [ ] E2E encryption for messages
- [ ] Audit logs for all data access
- [ ] Security headers (CSP, X-Frame-Options, etc.)
- [ ] Regular security audits
- [ ] Vulnerability scanning on dependencies
- [ ] Incident response plan
- [ ] DPDP Act 2023 compliance

---

This architecture is designed for:
✅ Scalability (1000s concurrent users)
✅ Security (bank-grade encryption)
✅ Reliability (99.99% uptime target)
✅ Maintainability (clean code, good tests)
✅ Performance (< 200ms API response, < 2s page load)
✅ Compliance (DPDP, GDPR, PCI DSS)
