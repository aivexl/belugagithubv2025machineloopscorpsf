"use client";

import React, { useEffect, useRef, useState } from 'react';
import { getTop10MarketCap } from '@/lib/coingeckoConfig';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CryptoTicker() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceFlash, setPriceFlash] = useState({});
  const tickerRef = useRef();
  const prevPrices = useRef({});

  // Fetch real data from CoinGecko API
  useEffect(() => {
    const fetchTop10Data = async () => {
      setLoading(true);
      try {
        const data = await getTop10MarketCap();
        if (data && Array.isArray(data)) {
          setCoins(data);
        } else {
          // Fallback to dummy data if API fails
          setCoins(generateFallbackData());
        }
      } catch (error) {
        console.error('Error fetching from CoinGecko:', error);
        // Fallback to dummy data
        setCoins(generateFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchTop10Data();
    
    // Update every 5 minutes
    const interval = setInterval(fetchTop10Data, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate fallback data when API fails
  function generateFallbackData() {
    const baseData = [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 43250 + (Math.random() - 0.5) * 1000,
        price_change_percentage_24h: 2.5 + (Math.random() - 0.5) * 4,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 2650 + (Math.random() - 0.5) * 200,
        price_change_percentage_24h: 1.8 + (Math.random() - 0.5) * 3,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
      },
      {
        id: 'tether',
        symbol: 'usdt',
        name: 'Tether',
        current_price: 1.001 + (Math.random() - 0.5) * 0.002,
        price_change_percentage_24h: 0.0 + (Math.random() - 0.5) * 0.1,
        image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png'
      },
      {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
        current_price: 98 + (Math.random() - 0.5) * 10,
        price_change_percentage_24h: -0.8 + (Math.random() - 0.5) * 4,
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
      },
      {
        id: 'bnb',
        symbol: 'bnb',
        name: 'BNB',
        current_price: 320 + (Math.random() - 0.5) * 30,
        price_change_percentage_24h: 0.5 + (Math.random() - 0.5) * 3,
        image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png'
      },
      {
        id: 'xrp',
        symbol: 'xrp',
        name: 'XRP',
        current_price: 0.55 + (Math.random() - 0.5) * 0.1,
        price_change_percentage_24h: 1.2 + (Math.random() - 0.5) * 3,
        image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png'
      },
      {
        id: 'usdc',
        symbol: 'usdc',
        name: 'USD Coin',
        current_price: 1.001 + (Math.random() - 0.5) * 0.002,
        price_change_percentage_24h: 0.0 + (Math.random() - 0.5) * 0.1,
        image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png'
      },
      {
        id: 'cardano',
        symbol: 'ada',
        name: 'Cardano',
        current_price: 0.45 + (Math.random() - 0.5) * 0.1,
        price_change_percentage_24h: -1.5 + (Math.random() - 0.5) * 4,
        image: 'https://assets.coingecko.com/coins/images/975/large/Cardano.png'
      },
      {
        id: 'avalanche',
        symbol: 'avax',
        name: 'Avalanche',
        current_price: 35 + (Math.random() - 0.5) * 5,
        price_change_percentage_24h: 0.8 + (Math.random() - 0.5) * 4,
        image: 'https://assets.coingecko.com/coins/images/12559/large/avalanche-avax-logo.png'
      },
      {
        id: 'dogecoin',
        symbol: 'doge',
        name: 'Dogecoin',
        current_price: 0.085 + (Math.random() - 0.5) * 0.015,
        price_change_percentage_24h: 1.5 + (Math.random() - 0.5) * 4,
        image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png'
      }
    ];

    return baseData;
  }

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
        Loading top 10 crypto prices from CoinGecko...
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
                  // Fallback to ui-avatars if image fails
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(coin.symbol)}&background=1f2937&color=fff&size=20&bold=true`;
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