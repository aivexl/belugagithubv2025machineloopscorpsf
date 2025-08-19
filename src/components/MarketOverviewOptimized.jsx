"use client";

import React, { useState, useEffect, useRef } from 'react';

// Enterprise-level fallback data
const FALLBACK_MARKET_DATA = {
  total_market_cap: { usd: 2500000000000 },
  total_volume: { usd: 80000000000 },
  market_cap_change_percentage_24h_usd: 2.5,
  active_cryptocurrencies: 2500,
  market_cap_percentage: {
    btc: 48.5,
    eth: 18.2
  }
};

// Utility functions
const formatNumber = (num) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toFixed(1)}`;
};

const formatPercentage = (num) => {
  const isPositive = num >= 0;
  return (
    <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
      {isPositive ? '+' : ''}{num.toFixed(1)}%
    </span>
  );
};

// Optimized Market Overview Component
export default function MarketOverviewOptimized() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Robust fetch with multiple fallback endpoints
  const fetchMarketData = async () => {
    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Try multiple API endpoints for redundancy
      const endpoints = [
        '/api/coingecko-proxy/global',
        '/api/coingecko/global',
        '/api/dummy-data?type=market'
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(10000)
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data && (data.data || data.total_market_cap)) {
              setMarketData(data.data || data);
              setError(null);
              return;
            }
          }
        } catch (endpointError) {
          console.warn(`Endpoint ${endpoint} failed:`, endpointError.message);
          continue;
        }
      }

      // All endpoints failed, use fallback data
      throw new Error('All API endpoints failed');

    } catch (error) {
      console.error('Market data fetch failed:', error);
      setError(error.message);
      setMarketData(FALLBACK_MARKET_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-4 h-12 sm:h-14 md:h-16 lg:h-20">
            <div className="animate-pulse">
              <div className="h-1 sm:h-1.5 md:h-2 bg-gray-700 rounded w-2/3 mb-1 sm:mb-1.5 md:mb-2"></div>
              <div className="h-2 sm:h-3 md:h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Use available data (market data or fallback)
  const data = marketData || FALLBACK_MARKET_DATA;

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
      {/* Market Cap */}
      <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
        <h3 className="text-xs font-semibold text-gray-300 mb-0.5 sm:mb-1 md:mb-1.5">Market Cap</h3>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 md:mb-1 leading-tight">
          {formatNumber(data.total_market_cap?.usd || 0)}
        </div>
        <div className="text-xs text-gray-400 leading-tight">
          24h: {formatPercentage(data.market_cap_change_percentage_24h_usd || 0)}
        </div>
      </div>

      {/* Volume */}
      <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
        <h3 className="text-xs font-semibold text-gray-300 mb-0.5 sm:mb-1 md:mb-1.5">Volume</h3>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 md:mb-1 leading-tight">
          {formatNumber(data.total_volume?.usd || 0)}
        </div>
        <div className="text-xs text-gray-400 leading-tight">
          Active: {(data.active_cryptocurrencies || 0).toLocaleString()}
        </div>
      </div>

      {/* BTC Dominance */}
      <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
        <h3 className="text-xs font-semibold text-gray-300 mb-0.5 sm:mb-1 md:mb-1.5">BTC Dominance</h3>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 md:mb-1 leading-tight">
          {(data.market_cap_percentage?.btc || 0).toFixed(1)}%
        </div>
        <div className="text-xs text-gray-400 leading-tight">
          ETH: {(data.market_cap_percentage?.eth || 0).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
