'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-duniacrypto-background flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-red-400 text-6xl mb-4">🚨</div>
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong!</h1>
            <p className="text-gray-400 mb-6">
              We're experiencing technical difficulties. Please try again.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                Go to Home
              </button>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              <p>Error: {this.state.error?.message || 'Unknown error'}</p>
              <p>If the problem persists, please contact support.</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
