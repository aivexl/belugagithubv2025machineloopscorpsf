"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';

const CoinGeckoTransactionTable = ({ data, loading, error, pagination, onLoadMore, coinInfo, coinData }) => {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Auto refresh every 2 seconds for more frequent updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (onLoadMore) {
        onLoadMore();
      }
    }, 20000); // Update every 20 seconds for real-time data

    return () => clearInterval(interval);
  }, [autoRefresh, onLoadMore]);

  // Update current time every second for real-time timestamp display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Basic validators
  const isHex = (s, len) => typeof s === 'string' && /^0x[0-9a-fA-F]+$/.test(s) && (len ? s.length === len : true);
  const isAddress = (s) => isHex(s, 42);
  const isTxHash = (s) => isHex(s, 66);

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0,6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount) => {
    if (!amount) return '0';
    const num = parseFloat(amount);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  };

  const formatValue = (value) => {
    if (!value) return '$0.00';
    const num = parseFloat(value);
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)} K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatPrice = (price) => {
    if (!price) return '$0.000000';
    const num = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    const now = currentTime; // Use the currentTime state instead of new Date()
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    // Show very detailed time for recent transactions
    if (diffInSeconds < 60) {
      return `${diffInSeconds} s`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;
      return `${minutes}m ${seconds}s`;
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Use useMemo to prevent unnecessary re-sorting
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'timestamp') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (sortField === 'amountIn' || sortField === 'amountOut' || sortField === 'valueUsd' || sortField === 'price') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortField, sortDirection]);

  // Get token symbols from first transaction or coinInfo
  const tokenInSymbol = data?.[0]?.tokenInSymbol || coinInfo?.symbol || 'TOKEN';
  const tokenOutSymbol = data?.[0]?.tokenOutSymbol || 'USD';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-400">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-400">No transactions found for this token</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Transactions Table - Clean like DexScreener */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('timestamp')}
                >
                  AGE
                  {sortField === 'timestamp' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('type')}
                >
                  TYPE
                  {sortField === 'type' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('valueUsd')}
                >
                  USD
                  {sortField === 'valueUsd' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('amountIn')}
                >
                  {tokenInSymbol}
                  {sortField === 'amountIn' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tokenOutSymbol}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('price')}
                >
                  PRICE
                  {sortField === 'price' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  MAKER
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  TXN
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedData.map((tx) => (
                <tr key={tx.id || `${tx.timestamp}-${tx.maker}`} className="hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatTime(tx.timestamp)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tx.type === 'buy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.type === 'buy' ? 'Buy' : 'Sell'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    tx.type === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatValue(tx.valueUsd)}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    tx.type === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatAmount(tx.amountIn)}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    tx.type === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatAmount(tx.amountOut)}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    tx.type === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatPrice(tx.price)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🐬</span>
                      {(() => { let maker = tx.maker; if (!maker || !isAddress(maker) || isTxHash(maker)) { maker = tx.from || tx.fromAddress || tx.to || tx.toAddress || maker; } return <span className="font-medium">{formatAddress(maker || '')}</span>; })()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
                    <span className="text-lg">🔗</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center text-gray-400 text-xs">
        {autoRefresh ? '🔄 Auto-refreshing every 2 seconds' : '⏸️ Auto-refresh paused'}
      </div>
    </div>
  );
};

export default CoinGeckoTransactionTable; 