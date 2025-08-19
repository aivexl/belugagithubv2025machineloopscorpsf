"use client";

import React, { useEffect, useRef, useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CryptoTicker() {
  // ISOLATED DATA SOURCE: Use separate state to prevent overwriting AssetClient data
  const [tickerCoins, setTickerCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceFlash, setPriceFlash] = useState({});
  const tickerRef = useRef();
  const prevPrices = useRef({});

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use proxy route to avoid CORS and server crashes
      const response = await fetch('/api/coingecko-proxy/coins');
      if (response.ok) {
        const data = await response.json();
        setTickerCoins(data.slice(0, 10)); // Get top 10 for ticker (isolated data source)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.warn('[CryptoTicker] Error fetching data:', err);
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

  // Update price flash effect when tickerCoins change
  useEffect(() => {
    tickerCoins.forEach(coin => {
      const prevPrice = prevPrices.current[coin.id];
      if (prevPrice && prevPrice !== coin.current_price) {
        setPriceFlash(prev => ({
          ...prev,
          [coin.id]: prevPrice < coin.current_price ? 'up' : 'down'
        }));
        
        // Clear flash after animation
        setTimeout(() => {
          setPriceFlash(prev => {
            const newFlash = { ...prev };
            delete newFlash[coin.id];
            return newFlash;
          });
        }, 1000);
      }
      prevPrices.current[coin.id] = coin.current_price;
    });
  }, [tickerCoins]);

  if (loading && tickerCoins.length === 0) {
    return (
      <div className="bg-duniacrypto-panel border-b border-gray-800 py-2 overflow-hidden">
        <div className="flex space-x-8 animate-pulse">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              <div className="w-16 h-4 bg-gray-600 rounded"></div>
              <div className="w-12 h-4 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tickerCoins.length === 0) {
    return (
      <div className="bg-duniacrypto-panel border-b border-gray-800 py-2 text-center text-gray-400">
        No crypto data available
      </div>
    );
  }

  return (
    <div className="bg-duniacrypto-panel border-b border-gray-800 py-2 overflow-hidden" ref={tickerRef}>
      <div className="animate-scroll">
        {/* First set of coins */}
        {tickerCoins.map((coin) => (
          <div key={coin.id} className="flex items-center space-x-2 flex-shrink-0 mx-4">
            <img 
              src={coin.image} 
              alt={coin.symbol} 
              className="w-4 h-4 rounded-full"
              onError={(e) => {
                if (e.currentTarget) {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=1f2937&color=fff&size=16&bold=true`;
                }
              }}
            />
            <span className="text-white font-medium text-sm">{coin.symbol.toUpperCase()}</span>
            <span className={classNames(
              'text-sm font-medium transition-all duration-300',
              priceFlash[coin.id] === 'up' ? 'text-green-400 scale-110' : '',
              priceFlash[coin.id] === 'down' ? 'text-red-400 scale-110' : '',
              !priceFlash[coin.id] ? 'text-gray-300' : ''
            )}>
              ${coin.current_price >= 1 ? coin.current_price.toFixed(2) : coin.current_price.toFixed(6)}
            </span>
            <span className={classNames(
              'text-xs',
              coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        ))}
        
        {/* Duplicate set for seamless loop */}
        {tickerCoins.map((coin) => (
          <div key={`${coin.id}-duplicate`} className="flex items-center space-x-2 flex-shrink-0 mx-4">
            <img 
              src={coin.image} 
              alt={coin.symbol} 
              className="w-4 h-4 rounded-full"
              onError={(e) => {
                if (e.currentTarget) {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=1f2937&color=fff&size=16&bold=true`;
                }
              }}
            />
            <span className="text-white font-medium text-sm">{coin.symbol.toUpperCase()}</span>
            <span className={classNames(
              'text-sm font-medium transition-all duration-300',
              priceFlash[coin.id] === 'up' ? 'text-green-400 scale-110' : '',
              priceFlash[coin.id] === 'down' ? 'text-red-400 scale-110' : '',
              !priceFlash[coin.id] ? 'text-gray-300' : ''
            )}>
              ${coin.current_price >= 1 ? coin.current_price.toFixed(2) : coin.current_price.toFixed(6)}
            </span>
            <span className={classNames(
              'text-xs',
              coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="absolute top-0 right-2 text-red-400 text-xs bg-red-900/20 px-2 py-1 rounded">
          ⚠️ Data error
        </div>
      )}
    </div>
  );
} 