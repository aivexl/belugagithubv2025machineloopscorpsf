"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import CryptoDetailInfo from './CryptoDetailInfo';
import CoinChartPage from './CoinChartPage';
import CoinTxnsPage from './CoinTxnsPage';
import CoinChartTxnsPage from './CoinChartTxnsPage';
import ModernCryptoChart from './ModernCryptoChart';
import { CoinGeckoProvider } from './CoinGeckoContext';
import TokenSidebar from './token/TokenSidebar';
import SocialMediaIcons from './SocialMediaIcons';
import CoinDetailNav from './CoinDetailNav';
import { fetchDetailedCoinData, createPairData } from '../utils/coinDataUtils';


// Utility functions
const formatPrice = (price) => {
  if (!price || price === 0) return '$0.00';
  return '$' + price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatMarketCap = (marketCap) => {
  if (!marketCap || marketCap === 0) return '0';
  if (marketCap >= 1e12) return (marketCap / 1e12).toFixed(2) + 'T';
  if (marketCap >= 1e9) return (marketCap / 1e9).toFixed(2) + 'B';
  if (marketCap >= 1e6) return (marketCap / 1e6).toFixed(2) + 'M';
  if (marketCap >= 1e3) return (marketCap / 1e3).toFixed(2) + 'K';
  return marketCap.toString();
};

const formatPercentage = (percentage) => {
  if (!percentage && percentage !== 0) return '0.00%';
  const value = parseFloat(percentage);
  if (isNaN(value)) return '0.00%';
  const isPositive = value >= 0;
  return (
    <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
};

// Safe number conversion utility
const safeNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

export default function CryptoDetailClient({ cryptoId }) {
  const router = useRouter();
  const pathname = usePathname();
  const [coinData, setCoinData] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [detailedCoinData, setDetailedCoinData] = useState(null);

  // Create token data for TokenSidebar
  const getTokenData = () => {
    if (!coinData) return null;

    return {
      symbol: coinData.symbol,
      name: coinData.name,
      address: coinData.id || "0x0000000000000000000000000000000000000000",
      logo: coinData.image,
    };
  };

  // Create pair data for TokenSidebar using utility functions
  const getPairData = () => {
    if (!coinData) return null;

    return createPairData(coinData, detailedCoinData, coinData.symbol);
  };

  // Fetch detailed coin data including launch date
  useEffect(() => {
    const getDetailedCoinData = async () => {
      if (!coinData?.id) return;

      const data = await fetchDetailedCoinData(coinData.id);
      setDetailedCoinData(data);
    };

    getDetailedCoinData();
  }, [coinData?.id]);

  const tokenData = getTokenData();
  const pairData = getPairData();


  const fetchCoinData = useCallback(async () => {
    if (!cryptoId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch basic coin data with retry mechanism for 431 errors
      let basicResponse;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          basicResponse = await fetch(`/api/coingecko/api/v3/coins/markets?vs_currency=usd&ids=${cryptoId}&order=market_cap_desc&per_page=1&page=1&price_change_percentage=1h,24h,7d,30d,1y`);
          
          if (basicResponse.status === 431) {
            retryCount++;
            if (retryCount < maxRetries) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              continue;
            }
          }
          break;
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      if (!basicResponse.ok) {
        if (basicResponse.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        if (basicResponse.status === 431) {
          throw new Error('Request header fields too large. Please try again.');
        }
        throw new Error(`Failed to fetch coin data: ${basicResponse.status}`);
      }
      
      const basicData = await basicResponse.json();
      
      if (!basicData || basicData.length === 0) {
        throw new Error('Coin not found');
      }
      
      setCoinData(basicData[0]);
      
      // Fetch detailed coin data with retry mechanism for 431 errors
      let detailedResponse;
      retryCount = 0;
      
      while (retryCount < maxRetries) {
        try {
          detailedResponse = await fetch(`/api/coingecko/api/v3/coins/${cryptoId}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false`);
          
          if (detailedResponse.status === 431) {
            retryCount++;
            if (retryCount < maxRetries) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              continue;
            }
          }
          break;
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      if (!detailedResponse.ok) {
        if (detailedResponse.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        if (detailedResponse.status === 431) {
          throw new Error('Request header fields too large. Please try again.');
        }
        throw new Error(`Failed to fetch detailed coin data: ${detailedResponse.status}`);
      }
      
      const detailedInfo = await detailedResponse.json();
      setDetailedData(detailedInfo);
      
      setRetryCount(0); // Reset retry count on success
      
    } catch (error) {
      console.error('Error fetching coin data:', error);
      setError(error.message);
      
      // Auto retry for rate limiting and header size errors (max 3 times)
      if ((error.message.includes('Rate limit') || error.message.includes('header fields too large')) && retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 3000 * (retryCount + 1)); // Longer exponential backoff
      }
    } finally {
      setLoading(false);
    }
  }, [cryptoId, retryCount]);

  useEffect(() => {
    fetchCoinData();
  }, [fetchCoinData]);

  const handleBackClick = () => {
    router.back();
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchCoinData();
  };

  // Handle fullscreen events


  // Determine which page to show based on pathname
  const getCurrentPage = () => {
    if (pathname === `/crypto/${cryptoId}`) return 'info';
    if (pathname === `/crypto/${cryptoId}/chart-txns`) return 'chart-txns';
    if (pathname === `/crypto/${cryptoId}/chart`) return 'chart';
    if (pathname === `/crypto/${cryptoId}/txns`) return 'txns';
    return 'info';
  };

  const currentPage = getCurrentPage();

  // Render different content based on current page
  const renderPageContent = () => {
    switch (currentPage) {
      case 'chart-txns':
        return <CoinChartTxnsPage coinId={cryptoId} coinData={coinData} detailedData={detailedData} />;
      case 'chart':
        return <CoinChartPage coinId={cryptoId} coinData={coinData} detailedData={detailedData} />;
      case 'txns':
        return <CoinTxnsPage coinId={cryptoId} coinData={coinData} detailedData={detailedData} />;
      case 'info':
      default:
        return (
          <div className="h-full">
            <ModernCryptoChart 
              cryptoId={cryptoId}
              symbol={coinData?.symbol}
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <CoinGeckoProvider>
        <div className="min-h-screen bg-duniacrypto-bg-darker">
          <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-700 rounded w-1/3 sm:w-1/4 mb-4 sm:mb-6"></div>
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1">
                  <div className="bg-duniacrypto-panel rounded-lg border border-gray-700 p-3 sm:p-4 md:p-6">
                    <div className="h-60 sm:h-80 bg-gray-700 rounded"></div>
                  </div>
                  {/* Mobile loading placeholder for sidebar */}
                  <div className="lg:hidden mt-2">
                    <div className="bg-duniacrypto-panel rounded-lg border border-gray-700 p-3 sm:p-4">
                      <div className="h-32 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
                {/* Desktop loading sidebar */}
                <div className="hidden lg:block lg:w-96 xl:w-[420px] 2xl:w-[480px] lg:min-w-[320px] lg:ml-6 mt-4 sm:mt-6 lg:mt-0 space-y-4 sm:space-y-6">
                  <div className="bg-duniacrypto-panel rounded-lg border border-gray-700 p-3 sm:p-4 h-24 sm:h-32"></div>
                  <div className="bg-duniacrypto-panel rounded-lg border border-gray-700 p-3 sm:p-4 h-24 sm:h-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CoinGeckoProvider>
    );
  }

  if (error) {
    return (
      <CoinGeckoProvider>
        <div className="min-h-screen bg-duniacrypto-bg-darker">
          <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 sm:p-6 text-center">
              <h2 className="text-red-400 font-bold text-lg sm:text-xl mb-3 sm:mb-4">Error Loading Crypto Data</h2>
              <p className="text-red-300 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Retry
                </button>
                <button
                  onClick={handleBackClick}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </CoinGeckoProvider>
    );
  }

  if (!coinData) {
    return (
      <CoinGeckoProvider>
        <div className="min-h-screen bg-duniacrypto-bg-darker">
          <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 sm:p-6 text-center">
              <h2 className="text-yellow-400 font-bold text-lg sm:text-xl mb-3 sm:mb-4">Crypto Not Found</h2>
              <p className="text-yellow-300 mb-3 sm:mb-4 text-sm sm:text-base">The requested cryptocurrency could not be found.</p>
              <button
                onClick={handleBackClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </CoinGeckoProvider>
    );
  }



  return (
    <CoinGeckoProvider>
      <div className="min-h-screen bg-duniacrypto-bg-darker">
        {/* Header */}
        <div className="bg-duniacrypto-panel border-b border-gray-700">
          <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                <button
                  onClick={handleBackClick}
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  ← Back
                </button>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <img
                    src={coinData.image}
                    alt={coinData.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full"
                  />
                  <div>
                    <h1 className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl">{coinData.name}</h1>
                    <p className="text-gray-400 text-xs sm:text-sm">{coinData.symbol?.toUpperCase()}</p>
                    
                    {/* Social Media Links */}
                    <SocialMediaIcons 
                      links={detailedData?.links} 
                      className="mt-1 sm:mt-2"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                <div className="text-right">
                  <div className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                    {formatPrice(coinData.current_price)}
                  </div>
                  <div className="text-xs sm:text-sm">
                    {formatPercentage(coinData.price_change_percentage_24h)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="w-full flex flex-col lg:flex-row relative">
          {/* Left Content Area - Chart & Transactions */}
          <div className="flex-1 min-w-0 lg:h-screen custom-scrollbar">
            <div className="lg:h-screen">
              {renderPageContent()}
            </div>
            
            {/* Mobile: TokenSidebar below chart */}
            <div className="lg:hidden mt-2 px-3 sm:px-4 md:px-6 lg:px-8 pb-4">
              {tokenData && pairData && (
                <TokenSidebar
                  token={tokenData}
                  pair={pairData}
                  timeFrame="1d"
                  chainId={pairData.chainId}
                />
              )}
            </div>
          </div>
          
          {/* Desktop Sidebar - Market Data */}
          <div className="hidden lg:block lg:w-96 xl:w-[420px] 2xl:w-[480px] bg-gradient-to-b from-gray-900 to-gray-800 border-l border-gray-600/30 p-4 overflow-y-auto custom-scrollbar" style={{ minWidth: '320px', minHeight: '100vh' }}>
            <CryptoDetailInfo 
              coinData={coinData}
              detailedData={detailedData}
            />
          </div>
        </div>

        {/* Coin Detail Navigation */}
        <CoinDetailNav coinId={cryptoId} coinSymbol={coinData?.symbol} />
      </div>
    </CoinGeckoProvider>
  );
} 