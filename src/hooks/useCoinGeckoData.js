"use client";

import { useState, useEffect, useCallback } from 'react';

export const useCoinGeckoData = (cryptoId, dataType = 'transactions') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
  });
  const [coinInfo, setCoinInfo] = useState(null);

  const isSupported = !!cryptoId;

  const fetchData = useCallback(async (limit = 50) => {
    if (!isSupported) {
      setError('Cryptocurrency symbol is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url;
      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      if (dataType === 'search') {
        // Search for coin ID by symbol
        url = `/api/coingecko/search?query=${cryptoId}&${params}`;
      } else if (dataType === 'transactions') {
        // Get transactions using coin ID
        url = `/api/coingecko/transactions?coinId=${cryptoId}&${params}`;
      } else {
        throw new Error(`Unknown data type: ${dataType}`);
      }

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      if (dataType === 'search') {
        setData(result.data.coins || []);
        setPagination({
          total: result.data.total || 0,
          page: 1,
          limit,
        });
      } else if (dataType === 'transactions') {
        setData(result.data.transactions || []);
        setPagination({
          total: result.data.total || 0,
          page: 1,
          limit,
        });
        setCoinInfo(result.data.coin);
      }

    } catch (err) {
      console.error('Error fetching CoinGecko data:', err);
      setError(err.message || 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [cryptoId, dataType, isSupported]);

  const loadMore = useCallback(() => {
    fetchData(pagination.limit);
  }, [fetchData, pagination.limit]);

  useEffect(() => {
    if (cryptoId && isSupported) {
      fetchData();
    }
  }, [cryptoId, isSupported, fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    loadMore,
    isSupported,
    coinInfo,
    refetch: () => fetchData()
  };
}; 