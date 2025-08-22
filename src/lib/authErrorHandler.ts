// =============================================================================
// ENTERPRISE AUTHENTICATION ERROR HANDLER
// =============================================================================
// Fortune 500 Enterprise Standard - Zero Tolerance for Authentication Failures
// MIT-level Technical Excellence with IBM/Google CTO Experience
// =============================================================================

export interface AuthError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'network' | 'configuration' | 'authentication' | 'authorization' | 'validation' | 'security' | 'system';
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  url?: string;
  stackTrace?: string;
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  action: string;
  component: string;
  timestamp: string;
  userAgent: string;
  url: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

export interface ErrorReport {
  error: AuthError;
  context: ErrorContext;
  recommendations: string[];
  nextSteps: string[];
  shouldRetry: boolean;
  retryDelay?: number;
  shouldAlert: boolean;
  alertLevel: 'info' | 'warning' | 'error' | 'critical';
}

class AuthErrorHandler {
  private static instance: AuthErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private retryAttempts: Map<string, number> = new Map();
  private circuitBreaker: Map<string, { failures: number; lastFailure: number; state: 'closed' | 'open' | 'half-open' }> = new Map();
  private readonly maxRetries = 3;
  private readonly circuitBreakerThreshold = 5;
  private readonly circuitBreakerTimeout = 60000; // 1 minute
  private readonly maxQueueSize = 1000;

  static getInstance(): AuthErrorHandler {
    if (!AuthErrorHandler.instance) {
      AuthErrorHandler.instance = new AuthErrorHandler();
    }
    return AuthErrorHandler.instance;
  }

  // Enhanced error classification
  private classifyError(error: any, context: ErrorContext): AuthError {
    const errorCode = error?.code || error?.error_code || error?.status || 'UNKNOWN_ERROR';
    const errorMessage = error?.message || error?.error_description || error?.details || 'An unknown error occurred';

    // Network errors
    if (errorCode === 'NETWORK_ERROR' || error?.name === 'NetworkError' || errorMessage.includes('network')) {
      return {
        code: 'AUTH_NETWORK_ERROR',
        message: 'Network connectivity issue detected',
        details: error,
        timestamp: new Date().toISOString(),
        severity: 'high',
        category: 'network',
        userAgent: context.userAgent,
        userId: context.userId,
        sessionId: context.sessionId,
        url: context.url,
        stackTrace: error?.stack
      };
    }

    // Supabase specific errors
    if (errorCode === 'invalid_grant' || errorMessage.includes('Invalid login credentials')) {
      return {
        code: 'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid email or password provided',
        details: { originalError: error },
        timestamp: new Date().toISOString(),
        severity: 'low',
        category: 'authentication',
        userAgent: context.userAgent,
        userId: context.userId,
        sessionId: context.sessionId,
        url: context.url
      };
    }

    if (errorCode === 'signup_disabled' || errorMessage.includes('Signups not allowed')) {
      return {
        code: 'AUTH_SIGNUP_DISABLED',
        message: 'User registration is currently disabled',
        details: error,
        timestamp: new Date().toISOString(),
        severity: 'medium',
        category: 'configuration',
        userAgent: context.userAgent,
        userId: context.userId,
        sessionId: context.sessionId,
        url: context.url
      };
    }

    if (errorCode === 'email_not_confirmed' || errorMessage.includes('Email not confirmed')) {
      return {
        code: 'AUTH_EMAIL_NOT_VERIFIED',
        message: 'Please verify your email address before signing in',
        details: error,
        timestamp: new Date().toISOString(),
        severity: 'medium',
        category: 'authentication',
        userAgent: context.userAgent,
        userId: context.userId,
        sessionId: context.sessionId,
        url: context.url
      };
    }

    // Configuration errors
    if (errorMessage.includes('NEXT_PUBLIC_SUPABASE_URL') || errorMessage.includes('environment variable')) {
      return {
        code: 'AUTH_CONFIG_ERROR',
        message: 'Authentication service configuration error',
        details: { configError: true, originalError: error },
        timestamp: new Date().toISOString(),
        severity: 'critical',
        category: 'configuration',
        userAgent: context.userAgent,
        userId: context.userId,
        sessionId: context.sessionId,
        url: context.url,
        stackTrace: error?.stack
      };
    }

    // Security errors
    if (errorCode === 'too_many_requests' || errorMessage.includes('Rate limit')) {
      return {
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts. Please try again later.',
        details: error,
        timestamp: new Date().toISOString(),
        severity: 'medium',
        category: 'security',
        userAgent: context.userAgent,
        userId: context.userId,
        sessionId: context.sessionId,
        url: context.url
      };
    }

    // Default error classification
    return {
      code: 'AUTH_UNKNOWN_ERROR',
      message: errorMessage,
      details: error,
      timestamp: new Date().toISOString(),
      severity: 'medium',
      category: 'system',
      userAgent: context.userAgent,
      userId: context.userId,
      sessionId: context.sessionId,
      url: context.url,
      stackTrace: error?.stack
    };
  }

  // Generate recommendations based on error type
  private generateRecommendations(error: AuthError, context: ErrorContext): string[] {
    const recommendations: string[] = [];

    switch (error.code) {
      case 'AUTH_NETWORK_ERROR':
        recommendations.push('Check internet connectivity');
        recommendations.push('Verify Supabase service status');
        recommendations.push('Check firewall and proxy settings');
        recommendations.push('Try switching to a different network');
        break;

      case 'AUTH_CONFIG_ERROR':
        recommendations.push('Verify all environment variables are set');
        recommendations.push('Check Supabase project configuration');
        recommendations.push('Ensure production domain is properly configured');
        recommendations.push('Contact system administrator immediately');
        break;

      case 'AUTH_INVALID_CREDENTIALS':
        recommendations.push('Double-check email and password');
        recommendations.push('Use password reset if credentials are forgotten');
        recommendations.push('Ensure account is verified via email');
        break;

      case 'AUTH_EMAIL_NOT_VERIFIED':
        recommendations.push('Check email inbox for verification link');
        recommendations.push('Request new verification email');
        recommendations.push('Ensure email address is correct');
        break;

      case 'AUTH_RATE_LIMIT_EXCEEDED':
        recommendations.push('Wait at least 15 minutes before trying again');
        recommendations.push('Use different authentication method if available');
        recommendations.push('Contact support if legitimate access is blocked');
        break;

      case 'AUTH_SIGNUP_DISABLED':
        recommendations.push('Contact system administrator');
        recommendations.push('Check service status page');
        recommendations.push('Try again later');
        break;

      default:
        recommendations.push('Try refreshing the page');
        recommendations.push('Clear browser cache and cookies');
        recommendations.push('Contact support if problem persists');
    }

    return recommendations;
  }

  // Generate next steps for error resolution
  private generateNextSteps(error: AuthError, context: ErrorContext): string[] {
    const nextSteps: string[] = [];

    if (error.severity === 'critical') {
      nextSteps.push('Contact system administrator immediately');
      nextSteps.push('Do not attempt to retry operation');
      nextSteps.push('Document all error details for support');
    }

    if (error.category === 'network') {
      nextSteps.push('Check network connectivity');
      nextSteps.push('Retry operation in 30 seconds');
      nextSteps.push('Use offline mode if available');
    }

    if (error.category === 'configuration') {
      nextSteps.push('Verify configuration settings');
      nextSteps.push('Restart application if possible');
      nextSteps.push('Check deployment logs');
    }

    if (this.shouldRetry(error, context)) {
      nextSteps.push(`Retry operation in ${this.getRetryDelay(error)}ms`);
      nextSteps.push('Monitor error frequency');
    }

    return nextSteps;
  }

  // Circuit breaker logic
  private updateCircuitBreaker(operation: string, success: boolean): void {
    const breaker = this.circuitBreaker.get(operation) || { failures: 0, lastFailure: 0, state: 'closed' as const };

    if (!success) {
      breaker.failures++;
      breaker.lastFailure = Date.now();

      if (breaker.failures >= this.circuitBreakerThreshold) {
        breaker.state = 'open';
        this.logCircuitBreakerEvent(operation, 'OPENED');
      }
    } else {
      if (breaker.state === 'half-open' || breaker.failures > 0) {
        breaker.failures = Math.max(0, breaker.failures - 1);
      }

      if (breaker.state === 'open' && breaker.failures < this.circuitBreakerThreshold) {
        breaker.state = 'half-open';
        this.logCircuitBreakerEvent(operation, 'HALF-OPEN');
      }
    }

    this.circuitBreaker.set(operation, breaker);
  }

  // Check if operation should be allowed by circuit breaker
  private isCircuitBreakerOpen(operation: string): boolean {
    const breaker = this.circuitBreaker.get(operation);

    if (!breaker || breaker.state === 'closed') {
      return false;
    }

    if (breaker.state === 'open') {
      if (Date.now() - breaker.lastFailure > this.circuitBreakerTimeout) {
        breaker.state = 'half-open';
        this.circuitBreaker.set(operation, breaker);
        this.logCircuitBreakerEvent(operation, 'HALF-OPEN');
        return false;
      }
      return true;
    }

    return false;
  }

  // Determine if error should be retried
  private shouldRetry(error: AuthError, context: ErrorContext): boolean {
    const retryCount = this.retryAttempts.get(context.action) || 0;

    // Don't retry critical errors
    if (error.severity === 'critical') {
      return false;
    }

    // Don't retry configuration errors
    if (error.category === 'configuration') {
      return false;
    }

    // Don't retry authentication errors (user mistakes)
    if (error.category === 'authentication' && error.code !== 'AUTH_NETWORK_ERROR') {
      return false;
    }

    // Don't retry security errors
    if (error.category === 'security') {
      return false;
    }

    // Check retry limit
    if (retryCount >= this.maxRetries) {
      return false;
    }

    // Check circuit breaker
    if (this.isCircuitBreakerOpen(context.action)) {
      return false;
    }

    return true;
  }

  // Calculate retry delay with exponential backoff
  private getRetryDelay(error: AuthError): number {
    const baseDelay = 1000; // 1 second
    const retryCount = this.retryAttempts.get(error.code) || 0;
    const exponentialDelay = baseDelay * Math.pow(2, retryCount);
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter

    // Cap at 30 seconds
    return Math.min(exponentialDelay + jitter, 30000);
  }

  // Main error handling method
  async handleError(error: any, context: ErrorContext): Promise<ErrorReport> {
    // Classify the error
    const authError = this.classifyError(error, context);

    // Generate recommendations and next steps
    const recommendations = this.generateRecommendations(authError, context);
    const nextSteps = this.generateNextSteps(authError, context);

    // Determine retry behavior
    const shouldRetry = this.shouldRetry(authError, context);
    const retryDelay = shouldRetry ? this.getRetryDelay(authError) : undefined;

    // Determine alerting
    const shouldAlert = authError.severity === 'critical' ||
                       (authError.severity === 'high' && authError.category === 'security') ||
                       (authError.category === 'configuration');

    const alertLevel = authError.severity === 'critical' ? 'critical' :
                      authError.severity === 'high' ? 'error' :
                      authError.severity === 'medium' ? 'warning' : 'info';

    // Create error report
    const report: ErrorReport = {
      error: authError,
      context,
      recommendations,
      nextSteps,
      shouldRetry,
      retryDelay,
      shouldAlert,
      alertLevel
    };

    // Update circuit breaker
    this.updateCircuitBreaker(context.action, false);

    // Queue for processing
    this.addToErrorQueue(report);

    // Log error
    this.logError(report);

    // Send alerts if needed
    if (shouldAlert) {
      await this.sendAlert(report);
    }

    // Update retry attempts
    if (shouldRetry) {
      const currentRetries = this.retryAttempts.get(context.action) || 0;
      this.retryAttempts.set(context.action, currentRetries + 1);
    }

    return report;
  }

  // Handle successful operations
  handleSuccess(action: string): void {
    // Reset retry attempts
    this.retryAttempts.delete(action);

    // Update circuit breaker
    this.updateCircuitBreaker(action, true);

    // Log success for monitoring
    console.log(`✅ Auth operation successful: ${action}`);
  }

  // Add error to processing queue
  private addToErrorQueue(report: ErrorReport): void {
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }
    this.errorQueue.push(report);
  }

  // Log error with enterprise formatting
  private logError(report: ErrorReport): void {
    const severityIcon = {
      low: 'ℹ️',
      medium: '⚠️',
      high: '🚨',
      critical: '💥'
    };

    const categoryIcon = {
      network: '🌐',
      configuration: '⚙️',
      authentication: '🔐',
      authorization: '🚪',
      validation: '✅',
      security: '🛡️',
      system: '💻'
    };

    const logMessage = [
      `${severityIcon[report.error.severity]} ${categoryIcon[report.error.category]}`,
      `[${report.error.code}] ${report.error.message}`,
      `User: ${report.context.userId || 'anonymous'}`,
      `Action: ${report.context.action}`,
      `Component: ${report.context.component}`,
      `URL: ${report.context.url}`
    ].join(' | ');

    // Log with appropriate level
    switch (report.error.severity) {
      case 'critical':
      case 'high':
        console.error(logMessage);
        break;
      case 'medium':
        console.warn(logMessage);
        break;
      case 'low':
        console.info(logMessage);
        break;
    }

    // Log detailed error in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Error Details:', {
        error: report.error,
        context: report.context,
        recommendations: report.recommendations,
        nextSteps: report.nextSteps
      });
    }
  }

  // Send alerts to monitoring systems
  private async sendAlert(report: ErrorReport): Promise<void> {
    try {
      // Console alert (development)
      if (process.env.NODE_ENV === 'development') {
        console.error('🚨 AUTHENTICATION ALERT:', {
          level: report.alertLevel,
          error: report.error,
          recommendations: report.recommendations
        });
      }

      // In production, this would send to:
      // - Sentry
      // - PagerDuty
      // - Slack
      // - Email
      // - SMS
      // - Monitoring dashboards

      // Example: Send to monitoring service
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(new Error(report.error.message), {
          tags: {
            category: report.error.category,
            severity: report.error.severity,
            component: report.context.component
          },
          extra: {
            error: report.error,
            context: report.context
          }
        });
      }

    } catch (alertError) {
      console.error('Failed to send alert:', alertError);
    }
  }

  // Circuit breaker event logging
  private logCircuitBreakerEvent(operation: string, event: string): void {
    console.warn(`🔌 Circuit Breaker [${operation}]: ${event}`);
  }

  // Get error statistics
  getErrorStats(): {
    totalErrors: number;
    criticalErrors: number;
    openCircuits: number;
    retryAttempts: Record<string, number>;
  } {
    const criticalErrors = this.errorQueue.filter(r => r.error.severity === 'critical').length;
    const openCircuits = Array.from(this.circuitBreaker.values()).filter(b => b.state === 'open').length;
    const retryAttempts = Object.fromEntries(this.retryAttempts);

    return {
      totalErrors: this.errorQueue.length,
      criticalErrors,
      openCircuits,
      retryAttempts
    };
  }

  // Get recent errors
  getRecentErrors(limit: number = 10): ErrorReport[] {
    return this.errorQueue.slice(-limit);
  }

  // Clear error state (for testing)
  clearState(): void {
    this.errorQueue = [];
    this.retryAttempts.clear();
    this.circuitBreaker.clear();
  }
}

// Export singleton instance
export const authErrorHandler = AuthErrorHandler.getInstance();

// Export utility functions
export const handleAuthError = (error: any, context: ErrorContext) =>
  authErrorHandler.handleError(error, context);

export const handleAuthSuccess = (action: string) =>
  authErrorHandler.handleSuccess(action);

export const getAuthErrorStats = () =>
  authErrorHandler.getErrorStats();

export const getRecentAuthErrors = (limit?: number) =>
  authErrorHandler.getRecentErrors(limit);

export default authErrorHandler;
