import React, { createContext, useContext, useEffect, useState } from 'react';

const CoinGeckoContext = createContext();

const COINS_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
const GLOBAL_URL = 'https://api.coingecko.com/api/v3/global';

export function CoinGeckoProvider({ children }) {
  const [coins, setCoins] = useState(null);
  const [global, setGlobal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch both endpoints in parallel
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
      
      // Transformasi hanya untuk coins, global langsung dari CoinGecko
      const transformedCoins = coinsData.map((coin, index) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
        current_price: parseFloat(coin.current_price),
        market_cap: parseFloat(coin.market_cap),
        market_cap_rank: index + 1,
        price_change_percentage_24h: parseFloat(coin.price_change_percentage_24h),
        total_volume: parseFloat(coin.total_volume),
      }));
      
      setCoins(transformedCoins);
      setGlobal(globalData.data);
    } catch (e) {
      setError('Failed to fetch CoinGecko data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 24 * 60 * 60 * 1000); // 24 jam
    return () => clearInterval(interval);
  }, []);

  return (
    <CoinGeckoContext.Provider value={{ coins, global, loading, error, refresh: fetchAll }}>
      {children}
    </CoinGeckoContext.Provider>
  );
}

export function useCoinGecko() {
  return useContext(CoinGeckoContext);
} 