// =============================================================================
// ENTERPRISE GLOBAL ERROR HANDLER - ZERO TOLERANCE FOR RUNTIME ERRORS
// =============================================================================
// Fortune 500 Enterprise Standard - Comprehensive Error Management
// MIT-level Technical Excellence with IBM/Google CTO Experience
// =============================================================================

import { AuthError, logAuthError } from '@/lib/authErrorHandler';

class EnterpriseGlobalErrorHandler {
  private static instance: EnterpriseGlobalErrorHandler;
  private errorQueue: AuthError[] = [];
  private maxQueueSize = 100;
  private flushInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeErrorHandling();
    this.startPeriodicFlush();
  }

  static getInstance(): EnterpriseGlobalErrorHandler {
    if (!EnterpriseGlobalErrorHandler.instance) {
      EnterpriseGlobalErrorHandler.instance = new EnterpriseGlobalErrorHandler();
    }
    return EnterpriseGlobalErrorHandler.instance;
  }

  private initializeErrorHandling() {
    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        const error = new AuthError(
          'UNHANDLED_PROMISE_REJECTION',
          event.reason?.message || 'Unhandled promise rejection',
          {
            reason: event.reason,
            stack: event.reason?.stack,
          },
          'high',
          'system'
        );

        this.handleError(error);
        event.preventDefault();
      });

      // Handle uncaught errors
      window.addEventListener('error', (event) => {
        const error = new AuthError(
          'UNCAUGHT_ERROR',
          event.message || 'Uncaught error',
          {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
          },
          'critical',
          'system'
        );

        this.handleError(error);
      });

      // Handle console errors (for development debugging)
      if (process.env.NODE_ENV === 'development') {
        const originalConsoleError = console.error;
        console.error = (...args) => {
          originalConsoleError.apply(console, args);

          // Check if this is an error we should handle
          const errorMessage = args.join(' ');
          if (errorMessage.includes('Error:') || errorMessage.includes('TypeError:')) {
            const error = new AuthError(
              'CONSOLE_ERROR',
              errorMessage,
              { args },
              'medium',
              'system'
            );
            this.handleError(error);
          }
        };
      }
    }

    // Handle Node.js errors (server-side)
    if (typeof process !== 'undefined') {
      process.on('uncaughtException', (error) => {
        const authError = new AuthError(
          'UNCAUGHT_EXCEPTION',
          error.message,
          {
            stack: error.stack,
            name: error.name,
          },
          'critical',
          'system'
        );

        this.handleError(authError);
        // Don't exit process in production, just log
        if (process.env.NODE_ENV !== 'production') {
          process.exit(1);
        }
      });

      process.on('unhandledRejection', (reason, promise) => {
        const authError = new AuthError(
          'UNHANDLED_REJECTION',
          reason instanceof Error ? reason.message : 'Unhandled rejection',
          {
            reason,
            promise,
          },
          'high',
          'system'
        );

        this.handleError(authError);
      });
    }
  }

  private startPeriodicFlush() {
    // Flush errors every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushErrors();
    }, 30000);
  }

  handleError(error: AuthError) {
    // Add timestamp
    error.timestamp = new Date().toISOString();

    // Add context information
    if (typeof window !== 'undefined') {
      error.userAgent = window.navigator.userAgent;
      error.url = window.location.href;
    }

    // Log locally
    console.error('🚨 Enterprise Global Error Handler:', {
      code: error.code,
      message: error.message,
      severity: error.severity,
      category: error.category,
      timestamp: error.timestamp,
    });

    // Add to queue
    this.errorQueue.push(error);

    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Handle critical errors immediately
    if (error.severity === 'critical') {
      this.handleCriticalError(error);
    }

    // Flush if queue is getting large
    if (this.errorQueue.length >= 10) {
      this.flushErrors();
    }
  }

  private handleCriticalError(error: AuthError) {
    // Send critical errors immediately to monitoring service
    this.sendToMonitoringService([error], true);

    // Show user notification for critical errors
    if (typeof window !== 'undefined' && error.severity === 'critical') {
      this.showCriticalErrorNotification(error);
    }
  }

  private showCriticalErrorNotification(error: AuthError) {
    // Create a non-intrusive notification for critical errors
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-red-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div class="ml-3 w-0 flex-1">
          <p class="text-sm font-medium">Critical System Error</p>
          <p class="mt-1 text-sm opacity-90">Error ID: ${error.code}</p>
          <div class="mt-2 flex">
            <button class="text-sm bg-red-700 px-2 py-1 rounded hover:bg-red-800 transition-colors" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  }

  private async flushErrors() {
    if (this.errorQueue.length === 0) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    await this.sendToMonitoringService(errorsToSend, false);
  }

  private async sendToMonitoringService(errors: AuthError[], isCritical: boolean) {
    try {
      // Send to enterprise monitoring endpoint
      const response = await fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errors,
          isCritical,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'unknown',
        }),
      });

      if (!response.ok) {
        console.error('Failed to send errors to monitoring service:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending to monitoring service:', error);
    }
  }

  // Public method to manually report errors
  reportError(error: Error, context?: any) {
    const authError = new AuthError(
      'MANUAL_ERROR_REPORT',
      error.message,
      {
        ...context,
        stack: error.stack,
        name: error.name,
      },
      'medium',
      'application'
    );

    this.handleError(authError);
  }

  // Get error statistics
  getErrorStats() {
    const stats = {
      totalErrors: this.errorQueue.length,
      criticalErrors: this.errorQueue.filter(e => e.severity === 'critical').length,
      highErrors: this.errorQueue.filter(e => e.severity === 'high').length,
      mediumErrors: this.errorQueue.filter(e => e.severity === 'medium').length,
      lowErrors: this.errorQueue.filter(e => e.severity === 'low').length,
      categories: {} as Record<string, number>,
    };

    // Count by category
    this.errorQueue.forEach(error => {
      stats.categories[error.category] = (stats.categories[error.category] || 0) + 1;
    });

    return stats;
  }

  // Cleanup
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    // Flush remaining errors
    this.flushErrors();
  }
}

// Export singleton instance
export const globalErrorHandler = EnterpriseGlobalErrorHandler.getInstance();

// Utility function to report errors from anywhere in the app
export const reportError = (error: Error, context?: any) => {
  globalErrorHandler.reportError(error, context);
};

// Hook for React components
export const useErrorHandler = () => {
  return {
    reportError,
    getErrorStats: () => globalErrorHandler.getErrorStats(),
  };
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalErrorHandler.destroy();
  });
}

export default globalErrorHandler;