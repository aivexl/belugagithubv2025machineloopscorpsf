"use client";

import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

export default function TradingViewChart({ symbol, coinData, className = "", showBranding = true }) {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => onLoadScriptRef.current = null;

    function createWidget() {
      if (document.getElementById('tradingview-chart-widget') && 'TradingView' in window) {
        // Ensure we're using a price chart symbol, not market cap
        const chartSymbol = symbol.includes('USD') ? symbol : `${symbol}USD`;
        
        new window.TradingView.widget({
          autosize: true,
          symbol: chartSymbol, // Use price chart symbol
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1', // Candlestick chart for price data
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview-chart-widget',
          width: '100%',
          height: '100%',
          toolbar_bg: '#0D1117',
          hide_top_toolbar: false,
          hide_side_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: [],
          show_popup_button: true,
          popup_width: '100%',
          popup_height: '100%',
          fullscreen: true,
          enable_fullscreen: true,
          backgroundColor: '#0D1117',
          gridColor: '#2A2E39',
          // Custom branding to replace Coinbase
          custom_css_url: showBranding ? '/custom-tradingview.css' : undefined,
        });
      }
    }
  }, [symbol, showBranding]);

  // Add custom CSS to replace Coinbase branding with beluga.id
  useEffect(() => {
    if (showBranding) {
      const style = document.createElement('style');
      style.id = 'beluga-branding-style';
      style.textContent = `
        /* Hide Coinbase branding */
        .tv-chart-container .tv-chart-container__header,
        .tv-chart-container .tv-chart-container__branding,
        .tv-chart-container [data-role="branding"],
        .tv-chart-container .tv-chart-container__logo {
          display: none !important;
        }
        
        /* Add beluga.id branding */
        .tv-chart-container::before {
          content: "beluga.id";
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.7);
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Hide any other exchange branding */
        .tv-chart-container [class*="exchange"],
        .tv-chart-container [class*="branding"],
        .tv-chart-container [class*="logo"] {
          display: none !important;
        }
      `;
      
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('beluga-branding-style');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [showBranding]);

  return (
    <div className={`relative ${className}`}>
      {/* Chart Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-duniacrypto-panel border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {coinData?.image && (
              <img
                src={coinData.image}
                alt={coinData?.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <div>
              <h2 className="text-white font-bold text-lg">{coinData?.name || symbol}</h2>
              <p className="text-gray-400 text-sm">Price Chart - {symbol}</p>
            </div>
          </div>
          
          {/* beluga.id branding in header */}
          {showBranding && (
            <div className="text-right">
              <span className="text-xs text-gray-400">Powered by</span>
              <div className="text-sm font-semibold text-blue-400">beluga.id</div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div 
        id="tradingview-chart-widget" 
        className="w-full h-full"
        style={{ paddingTop: '60px' }} // Account for header
      />
    </div>
  );
} 