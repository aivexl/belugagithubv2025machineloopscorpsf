// Real CoinGecko API Integration
// Provides actual crypto data with proper logos from CoinGecko
// Enterprise-level error handling and fallback strategies

export interface RealCryptoCoin {
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
  // Additional fields for compatibility
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  price_change_percentage_1y_in_currency?: number;
}

export interface RealTrendingCoin {
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

export interface RealGlobalData {
  active_cryptocurrencies: number;
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

// CoinGecko API configuration
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const API_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Rate limiting configuration
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1200; // 1.2 seconds between requests (50 requests per minute)

// Utility function to delay requests for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiting function
const rateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
};

// Robust fetch with retry logic
const robustFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Apply rate limiting
      await rateLimit();
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Beluga-Crypto-App/1.0',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      // Handle specific error codes
      if (response.status === 429) {
        // Rate limited - wait longer and retry
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        console.warn(`Rate limited, waiting ${retryAfter} seconds...`);
        await delay(retryAfter * 1000);
        continue;
      }
      
      if (response.status === 403) {
        // Forbidden - might be API key issue
        throw new Error(`API access forbidden (${response.status}). Please check API configuration.`);
      }
      
      if (response.status >= 500) {
        // Server error - retry
        console.warn(`Server error ${response.status}, attempt ${attempt}/${MAX_RETRIES}`);
        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * attempt);
          continue;
        }
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`Request timeout, attempt ${attempt}/${MAX_RETRIES}`);
        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * attempt);
          continue;
        }
      }
      
      if (attempt < MAX_RETRIES) {
        console.warn(`Request failed, attempt ${attempt}/${MAX_RETRIES}:`, error);
        await delay(RETRY_DELAY * attempt);
        continue;
      }
    }
  }
  
  throw lastError!;
};

// Fetch top 100 coins with real data
export const fetchTop100Coins = async (): Promise<RealCryptoCoin[]> => {
  try {
    const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en&price_change_percentage=1h,24h,7d,30d,1y`;
    
    console.log('Fetching real crypto data from CoinGecko...');
    const response = await robustFetch(url);
    const data = await response.json();
    
    console.log(`Successfully fetched ${data.length} coins from CoinGecko`);
    return data;
    
  } catch (error) {
    console.error('Failed to fetch real crypto data:', error);
    throw error;
  }
};

// Fetch trending coins
export const fetchTrendingCoins = async (): Promise<RealTrendingCoin[]> => {
  try {
    const url = `${COINGECKO_API_BASE}/search/trending`;
    
    console.log('Fetching trending coins from CoinGecko...');
    const response = await robustFetch(url);
    const data = await response.json();
    
    console.log(`Successfully fetched ${data.coins?.length || 0} trending coins`);
    return data.coins || [];
    
  } catch (error) {
    console.error('Failed to fetch trending coins:', error);
    throw error;
  }
};

// Fetch global market data
export const fetchGlobalData = async (): Promise<RealGlobalData> => {
  try {
    const url = `${COINGECKO_API_BASE}/global`;
    
    console.log('Fetching global market data from CoinGecko...');
    const response = await robustFetch(url);
    const data = await response.json();
    
    console.log('Successfully fetched global market data');
    return data.data;
    
  } catch (error) {
    console.error('Failed to fetch global market data:', error);
    throw error;
  }
};

// Fetch specific coin data
export const fetchCoinData = async (coinId: string): Promise<RealCryptoCoin> => {
  try {
    const url = `${COINGECKO_API_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    
    console.log(`Fetching data for coin: ${coinId}`);
    const response = await robustFetch(url);
    const data = await response.json();
    
    // Transform to match our interface
    const transformed: RealCryptoCoin = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image?.large || data.image?.thumb || `https://ui-avatars.com/api/?name=${data.symbol?.toUpperCase()}&background=random&color=fff&size=128`,
      current_price: data.market_data?.current_price?.usd || 0,
      market_cap: data.market_data?.market_cap?.usd || 0,
      market_cap_rank: data.market_cap_rank || 0,
      fully_diluted_valuation: data.market_data?.fully_diluted_valuation?.usd || 0,
      total_volume: data.market_data?.total_volume?.usd || 0,
      high_24h: data.market_data?.high_24h?.usd || 0,
      low_24h: data.market_data?.low_24h?.usd || 0,
      price_change_24h: data.market_data?.price_change_24h || 0,
      price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
      market_cap_change_24h: data.market_data?.market_cap_change_24h || 0,
      market_cap_change_percentage_24h: data.market_data?.market_cap_change_percentage_24h || 0,
      circulating_supply: data.market_data?.circulating_supply || 0,
      total_supply: data.market_data?.total_supply || 0,
      max_supply: data.market_data?.max_supply || 0,
      ath: data.market_data?.ath?.usd || 0,
      ath_change_percentage: data.market_data?.ath_change_percentage?.usd || 0,
      ath_date: data.market_data?.ath_date?.usd || new Date().toISOString(),
      atl: data.market_data?.atl?.usd || 0,
      atl_change_percentage: data.market_data?.atl_change_percentage?.usd || 0,
      atl_date: data.market_data?.atl_date?.usd || new Date().toISOString(),
      roi: data.market_data?.roi || null,
      last_updated: data.last_updated || new Date().toISOString(),
      price_change_percentage_1h_in_currency: data.market_data?.price_change_percentage_1h_in_currency?.usd || 0,
      price_change_percentage_7d_in_currency: data.market_data?.price_change_percentage_7d_in_currency?.usd || 0,
      price_change_percentage_30d_in_currency: data.market_data?.price_change_percentage_30d_in_currency?.usd || 0,
      price_change_percentage_1y_in_currency: data.market_data?.price_change_percentage_1y_in_currency?.usd || 0,
    };
    
    console.log(`Successfully fetched data for ${coinId}`);
    return transformed;
    
  } catch (error) {
    console.error(`Failed to fetch data for coin ${coinId}:`, error);
    throw error;
  }
};

// Search coins
export const searchCoins = async (query: string): Promise<RealCryptoCoin[]> => {
  try {
    const url = `${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`;
    
    console.log(`Searching coins for: ${query}`);
    const response = await robustFetch(url);
    const data = await response.json();
    
    // Get detailed data for top results
    const topResults = data.coins?.slice(0, 10) || [];
    const detailedResults = await Promise.allSettled(
      topResults.map((coin: any) => fetchCoinData(coin.id))
    );
    
    const successfulResults = detailedResults
      .filter((result): result is PromiseFulfilledResult<RealCryptoCoin> => result.status === 'fulfilled')
      .map(result => result.value);
    
    console.log(`Search returned ${successfulResults.length} results for: ${query}`);
    return successfulResults;
    
  } catch (error) {
    console.error(`Search failed for query: ${query}`, error);
    throw error;
  }
};

// Health check for API status
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const url = `${COINGECKO_API_BASE}/ping`;
    const response = await robustFetch(url);
    const data = await response.json();
    
    return data.gecko_says === '(V3) To the Moon!';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// Get API status
export const getAPIStatus = async (): Promise<{ status: string; message: string }> => {
  try {
    const isHealthy = await checkAPIHealth();
    
    if (isHealthy) {
      return { status: 'healthy', message: 'CoinGecko API is operational' };
    } else {
      return { status: 'degraded', message: 'CoinGecko API is experiencing issues' };
    }
  } catch (error) {
    return { status: 'down', message: 'CoinGecko API is unavailable' };
  }
};
