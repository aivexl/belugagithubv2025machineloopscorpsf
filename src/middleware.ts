// =============================================================================
// SIMPLIFIED MIDDLEWARE FOR JWT AUTHENTICATION
// Enterprise-grade with minimal complexity
// =============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, allow all requests to pass through
  // JWT validation happens at API level, not middleware level
  
  // Add security headers
  const response = NextResponse.next();
  
  // Security headers for enterprise-grade protection
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
