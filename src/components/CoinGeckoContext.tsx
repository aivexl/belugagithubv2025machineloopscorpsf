"use client";

import React, { useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import { COINS_URL, GLOBAL_URL } from './CoinGeckoUtils';
import CoinGeckoContext from './CoinGeckoContextContext';

// Simple in-memory cache for API responses (production/fallback)
const cache = new Map();
const CACHE_TTL = 30 * 1000; // 30 seconds cache

// Import dev cache functions (client-side compatible)
let devCacheEnabled = false;
let getDevCache: any = null;
let setDevCache: any = null;

// Initialize dev cache only on client and in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    // Dynamically import dev cache functions
    import('../lib/devCacheClient').then(module => {
      getDevCache = module.getDevCache;
      setDevCache = module.setDevCache;
      devCacheEnabled = true;
      console.log('[DEV CACHE] Development cache system enabled');
    }).catch(() => {
      console.log('[DEV CACHE] Dev cache not available, using standard cache');
    });
  } catch (error) {
    console.log('[DEV CACHE] Dev cache initialization failed, using standard cache');
  }
}

const cachedFetch = async (url: string) => {
  const cacheKey = url.split('api.coingecko.com')[1] || url;
  
  // Try dev cache first (development only)
  if (devCacheEnabled && getDevCache) {
    try {
      const devCachedData = await getDevCache(cacheKey);
      if (devCachedData) {
        return devCachedData;
      }
    } catch (error) {
      console.warn('[DEV CACHE] Error accessing dev cache, falling back to API:', error.message);
    }
  }
  
  // Fallback to in-memory cache
  const now = Date.now();
  const cached = cache.get(url);
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  
  // Fetch from API
  console.log(`[API CALL] Fetching ${cacheKey}`);
  const response = await fetch(url, {
    headers: {
      'Cache-Control': 'public, max-age=30',
      'X-CG-Demo-API-Key': 'CG-1NBArXikTdDPy9GPrpUyEmwt',
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  
  const data = await response.json();
  
  // Store in both caches
  cache.set(url, { data, timestamp: now });
  
  // Store in dev cache (development only)
  if (devCacheEnabled && setDevCache) {
    try {
      await setDevCache(cacheKey, data);
    } catch (error) {
      console.warn('[DEV CACHE] Failed to store in dev cache:', error.message);
    }
  }
  
  return data;
};

export const CoinGeckoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<any[] | null>(null);
  const [global, setGlobal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequestRef = useRef<AbortController | null>(null);

  const fetchAll = async (isRetry = false) => {
    // Cancel previous request if still pending
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }
    
    const controller = new AbortController();
    activeRequestRef.current = controller;
    
    if (!isRetry) setLoading(true);
    setError(null);
    
    try {
      const [coinsData, globalData] = await Promise.all([
        cachedFetch(COINS_URL),
        cachedFetch(GLOBAL_URL),
      ]);
      
      if (!controller.signal.aborted) {
        setCoins(coinsData);
        setGlobal(globalData.data);
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        console.error('CoinGecko fetch error:', err);
        setError('Failed to fetch crypto data. Using cached data if available.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        activeRequestRef.current = null;
      }
    }
  };

  useEffect(() => {
    fetchAll();
    
    // Different intervals for dev vs production
    const isDev = process.env.NODE_ENV === 'development';
    const intervalTime = isDev 
      ? 5 * 60 * 1000  // 5 minutes in development (will use cache)
      : 60 * 1000;     // 60 seconds in production
    
    console.log(`[COINGECKO] Update interval: ${isDev ? '5 minutes (dev with cache)' : '60 seconds (production)'}`);
    
    const interval = setInterval(() => fetchAll(true), intervalTime);
    
    return () => {
      clearInterval(interval);
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
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