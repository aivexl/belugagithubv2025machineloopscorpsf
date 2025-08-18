import React, { useEffect, useRef, useState } from 'react';
import { useCoinGecko } from '../CoinGeckoContext';

const API_URL = 'https://duniacryptoproxy.onrender.com/coingecko/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

export default function CryptoTicker() {
  // Remove local state/fetch, use context
  const { coins, loading } = useCoinGecko();
  const [priceFlash, setPriceFlash] = useState({}); // {symbol: 'up'|'down'|undefined}
  const animationRef = useRef();
  const trackRef = useRef();
  // For smooth price update
  const prevPrices = useRef({});

  // Detect price changes for flash
  useEffect(() => {
    if (!coins) return;
    const flash = {};
    coins.forEach((coin) => {
      const prev = prevPrices.current[coin.symbol];
      if (prev !== undefined && prev !== coin.current_price) {
        flash[coin.symbol] = coin.current_price > prev ? 'up' : 'down';
      }
    });
    setPriceFlash(flash);
    // Save current prices for next compare
    const newPrev = {};
    coins.forEach((coin) => { newPrev[coin.symbol] = coin.current_price; });
    prevPrices.current = newPrev;
    // Remove flash after short delay
    if (Object.keys(flash).length > 0) {
      const timeout = setTimeout(() => setPriceFlash({}), 350);
      return () => clearTimeout(timeout);
    }
  }, [coins]);

  // Seamless ticker animation
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame;
    let start;
    let width = track.scrollWidth / 2;
    let duration = 30 * 1000; // 30s
    function animate(ts) {
      if (!start) start = ts;
      let elapsed = ts - start;
      let percent = (elapsed % duration) / duration;
      track.style.transform = `translateX(-${percent * width}px)`;
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [coins]);

  if (loading && (!coins || coins.length === 0)) {
    return (
      <div className="bg-duniacrypto-panel border-b border-gray-800 py-2 animate-pulse text-center text-gray-400">
        Loading ticker...
      </div>
    );
  }

  const tickerItems = coins || [];

  return (
    <div className="relative overflow-hidden w-full bg-duniacrypto-panel border-b border-gray-800 py-2">
      <div
        ref={trackRef}
        className="flex whitespace-nowrap"
        style={{ willChange: 'transform' }}
      >
        {[...tickerItems, ...tickerItems].map((coin, i) => (
          <div
            key={coin.id + '-' + i}
            className="flex items-center gap-2 px-6 min-w-max"
          >
            <img src={coin.image} alt={coin.symbol} className="w-5 h-5 mr-1" />
            <span className="font-bold uppercase text-sm">{coin.symbol}</span>
            <span className="text-sm">
              <span
                className={classNames(
                  'transition-colors duration-300',
                  priceFlash[coin.symbol] === 'up' && 'bg-duniacrypto-green/20',
                  priceFlash[coin.symbol] === 'down' && 'bg-duniacrypto-red/20'
                )}
                style={{ borderRadius: 4, padding: '0 4px' }}
              >
                ${coin.current_price.toLocaleString()}
              </span>
            </span>
            <span
              className={classNames(
                'ml-2 text-sm font-semibold transition-colors duration-300',
                coin.price_change_percentage_24h >= 0 ? 'text-duniacrypto-green' : 'text-duniacrypto-red'
              )}
            >
              {coin.price_change_percentage_24h >= 0 ? '+' : ''}
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      {/* Overlay spinner saat loading dan coins sudah ada */}
      {loading && tickerItems.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-4 h-4 border-2 border-duniacrypto-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
} 