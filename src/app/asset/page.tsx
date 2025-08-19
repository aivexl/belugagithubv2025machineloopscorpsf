"use client";

import React from 'react';

// Simple asset page to prevent 500 errors
export default function AssetPage() {
  return (
    <div className="min-h-screen bg-duniacrypto-panel p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Asset Management</h1>
        
        {/* Simple loading state */}
        <div className="bg-duniacrypto-panel rounded-lg border border-gray-700 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg mb-4">Loading Asset Components...</p>
            <p className="text-gray-400 text-sm">Please wait while we load the asset management system</p>
          </div>
        </div>
        
        {/* Placeholder content */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-duniacrypto-panel rounded-lg border border-gray-700 p-4 animate-pulse">
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 