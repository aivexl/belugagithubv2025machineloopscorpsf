import { NextResponse } from 'next/server';
import { AUTH_CONFIG, validateAuthConfig } from '@/lib/authConfig';
import { validateProductionEnvironment } from '@/lib/authUtils';

export async function GET() {
  try {
    // Check authentication configuration
    const configValidation = validateAuthConfig();
    const productionValidation = validateProductionEnvironment();
    
    // Check Supabase connectivity
    let supabaseStatus = 'unknown';
    let supabaseError = null;
    
    if (AUTH_CONFIG.SUPABASE.URL && AUTH_CONFIG.SUPABASE.ANON_KEY) {
      try {
        // Simple connectivity test
        const response = await fetch(`${AUTH_CONFIG.SUPABASE.URL}/rest/v1/`, {
          headers: {
            'apikey': AUTH_CONFIG.SUPABASE.ANON_KEY,
            'Authorization': `Bearer ${AUTH_CONFIG.SUPABASE.ANON_KEY}`,
          },
        });
        
        if (response.ok) {
          supabaseStatus = 'connected';
        } else {
          supabaseStatus = 'error';
          supabaseError = `HTTP ${response.status}: ${response.statusText}`;
        }
      } catch (error) {
        supabaseStatus = 'error';
        supabaseError = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    // Compile health status
    const healthStatus = {
      timestamp: new Date().toISOString(),
      environment: AUTH_CONFIG.ENV.NODE_ENV,
      appEnv: AUTH_CONFIG.ENV.APP_ENV,
      isProduction: AUTH_CONFIG.ENV.IS_PRODUCTION,
      
      // Configuration status
      config: {
        isValid: configValidation.isValid,
        errors: configValidation.errors,
        warnings: [],
      },
      
      // Production validation
      production: {
        isValid: productionValidation.isValid,
        errors: productionValidation.errors,
        warnings: productionValidation.warnings,
      },
      
      // Supabase status
      supabase: {
        status: supabaseStatus,
        url: AUTH_CONFIG.SUPABASE.URL ? 'configured' : 'missing',
        anonKey: AUTH_CONFIG.SUPABASE.ANON_KEY ? 'configured' : 'missing',
        serviceRoleKey: AUTH_CONFIG.SUPABASE.SERVICE_ROLE_KEY ? 'configured' : 'missing',
        error: supabaseError,
      },
      
      // OAuth status
      oauth: {
        google: {
          enabled: AUTH_CONFIG.OAUTH.GOOGLE.ENABLED,
          clientId: AUTH_CONFIG.OAUTH.GOOGLE.CLIENT_ID ? 'configured' : 'missing',
          clientSecret: AUTH_CONFIG.OAUTH.GOOGLE.CLIENT_SECRET ? 'configured' : 'missing',
        },
      },
      
      // Domain configuration
      domains: {
        production: AUTH_CONFIG.DOMAINS.PRODUCTION,
        development: AUTH_CONFIG.DOMAINS.DEVELOPMENT,
        current: AUTH_CONFIG.DOMAINS.CURRENT,
        isHttps: AUTH_CONFIG.DOMAINS.CURRENT.startsWith('https://'),
      },
      
      // Security settings
      security: {
        rateLimiting: {
          enabled: true,
          maxLoginAttempts: AUTH_CONFIG.SECURITY.MAX_LOGIN_ATTEMPTS,
          lockoutDuration: AUTH_CONFIG.SECURITY.LOCKOUT_DURATION,
          rateLimitWindow: AUTH_CONFIG.SECURITY.RATE_LIMIT_WINDOW,
        },
        password: {
          minLength: AUTH_CONFIG.SECURITY.PASSWORD_MIN_LENGTH,
          strengthValidation: true,
        },
        session: {
          refreshThreshold: AUTH_CONFIG.SECURITY.SESSION_REFRESH_THRESHOLD,
          autoRefresh: true,
        },
      },
      
      // Feature flags
      features: {
        biometricAuth: AUTH_CONFIG.FEATURES.ENABLE_BIOMETRIC_AUTH,
        twoFactorAuth: AUTH_CONFIG.FEATURES.ENABLE_2FA,
        socialLogin: AUTH_CONFIG.FEATURES.ENABLE_SOCIAL_LOGIN,
        debugMode: AUTH_CONFIG.FEATURES.ENABLE_DEBUG_MODE,
        performanceMonitoring: AUTH_CONFIG.MONITORING.ENABLE_PERFORMANCE_MONITORING,
      },
      
      // Monitoring
      monitoring: {
        sentry: AUTH_CONFIG.MONITORING.SENTRY_DSN ? 'configured' : 'missing',
        googleAnalytics: AUTH_CONFIG.MONITORING.GA_MEASUREMENT_ID ? 'configured' : 'missing',
        performanceMonitoring: AUTH_CONFIG.MONITORING.ENABLE_PERFORMANCE_MONITORING,
      },
      
      // Overall health
      overall: {
        status: configValidation.isValid && productionValidation.isValid && supabaseStatus === 'connected' ? 'healthy' : 'unhealthy',
        score: calculateHealthScore(configValidation, productionValidation, supabaseStatus),
        recommendations: generateRecommendations(configValidation, productionValidation, supabaseStatus),
      },
    };

    // Return appropriate HTTP status
    const isHealthy = healthStatus.overall.status === 'healthy';
    const statusCode = isHealthy ? 200 : 503; // 503 Service Unavailable if unhealthy

    return NextResponse.json(healthStatus, { status: statusCode });
    
  } catch (error) {
    console.error('Auth health check error:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 'error',
    }, { status: 500 });
  }
}

// Calculate health score (0-100)
function calculateHealthScore(
  configValidation: { isValid: boolean; errors: string[] },
  productionValidation: { isValid: boolean; errors: string[]; warnings: string[] },
  supabaseStatus: string
): number {
  let score = 100;
  
  // Configuration errors (-20 each)
  score -= configValidation.errors.length * 20;
  
  // Production errors (-15 each)
  score -= productionValidation.errors.length * 15;
  
  // Production warnings (-5 each)
  score -= productionValidation.warnings.length * 5;
  
  // Supabase status
  if (supabaseStatus === 'error') score -= 30;
  if (supabaseStatus === 'unknown') score -= 20;
  
  return Math.max(0, score);
}

// Generate recommendations for improvement
function generateRecommendations(
  configValidation: { isValid: boolean; errors: string[] },
  productionValidation: { isValid: boolean; errors: string[]; warnings: string[] },
  supabaseStatus: string
): string[] {
  const recommendations: string[] = [];
  
  if (!configValidation.isValid) {
    recommendations.push('Fix configuration errors to enable authentication');
  }
  
  if (!productionValidation.isValid) {
    recommendations.push('Resolve production environment issues for deployment');
  }
  
  if (supabaseStatus === 'error') {
    recommendations.push('Check Supabase connectivity and credentials');
  }
  
  if (supabaseStatus === 'unknown') {
    recommendations.push('Configure Supabase environment variables');
  }
  
  if (productionValidation.warnings.length > 0) {
    recommendations.push('Address production warnings for optimal performance');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Authentication system is healthy and ready for production');
  }
  
  return recommendations;
}
