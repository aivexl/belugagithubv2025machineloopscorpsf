"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CoinGeckoProvider } from './CoinGeckoContext';

import CryptoTable from './CryptoTable';
import CryptoTicker from './CryptoTicker';
import MarketOverviewSimple from './MarketOverviewSimple';

// Utility functions
const formatPrice = (price) => {
  if (!price || price === 0) return '$0.00';
  
  // Add commas for thousands and keep 2 decimal places
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
  const className = isPositive ? 'text-green-400' : 'text-red-400';
  return (
    <span className={className}>
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

export default function AssetClient() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState('top-100');
  const [searchQuery, setSearchQuery] = useState('');
  const [cryptoFilter, setCryptoFilter] = useState('top-100');
  
  // Debug logging for state changes
  useEffect(() => {
    console.log('AssetClient: State changed:', { activeSection, cryptoFilter, searchQuery });
  }, [activeSection, cryptoFilter, searchQuery]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showEcosystemSubFilter, setShowEcosystemSubFilter] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showDateRangeFilter, setShowDateRangeFilter] = useState(false);
  const [dateRange, setDateRange] = useState('24h');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'heatmap'
  
  useEffect(() => {
    setIsClient(true);
    
    // Debug logging for enterprise troubleshooting
    console.log('AssetClient: Component mounted with initial state:', {
      activeSection,
      cryptoFilter,
      searchQuery,
      viewMode
    });
  }, []);

  // Back to Top functionality
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Close date range filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDateRangeFilter && !event.target.closest('.date-range-filter')) {
        setShowDateRangeFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDateRangeFilter]);

  if (!isClient) {
    return null;
  }

  const menuItems = [
    { id: 'top-100', label: 'Top 100 Cryptocurrencies' },
    { id: 'trending', label: 'Trending' },
    { id: 'sectors', label: 'Sectors' }
  ];

  const cryptoFilterOptions = [
    { id: 'top-100', label: 'Top 100' },
    { id: 'gainers', label: 'Gainers' },
    { id: 'losers', label: 'Losers' },
    { id: 'ecosystems', label: 'Ecosystems', hasSubFilter: true }
  ];

  const dateRangeOptions = [
    { id: '1h', label: '1h' },
    { id: '24h', label: '24h' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: '1y', label: '1y' }
  ];

  const ecosystemOptions = [
    { id: 'ethereum', label: 'Ethereum', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { id: 'solana', label: 'Solana', logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
    { id: 'binance', label: 'Binance Smart Chain', logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
    { id: 'polygon', label: 'Polygon', logo: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
    { id: 'cardano', label: 'Cardano', logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
    { id: 'avalanche', label: 'Avalanche', logo: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
    { id: 'polkadot', label: 'Polkadot', logo: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
    { id: 'base', label: 'Base', logo: '/Asset/base-logo-in-blue.png' },
    { id: 'arbitrum', label: 'Arbitrum', logo: '/Asset/arbitrum-arb-logo.png' },
    { id: 'optimism', label: 'Optimism', logo: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png' },
    { id: 'cosmos', label: 'Cosmos', logo: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png' },
    { id: 'chainlink', label: 'Chainlink', logo: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
    { id: 'filecoin', label: 'Filecoin', logo: 'https://assets.coingecko.com/coins/images/12817/small/filecoin.png' },
    { id: 'near', label: 'NEAR Protocol', logo: 'https://assets.coingecko.com/coins/images/10365/small/near.png' },
    { id: 'algorand', label: 'Algorand', logo: 'https://assets.coingecko.com/coins/images/4380/small/download.png' },
    { id: 'stellar', label: 'Stellar', logo: 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png' }
  ];

  return (
    <CoinGeckoProvider>
      {/* Ticker */}
      <CryptoTicker />
      
      {/* Main Layout */}
       <main className="w-full py-2 sm:py-3 md:py-4 lg:py-6">
        
        {/* Market Overview - Always Visible */}
         <section className="mb-3 sm:mb-4 md:mb-6 px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <MarketOverviewRedesigned />
        </section>

        {/* Horizontal Menu Navigation */}
         <div className="mb-2 sm:mb-3 md:mb-4 px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-duniacrypto-panel text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>


        {/* Search Bar for Top 100 */}
        {activeSection === 'top-100' && (
           <div className="mb-2 sm:mb-3 md:mb-4 px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 pl-8 pr-3 bg-duniacrypto-panel border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-xs"
              />
              <svg
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Content Sections */}
        {activeSection === 'top-100' && (
          <section className="mb-3 sm:mb-4 md:mb-6">
                         <div className="mb-2 sm:mb-3 md:mb-4 px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
               <h2 className="text-sm sm:text-base md:text-lg font-bold text-white mb-2 sm:mb-3">
                Top 100 Cryptocurrencies
              </h2>
              
              {/* Filter Controls */}
               <div className="flex items-center gap-2 max-w-6xl mx-auto">
                {/* Filter Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center space-x-2 px-2 py-1 bg-duniacrypto-panel border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-all duration-200 text-xs"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>Filter</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${showFilterDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Date Range Filter */}
                <div className="relative date-range-filter">
                  <button
                    onClick={() => setShowDateRangeFilter(!showDateRangeFilter)}
                    className="flex items-center space-x-2 px-2 py-1 bg-duniacrypto-panel border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-all duration-200 text-xs"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{dateRangeOptions.find(opt => opt.id === dateRange)?.label || '24h'}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${showDateRangeFilter ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Date Range Dropdown */}
                  {showDateRangeFilter && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-duniacrypto-panel border border-gray-700 rounded-lg shadow-lg z-40">
                      <div className="p-2">
                        {dateRangeOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setDateRange(option.id);
                              setShowDateRangeFilter(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              dateRange === option.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-duniacrypto-panel border border-gray-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                      viewMode === 'table'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      <span className="hidden sm:inline">Table</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('heatmap')}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                      viewMode === 'heatmap'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      {/* Heatmap Icon - Grid of squares */}
                      <div className="w-3 h-3 grid grid-cols-3 gap-0.5">
                        <div className="w-full h-full bg-current rounded-sm opacity-100"></div>
                        <div className="w-full h-full bg-current rounded-sm opacity-80"></div>
                        <div className="w-full h-full bg-current rounded-sm opacity-60"></div>
                        <div className="w-full h-full bg-current rounded-sm opacity-80"></div>
                        <div className="w-full h-full bg-current rounded-sm opacity-100"></div>
                        <div className="w-full h-full bg-current rounded-sm opacity-40"></div>
                        <div className="w-full h-full bg-current rounded-sm opacity-60"></div>
                        <div className="w-full h-full bg-current rounded-sm opacity-40"></div>
                        <div className="w-full h-full bg-current rounded-sm opacity-80"></div>
                      </div>
                      <span className="hidden sm:inline">Heatmap</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
                         <div className={`bg-duniacrypto-panel border border-gray-700 max-w-6xl mx-auto ${viewMode === 'heatmap' ? 'p-1' : 'px-2'}`}>

              {viewMode === 'table' ? (
                <CryptoTableWithSearch 
                  searchQuery={searchQuery} 
                  filter={activeSection === 'top-100' ? 'top-100' : cryptoFilter}
                  dateRange={dateRange}
                  onCoinClick={(coin) => {
                    // Navigate to detail page instead of showing overlay
                    router.push(`/crypto/${coin.id}`);
                  }}
                />
                            ) : (
                <CryptoHeatmap 
                  searchQuery={searchQuery} 
                  filter={cryptoFilter}
                  dateRange={dateRange}
                  onCoinClick={(coin) => {
                    // Navigate to detail page instead of showing overlay
                    router.push(`/crypto/${coin.id}`);
                  }}
                />
              )}
            </div>
          </section>
        )}

        {/* Filter Overlay - Full Screen Bottom Sheet */}
        {showFilterDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => {
                setShowFilterDropdown(false);
                setShowEcosystemSubFilter(false);
                setShowDateRangeFilter(false);
              }}
            ></div>
            
            {/* Filter Menu - Bottom Sheet */}
            <div className="fixed bottom-0 left-0 right-0 bg-duniacrypto-panel border-t border-gray-700 rounded-t-xl z-50 animate-slide-up">
              {/* Handle Bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
              </div>
              
              {/* Header */}
              <div className="px-4 sm:px-6 pb-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {showEcosystemSubFilter ? 'Select Ecosystem' : 'Filter Cryptocurrencies'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {showEcosystemSubFilter ? 'Choose a blockchain ecosystem' : 'Choose how to view the data'}
                    </p>
                  </div>
                  {showEcosystemSubFilter && (
                    <button
                      onClick={() => setShowEcosystemSubFilter(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filter Options */}
              <div className="p-4 sm:p-6">
                {!showEcosystemSubFilter ? (
                  <div className="space-y-2">
                    {cryptoFilterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          if (option.hasSubFilter) {
                            setShowEcosystemSubFilter(true);
                          } else {
                            setCryptoFilter(option.id);
                            setShowFilterDropdown(false);
                          }
                        }}
                        className={`w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg transition-all duration-200 ${
                          cryptoFilter === option.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                        }`}
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          {option.id === 'top-100' && (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          )}
                          {option.id === 'gainers' && (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                          )}
                          {option.id === 'losers' && (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                          )}
                          {option.id === 'ecosystems' && (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          )}
                        </div>
                        
                        {/* Label */}
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm sm:text-base">{option.label}</div>
                          <div className="text-xs sm:text-sm opacity-75">
                            {option.id === 'top-100' && 'Top 100 by market cap'}
                            {option.id === 'gainers' && 'Best performing today'}
                            {option.id === 'losers' && 'Worst performing today'}
                            {option.id === 'ecosystems' && 'Blockchain ecosystems'}
                          </div>
                        </div>
                        
                        {/* Arrow for sub-filter */}
                        {option.hasSubFilter && (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        
                        {/* Check Icon for Active */}
                        {cryptoFilter === option.id && !option.hasSubFilter && (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto scrollbar-hide">
                    {ecosystemOptions.map((ecosystem) => (
                      <button
                        key={ecosystem.id}
                        onClick={() => {
                          setCryptoFilter(ecosystem.id);
                          setShowFilterDropdown(false);
                          setShowEcosystemSubFilter(false);
                        }}
                        className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                          cryptoFilter === ecosystem.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                        }`}
                      >
                        {/* Logo */}
                        <div className="flex-shrink-0">
                          <img 
                            src={ecosystem.logo} 
                            alt={ecosystem.label}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                            onError={(e) => {
                              e.target.src = '/Asset/duniacrypto.png';
                            }}
                          />
                        </div>
                        
                        {/* Label */}
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium text-xs sm:text-sm truncate">{ecosystem.label}</div>
                        </div>
                        
                        {/* Check Icon for Active */}
                        {cryptoFilter === ecosystem.id && (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Bottom Padding for Mobile */}
              <div className="h-4 sm:h-6"></div>
            </div>
          </>
        )}

        {activeSection === 'trending' && (
          <section className="mb-3 sm:mb-4 md:mb-6">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-white mb-2 sm:mb-3">
              Trending Coins
            </h2>
            <div className="bg-duniacrypto-panel rounded-lg border border-gray-700 p-2">
                              <TrendingCoins100 
                  onCoinClick={(coin) => {
                    // Navigate to detail page instead of showing overlay
                    router.push(`/crypto/${coin.id}`);
                  }}
                />
            </div>
          </section>
        )}

        {activeSection === 'sectors' && (
          <section className="mb-3 sm:mb-4 md:mb-6">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-white mb-2 sm:mb-3">
              Crypto Sectors
            </h2>
            <div className="bg-duniacrypto-panel rounded-lg border border-gray-700 p-2">
              <CryptoSectors />
            </div>
          </section>
        )}
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-8 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </CoinGeckoProvider>
  );
}

// Redesigned Market Overview Component (Ultra Compact Mobile)
function MarketOverviewRedesigned() {
  return <MarketOverviewSimple />;
}

// Crypto Table with Search Component (Ultra Compact Mobile)
function CryptoTableWithSearch({ searchQuery, filter, dateRange, onCoinClick }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const [sortColumn, setSortColumn] = useState('market_cap'); // Default sorting by market cap
  const [sortDirection, setSortDirection] = useState('desc'); // Default descending when sorting is activated

  const handleSort = (column) => {
    if (sortColumn === column) {
      // If clicking the same column, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new column, set it as active and default to desc
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

    useEffect(() => {
    const loadCoins = async () => {
      try {
        // Try to fetch real data from CoinGecko proxy first
        console.log('CryptoTableWithSearch: Attempting to fetch real crypto data from CoinGecko proxy...');
        const response = await fetch('/api/coingecko-proxy/coins');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Validate data structure
        if (data && Array.isArray(data) && data.length > 0) {
          console.log(`CryptoTableWithSearch: Successfully loaded ${data.length} coins from CoinGecko proxy`);
          console.log('CryptoTableWithSearch: Sample data:', data.slice(0, 2));
          setCoins(data);
          setLoading(false);
        } else {
          throw new Error('Invalid data structure received from API');
        }
      } catch (error) {
        console.error('AssetClient: Failed to fetch real crypto data, falling back to local generator:', error);
        setError(error.message);
        
        try {
          // Fallback to local data generator
          const { getCachedTop100 } = await import('../lib/cryptoDataGenerator');
          const data = getCachedTop100();
          console.log(`CryptoTableWithSearch: Successfully loaded ${data.length} coins from local generator`);
          console.log('CryptoTableWithSearch: Local generator sample data:', data.slice(0, 2));
          setCoins(data);
          setLoading(false);
          setError(null); // Clear error on successful fallback
        } catch (fallbackError) {
          console.error('AssetClient: Both real API and fallback failed, using static data:', fallbackError);
          setError('Failed to load crypto data from all sources');
          
          // Ultimate fallback - static data with proper structure
          const staticData = [
            {
              id: 'bitcoin',
              symbol: 'btc',
              name: 'Bitcoin',
              image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
              current_price: 45000,
              market_cap: 850000000000,
              market_cap_rank: 1,
              price_change_percentage_1h_in_currency: 0.5,
              price_change_percentage_24h: 2.5,
              price_change_percentage_7d_in_currency: 8.2,
              price_change_percentage_30d_in_currency: 15.3,
              price_change_percentage_1y_in_currency: 45.7,
              circulating_supply: 19500000,
              total_supply: 21000000,
              max_supply: 21000000,
              ath: 69000,
              total_volume: 25000000000,
              high_24h: 46000,
              low_24h: 44000,
              price_change_24h: 1125,
              market_cap_change_24h: 21250000000,
              market_cap_change_percentage_24h: 2.5,
              fully_diluted_valuation: 945000000000,
              ath_change_percentage: -34.78,
              ath_date: '2021-11-10T14:24:11.849Z',
              atl: 67.81,
              atl_change_percentage: 66263.25,
              atl_date: '2013-07-06T00:00:00.000Z',
              roi: null,
              last_updated: new Date().toISOString()
            },
            {
              id: 'ethereum',
              symbol: 'eth',
              name: 'Ethereum',
              image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
              current_price: 3200,
              market_cap: 380000000000,
              market_cap_rank: 2,
              price_change_percentage_1h_in_currency: 1.2,
              price_change_percentage_24h: 3.8,
              price_change_percentage_7d_in_currency: 12.5,
              price_change_percentage_30d_in_currency: 28.9,
              price_change_percentage_1y_in_currency: 67.3,
              circulating_supply: 120000000,
              total_supply: 120000000,
              max_supply: null,
              ath: 4800,
              total_volume: 15000000000,
              high_24h: 3300,
              low_24h: 3100,
              price_change_24h: 121.6,
              market_cap_change_24h: 14440000000,
              market_cap_change_percentage_24h: 3.8,
              fully_diluted_valuation: 380000000000,
              ath_change_percentage: -33.33,
              ath_date: '2021-11-10T14:24:11.849Z',
              atl: 0.432979,
              atl_change_percentage: 739275.25,
              atl_date: '2015-10-20T00:00:00.000Z',
              roi: null,
              last_updated: new Date().toISOString()
            },
            {
              id: 'binancecoin',
              symbol: 'bnb',
              name: 'BNB',
              image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
              current_price: 320,
              market_cap: 48000000000,
              market_cap_rank: 3,
              price_change_percentage_1h_in_currency: 0.8,
              price_change_percentage_24h: 2.1,
              price_change_percentage_7d_in_currency: 7.8,
              price_change_percentage_30d_in_currency: 18.5,
              price_change_percentage_1y_in_currency: 52.3,
              circulating_supply: 150000000,
              total_supply: 150000000,
              max_supply: 150000000,
              ath: 686,
              total_volume: 8000000000,
              high_24h: 325,
              low_24h: 315,
              price_change_24h: 6.72,
              market_cap_change_24h: 1008000000,
              market_cap_change_percentage_24h: 2.1,
              fully_diluted_valuation: 48000000000,
              ath_change_percentage: -53.35,
              ath_date: '2021-05-10T07:24:17.661Z',
              atl: 0.0398177,
              atl_change_percentage: 803722.25,
              atl_date: '2017-07-25T00:00:00.000Z',
              roi: null,
              last_updated: new Date().toISOString()
            }
          ];
          
          console.log(`CryptoTableWithSearch: Using static fallback data with ${staticData.length} coins`);
          console.log('CryptoTableWithSearch: Static fallback sample data:', staticData.slice(0, 2));
          setCoins(staticData);
          setLoading(false);
          setError(null); // Clear error on successful static fallback
        }
      }
    };

    loadCoins();
    
    // Set up real-time updates every 5 minutes
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/coingecko-proxy/coins');
        if (response.ok) {
          const freshData = await response.json();
          setCoins(freshData);
        }
      } catch (error) {
        console.warn('Real-time update failed, keeping current data:', error);
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [dateRange]);

  const getFilteredCoins = () => {
    let filteredCoins = coins || [];

    // Apply search filter
    if (searchQuery) {
      filteredCoins = filteredCoins.filter(coin =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (filter) {
      case 'gainers':
        filteredCoins = filteredCoins.filter(coin => {
          const change = dateRange === '1h' ? coin.price_change_percentage_1h_in_currency :
                        dateRange === '7d' ? coin.price_change_percentage_7d_in_currency :
                        dateRange === '30d' ? coin.price_change_percentage_30d_in_currency :
                        dateRange === '1y' ? coin.price_change_percentage_1y_in_currency :
                        coin.price_change_percentage_24h;
          return (change || 0) > 0;
        });
        filteredCoins.sort((a, b) => {
          const changeA = dateRange === '1h' ? a.price_change_percentage_1h_in_currency :
                         dateRange === '7d' ? a.price_change_percentage_7d_in_currency :
                         dateRange === '30d' ? a.price_change_percentage_30d_in_currency :
                         dateRange === '1y' ? a.price_change_percentage_1y_in_currency :
                         a.price_change_percentage_24h;
          const changeB = dateRange === '1h' ? b.price_change_percentage_1h_in_currency :
                         dateRange === '7d' ? b.price_change_percentage_7d_in_currency :
                         dateRange === '30d' ? b.price_change_percentage_30d_in_currency :
                         dateRange === '1y' ? b.price_change_percentage_1y_in_currency :
                         b.price_change_percentage_24h;
          return (changeB || 0) - (changeA || 0);
        });
        break;
      case 'losers':
        filteredCoins = filteredCoins.filter(coin => {
          const change = dateRange === '1h' ? coin.price_change_percentage_1h_in_currency :
                        dateRange === '7d' ? coin.price_change_percentage_7d_in_currency :
                        dateRange === '30d' ? coin.price_change_percentage_30d_in_currency :
                        dateRange === '1y' ? coin.price_change_percentage_1y_in_currency :
                        coin.price_change_percentage_24h;
          return (change || 0) < 0;
        });
        filteredCoins.sort((a, b) => {
          const changeA = dateRange === '1h' ? a.price_change_percentage_1h_in_currency :
                         dateRange === '7d' ? a.price_change_percentage_7d_in_currency :
                         dateRange === '30d' ? a.price_change_percentage_30d_in_currency :
                         dateRange === '1y' ? a.price_change_percentage_1y_in_currency :
                         a.price_change_percentage_24h;
          const changeB = dateRange === '1h' ? b.price_change_percentage_1h_in_currency :
                         dateRange === '7d' ? b.price_change_percentage_7d_in_currency :
                         dateRange === '30d' ? b.price_change_percentage_30d_in_currency :
                         dateRange === '1y' ? b.price_change_percentage_1y_in_currency :
                         b.price_change_percentage_24h;
          return (changeA || 0) - (changeB || 0);
        });
        break;
      case 'ethereum': {
        const ethKeywords = ['eth', 'ethereum', 'erc', 'defi', 'dao', 'uni', 'aave', 'comp', 'mkr', 'sushi', '1inch', 'curve', 'balancer'];
        filteredCoins = filteredCoins.filter(coin => 
          ethKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'solana': {
        const solKeywords = ['sol', 'solana', 'serum', 'ray', 'orca', 'srm', 'raydium', 'phantom', 'jupiter'];
        filteredCoins = filteredCoins.filter(coin => 
          solKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'binance': {
        const bscKeywords = ['bnb', 'binance', 'cake', 'pancake', 'bsc', 'venus', 'alpaca', 'biswap'];
        filteredCoins = filteredCoins.filter(coin => 
          bscKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'polygon': {
        const maticKeywords = ['matic', 'polygon', 'quick', 'aave', 'curve', 'sushi'];
        filteredCoins = filteredCoins.filter(coin => 
          maticKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'cardano': {
        const adaKeywords = ['ada', 'cardano', 'sundae', 'wingriders', 'minswap'];
        filteredCoins = filteredCoins.filter(coin => 
          adaKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'avalanche': {
        const avaxKeywords = ['avax', 'avalanche', 'trader', 'pangolin', 'benqi', 'aave'];
        filteredCoins = filteredCoins.filter(coin => 
          avaxKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'polkadot': {
        const dotKeywords = ['dot', 'polkadot', 'kusama', 'moonbeam', 'acala', 'astar'];
        filteredCoins = filteredCoins.filter(coin => 
          dotKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'base': {
        const baseKeywords = ['base', 'coinbase', 'cbeth', 'aerodrome'];
        filteredCoins = filteredCoins.filter(coin => 
          baseKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'arbitrum': {
        const arbKeywords = ['arb', 'arbitrum', 'gmx', 'camelot', 'pendle'];
        filteredCoins = filteredCoins.filter(coin => 
          arbKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'optimism': {
        const opKeywords = ['op', 'optimism', 'velodrome', 'synthetix'];
        filteredCoins = filteredCoins.filter(coin => 
          opKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'cosmos': {
        const atomKeywords = ['atom', 'cosmos', 'osmo', 'juno', 'evmos'];
        filteredCoins = filteredCoins.filter(coin => 
          atomKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'chainlink': {
        const linkKeywords = ['link', 'chainlink', 'oracle'];
        filteredCoins = filteredCoins.filter(coin => 
          linkKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'filecoin': {
        const filKeywords = ['fil', 'filecoin', 'ipfs'];
        filteredCoins = filteredCoins.filter(coin => 
          filKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'near': {
        const nearKeywords = ['near', 'aurora', 'ref'];
        filteredCoins = filteredCoins.filter(coin => 
          nearKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'algorand': {
        const algoKeywords = ['algo', 'algorand', 'yieldly', 'tinyman'];
        filteredCoins = filteredCoins.filter(coin => 
          algoKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'stellar': {
        const xlmKeywords = ['xlm', 'stellar', 'xrp', 'ripple'];
        filteredCoins = filteredCoins.filter(coin => 
          xlmKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'top-100':
      default:
        // Already sorted by market cap from API
        break;
    }

    // Apply date range sorting (no filtering, just sorting by the selected time period)
    if (dateRange) {
      switch (dateRange) {
        case '1h':
          filteredCoins.sort((a, b) => 
            (b.price_change_percentage_1h_in_currency || 0) - (a.price_change_percentage_1h_in_currency || 0)
          );
          break;
        case '7d':
          filteredCoins.sort((a, b) => 
            (b.price_change_percentage_7d_in_currency || 0) - (a.price_change_percentage_7d_in_currency || 0)
          );
          break;
        case '30d':
          filteredCoins.sort((a, b) => 
            (b.price_change_percentage_30d_in_currency || 0) - (a.price_change_percentage_30d_in_currency || 0)
          );
          break;
        case '1y':
          filteredCoins.sort((a, b) => 
            (b.price_change_percentage_1y_in_currency || 0) - (a.price_change_percentage_1y_in_currency || 0)
          );
          break;
        case '24h':
        default:
          // Sort by 24h performance (default)
          filteredCoins.sort((a, b) => 
            (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
          );
          break;
      }
    }

    // Apply column sorting (only if user explicitly clicks on column headers)
    if (sortColumn && sortDirection) {
      // Override the date range sorting with column sorting
      filteredCoins.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortColumn) {
          case 'rank':
            aValue = a.market_cap_rank || 999;
            bValue = b.market_cap_rank || 999;
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'price':
            aValue = a.current_price || 0;
            bValue = b.current_price || 0;
            break;
          case 'percentage':
            aValue = dateRange === '1h' ? a.price_change_percentage_1h_in_currency :
                    dateRange === '7d' ? a.price_change_percentage_7d_in_currency :
                    dateRange === '30d' ? a.price_change_percentage_30d_in_currency :
                    dateRange === '1y' ? a.price_change_percentage_1y_in_currency :
                    a.price_change_percentage_24h || 0;
            bValue = dateRange === '1h' ? b.price_change_percentage_1h_in_currency :
                    dateRange === '7d' ? b.price_change_percentage_7d_in_currency :
                    dateRange === '30d' ? b.price_change_percentage_30d_in_currency :
                    dateRange === '1y' ? b.price_change_percentage_1y_in_currency :
                    b.price_change_percentage_24h || 0;
            break;
          case '7d':
            aValue = a.price_change_percentage_7d_in_currency || 0;
            bValue = b.price_change_percentage_7d_in_currency || 0;
            break;
          case '30d':
            aValue = a.price_change_percentage_30d_in_currency || 0;
            bValue = b.price_change_percentage_30d_in_currency || 0;
            break;
          case 'market_cap':
          default:
            aValue = a.market_cap || 0;
            bValue = b.market_cap || 0;
            break;
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
      });
    }

    return filteredCoins;
  };

  const filteredCoins = getFilteredCoins();
  
  // Debug logging for enterprise troubleshooting
  console.log('AssetClient: CryptoTableWithSearch Debug Info:', {
    totalCoins: coins?.length || 0,
    filteredCoinsCount: filteredCoins?.length || 0,
    searchQuery,
    filter,
    dateRange,
    loading,
    hasError: !!error,
    coinsSample: coins?.slice(0, 3) || [],
    filterType: typeof filter,
    searchQueryType: typeof searchQuery
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6 sm:py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading crypto data...</p>
        </div>
      </div>
    );
  }

  // Show error if exists
  if (error) {
    return (
      <div className="text-center py-6 sm:py-8">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm mb-2">Error loading crypto data:</p>
          <p className="text-red-300 text-xs">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filteredCoins.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6 sm:py-8 text-sm">
        {searchQuery 
          ? `No cryptocurrencies found matching "${searchQuery}"`
          : `No cryptocurrencies found for ${filter} filter`
        }
        <div className="mt-2 text-xs text-gray-500">
          Total coins available: {coins?.length || 0}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full max-w-6xl mx-auto text-xs">
        <thead>
          <tr className="border-b border-gray-700 h-10">
            <th 
              className={`text-left py-1 px-2 font-semibold text-xs cursor-pointer transition-colors hover:text-blue-400 ${sortColumn === 'rank' ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => handleSort('rank')}
            >
              <div className="flex items-center space-x-1">
                <span>#</span>
                {getSortIcon('rank')}
              </div>
            </th>
            <th 
              className={`text-left py-1 px-2 font-semibold text-xs cursor-pointer transition-colors hover:text-blue-400 ${sortColumn === 'name' ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center space-x-1">
                <span>Asset</span>
                {getSortIcon('name')}
              </div>
            </th>
            <th 
              className={`text-right py-1 px-2 font-semibold text-xs cursor-pointer transition-colors hover:text-blue-400 ${sortColumn === 'price' ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => handleSort('price')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Price</span>
                {getSortIcon('price')}
              </div>
            </th>
            <th 
              className={`text-right py-1 px-2 font-semibold text-xs cursor-pointer transition-colors hover:text-blue-400 ${sortColumn === 'percentage' ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => handleSort('percentage')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>
                  {dateRange === '1h' ? '1h %' : 
                   dateRange === '7d' ? '7d %' : 
                   dateRange === '30d' ? '30d %' : 
                   dateRange === '1y' ? '1y %' : '24h %'}
                </span>
                {getSortIcon('percentage')}
              </div>
            </th>
            <th 
              className={`text-right py-1 px-2 font-semibold text-xs cursor-pointer transition-colors hover:text-blue-400 ${sortColumn === '7d' ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => handleSort('7d')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>7d %</span>
                {getSortIcon('7d')}
              </div>
            </th>
            <th 
              className={`text-right py-1 px-2 font-semibold text-xs cursor-pointer transition-colors hover:text-blue-400 ${sortColumn === '30d' ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => handleSort('30d')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>30d %</span>
                {getSortIcon('30d')}
              </div>
            </th>
            <th 
              className={`text-center py-1 px-2 font-semibold text-xs text-gray-300`}
            >
              <span>Chart</span>
            </th>
            <th 
              className={`text-right py-1 px-2 font-semibold text-xs cursor-pointer transition-colors hover:text-blue-400 ${sortColumn === 'market_cap' ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => handleSort('market_cap')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Market Cap</span>
                {getSortIcon('market_cap')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {(filteredCoins || []).map((coin, index) => (
            <tr 
              key={coin.id} 
              className="border-b border-gray-800 hover:bg-blue-900/20 transition-all duration-200 cursor-pointer group h-12"
              onClick={() => onCoinClick && onCoinClick(coin)}
            >
              <td className="py-1 px-2 text-gray-400 font-medium text-xs group-hover:text-blue-400 transition-colors">
                {index + 1}
              </td>
              <td className="py-1 px-2">
                <div className="flex items-center space-x-2">
                  <img
                    src={coin.image}
                    alt={coin.symbol}
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = '/Asset/duniacrypto.png';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-white text-xs truncate group-hover:text-blue-400 transition-colors">
                      {coin.symbol.toUpperCase()}
                    </div>
                    <div className="text-gray-400 text-xs truncate">
                      {coin.name}
                    </div>
                  </div>
                  {/* Click indicator */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </td>
              <td className="py-1 px-2 text-right font-medium text-white text-xs">
                {formatPrice(coin.current_price)}
              </td>
              <td className="py-1 px-2 text-right font-medium text-xs">
                {formatPercentage(
                  dateRange === '1h' ? coin.price_change_percentage_1h_in_currency :
                  dateRange === '7d' ? coin.price_change_percentage_7d_in_currency :
                  dateRange === '30d' ? coin.price_change_percentage_30d_in_currency :
                  dateRange === '1y' ? coin.price_change_percentage_1y_in_currency :
                  coin.price_change_percentage_24h
                )}
              </td>
              <td className="py-1 px-2 text-right font-medium text-xs">
                {formatPercentage(coin.price_change_percentage_7d_in_currency)}
              </td>
              <td className="py-1 px-2 text-right font-medium text-xs">
                {formatPercentage(coin.price_change_percentage_30d_in_currency)}
              </td>
              <td className="py-1 px-2 text-center chart-cell">
                <div className="w-16 h-8 rounded flex items-center justify-center overflow-hidden mx-auto chart-container">
                  {/* Perfectly Centered Line Chart */}
                  <svg 
                    className="w-full h-full chart-svg" 
                    viewBox="0 0 48 24" 
                    preserveAspectRatio="xMidYMid meet"
                    style={{ display: 'block' }}
                  >
                    {/* Chart Area - perfectly centered */}
                    <defs>
                      <clipPath id={`chart-clip-${coin.id}`}>
                        <rect x="0" y="0" width="48" height="24" />
                      </clipPath>
                    </defs>
                    
                    {/* Background - full container */}
                    <rect x="0" y="0" width="48" height="24" fill="transparent" />
                    
                    {/* Subtle Grid Lines - perfectly centered and evenly distributed */}
                    <line x1="0" y1="4" x2="48" y2="4" stroke="#374151" strokeWidth="0.3" opacity="0.5" />
                    <line x1="0" y1="10" x2="48" y2="10" stroke="#374151" strokeWidth="0.3" opacity="0.5" />
                    <line x1="0" y1="16" x2="48" y2="16" stroke="#374151" strokeWidth="0.3" opacity="0.5" />
                    <line x1="0" y1="22" x2="48" y2="22" stroke="#374151" strokeWidth="0.3" opacity="0.5" />
                    
                    {/* Price Line Chart - perfectly centered with balanced vertical range */}
                    <path
                      d="M0,16 L6,13 L12,19 L18,11 L24,21 L30,16 L36,22 L42,13 L48,16"
                      fill="none"
                      stroke={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      clipPath={`url(#chart-clip-${coin.id})`}
                    />
                    
                    {/* Price Points - perfectly centered and aligned with the line */}
                    <circle cx="0" cy="16" r="0.8" fill={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} />
                    <circle cx="6" cy="13" r="0.8" fill={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} />
                    <circle cx="12" cy="19" r="0.8" fill={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} />
                    <circle cx="18" cy="11" r="0.8" fill={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} />
                    <circle cx="24" cy="21" r="0.8" fill={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} />
                    <circle cx="30" cy="16" r="0.8" fill={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} />
                    <circle cx="36" cy="22" r="0.8" fill={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} />
                    <circle cx="42" cy="13" r="0.8" fill={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} />
                    <circle cx="48" cy="16" r="0.8" fill={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} />
                  </svg>
                </div>
              </td>
              <td className="py-1 px-2 text-right font-medium text-white text-xs">
                {formatMarketCap(coin.market_cap)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Trending Coins 100 Component (Compact Mobile)
function TrendingCoins100({ onCoinClick }) {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        		const response = await fetch('/api/coingecko-proxy/search/trending', {
			headers: {
				'Accept': 'application/json'
			}
		});
        const data = await response.json();
        setTrendingCoins(data.coins || []);
      } catch (error) {
        console.error('Error fetching trending coins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCoins();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6 sm:py-8">
        <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {(trendingCoins || []).map((coin, index) => (
        <div 
          key={index} 
          className="bg-gray-800 rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 border border-gray-700 hover:border-blue-500 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
          onClick={() => onCoinClick && onCoinClick(coin.item)}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <img 
              src={coin.item.small} 
              alt={coin.item.name}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = '/Asset/duniacrypto.png';
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-xs sm:text-sm truncate group-hover:text-blue-400 transition-colors">{coin.item.name}</h3>
              <p className="text-gray-400 text-xs">{coin.item.symbol.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 text-xs sm:text-sm font-medium">
                #{coin.item.market_cap_rank || 'N/A'}
              </p>
              {/* Click indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Price BTC:</span>
              <span className="text-white">{coin.item.price_btc.toFixed(8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap Rank:</span>
              <span className="text-white">{coin.item.market_cap_rank || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Score:</span>
              <span className="text-blue-400">{coin.item.score}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Crypto Sectors Component (Compact Mobile)
function CryptoSectors() {
  const sectors = [
    { name: 'DeFi', description: 'Decentralized Finance', coins: 245, marketCap: '$45.2B', change: 2.3 },
    { name: 'NFT', description: 'Non-Fungible Tokens', coins: 156, marketCap: '$12.8B', change: -1.2 },
    { name: 'Layer 1', description: 'Blockchain Platforms', coins: 89, marketCap: '$89.4B', change: 4.7 },
    { name: 'Layer 2', description: 'Scaling Solutions', coins: 67, marketCap: '$23.1B', change: 1.8 },
    { name: 'Gaming', description: 'GameFi & Metaverse', coins: 134, marketCap: '$18.9B', change: -0.5 },
    { name: 'Privacy', description: 'Privacy Coins', coins: 45, marketCap: '$8.7B', change: 3.1 },
    { name: 'Exchange', description: 'DEX & CEX Tokens', coins: 78, marketCap: '$15.3B', change: 0.9 },
    { name: 'Meme', description: 'Meme Coins', coins: 123, marketCap: '$6.2B', change: -2.1 }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {(sectors || []).map((sector, index) => (
        <div key={index} className="bg-gray-800 rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg">{sector.name}</h3>
            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium ${
              sector.change >= 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {sector.change >= 0 ? '+' : ''}{sector.change}%
            </span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">{sector.description}</p>
          <div className="space-y-1 sm:space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Coins:</span>
              <span className="text-white">{sector.coins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap:</span>
              <span className="text-white">{sector.marketCap}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Crypto Heatmap Component
function CryptoHeatmap({ searchQuery, filter, dateRange, onCoinClick }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        console.log('Fetching coins for heatmap...');
        // Try to fetch real data from CoinGecko proxy first
        const response = await fetch('/api/coingecko-proxy/coins');
        if (response.ok) {
        const data = await response.json();
          const heatmapData = data.slice(0, 25); // Get top 25 for heatmap
          console.log('Coins loaded successfully for heatmap:', heatmapData.length);
          setCoins(heatmapData);
          setLoading(false);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error loading coins for heatmap:', error);
        // Provide fallback data if local generator fails
        setCoins([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            image: 'https://ui-avatars.com/api/?name=BTC&background=random&color=fff&size=128',
            current_price: 45000,
            market_cap: 850000000000,
            market_cap_rank: 1,
            price_change_percentage_1h_in_currency: 0.5,
            price_change_percentage_24h: 2.5,
            price_change_percentage_7d_in_currency: 8.2,
            price_change_percentage_30d_in_currency: 15.3,
            price_change_percentage_1y_in_currency: 45.7,
            circulating_supply: 19500000,
            total_supply: 21000000,
            max_supply: 21000000,
            ath: 69000,
            total_volume: 25000000000,
            high_24h: 46000,
            low_24h: 44000,
            price_change_24h: 1125,
            market_cap_change_24h: 21250000000,
            market_cap_change_percentage_24h: 2.5,
            fully_diluted_valuation: 945000000000,
            ath_change_percentage: -34.78,
            ath_date: '2021-11-10T14:24:11.849Z',
            atl: 67.81,
            atl_change_percentage: 66263.25,
            atl_date: '2013-07-06T00:00:00.000Z',
            roi: null,
            last_updated: new Date().toISOString()
          },
          {
            id: 'ethereum',
            symbol: 'eth',
            name: 'Ethereum',
            image: 'https://ui-avatars.com/api/?name=ETH&background=random&color=fff&size=128',
            current_price: 3000,
            market_cap: 350000000000,
            market_cap_rank: 2,
            price_change_percentage_1h_in_currency: 0.3,
            price_change_percentage_24h: 1.8,
            price_change_percentage_7d_in_currency: 6.5,
            price_change_percentage_30d_in_currency: 12.8,
            price_change_percentage_1y_in_currency: 38.2,
            circulating_supply: 120000000,
            total_supply: 120000000,
            max_supply: null,
            ath: 4800,
            total_volume: 15000000000,
            high_24h: 3100,
            low_24h: 2900,
            price_change_24h: 54,
            market_cap_change_24h: 6300000000,
            market_cap_change_percentage_24h: 1.8,
            fully_diluted_valuation: 350000000000,
            ath_change_percentage: -37.5,
            ath_date: '2021-11-10T14:24:11.849Z',
            atl: 0.432979,
            atl_change_percentage: 692775.25,
            atl_date: '2015-10-20T00:00:00.000Z',
            roi: null,
            last_updated: new Date().toISOString()
          }
        ]);
        setLoading(false);
      }
    };

    fetchCoins();
  }, [dateRange]);

  const getFilteredCoins = () => {
    let filteredCoins = coins || [];
    
    console.log('Initial coins count for heatmap:', filteredCoins.length);
    console.log('Current filter for heatmap:', filter);
    console.log('Current search query for heatmap:', searchQuery);

    // Apply search filter
    if (searchQuery) {
      filteredCoins = filteredCoins.filter(coin =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('After search filter for heatmap:', filteredCoins.length);
    }

    // Apply category filter
    switch (filter) {
      case 'gainers':
        filteredCoins = filteredCoins.filter(coin => {
          const change = dateRange === '1h' ? coin.price_change_percentage_1h_in_currency :
                        dateRange === '7d' ? coin.price_change_percentage_7d_in_currency :
                        dateRange === '30d' ? coin.price_change_percentage_30d_in_currency :
                        dateRange === '1y' ? coin.price_change_percentage_1y_in_currency :
                        coin.price_change_percentage_24h;
          return (change || 0) > 0;
        });
        break;
      case 'losers':
        filteredCoins = filteredCoins.filter(coin => {
          const change = dateRange === '1h' ? coin.price_change_percentage_1h_in_currency :
                        dateRange === '7d' ? coin.price_change_percentage_7d_in_currency :
                        dateRange === '30d' ? coin.price_change_percentage_30d_in_currency :
                        dateRange === '1y' ? coin.price_change_percentage_1y_in_currency :
                        coin.price_change_percentage_24h;
          return (change || 0) < 0;
        });
        break;
      case 'ethereum': {
        const ethKeywords = ['ethereum', 'eth', 'erc', 'defi', 'nft'];
        filteredCoins = filteredCoins.filter(coin =>
          ethKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'solana': {
        const solKeywords = ['solana', 'sol', 'serum', 'raydium'];
        filteredCoins = filteredCoins.filter(coin =>
          solKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'binance': {
        const bnbKeywords = ['binance', 'bnb', 'bsc', 'pancake'];
        filteredCoins = filteredCoins.filter(coin =>
          bnbKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'polygon': {
        const maticKeywords = ['polygon', 'matic', 'quick'];
        filteredCoins = filteredCoins.filter(coin =>
          maticKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'cardano': {
        const adaKeywords = ['cardano', 'ada'];
        filteredCoins = filteredCoins.filter(coin =>
          adaKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'avalanche': {
        const avaxKeywords = ['avalanche', 'avax'];
        filteredCoins = filteredCoins.filter(coin =>
          avaxKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'polkadot': {
        const dotKeywords = ['polkadot', 'dot', 'kusama'];
        filteredCoins = filteredCoins.filter(coin =>
          dotKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'base': {
        const baseKeywords = ['base', 'coinbase'];
        filteredCoins = filteredCoins.filter(coin =>
          baseKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'arbitrum': {
        const arbKeywords = ['arbitrum', 'arb'];
        filteredCoins = filteredCoins.filter(coin =>
          arbKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'optimism': {
        const optKeywords = ['optimism', 'op'];
        filteredCoins = filteredCoins.filter(coin =>
          optKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'cosmos': {
        const atomKeywords = ['cosmos', 'atom', 'osmo'];
        filteredCoins = filteredCoins.filter(coin =>
          atomKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'chainlink': {
        const linkKeywords = ['chainlink', 'link'];
        filteredCoins = filteredCoins.filter(coin =>
          linkKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'filecoin': {
        const filKeywords = ['filecoin', 'fil'];
        filteredCoins = filteredCoins.filter(coin =>
          filKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'near': {
        const nearKeywords = ['near', 'aurora'];
        filteredCoins = filteredCoins.filter(coin =>
          nearKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'algorand': {
        const algoKeywords = ['algorand', 'algo'];
        filteredCoins = filteredCoins.filter(coin =>
          algoKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      case 'stellar': {
        const xlmKeywords = ['stellar', 'xlm'];
        filteredCoins = filteredCoins.filter(coin =>
          xlmKeywords.some(keyword => 
            coin.name.toLowerCase().includes(keyword) || 
            coin.symbol.toLowerCase().includes(keyword)
          )
        );
        break;
      }
      default:
        break;
    }

    // Apply date range sorting (no filtering, just sorting by the selected time period)
    if (dateRange) {
      switch (dateRange) {
        case '1h':
          filteredCoins.sort((a, b) => 
            (b.price_change_percentage_1h_in_currency || 0) - (a.price_change_percentage_1h_in_currency || 0)
          );
          break;
        case '7d':
          filteredCoins.sort((a, b) => 
            (b.price_change_percentage_7d_in_currency || 0) - (a.price_change_percentage_7d_in_currency || 0)
          );
          break;
        case '30d':
          filteredCoins.sort((a, b) => 
            (b.price_change_percentage_30d_in_currency || 0) - (a.price_change_percentage_30d_in_currency || 0)
          );
          break;
        case '1y':
          filteredCoins.sort((a, b) => 
            (b.price_change_percentage_1y_in_currency || 0) - (a.price_change_percentage_1y_in_currency || 0)
          );
          break;
        case '24h':
        default:
          // Sort by 24h performance (default)
          filteredCoins.sort((a, b) => 
            (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
          );
          break;
      }
    }

    return filteredCoins;
  };



  const getHeatmapColor = (percentage) => {
    if (percentage >= 20) return 'bg-green-600';
    if (percentage >= 10) return 'bg-green-500';
    if (percentage >= 5) return 'bg-green-400';
    if (percentage >= 0) return 'bg-green-300';
    if (percentage >= -5) return 'bg-red-300';
    if (percentage >= -10) return 'bg-red-400';
    if (percentage >= -20) return 'bg-red-500';
    return 'bg-red-600';
  };

  const getHeatmapOpacity = (percentage) => {
    const absPercentage = Math.abs(percentage);
    if (absPercentage >= 20) return 'opacity-90';
    if (absPercentage >= 10) return 'opacity-80';
    if (absPercentage >= 5) return 'opacity-70';
    if (absPercentage >= 0) return 'opacity-60';
    return 'opacity-50';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredCoins = getFilteredCoins();
  
  console.log('Filtered coins for heatmap:', filteredCoins.length);

  return (
    <div className="w-full">
      {/* Custom Heatmap - Full Width */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-2 sm:p-4">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
            Top 48 Crypto Market Heatmap - {dateRange === '1h' ? '1h' : 
                                           dateRange === '7d' ? '7d' : 
                                           dateRange === '30d' ? '30d' : 
                                           dateRange === '1y' ? '1y' : '24h'} Performance
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">Real-time cryptocurrency market overview - Bitcoin dominates 50% of the space</p>
        </div>
        
        {/* Custom Heatmap Container */}
        <div className="h-[500px] sm:h-[600px] w-full relative">
          {/* Heatmap Grid - Top 48 Only */}
          <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-14 lg:grid-cols-16 xl:grid-cols-18 gap-0.5 h-full">
            {(filteredCoins || []).slice(0, 48).map((coin, index) => {
              if (!coin || !coin.id) return null;
              const priceChange = 
                dateRange === '1h' ? coin.price_change_percentage_1h_in_currency || 0 :
                dateRange === '7d' ? coin.price_change_percentage_7d_in_currency || 0 :
                dateRange === '30d' ? coin.price_change_percentage_30d_in_currency || 0 :
                dateRange === '1y' ? coin.price_change_percentage_1y_in_currency || 0 :
                coin.price_change_percentage_24h || 0;
              const marketCapRank = coin.market_cap_rank || 999;
              
              // Calculate size based on rank - Bitcoin 50% dominance, others scaled accordingly
              const getSizeClass = (rank) => {
                if (rank === 1) return 'col-span-8 row-span-8'; // 50% - Bitcoin (8x8 in 16x16 grid = 50%)
                if (rank === 2) return 'col-span-2 row-span-2'; // Medium - Ethereum
                if (rank === 3) return 'col-span-2 row-span-2'; // Medium - USDT
                if (rank === 4) return 'col-span-2 row-span-2'; // Medium - BNB
                if (rank === 5) return 'col-span-1 row-span-1'; // Small - XRP
                if (rank <= 10) return 'col-span-1 row-span-1'; // Small - Top 10
                if (rank <= 15) return 'col-span-1 row-span-1'; // Smaller - Top 15
                if (rank <= 25) return 'col-span-1 row-span-1'; // Even smaller - Top 25
                if (rank <= 35) return 'col-span-1 row-span-1'; // Smallest - Top 35
                return 'col-span-1 row-span-1'; // Minimal - Top 48
              };
              
              // Calculate logo size based on rank - Bitcoin dominant, others scaled
              const getLogoSize = (rank) => {
                if (rank === 1) return 'w-16 h-16'; // 64px - Bitcoin (much larger)
                if (rank === 2) return 'w-8 h-8';   // 32px - Ethereum
                if (rank === 3) return 'w-6 h-6';   // 24px - USDT
                if (rank === 4) return 'w-6 h-6';   // 24px - BNB
                if (rank === 5) return 'w-5 h-5';   // 20px - XRP
                if (rank <= 10) return 'w-4 h-4';   // 16px - Top 10
                if (rank <= 15) return 'w-3 h-3';   // 12px - Top 15
                if (rank <= 25) return 'w-2 h-2';   // 8px - Top 25
                if (rank <= 35) return 'w-2 h-2';   // 8px - Top 35
                return 'w-1 h-1';                   // 4px - Top 48
              };
              
              // Calculate color intensity based on price change - much darker colors for better visibility
              const getColorIntensity = (change) => {
                const absChange = Math.abs(change);
                if (absChange >= 20) return change > 0 ? 'bg-emerald-800' : 'bg-red-800';
                if (absChange >= 15) return change > 0 ? 'bg-emerald-700' : 'bg-red-700';
                if (absChange >= 10) return change > 0 ? 'bg-emerald-600' : 'bg-red-600';
                if (absChange >= 5) return change > 0 ? 'bg-emerald-500' : 'bg-red-500';
                if (absChange >= 2) return change > 0 ? 'bg-emerald-400' : 'bg-red-400';
                if (absChange >= 0.5) return change > 0 ? 'bg-emerald-300' : 'bg-red-300';
                return change > 0 ? 'bg-emerald-200' : 'bg-red-200';
              };
              
              return (
                <div 
                  key={coin.id} 
                  className={`relative group cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10 ${getSizeClass(marketCapRank)}`}
                >
                  <div 
                    className={`w-full h-full rounded-sm border border-gray-600/70 transition-all duration-300 hover:border-gray-400/90 ${getColorIntensity(priceChange)} cursor-pointer`}
                    onClick={() => onCoinClick(coin)}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-0.5">
                      {/* Logo */}
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className={`rounded-full mb-0.5 ${getLogoSize(marketCapRank)}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/Asset/duniacrypto.png';
                        }}
                      />
                      {/* Symbol and Name for top 4 only */}
                      {marketCapRank <= 4 && (
                        <div className="text-white text-xs font-bold leading-none mb-0.5 text-center">
                          {coin.symbol.toUpperCase()}
                        </div>
                      )}
                      {/* Percentage - only show for top 4 */}
                      {marketCapRank <= 4 && (
                        <div className={`text-white font-bold leading-none ${
                          marketCapRank === 1 ? 'text-xl' : 
                          marketCapRank === 2 ? 'text-base' : 
                          'text-sm'
                        }`}>
                          {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-duniacrypto-bg-darker/80 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
            <div className="flex items-center space-x-4 text-xs text-white">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-emerald-700 rounded"></div>
                <span>Positive</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-700 rounded"></div>
                <span>Negative</span>
              </div>
              <div className="text-gray-400">
                Size = Market Cap Rank
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No Results */}
      {(filteredCoins || []).length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No coins found matching your criteria.
        </div>
      )}
    </div>
  );
} 