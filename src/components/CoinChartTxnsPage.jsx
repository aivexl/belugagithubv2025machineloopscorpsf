"use client";

import React, { useState } from 'react';
import ResizableChartTxnsLayout from './ResizableChartTxnsLayout';

export default function CoinChartTxnsPage({ coinId, coinData, detailedData }) {
  const [chartHeight, setChartHeight] = useState(70);

  if (!coinData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading coin data...</div>
      </div>
    );
  }

  // Get the trading symbol for TradingView - use proper price chart format
  // Format: SYMBOLUSD for price charts (not market cap)
  const baseSymbol = coinData.symbol?.toUpperCase() || 'BTC';
  const symbol = `${baseSymbol}USD`; // This ensures we get price chart, not market cap

  return (
    <div className="h-full w-full">
      <ResizableChartTxnsLayout 
        coinData={coinData}
        symbol={symbol}
        showBranding={true} // Enable beluga.id branding
        chartHeight={chartHeight}
        onChartHeightChange={setChartHeight}
      />
    </div>
  );
} 