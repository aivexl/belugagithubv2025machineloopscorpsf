"use client";

import React, { useEffect, useRef, useState } from 'react';

let tvScriptLoadingPromise;

export default function TradingViewFullscreenChart({ symbol, onClose, coinData }) {
  const onLoadScriptRef = useRef();
  const [chartHeight, setChartHeight] = useState(500);

  useEffect(() => {
    // Set chart height to fill entire screen
    setChartHeight(window.innerHeight - 80); // Only subtract header height

    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-fullscreen-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => onLoadScriptRef.current = null;

    function createWidget() {
      if (document.getElementById('tradingview-fullscreen-widget') && 'TradingView' in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview-fullscreen-widget',
          width: '100%',
          height: chartHeight,
          toolbar_bg: '#0D1117',
          hide_top_toolbar: false,
          hide_side_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: [], // No default indicators - let user choose
          show_popup_button: true,
          popup_width: '100%',
          popup_height: '100%',
          fullscreen: true,
          enable_fullscreen: true,
          backgroundColor: '#0D1117',
          gridColor: '#2A2E39',
        });
      }
    }
  }, [symbol, chartHeight]);

  return (
    <div className="fixed inset-0 z-50 bg-duniacrypto-bg">
      {/* Fullscreen Header */}
      <div className="bg-duniacrypto-panel border-b border-gray-700 px-4 py-3">
                  <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {coinData?.image && (
                <img
                  src={coinData.image}
                  alt={coinData?.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <h1 className="text-white font-bold text-xl">{coinData?.name || symbol}</h1>
                <p className="text-gray-400 text-sm">{symbol}</p>
              </div>
            </div>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Exit Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Chart */}
      <div className="flex-1">
        <div 
          id="tradingview-fullscreen-widget" 
          className="w-full h-full" 
          style={{ height: `${chartHeight}px` }}
        />
      </div>
    </div>
  );
} 