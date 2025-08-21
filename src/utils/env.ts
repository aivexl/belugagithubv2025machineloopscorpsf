// ENTERPRISE-LEVEL: Environment Utility Functions
// Provides environment validation and domain detection for authentication

/**
 * Validates Supabase configuration
 * @returns boolean indicating if configuration is valid
 */
export function validateSupabaseConfig(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('🔴 ENTERPRISE ALERT: Missing Supabase environment variables');
    return false;
  }
  
  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch {
    console.warn('🔴 ENTERPRISE ALERT: Invalid Supabase URL format');
    return false;
  }
  
  // Validate key format (should be a JWT-like string)
  if (supabaseAnonKey.length < 50) {
    console.warn('🔴 ENTERPRISE ALERT: Invalid Supabase anon key format');
    return false;
  }
  
  return true;
}

/**
 * Gets the current domain for authentication redirects
 * @returns string representing the current domain
 */
export function getCurrentDomain(): string {
  // In browser environment
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  }
  
  // In server environment
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Production fallback
  return 'https://your-domain.com';
}

/**
 * Initializes environment configuration
 * Logs configuration status for debugging
 */
export function initializeEnvironment(): void {
  console.log('🌍 ENTERPRISE: Initializing environment configuration');
  
  // Log environment variables status
  const envVars = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing',
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✅ Configured' : '❌ Missing',
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET ? '✅ Configured' : '❌ Missing',
  };
  
  console.table(envVars);
  
  // Validate critical configuration
  if (validateSupabaseConfig()) {
    console.log('✅ ENTERPRISE: Supabase configuration validated successfully');
  } else {
    console.warn('⚠️ ENTERPRISE: Supabase configuration issues detected');
  }
  
  // Log current domain
  console.log('🌐 ENTERPRISE: Current domain:', getCurrentDomain());
}

/**
 * Gets environment variable with fallback
 * @param key - Environment variable key
 * @param fallback - Fallback value if key is not set
 * @returns string value or fallback
 */
export function getEnvVar(key: string, fallback: string = ''): string {
  return process.env[key] || fallback;
}

/**
 * Checks if running in production environment
 * @returns boolean indicating production status
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' || 
         process.env.NEXT_PUBLIC_APP_ENV === 'production';
}

/**
 * Checks if running in development environment
 * @returns boolean indicating development status
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_APP_ENV === 'development';
}

/**
 * Gets the appropriate API base URL based on environment
 * @returns string representing the API base URL
 */
export function getApiBaseUrl(): string {
  if (isProduction()) {
    return process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com';
  }
  
  return 'http://localhost:3000';
}

/**
 * Validates all required environment variables
 * @returns object with validation results
 */
export function validateAllEnvironmentVariables(): {
  isValid: boolean;
  missing: string[];
  warnings: string[];
} {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const optional = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'NEXT_PUBLIC_APP_URL',
  ];
  
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Check required variables
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  // Check optional variables
  for (const key of optional) {
    if (!process.env[key]) {
      warnings.push(key);
    }
  }
  
  const isValid = missing.length === 0;
  
  return {
    isValid,
    missing,
    warnings
  };
}
