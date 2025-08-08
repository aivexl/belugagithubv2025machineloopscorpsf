// Mapping of cryptocurrency symbols to their contract addresses and chains
// This helps identify which blockchain and contract to query for transaction data

export const CRYPTO_CONTRACT_MAPPING = {
  // Ethereum Mainnet
  'ETH': { chain: 1, chainName: 'ethereum', contractAddress: null, type: 'native' },
  'USDT': { chain: 1, chainName: 'ethereum', contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7', type: 'token' },
  'USDC': { chain: 1, chainName: 'ethereum', contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', type: 'token' },
  'WBTC': { chain: 1, chainName: 'ethereum', contractAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', type: 'token' },
  'DAI': { chain: 1, chainName: 'ethereum', contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', type: 'token' },
  'LINK': { chain: 1, chainName: 'ethereum', contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca', type: 'token' },
  'UNI': { chain: 1, chainName: 'ethereum', contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', type: 'token' },
  'AAVE': { chain: 1, chainName: 'ethereum', contractAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', type: 'token' },
  'COMP': { chain: 1, chainName: 'ethereum', contractAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888', type: 'token' },
  'MKR': { chain: 1, chainName: 'ethereum', contractAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', type: 'token' },
  'SHIB': { chain: 1, chainName: 'ethereum', contractAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', type: 'token' },
  'PEPE': { chain: 1, chainName: 'ethereum', contractAddress: '0x6982508145454ce325ddbe47a25d4ec3d2311933', type: 'token' },
  'WIF': { chain: 1, chainName: 'ethereum', contractAddress: '0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611', type: 'token' },
  'BONK': { chain: 1, chainName: 'ethereum', contractAddress: '0x1151cb3d861920e07a38e03eead12c32178567f6', type: 'token' },
  'FLOKI': { chain: 1, chainName: 'ethereum', contractAddress: '0xcf0c122c6b73ff809c693db761e7baebe62b6a2e', type: 'token' },
  'DOGE': { chain: 1, chainName: 'ethereum', contractAddress: '0x3832d2f059a559e2083d5dfa7b8b4a82c7b5a4e4', type: 'token' }, // Wrapped DOGE on Ethereum - Note: This might need verification
  
  // BSC (Binance Smart Chain)
  'BNB': { chain: 56, chainName: 'bsc', contractAddress: null, type: 'native' },
  'BUSD': { chain: 56, chainName: 'bsc', contractAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56', type: 'token' },
  'CAKE': { chain: 56, chainName: 'bsc', contractAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', type: 'token' },
  'WBNB': { chain: 56, chainName: 'bsc', contractAddress: '0xbb4cdb9cbd36b01bd1cbaef2af88c6e5d6b6b6b6', type: 'token' },
  
  // Polygon
  'MATIC': { chain: 137, chainName: 'polygon', contractAddress: null, type: 'native' },
  'WMATIC': { chain: 137, chainName: 'polygon', contractAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', type: 'token' },
  
  // Avalanche
  'AVAX': { chain: 43114, chainName: 'avalanche', contractAddress: null, type: 'native' },
  'WAVAX': { chain: 43114, chainName: 'avalanche', contractAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', type: 'token' },
  
  // Fantom
  'FTM': { chain: 250, chainName: 'fantom', contractAddress: null, type: 'native' },
  'WFTM': { chain: 250, chainName: 'fantom', contractAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', type: 'token' },
  
  // Arbitrum
  'ARB': { chain: 42161, chainName: 'arbitrum', contractAddress: null, type: 'native' },
  'WETH': { chain: 42161, chainName: 'arbitrum', contractAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', type: 'token' },
  
  // Optimism
  'OP': { chain: 10, chainName: 'optimism', contractAddress: null, type: 'native' },
  'WETH_OP': { chain: 10, chainName: 'optimism', contractAddress: '0x4200000000000000000000000000000000000006', type: 'token' },
  
  // Base
  'WETH_BASE': { chain: 8453, chainName: 'base', contractAddress: '0x4200000000000000000000000000000000000006', type: 'token' },
  
  // Solana (special case - not EVM)
  'SOL': { chain: 'solana', chainName: 'solana', contractAddress: null, type: 'native' },
};

export const getCryptoMapping = (symbol) => {
  if (!symbol) return null;
  const upperSymbol = symbol.toUpperCase();
  return CRYPTO_CONTRACT_MAPPING[upperSymbol] || null;
};

export const getSupportedChains = () => {
  const chains = new Set();
  Object.values(CRYPTO_CONTRACT_MAPPING).forEach(mapping => {
    chains.add(mapping.chainName);
  });
  return Array.from(chains);
};

export const getCryptosByChain = (chain) => {
  return Object.entries(CRYPTO_CONTRACT_MAPPING)
    .filter(([_, mapping]) => mapping.chainName === chain)
    .map(([symbol, mapping]) => ({ symbol, ...mapping }));
};

export const getDefaultChain = (symbol) => {
  const mapping = getCryptoMapping(symbol);
  return mapping?.chainName || 'ethereum';
};

export const isCryptoSupported = (symbol) => {
  if (!symbol) return false;
  const upperSymbol = symbol.toUpperCase();
  return upperSymbol in CRYPTO_CONTRACT_MAPPING;
}; 