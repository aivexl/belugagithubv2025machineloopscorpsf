// =============================================================================
// ENTERPRISE ERROR HANDLER
// Fortune 500 & Unicorn Startup Level Implementation
// Comprehensive Error Handling & Recovery System
// =============================================================================

import type { AuthError } from '@supabase/supabase-js';

// =========================================================================
// ERROR CLASSIFICATION SYSTEM
// =========================================================================

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NETWORK = 'network',
  SESSION = 'session',
  VALIDATION = 'validation',
  SYSTEM = 'system',
  RATE_LIMIT = 'rate_limit',
  SECURITY = 'security',
}

export enum ErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
  WEAK_PASSWORD = 'weak_password',
  SIGNUP_DISABLED = 'signup_disabled',
  
  // Session errors
  SESSION_EXPIRED = 'session_expired',
  SESSION_INVALID = 'session_invalid',
  TOKEN_REFRESH_FAILED = 'token_refresh_failed',
  SESSION_NOT_FOUND = 'session_not_found',
  
  // Network errors
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  SERVICE_UNAVAILABLE = 'service_unavailable',
  
  // Rate limiting
  TOO_MANY_REQUESTS = 'too_many_requests',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  
  // Security errors
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  ACCOUNT_LOCKED = 'account_locked',
  INVALID_TOKEN = 'invalid_token',
  
  // System errors
  UNKNOWN_ERROR = 'unknown_error',
  CONFIGURATION_ERROR = 'configuration_error',
  SERVICE_ERROR = 'service_error',
}

interface ErrorDetails {
  code: ErrorCode;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  recoverable: boolean;
  retryable: boolean;
  suggestedAction?: string;
  metadata?: Record<string, any>;
}

interface ErrorContext {
  operation: string;
  timestamp: number;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  additionalData?: Record<string, any>;
}

interface RecoveryStrategy {
  immediate: (() => Promise<boolean>) | null;
  delayed: (() => Promise<boolean>) | null;
  fallback: (() => Promise<boolean>) | null;
  retryDelay: number;
  maxRetries: number;
}

// =========================================================================
// ERROR MAPPING CONFIGURATION
// =========================================================================

const ERROR_MAPPING: Record<string, ErrorDetails> = {
  // Supabase auth errors
  'Invalid login credentials': {
    code: ErrorCode.INVALID_CREDENTIALS,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    message: 'Invalid email or password provided',
    userMessage: 'Please check your email and password and try again.',
    recoverable: true,
    retryable: true,
    suggestedAction: 'Verify credentials or reset password',
  },
  
  'Email not confirmed': {
    code: ErrorCode.EMAIL_NOT_CONFIRMED,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    message: 'Email address has not been confirmed',
    userMessage: 'Please check your email and click the confirmation link.',
    recoverable: true,
    retryable: false,
    suggestedAction: 'Check email for confirmation link',
  },
  
  'User not found': {
    code: ErrorCode.USER_NOT_FOUND,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    message: 'User account does not exist',
    userMessage: 'No account found with this email address.',
    recoverable: true,
    retryable: false,
    suggestedAction: 'Check email address or create new account',
  },
  
  'Password should be at least 6 characters': {
    code: ErrorCode.WEAK_PASSWORD,
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    message: 'Password does not meet security requirements',
    userMessage: 'Password must be at least 6 characters long.',
    recoverable: true,
    retryable: true,
    suggestedAction: 'Choose a stronger password',
  },
  
  'Signups not allowed for this instance': {
    code: ErrorCode.SIGNUP_DISABLED,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.HIGH,
    message: 'User registration is currently disabled',
    userMessage: 'New account creation is temporarily unavailable.',
    recoverable: false,
    retryable: false,
    suggestedAction: 'Contact support for assistance',
  },
  
  'JWT expired': {
    code: ErrorCode.SESSION_EXPIRED,
    category: ErrorCategory.SESSION,
    severity: ErrorSeverity.MEDIUM,
    message: 'Authentication token has expired',
    userMessage: 'Your session has expired. Please sign in again.',
    recoverable: true,
    retryable: false,
    suggestedAction: 'Sign in again',
  },
  
  'Invalid JWT': {
    code: ErrorCode.INVALID_TOKEN,
    category: ErrorCategory.SECURITY,
    severity: ErrorSeverity.HIGH,
    message: 'Authentication token is invalid',
    userMessage: 'Authentication error. Please sign in again.',
    recoverable: true,
    retryable: false,
    suggestedAction: 'Sign in again',
  },
  
  'Too many requests': {
    code: ErrorCode.TOO_MANY_REQUESTS,
    category: ErrorCategory.RATE_LIMIT,
    severity: ErrorSeverity.MEDIUM,
    message: 'Rate limit exceeded',
    userMessage: 'Too many attempts. Please wait a moment and try again.',
    recoverable: true,
    retryable: true,
    suggestedAction: 'Wait before retrying',
  },
  
  // Network errors
  'Failed to fetch': {
    code: ErrorCode.NETWORK_ERROR,
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    message: 'Network connection failed',
    userMessage: 'Connection error. Please check your internet connection.',
    recoverable: true,
    retryable: true,
    suggestedAction: 'Check internet connection and retry',
  },
  
  'NetworkError': {
    code: ErrorCode.NETWORK_ERROR,
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    message: 'Network request failed',
    userMessage: 'Network error. Please try again.',
    recoverable: true,
    retryable: true,
    suggestedAction: 'Retry operation',
  },
  
  'TimeoutError': {
    code: ErrorCode.TIMEOUT_ERROR,
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    message: 'Request timed out',
    userMessage: 'Request timed out. Please try again.',
    recoverable: true,
    retryable: true,
    suggestedAction: 'Retry operation',
  },
};

// =========================================================================
// ENTERPRISE ERROR HANDLER CLASS
// =========================================================================

class EnterpriseErrorHandler {
  private static instance: EnterpriseErrorHandler;
  private errorLog: Array<{ error: ErrorDetails; context: ErrorContext }> = [];
  private recoveryStrategies: Map<ErrorCode, RecoveryStrategy> = new Map();
  private retryAttempts: Map<string, number> = new Map();
  private rateLimitWindows: Map<string, number> = new Map();

  private constructor() {
    this.setupRecoveryStrategies();
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): EnterpriseErrorHandler {
    if (!EnterpriseErrorHandler.instance) {
      EnterpriseErrorHandler.instance = new EnterpriseErrorHandler();
    }
    return EnterpriseErrorHandler.instance;
  }

  // =========================================================================
  // MAIN ERROR PROCESSING
  // =========================================================================

  async handleError(
    error: Error | AuthError | string,
    context: Partial<ErrorContext> = {}
  ): Promise<{
    errorDetails: ErrorDetails;
    recovered: boolean;
    suggestedAction?: string;
  }> {
    try {
      // Parse and classify the error
      const errorDetails = this.parseError(error);
      
      // Create full context
      const fullContext: ErrorContext = {
        operation: 'unknown',
        timestamp: Date.now(),
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        ...context,
      };

      // Log the error
      this.logError(errorDetails, fullContext);

      // Attempt recovery if possible
      const recovered = await this.attemptRecovery(errorDetails, fullContext);

      // Update metrics
      this.updateErrorMetrics(errorDetails, recovered);

      return {
        errorDetails,
        recovered,
        suggestedAction: errorDetails.suggestedAction,
      };
    } catch (handlerError) {
      console.error('Error handler failed:', handlerError);
      
      // Fallback error details
      const fallbackError: ErrorDetails = {
        code: ErrorCode.UNKNOWN_ERROR,
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.CRITICAL,
        message: 'Error handler failure',
        userMessage: 'An unexpected error occurred. Please try again.',
        recoverable: false,
        retryable: true,
      };

      return {
        errorDetails: fallbackError,
        recovered: false,
      };
    }
  }

  // =========================================================================
  // ERROR PARSING & CLASSIFICATION
  // =========================================================================

  private parseError(error: Error | AuthError | string): ErrorDetails {
    let errorMessage: string;
    let originalError: Error | null = null;

    // Extract error message
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      originalError = error;
    } else {
      errorMessage = 'Unknown error';
    }

    // Check for exact match in error mapping
    let errorDetails = ERROR_MAPPING[errorMessage];

    if (!errorDetails) {
      // Try pattern matching for partial matches
      errorDetails = this.matchErrorPattern(errorMessage);
    }

    if (!errorDetails) {
      // Create default error details
      errorDetails = this.createDefaultErrorDetails(errorMessage, originalError);
    }

    // Add metadata if available
    if (originalError) {
      errorDetails.metadata = {
        ...errorDetails.metadata,
        stack: originalError.stack,
        name: originalError.name,
      };
    }

    return errorDetails;
  }

  private matchErrorPattern(message: string): ErrorDetails | null {
    const lowerMessage = message.toLowerCase();

    // Network related patterns
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
      return {
        code: ErrorCode.NETWORK_ERROR,
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.HIGH,
        message: 'Network error detected',
        userMessage: 'Connection error. Please check your internet connection.',
        recoverable: true,
        retryable: true,
        suggestedAction: 'Check internet connection and retry',
      };
    }

    // Timeout patterns
    if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
      return {
        code: ErrorCode.TIMEOUT_ERROR,
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        message: 'Request timeout detected',
        userMessage: 'Request timed out. Please try again.',
        recoverable: true,
        retryable: true,
        suggestedAction: 'Retry operation',
      };
    }

    // Rate limit patterns
    if (lowerMessage.includes('rate') && lowerMessage.includes('limit')) {
      return {
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        category: ErrorCategory.RATE_LIMIT,
        severity: ErrorSeverity.MEDIUM,
        message: 'Rate limit detected',
        userMessage: 'Too many requests. Please wait a moment.',
        recoverable: true,
        retryable: true,
        suggestedAction: 'Wait before retrying',
      };
    }

    // Session patterns
    if (lowerMessage.includes('session') || lowerMessage.includes('token')) {
      return {
        code: ErrorCode.SESSION_INVALID,
        category: ErrorCategory.SESSION,
        severity: ErrorSeverity.MEDIUM,
        message: 'Session error detected',
        userMessage: 'Session error. Please sign in again.',
        recoverable: true,
        retryable: false,
        suggestedAction: 'Sign in again',
      };
    }

    return null;
  }

  private createDefaultErrorDetails(message: string, originalError: Error | null): ErrorDetails {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.MEDIUM,
      message: message || 'Unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again.',
      recoverable: true,
      retryable: true,
      suggestedAction: 'Retry operation or contact support',
      metadata: {
        originalMessage: message,
        errorType: originalError?.constructor.name,
      },
    };
  }

  // =========================================================================
  // RECOVERY STRATEGIES
  // =========================================================================

  private setupRecoveryStrategies(): void {
    // Network error recovery
    this.recoveryStrategies.set(ErrorCode.NETWORK_ERROR, {
      immediate: async () => {
        // Check if network is available
        if (navigator.onLine) {
          return true;
        }
        return false;
      },
      delayed: async () => {
        // Wait for network to come back
        await this.waitForNetwork();
        return navigator.onLine;
      },
      fallback: async () => {
        // Try alternative endpoint or offline mode
        return this.enableOfflineMode();
      },
      retryDelay: 2000,
      maxRetries: 3,
    });

    // Session expired recovery
    this.recoveryStrategies.set(ErrorCode.SESSION_EXPIRED, {
      immediate: async () => {
        // Try to refresh the session
        return this.tryRefreshSession();
      },
      delayed: null,
      fallback: async () => {
        // Redirect to login
        this.redirectToLogin();
        return true;
      },
      retryDelay: 0,
      maxRetries: 1,
    });

    // Rate limit recovery
    this.recoveryStrategies.set(ErrorCode.TOO_MANY_REQUESTS, {
      immediate: null,
      delayed: async () => {
        // Wait for rate limit window to reset
        await this.waitForRateLimitReset();
        return true;
      },
      fallback: async () => {
        // Use alternative endpoint or reduce request frequency
        return this.useAlternativeStrategy();
      },
      retryDelay: 5000,
      maxRetries: 2,
    });

    // Invalid credentials recovery
    this.recoveryStrategies.set(ErrorCode.INVALID_CREDENTIALS, {
      immediate: null,
      delayed: null,
      fallback: async () => {
        // Suggest password reset
        this.suggestPasswordReset();
        return false; // Don't auto-retry
      },
      retryDelay: 0,
      maxRetries: 0,
    });
  }

  private async attemptRecovery(errorDetails: ErrorDetails, context: ErrorContext): Promise<boolean> {
    if (!errorDetails.recoverable) {
      return false;
    }

    const strategy = this.recoveryStrategies.get(errorDetails.code);
    if (!strategy) {
      return false;
    }

    const retryKey = `${errorDetails.code}_${context.operation}`;
    const currentRetries = this.retryAttempts.get(retryKey) || 0;

    if (currentRetries >= strategy.maxRetries) {
      console.warn(`Max retries exceeded for ${errorDetails.code}`);
      return false;
    }

    try {
      // Try immediate recovery
      if (strategy.immediate) {
        const immediateSuccess = await strategy.immediate();
        if (immediateSuccess) {
          this.retryAttempts.delete(retryKey);
          return true;
        }
      }

      // Try delayed recovery
      if (strategy.delayed && strategy.retryDelay > 0) {
        await this.delay(strategy.retryDelay);
        const delayedSuccess = await strategy.delayed();
        if (delayedSuccess) {
          this.retryAttempts.delete(retryKey);
          return true;
        }
      }

      // Try fallback strategy
      if (strategy.fallback) {
        const fallbackSuccess = await strategy.fallback();
        if (fallbackSuccess) {
          this.retryAttempts.delete(retryKey);
          return true;
        }
      }

      // Update retry count
      this.retryAttempts.set(retryKey, currentRetries + 1);
      return false;
    } catch (recoveryError) {
      console.error('Recovery strategy failed:', recoveryError);
      this.retryAttempts.set(retryKey, currentRetries + 1);
      return false;
    }
  }

  // =========================================================================
  // RECOVERY IMPLEMENTATIONS
  // =========================================================================

  private async waitForNetwork(): Promise<void> {
    return new Promise((resolve) => {
      if (navigator.onLine) {
        resolve();
        return;
      }

      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        resolve();
      };

      window.addEventListener('online', handleOnline);
      
      // Timeout after 30 seconds
      setTimeout(() => {
        window.removeEventListener('online', handleOnline);
        resolve();
      }, 30000);
    });
  }

  private async enableOfflineMode(): Promise<boolean> {
    // Implement offline mode if supported
    console.log('Enabling offline mode...');
    return false; // Placeholder
  }

  private async tryRefreshSession(): Promise<boolean> {
    try {
      // Import token manager dynamically to avoid circular dependencies
      const { enterpriseTokenManager } = await import('./tokenManager');
      const result = await enterpriseTokenManager.refreshTokens();
      return result.success;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  }

  private redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  private async waitForRateLimitReset(): Promise<void> {
    // Wait for standard rate limit window (1 minute)
    await this.delay(60000);
  }

  private async useAlternativeStrategy(): Promise<boolean> {
    // Implement alternative strategy (e.g., exponential backoff)
    console.log('Using alternative strategy...');
    return false; // Placeholder
  }

  private suggestPasswordReset(): void {
    // Emit event for UI to show password reset suggestion
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:suggest-password-reset'));
    }
  }

  // =========================================================================
  // LOGGING & MONITORING
  // =========================================================================

  private logError(errorDetails: ErrorDetails, context: ErrorContext): void {
    // Add to internal log
    this.errorLog.push({ error: errorDetails, context });

    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Log based on severity
    const logMessage = `[${errorDetails.severity.toUpperCase()}] ${errorDetails.category}:${errorDetails.code} - ${errorDetails.message}`;
    
    switch (errorDetails.severity) {
      case ErrorSeverity.CRITICAL:
        console.error(logMessage, { errorDetails, context });
        this.sendToMonitoring(errorDetails, context);
        break;
      case ErrorSeverity.HIGH:
        console.error(logMessage, { errorDetails, context });
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(logMessage, { errorDetails, context });
        break;
      case ErrorSeverity.LOW:
        console.log(logMessage, { errorDetails, context });
        break;
    }
  }

  private sendToMonitoring(errorDetails: ErrorDetails, context: ErrorContext): void {
    // Send critical errors to monitoring service
    // This would integrate with services like Sentry, DataDog, etc.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('error:critical', {
        detail: { errorDetails, context }
      }));
    }
  }

  private updateErrorMetrics(errorDetails: ErrorDetails, recovered: boolean): void {
    // Update error metrics for monitoring
    const metricKey = `${errorDetails.category}:${errorDetails.code}`;
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('error:metric', {
        detail: {
          key: metricKey,
          severity: errorDetails.severity,
          recovered,
          timestamp: Date.now(),
        }
      }));
    }
  }

  // =========================================================================
  // GLOBAL ERROR HANDLERS
  // =========================================================================

  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason, { operation: 'unhandled_promise' });
    });

    // Global JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleError(event.error, { operation: 'global_error' });
    });
  }

  // =========================================================================
  // UTILITY METHODS
  // =========================================================================

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  getErrorHistory(): Array<{ error: ErrorDetails; context: ErrorContext }> {
    return [...this.errorLog];
  }

  getErrorStats(): Record<string, any> {
    const stats = {
      total: this.errorLog.length,
      byCategory: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      byCode: {} as Record<string, number>,
    };

    this.errorLog.forEach(({ error }) => {
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      stats.byCode[error.code] = (stats.byCode[error.code] || 0) + 1;
    });

    return stats;
  }

  clearErrorHistory(): void {
    this.errorLog = [];
    this.retryAttempts.clear();
  }

  isErrorRetryable(error: Error | string): boolean {
    const errorDetails = this.parseError(error);
    return errorDetails.retryable;
  }

  getErrorSeverity(error: Error | string): ErrorSeverity {
    const errorDetails = this.parseError(error);
    return errorDetails.severity;
  }

  getUserFriendlyMessage(error: Error | string): string {
    const errorDetails = this.parseError(error);
    return errorDetails.userMessage;
  }

  getSuggestedAction(error: Error | string): string | undefined {
    const errorDetails = this.parseError(error);
    return errorDetails.suggestedAction;
  }
}

// =========================================================================
// EXPORT SINGLETON INSTANCE
// =========================================================================

export const enterpriseErrorHandler = EnterpriseErrorHandler.getInstance();

// =========================================================================
// CONVENIENCE FUNCTIONS
// =========================================================================

export async function handleAuthError(
  error: Error | AuthError | string,
  context?: Partial<ErrorContext>
) {
  return enterpriseErrorHandler.handleError(error, context);
}

export function getUserErrorMessage(error: Error | string): string {
  return enterpriseErrorHandler.getUserFriendlyMessage(error);
}

export function isRetryableError(error: Error | string): boolean {
  return enterpriseErrorHandler.isErrorRetryable(error);
}

export function getErrorSeverity(error: Error | string): ErrorSeverity {
  return enterpriseErrorHandler.getErrorSeverity(error);
}

export function getSuggestedAction(error: Error | string): string | undefined {
  return enterpriseErrorHandler.getSuggestedAction(error);
}

// Export types
export type { ErrorDetails, ErrorContext, RecoveryStrategy };
export { ErrorCode, ErrorCategory, ErrorSeverity };

