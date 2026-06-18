/**
 * CLAUDE.md - Project Instructions
 * 
 * This file contains persistent instructions for working on the VivaahAI Next.js project.
 */

# VivaahAI Next.js Project - Developer Guide

## Project Overview
VivaahAI is India's AI-powered matrimonial platform. This is the Next.js 15 frontend + API layer built with TypeScript, Tailwind CSS, and modern web technologies.

## Key Architecture Decisions

### 1. Full-Stack with Next.js
- **App Router**: Using Next.js 15+ App Router for routing
- **API Routes**: All microservices have dedicated route handlers in `/app/api/`
- **Server Components**: Leverage React Server Components where possible for performance
- **Client Components**: Mark interactive components with `'use client'` directive

### 2. Type Safety
- **TypeScript**: Strict mode enabled, all types in `/types/index.ts`
- **Zod Validation**: Runtime validation for all API requests
- **API Client**: Centralized axios client in `/lib/api.ts` with interceptors

### 3. Styling
- **Tailwind CSS**: Primary styling system
- **Custom Theme**: Primary color `#6B1B3D`, Accent `#D4AF37` (from design system)
- **Responsive Design**: Mobile-first approach, target 44px+ hit targets

### 4. State Management
- **React Hooks**: Use built-in hooks for local state
- **React Query**: TanStack React Query for server state (caching, sync)
- **Zustand**: Optional for global client state if needed
- **LocalStorage**: For auth tokens and user preferences

### 5. API Integration
- **REST API**: All microservices use REST endpoints
- **WebSocket**: Socket.IO for real-time features (chat, presence)
- **Error Handling**: Centralized error handling with APIErrorCode enum
- **Auth**: JWT tokens with refresh mechanism

## Development Guidelines

### Code Organization
```
app/                    # Routes and pages
  api/                  # API endpoints (group by feature)
    auth/
    users/
    matches/
    chat/
    payments/
  (auth)/              # Auth group routes
  (protected)/         # Protected group routes
  
components/            # Reusable React components
  auth/               # Auth-specific components
  forms/              # Form components
  common/             # Shared UI components
  
hooks/                # Custom React hooks
lib/                  # Utilities and helpers
services/             # Business logic & API calls
types/                # TypeScript types
config/               # Configuration
```

### Component Best Practices
1. **Props Typing**: Always type component props with TypeScript interfaces
2. **Props Drilling**: Use context/hooks to avoid excessive prop drilling
3. **Composition**: Break down large components into smaller reusable pieces
4. **Naming**: Use descriptive names that reflect the component's purpose
5. **Accessibility**: Follow WCAG 2.1 AA standards, test with keyboard navigation

### API Development
1. **Response Format**: All responses follow `APIResponse<T>` structure with success/error/meta fields
2. **Error Codes**: Use APIErrorCode enum for consistent error handling
3. **Authentication**: Verify JWT tokens in protected routes via middleware
4. **Rate Limiting**: Implement rate limiting for all endpoints
5. **Logging**: Log all requests with request ID for tracing

### Database Integration (TODO)
- **PostgreSQL**: Primary DB for users, auth, subscriptions, audit logs
- **MongoDB**: Profile data, chat history, messages
- **Redis**: Sessions, cache, rate limiting, presence
- **ORM**: Use Prisma for PostgreSQL, Mongoose for MongoDB

### Authentication Flow
1. User enters phone number → `/api/auth/login` sends OTP via Twilio
2. User enters OTP → `/api/auth/verify-otp` creates user, issues JWT
3. JWT stored in localStorage with refresh token
4. API client automatically adds Authorization header
5. 401 response triggers token refresh or logout

### Feature Flags
- Use `getFeatureFlag()` from `lib/constants.ts` to check flags
- Environment variables: `FEATURE_AI_MATCHING`, `FEATURE_VIDEO_CALLS`, etc.
- Update flags in `.env.local` for development

### Security Checklist
- [ ] Never log sensitive data (tokens, passwords, PII)
- [ ] Strip EXIF data from uploaded photos
- [ ] Use HTTPS in production
- [ ] Validate all input with Zod schemas
- [ ] Sanitize HTML content
- [ ] Rate limit all endpoints
- [ ] Rotate secrets quarterly
- [ ] Use environment variables for secrets

### Testing
- Write unit tests for utilities in `lib/` and `services/`
- Write integration tests for API routes
- Test authentication flows thoroughly
- Mock API calls in component tests
- Target 80%+ code coverage

### Performance Optimization
- Use `next/image` for image optimization
- Dynamic imports for heavy components
- React Query for API caching (stale-while-revalidate)
- CSS-in-JS: Tailwind is already optimized
- Lazy load routes with `next/dynamic`
- Monitor Core Web Vitals

### Common Tasks

#### Adding a New Feature
1. Create type in `/types/index.ts`
2. Create service in `/services/[feature].service.ts`
3. Create API routes in `/app/api/[feature]/route.ts`
4. Add validation schema in `/lib/validation.ts`
5. Create components in `/components/[feature]/`
6. Create page/layout in `/app/[feature]/page.tsx`
7. Add hooks if needed in `/hooks/use[Feature].ts`

#### Adding an API Endpoint
1. Define request/response types in `/types/index.ts`
2. Create route handler in `/app/api/[service]/[route]/route.ts`
3. Add Zod validation for request body
4. Implement error handling with APIErrorCode
5. Add endpoint constant to `/config/api.ts`
6. Create service method in `/services/[service].service.ts`
7. Add React Query hook in `/hooks/useApi.ts`

#### Styling a Component
1. Use Tailwind classes for base styles
2. Keep custom CSS minimal (in `app/globals.css` only)
3. Extract common patterns to `.card`, `.btn-primary` etc. in globals
4. Use theme colors from tailwind.config.js
5. Mobile-first: small screen first, then `md:`, `lg:` breakpoints

## Environment Variables
See `.env.example` for all required variables. Key ones:
- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL
- `NEXTAUTH_SECRET`: NextAuth secret (min 32 chars)
- `DATABASE_URL`: PostgreSQL connection string
- `MONGODB_URL`: MongoDB connection string
- `REDIS_URL`: Redis connection string
- `AWS_*`: AWS credentials for S3, CloudFront, etc.

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Vercel auto-builds and deploys on push

### AWS (Docker)
1. Build Docker image: `docker build -t vivaah-ai .`
2. Push to ECR: `aws ecr push ...`
3. Update ECS task definition
4. Deploy via ECS/CloudFormation

### Local Development
```bash
npm install
cp .env.example .env.local
npm run dev
# Open http://localhost:3000
```

## Debugging
- Use `console.log()` for quick debugging
- Use browser DevTools for client-side debugging
- Check Next.js server logs for API errors
- Use Sentry (when configured) for production error tracking
- Use `eval_js_user_view` to inspect user's live view

## Important Notes
- **Never hardcode secrets** - use environment variables
- **Always validate input** - use Zod schemas
- **Always handle errors** - consistent error responses
- **Always add types** - no `any` type unless unavoidable
- **Always test** - unit tests for utils, integration tests for APIs
- **Always document** - JSDoc comments on public functions
- **Always log appropriately** - no sensitive data in logs

---

Last updated: 2024
