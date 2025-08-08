"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function CleanTradingViewChart({ 
  symbol, 
  coinData, 
  className = "",
  height = '100%',
  width = '100%'
}) {
  const chartContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      createWidget();
    };
    script.onerror = () => {
      setError('Failed to load TradingView script');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.log('Widget cleanup error:', e);
        }
      }
      const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [symbol]);

  const createWidget = () => {
    if (!window.TradingView || !chartContainerRef.current) {
      setError('TradingView not available');
      setIsLoading(false);
      return;
    }

    try {
      // Create clean symbol without exchange - use valid TradingView symbols
      const baseSymbol = symbol?.toUpperCase() || 'BTC';
      let chartSymbol;
      
      // Remove 'USD' suffix if present to get the base symbol
      const cleanSymbol = baseSymbol.replace('USD', '');
      
      console.log('Chart symbol mapping:', { originalSymbol: symbol, baseSymbol, cleanSymbol });
      
      // Map common crypto symbols to valid TradingView symbols
      switch (cleanSymbol) {
        case 'BTC':
          chartSymbol = 'BINANCE:BTCUSDT';
          break;
        case 'ETH':
          chartSymbol = 'BINANCE:ETHUSDT';
          break;
        case 'DOGE':
          chartSymbol = 'BINANCE:DOGEUSDT';
          break;
        case 'ADA':
          chartSymbol = 'BINANCE:ADAUSDT';
          break;
        case 'SOL':
          chartSymbol = 'BINANCE:SOLUSDT';
          break;
        case 'DOT':
          chartSymbol = 'BINANCE:DOTUSDT';
          break;
        case 'LINK':
          chartSymbol = 'BINANCE:LINKUSDT';
          break;
        case 'UNI':
          chartSymbol = 'BINANCE:UNIUSDT';
          break;
        case 'MATIC':
          chartSymbol = 'BINANCE:MATICUSDT';
          break;
        case 'AVAX':
          chartSymbol = 'BINANCE:AVAXUSDT';
          break;
        case 'ATOM':
          chartSymbol = 'BINANCE:ATOMUSDT';
          break;
        case 'LTC':
          chartSymbol = 'BINANCE:LTCUSDT';
          break;
        case 'BCH':
          chartSymbol = 'BINANCE:BCHUSDT';
          break;
        case 'XRP':
          chartSymbol = 'BINANCE:XRPUSDT';
          break;
        case 'TRX':
          chartSymbol = 'BINANCE:TRXUSDT';
          break;
        case 'ETC':
          chartSymbol = 'BINANCE:ETCUSDT';
          break;
        case 'FIL':
          chartSymbol = 'BINANCE:FILUSDT';
          break;
        case 'NEAR':
          chartSymbol = 'BINANCE:NEARUSDT';
          break;
        case 'FTM':
          chartSymbol = 'BINANCE:FTMUSDT';
          break;
        case 'ALGO':
          chartSymbol = 'BINANCE:ALGOUSDT';
          break;
        case 'VET':
          chartSymbol = 'BINANCE:VETUSDT';
          break;
        case 'ICP':
          chartSymbol = 'BINANCE:ICPUSDT';
          break;
        case 'THETA':
          chartSymbol = 'BINANCE:THETAUSDT';
          break;
        case 'XLM':
          chartSymbol = 'BINANCE:XLMUSDT';
          break;
        case 'HBAR':
          chartSymbol = 'BINANCE:HBARUSDT';
          break;
        case 'MANA':
          chartSymbol = 'BINANCE:MANAUSDT';
          break;
        case 'SAND':
          chartSymbol = 'BINANCE:SANDUSDT';
          break;
        case 'AXS':
          chartSymbol = 'BINANCE:AXSUSDT';
          break;
        case 'GALA':
          chartSymbol = 'BINANCE:GALAUSDT';
          break;
        case 'CHZ':
          chartSymbol = 'BINANCE:CHZUSDT';
          break;
        case 'HOT':
          chartSymbol = 'BINANCE:HOTUSDT';
          break;
        case 'ENJ':
          chartSymbol = 'BINANCE:ENJUSDT';
          break;
        case 'BAT':
          chartSymbol = 'BINANCE:BATUSDT';
          break;
        case 'ZIL':
          chartSymbol = 'BINANCE:ZILUSDT';
          break;
        case 'IOTA':
          chartSymbol = 'BINANCE:IOTAUSDT';
          break;
        case 'NEO':
          chartSymbol = 'BINANCE:NEOUSDT';
          break;
        case 'QTUM':
          chartSymbol = 'BINANCE:QTUMUSDT';
          break;
        case 'WAVES':
          chartSymbol = 'BINANCE:WAVESUSDT';
          break;
        case 'ZEC':
          chartSymbol = 'BINANCE:ZECUSDT';
          break;
        case 'DASH':
          chartSymbol = 'BINANCE:DASHUSDT';
          break;
        case 'XMR':
          chartSymbol = 'BINANCE:XMRUSDT';
          break;
        default:
          // Try to use the original symbol with BINANCE exchange
          chartSymbol = `BINANCE:${cleanSymbol}USDT`;
          break;
      }
      
      console.log('Final chart symbol:', chartSymbol);
      
      const widget = new window.TradingView.widget({
        autosize: true,
        symbol: chartSymbol,
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
          console.log('TradingView chart ready');
          setIsLoading(false);
          widgetRef.current = chart;
          
                     // Apply custom styling to hide exchange branding
           setTimeout(() => {
             applyCleanStyling();
             replaceExchangeText();
           }, 1000);
        },
                 symbol_change: (symbol) => {
           console.log('Symbol changed to:', symbol);
           // Re-apply clean styling when symbol changes
           setTimeout(() => {
             applyCleanStyling();
             replaceExchangeText();
           }, 500);
         },
        loading_screen: {
          backgroundColor: '#0D1117',
          foregroundColor: '#00D4FF' // Aqua color for loading spinner
        }
      });

      return widget;
    } catch (error) {
      console.error('Error creating TradingView widget:', error);
      setError('Failed to create chart');
      setIsLoading(false);
    }
  };

  const applyCleanStyling = () => {
    if (!chartContainerRef.current) return;

         // Add comprehensive CSS to hide all exchange branding
     const style = document.createElement('style');
     style.id = `clean-chart-style-${symbol}`;
     style.textContent = `
       /* Hide all exchange branding and names */
       #${chartContainerRef.current.id} .tv-chart-container [class*="exchange"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="branding"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="logo"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="exchange-name"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="market-name"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="ticker"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="header"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="title"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="name"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="info"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="description"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="symbol-info"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="symbol-description"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="symbol-name"] {
         display: none !important;
       }

       /* Hide specific exchange names */
       #${chartContainerRef.current.id} .tv-chart-container *:contains("BINANCE"),
       #${chartContainerRef.current.id} .tv-chart-container *:contains("Binance"),
       #${chartContainerRef.current.id} .tv-chart-container *:contains("binance") {
         display: none !important;
       }

       /* Hide any text that might contain exchange names */
       #${chartContainerRef.current.id} .tv-chart-container * {
         font-size: 0 !important;
       }

       /* Show only the chart area */
       #${chartContainerRef.current.id} .tv-chart-container {
         background: #0D1117 !important;
       }

       /* Hide TradingView branding */
       #${chartContainerRef.current.id} .tv-chart-container [class*="tv-chart-container__branding"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="tv-chart-container__logo"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="tv-chart-container__header"] {
         display: none !important;
       }

       /* Hide any other branding elements */
       #${chartContainerRef.current.id} .tv-chart-container [class*="branding"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="logo"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="header"] {
         display: none !important;
       }

       /* Hide symbol text that contains exchange names */
       #${chartContainerRef.current.id} .tv-chart-container [class*="symbol"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="ticker"],
       #${chartContainerRef.current.id} .tv-chart-container [class*="market"] {
         display: none !important;
       }
     `;
    
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById(`clean-chart-style-${symbol}`);
      if (existingStyle) {
        existingStyle.remove();
      }
         };
   };

   const replaceExchangeText = () => {
     if (!chartContainerRef.current) return;
     
     const container = chartContainerRef.current;
     
     // Function to walk through all text nodes and replace exchange names
     const walkTextNodes = (node) => {
       if (node.nodeType === Node.TEXT_NODE) {
         let textContent = node.textContent;
         // Replace any exchange names with empty string
         if (textContent.includes('BINANCE') || textContent.includes('Binance') || textContent.includes('binance')) {
           textContent = textContent.replace(/BINANCE|Binance|binance/gi, '');
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
           if (textContent.includes('BINANCE') || textContent.includes('Binance') || textContent.includes('binance')) {
             textContent = textContent.replace(/BINANCE|Binance|binance/gi, '');
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

   return (
    <div className={`relative ${className}`}>
             {/* Chart Header */}
       <div className="absolute top-0 left-0 right-0 z-10 bg-duniacrypto-panel border-b border-gray-700 px-4 py-2">
         <div className="flex items-center justify-between">
           <div>
             <h2 className="text-white font-bold text-lg">{coinData?.name || symbol}</h2>
           </div>
           <button 
             onClick={() => {
               if (chartContainerRef.current) {
                 chartContainerRef.current.requestFullscreen?.() || 
                 chartContainerRef.current.webkitRequestFullscreen?.() ||
                 chartContainerRef.current.msRequestFullscreen?.();
               }
             }}
             className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
             title="Fullscreen"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
             </svg>
           </button>
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

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-duniacrypto-panel z-5">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-400 mb-2">Failed to load chart</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div 
        ref={chartContainerRef}
        id={`tradingview-chart-${symbol}-${Date.now()}`}
        className="w-full h-full"
        style={{ paddingTop: '60px' }} // Account for header
      />

      
    </div>
  );
} 