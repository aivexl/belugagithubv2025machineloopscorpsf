"use client";

import React, { useEffect, useState } from 'react';

const API_URL = '/api/coingecko/search/trending';

export default function Mindshare() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setTrending(json.coins || []);
    } catch (e) {
      setTrending([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrending();
    const interval = setInterval(fetchTrending, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4">Trending Coins</h2>
      {loading ? (
        <div className="text-gray-400 animate-pulse">Loading trending coins...</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {trending.map((item, i) => (
            <li key={item.item.id} className="flex items-center gap-3 border-b border-gray-800 pb-2 last:border-b-0">
              <img src={item.item.small} alt={item.item.symbol} className="w-6 h-6" />
              <span className="font-semibold text-white">{item.item.name}</span>
              <span className="uppercase text-gray-400">{item.item.symbol}</span>
              <span className="ml-auto text-xs text-gray-400">Rank #{item.item.market_cap_rank || '-'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 