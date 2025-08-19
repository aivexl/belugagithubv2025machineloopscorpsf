"use client";

import { useEffect } from 'react';

const GlobalErrorHandler = () => {
  useEffect(() => {
    // Handle global errors
    const handleError = (event) => {
      // Ignore browser extension errors
      if (event.filename && (
        event.filename.includes('chrome-extension') ||
        event.filename.includes('moz-extension') ||
        event.filename.includes('safari-extension')
      )) {
        event.preventDefault();
        return false;
      }

      // Ignore common harmless errors
      if (event.message && (
        event.message.includes('ResizeObserver loop limit exceeded') ||
        event.message.includes('Script error') ||
        event.message.includes('runtime.lastError') ||
        event.message.includes('message port closed')
      )) {
        event.preventDefault();
        return false;
      }

      // Log other errors for debugging
      console.warn('[Global Error Handler] Caught error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      // Ignore common harmless rejections
      if (event.reason && event.reason.message && (
        event.reason.message.includes('runtime.lastError') ||
        event.reason.message.includes('message port closed') ||
        event.reason.message.includes('Script error')
      )) {
        event.preventDefault();
        return false;
      }

      // Log other rejections for debugging
      console.warn('[Global Error Handler] Unhandled promise rejection:', {
        reason: event.reason,
        promise: event.promise
      });
    };

    // Handle console errors
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.error = (...args) => {
      // Filter out common harmless errors
      const message = args.join(' ');
      if (
        message.includes('ResizeObserver loop limit exceeded') ||
        message.includes('Script error') ||
        message.includes('runtime.lastError') ||
        message.includes('message port closed') ||
        message.includes('Failed to load resource') ||
        message.includes('404') ||
        message.includes('source map') ||
        message.includes('Failed to load image') ||
        message.includes('EnterpriseImage: Failed to load image')
      ) {
        return; // Don't log these errors
      }
      
      // Log other errors
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      // Filter out common harmless warnings
      const message = args.join(' ');
      if (
        message.includes('ResizeObserver loop limit exceeded') ||
        message.includes('Script error') ||
        message.includes('runtime.lastError') ||
        message.includes('message port closed')
      ) {
        return; // Don't log these warnings
      }
      
      // Log other warnings
      originalConsoleWarn.apply(console, args);
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      
      // Restore original console methods
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return null; // This component doesn't render anything
};

export default GlobalErrorHandler;
