"use client";

import React, { useEffect, useState } from 'react';
import { useCoinGecko } from './CoinGeckoContext';
import OverviewContainer from './OverviewContainer';

function formatNumber(num) {
  if (!num && num !== 0) return '-';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString();
}

export default function MarketOverviewContainer() {
  const { global, loading } = useCoinGecko();

  if (loading && !global) {
    return (
      <OverviewContainer title="Market Overview">
        <div className="animate-pulse text-gray-400">
          Loading market overview...
        </div>
      </OverviewContainer>
    );
  }

  const { total_market_cap, total_volume, market_cap_change_percentage_24h } = global || {};

  return (
    <OverviewContainer title="Market Overview">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Total Market Cap</span>
          <span className="text-white font-semibold">${formatNumber(total_market_cap?.usd)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">24h Volume</span>
          <span className="text-white font-semibold">${formatNumber(total_volume?.usd)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">24h Change</span>
          <span className={`font-semibold ${
            market_cap_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {market_cap_change_percentage_24h?.toFixed(2)}%
          </span>
        </div>
      </div>
    </OverviewContainer>
  );
} 