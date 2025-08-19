"use client";

import React from 'react';

// Static fallback data - no API calls, no webpack issues
const MARKET_DATA = {
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

// Simplified Market Overview Component - No API calls, no webpack issues
export default function MarketOverviewSimple() {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
      {/* Market Cap */}
      <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
        <h3 className="text-xs font-semibold text-gray-300 mb-0.5 sm:mb-1 md:mb-1.5">Market Cap</h3>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 md:mb-1 leading-tight">
          {formatNumber(MARKET_DATA.total_market_cap.usd)}
        </div>
        <div className="text-xs text-gray-400 leading-tight">
          24h: {formatPercentage(MARKET_DATA.market_cap_change_percentage_24h_usd)}
        </div>
      </div>

      {/* Volume */}
      <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
        <h3 className="text-xs font-semibold text-gray-300 mb-0.5 sm:mb-1 md:mb-1.5">Volume</h3>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 md:mb-1 leading-tight">
          {formatNumber(MARKET_DATA.total_volume.usd)}
        </div>
        <div className="text-xs text-gray-400 leading-tight">
          Active: {MARKET_DATA.active_cryptocurrencies.toLocaleString()}
        </div>
      </div>

      {/* BTC Dominance */}
      <div className="bg-duniacrypto-panel rounded-md sm:rounded-lg border border-gray-700 p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]">
        <h3 className="text-xs font-semibold text-gray-300 mb-0.5 sm:mb-1 md:mb-1.5">BTC Dominance</h3>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 md:mb-1 leading-tight">
          {MARKET_DATA.market_cap_percentage.btc.toFixed(1)}%
        </div>
        <div className="text-xs text-gray-400 leading-tight">
          ETH: {MARKET_DATA.market_cap_percentage.eth.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
