// CoinGecko API Service with Fallback Data
export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  image: string;
  total_volume: number;
  circulating_supply: number;
}

export interface TrendingCoin {
  item: {
    id: string;
    symbol: string;
    name: string;
    price_btc: number;
    large: string;
    market_cap_rank: number;
  };
}

export interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number;
  };
}

// Fallback data generator
const generateFallbackCoins = (): CryptoCoin[] => {
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
      image: `https://ui-avatars.com/api/?name=${coin.symbol}&background=1f2937&color=fff&size=32&bold=true`,
      total_volume: marketCap * (Math.random() * 0.1 + 0.05),
      circulating_supply: marketCap / currentPrice * (Math.random() * 0.2 + 0.9)
    };
  });
};

const generateFallbackTrending = (): TrendingCoin[] => {
  const trendingNames = [
    'Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Polkadot', 'Chainlink', 'Polygon', 'Avalanche',
    'Uniswap', 'Litecoin', 'Stellar', 'VeChain', 'Filecoin', 'Cosmos', 'Tezos', 'Algorand',
    'Monero', 'Dash', 'Zcash', 'Ravencoin', 'Decred', 'DigiByte', 'PIVX', 'Verge',
    'Groestlcoin', 'Vertcoin', 'Bitcoin Gold', 'Bitcoin Cash', 'Bitcoin SV', 'Ethereum Classic'
  ];
  
  return trendingNames.map((name, index) => ({
    item: {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      symbol: name.substring(0, 3).toLowerCase(),
      name: name,
      price_btc: Math.random() * 100 + 0.1,
      large: `https://ui-avatars.com/api/?name=${name}&background=1f2937&color=fff&size=32&bold=true`,
      market_cap_rank: index + 1
    }
  }));
};

const generateFallbackGlobal = (): GlobalData => {
  const totalMarketCap = 1800000000000 + (Math.random() - 0.5) * 200000000000;
  const totalVolume = totalMarketCap * (Math.random() * 0.1 + 0.05);
  
  return {
    data: {
      active_cryptocurrencies: 2500 + Math.floor(Math.random() * 500),
      total_market_cap: { usd: totalMarketCap },
      total_volume: { usd: totalVolume },
      market_cap_percentage: { 
        btc: 50 + (Math.random() - 0.5) * 4,
        eth: 20 + (Math.random() - 0.5) * 3
      },
      market_cap_change_percentage_24h_usd: (Math.random() - 0.5) * 4
    }
  };
};

// API Configuration
const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const API_TIMEOUT = 10000; // 10 seconds

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1200; // 1.2 seconds between requests

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = async (endpoint: string): Promise<unknown> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DuniaCrypto/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`[COINGECKO API] Request failed for ${endpoint}:`, error);
    throw error;
  }
};

// API Functions
export const getTop10MarketCap = async (): Promise<CryptoCoin[]> => {
  try {
    const data = await makeRequest('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en');
    
    if (Array.isArray(data)) {
      return data.map((coin: {
        id?: string;
        symbol?: string;
        name?: string;
        current_price?: number;
        market_cap?: number;
        market_cap_rank?: number;
        price_change_percentage_24h?: number;
        image?: string;
        total_volume?: number;
        circulating_supply?: number;
      }) => ({
        id: coin.id || '',
        symbol: coin.symbol || '',
        name: coin.name || '',
        current_price: coin.current_price || 0,
        market_cap: coin.market_cap || 0,
        market_cap_rank: coin.market_cap_rank || 0,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        image: coin.image || `https://ui-avatars.com/api/?name=${coin.symbol || 'crypto'}&background=1f2937&color=fff&size=32&bold=true`,
        total_volume: coin.total_volume || 0,
        circulating_supply: coin.circulating_supply || 0
      }));
    }
    
    throw new Error('Invalid data format from API');
  } catch {
    console.warn('[COINGECKO API] Falling back to generated data for top 10 market cap');
    return generateFallbackCoins();
  }
};

export const getTrendingCoins = async (): Promise<TrendingCoin[]> => {
  try {
    const data = await makeRequest('/search/trending');
    
    if (data && typeof data === 'object' && 'coins' in data && Array.isArray(data.coins)) {
      return data.coins.slice(0, 100); // Limit to 100 trending coins
    }
    
    throw new Error('Invalid data format from API');
  } catch {
    console.warn('[COINGECKO API] Falling back to generated data for trending coins');
    return generateFallbackTrending();
  }
};

export const getGlobalData = async (): Promise<GlobalData> => {
  try {
    const data = await makeRequest('/global');
    
    if (data && typeof data === 'object' && 'data' in data && data.data) {
      return data as GlobalData;
    }
    
    throw new Error('Invalid data format from API');
  } catch {
    console.warn('[COINGECKO API] Falling back to generated data for global data');
    return generateFallbackGlobal();
  }
};

// Batch request for multiple endpoints
export const getCryptoData = async (): Promise<{
  top10: CryptoCoin[];
  trending: TrendingCoin[];
  global: GlobalData;
}> => {
  try {
    const [top10, trending, global] = await Promise.allSettled([
      getTop10MarketCap(),
      getTrendingCoins(),
      getGlobalData()
    ]);
    
    return {
      top10: top10.status === 'fulfilled' ? top10.value : generateFallbackCoins(),
      trending: trending.status === 'fulfilled' ? trending.value : generateFallbackTrending(),
      global: global.status === 'fulfilled' ? global.value : generateFallbackGlobal()
    };
  } catch {
    console.warn('[COINGECKO API] All requests failed, using fallback data');
    return {
      top10: generateFallbackCoins(),
      trending: generateFallbackTrending(),
      global: generateFallbackGlobal()
    };
  }
};
