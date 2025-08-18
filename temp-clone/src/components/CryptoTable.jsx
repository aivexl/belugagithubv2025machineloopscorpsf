import React, { useEffect, useState } from 'react';
import StarBorder from './StarBorder';
import { useCoinGecko } from '../CoinGeckoContext';

const columns = [
  { key: 'market_cap_rank', label: 'No' },
  { key: 'symbol', label: 'Asset' },
  { key: 'current_price', label: 'Harga' },
  { key: 'price_change_percentage_24h', label: '24H %' },
  { key: 'market_cap', label: 'Market Cap' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function formatNumber(num) {
  if (!num && num !== 0) return '-';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString();
}

export default function CryptoTable() {
  const { coins, loading, error } = useCoinGecko();
  // Hilangkan state sortir
  const validCoins = Array.isArray(coins) ? coins : [];
  // Tidak perlu sortedCoins, langsung pakai validCoins
  return (
    <div className="bg-duniacrypto-panel rounded-lg shadow p-4 relative mb-8">
      <div className="mb-4 flex justify-center">
        <StarBorder as="div" color="cyan" speed="8s" thickness={1}>
          <span className="font-bold">Top 10 Cryptocurrencies</span>
        </StarBorder>
      </div>
      {error && (
        <div className="text-red-400 font-semibold text-center mb-2">{error.message || error.toString()}</div>
      )}
      {loading && validCoins.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-lg">
          <div className="w-6 h-6 border-2 border-duniacrypto-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {loading && validCoins.length === 0 ? (
        <div className="text-gray-400 animate-pulse">Loading...</div>
      ) : (
        <table className="w-full text-xs md:text-sm" style={{tableLayout: 'auto'}}>
          <thead>
            <tr>
              <th className="py-2 px-2 text-left whitespace-nowrap">No</th>
              <th className="py-2 px-2 text-left whitespace-nowrap">Asset</th>
              <th className="py-2 px-2 text-left">Harga</th>
              <th className="py-2 px-2 text-left">24H %</th>
              <th className="py-2 px-2 text-left">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {validCoins.map((coin) => (
              <tr key={coin.id} className="border-b border-gray-800 hover:bg-duniacrypto-card transition">
                <td className="py-1 px-1 md:py-2 md:px-2 font-bold text-center align-middle whitespace-nowrap">{coin.market_cap_rank}</td>
                <td className="py-1 px-1 md:py-2 md:px-2 flex items-center gap-1 md:gap-2 align-middle whitespace-nowrap">
                  <img src={coin.image} alt={coin.symbol} className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                  <span className="uppercase font-semibold max-w-[60px] truncate">{coin.symbol}</span>
                </td>
                <td className="py-1 px-1 md:py-2 md:px-2 break-words">${coin.current_price?.toLocaleString?.() ?? '-'}</td>
                <td className={classNames(
                  'py-1 px-1 md:py-2 md:px-2 font-semibold break-words',
                  coin.price_change_percentage_24h >= 0 ? 'text-duniacrypto-green' : 'text-duniacrypto-red'
                )}>
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                  {coin.price_change_percentage_24h?.toFixed?.(2) ?? '-'}%
                </td>
                <td className="py-1 px-1 md:py-2 md:px-2 break-words">${formatNumber(coin.market_cap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 