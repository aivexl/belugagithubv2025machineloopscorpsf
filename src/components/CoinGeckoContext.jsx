import React, { createContext, useContext, useEffect, useState } from 'react';

const CoinGeckoContext = createContext();

// Generate realistic crypto data locally
const generateRealisticCoins = () => {
  const baseCoins = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', basePrice: 43000, volatility: 0.15 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', basePrice: 2600, volatility: 0.12 },
    { id: 'tether', symbol: 'usdt', name: 'Tether', basePrice: 1.001, volatility: 0.001 },
    { id: 'solana', symbol: 'sol', name: 'Solana', basePrice: 98, volatility: 0.18 },
    { id: 'bnb', symbol: 'bnb', name: 'BNB', basePrice: 320, volatility: 0.14 },
    { id: 'xrp', symbol: 'xrp', name: 'XRP', basePrice: 0.52, volatility: 0.16 },
    { id: 'usdc', symbol: 'usdc', name: 'USD Coin', basePrice: 1.0001, volatility: 0.0001 },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', basePrice: 0.48, volatility: 0.13 },
    { id: 'avalanche', symbol: 'avax', name: 'Avalanche', basePrice: 35, volatility: 0.17 },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', basePrice: 0.078, volatility: 0.20 }
  ];
  
  return baseCoins.map((coin, index) => {
    const priceVariation = (Math.random() - 0.5) * coin.volatility * 2;
    const currentPrice = coin.basePrice * (1 + priceVariation);
    const marketCap = currentPrice * (Math.random() * 1000000000 + 100000000);
    const priceChange24h = (Math.random() - 0.5) * coin.volatility * 2 * 100;
    
    return {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: currentPrice,
      market_cap: marketCap,
      market_cap_rank: index + 1,
      price_change_percentage_24h: priceChange24h,
      total_volume: marketCap * (Math.random() * 0.1 + 0.05),
    };
  });
};

const generateRealisticGlobal = () => {
  const totalMarketCap = 1800000000000 + (Math.random() - 0.5) * 200000000000;
  const totalVolume = totalMarketCap * (Math.random() * 0.1 + 0.05);
  
  return {
    active_cryptocurrencies: 2500 + Math.floor(Math.random() * 500),
    total_market_cap: { usd: totalMarketCap },
    total_volume: { usd: totalVolume },
    market_cap_percentage: { 
      btc: 50 + (Math.random() - 0.5) * 4,
      eth: 20 + (Math.random() - 0.5) * 3
    },
    market_cap_change_percentage_24h_usd: (Math.random() - 0.5) * 4
  };
};

export function CoinGeckoProvider({ children }) {
  const [coins, setCoins] = useState(null);
  const [global, setGlobal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const coinsData = generateRealisticCoins();
      const globalData = generateRealisticGlobal();
      
      setCoins(coinsData);
      setGlobal(globalData);
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

  return (
    <CoinGeckoContext.Provider value={{ coins, global, loading, error, refresh: generateData }}>
      {children}
    </CoinGeckoContext.Provider>
  );
}

export function useCoinGecko() {
  return useContext(CoinGeckoContext);
} 