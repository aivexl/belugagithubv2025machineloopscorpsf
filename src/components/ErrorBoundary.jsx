"use client";

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-duniacrypto-bg-darker flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg border border-red-600 p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h2 className="text-red-400 font-bold text-xl mb-2">Something went wrong</h2>
              <p className="text-gray-300 text-sm mb-4">
                An error occurred while loading this page. Please try refreshing or go back.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Go Back
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-gray-400 cursor-pointer text-sm">Error Details</summary>
                  <pre className="text-xs text-red-300 mt-2 bg-duniacrypto-bg-darker p-2 rounded overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 