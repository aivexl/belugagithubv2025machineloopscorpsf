// ENTERPRISE-LEVEL ENVIRONMENT CONFIGURATION UTILITY
// Provides robust environment variable validation and domain detection

// Enterprise-level environment variable validation
export function validateSupabaseConfig(): boolean {
  try {
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missingVars = requiredVars.filter(varName => {
      const value = process.env[varName];
      return !value || value.trim() === '';
    });

    if (missingVars.length > 0) {
      console.warn('🔴 ENTERPRISE ALERT: Missing required environment variables:', missingVars);
      return false;
    }

    // Validate URL format
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !isValidUrl(supabaseUrl)) {
      console.warn('🔴 ENTERPRISE ALERT: Invalid Supabase URL format:', supabaseUrl);
      return false;
    }

    // Validate key format (basic check)
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (anonKey && !anonKey.startsWith('eyJ')) {
      console.warn('🔴 ENTERPRISE ALERT: Invalid Supabase anon key format');
      return false;
    }

    return true;
  } catch (error) {
    console.warn('🔴 ENTERPRISE ALERT: Environment validation failed:', error);
    return false;
  }
}

// Enterprise-level domain detection for production deployment
export function getCurrentDomain(): string {
  try {
    // Development environment
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }

    // Vercel deployment
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    // Custom domain
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }

    // Fallback to window.location (client-side only)
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const host = window.location.host;
      return `${protocol}//${host}`;
    }

    // Default fallback
    return 'https://your-domain.com';
  } catch (error) {
    console.warn('🔴 ENTERPRISE ALERT: Domain detection failed:', error);
    return 'https://your-domain.com';
  }
}

// Enterprise-level URL validation
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Enterprise-level environment variable getter with fallbacks
export function getEnvVar(key: string, fallback?: string): string {
  try {
    const value = process.env[key];
    
    if (!value || value.trim() === '') {
      if (fallback) {
        console.warn(`⚠️ Environment variable ${key} not set, using fallback: ${fallback}`);
        return fallback;
      }
      console.warn(`🔴 ENTERPRISE ALERT: Required environment variable ${key} not set`);
      return '';
    }
    
    return value;
  } catch (error) {
    console.warn(`🔴 ENTERPRISE ALERT: Failed to get environment variable ${key}:`, error);
    return fallback || '';
  }
}

// Enterprise-level environment configuration object
export const ENV_CONFIG = {
  SUPABASE: {
    URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    ANON_KEY: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    SERVICE_ROLE_KEY: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  },
  APP: {
    ENV: process.env.NODE_ENV || 'development',
    URL: getCurrentDomain(),
    DEBUG: process.env.NODE_ENV === 'development',
  },
  AUTH: {
    ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED !== 'false',
    MAX_LOGIN_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_MAX_LOGIN_ATTEMPTS || '5'),
    LOCKOUT_DURATION: parseInt(process.env.NEXT_PUBLIC_LOCKOUT_DURATION || '900000'),
    SESSION_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '3600000'),
  },
  GOOGLE: {
    CLIENT_ID: getEnvVar('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
  }
};

// Enterprise-level environment health check
export function checkEnvironmentHealth(): {
  healthy: boolean;
  issues: string[];
  recommendations: string[];
} {
  try {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check Supabase configuration
    if (!validateSupabaseConfig()) {
      issues.push('Supabase environment variables not configured');
      recommendations.push('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment');
    }

    // Check for development environment
    if (process.env.NODE_ENV === 'development') {
      recommendations.push('Ensure .env.local file exists with required variables');
    }

    // Check for production environment
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_APP_URL) {
        issues.push('Production domain not configured');
        recommendations.push('Set VERCEL_URL or NEXT_PUBLIC_APP_URL for production deployment');
      }
    }

    // Check for security best practices
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEBUG === 'true') {
      issues.push('Debug mode enabled in production');
      recommendations.push('Disable debug mode in production for security');
    }

    return {
      healthy: issues.length === 0,
      issues,
      recommendations
    };
  } catch (error) {
    console.warn('🔴 ENTERPRISE ALERT: Environment health check failed:', error);
    return {
      healthy: false,
      issues: ['Environment health check failed'],
      recommendations: ['Check console for detailed error information']
    };
  }
}

// Enterprise-level environment initialization
export function initializeEnvironment(): void {
  try {
    console.log('🚀 Initializing enterprise environment configuration...');
    
    const health = checkEnvironmentHealth();
    
    if (health.healthy) {
      console.log('✅ Environment configuration is healthy');
    } else {
      console.warn('🔴 Environment configuration issues detected:');
      health.issues.forEach(issue => console.warn(`   - ${issue}`));
      console.log('📋 Recommendations:');
      health.recommendations.forEach(rec => console.log(`   - ${rec}`));
    }
    
    // Log configuration summary (without sensitive data)
    console.log('📊 Environment Summary:');
    console.log(`   - Environment: ${ENV_CONFIG.APP.ENV}`);
    console.log(`   - Domain: ${ENV_CONFIG.APP.URL}`);
    console.log(`   - Auth Enabled: ${ENV_CONFIG.AUTH.ENABLED}`);
    console.log(`   - Supabase Configured: ${validateSupabaseConfig()}`);
  } catch (error) {
    console.warn('🔴 ENTERPRISE ALERT: Environment initialization failed:', error);
  }
}
