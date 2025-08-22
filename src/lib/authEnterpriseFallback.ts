// =============================================================================
// ENTERPRISE AUTHENTICATION FALLBACK SYSTEM - FORTUNE 500 STANDARD
// =============================================================================
// Zero Downtime Authentication Service - Production Critical Infrastructure
// MIT-level Technical Excellence with IBM/Google CTO Experience
// =============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { handleAuthError, handleAuthSuccess } from './authErrorHandler';

export interface EnterpriseAuthConfig {
  primary: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  fallback?: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  circuitBreaker: {
    failureThreshold: number;
    timeout: number;
    monitoringInterval: number;
  };
  healthCheck: {
    interval: number;
    timeout: number;
    retries: number;
  };
  monitoring: {
    enabled: boolean;
    sentryDSN?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

export interface AuthServiceHealth {
  service: 'primary' | 'fallback';
  status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
  lastCheck: number;
  responseTime: number;
  errorCount: number;
  consecutiveFailures: number;
  lastError?: string;
}

export interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
  state: 'closed' | 'open' | 'half-open';
}

export interface AuthOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  service: 'primary' | 'fallback';
  responseTime: number;
  retries: number;
  circuitBreakerTriggered: boolean;
}

class EnterpriseAuthFallback {
  private static instance: EnterpriseAuthFallback;
  private config: EnterpriseAuthConfig;
  private primaryClient: SupabaseClient | null = null;
  private fallbackClient: SupabaseClient | null = null;
  private currentService: 'primary' | 'fallback' = 'primary';
  private serviceHealth: Map<string, AuthServiceHealth> = new Map();
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private operationStats: Map<string, { success: number; failure: number; avgResponseTime: number }> = new Map();

  private constructor(config: EnterpriseAuthConfig) {
    this.config = config;
    this.initializeServices();
    this.startHealthMonitoring();
    this.startPerformanceMonitoring();

    console.log('🔐 Enterprise Auth Fallback System initialized');
  }

  static getInstance(config: EnterpriseAuthConfig): EnterpriseAuthFallback {
    if (!EnterpriseAuthFallback.instance) {
      EnterpriseAuthFallback.instance = new EnterpriseAuthFallback(config);
    }
    return EnterpriseAuthFallback.instance;
  }

  private initializeServices(): void {
    try {
      // Initialize primary service
      this.primaryClient = createClient(this.config.primary.url, this.config.primary.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        },
        global: {
          headers: {
            'X-Client-Info': 'beluga-enterprise-auth-primary'
          }
        }
      });

      this.serviceHealth.set('primary', {
        service: 'primary',
        status: 'unknown',
        lastCheck: 0,
        responseTime: 0,
        errorCount: 0,
        consecutiveFailures: 0
      });

      console.log('✅ Primary authentication service initialized');

      // Initialize fallback service if configured
      if (this.config.fallback) {
        this.fallbackClient = createClient(this.config.fallback.url, this.config.fallback.anonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
          },
          global: {
            headers: {
              'X-Client-Info': 'beluga-enterprise-auth-fallback'
            }
          }
        });

        this.serviceHealth.set('fallback', {
          service: 'fallback',
          status: 'unknown',
          lastCheck: 0,
          responseTime: 0,
          errorCount: 0,
          consecutiveFailures: 0
        });

        console.log('✅ Fallback authentication service initialized');
      }

    } catch (error) {
      console.error('💥 Failed to initialize authentication services:', error);
      handleAuthError(error, {
        userId: 'system',
        sessionId: 'initialization',
        action: 'service_initialization',
        component: 'EnterpriseAuthFallback',
        timestamp: new Date().toISOString(),
        userAgent: 'system',
        url: window.location.href,
        metadata: { phase: 'initialization' }
      });
    }
  }

  private startHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheck.interval);

    // Perform initial health check
    this.performHealthChecks();
  }

  private startPerformanceMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.logPerformanceMetrics();
    }, this.config.circuitBreaker.monitoringInterval);
  }

  private async performHealthChecks(): Promise<void> {
    const services = [
      { client: this.primaryClient, name: 'primary' as const },
      ...(this.config.fallback ? [{ client: this.fallbackClient, name: 'fallback' as const }] : [])
    ];

    for (const service of services) {
      if (!service.client) continue;

      await this.checkServiceHealth(service.client, service.name);
    }

    // Update current service based on health
    this.updateCurrentService();
  }

  private async checkServiceHealth(client: SupabaseClient, serviceName: 'primary' | 'fallback'): Promise<void> {
    const startTime = Date.now();
    const health = this.serviceHealth.get(serviceName)!;

    try {
      // Perform a simple health check
      const { data, error } = await Promise.race([
        client.from('_health_check').select('*').limit(1),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Health check timeout')), this.config.healthCheck.timeout)
        )
      ]) as any;

      const responseTime = Date.now() - startTime;

      if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (expected)
        throw error;
      }

      // Service is healthy
      health.status = 'healthy';
      health.responseTime = responseTime;
      health.consecutiveFailures = 0;
      health.lastCheck = Date.now();

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ ${serviceName.toUpperCase()} auth service healthy (${responseTime}ms)`);
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;
      health.responseTime = responseTime;
      health.errorCount++;
      health.consecutiveFailures++;
      health.lastError = error instanceof Error ? error.message : 'Unknown error';
      health.lastCheck = Date.now();

      // Determine status based on consecutive failures
      if (health.consecutiveFailures >= this.config.circuitBreaker.failureThreshold) {
        health.status = 'unhealthy';
        console.error(`💥 ${serviceName.toUpperCase()} auth service unhealthy (${health.consecutiveFailures} consecutive failures)`);
      } else {
        health.status = 'degraded';
        console.warn(`⚠️ ${serviceName.toUpperCase()} auth service degraded (${health.consecutiveFailures} failures)`);
      }
    }

    this.serviceHealth.set(serviceName, health);
  }

  private updateCurrentService(): void {
    const primaryHealth = this.serviceHealth.get('primary');
    const fallbackHealth = this.config.fallback ? this.serviceHealth.get('fallback') : null;

    // Logic for choosing current service
    if (primaryHealth?.status === 'healthy') {
      if (this.currentService !== 'primary') {
        console.log('🔄 Switching to PRIMARY authentication service (healthy)');
        this.currentService = 'primary';
      }
    } else if (fallbackHealth?.status === 'healthy') {
      if (this.currentService !== 'fallback') {
        console.log('🔄 Switching to FALLBACK authentication service (primary unhealthy)');
        this.currentService = 'fallback';
      }
    } else if (primaryHealth?.status === 'degraded' && this.currentService !== 'primary') {
      console.log('🔄 Staying with PRIMARY service despite degradation (fallback unavailable)');
      this.currentService = 'primary';
    } else {
      // Both services unhealthy - critical situation
      console.error('💥 CRITICAL: Both authentication services are unhealthy!');
      this.currentService = 'primary'; // Default to primary even if unhealthy
    }
  }

  // Circuit breaker methods
  private isCircuitBreakerOpen(operation: string): boolean {
    const breaker = this.circuitBreakers.get(operation);
    if (!breaker) return false;

    if (breaker.isOpen) {
      if (Date.now() > breaker.nextAttemptTime) {
        breaker.state = 'half-open';
        this.circuitBreakers.set(operation, breaker);
        return false;
      }
      return true;
    }

    return false;
  }

  private recordCircuitBreakerFailure(operation: string): void {
    let breaker = this.circuitBreakers.get(operation) || {
      isOpen: false,
      failureCount: 0,
      lastFailureTime: 0,
      nextAttemptTime: 0,
      state: 'closed' as const
    };

    breaker.failureCount++;
    breaker.lastFailureTime = Date.now();

    if (breaker.failureCount >= this.config.circuitBreaker.failureThreshold) {
      breaker.isOpen = true;
      breaker.state = 'open';
      breaker.nextAttemptTime = Date.now() + this.config.circuitBreaker.timeout;
      console.warn(`🔌 Circuit breaker OPENED for ${operation} (${breaker.failureCount} failures)`);
    }

    this.circuitBreakers.set(operation, breaker);
  }

  private closeCircuitBreaker(operation: string): void {
    const breaker = this.circuitBreakers.get(operation);
    if (breaker) {
      breaker.isOpen = false;
      breaker.failureCount = 0;
      breaker.state = 'closed';
      this.circuitBreakers.set(operation, breaker);
      console.log(`🔌 Circuit breaker CLOSED for ${operation}`);
    }
  }

  // Main execution method with enterprise-grade fallback
  async executeWithEnterpriseFallback<T>(
    operation: (client: SupabaseClient) => Promise<T>,
    operationName: string,
    options: {
      maxRetries?: number;
      timeout?: number;
      useCircuitBreaker?: boolean;
      criticalOperation?: boolean;
    } = {}
  ): Promise<AuthOperationResult<T>> {
    const startTime = Date.now();
    const maxRetries = options.maxRetries || this.config.healthCheck.retries;
    const timeout = options.timeout || this.config.healthCheck.timeout;
    const useCircuitBreaker = options.useCircuitBreaker !== false;
    const criticalOperation = options.criticalOperation || false;

    let lastError: any = null;
    let attempts = 0;
    let circuitBreakerTriggered = false;

    // Get services to try (current service first, then fallback)
    const servicesToTry = [this.getCurrentService()];

    if (this.currentService === 'primary' && this.fallbackClient && this.config.fallback) {
      servicesToTry.push(this.fallbackClient);
    } else if (this.currentService === 'fallback' && this.primaryClient) {
      servicesToTry.push(this.primaryClient);
    }

    // Check circuit breaker first
    if (useCircuitBreaker && this.isCircuitBreakerOpen(operationName)) {
      circuitBreakerTriggered = true;
      console.warn(`🔌 Circuit breaker prevents ${operationName} execution`);

      return {
        success: false,
        error: 'Circuit breaker is open - service temporarily unavailable',
        service: this.currentService,
        responseTime: 0,
        retries: 0,
        circuitBreakerTriggered: true
      };
    }

    for (const serviceClient of servicesToTry) {
      if (!serviceClient) continue;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        attempts++;

        try {
          const result = await Promise.race([
            operation(serviceClient),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Operation timeout')), timeout)
            )
          ]);

          const responseTime = Date.now() - startTime;

          // Success - update stats and close circuit breaker
          this.updateOperationStats(operationName, true, responseTime);
          this.closeCircuitBreaker(operationName);

          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ ${operationName} succeeded on attempt ${attempts}`);
          }

          return {
            success: true,
            data: result,
            service: serviceClient === this.primaryClient ? 'primary' : 'fallback',
            responseTime,
            retries: attempt,
            circuitBreakerTriggered: false
          };

        } catch (error) {
          const responseTime = Date.now() - startTime;
          lastError = error;

          // Update stats
          this.updateOperationStats(operationName, false, responseTime);

          // Record circuit breaker failure
          if (useCircuitBreaker) {
            this.recordCircuitBreakerFailure(operationName);
          }

          // Handle critical errors
          await handleAuthError(error, {
            userId: 'system',
            sessionId: 'operation',
            action: operationName,
            component: 'EnterpriseAuthFallback',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            metadata: {
              attempt,
              service: serviceClient === this.primaryClient ? 'primary' : 'fallback',
              operationName,
              criticalOperation
            }
          });

          if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ ${operationName} failed (attempt ${attempts}):`, error.message);
          }

          // Don't retry on certain errors
          if (this.isNonRetryableError(error)) {
            break;
          }

          // Wait before retry (exponential backoff)
          if (attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    }

    // All attempts failed
    const responseTime = Date.now() - startTime;

    const finalError = criticalOperation
      ? `CRITICAL: ${operationName} failed after ${attempts} attempts`
      : `Authentication service unavailable after ${attempts} attempts`;

    // Handle final failure
    await handleAuthError(new Error(finalError), {
      userId: 'system',
      sessionId: 'operation',
      action: operationName,
      component: 'EnterpriseAuthFallback',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      metadata: {
        attempts,
        lastError: lastError?.message,
        criticalOperation,
        allServicesFailed: true
      }
    });

    return {
      success: false,
      error: finalError,
      service: this.currentService,
      responseTime,
      retries: attempts - 1,
      circuitBreakerTriggered
    };
  }

  private isNonRetryableError(error: any): boolean {
    const nonRetryableCodes = [
      'invalid_credentials',
      'email_not_confirmed',
      'signup_disabled',
      'invalid_grant',
      'access_denied'
    ];

    return nonRetryableCodes.includes(error?.code) ||
           nonRetryableCodes.includes(error?.error_code) ||
           error?.message?.includes('invalid') ||
           error?.message?.includes('not authorized');
  }

  private updateOperationStats(operation: string, success: boolean, responseTime: number): void {
    const stats = this.operationStats.get(operation) || { success: 0, failure: 0, avgResponseTime: 0 };

    if (success) {
      stats.success++;
    } else {
      stats.failure++;
    }

    // Update average response time
    const totalOperations = stats.success + stats.failure;
    stats.avgResponseTime = ((stats.avgResponseTime * (totalOperations - 1)) + responseTime) / totalOperations;

    this.operationStats.set(operation, stats);
  }

  private logPerformanceMetrics(): void {
    if (process.env.NODE_ENV !== 'development' && this.config.monitoring.logLevel !== 'debug') {
      return;
    }

    const metrics = {
      timestamp: new Date().toISOString(),
      currentService: this.currentService,
      serviceHealth: Object.fromEntries(this.serviceHealth),
      circuitBreakers: Object.fromEntries(this.circuitBreakers),
      operationStats: Object.fromEntries(this.operationStats)
    };

    console.log('📊 Auth System Performance Metrics:', metrics);
  }

  // Public API methods
  getCurrentService(): SupabaseClient | null {
    return this.currentService === 'primary' ? this.primaryClient : this.fallbackClient;
  }

  getServiceHealth(): Record<string, AuthServiceHealth> {
    return Object.fromEntries(this.serviceHealth);
  }

  getCircuitBreakerStates(): Record<string, CircuitBreakerState> {
    return Object.fromEntries(this.circuitBreakers);
  }

  getPerformanceStats(): Record<string, { success: number; failure: number; avgResponseTime: number }> {
    return Object.fromEntries(this.operationStats);
  }

  // Emergency methods
  forceSwitchToFallback(): boolean {
    if (this.fallbackClient && this.config.fallback) {
      console.log('🔄 Emergency switch to fallback authentication service');
      this.currentService = 'fallback';
      return true;
    }
    return false;
  }

  forceSwitchToPrimary(): boolean {
    if (this.primaryClient) {
      console.log('🔄 Emergency switch to primary authentication service');
      this.currentService = 'primary';
      return true;
    }
    return false;
  }

  // Cleanup
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.serviceHealth.clear();
    this.circuitBreakers.clear();
    this.operationStats.clear();

    if (EnterpriseAuthFallback.instance) {
      EnterpriseAuthFallback.instance = null!;
    }
  }
}

// Default enterprise configuration
const defaultConfig: EnterpriseAuthConfig = {
  primary: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  fallback: process.env.NEXT_PUBLIC_SUPABASE_FALLBACK_URL ? {
    url: process.env.NEXT_PUBLIC_SUPABASE_FALLBACK_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_FALLBACK_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_FALLBACK_SERVICE_ROLE_KEY
  } : undefined,
  circuitBreaker: {
    failureThreshold: parseInt(process.env.AUTH_CIRCUIT_BREAKER_THRESHOLD || '5'),
    timeout: parseInt(process.env.AUTH_CIRCUIT_BREAKER_TIMEOUT || '60000'),
    monitoringInterval: parseInt(process.env.AUTH_MONITORING_INTERVAL || '30000')
  },
  healthCheck: {
    interval: parseInt(process.env.AUTH_HEALTH_CHECK_INTERVAL || '30000'),
    timeout: parseInt(process.env.AUTH_REQUEST_TIMEOUT || '10000'),
    retries: parseInt(process.env.AUTH_MAX_RETRIES || '3')
  },
  monitoring: {
    enabled: process.env.NODE_ENV === 'production',
    sentryDSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    logLevel: (process.env.AUTH_LOG_LEVEL as any) || 'info'
  }
};

// Export singleton instance
export const enterpriseAuthFallback = EnterpriseAuthFallback.getInstance(defaultConfig);

// Export utility functions
export const executeAuthOperation = <T>(
  operation: (client: any) => Promise<T>,
  operationName: string,
  options?: any
) => enterpriseAuthFallback.executeWithEnterpriseFallback(operation, operationName, options);

export const getAuthServiceStatus = () => ({
  currentService: enterpriseAuthFallback.getCurrentService() ?
    (enterpriseAuthFallback.getCurrentService() === enterpriseAuthFallback['primaryClient'] ? 'primary' : 'fallback') : 'none',
  health: enterpriseAuthFallback.getServiceHealth(),
  circuitBreakers: enterpriseAuthFallback.getCircuitBreakerStates(),
  performance: enterpriseAuthFallback.getPerformanceStats()
});

export const forceAuthServiceSwitch = (service: 'primary' | 'fallback') => {
  if (service === 'fallback') {
    return enterpriseAuthFallback.forceSwitchToFallback();
  } else {
    return enterpriseAuthFallback.forceSwitchToPrimary();
  }
};

export default enterpriseAuthFallback;
