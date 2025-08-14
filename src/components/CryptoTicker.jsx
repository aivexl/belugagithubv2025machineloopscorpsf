"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useCoinGecko } from './CoinGeckoContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CryptoTicker() {
  const { coins, loading } = useCoinGecko();
  const [priceFlash, setPriceFlash] = useState({});
  const tickerRef = useRef();
  const prevPrices = useRef({});

  // Detect price changes for flash effects
  useEffect(() => {
    if (!coins || coins.length === 0) return;
    
    const flash = {};
    coins.forEach((coin) => {
      const prev = prevPrices.current[coin.symbol];
      if (prev !== undefined && prev !== coin.current_price) {
        flash[coin.symbol] = coin.current_price > prev ? 'up' : 'down';
      }
    });
    
    if (Object.keys(flash).length > 0) {
      setPriceFlash(flash);
      // Clear flash after delay
      const timeout = setTimeout(() => setPriceFlash({}), 300);
      return () => clearTimeout(timeout);
    }
    
    // Update price references
    const newPrev = {};
    coins.forEach((coin) => { 
      newPrev[coin.symbol] = coin.current_price; 
    });
    prevPrices.current = newPrev;
  }, [coins]);

  // Simple CSS-based animation - more reliable
  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker || !coins || coins.length === 0) return;

    // Calculate total width for animation
    const calculateWidth = () => {
      let totalWidth = 0;
      const items = ticker.children;
      for (let i = 0; i < items.length / 2; i++) { // Only count first half (original items)
        totalWidth += items[i]?.offsetWidth || 200; // fallback width
      }
      return Math.max(totalWidth, 800); // minimum width
    };

    // Set CSS custom property for animation
    const updateAnimation = () => {
      const width = calculateWidth();
      ticker.style.setProperty('--ticker-width', `${width}px`);
      // Slower, consistent speed across widths using pixels/second
      const SPEED_PX_PER_SEC = 20; // lower = slower
      const durationSeconds = Math.max(Math.round(width / SPEED_PX_PER_SEC), 40); // ensure a minimum
      ticker.style.setProperty('--animation-duration', `${durationSeconds}s`);
    };

    // Initial setup
    requestAnimationFrame(updateAnimation);
    
    // Update on window resize (with safety check)
    const handleResize = () => requestAnimationFrame(updateAnimation);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [coins]);

  // Show loading state only if no data available
  if (loading && (!coins || coins.length === 0)) {
    return (
      <div className="bg-duniacrypto-panel border-b border-gray-800 py-3 animate-pulse text-center text-gray-400 text-sm">
        Loading crypto prices...
      </div>
    );
  }

  const tickerItems = coins || [];
  
  if (tickerItems.length === 0) {
    return (
      <div className="bg-duniacrypto-panel border-b border-gray-800 py-3 text-center text-gray-500 text-sm">
        No crypto data available
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full bg-duniacrypto-panel border-b border-gray-800 py-2 md:py-3">
      <div
        ref={tickerRef}
        className="crypto-ticker-track"
        style={{
          '--ticker-width': '800px',
          '--animation-duration': '30s'
        }}
      >
        {/* Duplicate items for seamless looping */}
        {[...tickerItems, ...tickerItems].map((coin, i) => {
          const isFlashUp = priceFlash[coin.symbol] === 'up';
          const isFlashDown = priceFlash[coin.symbol] === 'down';
          const isPositive = coin.price_change_percentage_24h >= 0;
          
          return (
            <div
              key={`${coin.id}-${i}`}
              className="crypto-ticker-item"
            >
              <img 
                src={coin.image} 
                alt={coin.symbol} 
                className="w-5 h-5 rounded-full flex-shrink-0" 
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="font-bold uppercase text-sm text-white tracking-wide">
                {coin.symbol}
              </span>
              <span className="text-sm font-medium">
                <span
                  className={classNames(
                    'transition-all duration-300 px-2 py-0.5 rounded',
                    isFlashUp && 'bg-green-500/20 text-green-400',
                    isFlashDown && 'bg-red-500/20 text-red-400',
                    !isFlashUp && !isFlashDown && 'text-white'
                  )}
                >
                  ${typeof coin.current_price === 'number' ? coin.current_price.toLocaleString('en-US', {
                    minimumFractionDigits: coin.current_price < 1 ? 4 : 2,
                    maximumFractionDigits: coin.current_price < 1 ? 6 : 2
                  }) : '0'}
                </span>
              </span>
              <span
                className={classNames(
                  'text-sm font-semibold transition-colors duration-300',
                  isPositive ? 'text-duniacrypto-green' : 'text-duniacrypto-red'
                )}
              >
                {isPositive ? '+' : ''}
                {typeof coin.price_change_percentage_24h === 'number' ? coin.price_change_percentage_24h.toFixed(2) : '0.00'}%
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Loading overlay when data is updating */}
      {loading && tickerItems.length > 0 && (
        <div className="absolute top-2 right-2 opacity-60">
          <div className="w-3 h-3 border border-duniacrypto-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
} 