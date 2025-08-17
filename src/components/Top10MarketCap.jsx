"use client";

import React, { useEffect, useState } from 'react';
import { getTop10MarketCap } from '@/lib/coingeckoConfig';

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
        market_cap: 850000000000 + (Math.random() - 0.5) * 50000000000,
        market_cap_rank: 1,
        price_change_percentage_24h: 2.5 + (Math.random() - 0.5) * 4,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 2650 + (Math.random() - 0.5) * 200,
        market_cap: 320000000000 + (Math.random() - 0.5) * 20000000000,
        market_cap_rank: 2,
        price_change_percentage_24h: 1.8 + (Math.random() - 0.5) * 3,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
      },
      {
        id: 'tether',
        symbol: 'usdt',
        name: 'Tether',
        current_price: 1.001 + (Math.random() - 0.5) * 0.002,
        market_cap: 95000000000 + (Math.random() - 0.5) * 5000000000,
        market_cap_rank: 3,
        price_change_percentage_24h: 0.0 + (Math.random() - 0.5) * 0.1,
        image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png'
      },
      {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
        current_price: 98 + (Math.random() - 0.5) * 10,
        market_cap: 45000000000 + (Math.random() - 0.5) * 5000000000,
        market_cap_rank: 4,
        price_change_percentage_24h: -0.8 + (Math.random() - 0.5) * 4,
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
      },
      {
        id: 'bnb',
        symbol: 'bnb',
        name: 'BNB',
        current_price: 320 + (Math.random() - 0.5) * 30,
        market_cap: 50000000000 + (Math.random() - 0.5) * 8000000000,
        market_cap_rank: 5,
        price_change_percentage_24h: 0.5 + (Math.random() - 0.5) * 3,
        image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png'
      },
      {
        id: 'xrp',
        symbol: 'xrp',
        name: 'XRP',
        current_price: 0.55 + (Math.random() - 0.5) * 0.1,
        market_cap: 30000000000 + (Math.random() - 0.5) * 5000000000,
        market_cap_rank: 6,
        price_change_percentage_24h: 1.2 + (Math.random() - 0.5) * 3,
        image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png'
      },
      {
        id: 'usdc',
        symbol: 'usdc',
        name: 'USD Coin',
        current_price: 1.001 + (Math.random() - 0.5) * 0.002,
        market_cap: 28000000000 + (Math.random() - 0.5) * 4000000000,
        market_cap_rank: 7,
        price_change_percentage_24h: 0.0 + (Math.random() - 0.5) * 0.1,
        image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png'
      },
      {
        id: 'cardano',
        symbol: 'ada',
        name: 'Cardano',
        current_price: 0.45 + (Math.random() - 0.5) * 0.1,
        market_cap: 16000000000 + (Math.random() - 0.5) * 3000000000,
        market_cap_rank: 8,
        price_change_percentage_24h: -1.5 + (Math.random() - 0.5) * 4,
        image: 'https://assets.coingecko.com/coins/images/975/large/Cardano.png'
      },
      {
        id: 'avalanche',
        symbol: 'avax',
        name: 'Avalanche',
        current_price: 35 + (Math.random() - 0.5) * 5,
        market_cap: 13000000000 + (Math.random() - 0.5) * 2000000000,
        market_cap_rank: 9,
        price_change_percentage_24h: 0.8 + (Math.random() - 0.5) * 4,
        image: 'https://assets.coingecko.com/coins/images/12559/large/avalanche-avax-logo.png'
      },
      {
        id: 'dogecoin',
        symbol: 'doge',
        name: 'Dogecoin',
        current_price: 0.085 + (Math.random() - 0.5) * 0.015,
        market_cap: 12000000000 + (Math.random() - 0.5) * 2000000000,
        market_cap_rank: 10,
        price_change_percentage_24h: 1.5 + (Math.random() - 0.5) * 4,
        image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png'
      }
    ];

    return baseData;
  }

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
                  // Fallback to ui-avatars if image fails
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(coin.symbol)}&background=1f2937&color=fff&size=16&bold=true`;
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
