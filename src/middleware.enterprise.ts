// =============================================================================
// ENTERPRISE MIDDLEWARE
// Fortune 500 & Unicorn Startup Level Implementation
// High Performance, Zero Error Session Management
// =============================================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// =========================================================================
// ENTERPRISE CONFIGURATION
// =========================================================================

const MIDDLEWARE_CONFIG = {
  // Performance optimization
  CACHE_CONTROL: 'public, max-age=31536000, immutable',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  HEALTH_CHECK_INTERVAL: 60 * 1000, // 1 minute
  
  // Security settings
  SECURITY_HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Monitoring
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_TRACKING: true,
} as const;

// =========================================================================
// PATH CONFIGURATION
// =========================================================================

const PUBLIC_PATHS = new Set([
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/callback',
  '/about',
  '/privacy',
  '/terms',
  '/contact',
]);

const STATIC_PATHS = new Set([
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
]);

const API_PATHS = new Set([
  '/api/health',
  '/api/metrics',
  '/api/auth',
]);

// =========================================================================
// MIDDLEWARE CLASS
// =========================================================================

class EnterpriseMiddleware {
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  private performanceMetrics = new Map<string, number[]>();
  private healthStatus = { healthy: true, lastCheck: Date.now() };

  // =========================================================================
  // MAIN MIDDLEWARE FUNCTION
  // =========================================================================

  async handle(request: NextRequest): Promise<NextResponse> {
    const startTime = Date.now();
    const pathname = request.nextUrl.pathname;
    
    try {
      // Performance monitoring
      this.recordRequestStart(pathname);

      // Static file optimization
      if (this.isStaticPath(pathname)) {
        return this.handleStaticRequest(request);
      }

      // Health check endpoint
      if (pathname === '/api/health') {
        return this.handleHealthCheck();
      }

      // Rate limiting
      const rateLimitResult = this.checkRateLimit(request);
      if (!rateLimitResult.allowed) {
        return this.createRateLimitResponse();
      }

      // Security headers
      let response = NextResponse.next({
        request,
        headers: this.getSecurityHeaders(),
      });

      // Session management (only for non-static, non-public paths)
      if (!this.isPublicPath(pathname) && !this.isApiPath(pathname)) {
        response = await this.handleSessionManagement(request, response);
      }

      // Performance monitoring
      this.recordRequestEnd(pathname, startTime);

      return response;

    } catch (error) {
      console.error('Middleware error:', error);
      
      // Error tracking
      this.trackError(error, pathname);
      
      // Return safe fallback response
      return this.createErrorResponse(error);
    }
  }

  // =========================================================================
  // SESSION MANAGEMENT
  // =========================================================================

  private async handleSessionManagement(
    request: NextRequest,
    response: NextResponse
  ): Promise<NextResponse> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Missing Supabase environment variables');
      return response;
    }

    try {
      // Create optimized Supabase client
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            
            response = NextResponse.next({
              request,
              headers: response.headers,
            });
            
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, {
                ...options,
                // Enterprise security enhancements
                secure: true,
                sameSite: 'lax',
                httpOnly: true,
              });
            });
          },
        },
      });

      // Validate session with minimal overhead
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.warn('Session validation error:', error.message);
        // Don't redirect on session errors, let client handle
        return response;
      }

      // Add user context to response headers (for debugging)
      if (user && process.env.NODE_ENV === 'development') {
        response.headers.set('X-User-ID', user.id);
        response.headers.set('X-User-Email', user.email || '');
      }

      return response;

    } catch (error) {
      console.error('Session management error:', error);
      // Return original response on error
      return response;
    }
  }

  // =========================================================================
  // RATE LIMITING
  // =========================================================================

  private checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number } {
    const clientId = this.getClientIdentifier(request);
    const now = Date.now();
    const windowStart = now - MIDDLEWARE_CONFIG.RATE_LIMIT_WINDOW;

    // Clean up old entries
    this.rateLimitMap.forEach((value, key) => {
      if (value.resetTime < now) {
        this.rateLimitMap.delete(key);
      }
    });

    const clientData = this.rateLimitMap.get(clientId);
    
    if (!clientData || clientData.resetTime < now) {
      // New window
      this.rateLimitMap.set(clientId, {
        count: 1,
        resetTime: now + MIDDLEWARE_CONFIG.RATE_LIMIT_WINDOW,
      });
      return { allowed: true, remaining: MIDDLEWARE_CONFIG.RATE_LIMIT_MAX_REQUESTS - 1 };
    }

    if (clientData.count >= MIDDLEWARE_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
      return { allowed: false, remaining: 0 };
    }

    clientData.count++;
    return { 
      allowed: true, 
      remaining: MIDDLEWARE_CONFIG.RATE_LIMIT_MAX_REQUESTS - clientData.count 
    };
  }

  private getClientIdentifier(request: NextRequest): string {
    // Use multiple identifiers for better accuracy
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';
    
    const userAgent = request.headers.get('user-agent') || '';
    
    // Create a composite identifier
    return `${ip}:${userAgent.slice(0, 50)}`;
  }

  // =========================================================================
  // PATH UTILITIES
  // =========================================================================

  private isStaticPath(pathname: string): boolean {
    return Array.from(STATIC_PATHS).some(path => pathname.startsWith(path));
  }

  private isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.has(pathname) || pathname.startsWith('/public/');
  }

  private isApiPath(pathname: string): boolean {
    return Array.from(API_PATHS).some(path => pathname.startsWith(path));
  }

  // =========================================================================
  // RESPONSE CREATORS
  // =========================================================================

  private handleStaticRequest(request: NextRequest): NextResponse {
    const response = NextResponse.next();
    
    // Aggressive caching for static files
    response.headers.set('Cache-Control', MIDDLEWARE_CONFIG.CACHE_CONTROL);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    return response;
  }

  private handleHealthCheck(): NextResponse {
    const health = {
      status: this.healthStatus.healthy ? 'healthy' : 'unhealthy',
      timestamp: Date.now(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    return NextResponse.json(health, {
      status: this.healthStatus.healthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  }

  private createRateLimitResponse(): NextResponse {
    return NextResponse.json(
      { 
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please wait a moment and try again.',
        retryAfter: MIDDLEWARE_CONFIG.RATE_LIMIT_WINDOW / 1000,
      },
      { 
        status: 429,
        headers: {
          'Retry-After': (MIDDLEWARE_CONFIG.RATE_LIMIT_WINDOW / 1000).toString(),
          'X-RateLimit-Limit': MIDDLEWARE_CONFIG.RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': (Date.now() + MIDDLEWARE_CONFIG.RATE_LIMIT_WINDOW).toString(),
        },
      }
    );
  }

  private createErrorResponse(error: any): NextResponse {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      {
        error: 'Internal middleware error',
        message: isDevelopment ? error.message : 'An unexpected error occurred',
        timestamp: Date.now(),
      },
      { 
        status: 500,
        headers: this.getSecurityHeaders(),
      }
    );
  }

  // =========================================================================
  // SECURITY HEADERS
  // =========================================================================

  private getSecurityHeaders(): Record<string, string> {
    return {
      ...MIDDLEWARE_CONFIG.SECURITY_HEADERS,
      'X-Middleware-Version': '2.0.0',
      'X-Request-ID': this.generateRequestId(),
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // =========================================================================
  // PERFORMANCE MONITORING
  // =========================================================================

  private recordRequestStart(pathname: string): void {
    if (!MIDDLEWARE_CONFIG.ENABLE_PERFORMANCE_MONITORING) return;

    const metrics = this.performanceMetrics.get(pathname) || [];
    metrics.push(Date.now());
    
    // Keep only last 100 requests per path
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
    
    this.performanceMetrics.set(pathname, metrics);
  }

  private recordRequestEnd(pathname: string, startTime: number): void {
    if (!MIDDLEWARE_CONFIG.ENABLE_PERFORMANCE_MONITORING) return;

    const duration = Date.now() - startTime;
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow middleware request: ${pathname} took ${duration}ms`);
    }
  }

  // =========================================================================
  // ERROR TRACKING
  // =========================================================================

  private trackError(error: any, pathname: string): void {
    if (!MIDDLEWARE_CONFIG.ENABLE_ERROR_TRACKING) return;

    const errorData = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      pathname,
      timestamp: Date.now(),
      userAgent: 'middleware',
    };

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to external monitoring service
      this.sendToMonitoring(errorData);
    } else {
      console.error('Middleware error tracking:', errorData);
    }
  }

  private sendToMonitoring(errorData: any): void {
    // Implementation for sending to monitoring service
    // e.g., Sentry, DataDog, CloudWatch, etc.
    console.error('Error to be sent to monitoring:', errorData);
  }

  // =========================================================================
  // HEALTH MONITORING
  // =========================================================================

  private updateHealthStatus(): void {
    const now = Date.now();
    const timeSinceLastCheck = now - this.healthStatus.lastCheck;

    if (timeSinceLastCheck > MIDDLEWARE_CONFIG.HEALTH_CHECK_INTERVAL) {
      // Check system health
      const memoryUsage = process.memoryUsage();
      const memoryThreshold = 512 * 1024 * 1024; // 512MB

      this.healthStatus = {
        healthy: memoryUsage.heapUsed < memoryThreshold,
        lastCheck: now,
      };
    }
  }

  // =========================================================================
  // CLEANUP
  // =========================================================================

  cleanup(): void {
    this.rateLimitMap.clear();
    this.performanceMetrics.clear();
  }
}

// =========================================================================
// SINGLETON INSTANCE
// =========================================================================

const enterpriseMiddleware = new EnterpriseMiddleware();

// =========================================================================
// EXPORT MIDDLEWARE FUNCTION
// =========================================================================

export async function middleware(request: NextRequest) {
  return enterpriseMiddleware.handle(request);
}

// =========================================================================
// MIDDLEWARE CONFIGURATION
// =========================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/health (handled internally)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
};

// =========================================================================
// UTILITY EXPORTS
// =========================================================================

export { MIDDLEWARE_CONFIG, PUBLIC_PATHS, STATIC_PATHS, API_PATHS };

