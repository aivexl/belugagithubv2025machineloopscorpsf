"use client";

import React, { useMemo } from 'react';
import { useHomepageCrypto } from './HomepageCryptoProvider';
import { formatVolume, formatCryptoPrice, formatPercentageChange } from '../utils/numberFormatting';

// ENTERPRISE-LEVEL: Use isolated homepage crypto data
export default function Top100Trending() {
  const { homepageCoins, homepageLoading, homepageError } = useHomepageCrypto();
  
  // Get trending coins (top 10 by volume change)
  // OPTIMIZATION: Memoize the sorting to prevent unnecessary re-calculations on every render
  // and ensure we don't mutate the original homepageCoins array.
  const trendingCoins = useMemo(() => {
    return [...homepageCoins]
      .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
      .slice(0, 10);
  }, [homepageCoins]);

  // Show skeleton if loading, or if there's an error (no internet/API failure), or if no data
  // Data will only show if: not loading AND no error AND we have data
  if (homepageLoading || homepageError || trendingCoins.length === 0) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg shadow p-4 relative mb-8">
        <div className="mb-4 flex justify-center">
          <h3 className="text-lg font-bold text-white">Top Trending</h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2 rounded animate-pulse">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-20"></div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded w-16"></div>
                <div className="h-3 bg-gray-600 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-duniacrypto-panel rounded-lg shadow p-4 relative mb-8">
      <div className="mb-4 flex justify-center">
        <h3 className="text-lg font-bold text-white">Top Trending</h3>
      </div>
      
      {homepageError && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm text-center">
          {homepageError}
        </div>
      )}
      
      {trendingCoins.length > 0 && (
        <div className="space-y-3">
          {trendingCoins.map((coin) => (
            <div key={coin.id} className="flex items-center space-x-3 p-2 rounded hover:bg-duniacrypto-card transition-colors">
              <div className="flex-shrink-0">
                <img 
                  src={coin.image} 
                  alt={coin.symbol} 
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.target.src = '/Asset/duniacrypto.png';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-sm truncate">{coin.name}</span>
                  <span className="text-gray-400 text-xs uppercase">{coin.symbol}</span>
                </div>
                <div className="text-gray-400 text-xs">
                  Volume: {formatVolume(coin.total_volume)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium text-sm">
                  {formatCryptoPrice(coin.current_price)}
                </div>
                <div className={`text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentageChange(coin.price_change_percentage_24h)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
