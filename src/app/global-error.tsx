'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-duniacrypto-background flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🚨</div>
            <h1 className="text-4xl font-bold text-white mb-4">Something went wrong!</h1>
            <p className="text-gray-400 text-lg mb-8">
              We're experiencing technical difficulties. Please try again.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => reset()}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                Try again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                Go to Home
              </button>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              <p>Error ID: {error.digest || 'Unknown'}</p>
              <p>If the problem persists, please contact support.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
