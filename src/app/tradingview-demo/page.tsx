"use client";

import React, { useState } from 'react';
import TradingViewSearch from '../../components/TradingViewSearch';
import TradingViewCoinInfo from '../../components/TradingViewCoinInfo';

export default function TradingViewDemoPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            TradingView Coin Information
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive cryptocurrency information powered by TradingView API. 
            Search for any crypto symbol to get detailed market data, exchange information, and more.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">Search Cryptocurrencies</h2>
            <TradingViewSearch 
              onSymbolSelect={setSelectedSymbol}
              placeholder="Try searching for: BTCUSD, ETHUSD, ADAUSD, DOTUSD..."
            />
          </div>
        </div>

        {/* Selected Symbol Info */}
        {selectedSymbol && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">
                Information for: {selectedSymbol}
              </h2>
              <button
                onClick={() => setSelectedSymbol('')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Clear
              </button>
            </div>
            <TradingViewCoinInfo symbol={selectedSymbol} showExchanges={true} />
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Search</h3>
            <p className="text-gray-400">
              Search through thousands of cryptocurrency symbols with real-time results and detailed information.
            </p>
          </div>

          <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Market Data</h3>
            <p className="text-gray-400">
              Get comprehensive market data including price, volume, market cap, and 24-hour statistics.
            </p>
          </div>

          <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Exchange Information</h3>
            <p className="text-gray-400">
              View detailed information about exchanges where the cryptocurrency is traded.
            </p>
          </div>

          <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Fast & Reliable</h3>
            <p className="text-gray-400">
              Built with modern web technologies for fast loading and reliable data delivery.
            </p>
          </div>

          <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">User Friendly</h3>
            <p className="text-gray-400">
              Clean, intuitive interface designed for both beginners and experienced traders.
            </p>
          </div>

          <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Reusable Components</h3>
            <p className="text-gray-400">
              Modular components that can be easily integrated into any part of your application.
            </p>
          </div>
        </div>

        {/* Popular Symbols */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Popular Symbols</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['BTCUSD', 'ETHUSD', 'ADAUSD', 'DOTUSD', 'LINKUSD', 'LTCUSD'].map((symbol) => (
              <button
                key={symbol}
                onClick={() => setSelectedSymbol(symbol)}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-4 text-center transition-colors"
              >
                <p className="text-white font-semibold">{symbol}</p>
                <p className="text-gray-400 text-sm">Click to view</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 