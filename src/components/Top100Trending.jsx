"use client";

import React, { useEffect, useState } from 'react';
import { getTrendingCoins } from '../lib/CoinGeckoAPI'; // Adjusted import path

function formatPrice(price) {
  if (price >= 1) return '$' + price.toFixed(2);
  if (price >= 0.01) return '$' + price.toFixed(4);
  return '$' + price.toFixed(6);
}

export default function Top100Trending() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 20;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getTrendingCoins();
      setCoins(data);
    } catch (err) {
      console.warn('[Top100Trending] Error fetching data:', err);
      setError('Failed to fetch data, showing fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const totalPages = Math.ceil(coins.length / coinsPerPage);
  const startIndex = (currentPage - 1) * coinsPerPage;
  const endIndex = startIndex + coinsPerPage;
  const currentCoins = coins.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && coins.length === 0) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg shadow p-4 relative mb-8">
        <div className="mb-4 flex justify-center">
          <h3 className="text-lg font-bold text-white">Trending Now</h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2 rounded animate-pulse">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-24"></div>
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
        <h3 className="text-lg font-bold text-white">Trending Now</h3>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm text-center">
          {error}
        </div>
      )}
      
      {coins.length === 0 ? (
        <div className="text-gray-400 text-center">No data available</div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {currentCoins.map((coin) => (
              <div key={coin.item.id} className="flex items-center space-x-3 p-2 rounded hover:bg-duniacrypto-card transition-colors">
                <div className="flex-shrink-0">
                  <img 
                    src={coin.item.large} 
                    alt={coin.item.symbol} 
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${coin.item.symbol}&background=1f2937&color=fff&size=32&bold=true`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{coin.item.name}</span>
                    <span className="text-gray-400 text-sm">{coin.item.symbol.toUpperCase()}</span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    Rank #{coin.item.market_cap_rank} • BTC: {coin.item.price_btc.toFixed(8)}
                  </div>
                </div>
                <div className="text-right text-gray-400 text-xs">
                  <div>Trending #{coin.item.market_cap_rank}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mb-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-duniacrypto-card text-white rounded hover:bg-duniacrypto-card/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      page === currentPage
                        ? 'bg-duniacrypto-green text-black'
                        : 'bg-duniacrypto-card text-white hover:bg-duniacrypto-card/80'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-duniacrypto-card text-white rounded hover:bg-duniacrypto-card/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
