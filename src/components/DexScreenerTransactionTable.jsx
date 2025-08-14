"use client";

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const DexScreenerTransactionTable = ({ data, loading, error, pagination, onLoadMore, cryptoMapping, coinData }) => {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount, decimals = 18) => {
    if (!amount) return '0';
    const num = parseFloat(amount);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const formatValue = (value) => {
    if (!value) return '$0.00';
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Basic validators
  const isHex = (s, len) => typeof s === 'string' && /^0x[0-9a-fA-F]+$/.test(s) && (len ? s.length === len : true);
  const isAddress = (s) => isHex(s, 42);
  const isTxHash = (s) => isHex(s, 66);

  const getExplorerUrl = (address, chainName) => {
    if (!address) return '#';
    const base = {
      ethereum: 'https://etherscan.io',
      bsc: 'https://bscscan.com',
      polygon: 'https://polygonscan.com',
      avalanche: 'https://snowtrace.io',
      fantom: 'https://ftmscan.com',
      arbitrum: 'https://arbiscan.io',
      optimism: 'https://optimistic.etherscan.io',
      base: 'https://basescan.org',
    }[chainName?.toLowerCase()] || 'https://etherscan.io';
    const path = isTxHash(address) ? 'tx' : 'address';
    return `${base}/${path}/${address}`;
  };

  // Maker should ALWAYS open an address page, never /tx
  const getAddressExplorerUrl = (address, chainName) => {
    if (!address) return '#';
    const base = {
      ethereum: 'https://etherscan.io',
      bsc: 'https://bscscan.com',
      polygon: 'https://polygonscan.com',
      avalanche: 'https://snowtrace.io',
      fantom: 'https://ftmscan.com',
      arbitrum: 'https://arbiscan.io',
      optimism: 'https://optimistic.etherscan.io',
      base: 'https://basescan.org',
    }[chainName?.toLowerCase()] || 'https://etherscan.io';
    return `${base}/address/${address}`;
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

    if (sortField === 'timestamp') {
      aValue = parseInt(aValue) || 0;
      bValue = parseInt(bValue) || 0;
    } else if (sortField === 'amountIn' || sortField === 'amountOut') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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
      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Transactions</p>
          <p className="text-white font-bold text-lg">{pagination.total}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Network</p>
          <p className="text-white font-bold text-lg capitalize">{cryptoMapping?.chainName || 'Unknown'}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Token</p>
          <p className="text-white font-bold text-lg">{coinData?.symbol || 'Unknown'}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Data Source</p>
          <p className="text-white font-bold text-lg">DexScreener</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('timestamp')}
                >
                  Time
                  {sortField === 'timestamp' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('type')}
                >
                  Type
                  {sortField === 'type' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount In
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount Out
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Value USD
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Wallet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedData.map((tx, index) => {
                // Ensure maker shows a wallet (fall back to from/to; never a tx hash)
                let maker = tx.maker || tx.wallet_address || tx.walletAddress || '';
                if (!maker || !isAddress(maker) || isTxHash(maker)) {
                  maker = tx.from || tx.fromAddress || tx.to || tx.toAddress || '';
                }
                if (!isAddress(maker)) maker = '';
                return (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatTime(tx.timestamp)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tx.type === 'buy' 
                        ? 'bg-green-100 text-green-800' 
                        : tx.type === 'sell'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {tx.type || 'swap'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatAmount(tx.amountIn)} {tx.tokenInSymbol || 'TOKEN'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatAmount(tx.amountOut)} {tx.tokenOutSymbol || 'TOKEN'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatValue(tx.valueUsd)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
                    {maker ? (
                      <a 
                        href={getAddressExplorerUrl(maker, cryptoMapping?.chainName)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {formatAddress(maker)}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Load More Button */}
      {pagination.total > data.length && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More Transactions
          </button>
        </div>
      )}

      {/* No More Data Message */}
      {data.length > 0 && pagination.total <= data.length && (
        <div className="text-center text-gray-400 text-sm">
          No more transactions to load
        </div>
      )}
    </div>
  );
};

export default DexScreenerTransactionTable; 