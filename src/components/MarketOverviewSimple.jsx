"use client";

import React from 'react';
import { useHomepageCrypto } from './HomepageCryptoProvider';

// Utility functions
const formatNumber = (num) => {
  if (!num && num !== 0) return '-';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toFixed(1)}`;
};

const formatPercentage = (num) => {
  if (num === null || num === undefined) return '-';
  const isPositive = num >= 0;
  return (
    <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
      {isPositive ? '+' : ''}{num.toFixed(1)}%
    </span>
  );
};

// Simplified Market Overview Component - Uses HomepageCryptoProvider
export default function MarketOverviewSimple() {
  const { homepageGlobal, homepageLoading, homepageError } = useHomepageCrypto();
  
  // Show skeleton if loading, or if there's an error (no internet/API failure), or if no global data
  // Data will only show if: not loading AND no error AND we have global data
  if (homepageLoading || homepageError || !homepageGlobal) {
    return (
      <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
        {/* Market Cap Skeleton */}
        <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
          <div className="h-3 bg-gray-700 rounded w-20 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-700 rounded w-24 mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>

        {/* Volume Skeleton */}
        <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
          <div className="h-3 bg-gray-700 rounded w-16 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-700 rounded w-24 mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-700 rounded w-20 animate-pulse"></div>
        </div>

        {/* BTC Dominance Skeleton */}
        <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
          <div className="h-3 bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-700 rounded w-12 mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const { total_market_cap, total_volume, market_cap_change_percentage_24h_usd, active_cryptocurrencies, market_cap_percentage } = homepageGlobal || {};
  
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
      {/* Market Cap */}
      <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
        <h3 className="text-xs font-semibold text-gray-300 mb-0.5 sm:mb-1 md:mb-1.5">Market Cap</h3>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 md:mb-1 leading-tight">
          {formatNumber(total_market_cap?.usd)}
        </div>
        <div className="text-xs text-gray-400 leading-tight">
          24h: {formatPercentage(market_cap_change_percentage_24h_usd)}
        </div>
      </div>

      {/* Volume */}
      <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
        <h3 className="text-xs font-semibold text-gray-300 mb-0.5 sm:mb-1 md:mb-1.5">Volume</h3>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 md:mb-1 leading-tight">
          {formatNumber(total_volume?.usd)}
        </div>
        <div className="text-xs text-gray-400 leading-tight">
          Active: {active_cryptocurrencies?.toLocaleString() || '-'}
        </div>
      </div>

      {/* BTC Dominance */}
      <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
        <h3 className="text-xs font-semibold text-gray-300 mb-0.5 sm:mb-1 md:mb-1.5">BTC Dominance</h3>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 md:mb-1 leading-tight">
          {market_cap_percentage?.btc ? `${market_cap_percentage.btc.toFixed(1)}%` : '-'}
        </div>
        <div className="text-xs text-gray-400 leading-tight">
          ETH: {market_cap_percentage?.eth ? `${market_cap_percentage.eth.toFixed(1)}%` : '-'}
        </div>
      </div>
    </div>
  );
}
