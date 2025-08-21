/**
 * ENTERPRISE-LEVEL ENVIRONMENT VARIABLE MANAGEMENT
 * 
 * This utility provides robust environment variable loading and validation
 * with graceful degradation and detailed error reporting.
 */

// Environment variable validation interface
interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  COINGECKO_API_KEY?: string;
  MORALIS_API_KEY?: string;
  SANITY_PROJECT_ID?: string;
  NODE_ENV: string;
}

// Environment variable validation with detailed error reporting
export function validateEnvironmentVariables(): EnvConfig {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }

  if (!supabaseKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
  }

  // Optional environment variables with warnings
  const coingeckoKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const moralisKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
  const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  if (!coingeckoKey) {
    warnings.push('NEXT_PUBLIC_COINGECKO_API_KEY is not configured - CoinGecko features will be limited');
  }

  if (!moralisKey) {
    warnings.push('NEXT_PUBLIC_MORALIS_API_KEY is not configured - Moralis features will be limited');
  }

  if (!sanityProjectId) {
    warnings.push('NEXT_PUBLIC_SANITY_PROJECT_ID is not configured - Sanity CMS features will be limited');
  }

  // Log validation results
  if (errors.length > 0) {
    console.error('🔴 CRITICAL ENVIRONMENT VARIABLE ERRORS:');
    errors.forEach(error => console.error(`   ❌ ${error}`));
  }

  if (warnings.length > 0) {
    console.warn('🟡 ENVIRONMENT VARIABLE WARNINGS:');
    warnings.forEach(warning => console.warn(`   ⚠️ ${warning}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All environment variables are properly configured');
  }

  // Return configuration object
  return {
    SUPABASE_URL: supabaseUrl || '',
    SUPABASE_ANON_KEY: supabaseKey || '',
    COINGECKO_API_KEY: coingeckoKey,
    MORALIS_API_KEY: moralisKey,
    SANITY_PROJECT_ID: sanityProjectId,
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
}

// Get environment variable with fallback
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    console.warn(`⚠️ Environment variable ${key} is not configured`);
  }
  return value || fallback || '';
}

// Check if running in production
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

// Check if running in development
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// Get production domain with fallback
export function getProductionDomain(): string {
  return process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 
         'https://belugagithubv2025machineloopscorpsf-gold.vercel.app';
}

// Get development domain with fallback
export function getDevelopmentDomain(): string {
  return process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN || 
         'http://localhost:3000';
}

// Get current domain based on environment
export function getCurrentDomain(): string {
  // During static generation and SSR, always use environment-based fallbacks
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      return getProductionDomain();
    } else {
      return getDevelopmentDomain();
    }
  }
  
  // Only access window.location in browser environment
  try {
    if (window.location && window.location.origin) {
      return window.location.origin;
    }
  } catch (error) {
    console.warn('Failed to access window.location, using fallback domain');
  }
  
  // Fallback for any browser environment issues
  if (process.env.NODE_ENV === 'production') {
    return getProductionDomain();
  } else {
    return getDevelopmentDomain();
  }
}

// Validate Supabase configuration specifically
export function validateSupabaseConfig(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('🔴 Supabase configuration is incomplete:');
    console.error(`   URL: ${supabaseUrl ? '✅ Configured' : '❌ Missing'}`);
    console.error(`   Key: ${supabaseKey ? '✅ Configured' : '❌ Missing'}`);
    return false;
  }

  console.log('✅ Supabase configuration is valid');
  return true;
}
