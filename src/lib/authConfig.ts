// =============================================================================
// ENTERPRISE AUTHENTICATION CONFIGURATION
// =============================================================================

export const AUTH_CONFIG = {
  // Supabase Configuration
  SUPABASE: {
    URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Domain Configuration
  DOMAINS: {
    PRODUCTION: process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 'https://belugagithubv2025machineloopscorpsf-gold.vercel.app',
    DEVELOPMENT: process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN || 'http://localhost:3000',
    CURRENT: process.env.NODE_ENV === 'production' 
      ? (process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 'https://belugagithubv2025machineloopscorpsf-gold.vercel.app')
      : (process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN || 'http://localhost:3000')
  },

  // Security Configuration
  SECURITY: {
    SESSION_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    PASSWORD_MIN_LENGTH: 8,
    RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
    RATE_LIMIT_MAX_REQUESTS: 10,
    PASSWORD_RESET_LIMIT: 3,
    PASSWORD_RESET_WINDOW: 60 * 60 * 1000, // 1 hour
  },

  // OAuth Configuration
  OAUTH: {
    GOOGLE: {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      ENABLED: !!process.env.GOOGLE_CLIENT_ID,
    },
    PROVIDERS: ['google'] as const,
  },

  // Feature Flags
  FEATURES: {
    ENABLE_BIOMETRIC_AUTH: process.env.NEXT_PUBLIC_ENABLE_BIOMETRIC_AUTH === 'true',
    ENABLE_2FA: process.env.NEXT_PUBLIC_ENABLE_2FA === 'true',
    ENABLE_SOCIAL_LOGIN: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN !== 'false',
    ENABLE_DEBUG_MODE: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
  },

  // Environment
  ENV: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  },

  // URLs
  URLS: {
    AUTH_CALLBACK: '/auth/callback',
    AUTH_RESET_PASSWORD: '/auth/reset-password',
    AUTH_LOGIN: '/auth/login',
    AUTH_SIGNUP: '/auth/signup',
  },

  // CORS Configuration
  CORS: {
    ALLOWED_ORIGINS: process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://belugagithubv2025machineloopscorpsf-gold.vercel.app'
    ],
    MAX_AGE: parseInt(process.env.CORS_MAX_AGE || '86400'),
  },

  // Monitoring
  MONITORING: {
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    ENABLE_PERFORMANCE_MONITORING: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== 'false',
  },
};

// Validation functions
export const validateAuthConfig = () => {
  const errors: string[] = [];

  if (!AUTH_CONFIG.SUPABASE.URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required');
  }

  if (!AUTH_CONFIG.SUPABASE.ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  }

  if (AUTH_CONFIG.ENV.IS_PRODUCTION && !AUTH_CONFIG.SUPABASE.SERVICE_ROLE_KEY) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is required in production');
  }

  if (AUTH_CONFIG.ENV.IS_PRODUCTION && !AUTH_CONFIG.DOMAINS.PRODUCTION.includes('https://')) {
    errors.push('Production domain must use HTTPS');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper functions
export const getAuthRedirectUrl = (path: string = '') => {
  const baseUrl = AUTH_CONFIG.DOMAINS.CURRENT;
  return `${baseUrl}${path}`;
};

export const getSupabaseConfig = () => {
  const validation = validateAuthConfig();
  if (!validation.isValid) {
    console.error('Auth configuration validation failed:', validation.errors);
    throw new Error('Invalid authentication configuration');
  }

  return {
    url: AUTH_CONFIG.SUPABASE.URL!,
    anonKey: AUTH_CONFIG.SUPABASE.ANON_KEY!,
    serviceRoleKey: AUTH_CONFIG.SUPABASE.SERVICE_ROLE_KEY,
  };
};

export const isProduction = () => AUTH_CONFIG.ENV.IS_PRODUCTION;
export const isDevelopment = () => AUTH_CONFIG.ENV.IS_DEVELOPMENT;

// Export for use in other files
export default AUTH_CONFIG;
