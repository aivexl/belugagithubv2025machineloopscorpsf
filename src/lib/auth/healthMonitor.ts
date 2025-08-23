// =============================================================================
// ENTERPRISE AUTHENTICATION HEALTH MONITOR
// Real-time Monitoring & Alerting System
// Fortune 500 & Unicorn Startup Level Implementation
// =============================================================================

import { enterpriseAuthValidator } from './tests/authSystemValidator';
import type { SystemHealthReport } from './tests/authSystemValidator';

interface HealthAlert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  component: string;
  resolved: boolean;
  resolvedAt?: number;
}

interface MonitoringConfig {
  enabled: boolean;
  interval: number; // milliseconds
  alertThreshold: {
    warning: number; // score threshold
    error: number;
    critical: number;
  };
  retentionPeriod: number; // milliseconds
  enableDetailedLogging: boolean;
  enablePerformanceTracking: boolean;
}

class EnterpriseHealthMonitor {
  private static instance: EnterpriseHealthMonitor;
  
  private config: MonitoringConfig;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alerts: HealthAlert[] = [];
  private healthHistory: Array<{ timestamp: number; score: number; status: string }> = [];
  private listeners: Map<string, Array<(data: any) => void>> = new Map();
  private isRunning: boolean = false;
  private lastReport: SystemHealthReport | null = null;

  private constructor() {
    this.config = {
      enabled: process.env.NODE_ENV === 'production',
      interval: 60000, // 1 minute
      alertThreshold: {
        warning: 85,
        error: 70,
        critical: 50,
      },
      retentionPeriod: 24 * 60 * 60 * 1000, // 24 hours
      enableDetailedLogging: process.env.NODE_ENV === 'development',
      enablePerformanceTracking: true,
    };
  }

  static getInstance(): EnterpriseHealthMonitor {
    if (!EnterpriseHealthMonitor.instance) {
      EnterpriseHealthMonitor.instance = new EnterpriseHealthMonitor();
    }
    return EnterpriseHealthMonitor.instance;
  }

  // =========================================================================
  // MONITORING CONTROL
  // =========================================================================

  start(): void {
    if (this.isRunning) {
      console.warn('Health monitor is already running');
      return;
    }

    console.log('🏥 Starting Enterprise Health Monitor...');
    
    this.isRunning = true;
    
    // Initial health check
    this.performHealthCheck();
    
    // Set up periodic monitoring
    if (this.config.enabled) {
      this.monitoringInterval = setInterval(() => {
        this.performHealthCheck();
      }, this.config.interval);
    }

    // Clean up old data periodically
    setInterval(() => {
      this.cleanupOldData();
    }, this.config.retentionPeriod / 4); // Clean up every 6 hours

    console.log('✅ Enterprise Health Monitor started');
    this.emit('monitor:started', { timestamp: Date.now() });
  }

  stop(): void {
    if (!this.isRunning) {
      console.warn('Health monitor is not running');
      return;
    }

    console.log('🛑 Stopping Enterprise Health Monitor...');
    
    this.isRunning = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('✅ Enterprise Health Monitor stopped');
    this.emit('monitor:stopped', { timestamp: Date.now() });
  }

  // =========================================================================
  // HEALTH CHECK EXECUTION
  // =========================================================================

  private async performHealthCheck(): Promise<void> {
    try {
      if (this.config.enableDetailedLogging) {
        console.log('🔍 Performing health check...');
      }

      const startTime = Date.now();
      const report = await enterpriseAuthValidator.validateEntireSystem();
      const duration = Date.now() - startTime;

      this.lastReport = report;
      
      // Update health history
      this.healthHistory.push({
        timestamp: report.timestamp,
        score: report.score,
        status: report.overall,
      });

      // Process alerts
      this.processHealthReport(report);

      // Emit health update event
      this.emit('health:update', {
        report,
        duration,
        timestamp: Date.now(),
      });

      if (this.config.enablePerformanceTracking) {
        this.trackPerformance(duration, report.score);
      }

      if (this.config.enableDetailedLogging) {
        console.log(`✅ Health check completed in ${duration}ms - Score: ${report.score}/100`);
      }

    } catch (error) {
      console.error('❌ Health check failed:', error);
      
      this.createAlert({
        level: 'error',
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        component: 'monitor',
      });
    }
  }

  // =========================================================================
  // ALERT PROCESSING
  // =========================================================================

  private processHealthReport(report: SystemHealthReport): void {
    // Check overall health score
    if (report.score <= this.config.alertThreshold.critical) {
      this.createAlert({
        level: 'critical',
        message: `System health critical - Score: ${report.score}/100`,
        component: 'system',
      });
    } else if (report.score <= this.config.alertThreshold.error) {
      this.createAlert({
        level: 'error',
        message: `System health degraded - Score: ${report.score}/100`,
        component: 'system',
      });
    } else if (report.score <= this.config.alertThreshold.warning) {
      this.createAlert({
        level: 'warning',
        message: `System health warning - Score: ${report.score}/100`,
        component: 'system',
      });
    }

    // Process specific validation results
    report.results.forEach(result => {
      if (!result.passed && (result.severity === 'error' || result.severity === 'critical')) {
        this.createAlert({
          level: result.severity === 'critical' ? 'critical' : 'error',
          message: `${result.message}: ${JSON.stringify(result.details)}`,
          component: this.extractComponentFromMessage(result.message),
        });
      }
    });

    // Auto-resolve alerts if health improves
    if (report.score > this.config.alertThreshold.warning) {
      this.resolveAlerts(['warning', 'error', 'critical']);
    } else if (report.score > this.config.alertThreshold.error) {
      this.resolveAlerts(['error', 'critical']);
    } else if (report.score > this.config.alertThreshold.critical) {
      this.resolveAlerts(['critical']);
    }
  }

  private createAlert(alertData: Omit<HealthAlert, 'id' | 'timestamp' | 'resolved'>): void {
    const alert: HealthAlert = {
      id: this.generateAlertId(),
      timestamp: Date.now(),
      resolved: false,
      ...alertData,
    };

    // Check for duplicate alerts
    const duplicate = this.alerts.find(existing => 
      !existing.resolved && 
      existing.level === alert.level &&
      existing.message === alert.message &&
      existing.component === alert.component
    );

    if (duplicate) {
      if (this.config.enableDetailedLogging) {
        console.log('Duplicate alert detected, skipping:', alert.message);
      }
      return;
    }

    this.alerts.push(alert);

    // Log alert
    const logLevel = alert.level === 'critical' ? 'error' : 
                    alert.level === 'error' ? 'error' : 
                    alert.level === 'warning' ? 'warn' : 'log';
    
    console[logLevel](`🚨 [${alert.level.toUpperCase()}] ${alert.component}: ${alert.message}`);

    // Emit alert event
    this.emit('alert:created', alert);

    // Send to external monitoring if critical
    if (alert.level === 'critical') {
      this.sendCriticalAlert(alert);
    }
  }

  private resolveAlerts(levels: string[]): void {
    const resolvedAlerts: HealthAlert[] = [];

    this.alerts.forEach(alert => {
      if (!alert.resolved && levels.includes(alert.level)) {
        alert.resolved = true;
        alert.resolvedAt = Date.now();
        resolvedAlerts.push(alert);
      }
    });

    if (resolvedAlerts.length > 0) {
      if (this.config.enableDetailedLogging) {
        console.log(`✅ Resolved ${resolvedAlerts.length} alerts:`, resolvedAlerts.map(a => a.message));
      }
      
      this.emit('alerts:resolved', resolvedAlerts);
    }
  }

  // =========================================================================
  // PERFORMANCE TRACKING
  // =========================================================================

  private trackPerformance(duration: number, score: number): void {
    const performanceData = {
      timestamp: Date.now(),
      healthCheckDuration: duration,
      healthScore: score,
      memoryUsage: this.getMemoryUsage(),
      alertCount: this.getActiveAlertCount(),
    };

    this.emit('performance:update', performanceData);

    // Warn if health check is taking too long
    if (duration > 5000) { // 5 seconds
      this.createAlert({
        level: 'warning',
        message: `Health check taking too long: ${duration}ms`,
        component: 'monitor',
      });
    }
  }

  private getMemoryUsage(): number {
    try {
      if (typeof window !== 'undefined' && (performance as any).memory) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    } catch {
      return 0;
    }
  }

  // =========================================================================
  // DATA MANAGEMENT
  // =========================================================================

  private cleanupOldData(): void {
    const cutoffTime = Date.now() - this.config.retentionPeriod;

    // Clean up old alerts
    const alertsBefore = this.alerts.length;
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffTime);
    
    // Clean up old health history
    const historyBefore = this.healthHistory.length;
    this.healthHistory = this.healthHistory.filter(entry => entry.timestamp > cutoffTime);

    if (this.config.enableDetailedLogging) {
      console.log(`🧹 Cleaned up ${alertsBefore - this.alerts.length} old alerts and ${historyBefore - this.healthHistory.length} old history entries`);
    }

    this.emit('cleanup:completed', {
      alertsRemoved: alertsBefore - this.alerts.length,
      historyEntriesRemoved: historyBefore - this.healthHistory.length,
      timestamp: Date.now(),
    });
  }

  // =========================================================================
  // EXTERNAL INTEGRATIONS
  // =========================================================================

  private sendCriticalAlert(alert: HealthAlert): void {
    // Integration with external monitoring services
    if (typeof window !== 'undefined') {
      // Send to external monitoring service
      window.dispatchEvent(new CustomEvent('monitor:critical-alert', {
        detail: alert
      }));
    }

    // In a real implementation, you would integrate with:
    // - Slack/Discord webhooks
    // - Email notifications
    // - SMS alerts
    // - PagerDuty/OpsGenie
    // - Sentry/DataDog
    console.error('🚨 CRITICAL ALERT:', alert);
  }

  // =========================================================================
  // UTILITY METHODS
  // =========================================================================

  private extractComponentFromMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('token')) return 'token-manager';
    if (lowerMessage.includes('session')) return 'session-manager';
    if (lowerMessage.includes('error')) return 'error-handler';
    if (lowerMessage.includes('storage')) return 'storage';
    if (lowerMessage.includes('network')) return 'network';
    if (lowerMessage.includes('security')) return 'security';
    
    return 'unknown';
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getActiveAlertCount(): number {
    return this.alerts.filter(alert => !alert.resolved).length;
  }

  // =========================================================================
  // EVENT SYSTEM
  // =========================================================================

  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in health monitor event callback for ${event}:`, error);
        }
      });
    }
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.config.enableDetailedLogging) {
      console.log('⚙️ Health monitor config updated:', newConfig);
    }

    // Restart monitoring with new config if running
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  async forceHealthCheck(): Promise<SystemHealthReport | null> {
    await this.performHealthCheck();
    return this.lastReport;
  }

  getHealthSummary(): {
    isHealthy: boolean;
    score: number;
    status: string;
    activeAlerts: number;
    lastCheck: number;
  } {
    const activeAlerts = this.getActiveAlertCount();
    const lastEntry = this.healthHistory[this.healthHistory.length - 1];
    
    return {
      isHealthy: activeAlerts === 0 && (lastEntry?.score || 0) >= this.config.alertThreshold.warning,
      score: lastEntry?.score || 0,
      status: lastEntry?.status || 'unknown',
      activeAlerts,
      lastCheck: lastEntry?.timestamp || 0,
    };
  }

  getActiveAlerts(): HealthAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  getAllAlerts(): HealthAlert[] {
    return [...this.alerts];
  }

  getHealthHistory(limit?: number): Array<{ timestamp: number; score: number; status: string }> {
    return limit ? this.healthHistory.slice(-limit) : [...this.healthHistory];
  }

  getLastReport(): SystemHealthReport | null {
    return this.lastReport;
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
      
      this.emit('alert:resolved', alert);
      return true;
    }
    return false;
  }

  getMonitoringStatus(): {
    isRunning: boolean;
    config: MonitoringConfig;
    uptime: number;
    checks: number;
  } {
    return {
      isRunning: this.isRunning,
      config: { ...this.config },
      uptime: this.isRunning ? Date.now() - (this.healthHistory[0]?.timestamp || Date.now()) : 0,
      checks: this.healthHistory.length,
    };
  }

  // =========================================================================
  // CLEANUP
  // =========================================================================

  cleanup(): void {
    this.stop();
    this.alerts = [];
    this.healthHistory = [];
    this.listeners.clear();
    this.lastReport = null;
  }
}

// Export singleton instance
export const enterpriseHealthMonitor = EnterpriseHealthMonitor.getInstance();
export type { HealthAlert, MonitoringConfig };
export default enterpriseHealthMonitor;

