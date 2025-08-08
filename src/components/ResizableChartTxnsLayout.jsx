"use client";

import React, { useState, useRef, useEffect } from 'react';
import CleanTradingViewChart from './CleanTradingViewChart';
import MoralisTransactionTable from './MoralisTransactionTable';
import TransactionStats from './TransactionStats';
import { useTransactionData } from '../hooks/useMoralisData';

export default function ResizableChartTxnsLayout({ 
  coinData, 
  symbol, 
  showBranding = true,
  brandingText = "beluga.id",
  chartHeight = 70,
  onChartHeightChange,
  chartConfig = {}
}) {
  const [currentChartHeight, setCurrentChartHeight] = useState(chartHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const containerRef = useRef(null);
  const dividerRef = useRef(null);

  // Get coin symbol from coinData or use symbol as fallback
  const coinSymbol = coinData?.symbol || symbol?.replace('USD', '');

  // Fetch transaction data using Moralis
  const {
    data: transactionData,
    loading: transactionLoading,
    error: transactionError,
    pagination: transactionPagination,
    loadMore: loadMoreTransactions,
    isSupported: isTransactionSupported,
    cryptoMapping
  } = useTransactionData(coinSymbol);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;
    
    // Limit chart height between 10% and 90% for fullscreen layout
    const clampedHeight = Math.max(10, Math.min(90, newHeight));
    setCurrentChartHeight(clampedHeight);
    
    // Call callback if provided
    if (onChartHeightChange) {
      onChartHeightChange(clampedHeight);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full flex flex-col bg-gray-900"
    >
      {/* Chart Section */}
      <div 
        className="relative bg-gray-800 border border-gray-700 rounded-t-lg"
        style={{ height: `${currentChartHeight}%` }}
      >
        <div className="absolute inset-0">
          <CleanTradingViewChart 
            symbol={symbol}
            coinData={coinData}
            className="w-full h-full"
          />
        </div>
        
        {/* Chart Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-white">
                {coinData?.name || symbol} Price Chart
              </h2>
              {showBranding && (
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                  Powered by {brandingText}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-400">
              Real-time data
            </div>
          </div>
        </div>
      </div>

      {/* Resizable Divider */}
      <div
        ref={dividerRef}
        className="h-3 bg-gray-700 cursor-ns-resize hover:bg-blue-500 transition-colors relative border-y border-gray-600"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      {/* Transactions Section */}
      <div 
        className="bg-gray-800 border border-gray-700 rounded-b-lg overflow-hidden flex-1"
        style={{ height: `${100 - currentChartHeight}%` }}
      >
        <div className="h-full flex flex-col">
          {/* Transactions Header with Toggle */}
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-white">Transaction Analytics</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      showStats 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {showStats ? 'Hide Stats' : 'Show Stats'}
                  </button>
                </div>
              </div>
              
              {/* Transaction Status */}
              <div className="text-sm text-gray-400">
                {transactionLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  `${transactionData?.length || 0} transactions`
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex">
              {/* Main Transactions Table */}
              <div className={`${showStats ? 'w-2/3' : 'w-full'} flex flex-col`}>
                <div className="flex-1 overflow-auto">
                  <MoralisTransactionTable
                    data={transactionData}
                    loading={transactionLoading}
                    error={transactionError}
                    pagination={transactionPagination}
                    onLoadMore={loadMoreTransactions}
                    coinInfo={coinData}
                    coinData={coinData}
                  />
                </div>
              </div>

              {/* Transaction Stats Sidebar */}
              {showStats && (
                <div className="w-1/3 border-l border-gray-700 overflow-auto">
                  <div className="p-4">
                    <TransactionStats 
                      data={transactionData} 
                      coinData={coinData}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 