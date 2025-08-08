"use client";

import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

export default function ReusableTradingViewChart({ 
  symbol, 
  coinData, 
  className = "", 
  showBranding = true,
  brandingText = "beluga.id",
  interval = 'D',
  theme = 'dark',
  style = '1',
  height = '100%',
  width = '100%',
  enablePublishing = false,
  allowSymbolChange = true,
  hideTopToolbar = false,
  hideSideToolbar = false,
  hideLegend = false,
  studies = [],
  backgroundColor = '#0D1117',
  gridColor = '#2A2E39',
  onChartReady,
  onSymbolChange
}) {
  const onLoadScriptRef = useRef();
  const chartContainerRef = useRef(null);

  // Function to replace Coinbase text with beluga.id
  const replaceCoinbaseText = () => {
    if (!chartContainerRef.current) return;
    
    const container = chartContainerRef.current;
    
    // Function to walk through all text nodes and replace "Coinbase" with "beluga.id"
    const walkTextNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.includes('Coinbase')) {
          node.textContent = node.textContent.replace(/Coinbase/g, brandingText);
        }
      } else {
        for (let child of node.childNodes) {
          walkTextNodes(child);
        }
      }
    };
    
    // Initial replacement
    walkTextNodes(container);
    
    // Set up a mutation observer to catch dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              walkTextNodes(node);
            }
          });
        } else if (mutation.type === 'characterData') {
          if (mutation.target.textContent.includes('Coinbase')) {
            mutation.target.textContent = mutation.target.textContent.replace(/Coinbase/g, brandingText);
          }
        }
      });
    });
    
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    return observer;
  };

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
      if (chartContainerRef.current && 'TradingView' in window) {
        // Ensure we're using a price chart symbol, not market cap
        const chartSymbol = symbol.includes('USD') ? symbol : `${symbol}USD`;
        
        const widget = new window.TradingView.widget({
          autosize: true,
          symbol: chartSymbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: theme,
          style: style,
          locale: 'en',
          enable_publishing: enablePublishing,
          allow_symbol_change: allowSymbolChange,
          container_id: chartContainerRef.current.id,
          width: width,
          height: height,
          toolbar_bg: backgroundColor,
          hide_top_toolbar: hideTopToolbar,
          hide_side_toolbar: hideSideToolbar,
          hide_legend: hideLegend,
          save_image: false,
          studies: studies,
          show_popup_button: true,
          popup_width: '100%',
          popup_height: '100%',
          fullscreen: true,
          enable_fullscreen: true,
          backgroundColor: backgroundColor,
          gridColor: gridColor,
          // Custom branding to replace Coinbase
          custom_css_url: showBranding ? '/custom-tradingview.css' : undefined,
          // Callbacks
          ready: (chart) => {
            // Replace Coinbase text after chart is ready
            setTimeout(() => {
              replaceCoinbaseText();
            }, 1000);
            
            if (onChartReady) {
              onChartReady(chart);
            }
          },
          symbol_change: onSymbolChange,
        });

        return widget;
      }
    }
  }, [symbol, showBranding, interval, theme, style, height, width, enablePublishing, allowSymbolChange, hideTopToolbar, hideSideToolbar, hideLegend, studies, backgroundColor, gridColor, onChartReady, onSymbolChange, brandingText]);

  // Add custom CSS to replace Coinbase branding with custom branding
  useEffect(() => {
    if (showBranding && brandingText) {
      const style = document.createElement('style');
      style.id = `branding-style-${symbol}`;
      style.textContent = `
        /* Hide Coinbase branding */
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container .tv-chart-container__header,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container .tv-chart-container__branding,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [data-role="branding"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container .tv-chart-container__logo {
          display: none !important;
        }
        
        /* Target and replace the specific "Coinbase" text in the chart header */
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="symbol-info"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="symbol-description"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="symbol-name"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="exchange-name"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="market-name"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="ticker"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="header"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="title"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="name"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="info"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="description"] {
          font-size: 0 !important;
        }

        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="symbol-info"]::after,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="symbol-description"]::after,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="symbol-name"]::after,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="exchange-name"]::after,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="market-name"]::after,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="ticker"]::after,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="header"]::after,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="title"]::after,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="name"]::after,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="info"]::after,
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="description"]::after {
          content: "${brandingText}" !important;
          font-size: 12px !important;
          color: #ffffff !important;
          font-weight: 500 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        /* Hide any other exchange branding */
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="exchange"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="branding"],
        #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [class*="logo"] {
          display: none !important;
        }
      `;
      
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById(`branding-style-${symbol}`);
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [showBranding, brandingText, symbol]);

  const containerId = `tradingview-chart-${symbol}-${Date.now()}`;

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
          
          {/* Simple branding without "Powered by" */}
          {showBranding && (
            <div className="text-right">
              <div className="text-sm font-semibold text-blue-400">{brandingText}</div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef}
        id={containerId}
        className="w-full h-full"
        style={{ paddingTop: '60px' }} // Account for header
      />
    </div>
  );
} 