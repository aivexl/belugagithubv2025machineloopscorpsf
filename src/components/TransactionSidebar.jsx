"use client";

import React, { useState, useEffect } from 'react';

const TransactionSidebar = ({ 
  coinInfo, 
  transactionStats, 
  holderStats,
  onRefresh,
  isLoading 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('24h');

  const formatNumber = (num) => {
    if (!num || num === 0) return '0';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  const formatPercentage = (percentage) => {
    if (!percentage && percentage !== 0) return '0.00%';
    const value = parseFloat(percentage);
    if (isNaN(value)) return '0.00%';
    const isPositive = value >= 0;
    return (
      <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
        {isPositive ? '+' : ''}{value.toFixed(2)}%
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'holders', label: 'Holders', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'actions', label: 'Actions', icon: '⚡' }
  ];

  return (
    <div className="w-full lg:w-80 xl:w-96 bg-gray-900 border-l border-gray-700 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Transaction Data</h3>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="text-blue-400 hover:text-blue-300 disabled:text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Timeframe Selector */}
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
              {['1h', '24h', '7d', '30d'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`flex-1 px-3 py-1 text-xs rounded transition-colors ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Transaction Stats */}
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Total Transactions</span>
                  <span className="text-xs text-gray-500">{timeframe}</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {formatNumber(transactionStats?.totalTransactions || 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatPercentage(transactionStats?.transactionChange || 0)} from previous period
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Volume</span>
                  <span className="text-xs text-gray-500">{timeframe}</span>
                </div>
                <div className="text-xl font-bold text-white">
                  ${formatNumber(transactionStats?.volume || 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatPercentage(transactionStats?.volumeChange || 0)} from previous period
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Unique Addresses</span>
                  <span className="text-xs text-gray-500">{timeframe}</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {formatNumber(transactionStats?.uniqueAddresses || 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatPercentage(transactionStats?.addressChange || 0)} from previous period
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-400">Avg. Transaction</div>
                <div className="text-lg font-bold text-white">
                  ${formatNumber(transactionStats?.avgTransaction || 0)}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-400">Largest Transaction</div>
                <div className="text-lg font-bold text-white">
                  ${formatNumber(transactionStats?.largestTransaction || 0)}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'holders' && (
          <div className="space-y-4">
            {/* Holder Stats */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Total Holders</div>
              <div className="text-xl font-bold text-white">
                {formatNumber(holderStats?.totalHolders || 0)}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Top 10 Holders</div>
              <div className="text-xl font-bold text-white">
                {formatPercentage(holderStats?.top10Percentage || 0)}
              </div>
              <div className="text-xs text-gray-400 mt-1">of total supply</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Circulating Supply</div>
              <div className="text-xl font-bold text-white">
                {formatNumber(holderStats?.circulatingSupply || 0)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatPercentage(holderStats?.circulatingPercentage || 0)} of max supply
              </div>
            </div>

            {/* Holder Distribution */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-white">Holder Distribution</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Whales (&gt;1%)</span>
                  <span className="text-white">{holderStats?.whales || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Sharks (0.1-1%)</span>
                  <span className="text-white">{holderStats?.sharks || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Fish (0.01-0.1%)</span>
                  <span className="text-white">{holderStats?.fish || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Minnows (&lt;0.01%)</span>
                  <span className="text-white">{holderStats?.minnows || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            {/* Network Activity */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Network Activity</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Transactions/sec</span>
                  <span className="text-white">{transactionStats?.txPerSecond || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Gas used</span>
                  <span className="text-white">{formatNumber(transactionStats?.gasUsed || 0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Avg. gas price</span>
                  <span className="text-white">{transactionStats?.avgGasPrice || 0} Gwei</span>
                </div>
              </div>
            </div>

            {/* Price Impact */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Price Impact</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Buy impact</span>
                  <span className="text-red-400">{transactionStats?.buyImpact || 0}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Sell impact</span>
                  <span className="text-green-400">{transactionStats?.sellImpact || 0}%</span>
                </div>
              </div>
            </div>

            {/* Liquidity */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Liquidity</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Total liquidity</span>
                  <span className="text-white">${formatNumber(transactionStats?.totalLiquidity || 0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Liquidity change</span>
                  <span className="text-white">{formatPercentage(transactionStats?.liquidityChange || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                📊 View Full Analytics
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                📈 Track Price
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                🔔 Set Alerts
              </button>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                📱 Share
              </button>
            </div>

            {/* Export Options */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm font-medium text-white mb-3">Export Data</div>
              <div className="space-y-2">
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-xs transition-colors">
                  📄 Export Transactions (CSV)
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-xs transition-colors">
                  📊 Export Holders (CSV)
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-xs transition-colors">
                  📈 Export Analytics (JSON)
                </button>
              </div>
            </div>

            {/* API Access */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm font-medium text-white mb-3">API Access</div>
              <div className="space-y-2">
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-xs transition-colors">
                  🔗 Get API Key
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-xs transition-colors">
                  📚 View Documentation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionSidebar; 