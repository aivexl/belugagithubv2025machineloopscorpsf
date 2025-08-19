"use client";

import React from 'react';
import { useHomepageCrypto } from './HomepageCryptoProvider';

function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

function formatPrice(price) {
  if (price >= 1) return '$' + price.toFixed(2);
  if (price >= 0.01) return '$' + price.toFixed(4);
  return '$' + price.toFixed(6);
}

export default function Top10MarketCap() {
  // ENTERPRISE-LEVEL: Use isolated homepage crypto data
  const { getTop10ByMarketCap, homepageLoading, homepageError } = useHomepageCrypto();
  
  // Get top 10 coins by market cap from isolated data source
  const marketCapCoins = getTop10ByMarketCap();

  if (homepageLoading && marketCapCoins.length === 0) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg shadow p-4 relative mb-8">
        <div className="mb-4 flex justify-center">
          <h3 className="text-lg font-bold text-white">Top 10 Market Cap</h3>
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
        <h3 className="text-lg font-bold text-white">Top 10 Market Cap</h3>
      </div>
      
      {homepageError && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm text-center">
          {homepageError}
        </div>
      )}
      
      {marketCapCoins.length === 0 ? (
        <div className="text-gray-400 text-center">No data available</div>
      ) : (
        <div className="space-y-3">
          {marketCapCoins.map((coin) => (
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
                  Market Cap: {formatNumber(coin.market_cap)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium text-sm">
                  {formatPrice(coin.current_price)}
                </div>
                <div className={`text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
