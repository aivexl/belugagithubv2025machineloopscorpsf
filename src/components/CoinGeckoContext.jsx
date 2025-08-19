import React, { createContext, useContext, useEffect, useState } from 'react';

const CoinGeckoContext = createContext();

// API-ONLY STRATEGY: No local data generation
// All data will come from CoinGecko API via proxy routes

export function CoinGeckoProvider({ children }) {
  const [coins, setCoins] = useState(null);
  const [global, setGlobal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[COINGECKO] Fetching data from CoinGecko API...');
      
      // API-ONLY STRATEGY: Fetch from CoinGecko proxy routes
      const [coinsResponse, globalResponse] = await Promise.all([
        fetch('/api/coingecko-proxy/coins'),
        fetch('/api/coingecko-proxy/global')
      ]);
      
      if (!coinsResponse.ok || !globalResponse.ok) {
        throw new Error(`API Error: Coins: ${coinsResponse.status}, Global: ${globalResponse.status}`);
      }
      
      const coinsData = await coinsResponse.json();
      const globalData = await globalResponse.json();
      
      console.log('[COINGECKO] Successfully loaded data from API:', {
        coinsCount: coinsData?.length || 0,
        globalData: globalData ? 'loaded' : 'failed'
      });
      
      setCoins(coinsData);
      setGlobal(globalData);
      setError(null);
    } catch (err) {
      console.error('[COINGECKO] Error fetching data from API:', err);
      setError('Failed to fetch data from API');
      // API-ONLY STRATEGY: No fallbacks
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateData();
    // API-ONLY STRATEGY: Update every 5 minutes from API
    const interval = setInterval(() => {
      console.log('[COINGECKO] Scheduled API update...');
      generateData();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CoinGeckoContext.Provider value={{ coins, global, loading, error, refresh: generateData }}>
      {children}
    </CoinGeckoContext.Provider>
  );
}

export function useCoinGecko() {
  return useContext(CoinGeckoContext);
} 