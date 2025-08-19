"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types locally to avoid import issues
interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  image: string;
  total_volume: number;
  circulating_supply: number;
}

interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number;
  };
}

interface CoinGeckoContextType {
  coins: CryptoCoin[] | null;
  global: GlobalData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CoinGeckoContext = createContext<CoinGeckoContextType | null>(null);

export const CoinGeckoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<CryptoCoin[] | null>(null);
  const [global, setGlobal] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data from proxy routes to avoid CORS issues
      const [coinsResponse, globalResponse] = await Promise.allSettled([
        fetch('/api/coingecko-proxy/coins'),
        fetch('/api/coingecko-proxy/global')
      ]);
      
      // Handle coins data
      if (coinsResponse.status === 'fulfilled' && coinsResponse.value.ok) {
        const coinsData = await coinsResponse.value.json();
        setCoins(coinsData.slice(0, 10)); // Get top 10
      }
      
      // Handle global data
      if (globalResponse.status === 'fulfilled' && globalResponse.value.ok) {
        const globalData = await globalResponse.value.json();
        setGlobal(globalData);
      }
      
      setError(null);
    } catch (err) {
      console.warn('[COINGECKO] Error generating data:', err);
      setError('Failed to generate data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateData();
    
    // Update every 5 minutes with fresh data
    const interval = setInterval(generateData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refresh = async (): Promise<void> => {
    await generateData();
  };

  const value: CoinGeckoContextType = {
    coins,
    global,
    loading,
    error,
    refresh
  };

  return (
    <CoinGeckoContext.Provider value={value}>
      {children}
    </CoinGeckoContext.Provider>
  );
};

export const useCoinGecko = (): CoinGeckoContextType => {
  const context = useContext(CoinGeckoContext);
  if (!context) {
    throw new Error('useCoinGecko must be used within a CoinGeckoProvider');
  }
  return context;
}; 