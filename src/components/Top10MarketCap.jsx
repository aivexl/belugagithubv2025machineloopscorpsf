"use client";

import React, { useEffect, useState } from 'react';

function formatNumber(num) {
  if (!num && num !== 0) return '-';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString();
}

function formatPrice(price) {
  if (!price && price !== 0) return '-';
  if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(8)}`;
}

export default function Top10MarketCap() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTop10 = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/coingecko/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        if (!response.ok) throw new Error('Failed to fetch top 10 coins');
        const data = await response.json();
        setCoins(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching top 10 coins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTop10();
    
    // Update every 5 minutes
    const interval = setInterval(fetchTop10, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3">Top 10 Market Cap</h3>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-700 rounded"></div>
                <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-3 bg-gray-700 rounded"></div>
              </div>
              <div className="text-right">
                <div className="w-12 h-3 bg-gray-700 rounded mb-1"></div>
                <div className="w-8 h-2 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3">Top 10 Market Cap</h3>
        <div className="text-center py-4">
          <div className="text-xs text-gray-400">Failed to load data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-bold text-white mb-3">Top 10 Market Cap</h3>
      <div className="space-y-1">
        {coins.map((coin, index) => (
          <div key={coin.id} className="flex items-center justify-between py-1.5 hover:bg-gray-800/30 rounded px-1 transition-colors">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-[10px] text-gray-500 w-3 text-center">{index + 1}</span>
              <img 
                src={coin.image} 
                alt={coin.name}
                className="w-4 h-4 flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-white font-medium">{coin.symbol.toUpperCase()}</div>
                <div className="text-[10px] text-gray-400">${formatNumber(coin.market_cap)}</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[11px] text-white font-medium">{formatPrice(coin.current_price)}</div>
              <div className={`text-[10px] font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-duniacrypto-green' : 'text-duniacrypto-red'}`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
