"use client";

import React, { useState, useEffect } from "react";
import DexScreenerTokenChart from "./DexScreenerTokenChart";
import DexScreenerTokenTransactions from "./DexScreenerTokenTransactions";
import DexScreenerTokenHolders from "./DexScreenerTokenHolders";
import DexScreenerTokenTabs from "./DexScreenerTokenTabs";
import TokenSidebar from "./token/TokenSidebar";
import { fetchDetailedCoinData, createPairData } from "../utils/coinDataUtils";

const DexScreenerChartTxnsLayout = ({ coinData, symbol }) => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [timeFrame, setTimeFrame] = useState("1d");
  const [chartHeight, setChartHeight] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [detailedCoinData, setDetailedCoinData] = useState(null);

  // Set client-side flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch detailed coin data including launch date
  useEffect(() => {
    const getDetailedCoinData = async () => {
      if (!coinData?.id) return;

      const data = await fetchDetailedCoinData(coinData.id);
      setDetailedCoinData(data);
    };

    getDetailedCoinData();
  }, [coinData?.id]);

  // Create proper pair data based on the actual coin
  const getPairData = () => {
    if (!coinData) return null;

    return createPairData(coinData, detailedCoinData, symbol);
  };

  const mockPair = getPairData();

  // Create token data for sidebar
  const getTokenData = () => {
    if (!coinData) return null;

    return {
        symbol: symbol,
        name: coinData.name || symbol,
      address: mockPair?.pairAddress || "0x0000000000000000000000000000000000000000",
      logo: coinData.image?.small || coinData.image?.thumb || "/images/token-default.svg",
    };
  };

  const tokenData = getTokenData();

  // Handle mouse down for resizing
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(chartHeight);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle mouse move for resizing
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = startY - e.clientY;
    const newHeight = Math.max(200, Math.min(800, startHeight + deltaY));
    setChartHeight(newHeight);
  };

  // Handle mouse up for resizing
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Handle time frame change
  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Check if it's Solana
  const isSolana = mockPair?.chainId === "solana";

  // Don't render until client-side to prevent hydration issues
  if (!isClient) {
    return (
      <div className="flex flex-col h-full bg-dex-bg-primary">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-dex-text-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  if (!mockPair || !tokenData) {
    return (
      <div className="flex flex-col h-full bg-dex-bg-primary">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-dex-text-secondary">No coin data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-dex-bg-primary">
      {/* Main Content */}
      <div className="flex flex-col flex-1">
      {/* Chart Section */}
      <div
        className="relative bg-dex-bg-secondary rounded-lg p-4"
        style={{ height: `${chartHeight}px` }}
      >
        <div className="absolute inset-0">
          <DexScreenerTokenChart 
            key={`chart-${coinData?.id || symbol}-${timeFrame}`}
            pair={mockPair}
            timeFrame={timeFrame}
            onTimeFrameChange={handleTimeFrameChange}
          />
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="h-2 bg-dex-bg-secondary hover:bg-dex-blue cursor-ns-resize flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
      </div>

      {/* Tabs Section */}
      <div className="bg-dex-bg-primary">
        <DexScreenerTokenTabs
          activeTab={activeTab}
          onChange={handleTabChange}
          isSolana={isSolana}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-dex-bg-primary p-4">
        {activeTab === "transactions" && (
          <DexScreenerTokenTransactions
            pair={mockPair}
            chainId={mockPair.chainId}
          />
        )}
        {activeTab === "holders" && !isSolana && (
          <DexScreenerTokenHolders
            token={{ address: mockPair.baseToken?.address || mockPair.pairAddress }}
            chainId={mockPair.chainId}
          />
        )}
        {activeTab === "holder-insights" && !isSolana && (
          <div className="p-4 text-center text-dex-text-secondary">
            Holder insights coming soon...
          </div>
        )}
        {activeTab === "snipers" && (
          <div className="p-4 text-center text-dex-text-secondary">
            Snipers data coming soon...
          </div>
        )}
      </div>
      </div>

      {/* Sidebar - Always visible */}
      <TokenSidebar
        token={tokenData}
        pair={mockPair}
        timeFrame={timeFrame}
        chainId={mockPair.chainId}
      />
    </div>
  );
};

export default DexScreenerChartTxnsLayout;
