"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useCoinGecko } from './CoinGeckoContext';

function formatNumber(num) {
  if (!num && num !== 0) return '-';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString();
}

export default function MarketOverview() {
  const { global, loading, refresh } = useCoinGecko();
  const prevRef = useRef({ volume: null, btcDom: null, ethDom: null });
  const [volumeChangePct, setVolumeChangePct] = useState(null);
  const [btcDomChangePct, setBtcDomChangePct] = useState(null);
  const [ethDomChangePct, setEthDomChangePct] = useState(null);
  const [lastHourlyUpdate, setLastHourlyUpdate] = useState(new Date());


  const { total_market_cap, total_volume, market_cap_change_percentage_24h_usd, market_cap_percentage } = global || {};
  const btcDominance = market_cap_percentage?.btc;
  const marketCap = total_market_cap?.usd;
  const volume = total_volume?.usd;
  const capChange = market_cap_change_percentage_24h_usd;

  // Hourly auto-refresh mechanism
  useEffect(() => {
    const scheduleHourlyRefresh = () => {
      const now = new Date();
      const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
      const msUntilNextHour = nextHour.getTime() - now.getTime();
      
      return setTimeout(() => {
        if (refresh) {
          refresh(); // Trigger refresh from CoinGeckoContext
          setLastHourlyUpdate(new Date());
        }
        scheduleHourlyRefresh(); // Schedule next hourly refresh
      }, msUntilNextHour);
    };

    const timeoutId = scheduleHourlyRefresh();
    return () => clearTimeout(timeoutId);
  }, [refresh]);

  // Derive change for Volume and Dominance relative to the previous refresh (best-effort fallback)
  useEffect(() => {
    if (!global) return;
    const prev = prevRef.current;
    const next = {
      volume: volume ?? null,
      btcDom: btcDominance ?? null,
      ethDom: market_cap_percentage?.eth ?? null,
    };
    if (prev.volume && next.volume) {
      const pct = ((next.volume - prev.volume) / prev.volume) * 100;
      setVolumeChangePct(pct);
    }
    if (prev.btcDom && next.btcDom) {
      const pct = ((next.btcDom - prev.btcDom) / prev.btcDom) * 100;
      setBtcDomChangePct(pct);
    }
    if (prev.ethDom && next.ethDom) {
      const pct = ((next.ethDom - prev.ethDom) / prev.ethDom) * 100;
      setEthDomChangePct(pct);
    }
    prevRef.current = next;
  }, [global]);

  const renderChange = (pct) => {
    const value = (pct === null || pct === undefined || Number.isNaN(pct)) ? 0 : pct;
    const isUp = value >= 0;
    return (
      <span className={isUp ? 'text-duniacrypto-green font-semibold flex items-center gap-1 text-xs' : 'text-duniacrypto-red font-semibold flex items-center gap-1 text-xs'}>
        <svg className={`w-3 h-3 ${isUp ? '' : 'rotate-180'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 15l7-7 7 7" />
        </svg>
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  return (
    <>
      <div className="relative bg-duniacrypto-panel rounded-lg border border-gray-700 p-4 sm:p-5 mb-6 overflow-hidden">
        <h2 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4">Market Overview 24H</h2>
        {/* Overlay spinner saat loading dan data sudah ada */}
        {loading && global && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-lg">
            <div className="w-6 h-6 border-2 border-duniacrypto-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {(!global && loading) ? (
          <div className="bg-duniacrypto-panel/0 rounded-lg p-2 animate-pulse text-gray-400">Loading market overview...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {/* Marketcap */}
          <div className="bg-transparent">
            <div className="text-gray-300 text-xs sm:text-sm">Marketcap</div>
            <div className="text-white font-extrabold text-sm sm:text-base">${formatNumber(marketCap)}</div>
            <div className="mt-0.5">{renderChange(capChange)}</div>
          </div>
          {/* Volume */}
          <div className="bg-transparent">
            <div className="text-gray-300 text-xs sm:text-sm">Volume</div>
            <div className="text-white font-extrabold text-sm sm:text-base">${formatNumber(volume)}</div>
            <div className="mt-0.5">{renderChange(volumeChangePct)}</div>
          </div>
          {/* Dominance */}
          <div className="bg-transparent">
            <div className="text-gray-300 text-xs sm:text-sm">Dominance</div>
            <div className="mt-0.5 grid grid-cols-2 gap-x-3 md:gap-x-4">
              <div className="flex items-start gap-1 min-w-0">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F7931A]/20 ring-1 ring-gray-700 shrink-0">
                  <Image 
                    src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png" 
                    alt="BTC" 
                    width={14} 
                    height={14} 
                    className="w-3.5 h-3.5"
                    loading="lazy"
                  />
                </span>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-[10px] sm:text-[11px] leading-tight whitespace-nowrap">{(market_cap_percentage?.btc ?? 0).toFixed(2)}%</div>
                  <div className="mt-0.5">{renderChange(btcDomChangePct)}</div>
                </div>
              </div>
              <div className="flex items-start gap-1 min-w-0">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-400/20 ring-1 ring-gray-700 shrink-0">
                  <Image 
                    src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" 
                    alt="ETH" 
                    width={14} 
                    height={14} 
                    className="w-3.5 h-3.5"
                    loading="lazy"
                  />
                </span>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-[10px] sm:text-[11px] leading-tight whitespace-nowrap">{(market_cap_percentage?.eth ?? 0).toFixed(2)}%</div>
                  <div className="mt-0.5">{renderChange(ethDomChangePct)}</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </>
  );
} 