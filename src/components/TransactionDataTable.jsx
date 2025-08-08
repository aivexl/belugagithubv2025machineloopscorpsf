"use client";

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const TransactionDataTable = ({ data, loading, error, pagination, onLoadMore, cryptoMapping, coinData }) => {
  const [sortField, setSortField] = useState('block_timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount, decimals = 18) => {
    if (!amount) return '0';
    const num = parseFloat(amount) / Math.pow(10, decimals);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const formatValue = (value, symbol = 'USD') => {
    if (!value) return '$0.00';
    const num = parseFloat(value);
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle timestamp sorting
    if (sortField === 'block_timestamp') {
      aValue = parseInt(aValue) || 0;
      bValue = parseInt(bValue) || 0;
    }

    // Handle numeric sorting
    if (sortField === 'value' || sortField === 'amount') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-400">Loading transactions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-400 mb-2">Error Loading Data</h3>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-duniacrypto-panel border-b border-gray-700 px-4 py-3">
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
              <h3 className="text-white font-bold text-lg">Recent Transactions</h3>
              <p className="text-gray-400 text-sm">{coinData?.symbol?.toUpperCase()}</p>
            </div>
          </div>
          {cryptoMapping && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Network: {cryptoMapping.chainName?.toUpperCase()}</span>
              <span>•</span>
              <span>Type: {cryptoMapping.type}</span>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Total Transactions</p>
            <p className="text-white font-bold">{pagination?.total || data.length}</p>
          </div>
          <div>
            <p className="text-gray-400">Network</p>
            <p className="text-white font-bold capitalize">{cryptoMapping?.chainName || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-gray-400">Type</p>
            <p className="text-white font-bold capitalize">{cryptoMapping?.type || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-gray-400">Status</p>
            <p className="text-green-400 font-bold">Live</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-400">No Transactions Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No recent transactions available for {coinData?.symbol?.toUpperCase()}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort('block_timestamp')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Time</span>
                      {sortField === 'block_timestamp' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort('from_address')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>From</span>
                      {sortField === 'from_address' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort('to_address')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>To</span>
                      {sortField === 'to_address' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      {sortField === 'amount' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort('value')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Value</span>
                      {sortField === 'value' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Hash
                  </th>
                </tr>
              </thead>
              <tbody className="bg-duniacrypto-panel divide-y divide-gray-700">
                {sortedData.map((tx, index) => (
                  <tr key={tx.hash || index} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {formatTime(tx.block_timestamp)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-400 font-mono">
                      {formatAddress(tx.from_address)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400 font-mono">
                      {formatAddress(tx.to_address)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                      {formatAmount(tx.amount, tx.decimals || 18)} {tx.token_symbol || coinData?.symbol?.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                      {formatValue(tx.value)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400 font-mono">
                      {formatAddress(tx.hash)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {data.length > 0 && pagination && (
        <div className="bg-duniacrypto-panel border-t border-gray-700 px-4 py-3">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              'Load More Transactions'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionDataTable; 