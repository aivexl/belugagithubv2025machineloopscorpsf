// Enterprise-level Crypto Data Generator
// Provides realistic crypto data without external API dependencies
// Ensures 100% uptime and zero network failures

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | { currency: string; percentage: number; times: number };
  last_updated: string;
}

export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
  };
}

export interface GlobalData {
  active_cryptocurrencies: number;
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

// Realistic crypto data with market dynamics
const CRYPTO_NAMES = [
  'Bitcoin', 'Ethereum', 'Binance Coin', 'Solana', 'Cardano',
  'Ripple', 'Polkadot', 'Dogecoin', 'Avalanche', 'Chainlink',
  'Polygon', 'Litecoin', 'Uniswap', 'Bitcoin Cash', 'Stellar',
  'VeChain', 'Filecoin', 'TRON', 'EOS', 'Tezos'
];

const CRYPTO_SYMBOLS = [
  'BTC', 'ETH', 'BNB', 'SOL', 'ADA',
  'XRP', 'DOT', 'DOGE', 'AVAX', 'LINK',
  'MATIC', 'LTC', 'UNI', 'BCH', 'XLM',
  'VET', 'FIL', 'TRX', 'EOS', 'XTZ'
];

// Generate realistic price movements
const generatePriceMovement = (basePrice: number): {
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
} => {
  const volatility = 0.15; // 15% daily volatility
  const changePercent = (Math.random() - 0.5) * volatility * 2;
  const changeAmount = basePrice * changePercent;
  const currentPrice = basePrice + changeAmount;
  
  const high24h = Math.max(basePrice, currentPrice) * (1 + Math.random() * 0.1);
  const low24h = Math.min(basePrice, currentPrice) * (1 - Math.random() * 0.1);
  
  return {
    current_price: currentPrice,
    price_change_24h: changeAmount,
    price_change_percentage_24h: changePercent * 100,
    high_24h: high24h,
    low_24h: low24h
  };
};

// Generate market cap and volume data
const generateMarketData = (rank: number, basePrice: number): {
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
} => {
  const baseSupply = 1000000; // 1M base supply
  const supplyMultiplier = Math.max(0.1, 1 - (rank - 1) * 0.05);
  const supply = baseSupply * supplyMultiplier;
  
  const marketCap = basePrice * supply;
  const volumeRatio = 0.1 + Math.random() * 0.3; // 10-40% of market cap
  const totalVolume = marketCap * volumeRatio;
  
  return {
    market_cap: marketCap,
    total_volume: totalVolume,
    circulating_supply: supply * 0.8, // 80% circulating
    total_supply: supply,
    max_supply: rank <= 3 ? supply : supply * (1.5 + Math.random())
  };
};

// Generate ATH/ATL data
const generateATHATL = (currentPrice: number): {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
} => {
  const ath = currentPrice * (1.5 + Math.random() * 2); // 1.5x to 3.5x current
  const atl = currentPrice * (0.1 + Math.random() * 0.4); // 0.1x to 0.5x current
  
  const athDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  const atlDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  
  return {
    ath,
    ath_change_percentage: ((currentPrice - ath) / ath) * 100,
    ath_date: athDate.toISOString(),
    atl,
    atl_change_percentage: ((currentPrice - atl) / atl) * 100,
    atl_date: atlDate.toISOString()
  };
};

// Generate single crypto coin
export const generateCryptoCoin = (rank: number): CryptoCoin => {
  const index = rank - 1;
  const name = CRYPTO_NAMES[index] || `Crypto${rank}`;
  const symbol = CRYPTO_SYMBOLS[index] || `CRYPTO${rank}`;
  
  // Base price based on rank (top coins have higher prices)
  const basePrice = Math.max(0.01, 1000 / Math.pow(rank, 0.8));
  
  const priceData = generatePriceMovement(basePrice);
  const marketData = generateMarketData(rank, priceData.current_price);
  const athAtlData = generateATHATL(priceData.current_price);
  
  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    symbol: symbol.toLowerCase(),
    name,
    image: `https://ui-avatars.com/api/?name=${symbol}&background=random&color=fff&size=128`,
    current_price: priceData.current_price,
    market_cap: marketData.market_cap,
    market_cap_rank: rank,
    fully_diluted_valuation: marketData.market_cap * 1.2,
    total_volume: marketData.total_volume,
    high_24h: priceData.high_24h,
    low_24h: priceData.low_24h,
    price_change_24h: priceData.price_change_24h,
    price_change_percentage_24h: priceData.price_change_percentage_24h,
    market_cap_change_24h: marketData.market_cap * (priceData.price_change_percentage_24h / 100),
    market_cap_change_percentage_24h: priceData.price_change_percentage_24h,
    circulating_supply: marketData.circulating_supply,
    total_supply: marketData.total_supply,
    max_supply: marketData.max_supply,
    ath: athAtlData.ath,
    ath_change_percentage: athAtlData.ath_change_percentage,
    ath_date: athAtlData.ath_date,
    atl: athAtlData.atl,
    atl_change_percentage: athAtlData.atl_change_percentage,
    atl_date: athAtlData.atl_date,
    roi: null,
    last_updated: new Date().toISOString()
  };
};

// Generate top 100 crypto coins
export const generateTop100Coins = (): CryptoCoin[] => {
  return Array.from({ length: 100 }, (_, i) => generateCryptoCoin(i + 1));
};

// Generate trending coins
export const generateTrendingCoins = (): TrendingCoin[] => {
  const trendingCount = 7 + Math.floor(Math.random() * 8); // 7-14 coins
  
  return Array.from({ length: trendingCount }, (_, i) => {
    const rank = i + 1;
    const coin = generateCryptoCoin(rank);
    
    return {
      item: {
        id: coin.id,
        coin_id: rank,
        name: coin.name,
        symbol: coin.symbol,
        market_cap_rank: coin.market_cap_rank,
        thumb: coin.image,
        small: coin.image,
        large: coin.image,
        slug: coin.id,
        price_btc: coin.current_price / 50000, // Approximate BTC price
        score: Math.random() * 100
      }
    };
  });
};

// Generate global market data
export const generateGlobalData = (): GlobalData => {
  const totalMarketCap = 2500000000000 + (Math.random() - 0.5) * 100000000000; // 2.5T ± 50B
  const totalVolume = totalMarketCap * (0.03 + Math.random() * 0.07); // 3-10% of market cap
  
  return {
    active_cryptocurrencies: 2000 + Math.floor(Math.random() * 1000),
    total_market_cap: { usd: totalMarketCap },
    total_volume: { usd: totalVolume },
    market_cap_percentage: {
      btc: 48 + (Math.random() - 0.5) * 4, // 46-50%
      eth: 18 + (Math.random() - 0.5) * 2  // 17-19%
    },
    market_cap_change_percentage_24h_usd: (Math.random() - 0.5) * 6, // -3% to +3%
    updated_at: Date.now()
  };
};

// Cache management for performance
let cachedTop100: CryptoCoin[] | null = null;
let cachedTrending: TrendingCoin[] | null = null;
let cachedGlobal: GlobalData | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get cached or fresh data
export const getCachedTop100 = (): CryptoCoin[] => {
  const now = Date.now();
  if (!cachedTop100 || now - lastCacheTime > CACHE_DURATION) {
    cachedTop100 = generateTop100Coins();
    cachedTrending = generateTrendingCoins();
    cachedGlobal = generateGlobalData();
    lastCacheTime = now;
  }
  return cachedTop100;
};

export const getCachedTrending = (): TrendingCoin[] => {
  if (!cachedTrending) {
    getCachedTop100(); // This will populate all caches
  }
  return cachedTrending!;
};

export const getCachedGlobal = (): GlobalData => {
  if (!cachedGlobal) {
    getCachedTop100(); // This will populate all caches
  }
  return cachedGlobal!;
};

// Force refresh cache
export const refreshCache = (): void => {
  cachedTop100 = null;
  cachedTrending = null;
  cachedGlobal = null;
  lastCacheTime = 0;
};
