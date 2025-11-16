"use client";

import React, { useState, useEffect, useRef } from 'react';

// Removed fallback data - show skeleton instead when API fails

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
  const isFetchingRef = useRef(false);

  // Robust fetch - no fallback data
  const fetchMarketData = async () => {
    // Prevent duplicate requests
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Try API endpoint only (no dummy data fallback)
      const response = await fetch('/api/coingecko-proxy/global', {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && (data.data || data.total_market_cap)) {
        setMarketData(data.data || data);
        setError(null);
        setLoading(false); // Set loading to false after successful fetch
      } else {
        throw new Error('Invalid data structure received');
      }

    } catch (error) {
      console.error('Market data fetch failed:', error);
      setError(error.message);
      // DO NOT use fallback data - show skeleton instead
      setMarketData(null);
      setLoading(true); // Keep loading to show skeleton, not dummy data
    } finally {
      isFetchingRef.current = false;
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

  // Show skeleton if loading or no data (error/no internet)
  if (loading || !marketData) {
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

  // Use only real data from API (no fallback)
  const data = marketData;

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
