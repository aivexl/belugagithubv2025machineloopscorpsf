"use client";

import React, { useState, useEffect, useCallback } from 'react';
import EnhancedTransactionTable from './EnhancedTransactionTable';
import TokenHoldersTable from './TokenHoldersTable';
import TransactionSidebar from './TransactionSidebar';

const EnhancedTransactionPage = ({ coinId, coinData, detailedData }) => {
  const [activeView, setActiveView] = useState('transactions');
  const [transactionData, setTransactionData] = useState([]);
  const [holderData, setHolderData] = useState([]);
  const [transactionStats, setTransactionStats] = useState({});
  const [holderStats, setHolderStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [holderPagination, setHolderPagination] = useState({});
  const [cryptoMapping, setCryptoMapping] = useState(null);

  // Get token address from coin data
  const getTokenAddress = () => {
    if (detailedData?.contract_address) return detailedData.contract_address;
    if (coinData?.contract_address) return coinData.contract_address;
    return null;
  };

  // Get chain information
  const getChainInfo = () => {
    // This would be determined based on the token or user preference
    return {
      chain: 'eth',
      chainName: 'Ethereum',
      explorer: 'https://etherscan.io'
    };
  };

  // Fetch transaction data
  const fetchTransactionData = useCallback(async (offset = 0) => {
    const tokenAddress = getTokenAddress();
    if (!tokenAddress) return;

    try {
      const chainInfo = getChainInfo();
      const response = await fetch(`/api/moralis/token-transfers?tokenAddress=${tokenAddress}&chain=${chainInfo.chain}&limit=50&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction data');
      }

      const data = await response.json();
      
      if (offset === 0) {
        setTransactionData(data.transfers || []);
      } else {
        setTransactionData(prev => [...prev, ...(data.transfers || [])]);
      }
      
      setPagination({
        total: data.total || 0,
        offset: offset + (data.transfers?.length || 0),
        hasMore: (data.transfers?.length || 0) === 50
      });

      // Calculate transaction stats
      calculateTransactionStats(data.transfers || []);
    } catch (err) {
      setError(err.message);
    }
  }, [coinData, detailedData]);

  // Fetch holder data
  const fetchHolderData = useCallback(async (offset = 0) => {
    const tokenAddress = getTokenAddress();
    if (!tokenAddress) return;

    try {
      const chainInfo = getChainInfo();
      const response = await fetch(`/api/moralis/token-holders?tokenAddress=${tokenAddress}&chain=${chainInfo.chain}&limit=50&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch holder data');
      }

      const data = await response.json();
      
      if (offset === 0) {
        setHolderData(data.holders || []);
      } else {
        setHolderData(prev => [...prev, ...(data.holders || [])]);
      }
      
      setHolderPagination({
        total: data.total || 0,
        offset: offset + (data.holders?.length || 0),
        hasMore: (data.holders?.length || 0) === 50
      });

      // Calculate holder stats
      calculateHolderStats(data.holders || []);
    } catch (err) {
      setError(err.message);
    }
  }, [coinData, detailedData]);

  // Calculate transaction statistics
  const calculateTransactionStats = (transactions) => {
    if (!transactions || transactions.length === 0) return;

    const totalTransactions = transactions.length;
    const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.value || 0), 0);
    const uniqueAddresses = new Set([
      ...transactions.map(tx => tx.from_address),
      ...transactions.map(tx => tx.to_address)
    ]).size;

    const avgTransaction = totalVolume / totalTransactions;
    const largestTransaction = Math.max(...transactions.map(tx => parseFloat(tx.value || 0)));

    setTransactionStats({
      totalTransactions,
      volume: totalVolume,
      uniqueAddresses,
      avgTransaction,
      largestTransaction,
      transactionChange: 5.2, // Mock data
      volumeChange: 12.8, // Mock data
      addressChange: -2.1, // Mock data
      txPerSecond: 2.5, // Mock data
      gasUsed: 1500000, // Mock data
      avgGasPrice: 25, // Mock data
      buyImpact: 0.15, // Mock data
      sellImpact: 0.12, // Mock data
      totalLiquidity: 2500000, // Mock data
      liquidityChange: 8.5 // Mock data
    });
  };

  // Calculate holder statistics
  const calculateHolderStats = (holders) => {
    if (!holders || holders.length === 0) return;

    const totalHolders = holders.length;
    const totalSupply = holders.reduce((sum, holder) => sum + parseFloat(holder.balance || 0), 0);
    const top10Holders = holders.slice(0, 10);
    const top10Percentage = top10Holders.reduce((sum, holder) => sum + parseFloat(holder.percentage || 0), 0);

    // Categorize holders
    const whales = holders.filter(h => parseFloat(h.percentage || 0) > 1).length;
    const sharks = holders.filter(h => parseFloat(h.percentage || 0) > 0.1 && parseFloat(h.percentage || 0) <= 1).length;
    const fish = holders.filter(h => parseFloat(h.percentage || 0) > 0.01 && parseFloat(h.percentage || 0) <= 0.1).length;
    const minnows = holders.filter(h => parseFloat(h.percentage || 0) <= 0.01).length;

    setHolderStats({
      totalHolders,
      top10Percentage,
      circulatingSupply: totalSupply * 0.85, // Mock data
      circulatingPercentage: 85, // Mock data
      whales,
      sharks,
      fish,
      minnows
    });
  };

  // Load more transactions
  const loadMoreTransactions = useCallback(() => {
    if (pagination.hasMore && !loading) {
      fetchTransactionData(pagination.offset);
    }
  }, [pagination, loading, fetchTransactionData]);

  // Load more holders
  const loadMoreHolders = useCallback(() => {
    if (holderPagination.hasMore && !loading) {
      fetchHolderData(holderPagination.offset);
    }
  }, [holderPagination, loading, fetchHolderData]);

  // Refresh data
  const refreshData = useCallback(() => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      fetchTransactionData(0),
      fetchHolderData(0)
    ]).finally(() => {
      setLoading(false);
    });
  }, [fetchTransactionData, fetchHolderData]);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const views = [
    { id: 'transactions', label: 'Transactions', icon: '📊' },
    { id: 'holders', label: 'Holders', icon: '👥' }
  ];

  if (error) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-red-400">Error Loading Data</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={refreshData}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Main Content */}
      <div className="flex-1 min-w-0 h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {coinData?.name} ({coinData?.symbol?.toUpperCase()}) Transactions
              </h2>
              <p className="text-gray-400 mt-1">
                Real-time transaction data and analytics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                Network: {getChainInfo().chainName}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-400">
                Contract: {formatAddress(getTokenAddress())}
              </span>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                  activeView === view.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{view.icon}</span>
                <span>{view.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {activeView === 'transactions' && (
            <EnhancedTransactionTable
              data={transactionData}
              loading={loading}
              error={error}
              pagination={pagination}
              onLoadMore={loadMoreTransactions}
              coinInfo={coinData}
              coinData={detailedData}
            />
          )}

          {activeView === 'holders' && (
            <TokenHoldersTable
              data={holderData}
              loading={loading}
              error={error}
              pagination={holderPagination}
              onLoadMore={loadMoreHolders}
              coinInfo={coinData}
            />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <TransactionSidebar
        coinInfo={coinData}
        transactionStats={transactionStats}
        holderStats={holderStats}
        onRefresh={refreshData}
        isLoading={loading}
      />
    </div>
  );
};

// Helper function to format address
const formatAddress = (address) => {
  if (!address) return 'N/A';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default EnhancedTransactionPage; 