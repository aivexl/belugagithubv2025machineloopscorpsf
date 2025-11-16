"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useHomepageCrypto } from './HomepageCryptoProvider';
import { formatCryptoPrice, formatPercentageChange } from '../utils/numberFormatting';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CryptoTicker() {
  // ENTERPRISE-LEVEL: Use isolated homepage crypto data
  const { homepageCoins, homepageLoading, homepageError } = useHomepageCrypto();
  
  // Get top 10 coins for ticker from isolated data source
  const tickerCoins = homepageCoins.slice(0, 10);
  
  const [priceFlash, setPriceFlash] = useState({});
  const tickerRef = useRef();
  const prevPrices = useRef({});

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

  // Show skeleton if loading, or if there's an error (no internet/API failure), or if no data
  // Data will only show if: not loading AND no error AND we have data
  if (homepageLoading || homepageError || tickerCoins.length === 0) {
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
              {formatCryptoPrice(coin.current_price)}
            </span>
            <span className={classNames(
              'text-xs',
              coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {formatPercentageChange(coin.price_change_percentage_24h)}
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
              {formatCryptoPrice(coin.current_price)}
            </span>
            <span className={classNames(
              'text-xs',
              coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {formatPercentageChange(coin.price_change_percentage_24h)}
            </span>
          </div>
        ))}
      </div>
      
      {homepageError && (
        <div className="absolute top-0 right-2 text-red-400 text-xs bg-red-900/20 px-2 py-1 rounded">
          ⚠️ Data error
        </div>
      )}
    </div>
  );
} 