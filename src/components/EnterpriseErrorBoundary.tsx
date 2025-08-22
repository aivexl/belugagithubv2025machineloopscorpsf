// =============================================================================
// ENTERPRISE ERROR BOUNDARY - ZERO TOLERANCE FOR RUNTIME ERRORS
// =============================================================================
// Fortune 500 Enterprise Standard - Comprehensive Error Handling
// MIT-level Technical Excellence with IBM/Google CTO Experience
// =============================================================================

'use client';

import React from 'react';
import { AuthError } from '@/lib/authErrorHandler';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class EnterpriseErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `enterprise-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to enterprise monitoring system
    console.error('🚨 Enterprise Error Boundary - Critical Error Caught:', {
      errorId: this.state.errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in custom error handler:', handlerError);
      }
    }

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Report to monitoring service (implement based on your monitoring solution)
    this.reportToMonitoringService(error, errorInfo);
  }

  reportToMonitoringService(error: Error, errorInfo: React.ErrorInfo) {
    // Enterprise error reporting - implement based on your monitoring solution
    try {
      // Example: Sentry reporting
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          tags: {
            component: 'ErrorBoundary',
            errorId: this.state.errorId,
          },
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
          },
        });
      }

      // Example: Custom monitoring endpoint
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        severity: 'critical',
        category: 'react-error-boundary',
      };

      // Send to enterprise monitoring endpoint
      fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      }).catch(reportError => {
        console.error('Failed to report error to monitoring service:', reportError);
      });

    } catch (reportingError) {
      console.error('Error in error reporting:', reportingError);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  handleRetry = () => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    this.retryTimeout = setTimeout(() => {
      this.handleReset();
    }, 1000);
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            resetError={this.handleReset}
          />
        );
      }

      // Default enterprise error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Enterprise System Error
              </h1>
              <p className="text-gray-600 mb-4">
                A critical error has occurred in the application.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <p className="text-sm text-red-800 font-mono">
                  Error ID: {this.state.errorId}
                </p>
                <p className="text-sm text-red-800 mt-1">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Retry Application
              </button>
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Reset Error State
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Reload Page
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If this error persists, please contact the enterprise support team.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Error timestamp: {new Date().toISOString()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Default Error Fallback Component
export const EnterpriseErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Application Error
        </h1>
        <p className="text-gray-600 mb-4">
          Something went wrong. Please try refreshing the page.
        </p>
      </div>

      <button
        onClick={resetError}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default EnterpriseErrorBoundary;