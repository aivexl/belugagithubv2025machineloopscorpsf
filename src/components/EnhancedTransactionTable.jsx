"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';

const EnhancedTransactionTable = ({ 
  data, 
  loading, 
  error, 
  pagination, 
  onLoadMore, 
  coinInfo, 
  coinData,
  transactionType = 'all' // 'all', 'transfers', 'swaps', 'holders'
}) => {
  const [sortField, setSortField] = useState('block_timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchAddress, setSearchAddress] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Auto refresh every 5 seconds for real-time updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (onLoadMore) {
        onLoadMore();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, onLoadMore]);

  // Update current time every second for real-time timestamp display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const isHex = (s, len) => typeof s === 'string' && /^0x[0-9a-fA-F]+$/.test(s) && (len ? s.length === len : true);
  const isAddress = (s) => isHex(s, 42);
  const isTxHash = (s) => isHex(s, 66);

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
    if (tx.type === 'swap') return 'swap';
    if (tx.type === 'token_transfer') return 'transfer';
    if (tx.value && parseFloat(tx.value) > 0) return 'transfer';
    return 'contract';
  };

  const getTransactionIcon = (tx) => {
    const type = getTransactionType(tx);
    switch (type) {
      case 'swap':
        return (
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        );
      case 'transfer':
        return (
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let filtered = [...data];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => getTransactionType(tx) === filterType);
    }

    // Filter by address search
    if (searchAddress) {
      filtered = filtered.filter(tx => 
        tx.from_address?.toLowerCase().includes(searchAddress.toLowerCase()) ||
        tx.to_address?.toLowerCase().includes(searchAddress.toLowerCase())
      );
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
      filtered = filtered.filter(tx => {
        const amount = parseFloat(tx.value || 0);
        const min = minAmount ? parseFloat(minAmount) : 0;
        const max = maxAmount ? parseFloat(maxAmount) : Infinity;
        return amount >= min && amount <= max;
      });
    }

    // Sort data
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'block_timestamp') {
        aValue = new Date(aValue).getTime() || 0;
        bValue = new Date(bValue).getTime() || 0;
      } else if (sortField === 'value') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, filterType, searchAddress, minAmount, maxAmount, sortField, sortDirection]);

  if (loading && !data) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-red-400">Error Loading Transactions</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Transaction Type Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-3 py-1 border border-gray-600"
            >
              <option value="all">All</option>
              <option value="transfer">Transfers</option>
              <option value="swap">Swaps</option>
              <option value="contract">Contracts</option>
            </select>
          </div>

          {/* Address Search */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Address:</label>
            <input
              type="text"
              placeholder="Search address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-3 py-1 border border-gray-600 w-48"
            />
          </div>

          {/* Amount Range */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Amount:</label>
            <input
              type="number"
              placeholder="Min"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 w-20"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 w-20"
            />
          </div>

          {/* Auto Refresh Toggle */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Auto Refresh:</label>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-10 h-6 rounded-full transition-colors ${
                autoRefresh ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                autoRefresh ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-400">
          Showing {filteredAndSortedData.length} of {pagination?.total || data?.length || 0} transactions
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
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
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('value')}
                >
                  Amount
                  {sortField === 'value' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hash
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAndSortedData.map((tx, index) => (
                <tr key={`${tx.hash}-${index}`} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    {getTransactionIcon(tx)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {formatTime(tx.block_timestamp)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300 font-mono">
                        {formatAddress(tx.from_address)}
                      </span>
                      <button className="text-blue-400 hover:text-blue-300 text-xs">
                        Copy
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300 font-mono">
                        {formatAddress(tx.to_address)}
                      </span>
                      <button className="text-blue-400 hover:text-blue-300 text-xs">
                        Copy
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="space-y-1">
                      <div className="text-white font-medium">
                        {formatAmount(tx.value, tx.token_decimals || 18)} {tx.token_symbol || coinInfo?.symbol}
                      </div>
                      {tx.value_usd && (
                        <div className="text-gray-400 text-xs">
                          {formatValue(tx.value_usd)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300 font-mono">
                        {formatAddress(tx.hash)}
                      </span>
                      <button className="text-blue-400 hover:text-blue-300 text-xs">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {pagination && filteredAndSortedData.length < pagination.total && (
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={onLoadMore}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Loading...' : 'Load More Transactions'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTransactionTable; 