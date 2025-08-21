/**
 * ENTERPRISE-LEVEL ENVIRONMENT CONFIGURATION UTILITY
 * Provides robust environment variable management with graceful degradation
 */

// Environment variable validation
export function validateSupabaseConfig(): boolean {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!hasUrl || !hasKey) {
    console.warn('🔴 ENTERPRISE ALERT: Supabase environment variables not configured');
    console.warn('📋 Required variables:');
    console.warn('   - NEXT_PUBLIC_SUPABASE_URL:', hasUrl ? '✅ Configured' : '❌ Missing');
    console.warn('   - NEXT_PUBLIC_SUPABASE_ANON_KEY:', hasKey ? '✅ Configured' : '❌ Missing');
    return false;
  }
  
  return true;
}

// Get current domain for environment-specific configuration
export function getCurrentDomain(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side fallback
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

// Initialize environment configuration
export function initializeEnvironment(): void {
  console.log('🌐 Initializing enterprise environment configuration...');
  
  // Log environment status
  const envStatus = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing',
    SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing',
    SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✅ Configured' : '❌ Missing',
    COINGECKO_API_KEY: process.env.NEXT_PUBLIC_COINGECKO_API_KEY ? '✅ Configured' : '❌ Missing',
  };
  
  console.table(envStatus);
  
  // Environment-specific warnings
  if (process.env.NODE_ENV === 'production') {
    if (!validateSupabaseConfig()) {
      console.error('🚨 CRITICAL: Production environment missing Supabase configuration');
      console.error('🔧 Please configure environment variables in your deployment platform');
    }
  }
}

// Get environment variable with fallback
export function getEnvVar(key: string, fallback?: string): string | undefined {
  const value = process.env[key];
  
  if (!value && fallback) {
    console.warn(`⚠️ Environment variable ${key} not found, using fallback: ${fallback}`);
    return fallback;
  }
  
  return value;
}

// Validate required environment variables
export function validateRequiredEnvVars(required: string[]): boolean {
  const missing: string[] = [];
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    return false;
  }
  
  return true;
}

// Environment configuration object
export const ENV_CONFIG = {
  SUPABASE: {
    URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  SANITY: {
    PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx',
    DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-20',
    API_TOKEN: process.env.SANITY_API_TOKEN,
  },
  COINGECKO: {
    API_KEY: process.env.NEXT_PUBLIC_COINGECKO_API_KEY || process.env.COINGECKO_API_KEY,
  },
  APP: {
    ENV: process.env.NODE_ENV || 'development',
    URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
} as const;
