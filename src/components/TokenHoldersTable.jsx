"use client";

import React, { useState, useEffect, useMemo } from 'react';

const TokenHoldersTable = ({ 
  data, 
  loading, 
  error, 
  pagination, 
  onLoadMore, 
  coinInfo 
}) => {
  const [sortField, setSortField] = useState('balance');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchAddress, setSearchAddress] = useState('');
  const [minBalance, setMinBalance] = useState('');
  const [maxBalance, setMaxBalance] = useState('');

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance, decimals = 18) => {
    if (!balance) return '0';
    const num = parseFloat(balance) / Math.pow(10, decimals);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  };

  const formatPercentage = (percentage) => {
    if (!percentage) return '0.00%';
    return `${parseFloat(percentage).toFixed(2)}%`;
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

    // Filter by address search
    if (searchAddress) {
      filtered = filtered.filter(holder => 
        holder.address?.toLowerCase().includes(searchAddress.toLowerCase())
      );
    }

    // Filter by balance range
    if (minBalance || maxBalance) {
      filtered = filtered.filter(holder => {
        const balance = parseFloat(holder.balance || 0);
        const min = minBalance ? parseFloat(minBalance) : 0;
        const max = maxBalance ? parseFloat(maxBalance) : Infinity;
        return balance >= min && balance <= max;
      });
    }

    // Sort data
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'balance') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortField === 'percentage') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, searchAddress, minBalance, maxBalance, sortField, sortDirection]);

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
        <h3 className="mt-2 text-sm font-medium text-red-400">Error Loading Token Holders</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Address Search */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Address:</label>
            <input
              type="text"
              placeholder="Search holder address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-3 py-1 border border-gray-600 w-48"
            />
          </div>

          {/* Balance Range */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Balance:</label>
            <input
              type="number"
              placeholder="Min"
              value={minBalance}
              onChange={(e) => setMinBalance(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 w-20"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxBalance}
              onChange={(e) => setMaxBalance(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 w-20"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-400">
          Showing {filteredAndSortedData.length} of {pagination?.total || data?.length || 0} holders
        </div>
      </div>

      {/* Holders Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('balance')}
                >
                  Balance
                  {sortField === 'balance' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('percentage')}
                >
                  Percentage
                  {sortField === 'percentage' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAndSortedData.map((holder, index) => (
                <tr key={`${holder.address}-${index}`} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-300">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300 font-mono">
                        {formatAddress(holder.address)}
                      </span>
                      <button className="text-blue-400 hover:text-blue-300 text-xs">
                        Copy
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="space-y-1">
                      <div className="text-white font-medium">
                        {formatBalance(holder.balance, holder.token_decimals || 18)} {holder.token_symbol || coinInfo?.symbol}
                      </div>
                      {holder.balance_formatted && (
                        <div className="text-gray-400 text-xs">
                          {holder.balance_formatted}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300">
                        {formatPercentage(holder.percentage)}
                      </span>
                      {/* Progress bar for top holders */}
                      {index < 10 && (
                        <div className="w-16 bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(parseFloat(holder.percentage || 0), 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 text-xs">
                        View
                      </button>
                      <button className="text-green-400 hover:text-green-300 text-xs">
                        Track
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
              {loading ? 'Loading...' : 'Load More Holders'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenHoldersTable; 