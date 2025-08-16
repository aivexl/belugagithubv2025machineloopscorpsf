// CoinGecko API Configuration
export const COINGECKO_CONFIG = {
  API_KEY: 'CG-1NBArXikTdDPy9GPrpUyEmwt',
  BASE_URL: 'https://api.coingecko.com/api/v3',
  HEADERS: {
    'X-CG-Demo-API-Key': 'CG-1NBArXikTdDPy9GPrpUyEmwt',
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
  return COINGECKO_CONFIG.HEADERS;
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
