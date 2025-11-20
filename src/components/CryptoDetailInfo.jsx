"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllArticles, getAcademyArticlesWithFallback, getArticlesByCoinTags } from '../utils/sanity';
import { urlFor } from '../utils/sanityImageUtils';
import { CoinLogosOnly } from './CoinTags';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

// Coin symbol mapping from CoinGecko to database
const coinSymbolMap = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'binancecoin': 'BNB',
  'cardano': 'ADA',
  'solana': 'SOL',
  'polygon': 'MATIC',
  'avalanche-2': 'AVAX',
  'polkadot': 'DOT',
  'litecoin': 'LTC',
  'chainlink': 'LINK',
  'uniswap': 'UNI',
  'wrapped-bitcoin': 'WBTC'
};

// Get database coin symbol from CoinGecko symbol
const getDatabaseCoinSymbol = (coingeckoSymbol) => {
  if (!coingeckoSymbol) return null;
  return coinSymbolMap[coingeckoSymbol.toLowerCase()] || coingeckoSymbol.toUpperCase();
};

// Get all articles with coin tags for the current coin
const getArticlesForCoin = async (coinSymbol, category) => {
  try {
    console.log(`🎯 getArticlesForCoin called with: ${coinSymbol}, ${category}`);

    const articles = await getArticlesByCoinTags(category);
    console.log(`📋 getArticlesByCoinTags returned ${articles.length} articles for category ${category}`);

    // Map CoinGecko symbol to database symbol
    const databaseSymbol = getDatabaseCoinSymbol(coinSymbol);
    console.log(`🔍 Mapping: ${coinSymbol} (CoinGecko) -> ${databaseSymbol} (Database)`);

    // Filter articles that have coin tags matching the database symbol OR the coin symbol directly
    const filteredArticles = articles.filter(article =>
      article.coinTags && article.coinTags.some(tag => {
        // Match by database symbol (e.g. BTC)
        const matchDatabase = tag.symbol === databaseSymbol;
        // Match by direct symbol (case-insensitive)
        const matchSymbol = tag.symbol?.toLowerCase() === coinSymbol?.toLowerCase();
        // Match by name (case-insensitive) - e.g. tag.name="Bitcoin" vs coinSymbol="bitcoin" (which is usually id, but let's try)
        // We don't have coin name here easily, but we can try to match tag name with coinSymbol if coinSymbol looks like a name

        return matchDatabase || matchSymbol;
      })
    );

    console.log(`✅ Filtered ${filteredArticles.length} articles for ${databaseSymbol} / ${coinSymbol}`);
    filteredArticles.forEach(article => {
      console.log(`   - ${article.title} (${article.category}): ${article.coinTags.map(t => t.symbol).join(', ')}`);
    });

    return filteredArticles;
  } catch (error) {
    console.error('❌ Error fetching articles for coin:', error);
    return [];
  }
};

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

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const calculateAge = (dateString) => {
  if (!dateString) return 'N/A';
  const birthDate = new Date(dateString);
  const today = new Date();
  const diffInMs = today - birthDate;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Calculate years, months, and days more accurately
  const years = Math.floor(diffInDays / 365.25);
  const remainingDaysAfterYears = diffInDays % 365.25;
  const months = Math.floor(remainingDaysAfterYears / 30.44);
  const days = Math.floor(remainingDaysAfterYears % 30.44);

  // For very short periods, show seconds/minutes/hours
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 30) return `${diffInDays}d`;

  // For periods less than a year, show months and days
  if (years === 0) {
    if (months === 0) return `${days}d`;
    if (days === 0) return `${months}m`;
    return `${months}m ${days}d`;
  }

  // For periods of a year or more, show years, months, and days
  if (months === 0 && days === 0) return `${years}y`;
  if (days === 0) return `${years}y ${months}m`;
  return `${years}y ${months}m ${days}d`;
};

export default function CryptoDetailInfo({
  coinData,
  detailedData,
  showOverview = true,
  showPerformance = true,
  showSupplyInfo = true,
  showAbout = true,
  className = ""
}) {
  // CTO Implementation: Bulletproof state management
  const [academyArticles, setAcademyArticles] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loadingAcademy, setLoadingAcademy] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  // CTO Debug: Log component initialization
  console.log('🔧 CryptoDetailInfo: Component initialized');
  console.log('📊 CoinData received:', coinData ? {
    symbol: coinData.symbol,
    name: coinData.name,
    id: coinData.id
  } : 'No coinData');


  // CTO Implementation: Bulletproof academy articles fetching
  useEffect(() => {
    const fetchAcademyArticles = async () => {
      // CTO Debug: Validate input
      if (!coinData?.symbol) {
        console.warn('⚠️ CryptoDetailInfo: No coin symbol provided, skipping academy fetch');
        setLoadingAcademy(false);
        setDebugInfo(prev => ({ ...prev, academySkipped: 'No coin symbol' }));
        return;
      }

      console.log('🎓 CTO: Starting academy articles fetch for:', coinData.symbol);
      setLoadingAcademy(true);
      setError(null);

      try {
        // CTO Debug: Log function call
        console.log('🔍 CTO: Calling getArticlesForCoin with:', coinData.symbol, 'academy');

        // Get all academy articles with coin tags and filter by current coin
        const articles = await getArticlesForCoin(coinData.symbol, 'academy');

        // CTO Debug: Log results
        console.log('✅ CTO: Academy articles fetched successfully:', articles.length, 'articles');

        // Take first 4 articles
        const limitedArticles = articles.slice(0, 4);
        setAcademyArticles(limitedArticles);

        // CTO Debug: Update debug info
        setDebugInfo(prev => ({
          ...prev,
          academyArticlesCount: limitedArticles.length,
          academyLastFetch: new Date().toISOString(),
          academyError: null
        }));

        console.log('🎯 CTO: Academy articles state updated:', limitedArticles.length, 'articles');

      } catch (error) {
        console.error('❌ CTO: Academy articles fetch failed:', error);
        setError(`Academy fetch failed: ${error.message}`);
        setAcademyArticles([]);

        // CTO Debug: Update debug info with error
        setDebugInfo(prev => ({
          ...prev,
          academyError: error.message,
          academyLastError: new Date().toISOString()
        }));
      } finally {
        setLoadingAcademy(false);
        console.log('🏁 CTO: Academy articles fetch completed');
      }
    };

    fetchAcademyArticles();
  }, [coinData?.symbol]);

  // CTO Implementation: Bulletproof news articles fetching
  useEffect(() => {
    const fetchNewsArticles = async () => {
      // CTO Debug: Validate input
      if (!coinData?.symbol) {
        console.warn('⚠️ CryptoDetailInfo: No coin symbol provided, skipping news fetch');
        setLoadingNews(false);
        setDebugInfo(prev => ({ ...prev, newsSkipped: 'No coin symbol' }));
        return;
      }

      console.log('📰 CTO: Starting news articles fetch for:', coinData.symbol);
      setLoadingNews(true);
      setError(null);

      try {
        // CTO Debug: Log function call
        console.log('🔍 CTO: Calling getArticlesForCoin with:', coinData.symbol, 'newsroom');

        // Get all news articles with coin tags and filter by current coin
        const articles = await getArticlesForCoin(coinData.symbol, 'newsroom');

        // CTO Debug: Log results
        console.log('✅ CTO: News articles fetched successfully:', articles.length, 'articles');

        // Take first 4 articles
        const limitedArticles = articles.slice(0, 4);
        setNewsArticles(limitedArticles);

        // CTO Debug: Update debug info
        setDebugInfo(prev => ({
          ...prev,
          newsArticlesCount: limitedArticles.length,
          newsLastFetch: new Date().toISOString(),
          newsError: null
        }));

        console.log('🎯 CTO: News articles state updated:', limitedArticles.length, 'articles');

      } catch (error) {
        console.error('❌ CTO: News articles fetch failed:', error);
        setError(`News fetch failed: ${error.message}`);
        setNewsArticles([]);

        // CTO Debug: Update debug info with error
        setDebugInfo(prev => ({
          ...prev,
          newsError: error.message,
          newsLastError: new Date().toISOString()
        }));
      } finally {
        setLoadingNews(false);
        console.log('🏁 CTO: News articles fetch completed');
      }
    };

    fetchNewsArticles();
  }, [coinData?.symbol]);

  // CTO Debug: Early return if no coin data
  if (!coinData) {
    console.warn('⚠️ CryptoDetailInfo: No coinData provided');
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400 text-sm">No coin data available</p>
        <p className="text-gray-500 text-xs mt-1">Debug: coinData is null or undefined</p>
      </div>
    );
  }

  // CTO Debug: Log render state
  console.log('🎨 CryptoDetailInfo: Rendering with state:', {
    academyArticles: academyArticles.length,
    newsArticles: newsArticles.length,
    loadingAcademy,
    loadingNews,
    error,
    coinSymbol: coinData.symbol
  });

  return (
    <div className={`space-y-4 pb-8 ${className}`}>
      {/* CTO Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-xs">
          <details>
            <summary className="text-blue-400 cursor-pointer font-medium">🔧 CTO Debug Panel</summary>
            <div className="mt-2 space-y-1 text-gray-300">
              <div>Coin Symbol: <span className="text-white">{coinData.symbol}</span></div>
              <div>Academy Articles: <span className="text-white">{academyArticles.length}</span></div>
              <div>News Articles: <span className="text-white">{newsArticles.length}</span></div>
              <div>Loading Academy: <span className="text-white">{loadingAcademy ? 'Yes' : 'No'}</span></div>
              <div>Loading News: <span className="text-white">{loadingNews ? 'Yes' : 'No'}</span></div>
              <div>Error: <span className="text-white">{error || 'None'}</span></div>
              <div>Debug Info: <span className="text-white">{JSON.stringify(debugInfo, null, 2)}</span></div>
            </div>
          </details>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            <p className="text-red-400 text-sm font-medium">Error Loading Articles</p>
          </div>
          <p className="text-red-300 text-xs mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      {/* Overview Section */}
      {showOverview && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide uppercase">Overview</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 min-w-0">
              <p className="text-gray-400 text-xs truncate font-medium">Current Price</p>
              <p className="text-white font-bold text-base truncate">
                {formatPrice(coinData.current_price)}
              </p>
              <div className="text-xs">
                {formatPercentage(coinData.price_change_percentage_24h)}
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <p className="text-gray-400 text-xs truncate font-medium">Market Cap</p>
              <p className="text-white font-bold text-sm truncate">
                ${formatMarketCap(coinData.market_cap)}
              </p>
              <p className="text-gray-400 text-xs truncate">Rank #{coinData.market_cap_rank}</p>
            </div>

            <div className="space-y-1 min-w-0">
              <p className="text-gray-400 text-xs truncate font-medium">24h Volume</p>
              <p className="text-white font-bold text-sm truncate">
                ${formatMarketCap(coinData.total_volume)}
              </p>
            </div>

            <div className="space-y-1 min-w-0">
              <p className="text-gray-400 text-xs truncate font-medium">Circulating Supply</p>
              <p className="text-white font-bold text-sm truncate">
                {formatNumber(coinData.circulating_supply)} {coinData.symbol?.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {showPerformance && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide uppercase">Performance</h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">1h</p>
              <div className="font-semibold text-xs truncate">
                {formatPercentage(coinData.price_change_percentage_1h_in_currency)}
              </div>
            </div>

            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">24h</p>
              <div className="font-semibold text-xs truncate">
                {formatPercentage(coinData.price_change_percentage_24h_in_currency)}
              </div>
            </div>

            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">7d</p>
              <div className="font-semibold text-xs truncate">
                {formatPercentage(coinData.price_change_percentage_7d_in_currency)}
              </div>
            </div>

            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">30d</p>
              <div className="font-semibold text-xs truncate">
                {formatPercentage(coinData.price_change_percentage_30d_in_currency)}
              </div>
            </div>

            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">1y</p>
              <div className="font-semibold text-xs truncate">
                {formatPercentage(coinData.price_change_percentage_1y_in_currency)}
              </div>
            </div>

            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">ATH</p>
              <div className="font-semibold text-xs text-red-400 truncate">
                {detailedData?.market_data?.ath_change_percentage?.usd ?
                  `${detailedData.market_data.ath_change_percentage.usd.toFixed(2)}%` :
                  'N/A'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supply Metrics */}
      {showSupplyInfo && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide uppercase">Supply</h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">Circulating Supply</p>
              <div className="font-semibold text-xs truncate">
                {formatNumber(detailedData?.market_data?.circulating_supply || coinData.circulating_supply)}
              </div>
              <div className="text-gray-500 text-xs truncate">
                {coinData.symbol?.toUpperCase()}
              </div>
            </div>

            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">Total Supply</p>
              <div className="font-semibold text-xs truncate">
                {(detailedData?.market_data?.total_supply || coinData.total_supply) ?
                  formatNumber(detailedData.market_data?.total_supply || coinData.total_supply) :
                  'Unlimited'
                }
              </div>
              <div className="text-gray-500 text-xs truncate">
                {(detailedData?.market_data?.total_supply || coinData.total_supply) ? coinData.symbol?.toUpperCase() : ''}
              </div>
            </div>

            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">Max Supply</p>
              <div className="font-semibold text-xs truncate">
                {(detailedData?.market_data?.max_supply || coinData.max_supply) ?
                  formatNumber(detailedData.market_data?.max_supply || coinData.max_supply) :
                  'Unlimited'
                }
              </div>
              <div className="text-gray-500 text-xs truncate">
                {(detailedData?.market_data?.max_supply || coinData.max_supply) ? coinData.symbol?.toUpperCase() : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supply Information */}
      {showSupplyInfo && detailedData && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide uppercase">Supply Information</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Circulating Supply</span>
              <span className="text-white font-semibold text-xs">
                {formatNumber(detailedData.market_data?.circulating_supply || coinData.circulating_supply)} {coinData.symbol?.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Total Supply</span>
              <span className="text-white font-semibold text-xs">
                {(detailedData.market_data?.total_supply || coinData.total_supply) ?
                  `${formatNumber(detailedData.market_data?.total_supply || coinData.total_supply)} ${coinData.symbol?.toUpperCase()}` :
                  'Unlimited'
                }
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Max Supply</span>
              <span className="text-white font-semibold text-xs">
                {(detailedData.market_data?.max_supply || coinData.max_supply) ?
                  `${formatNumber(detailedData.market_data?.max_supply || coinData.max_supply)} ${coinData.symbol?.toUpperCase()}` :
                  'Unlimited'
                }
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Volume/Market Cap</span>
              <span className="text-white font-semibold text-xs">
                {coinData.total_volume && coinData.market_cap ?
                  `${(coinData.total_volume / coinData.market_cap * 100).toFixed(2)}%` :
                  'N/A'
                }
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Fully Diluted Valuation</span>
              <span className="text-white font-semibold text-xs">
                {detailedData.market_data?.fully_diluted_valuation?.usd ?
                  `$${formatMarketCap(detailedData.market_data.fully_diluted_valuation.usd)}` :
                  'N/A'
                }
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Age of Coin</span>
              <span className="text-white font-semibold text-xs">
                {detailedData.genesis_date ?
                  calculateAge(detailedData.genesis_date) :
                  'N/A'
                }
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Platform</span>
              <span className="text-white font-semibold text-xs">
                {detailedData.asset_platform_id ?
                  detailedData.asset_platform_id.toUpperCase() :
                  'Native'
                }
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-xs font-medium">Category</span>
              <span className="text-white font-semibold text-xs">
                {detailedData.categories?.[0] || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      {showAbout && detailedData?.description?.en && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide uppercase">About {coinData.name}</h3>
          <div className="text-gray-300 text-xs leading-relaxed">
            {detailedData.description.en}
          </div>
        </div>
      )}

      {/* Market Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4 shadow-lg">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide uppercase">{coinData.symbol?.toUpperCase()} Market</h3>
        <div className="text-gray-400 text-xs leading-relaxed text-center py-8">
          <div className="text-gray-500 text-sm mb-2">Coming Soon</div>
          <div className="text-gray-600 text-xs">Market data will be available here</div>
        </div>
      </div>


      {/* Academy & News Section - Combined Horizontal Grid */}
      <div className="space-y-6">
        {/* Academy Section */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-600/30 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">DC</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-200 tracking-wide">
                {coinData.symbol?.toUpperCase()} Academy
              </h3>
            </div>
            <div className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
              Research Articles
            </div>
          </div>

          {(() => {
            // CTO Debug: Log conditional rendering decision
            console.log('🎭 ACADEMY: Conditional rendering check:', {
              loadingAcademy,
              academyArticlesLength: academyArticles.length,
              shouldShowLoading: loadingAcademy,
              shouldShowArticles: !loadingAcademy && academyArticles.length > 0,
              shouldShowComingSoon: !loadingAcademy && academyArticles.length === 0
            });

            if (loadingAcademy) {
              return (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-gray-400 text-sm">Loading academy content...</div>
                  </div>
                </div>
              );
            }

            if (academyArticles.length > 0) {
              return (
                <div className="relative">
                  {/* Horizontal Scroll Container */}
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-400">
                    {academyArticles.map((article) => (
                      <Link
                        key={article._id}
                        href={`/crypto/${article.slug?.current || article.slug}`}
                        className="flex-shrink-0 w-72 bg-gray-700/40 rounded-lg overflow-hidden hover:bg-gray-700/60 transition-all duration-300 group cursor-pointer border border-gray-600/30 hover:border-gray-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                      >
                        {/* Article Image */}
                        <div className="relative h-32 bg-gradient-to-br from-blue-900/30 to-blue-800/30 overflow-hidden">
                          {article.image?.asset ? (
                            <Image
                              src={urlFor(article.image).width(400).height(200).url()}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-2xl text-blue-400 opacity-30">📚</div>
                            </div>
                          )}

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                          {/* Coin Tags */}
                          <div className="absolute top-2 right-2">
                            {article.coinTags && article.coinTags.length > 0 && (
                              <CoinLogosOnly
                                coinTags={article.coinTags}
                                size="xs"
                                maxDisplay={3}
                              />
                            )}
                          </div>

                          {/* Category Badge */}
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-1 text-xs font-medium rounded-md text-white bg-blue-500/80 backdrop-blur-sm">
                              Academy
                            </span>
                          </div>
                        </div>

                        {/* Article Content */}
                        <div className="p-4">
                          <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                            <span>📅</span>
                            {dayjs(article.publishedAt).format('MMM D, YYYY')}
                          </div>

                          <h4 className="text-white font-medium text-sm line-clamp-2 mb-3 group-hover:text-blue-400 transition-colors leading-relaxed">
                            {article.title}
                          </h4>

                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Dunia Crypto Team</span>
                            <div className="flex -space-x-1">
                              <div className="w-5 h-5 bg-gray-600 rounded-full border-2 border-gray-700"></div>
                              <div className="w-5 h-5 bg-gray-600 rounded-full border-2 border-gray-700"></div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Scroll Indicator */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            }

            // CTO Debug: Should show "Coming Soon" for academy
            return (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 9.246 19 7.5 19c-1.746 0-3.332-.477-4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                  </svg>
                </div>
                <div className="text-gray-400 text-sm mb-2">Academy Content Coming Soon</div>
                <div className="text-gray-500 text-xs">Research articles will be available here</div>
              </div>
            );
          })()}
        </div>

        {/* News Section */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-600/30 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">DC</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-200 tracking-wide">
                {coinData.symbol?.toUpperCase()} News
              </h3>
            </div>
            <div className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
              Latest Updates
            </div>
          </div>

          {(() => {
            // CTO Debug: Log conditional rendering decision for news
            console.log('📰 NEWS: Conditional rendering check:', {
              loadingNews,
              newsArticlesLength: newsArticles.length,
              shouldShowLoading: loadingNews,
              shouldShowArticles: !loadingNews && newsArticles.length > 0,
              shouldShowComingSoon: !loadingNews && newsArticles.length === 0
            });

            if (loadingNews) {
              return (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-gray-400 text-sm">Loading news content...</div>
                  </div>
                </div>
              );
            }

            if (newsArticles.length > 0) {
              return (
                <div className="relative">
                  {/* Horizontal Scroll Container */}
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-400">
                    {newsArticles.map((article) => (
                      <Link
                        key={article._id}
                        href={`/newsroom/${article.slug?.current || article.slug}`}
                        className="flex-shrink-0 w-72 bg-gray-700/40 rounded-lg overflow-hidden hover:bg-gray-700/60 transition-all duration-300 group cursor-pointer border border-gray-600/30 hover:border-gray-500/50 hover:shadow-lg hover:shadow-green-500/10"
                      >
                        {/* Article Image */}
                        <div className="relative h-32 bg-gradient-to-br from-green-900/30 to-green-800/30 overflow-hidden">
                          {article.image?.asset ? (
                            <Image
                              src={urlFor(article.image).width(400).height(200).url()}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-2xl text-green-400 opacity-30">📰</div>
                            </div>
                          )}

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                          {/* Coin Tags */}
                          <div className="absolute top-2 right-2">
                            {article.coinTags && article.coinTags.length > 0 && (
                              <CoinLogosOnly
                                coinTags={article.coinTags}
                                size="xs"
                                maxDisplay={3}
                              />
                            )}
                          </div>

                          {/* Category Badge */}
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-1 text-xs font-medium rounded-md text-white bg-green-500/80 backdrop-blur-sm">
                              News
                            </span>
                          </div>
                        </div>

                        {/* Article Content */}
                        <div className="p-4">
                          <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                            <span>📅</span>
                            {dayjs(article.publishedAt).format('MMM D, YYYY')}
                          </div>

                          <h4 className="text-white font-medium text-sm line-clamp-2 mb-3 group-hover:text-green-400 transition-colors leading-relaxed">
                            {article.title}
                          </h4>

                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Dunia Crypto Team</span>
                            <div className="flex -space-x-1">
                              <div className="w-5 h-5 bg-gray-600 rounded-full border-2 border-gray-700"></div>
                              <div className="w-5 h-5 bg-gray-600 rounded-full border-2 border-gray-700"></div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Scroll Indicator */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            }

            // CTO Debug: Should show "Coming Soon" for news
            return (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="text-gray-400 text-sm mb-2">News Content Coming Soon</div>
                <div className="text-gray-500 text-xs">Latest updates will be available here</div>
              </div>
            );
          })()}
        </div>
      </div>

    </div>
  );
} 