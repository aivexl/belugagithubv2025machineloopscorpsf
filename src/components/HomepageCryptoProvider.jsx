"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

// ENTERPRISE-LEVEL: Dedicated Homepage Crypto Provider
// This prevents conflicts with AssetClient by using completely isolated state and API calls
const HomepageCryptoContext = createContext();

export function HomepageCryptoProvider({ children }) {
  // ISOLATED STATE: Completely separate from AssetClient
  const [homepageCoins, setHomepageCoins] = useState([]);
  const [homepageGlobal, setHomepageGlobal] = useState(null);
  const [homepageLoading, setHomepageLoading] = useState(true);
  const [homepageError, setHomepageError] = useState(null);

  // ENTERPRISE-LEVEL: Request deduplication and cancellation
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const fetchIntervalRef = useRef(null);

  // ENTERPRISE-LEVEL: Dedicated API fetch function for homepage only
  const fetchHomepageData = async () => {
    // Prevent duplicate requests
    if (isFetchingRef.current) {
      console.log('[HomepageCrypto] Skipping duplicate request');
      return;
    }

    // Rate limiting: minimum 30 seconds between requests
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 30000) {
      console.log('[HomepageCrypto] Rate limited, skipping request');
      return;
    }

    try {
      isFetchingRef.current = true;
      setHomepageLoading(true);
      setHomepageError(null);

      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      console.log('[HomepageCrypto] Fetching homepage-specific crypto data...');

      // ENTERPRISE-LEVEL: Parallel API calls with timeout
      const [coinsResponse, globalResponse] = await Promise.all([
        fetch('/api/coingecko-proxy/coins', {
          signal: AbortSignal.timeout(15000), // 15 second timeout
          headers: { 'X-Request-Source': 'homepage' }
        }),
        fetch('/api/coingecko-proxy/global', {
          signal: AbortSignal.timeout(15000), // 15 second timeout
          headers: { 'X-Request-Source': 'homepage' }
        })
      ]);

      if (!coinsResponse.ok || !globalResponse.ok) {
        throw new Error(`Homepage API Error: Coins: ${coinsResponse.status}, Global: ${globalResponse.status}`);
      }

      const coinsData = await coinsResponse.json();
      const globalData = await globalResponse.json();

      // ENTERPRISE-LEVEL: Data validation
      if (!Array.isArray(coinsData) || coinsData.length === 0) {
        throw new Error('Invalid coins data received');
      }

      console.log('[HomepageCrypto] Successfully loaded homepage data:', {
        coinsCount: coinsData.length,
        globalData: globalData ? 'loaded' : 'failed',
        timestamp: new Date().toISOString()
      });

      // Update isolated homepage state
      // Extract data from wrapper if it exists (API returns { data: {...} })
      setHomepageCoins(coinsData);
      setHomepageGlobal(globalData?.data || globalData);
      setHomepageError(null);
      setHomepageLoading(false); // Set loading to false after successful data fetch
      lastFetchTimeRef.current = now;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[HomepageCrypto] Request was aborted');
        return;
      }

      console.error('[HomepageCrypto] Error fetching homepage data:', error);
      setHomepageError('Failed to fetch homepage crypto data');

      // ENTERPRISE-LEVEL: Clear data and show skeleton on error (no internet/API failure)
      // Never show old/dummy data when there's an error
      setHomepageCoins([]);
      setHomepageGlobal(null);
      setHomepageLoading(true); // Keep loading to show skeleton, not dummy data
    } finally {
      isFetchingRef.current = false;
    }
  };

  // ENTERPRISE-LEVEL: Cleanup and initialization
  useEffect(() => {
    console.log('[HomepageCrypto] Initializing homepage crypto provider...');

    // Initial fetch
    fetchHomepageData();

    // Set up refresh interval (5 minutes)
    fetchIntervalRef.current = setInterval(() => {
      console.log('[HomepageCrypto] Scheduled homepage data refresh...');
      fetchHomepageData();
    }, 5 * 60 * 1000);

    // Cleanup function
    return () => {
      console.log('[HomepageCrypto] Cleaning up homepage crypto provider...');

      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ENTERPRISE-LEVEL: Manual refresh function
  const refreshHomepageData = () => {
    console.log('[HomepageCrypto] Manual refresh requested');
    fetchHomepageData();
  };

  // ENTERPRISE-LEVEL: Context value with isolated data
  const contextValue = {
    // ISOLATED DATA: Completely separate from AssetClient
    homepageCoins,
    homepageGlobal,
    homepageLoading,
    homepageError,
    refreshHomepageData,

    // ENTERPRISE-LEVEL: Helper functions for homepage components
    getTop10ByMarketCap: () => homepageCoins.slice(0, 10),
    getTop10ByVolume: () => [...homepageCoins].sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0)).slice(0, 10),
    getTopGainers: () => [...homepageCoins].sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)).slice(0, 5),
    getTopLosers: () => [...homepageCoins].sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)).slice(0, 5)
  };

  return (
    <HomepageCryptoContext.Provider value={contextValue}>
      {children}
    </HomepageCryptoContext.Provider>
  );
}

// ENTERPRISE-LEVEL: Custom hook for homepage components
export function useHomepageCrypto() {
  const context = useContext(HomepageCryptoContext);
  if (!context) {
    throw new Error('useHomepageCrypto must be used within HomepageCryptoProvider');
  }
  return context;
}
