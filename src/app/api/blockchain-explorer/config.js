// Blockchain Explorer API Configuration
// Get free API keys from: https://bscscan.com/apis, https://etherscan.io/apis, etc.

export const EXPLORER_CONFIG = {
  BSCScan: {
    name: 'BSCScan',
    baseUrl: 'https://api.bscscan.com/api',
    apiKey: process.env.BSCSCAN_API_KEY || 'YourApiKeyToken', // Get from https://bscscan.com/apis
    rateLimit: '5 calls/sec',
    freeTier: '100,000 calls/day'
  },
  Etherscan: {
    name: 'Etherscan',
    baseUrl: 'https://api.etherscan.io/api',
    apiKey: process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken', // Get from https://etherscan.io/apis
    rateLimit: '5 calls/sec',
    freeTier: '100,000 calls/day'
  },
  PolygonScan: {
    name: 'PolygonScan',
    baseUrl: 'https://api.polygonscan.com/api',
    apiKey: process.env.POLYGONSCAN_API_KEY || 'YourApiKeyToken', // Get from https://polygonscan.com/apis
    rateLimit: '5 calls/sec',
    freeTier: '100,000 calls/day'
  },
  Snowtrace: {
    name: 'Snowtrace',
    baseUrl: 'https://api.snowtrace.io/api',
    apiKey: process.env.SNOWTRACE_API_KEY || 'YourApiKeyToken', // Get from https://snowtrace.io/apis
    rateLimit: '5 calls/sec',
    freeTier: '100,000 calls/day'
  },
  Arbiscan: {
    name: 'Arbiscan',
    baseUrl: 'https://api.arbiscan.io/api',
    apiKey: process.env.ARBISCAN_API_KEY || 'YourApiKeyToken', // Get from https://arbiscan.io/apis
    rateLimit: '5 calls/sec',
    freeTier: '100,000 calls/day'
  },
  OptimisticEtherscan: {
    name: 'OptimisticEtherscan',
    baseUrl: 'https://api-optimistic.etherscan.io/api',
    apiKey: process.env.OPTIMISTIC_ETHERSCAN_API_KEY || 'YourApiKeyToken', // Get from https://optimistic.etherscan.io/apis
    rateLimit: '5 calls/sec',
    freeTier: '100,000 calls/day'
  }
};

// Chain to Explorer mapping
export const CHAIN_EXPLORER_MAP = {
  'bsc': 'BSCScan',
  'binance': 'BSCScan',
  'ethereum': 'Etherscan',
  'eth': 'Etherscan',
  'polygon': 'PolygonScan',
  'matic': 'PolygonScan',
  'avalanche': 'Snowtrace',
  'avax': 'Snowtrace',
  'arbitrum': 'Arbiscan',
  'arb': 'Arbiscan',
  'optimism': 'OptimisticEtherscan',
  'op': 'OptimisticEtherscan'
};

// API Endpoints
export const EXPLORER_ENDPOINTS = {
  tokenTransfers: '/?module=account&action=tokentx&address={address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey={apiKey}',
  transactions: '/?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey={apiKey}',
  tokenInfo: '/?module=token&action=tokeninfo&contractaddress={address}&apikey={apiKey}',
  tokenSupply: '/?module=stats&action=tokensupply&contractaddress={address}&apikey={apiKey}',
  tokenBalance: '/?module=account&action=tokenbalance&contractaddress={address}&address={wallet}&tag=latest&apikey={apiKey}'
}; 