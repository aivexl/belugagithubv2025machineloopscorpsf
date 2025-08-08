"use client";

import React, { useEffect, useRef, useState } from 'react';

let tvScriptLoadingPromise;

export default function TradingViewChartWithTools({ 
  symbol, 
  coinData, 
  className = "",
  height = '100%',
  width = '100%'
}) {
  const onLoadScriptRef = useRef();
  const chartContainerRef = useRef(null);
  const widgetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to replace any exchange text with "Beluga"
  // This handles multiple exchange names that might appear in TradingView
  const replaceExchangeText = () => {
    if (!chartContainerRef.current) return;
    
    const container = chartContainerRef.current;
    
    // List of common exchange names to replace
    const exchangesToReplace = [
      'Coinbase', 'Binance', 'Kraken', 'Bitfinex', 'sonar.studio', 
      'BINANCE', 'COINBASE', 'KRAKEN', 'BITFINEX', 'SONAR.STUDIO',
      'Binance', 'Coinbase', 'Kraken', 'Bitfinex', 'Sonar.Studio'
    ];
    
    // Function to walk through all text nodes and replace exchange names with "Beluga"
    const walkTextNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let textContent = node.textContent;
        exchangesToReplace.forEach(exchange => {
          if (textContent.includes(exchange)) {
            textContent = textContent.replace(new RegExp(exchange, 'gi'), 'Beluga');
          }
        });
        if (textContent !== node.textContent) {
          node.textContent = textContent;
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
          let textContent = mutation.target.textContent;
          exchangesToReplace.forEach(exchange => {
            if (textContent.includes(exchange)) {
              textContent = textContent.replace(new RegExp(exchange, 'gi'), 'Beluga');
            }
          });
          if (textContent !== mutation.target.textContent) {
            mutation.target.textContent = textContent;
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
        script.onerror = () => {
          console.error('Failed to load TradingView script');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => {
      onLoadScriptRef.current = null;
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };

    function createWidget() {
      if (chartContainerRef.current && 'TradingView' in window) {
        // Clean up existing widget
        if (widgetRef.current) {
          widgetRef.current.remove();
        }

        // Create custom symbol with "Beluga" exchange name
        // This ensures the chart shows "Beluga" as the exchange
        const baseSymbol = symbol?.toUpperCase() || 'BTC';
        const chartSymbol = `BELUGA:${baseSymbol}USD`; // Custom exchange format
        
        try {
          const widget = new window.TradingView.widget({
            autosize: true,
            symbol: chartSymbol, // Use custom symbol format
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: 'candlestick',
            locale: 'en',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: chartContainerRef.current.id,
            width: width,
            height: height,
            toolbar_bg: '#1F2937',
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
            // Callbacks
            ready: (chart) => {
              console.log('TradingView chart ready with Beluga branding');
              setIsLoading(false);
              widgetRef.current = chart;
              
              // Replace exchange text after chart is ready
              setTimeout(() => {
                replaceExchangeText();
              }, 1000);
            },
            symbol_change: (symbol) => {
              console.log('Symbol changed to:', symbol);
              // Re-apply exchange text replacement when symbol changes
              setTimeout(() => {
                replaceExchangeText();
              }, 500);
            },
            loading_screen: {
              backgroundColor: '#0D1117',
              foregroundColor: '#00D4FF'
            }
          });

          return widget;
        } catch (error) {
          console.error('Error creating TradingView widget:', error);
          setIsLoading(false);
        }
      }
    }
  }, [symbol, height, width]);

  // Add comprehensive CSS to replace exchange branding with "Beluga"
  useEffect(() => {
    const style = document.createElement('style');
    style.id = `beluga-branding-style-${symbol}`;
    style.textContent = `
      /* Hide original exchange branding */
      #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container .tv-chart-container__header,
      #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container .tv-chart-container__branding,
      #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container [data-role="branding"],
      #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container .tv-chart-container__logo {
        display: none !important;
      }
      
      /* Target and replace exchange names in the chart header */
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

      /* Replace with "Beluga" using CSS ::after pseudo-element */
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
        content: "Beluga" !important;
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

      /* CSS Overlay for "Beluga" label in top-left corner */
      #${chartContainerRef.current?.id || 'tradingview-chart-widget'} .tv-chart-container::before {
        content: "Beluga" !important;
        position: absolute !important;
        top: 10px !important;
        left: 10px !important;
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.9), rgba(0, 212, 255, 0.7)) !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(0, 212, 255, 0.3) !important;
        border-radius: 8px !important;
        color: white !important;
        padding: 4px 8px !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        z-index: 1000 !important;
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3) !important;
        animation: belugaGlow 3s ease-in-out infinite alternate !important;
      }

      @keyframes belugaGlow {
        0% {
          box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3) !important;
        }
        100% {
          box-shadow: 0 4px 30px rgba(0, 212, 255, 0.5) !important;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById(`beluga-branding-style-${symbol}`);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [symbol]);

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
              <p className="text-gray-400 text-sm">Candlestick Chart - {symbol} (Beluga Data)</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-semibold text-blue-400">beluga.id</div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-duniacrypto-panel z-5">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aqua mx-auto mb-4"></div>
            <p className="text-gray-400">Loading TradingView Chart...</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div 
        ref={chartContainerRef}
        id={containerId}
        className="w-full h-full"
        style={{ paddingTop: '60px' }} // Account for header
      />
    </div>
  );
} 