// =============================================================================
// ENTERPRISE AUTHENTICATION UTILITIES
// =============================================================================

import { AUTH_CONFIG, isProduction } from './authConfig';

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    common: boolean;
  };
} => {
  const feedback: string[] = [];
  const requirements = {
    length: password.length >= AUTH_CONFIG.SECURITY.PASSWORD_MIN_LENGTH,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    common: true,
  };

  // Check for common weak passwords
  const weakPasswords = [
    'password', '123456', 'qwerty', 'admin', 'user', 'letmein',
    'welcome', 'monkey', 'dragon', 'master', 'hello', 'freedom',
    'whatever', 'qazwsx', 'trustno1', 'jordan', 'jennifer',
    'zxcvbnm', 'asdfgh', 'hunter', 'buster', 'soccer', 'harley',
    'batman', 'andrew', 'tigger', 'shadow', 'jessica', 'asshole',
    'matrix', 'falcon', 'dallas', 'maggie', 'hammertime'
  ];

  if (weakPasswords.includes(password.toLowerCase())) {
    requirements.common = false;
    feedback.push('Password is too common. Please choose a unique password.');
  }

  // Generate feedback
  if (!requirements.length) {
    feedback.push(`Password must be at least ${AUTH_CONFIG.SECURITY.PASSWORD_MIN_LENGTH} characters long.`);
  }
  if (!requirements.uppercase) {
    feedback.push('Password must contain at least one uppercase letter.');
  }
  if (!requirements.lowercase) {
    feedback.push('Password must contain at least one lowercase letter.');
  }
  if (!requirements.numbers) {
    feedback.push('Password must contain at least one number.');
  }
  if (!requirements.symbols) {
    feedback.push('Password must contain at least one special character.');
  }

  // Calculate strength score (0-5)
  const score = Object.values(requirements).filter(Boolean).length;
  const isValid = score >= 4 && requirements.length;

  return {
    isValid,
    score,
    feedback,
    requirements,
  };
};

// Rate limiting utilities
export class ProductionRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number; lockoutUntil?: number }> = new Map();

  isAllowed(identifier: string, action: 'login' | 'signup' | 'reset' | 'oauth'): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);
    
    // Check if account is locked
    if (attempt?.lockoutUntil && now < attempt.lockoutUntil) {
      return false;
    }

    // Reset if window has passed
    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, { 
        count: 1, 
        resetTime: now + AUTH_CONFIG.SECURITY.RATE_LIMIT_WINDOW 
      });
      return true;
    }

    // Check limits based on action
    const maxAttempts = this.getMaxAttempts(action);
    if (attempt.count >= maxAttempts) {
      // Lock account if it's a login attempt
      if (action === 'login') {
        attempt.lockoutUntil = now + AUTH_CONFIG.SECURITY.LOCKOUT_DURATION;
      }
      return false;
    }

    attempt.count++;
    return true;
  }

  private getMaxAttempts(action: 'login' | 'signup' | 'reset' | 'oauth'): number {
    switch (action) {
      case 'login':
        return AUTH_CONFIG.SECURITY.MAX_LOGIN_ATTEMPTS;
      case 'signup':
        return AUTH_CONFIG.SECURITY.RATE_LIMIT_MAX_REQUESTS;
      case 'reset':
        return AUTH_CONFIG.SECURITY.PASSWORD_RESET_LIMIT;
      case 'oauth':
        return 3; // OAuth attempts
      default:
        return AUTH_CONFIG.SECURITY.RATE_LIMIT_MAX_REQUESTS;
    }
  }

  getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return this.getMaxAttempts('login');
    
    const maxAttempts = this.getMaxAttempts('login');
    return Math.max(0, maxAttempts - attempt.count);
  }

  getLockoutTime(identifier: string): number | null {
    const attempt = this.attempts.get(identifier);
    if (!attempt?.lockoutUntil) return null;
    
    const now = Date.now();
    return attempt.lockoutUntil > now ? attempt.lockoutUntil - now : null;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [identifier, attempt] of this.attempts.entries()) {
      if (now > attempt.resetTime && (!attempt.lockoutUntil || now > attempt.lockoutUntil)) {
        this.attempts.delete(identifier);
      }
    }
  }
}

// Session management utilities
export const createSecureSession = (userData: any) => {
  return {
    ...userData,
    sessionId: generateSecureId(),
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    ipAddress: 'client-side', // Will be captured server-side
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server-side',
    environment: AUTH_CONFIG.ENV.NODE_ENV,
  };
};

export const generateSecureId = (): string => {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Production environment checks
export const validateProductionEnvironment = (): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} => {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!isProduction()) {
    return { isValid: true, warnings: [], errors: [] };
  }

  // Check required production variables
  if (!AUTH_CONFIG.SUPABASE.SERVICE_ROLE_KEY) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is required in production');
  }

  if (!AUTH_CONFIG.DOMAINS.PRODUCTION.includes('https://')) {
    errors.push('Production domain must use HTTPS');
  }

  // Check security settings
  if (AUTH_CONFIG.FEATURES.ENABLE_DEBUG_MODE) {
    warnings.push('Debug mode should be disabled in production');
  }

  if (!AUTH_CONFIG.MONITORING.SENTRY_DSN) {
    warnings.push('Sentry DSN recommended for production error tracking');
  }

  // Check OAuth configuration
  if (AUTH_CONFIG.OAUTH.GOOGLE.ENABLED && !AUTH_CONFIG.OAUTH.GOOGLE.CLIENT_ID) {
    errors.push('Google OAuth enabled but CLIENT_ID not configured');
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

// URL validation and sanitization
export const validateRedirectUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    
    // Check if URL is in allowed origins
    const allowedOrigins = AUTH_CONFIG.CORS.ALLOWED_ORIGINS;
    const isAllowed = allowedOrigins.some(origin => {
      try {
        const originUrl = new URL(origin);
        return originUrl.origin === parsedUrl.origin;
      } catch {
        return false;
      }
    });

    if (!isAllowed) {
      console.warn('Redirect URL not in allowed origins:', url);
      return false;
    }

    // Check for HTTPS in production
    if (isProduction() && parsedUrl.protocol !== 'https:') {
      console.warn('Non-HTTPS URL not allowed in production:', url);
      return false;
    }

    return true;
  } catch {
    console.warn('Invalid redirect URL:', url);
    return false;
  }
};

// Authentication flow validation
export const validateAuthFlow = (flow: 'signup' | 'login' | 'oauth' | 'reset'): {
  isValid: boolean;
  message: string;
} => {
  // Check if Supabase is configured
  if (!AUTH_CONFIG.SUPABASE.URL || !AUTH_CONFIG.SUPABASE.ANON_KEY) {
    return {
      isValid: false,
      message: 'Authentication service not configured',
    };
  }

  // Check if OAuth is enabled for OAuth flows
  if (flow === 'oauth' && !AUTH_CONFIG.OAUTH.GOOGLE.ENABLED) {
    return {
      isValid: false,
      message: 'OAuth authentication not enabled',
    };
  }

  // Check production environment
  if (isProduction()) {
    const productionCheck = validateProductionEnvironment();
    if (!productionCheck.isValid) {
      return {
        isValid: false,
        message: `Production environment validation failed: ${productionCheck.errors.join(', ')}`,
      };
    }
  }

  return {
    isValid: true,
    message: 'Authentication flow is valid',
  };
};

// Export utilities
export default {
  validatePasswordStrength,
  ProductionRateLimiter,
  createSecureSession,
  generateSecureId,
  validateProductionEnvironment,
  validateRedirectUrl,
  validateAuthFlow,
};
