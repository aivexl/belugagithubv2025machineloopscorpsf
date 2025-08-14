"use client";

import React, { useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import { COINS_URL, GLOBAL_URL } from './CoinGeckoUtils';
import CoinGeckoContext from './CoinGeckoContextContext';

// Simple in-memory cache for API responses
const cache = new Map();
const CACHE_TTL = 30 * 1000; // 30 seconds cache

const cachedFetch = async (url: string) => {
  const now = Date.now();
  const cached = cache.get(url);
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  
  const response = await fetch(url, {
    headers: {
      'Cache-Control': 'public, max-age=30',
    }
  });
  
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  
  const data = await response.json();
  cache.set(url, { data, timestamp: now });
  
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
    
    // Reduced update frequency for better performance - every 60 seconds
    const interval = setInterval(() => fetchAll(true), 60 * 1000);
    
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