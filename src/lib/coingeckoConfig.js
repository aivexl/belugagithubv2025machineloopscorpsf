// CoinGecko API Configuration
export const COINGECKO_CONFIG = {
  API_KEY: '177d9528-1f52-4bf0-b884-54f5c56cbd58', // Valid API key
  BASE_URL: 'https://api.coingecko.com/api/v3',
  HEADERS: {
    'Accept': 'application/json',
    'User-Agent': 'Beluga-Crypto-App/1.0'
  },
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 50,
    REQUESTS_PER_HOUR: 1000
  }
};

// Helper function to get API URL with proper headers
export const getCoinGeckoUrl = (endpoint) => {
  return `${COINGECKO_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get headers with API key
export const getCoinGeckoHeaders = () => {
  const headers = { ...COINGECKO_CONFIG.HEADERS };
  
  // Always add API key header for authenticated requests
  if (COINGECKO_CONFIG.API_KEY) {
    headers['X-CG-Demo-API-Key'] = COINGECKO_CONFIG.API_KEY;
  }
  
  return headers;
};

// Helper function to get API key for query parameters
export const getCoinGeckoApiKey = () => {
  return COINGECKO_CONFIG.API_KEY;
};

// Test API key validity
export const testApiKey = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/ping', {
      headers: getCoinGeckoHeaders()
    });
    return response.ok;
  } catch (error) {
    console.error('API Key test failed:', error);
    return false;
  }
};

// Get top 10 market cap coins
export const getTop10MarketCap = async () => {
  try {
    const response = await fetch(`${COINGECKO_CONFIG.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`, {
      headers: getCoinGeckoHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching top 10 market cap:', error);
    return null;
  }
};

// Get trending coins
export const getTrendingCoins = async () => {
  try {
    const response = await fetch(`${COINGECKO_CONFIG.BASE_URL}/search/trending`, {
      headers: getCoinGeckoHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return [];
  }
};
