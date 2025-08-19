"use client";

import React, { useEffect, useState } from 'react';

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
  // ISOLATED DATA SOURCE: Use separate state to prevent overwriting AssetClient data
  const [marketCapCoins, setMarketCapCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use proxy route to avoid CORS and server crashes
      const response = await fetch('/api/coingecko-proxy/coins');
      if (response.ok) {
        const data = await response.json();
        setMarketCapCoins(data.slice(0, 10)); // Get top 10 for market cap (isolated data source)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.warn('[Top10MarketCap] Error fetching data:', err);
      setError('Failed to fetch data, showing fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && marketCapCoins.length === 0) {
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
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm text-center">
          {error}
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
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=1f2937&color=fff&size=32&bold=true`;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{coin.name}</span>
                  <span className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</span>
                </div>
                <div className="text-gray-400 text-xs">
                  Rank #{coin.market_cap_rank} • {formatNumber(coin.circulating_supply)} {coin.symbol.toUpperCase()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{formatPrice(coin.current_price)}</div>
                <div className={`text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
              <div className="text-right text-gray-400 text-xs">
                <div>MC: {formatNumber(coin.market_cap)}</div>
                <div>Vol: {formatNumber(coin.total_volume)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
