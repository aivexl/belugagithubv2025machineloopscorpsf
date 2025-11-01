"use client";

import { useEffect } from 'react';

const GlobalErrorHandler = () => {
  useEffect(() => {
    // Do not hook console in Sanity Studio to avoid interfering with its rendering
    if (typeof window !== 'undefined') {
      const path = window.location?.pathname || '';
      if (path.startsWith('/studio')) {
        return; // no-op inside Studio
      }
    }
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

      // Ignore common harmless errors from browser extensions
      if (event.message && (
        event.message.includes('ResizeObserver loop limit exceeded') ||
        event.message.includes('Script error') ||
        event.message.includes('runtime.lastError') ||
        event.message.includes('message port closed') ||
        event.message.includes('message channel closed') ||
        event.message.includes('asynchronous response')
      )) {
        event.preventDefault();
        event.stopPropagation();
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
      const reason = event.reason;
      const reasonMessage = reason?.message || '';
      const reasonString = String(reason || '');
      
      // Ignore common harmless rejections from browser extensions
      if (
        reasonMessage.includes('runtime.lastError') ||
        reasonMessage.includes('message port closed') ||
        reasonMessage.includes('message channel closed') ||
        reasonMessage.includes('asynchronous response') ||
        reasonString.includes('runtime.lastError') ||
        reasonString.includes('message port closed') ||
        reasonString.includes('message channel closed') ||
        reasonString.includes('asynchronous response') ||
        reasonMessage.includes('Script error')
      ) {
        event.preventDefault();
        event.stopPropagation();
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
        message.includes('message channel closed') ||
        message.includes('asynchronous response') ||
        message.includes('Unchecked runtime.lastError') ||
        (message.includes('Uncaught (in promise)') && message.includes('asynchronous response')) ||
        message.includes('Failed to load resource') ||
        message.includes('404') ||
        message.includes('source map') ||
        message.includes('Failed to load image') ||
        message.includes('EnterpriseImage: Failed to load image') ||
        message.includes('Failed to fetch version for package') ||
        message.includes('sanity') ||
        message.includes('TypeError: Failed to fetch')
      ) {
        return; // Don't log these errors
      }
      
      // Log other errors, but defer to avoid setState during render warnings
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(() => originalConsoleError.apply(console, args));
      } else {
        setTimeout(() => originalConsoleError.apply(console, args), 0);
      }
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
      
      // Log other warnings (defer to avoid render-time updates)
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(() => originalConsoleWarn.apply(console, args));
      } else {
        setTimeout(() => originalConsoleWarn.apply(console, args), 0);
      }
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
