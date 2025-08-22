// =============================================================================
// ENTERPRISE AUTHENTICATION FALLBACK SYSTEM
// =============================================================================
// Fortune 500 Enterprise Standard - Zero Downtime Authentication Service
// MIT-level Technical Excellence with IBM/Google CTO Experience
// =============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthError } from './authErrorHandler';

export interface FallbackConfig {
  primaryUrl: string;
  primaryKey: string;
  fallbackUrl?: string;
  fallbackKey?: string;
  enableFallback: boolean;
  healthCheckInterval: number;
  maxRetries: number;
  timeout: number;
  circuitBreakerThreshold: number;
}

export interface ServiceHealth {
  url: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastCheck: number;
  responseTime: number;
  errorCount: number;
  consecutiveFailures: number;
}

export interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
  state: 'closed' | 'open' | 'half-open';
}

class AuthFallbackManager {
  private static instance: AuthFallbackManager;
  private primaryClient: SupabaseClient | null = null;
  private fallbackClient: SupabaseClient | null = null;
  private currentClient: 'primary' | 'fallback' = 'primary';
  private serviceHealth: Map<string, ServiceHealth> = new Map();
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private config: FallbackConfig;

  private constructor() {
    // Default enterprise configuration
    this.config = {
      primaryUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      primaryKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      fallbackUrl: process.env.NEXT_PUBLIC_SUPABASE_FALLBACK_URL,
      fallbackKey: process.env.NEXT_PUBLIC_SUPABASE_FALLBACK_ANON_KEY,
      enableFallback: process.env.NEXT_PUBLIC_ENABLE_AUTH_FALLBACK === 'true',
      healthCheckInterval: parseInt(process.env.AUTH_HEALTH_CHECK_INTERVAL || '30000'), // 30 seconds
      maxRetries: parseInt(process.env.AUTH_MAX_RETRIES || '3'),
      timeout: parseInt(process.env.AUTH_REQUEST_TIMEOUT || '10000'), // 10 seconds
      circuitBreakerThreshold: parseInt(process.env.AUTH_CIRCUIT_BREAKER_THRESHOLD || '5')
    };

    this.initializeClients();
    this.startHealthMonitoring();
  }

  static getInstance(): AuthFallbackManager {
    if (!AuthFallbackManager.instance) {
      AuthFallbackManager.instance = new AuthFallbackManager();
    }
    return AuthFallbackManager.instance;
  }

  private initializeClients(): void {
    try {
      // Initialize primary client
      if (this.config.primaryUrl && this.config.primaryKey) {
        this.primaryClient = createClient(this.config.primaryUrl, this.config.primaryKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
          },
          global: {
            headers: {
              'X-Client-Info': 'beluga-web-app-primary'
            }
          }
        });

        // Initialize service health for primary
        this.serviceHealth.set(this.config.primaryUrl, {
          url: this.config.primaryUrl,
          status: 'unknown',
          lastCheck: 0,
          responseTime: 0,
          errorCount: 0,
          consecutiveFailures: 0
        });

        console.log('✅ Primary Supabase client initialized');
      } else {
        console.error('❌ Primary Supabase configuration missing');
      }

      // Initialize fallback client if enabled
      if (this.config.enableFallback && this.config.fallbackUrl && this.config.fallbackKey) {
        this.fallbackClient = createClient(this.config.fallbackUrl, this.config.fallbackKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
          },
          global: {
            headers: {
              'X-Client-Info': 'beluga-web-app-fallback'
            }
          }
        });

        // Initialize service health for fallback
        this.serviceHealth.set(this.config.fallbackUrl, {
          url: this.config.fallbackUrl,
          status: 'unknown',
          lastCheck: 0,
          responseTime: 0,
          errorCount: 0,
          consecutiveFailures: 0
        });

        console.log('✅ Fallback Supabase client initialized');
      } else if (this.config.enableFallback) {
        console.warn('⚠️ Fallback enabled but configuration missing');
      }

    } catch (error) {
      console.error('💥 Failed to initialize Supabase clients:', error);
    }
  }

  private startHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheckInterval);

    // Perform initial health check
    this.performHealthChecks();
  }

  private async performHealthChecks(): Promise<void> {
    const services = [
      { url: this.config.primaryUrl, client: this.primaryClient, type: 'primary' as const },
      ...(this.config.enableFallback && this.config.fallbackUrl && this.fallbackClient
        ? [{ url: this.config.fallbackUrl, client: this.fallbackClient, type: 'fallback' as const }]
        : [])
    ];

    for (const service of services) {
      if (!service.url || !service.client) continue;

      await this.checkServiceHealth(service.url, service.client, service.type);
    }

    // Decide which client to use based on health
    this.updateCurrentClient();
  }

  private async checkServiceHealth(url: string, client: SupabaseClient, type: 'primary' | 'fallback'): Promise<void> {
    const startTime = Date.now();
    let health: ServiceHealth = this.serviceHealth.get(url) || {
      url,
      status: 'unknown',
      lastCheck: 0,
      responseTime: 0,
      errorCount: 0,
      consecutiveFailures: 0
    };

    try {
      // Perform a simple health check query
      const { data, error } = await Promise.race([
        client.from('_health_check').select('*').limit(1),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), this.config.timeout))
      ]) as any;

      const responseTime = Date.now() - startTime;

      if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (expected for health check)
        throw error;
      }

      // Service is healthy
      health.status = 'healthy';
      health.responseTime = responseTime;
      health.consecutiveFailures = 0;
      health.lastCheck = Date.now();

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ ${type.toUpperCase()} service healthy (${responseTime}ms)`);
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;
      health.responseTime = responseTime;
      health.errorCount++;
      health.consecutiveFailures++;
      health.lastCheck = Date.now();

      // Determine status based on consecutive failures
      if (health.consecutiveFailures >= this.config.circuitBreakerThreshold) {
        health.status = 'unhealthy';
        console.error(`💥 ${type.toUpperCase()} service unhealthy (${health.consecutiveFailures} consecutive failures)`);
      } else {
        health.status = 'unknown';
        console.warn(`⚠️ ${type.toUpperCase()} service check failed (${health.consecutiveFailures} failures)`);
      }
    }

    this.serviceHealth.set(url, health);
  }

  private updateCurrentClient(): void {
    const primaryHealth = this.serviceHealth.get(this.config.primaryUrl);
    const fallbackHealth = this.config.enableFallback ? this.serviceHealth.get(this.config.fallbackUrl!) : null;

    // Logic for choosing current client
    if (primaryHealth?.status === 'healthy') {
      if (this.currentClient !== 'primary') {
        console.log('🔄 Switching to PRIMARY client (healthy)');
        this.currentClient = 'primary';
      }
    } else if (fallbackHealth?.status === 'healthy') {
      if (this.currentClient !== 'fallback') {
        console.log('🔄 Switching to FALLBACK client (primary unhealthy)');
        this.currentClient = 'fallback';
      }
    } else if (primaryHealth?.status === 'unknown') {
      // Keep primary if it's in unknown state but fallback is unhealthy
      if (this.currentClient !== 'primary') {
        console.log('🔄 Staying with PRIMARY client (fallback unhealthy)');
        this.currentClient = 'primary';
      }
    } else {
      // Both services unhealthy - this is a critical situation
      console.error('💥 CRITICAL: Both authentication services are unhealthy!');
      this.currentClient = 'primary'; // Default to primary even if unhealthy
    }
  }

  // Get the current active client
  getCurrentClient(): SupabaseClient | null {
    if (this.currentClient === 'primary') {
      return this.primaryClient;
    } else if (this.currentClient === 'fallback') {
      return this.fallbackClient;
    }
    return this.primaryClient; // Default fallback
  }

  // Execute operation with fallback and retry logic
  async executeWithFallback<T>(
    operation: (client: SupabaseClient) => Promise<T>,
    operationName: string,
    options: {
      maxRetries?: number;
      timeout?: number;
      useCircuitBreaker?: boolean;
    } = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries || this.config.maxRetries;
    const timeout = options.timeout || this.config.timeout;
    const useCircuitBreaker = options.useCircuitBreaker !== false;

    let lastError: any = null;
    let attempts = 0;
    const clientsToTry = [this.getCurrentClient()];

    // Add fallback client if different from current
    if (this.currentClient === 'primary' && this.fallbackClient) {
      clientsToTry.push(this.fallbackClient);
    } else if (this.currentClient === 'fallback' && this.primaryClient) {
      clientsToTry.push(this.primaryClient);
    }

    for (const client of clientsToTry) {
      if (!client) continue;

      // Check circuit breaker
      if (useCircuitBreaker && this.isCircuitBreakerOpen(operationName)) {
        console.warn(`🔌 Circuit breaker open for ${operationName}, skipping client`);
        continue;
      }

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        attempts++;

        try {
          const result = await Promise.race([
            operation(client),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Operation timeout')), timeout)
            )
          ]);

          // Success - close circuit breaker
          this.closeCircuitBreaker(operationName);

          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ ${operationName} succeeded on attempt ${attempts}`);
          }

          return result;

        } catch (error) {
          lastError = error;

          // Update circuit breaker
          this.recordCircuitBreakerFailure(operationName);

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
    const finalError = new AuthError(
      'AUTH_SERVICE_UNAVAILABLE',
      `Authentication service unavailable after ${attempts} attempts`,
      { originalError: lastError, attempts, operationName }
    );

    throw finalError;
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

    if (breaker.failureCount >= this.config.circuitBreakerThreshold) {
      breaker.isOpen = true;
      breaker.state = 'open';
      breaker.nextAttemptTime = Date.now() + (breaker.failureCount * 1000); // Progressive backoff
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

  // Health status methods
  getServiceHealth(): Record<string, ServiceHealth> {
    return Object.fromEntries(this.serviceHealth);
  }

  getCurrentServiceStatus(): {
    currentClient: string;
    primaryHealth: ServiceHealth | null;
    fallbackHealth: ServiceHealth | null;
    circuitBreakers: Record<string, CircuitBreakerState>;
  } {
    return {
      currentClient: this.currentClient,
      primaryHealth: this.serviceHealth.get(this.config.primaryUrl) || null,
      fallbackHealth: this.config.fallbackUrl ? this.serviceHealth.get(this.config.fallbackUrl) || null : null,
      circuitBreakers: Object.fromEntries(this.circuitBreakers)
    };
  }

  // Emergency methods
  forceSwitchToFallback(): boolean {
    if (this.fallbackClient && this.config.enableFallback) {
      console.log('🔄 Emergency switch to fallback client');
      this.currentClient = 'fallback';
      return true;
    }
    return false;
  }

  forceSwitchToPrimary(): boolean {
    if (this.primaryClient) {
      console.log('🔄 Emergency switch to primary client');
      this.currentClient = 'primary';
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

    this.serviceHealth.clear();
    this.circuitBreakers.clear();

    if (AuthFallbackManager.instance) {
      AuthFallbackManager.instance = null!;
    }
  }
}

// Custom AuthError class
class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Export singleton instance
export const authFallback = AuthFallbackManager.getInstance();

// Export utility functions
export const executeAuthOperation = <T>(
  operation: (client: any) => Promise<T>,
  operationName: string,
  options?: any
) => authFallback.executeWithFallback(operation, operationName, options);

export const getAuthServiceStatus = () => authFallback.getCurrentServiceStatus();

export const getAuthServiceHealth = () => authFallback.getServiceHealth();

export default authFallback;
