"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';

const MoralisTransactionTable = ({ data, loading, error, pagination, onLoadMore, coinInfo, coinData }) => {
  const [sortField, setSortField] = useState('block_timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, buys, sells, transfers
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Auto refresh every 3 seconds for stable updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (onLoadMore) {
        onLoadMore();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh, onLoadMore]);

  // Update current time every second for real-time timestamp display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount, decimals = 18) => {
    if (!amount) return '0';
    const num = parseFloat(amount) / Math.pow(10, decimals);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  };

  const formatValue = (value) => {
    if (!value) return '$0.00';
    const num = parseFloat(value);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = currentTime; // Use the currentTime state instead of new Date()
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  const getTransactionType = (tx) => {
    // Enhanced transaction type detection
    if (tx.value && parseFloat(tx.value) > 0) {
      // Check if it's a buy or sell based on gas price or other indicators
      if (tx.gas_price && parseFloat(tx.gas_price) > 50) {
        return 'buy'; // High gas price might indicate urgency (buy)
      }
      return 'transfer';
    }
    return 'contract';
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'buy':
        return (
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        );
      case 'sell':
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        );
      case 'transfer':
        return (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const openExplorer = (txHash) => {
    if (!txHash) return;
    // Open in new tab - you can customize the explorer URL based on chain
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let filtered = data;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => getTransactionType(tx) === filterType);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.hash?.toLowerCase().includes(query) ||
        tx.from_address?.toLowerCase().includes(query) ||
        tx.to_address?.toLowerCase().includes(query) ||
        tx.value?.includes(query)
      );
    }

    return filtered;
  }, [data, filterType, searchQuery]);

  // Use useMemo to prevent unnecessary re-sorting
  const sortedData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'block_timestamp') {
        aValue = new Date(aValue).getTime() || 0;
        bValue = new Date(bValue).getTime() || 0;
      } else if (sortField === 'value') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortField === 'gas_price') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredData, sortField, sortDirection]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-400">
          <p className="mb-2">Error loading transactions</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header with controls */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  autoRefresh 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="buy">Buys</option>
              <option value="sell">Sells</option>
              <option value="transfer">Transfers</option>
            </select>

            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm border border-gray-600 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-800 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('block_timestamp')}
              >
                Time
                {sortField === 'block_timestamp' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                From
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                To
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('value')}
              >
                Amount
                {sortField === 'value' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('gas_price')}
              >
                Gas Price
                {sortField === 'gas_price' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Hash
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {sortedData.map((tx, index) => {
              const txType = getTransactionType(tx);
              return (
                <tr key={tx.hash || index} className="hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3">
                    {getTransactionIcon(txType)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {formatTime(tx.block_timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300 font-mono">
                        {formatAddress(tx.from_address)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tx.from_address)}
                        className="text-gray-500 hover:text-gray-300 transition-colors"
                        title="Copy address"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300 font-mono">
                        {formatAddress(tx.to_address)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tx.to_address)}
                        className="text-gray-500 hover:text-gray-300 transition-colors"
                        title="Copy address"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="text-gray-300 font-medium">
                        {formatAmount(tx.value)} {coinData?.symbol || 'ETH'}
                      </div>
                      {tx.value_usd && (
                        <div className="text-gray-500 text-xs">
                          {formatValue(tx.value_usd)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {tx.gas_price ? `${(parseFloat(tx.gas_price) / 1e9).toFixed(2)} Gwei` : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300 font-mono">
                        {formatAddress(tx.hash)}
                      </span>
                      <button
                        onClick={() => openExplorer(tx.hash)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="View on explorer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedData.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-gray-400">
              <p>No transactions found</p>
              {searchQuery && <p className="text-sm">Try adjusting your search or filters</p>}
            </div>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {pagination && pagination.hasMore && (
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More Transactions'}
          </button>
        </div>
      )}

      {/* Stats Footer */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Total Transactions: {sortedData.length}</span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MoralisTransactionTable; 




