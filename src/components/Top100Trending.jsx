"use client";

import React, { useEffect, useState } from 'react';

function formatPrice(price) {
  if (!price && price !== 0) return '-';
  if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(8)}`;
}

export default function Top100Trending() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const coinsPerPage = 20;

  const fetchTrendingCoins = async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setIsLoadingMore(true);
      
      setError(null);
      
      // Use price change percentage 24h desc as a proxy for trending
      const response = await fetch(`/api/coingecko/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=${coinsPerPage}&page=${page}&sparkline=false&price_change_percentage=24h`);
      if (!response.ok) throw new Error('Failed to fetch trending coins');
      
      const data = await response.json();
      
      if (append) {
        setCoins(prev => [...prev, ...data]);
      } else {
        setCoins(data);
      }
      
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trending coins:', err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTrendingCoins();
    
    // Update every 10 minutes
    const interval = setInterval(() => fetchTrendingCoins(1, false), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadMore = () => {
    if (coins.length < 100 && !isLoadingMore) {
      fetchTrendingCoins(currentPage + 1, true);
    }
  };

  if (loading && coins.length === 0) {
    return (
      <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3">Top 100 Trending</h3>
        <div className="max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-gray-700 rounded"></div>
                  <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                  <div className="w-8 h-3 bg-gray-700 rounded"></div>
                </div>
                <div className="text-right">
                  <div className="w-10 h-3 bg-gray-700 rounded mb-1"></div>
                  <div className="w-8 h-2 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && coins.length === 0) {
    return (
      <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3">Top 100 Trending</h3>
        <div className="text-center py-4">
          <div className="text-xs text-gray-400">Failed to load data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Top 100 Trending</h3>
        <span className="text-[10px] text-gray-500">{coins.length}/100</span>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        <div className="space-y-0.5">
          {coins.map((coin, index) => (
            <div key={`${coin.id}-${index}`} className="flex items-center justify-between py-1 hover:bg-gray-800/30 rounded px-1 transition-colors">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[10px] text-gray-500 w-4 text-center">{index + 1}</span>
                <img 
                  src={coin.image} 
                  alt={coin.name}
                  className="w-3.5 h-3.5 flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-white font-medium truncate">{coin.symbol.toUpperCase()}</div>
                  <div className="text-[9px] text-gray-500 truncate">{coin.name}</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] text-white font-medium">{formatPrice(coin.current_price)}</div>
                <div className={`text-[9px] font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-duniacrypto-green' : 'text-duniacrypto-red'}`}>
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        {coins.length < 100 && (
          <div className="mt-3 pt-2 border-t border-gray-700">
            <button 
              onClick={loadMore}
              disabled={isLoadingMore}
              className="w-full text-[10px] text-gray-400 hover:text-white py-2 px-3 rounded border border-gray-700 hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2.5 h-2.5 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                `Load More (${coins.length}/100)`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
