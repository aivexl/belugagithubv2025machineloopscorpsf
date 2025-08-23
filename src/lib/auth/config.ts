/**
 * Production Auth Configuration
 * CTO Level - Environment-aware Configuration
 */

export const AUTH_CONFIG = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pedasqlddhrqvbvbwdlzge.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZGFzcWxkZGhycXZidmJ3ZGx6Z2UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjM3OTMwOCwiZXhwIjoyMDMxOTU1MzA4fQ.K4d8bRhCNTRXo-KJdpS3zG8nFkz1Hg2Rb4f3XQi8Vho',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },

  // Session Configuration
  session: {
    duration: 30 * 24 * 60 * 60 * 1000, // 30 days
    extendOnActivity: true,
    activityThreshold: 60 * 1000, // 1 minute
    storageKey: 'beluga-auth'
  },

  // Retry Configuration
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000
  },

  // Production Settings
  production: {
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    enableDebugLogs: process.env.NODE_ENV !== 'production',
    enableRetry: true,
    enableFallback: true
  }
}

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'

export default AUTH_CONFIG
