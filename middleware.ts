/**
 * Middleware for API authentication
 */

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedRoutes = ['/api/users', '/api/matches', '/api/chat', '/api/payments', '/api/verification'];
  const pathname = request.nextUrl.pathname;

  // Check if route requires authentication
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing or invalid authorization token',
          },
        },
        { status: 401 }
      );
    }

    // TODO: Verify JWT token
    // TODO: Add user context to request
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
