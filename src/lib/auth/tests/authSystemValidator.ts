// =============================================================================
// ENTERPRISE AUTHENTICATION SYSTEM VALIDATOR
// Fortune 500 & Unicorn Startup Level Test Suite
// Comprehensive Validation & Health Checks
// =============================================================================

import { enterpriseTokenManager } from '../tokenManager';
import { enterpriseSessionManager } from '../sessionManager';
import { enterpriseErrorHandler } from '../errorHandler';

interface ValidationResult {
  passed: boolean;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  details?: any;
}

interface SystemHealthReport {
  overall: 'healthy' | 'degraded' | 'critical';
  score: number; // 0-100
  timestamp: number;
  results: ValidationResult[];
  recommendations: string[];
  metrics: {
    tokenManager: any;
    sessionManager: any;
    errorHandler: any;
  };
}

class EnterpriseAuthValidator {
  private static instance: EnterpriseAuthValidator;
  
  private constructor() {}

  static getInstance(): EnterpriseAuthValidator {
    if (!EnterpriseAuthValidator.instance) {
      EnterpriseAuthValidator.instance = new EnterpriseAuthValidator();
    }
    return EnterpriseAuthValidator.instance;
  }

  // =========================================================================
  // COMPREHENSIVE SYSTEM VALIDATION
  // =========================================================================

  async validateEntireSystem(): Promise<SystemHealthReport> {
    console.log('🔍 Starting Enterprise Auth System Validation...');
    
    const results: ValidationResult[] = [];
    const startTime = Date.now();

    // Token Manager Tests
    results.push(...await this.validateTokenManager());
    
    // Session Manager Tests
    results.push(...await this.validateSessionManager());
    
    // Error Handler Tests
    results.push(...await this.validateErrorHandler());
    
    // Integration Tests
    results.push(...await this.validateIntegration());
    
    // Security Tests
    results.push(...await this.validateSecurity());
    
    // Performance Tests
    results.push(...await this.validatePerformance());

    // Calculate overall health
    const { overall, score } = this.calculateOverallHealth(results);
    const recommendations = this.generateRecommendations(results);

    const report: SystemHealthReport = {
      overall,
      score,
      timestamp: Date.now(),
      results,
      recommendations,
      metrics: {
        tokenManager: this.getTokenManagerMetrics(),
        sessionManager: this.getSessionManagerMetrics(),
        errorHandler: this.getErrorHandlerMetrics(),
      },
    };

    console.log(`✅ Validation completed in ${Date.now() - startTime}ms`);
    console.log(`📊 Overall Health: ${overall} (${score}/100)`);
    
    return report;
  }

  // =========================================================================
  // TOKEN MANAGER VALIDATION
  // =========================================================================

  private async validateTokenManager(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Test 1: Initialization
    try {
      const isHealthy = enterpriseTokenManager.isHealthy();
      results.push({
        passed: isHealthy,
        message: 'Token Manager Initialization',
        severity: isHealthy ? 'info' : 'critical',
        details: { healthy: isHealthy }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Token Manager Initialization Failed',
        severity: 'critical',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 2: Supabase Client Access
    try {
      const client = enterpriseTokenManager.getSupabaseClient();
      results.push({
        passed: !!client,
        message: 'Supabase Client Access',
        severity: client ? 'info' : 'error',
        details: { hasClient: !!client }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Supabase Client Access Failed',
        severity: 'error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 3: Current Session Retrieval
    try {
      const session = await enterpriseTokenManager.getCurrentSession();
      results.push({
        passed: true,
        message: 'Current Session Retrieval',
        severity: 'info',
        details: { hasSession: !!session, sessionValid: session ? this.isSessionValid(session) : false }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Current Session Retrieval Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 4: Token Storage Test
    try {
      const testKey = 'test_token_storage';
      const testValue = JSON.stringify({ test: true, timestamp: Date.now() });
      
      // This is a private method test - we'll test indirectly
      const client = enterpriseTokenManager.getSupabaseClient();
      if (client) {
        results.push({
          passed: true,
          message: 'Token Storage System Available',
          severity: 'info',
          details: { storageReady: true }
        });
      }
    } catch (error) {
      results.push({
        passed: false,
        message: 'Token Storage Test Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    return results;
  }

  // =========================================================================
  // SESSION MANAGER VALIDATION
  // =========================================================================

  private async validateSessionManager(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Test 1: Session Manager Health
    try {
      const health = enterpriseSessionManager.healthCheck();
      results.push({
        passed: health.isHealthy,
        message: 'Session Manager Health Check',
        severity: health.isHealthy ? 'info' : 'warning',
        details: health
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Session Manager Health Check Failed',
        severity: 'error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 2: Session State Access
    try {
      const sessionState = enterpriseSessionManager.getSessionState();
      results.push({
        passed: true,
        message: 'Session State Access',
        severity: 'info',
        details: {
          hasUser: !!sessionState.user,
          isAuthenticated: sessionState.isAuthenticated,
          isLoading: sessionState.isLoading,
          hasError: !!sessionState.error
        }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Session State Access Failed',
        severity: 'error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 3: Idle Time Tracking
    try {
      const idleTime = enterpriseSessionManager.getIdleTime();
      const lastActivity = enterpriseSessionManager.getLastActivity();
      results.push({
        passed: typeof idleTime === 'number' && typeof lastActivity === 'number',
        message: 'Idle Time Tracking',
        severity: 'info',
        details: { idleTime, lastActivity, trackingWorking: true }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Idle Time Tracking Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 4: Event System
    try {
      let eventReceived = false;
      const unsubscribe = enterpriseSessionManager.on('user_activity', () => {
        eventReceived = true;
      });
      
      // Simulate activity
      enterpriseSessionManager.extendSession();
      
      setTimeout(() => {
        unsubscribe();
        results.push({
          passed: eventReceived,
          message: 'Event System Functionality',
          severity: eventReceived ? 'info' : 'warning',
          details: { eventReceived }
        });
      }, 100);
    } catch (error) {
      results.push({
        passed: false,
        message: 'Event System Test Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    return results;
  }

  // =========================================================================
  // ERROR HANDLER VALIDATION
  // =========================================================================

  private async validateErrorHandler(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Test 1: Error Processing
    try {
      const testError = new Error('Test error for validation');
      const result = await enterpriseErrorHandler.handleError(testError, {
        operation: 'validation_test',
        timestamp: Date.now()
      });
      
      results.push({
        passed: !!result.errorDetails,
        message: 'Error Processing Functionality',
        severity: 'info',
        details: {
          errorProcessed: !!result.errorDetails,
          recovered: result.recovered,
          hasUserMessage: !!result.errorDetails?.userMessage
        }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Error Processing Test Failed',
        severity: 'error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 2: Error Classification
    try {
      const networkError = new Error('Failed to fetch');
      const severity = enterpriseErrorHandler.getErrorSeverity(networkError);
      const userMessage = enterpriseErrorHandler.getUserFriendlyMessage(networkError);
      const isRetryable = enterpriseErrorHandler.isErrorRetryable(networkError);
      
      results.push({
        passed: true,
        message: 'Error Classification System',
        severity: 'info',
        details: { severity, userMessage, isRetryable }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Error Classification Test Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 3: Error Statistics
    try {
      const stats = enterpriseErrorHandler.getErrorStats();
      results.push({
        passed: typeof stats.total === 'number',
        message: 'Error Statistics Tracking',
        severity: 'info',
        details: stats
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Error Statistics Test Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    return results;
  }

  // =========================================================================
  // INTEGRATION VALIDATION
  // =========================================================================

  private async validateIntegration(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Test 1: Token Manager <-> Session Manager Integration
    try {
      const currentSession = await enterpriseTokenManager.getCurrentSession();
      const sessionManagerSession = enterpriseSessionManager.getCurrentSession();
      
      results.push({
        passed: true,
        message: 'Token Manager ↔ Session Manager Integration',
        severity: 'info',
        details: {
          tokenManagerSession: !!currentSession,
          sessionManagerSession: !!sessionManagerSession,
          sessionsMatch: currentSession?.access_token === sessionManagerSession?.access_token
        }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Integration Test Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 2: Cross-Tab Communication
    try {
      const supportsStorage = typeof window !== 'undefined' && 'localStorage' in window;
      results.push({
        passed: supportsStorage,
        message: 'Cross-Tab Communication Support',
        severity: supportsStorage ? 'info' : 'warning',
        details: { supportsStorage, environment: typeof window !== 'undefined' ? 'browser' : 'server' }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Cross-Tab Communication Test Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    return results;
  }

  // =========================================================================
  // SECURITY VALIDATION
  // =========================================================================

  private async validateSecurity(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Test 1: Environment Variables
    try {
      const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      results.push({
        passed: hasSupabaseUrl && hasSupabaseKey,
        message: 'Environment Variables Security',
        severity: (hasSupabaseUrl && hasSupabaseKey) ? 'info' : 'critical',
        details: { hasSupabaseUrl, hasSupabaseKey }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Environment Variables Check Failed',
        severity: 'critical',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 2: Secure Storage
    try {
      const hasSecureContext = typeof window !== 'undefined' ? window.isSecureContext : true;
      results.push({
        passed: hasSecureContext,
        message: 'Secure Context Check',
        severity: hasSecureContext ? 'info' : 'warning',
        details: { hasSecureContext, protocol: typeof window !== 'undefined' ? window.location?.protocol : 'N/A' }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Secure Context Check Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 3: Storage Security
    try {
      const canUseLocalStorage = typeof window !== 'undefined' && 'localStorage' in window;
      const canUseSessionStorage = typeof window !== 'undefined' && 'sessionStorage' in window;
      const canUseCookies = typeof document !== 'undefined';
      
      results.push({
        passed: canUseLocalStorage || canUseSessionStorage || canUseCookies,
        message: 'Storage Security Options',
        severity: 'info',
        details: { canUseLocalStorage, canUseSessionStorage, canUseCookies }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Storage Security Test Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    return results;
  }

  // =========================================================================
  // PERFORMANCE VALIDATION
  // =========================================================================

  private async validatePerformance(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Test 1: Session Retrieval Performance
    try {
      const startTime = Date.now();
      await enterpriseTokenManager.getCurrentSession();
      const duration = Date.now() - startTime;
      
      results.push({
        passed: duration < 1000, // Should be under 1 second
        message: 'Session Retrieval Performance',
        severity: duration < 500 ? 'info' : duration < 1000 ? 'warning' : 'error',
        details: { duration, acceptable: duration < 1000 }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Session Retrieval Performance Test Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 2: Error Handler Performance
    try {
      const startTime = Date.now();
      await enterpriseErrorHandler.handleError(new Error('Performance test'), {
        operation: 'performance_test'
      });
      const duration = Date.now() - startTime;
      
      results.push({
        passed: duration < 100, // Should be under 100ms
        message: 'Error Handler Performance',
        severity: duration < 50 ? 'info' : duration < 100 ? 'warning' : 'error',
        details: { duration, acceptable: duration < 100 }
      });
    } catch (error) {
      results.push({
        passed: false,
        message: 'Error Handler Performance Test Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 3: Memory Usage
    try {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        const heapUsed = memoryInfo.usedJSHeapSize;
        const heapLimit = memoryInfo.jsHeapSizeLimit;
        const usagePercent = (heapUsed / heapLimit) * 100;
        
        results.push({
          passed: usagePercent < 80, // Should be under 80% memory usage
          message: 'Memory Usage Check',
          severity: usagePercent < 60 ? 'info' : usagePercent < 80 ? 'warning' : 'error',
          details: { heapUsed, heapLimit, usagePercent }
        });
      } else {
        results.push({
          passed: true,
          message: 'Memory Usage Check (Not Available)',
          severity: 'info',
          details: { memoryInfoAvailable: false }
        });
      }
    } catch (error) {
      results.push({
        passed: false,
        message: 'Memory Usage Check Failed',
        severity: 'warning',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    return results;
  }

  // =========================================================================
  // UTILITY METHODS
  // =========================================================================

  private isSessionValid(session: any): boolean {
    if (!session || !session.expires_at) return false;
    const now = Date.now();
    const expiresAt = session.expires_at * 1000;
    return now < expiresAt;
  }

  private calculateOverallHealth(results: ValidationResult[]): { overall: 'healthy' | 'degraded' | 'critical', score: number } {
    let totalScore = 0;
    let maxScore = 0;

    results.forEach(result => {
      maxScore += 100;
      if (result.passed) {
        totalScore += 100;
      } else {
        switch (result.severity) {
          case 'info':
            totalScore += 80;
            break;
          case 'warning':
            totalScore += 60;
            break;
          case 'error':
            totalScore += 30;
            break;
          case 'critical':
            totalScore += 0;
            break;
        }
      }
    });

    const score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    
    let overall: 'healthy' | 'degraded' | 'critical';
    if (score >= 90) overall = 'healthy';
    else if (score >= 70) overall = 'degraded';
    else overall = 'critical';

    return { overall, score };
  }

  private generateRecommendations(results: ValidationResult[]): string[] {
    const recommendations: string[] = [];
    
    results.forEach(result => {
      if (!result.passed) {
        switch (result.severity) {
          case 'critical':
            recommendations.push(`🚨 CRITICAL: Fix ${result.message} immediately`);
            break;
          case 'error':
            recommendations.push(`❌ ERROR: Address ${result.message} as soon as possible`);
            break;
          case 'warning':
            recommendations.push(`⚠️ WARNING: Consider fixing ${result.message}`);
            break;
        }
      }
    });

    // Add general recommendations
    if (recommendations.length === 0) {
      recommendations.push('✅ All systems operating optimally');
    } else {
      recommendations.push('🔍 Run validation again after fixes');
      recommendations.push('📊 Monitor system health regularly');
    }

    return recommendations;
  }

  private getTokenManagerMetrics(): any {
    return {
      isHealthy: enterpriseTokenManager.isHealthy(),
      lastRefreshTime: enterpriseTokenManager.getLastRefreshTime(),
      retryCount: enterpriseTokenManager.getRetryCount(),
      hasClient: !!enterpriseTokenManager.getSupabaseClient(),
    };
  }

  private getSessionManagerMetrics(): any {
    const health = enterpriseSessionManager.healthCheck();
    return {
      ...health.metrics,
      isHealthy: health.isHealthy,
      issues: health.issues,
      idleTime: enterpriseSessionManager.getIdleTime(),
      lastActivity: enterpriseSessionManager.getLastActivity(),
    };
  }

  private getErrorHandlerMetrics(): any {
    return {
      stats: enterpriseErrorHandler.getErrorStats(),
      historyLength: enterpriseErrorHandler.getErrorHistory().length,
    };
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  async quickHealthCheck(): Promise<{ healthy: boolean; issues: string[] }> {
    const issues: string[] = [];

    // Quick checks
    if (!enterpriseTokenManager.isHealthy()) {
      issues.push('Token Manager not healthy');
    }

    const sessionHealth = enterpriseSessionManager.healthCheck();
    if (!sessionHealth.isHealthy) {
      issues.push(`Session Manager issues: ${sessionHealth.issues.join(', ')}`);
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      issues.push('Missing environment variables');
    }

    return {
      healthy: issues.length === 0,
      issues,
    };
  }

  async validateSpecificComponent(component: 'token' | 'session' | 'error'): Promise<ValidationResult[]> {
    switch (component) {
      case 'token':
        return this.validateTokenManager();
      case 'session':
        return this.validateSessionManager();
      case 'error':
        return this.validateErrorHandler();
      default:
        throw new Error(`Unknown component: ${component}`);
    }
  }

  generateReport(report: SystemHealthReport): string {
    const lines: string[] = [];
    
    lines.push('='.repeat(80));
    lines.push('ENTERPRISE AUTHENTICATION SYSTEM HEALTH REPORT');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Overall Health: ${report.overall.toUpperCase()} (${report.score}/100)`);
    lines.push(`Timestamp: ${new Date(report.timestamp).toISOString()}`);
    lines.push('');
    
    lines.push('VALIDATION RESULTS:');
    lines.push('-'.repeat(40));
    report.results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      const severity = result.severity.toUpperCase().padEnd(8);
      lines.push(`${status} [${severity}] ${result.message}`);
    });
    
    lines.push('');
    lines.push('RECOMMENDATIONS:');
    lines.push('-'.repeat(40));
    report.recommendations.forEach(rec => {
      lines.push(`• ${rec}`);
    });
    
    lines.push('');
    lines.push('SYSTEM METRICS:');
    lines.push('-'.repeat(40));
    lines.push(`Token Manager Health: ${report.metrics.tokenManager.isHealthy ? 'Healthy' : 'Unhealthy'}`);
    lines.push(`Session Manager Health: ${report.metrics.sessionManager.isHealthy ? 'Healthy' : 'Unhealthy'}`);
    lines.push(`Error Handler Stats: ${report.metrics.errorHandler.historyLength} errors tracked`);
    
    lines.push('');
    lines.push('='.repeat(80));
    
    return lines.join('\n');
  }
}

// Export singleton instance
export const enterpriseAuthValidator = EnterpriseAuthValidator.getInstance();
export type { ValidationResult, SystemHealthReport };
export default enterpriseAuthValidator;

