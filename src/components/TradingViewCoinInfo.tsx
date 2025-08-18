"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface TradingViewCoinInfoProps {
  symbol: string;
  showExchanges?: boolean;
  showMarketData?: boolean;
}

interface MarketQuote {
  price: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  high_24h: number;
  low_24h: number;
  open: number;
  previous_close: number;
}

interface ExchangeData {
  base: string;
  target: string;
  market: {
    name: string;
    identifier: string;
  };
  last: number;
  volume: number;
  converted_last: {
    usd: number;
  };
  converted_volume: {
    usd: number;
  };
  trust_score?: number;
}

export default function TradingViewCoinInfo({ 
  symbol, 
  showExchanges = true 
}: TradingViewCoinInfoProps) {
  const [quote, setQuote] = useState<MarketQuote | null>(null);
  const [exchanges, setExchanges] = useState<ExchangeData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch real-time market data from CoinGecko
      const response = await fetch(`/api/coingecko/coins/${symbol}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch market data: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform CoinGecko data to match our format
      const marketData = data.market_data || {};
      const transformedQuote: MarketQuote = {
        price: marketData.current_price?.usd || 0,
        change_percent: marketData.price_change_percentage_24h || 0,
        volume: marketData.total_volume?.usd || 0,
        market_cap: marketData.market_cap?.usd || 0,
        high_24h: marketData.high_24h?.usd || 0,
        low_24h: marketData.low_24h?.usd || 0,
        open: marketData.current_price?.usd || 0, // Using current price as open
        previous_close: marketData.current_price?.usd || 0 // Using current price as previous close
      };
      
      setQuote(transformedQuote);
      
      // Get exchanges data
      const exchangesData: ExchangeData[] = data.tickers?.slice(0, 9) || [];
      setExchanges(exchangesData);
      
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchMarketData();
    
    // Set up real-time updates every 20 seconds
    const interval = setInterval(fetchMarketData, 20 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const formatNumber = (num: number) => {
    if (!num || num === 0) return '0.00';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-duniacrypto-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-400">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Data - Like sonar.studio */}
      {quote ? (
        <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">{symbol.toUpperCase()}</h3>
          
          {/* Main Price Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-gray-400 text-sm">Price</p>
              <p className="text-white font-semibold text-lg">
                ${quote.price?.toFixed(2) || '0.00'}
              </p>
              <p className={`text-sm font-semibold ${
                quote.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {quote.change_percent >= 0 ? '+' : ''}{quote.change_percent?.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Volume</p>
              <p className="text-white font-semibold">
                ${formatNumber(quote.volume)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Market Cap</p>
              <p className="text-white font-semibold">
                ${formatNumber(quote.market_cap)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">24h Change</p>
              <p className={`text-white font-semibold ${
                quote.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {quote.change_percent >= 0 ? '+' : ''}{quote.change_percent?.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">24h High</p>
              <p className="text-white">${quote.high_24h?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">24h Low</p>
              <p className="text-white">${quote.low_24h?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Open</p>
              <p className="text-white">${quote.open?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Previous Close</p>
              <p className="text-white">${quote.previous_close?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Market Data</p>
            <p className="text-gray-500 text-sm">No market data available</p>
          </div>
        </div>
      )}

      {/* Exchanges Information */}
      {showExchanges && (exchanges.length > 0 ? (
        <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Available Exchanges</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exchanges.slice(0, 9).map((exchange, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {exchange.market?.name?.charAt(0) || 'E'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{exchange.market?.name || 'Exchange'}</h4>
                    <p className="text-gray-400 text-sm">{exchange.base}/{exchange.target}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Last Price:</span>
                    <span className="text-white text-sm">${exchange.last?.toFixed(6) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Volume:</span>
                    <span className="text-white text-sm">${formatNumber(exchange.volume || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Trust Score:</span>
                    <span className="text-white text-sm">{exchange.trust_score || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {exchanges.length > 9 && (
            <div className="mt-4 text-center">
              <p className="text-gray-400">
                And {exchanges.length - 9} more exchanges...
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-duniacrypto-panel rounded-lg p-6 border border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Available Exchanges</p>
            <p className="text-gray-500 text-sm">No exchange information available</p>
          </div>
        </div>
      ))}
    </div>
  );
} 