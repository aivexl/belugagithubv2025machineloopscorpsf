/**
 * Production Security Middleware - Edge Runtime Compatible
 * Fortune 500 Grade Security Headers
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security Headers - Fortune 500 Grade
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Check if this is a Sanity Studio route
  const isStudioRoute = request.nextUrl.pathname.startsWith('/studio')
  
  // Content Security Policy - Dynamic based on route
  let cspPolicy: string
  
  if (isStudioRoute) {
    // Enhanced CSP for Sanity Studio with full Google AdSense support
    cspPolicy = 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app https://va.vercel-scripts.com https://vitals.vercel-insights.com https://cdn.sanity.io https://core.sanity-cdn.com https://*.sanity.io https://qaofdbqx.sanity.studio https://qaofdbqx.api.sanity.io https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.sanity.io https://*.sanity.io https://qaofdbqx.sanity.studio; " +
      "font-src 'self' https://fonts.gstatic.com https://cdn.sanity.io https://*.sanity.io https://qaofdbqx.sanity.studio; " +
      "img-src 'self' data: https: http: blob: https://cdn.sanity.io https://*.sanity.io https://qaofdbqx.sanity.studio https://*.google.com https://*.googleadservices.com https://*.g.doubleclick.net; " +
      "connect-src 'self' https://sqjqirkrcfczypxygdtm.supabase.co https://*.supabase.co https://api.coingecko.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://cdn.sanity.io https://qaofdbqx.api.sanity.io https://*.sanity.io https://*.sanity-cdn.com https://core.sanity-cdn.com https://www.googletagmanager.com https://*.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://*.googleadservices.com https://*.g.doubleclick.net https://*.doubleclick.net https://*.adtrafficquality.google https://ep1.adtrafficquality.google wss://*.supabase.co wss://*.sanity.io; " +
      "frame-src 'self' https://*.sanity.io https://qaofdbqx.sanity.studio https://core.sanity-cdn.com https://www.googletagmanager.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://*.g.doubleclick.net https://*.doubleclick.net https://*.googleadservices.com https://pagead2.googlesyndication.com https://*.googlesyndication.com; " +
      "frame-ancestors 'none';"
  } else {
    // Standard CSP for main application with full Google AdSense support
    cspPolicy = 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app https://va.vercel-scripts.com https://vitals.vercel-insights.com https://cdn.sanity.io https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: http: https://*.google.com https://*.googleadservices.com https://*.g.doubleclick.net; " +
      "connect-src 'self' https://sqjqirkrcfczypxygdtm.supabase.co https://*.supabase.co https://api.coingecko.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://cdn.sanity.io https://www.googletagmanager.com https://*.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://*.googleadservices.com https://*.g.doubleclick.net https://*.doubleclick.net https://*.adtrafficquality.google https://ep1.adtrafficquality.google wss://*.supabase.co; " +
      "frame-src 'self' https://www.googletagmanager.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://*.g.doubleclick.net https://*.doubleclick.net https://*.googleadservices.com https://pagead2.googlesyndication.com https://*.googlesyndication.com; " +
      "frame-ancestors 'none';"
  }
  
  response.headers.set('Content-Security-Policy', cspPolicy)
  
  // CORS Headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}