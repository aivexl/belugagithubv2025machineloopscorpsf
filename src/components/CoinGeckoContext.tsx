"use client";

import React, { useContext, useEffect, useState, type ReactNode } from 'react';
import { COINS_URL, GLOBAL_URL } from './CoinGeckoUtils';
import CoinGeckoContext from './CoinGeckoContextContext';

export const CoinGeckoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<any[] | null>(null);
  const [global, setGlobal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [coinsRes, globalRes] = await Promise.all([
        fetch(COINS_URL),
        fetch(GLOBAL_URL),
      ]);
      if (!coinsRes.ok || !globalRes.ok) throw new Error('Failed to fetch CoinGecko data. Please try again later.');
      const coinsData = await coinsRes.json();
      const globalData = await globalRes.json();
      setCoins(coinsData);
      setGlobal(globalData.data);
    } catch {
      setError('Failed to fetch CoinGecko data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // Update every 20 seconds for real-time data
    const interval = setInterval(fetchAll, 20 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CoinGeckoContext.Provider value={{ coins, global, loading, error, refresh: fetchAll }}>
      {children}
    </CoinGeckoContext.Provider>
  );
};

export function useCoinGecko() {
  const ctx = useContext(CoinGeckoContext);
  if (!ctx) throw new Error('useCoinGecko must be used within a CoinGeckoProvider');
  return ctx;
} 