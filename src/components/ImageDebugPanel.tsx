"use client";

import React, { useState } from 'react';

interface ImageDebugPanelProps {
  articles: any[];
  isVisible: boolean;
  onClose: () => void;
}

/**
 * Enterprise-Level Image Debug Panel
 * Provides real-time debugging information for image loading issues
 */
export default function ImageDebugPanel({ articles, isVisible, onClose }: ImageDebugPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'raw'>('overview');

  if (!isVisible) return null;

  const totalArticles = articles?.length || 0;
  const articlesWithImages = articles?.filter(article => 
    article.mainImage && article.mainImage !== '/Asset/duniacrypto.png'
  ) || [];
  const articlesWithoutImages = articles?.filter(article => 
    !article.mainImage || article.mainImage === '/Asset/duniacrypto.png'
  ) || [];

  return (
    <div className="fixed top-4 right-4 w-96 max-h-[80vh] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm">🔍 Image Debug Panel</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'details'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'raw'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Raw Data
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-[60vh]">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-white font-medium text-sm mb-2">📊 Summary</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Articles:</span>
                  <span className="text-white">{totalArticles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">With Images:</span>
                  <span className="text-green-400">{articlesWithImages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Without Images:</span>
                  <span className="text-red-400">{articlesWithoutImages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Success Rate:</span>
                  <span className={`font-medium ${
                    totalArticles > 0 ? (articlesWithImages.length / totalArticles * 100).toFixed(1) + '%' : '0%'
                  }`}>
                    {totalArticles > 0 ? (articlesWithImages.length / totalArticles * 100).toFixed(1) + '%' : '0%'}
                  </span>
                </div>
              </div>
            </div>

            {articlesWithoutImages.length > 0 && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                <h4 className="text-red-400 font-medium text-sm mb-2">⚠️ Articles Without Images</h4>
                <div className="space-y-1">
                  {articlesWithoutImages.slice(0, 3).map((article, index) => (
                    <div key={index} className="text-red-300 text-xs">
                      • {article.title || 'Untitled'} (ID: {article._id})
                    </div>
                  ))}
                  {articlesWithoutImages.length > 3 && (
                    <div className="text-red-400 text-xs">
                      +{articlesWithoutImages.length - 3} more...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-3">
            {articles?.slice(0, 5).map((article, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3">
                <h4 className="text-white font-medium text-xs mb-2">{article.title || 'Untitled'}</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Image URL:</span>
                    <span className={`${
                      article.mainImage && article.mainImage !== '/Asset/duniacrypto.png' 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {article.mainImage ? 'Available' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sanity Image:</span>
                    <span className={`${
                      article.image?.asset?._ref ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {article.image?.asset?._ref ? 'Present' : 'Missing'}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs truncate">
                    Ref: {article.image?.asset?._ref || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-white font-medium text-sm mb-2">🔧 Raw Data Sample</h4>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(articles?.[0] || {}, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          Debug Panel • {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
