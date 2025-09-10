"use client";

import React, { useEffect, useState, useRef } from "react";

const PRICE_CHART_ID = "price-chart-widget-container";

const DexScreenerTokenChart = ({ pair, timeFrame, onTimeFrameChange }) => {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);

  // Map our timeframe to TradingView timeframe format
  const timeframeMap = {
    "5m": "5",
    "15m": "15",
    "1h": "60",
    "4h": "240",
    "1d": "1D",
  };

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!pair || !pair.baseToken?.symbol || !isClient) {
      // Show appropriate message when no valid pair data
      const chartContainer = document.getElementById(PRICE_CHART_ID);
      if (chartContainer) {
        chartContainer.innerHTML = `<div class="h-full flex items-center justify-center text-dex-text-secondary">
          <div class="text-center">
            <div class="text-2xl mb-2">📊</div>
            <div>Chart data not available</div>
            <div class="text-sm opacity-75 mt-1">${pair ? 'No trading pair found' : 'No coin data'}</div>
          </div>
        </div>`;
      }
      return;
    }

    const loadTradingViewWidget = () => {
      // Clear any existing chart
      const chartContainer = document.getElementById(PRICE_CHART_ID);
      if (chartContainer) {
        chartContainer.innerHTML = '';
      }

      // Create TradingView widget
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${pair.baseToken.symbol}USDT`,
          interval: timeframeMap[timeFrame] || "1D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#0f1118",
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: PRICE_CHART_ID,
          backgroundColor: "#0f1118",
          gridColor: "#1D2330",
          textColor: "#7F85A1",
          upColor: "#16C784",
          downColor: "#EA3943",
          borderColor: "#0D111C",
          width: "100%",
          height: "100%",
        });

        console.log(`TradingView chart initialized for ${pair.baseToken.symbol}USDT`);
      } else {
        console.error("TradingView widget not available");
        // Show fallback message
        if (chartContainer) {
          chartContainer.innerHTML = `<div class="h-full flex items-center justify-center text-dex-text-secondary">
            <div class="text-center">
              <div class="text-2xl mb-2">📈</div>
              <div>Chart loading...</div>
              <div class="text-sm opacity-75 mt-1">Please wait</div>
            </div>
          </div>`;
        }
      }
    };

    // Load TradingView script if not already loaded
    if (!document.getElementById("tradingview-widget-script")) {
      const script = document.createElement("script");
      script.id = "tradingview-widget-script";
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = loadTradingViewWidget;
      script.onerror = () => {
        console.error("Failed to load TradingView widget script.");
        const chartContainer = document.getElementById(PRICE_CHART_ID);
        if (chartContainer) {
          chartContainer.innerHTML = `<div class="h-full flex items-center justify-center text-dex-text-secondary">
            <div class="text-center">
              <div class="text-2xl mb-2">⚠️</div>
              <div>Failed to load chart</div>
              <div class="text-sm opacity-75 mt-1">Please try again later</div>
            </div>
          </div>`;
        }
      };
      document.body.appendChild(script);
    } else {
      loadTradingViewWidget();
    }

    // Cleanup function
    return () => {
      const chartContainer = document.getElementById(PRICE_CHART_ID);
      if (chartContainer) {
        chartContainer.innerHTML = '';
      }
    };
  }, [pair, timeFrame, isClient]);

  if (!pair) {
    return (
      <div className="h-full flex items-center justify-center text-dex-text-secondary">
        No chart data available
      </div>
    );
  }

  // Format numbers consistently for hydration
  const formatNumber = (num) => {
    if (!num) return "0";
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top bar with pair info and controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <img
              src={
                pair.exchangeLogo || "/images/exchanges/default-exchange.svg"
              }
              alt={pair.exchangeName}
              className="w-6 h-6 mr-2 rounded-full"
              onError={(e) => {
                e.target.onError = null;
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
              }}
            />
            <span className="font-medium text-dex-text-primary">
              {pair.baseToken?.symbol || pair.pairLabel}
            </span>
            <span className="ml-2 text-dex-text-secondary">
              on {pair.exchangeName}
            </span>
          </div>

          <div className="text-dex-text-secondary text-sm">
            <span className="mr-2">
              Volume: ${formatNumber(pair.volume24hrUsd || 0)}
            </span>
            <span>|</span>
            <span className="mx-2">
              Liquidity: ${formatNumber(pair.liquidityUsd || 0)}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="inline-flex rounded-md mr-4"></div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 bg-dex-bg-secondary rounded-lg">
        <div
          id={PRICE_CHART_ID}
          ref={containerRef}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default DexScreenerTokenChart;