"use client";

import React, { useMemo } from 'react';

const TransactionStats = ({ data, coinData }) => {
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalTransactions: 0,
        totalVolume: 0,
        totalValue: 0,
        averageGasPrice: 0,
        uniqueAddresses: 0,
        buyCount: 0,
        sellCount: 0,
        transferCount: 0,
        contractCount: 0,
        largestTransaction: 0,
        smallestTransaction: 0,
      };
    }

    const uniqueAddresses = new Set();
    let totalVolume = 0;
    let totalValue = 0;
    let totalGasPrice = 0;
    let gasPriceCount = 0;
    let buyCount = 0;
    let sellCount = 0;
    let transferCount = 0;
    let contractCount = 0;
    let largestTransaction = 0;
    let smallestTransaction = Infinity;

    data.forEach(tx => {
      // Count unique addresses
      if (tx.from_address) uniqueAddresses.add(tx.from_address);
      if (tx.to_address) uniqueAddresses.add(tx.to_address);

      // Calculate volume and value
      const value = parseFloat(tx.value) || 0;
      const valueUsd = parseFloat(tx.value_usd) || 0;
      
      totalVolume += value;
      totalValue += valueUsd;

      // Track largest and smallest transactions
      if (value > largestTransaction) largestTransaction = value;
      if (value > 0 && value < smallestTransaction) smallestTransaction = value;

      // Gas price calculations
      if (tx.gas_price) {
        totalGasPrice += parseFloat(tx.gas_price);
        gasPriceCount++;
      }

      // Transaction type counting
      const txType = getTransactionType(tx);
      switch (txType) {
        case 'buy':
          buyCount++;
          break;
        case 'sell':
          sellCount++;
          break;
        case 'transfer':
          transferCount++;
          break;
        default:
          contractCount++;
      }
    });

    return {
      totalTransactions: data.length,
      totalVolume,
      totalValue,
      averageGasPrice: gasPriceCount > 0 ? totalGasPrice / gasPriceCount : 0,
      uniqueAddresses: uniqueAddresses.size,
      buyCount,
      sellCount,
      transferCount,
      contractCount,
      largestTransaction,
      smallestTransaction: smallestTransaction === Infinity ? 0 : smallestTransaction,
    };
  }, [data]);

  const formatNumber = (num) => {
    if (!num || num === 0) return '0';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toLocaleString();
  };

  const formatValue = (value) => {
    if (!value || value === 0) return '$0.00';
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

  const formatGasPrice = (gasPrice) => {
    if (!gasPrice || gasPrice === 0) return '0 Gwei';
    return `${(gasPrice / 1e9).toFixed(2)} Gwei`;
  };

  const getTransactionType = (tx) => {
    if (tx.value && parseFloat(tx.value) > 0) {
      if (tx.gas_price && parseFloat(tx.gas_price) > 50) {
        return 'buy';
      }
      return 'transfer';
    }
    return 'contract';
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Transaction Statistics</h3>
        <div className="text-gray-400 text-center py-8">
          No transaction data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Transaction Statistics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Transactions */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">Total Transactions</div>
          <div className="text-xl font-bold text-white">
            {formatNumber(stats.totalTransactions)}
          </div>
        </div>

        {/* Total Volume */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">Total Volume</div>
          <div className="text-xl font-bold text-white">
            {formatNumber(stats.totalVolume)} {coinData?.symbol || 'ETH'}
          </div>
          {stats.totalValue > 0 && (
            <div className="text-sm text-gray-400">
              {formatValue(stats.totalValue)}
            </div>
          )}
        </div>

        {/* Unique Addresses */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">Unique Addresses</div>
          <div className="text-xl font-bold text-white">
            {formatNumber(stats.uniqueAddresses)}
          </div>
        </div>

        {/* Average Gas Price */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">Avg Gas Price</div>
          <div className="text-xl font-bold text-white">
            {formatGasPrice(stats.averageGasPrice)}
          </div>
        </div>
      </div>

      {/* Transaction Type Breakdown */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-white mb-3">Transaction Types</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Buys: {stats.buyCount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Sells: {stats.sellCount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Transfers: {stats.transferCount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Contracts: {stats.contractCount}</span>
          </div>
        </div>
      </div>

      {/* Transaction Range */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-white mb-3">Transaction Range</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">Largest Transaction</div>
            <div className="text-lg font-semibold text-white">
              {formatNumber(stats.largestTransaction)} {coinData?.symbol || 'ETH'}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">Smallest Transaction</div>
            <div className="text-lg font-semibold text-white">
              {formatNumber(stats.smallestTransaction)} {coinData?.symbol || 'ETH'}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-white mb-3">Activity Overview</h4>
        <div className="bg-gray-700 rounded-lg p-4 h-32 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-sm mb-2">Transaction Activity Chart</div>
            <div className="text-xs">Chart visualization coming soon</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStats; 