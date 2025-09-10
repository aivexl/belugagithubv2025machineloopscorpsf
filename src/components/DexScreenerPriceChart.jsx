"use client";
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';

const DexScreenerPriceChart = ({ cryptoId, timeRange, currentPrice, priceFlash }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayPrice, setDisplayPrice] = useState(currentPrice || 0);
  const [flashState, setFlashState] = useState("");
  const [pollTick, setPollTick] = useState(0);

  // Global 20s aligned polling tick (synchronized cadence with sidebar)
  useEffect(() => {
    const pollMs = 20000;
    let cancelled = false;
    let timerId = null;
    const schedule = (delay) => {
      timerId = setTimeout(function run() {
        if (cancelled) return;
        setPollTick((t) => t + 1);
        schedule(pollMs);
      }, delay);
    };
    // Align to wall clock so multiple components tick together
    const alignDelay = pollMs - (Date.now() % pollMs);
    schedule(alignDelay);
    return () => { cancelled = true; if (timerId) clearTimeout(timerId); };
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [cryptoId, timeRange]);

  // Refresh chart data periodically to sync with real-time data
  useEffect(() => {
    if (pollTick > 0) { // Skip first tick (initial load)
      console.log('Chart polling refresh:', pollTick);
      fetchChartData(false); // Don't set loading state for polling refreshes
    }
  }, [pollTick]);

  // Update display price and flash state when props change - sync with sidebar timing
  useEffect(() => {
    if (currentPrice !== undefined) {
      console.log('Chart price update:', { currentPrice, displayPrice, priceFlash });
      setDisplayPrice(currentPrice);
      setFlashState(priceFlash || "");
      
      // Clear flash state after animation - same timing as sidebar (500ms)
      if (priceFlash) {
        const timer = setTimeout(() => setFlashState(""), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentPrice, priceFlash]);

  const fetchChartData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // Fetch chart data with retry mechanism for 431 errors
      let response;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          response = await fetch(`/api/coingecko/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${timeRange}`);

          if (response.status === 431) {
            retryCount++;
            if (retryCount < maxRetries) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              continue;
            }
          }
          break;
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment.');
        }
        if (response.status === 431) {
          throw new Error('Request header fields too large. Please try again.');
        }
        throw new Error(`Failed to fetch chart data: ${response.status}`);
      }

      const data = await response.json();

      if (data.prices) {
        const formattedData = data.prices.map(([timestamp, price]) => ({
          time: timestamp,
          price: parseFloat(price.toFixed(2)),
          timestamp: timestamp
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Keep previous data or show empty state
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value) => {
    if (!value || value === 0) return "$0.00";
    
    if (value < 0.000001) {
      return `$${value.toExponential(2)}`;
    } else if (value < 0.01) {
      return `$${value.toFixed(6)}`;
    } else if (value < 1) {
      return `$${value.toFixed(4)}`;
    } else if (value < 1000) {
      return `$${value.toFixed(2)}`;
    } else {
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    if (timeRange === '1d') {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } else if (timeRange === '7d') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } else if (timeRange === '30d') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit'
      });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = date.toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return (
        <div className="bg-gray-800 dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-600">
          <p className="text-gray-300 dark:text-gray-400 text-sm">{formattedDate}</p>
          <p className="text-blue-400 font-semibold text-lg">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-dex-text-secondary">Loading chart...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-dex-text-secondary">No chart data available</div>
      </div>
    );
  }

  // Get current price (prioritize currentPrice from props, fallback to chart data)
  const chartCurrentPrice = currentPrice || (chartData.length > 0 ? chartData[chartData.length - 1].price : 0);
  
  // Calculate label position based on chart data
  const getLabelPosition = () => {
    if (!chartData.length || chartCurrentPrice === 0) return { top: '50%' };
    
    // Find min and max prices from chart data
    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Calculate percentage position of current price
    const priceRange = maxPrice - minPrice;
    if (priceRange === 0) return { top: '50%' };
    
    const pricePosition = (chartCurrentPrice - minPrice) / priceRange;
    const topPercentage = 100 - (pricePosition * 100); // Invert because chart Y-axis is inverted
    
    return { top: `${Math.max(5, Math.min(95, topPercentage))}%` };
  };

  return (
    <div className="h-full w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="dexColorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            opacity={0.3}
          />

          <XAxis
            dataKey="time"
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatDate}
          />

          <YAxis
            orientation="right"
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatPrice(value)}
            domain={['dataMin - 10', 'dataMax + 10']}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Current price reference line */}
          <ReferenceLine 
            y={chartCurrentPrice} 
            stroke="#3B82F6" 
            strokeDasharray="5 5" 
            strokeWidth={2}
            opacity={0.8}
          />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#dexColorPrice)"
            dot={false}
            activeDot={{ r: 4, fill: '#3B82F6', stroke: '#1F2937', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Price label with background - positioned to align with Y-axis and dashed line */}
      {(currentPrice || chartCurrentPrice) > 0 && (
        <div 
          className={`absolute text-white px-3 py-1 rounded-md text-xs font-semibold shadow-lg ${
            flashState === 'up' ? 'bg-green-500' : flashState === 'down' ? 'bg-red-500' : 'bg-blue-600'
          }`}
          style={{ 
            right: '5px',
            ...getLabelPosition(),
            transform: 'translateY(-50%)',
            zIndex: 10,
            minWidth: '80px',
            textAlign: 'center'
          }}
        >
          {formatPrice(currentPrice || chartCurrentPrice)}
        </div>
      )}
    </div>
  );
};

export default DexScreenerPriceChart;


