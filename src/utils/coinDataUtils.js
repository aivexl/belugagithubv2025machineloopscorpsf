/**
 * Utility functions for coin data operations
 * Reusable across CEX and DEX applications
 */

// Fetch detailed coin data from CoinGecko API
export const fetchDetailedCoinData = async (coinId) => {
  try {
    const response = await fetch(`/api/coingecko/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching detailed coin data:", error);
    return null;
  }
};

// Get accurate launch date from multiple sources
export const getLaunchDate = (detailedCoinData, basicCoinData) => {
  // Priority 1: Use genesis_date from detailed CoinGecko data (most accurate)
  if (detailedCoinData?.genesis_date) {
    return detailedCoinData.genesis_date;
  }
  
  // Priority 2: Use asset_platform_id creation date if available
  if (detailedCoinData?.asset_platform_id?.created_at) {
    return detailedCoinData.asset_platform_id.created_at;
  }
  
  // Priority 3: Use community_data creation date if available
  if (detailedCoinData?.community_data?.created_at) {
    return detailedCoinData.community_data.created_at;
  }
  
  // Priority 4: Use market_data creation date if available
  if (detailedCoinData?.market_data?.created_at) {
    return detailedCoinData.market_data.created_at;
  }
  
  // Priority 5: Use developer_data creation date if available
  if (detailedCoinData?.developer_data?.created_at) {
    return detailedCoinData.developer_data.created_at;
  }
  
  // Priority 6: Use public_interest_score creation date if available
  if (detailedCoinData?.public_interest_score?.created_at) {
    return detailedCoinData.public_interest_score.created_at;
  }
  
  // Fallback to basic coinData
  if (basicCoinData?.genesis_date) {
    return basicCoinData.genesis_date;
  }
  
  // Final fallback: Use a reasonable default date (1 year ago)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return oneYearAgo.toISOString();
};

// Get contract address from platforms
export const getContractAddress = (coinData, symbol) => {
  // Try platforms first
  if (coinData?.platforms) {
    const address = coinData.platforms.ethereum || 
                   coinData.platforms.binance || 
                   coinData.platforms.polygon ||
                   coinData.platforms.arbitrum ||
                   coinData.platforms.optimism ||
                   coinData.platforms.base ||
                   coinData.platforms.avalanche ||
                   coinData.platforms.fantom;
    
    if (address) return address;
  }
  
  // If no platform address, try contract_address
  if (coinData?.contract_address) {
    return coinData.contract_address;
  }
  
  // Fallback to known addresses for major coins
  const knownAddresses = {
    // Ethereum Mainnet
    'usdc': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC on Ethereum
    'usdt': '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT on Ethereum
    'btc': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC on Ethereum
    'bitcoin': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    'eth': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH on Ethereum
    'ethereum': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    'wbtc': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // Wrapped Bitcoin
    'weth': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // Wrapped Ethereum
    'dai': '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI on Ethereum
    'link': '0x514910771af9ca656af840dff83e8264ecf986ca', // Chainlink on Ethereum
    'uni': '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // Uniswap on Ethereum
    'aave': '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', // AAVE on Ethereum
    'comp': '0xc00e94cb662c3520282e6f5717214004a7f26888', // Compound on Ethereum
    'mkr': '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', // Maker on Ethereum
    'shib': '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', // Shiba Inu on Ethereum
    'pepe': '0x6982508145454ce325ddbe47a25d4ec3d2311933', // Pepe on Ethereum
    
    // BSC (Binance Smart Chain)
    'bnb': '0xbb4cdb9cbd36b01bd1cbaef2af88c6e5d6b6b6b6', // WBNB on BSC
    'binancecoin': '0xbb4cdb9cbd36b01bd1cbaef2af88c6e5d6b6b6b6', // WBNB on BSC
    'wbnb': '0xbb4cdb9cbd36b01bd1cbaef2af88c6e5d6b6b6b6', // Wrapped BNB
    'busd': '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD on BSC
    'doge': '0xba2ae424d960c26247dd6c32edc70b295c744c43', // Dogecoin on BSC
    'dogecoin': '0xba2ae424d960c26247dd6c32edc70b295c744c43',
    'ada': '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47', // Cardano on BSC
    'cardano': '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    'sol': '0x570a5d26f7765ecb712c0924e4de545b89fd43df', // Solana on BSC
    'solana': '0x570a5d26f7765ecb712c0924e4de545b89fd43df',
    'dot': '0x7083609fce4d1d8dc0c979aab8c869ea2c873402', // Polkadot on BSC
    'polkadot': '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
    'link_bsc': '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd', // Chainlink on BSC
    'uni_bsc': '0xbf5140a22578168fd562dccf235e5d43a02ce9b1', // Uniswap on BSC
    'cake': '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // PancakeSwap on BSC
    'pancakeswap': '0x0e09fabb73bd3ade0a17ecc321fd13a19e81cE82',
    'usdc_bsc': '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC on BSC
    'usdt_bsc': '0x55d398326f99059ff775485246999027b3197955', // USDT on BSC
    
    // Polygon
    'matic': '0x0000000000000000000000000000000000001010', // MATIC on Polygon
    'wmatic': '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', // Wrapped MATIC
    
    // Avalanche
    'avax': '0x0000000000000000000000000000000000000000', // AVAX native
    'wavax': '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', // Wrapped AVAX
    
    // Arbitrum
    'arb': '0x0000000000000000000000000000000000000000', // ARB native
    'weth_arb': '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // WETH on Arbitrum
    
    // Optimism
    'op': '0x0000000000000000000000000000000000000000', // OP native
    'weth_op': '0x4200000000000000000000000000000000000006', // WETH on Optimism
    
    // Base
    'weth_base': '0x4200000000000000000000000000000000000006', // WETH on Base
  };
  
  const symbolLower = symbol?.toLowerCase();
  return knownAddresses[symbolLower] || null;
};

// Determine chain ID based on contract address and platforms
export const getChainId = (coinData, contractAddress, symbol) => {
  // Check if we have platform-specific addresses
  if (coinData?.platforms) {
    if (coinData.platforms.binance) {
      return "0x38"; // BSC
    } else if (coinData.platforms.polygon) {
      return "0x89"; // Polygon
    } else if (coinData.platforms.arbitrum) {
      return "0xa4b1"; // Arbitrum
    } else if (coinData.platforms.optimism) {
      return "0xa"; // Optimism
    } else if (coinData.platforms.avalanche) {
      return "0xa86a"; // Avalanche
    } else if (coinData.platforms.ethereum) {
      return "0x1"; // Ethereum
    }
  }
  
  // For known addresses, set the correct chain
  if (contractAddress) {
    const bscAddresses = [
      '0xba2ae424d960c26247dd6c32edc70b295c744c43', // Dogecoin on BSC
      '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // CAKE on BSC
      '0xbb4cdb9cbd36b01bd1cbaef2af88c6e5d6b6b6b6', // WBNB on BSC
      '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD on BSC
      '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC on BSC
      '0x55d398326f99059ff775485246999027b3197955', // USDT on BSC
      '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47', // Cardano on BSC
      '0x570a5d26f7765ecb712c0924e4de545b89fd43df', // Solana on BSC
      '0x7083609fce4d1d8dc0c979aab8c869ea2c873402', // Polkadot on BSC
      '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd', // Chainlink on BSC
      '0xbf5140a22578168fd562dccf235e5d43a02ce9b1', // Uniswap on BSC
    ];
    
    const ethereumAddresses = [
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC on Ethereum
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH on Ethereum
      '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT on Ethereum
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC on Ethereum
      '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI on Ethereum
      '0x514910771af9ca656af840dff83e8264ecf986ca', // Chainlink on Ethereum
      '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // Uniswap on Ethereum
      '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', // AAVE on Ethereum
      '0xc00e94cb662c3520282e6f5717214004a7f26888', // Compound on Ethereum
      '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', // Maker on Ethereum
      '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', // Shiba Inu on Ethereum
      '0x6982508145454ce325ddbe47a25d4ec3d2311933', // Pepe on Ethereum
    ];
    
    const polygonAddresses = [
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', // WMATIC on Polygon
    ];
    
    const arbitrumAddresses = [
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // WETH on Arbitrum
    ];
    
    const optimismAddresses = [
      '0x4200000000000000000000000000000000000006', // WETH on Optimism
    ];
    
    const baseAddresses = [
      '0x4200000000000000000000000000000000000006', // WETH on Base
    ];
    
    const avalancheAddresses = [
      '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', // WAVAX on Avalanche
    ];
    
    if (bscAddresses.includes(contractAddress.toLowerCase())) {
      return "0x38"; // BSC
    } else if (ethereumAddresses.includes(contractAddress.toLowerCase())) {
      return "0x1"; // Ethereum
    } else if (polygonAddresses.includes(contractAddress.toLowerCase())) {
      return "0x89"; // Polygon
    } else if (arbitrumAddresses.includes(contractAddress.toLowerCase())) {
      return "0xa4b1"; // Arbitrum
    } else if (optimismAddresses.includes(contractAddress.toLowerCase())) {
      return "0xa"; // Optimism
    } else if (baseAddresses.includes(contractAddress.toLowerCase())) {
      return "0x2105"; // Base
    } else if (avalancheAddresses.includes(contractAddress.toLowerCase())) {
      return "0xa86a"; // Avalanche
    }
  }
  
  // For specific symbols, override chain detection
  const symbolLower = symbol?.toLowerCase();
  
  // BSC tokens
  if (['doge', 'dogecoin', 'cake', 'pancakeswap', 'bnb', 'binancecoin', 'busd', 'ada', 'cardano', 'sol', 'solana', 'dot', 'polkadot'].includes(symbolLower)) {
    return "0x38"; // Force BSC
  }
  
  // Polygon tokens
  if (['matic', 'wmatic'].includes(symbolLower)) {
    return "0x89"; // Force Polygon
  }
  
  // Avalanche tokens
  if (['avax', 'wavax'].includes(symbolLower)) {
    return "0xa86a"; // Force Avalanche
  }
  
  // Arbitrum tokens
  if (['arb'].includes(symbolLower)) {
    return "0xa4b1"; // Force Arbitrum
  }
  
  // Optimism tokens
  if (['op'].includes(symbolLower)) {
    return "0xa"; // Force Optimism
  }
  
  // Base tokens
  if (['weth_base'].includes(symbolLower)) {
    return "0x2105"; // Force Base
  }
  
  // Ethereum tokens (default)
  if (['btc', 'bitcoin', 'eth', 'ethereum', 'usdc', 'usdt', 'wbtc', 'weth', 'dai', 'link', 'uni', 'aave', 'comp', 'mkr', 'shib', 'pepe'].includes(symbolLower)) {
    return "0x1"; // Force Ethereum
  }
  
  return "0x1"; // Default to Ethereum
};

// Create standardized pair data for any coin
export const createPairData = (coinData, detailedCoinData, symbol) => {
  const contractAddress = getContractAddress(coinData, symbol);
  const chainId = getChainId(coinData, contractAddress, symbol);
  const launchDate = getLaunchDate(detailedCoinData, coinData);

  return {
    pairAddress: contractAddress || "0x0000000000000000000000000000000000000000",
    chainId: chainId,
    exchangeName: "Binance",
    exchangeLogo: "/images/exchanges/default-exchange.svg",
    pairLabel: `${symbol}/USDT`,
    volume24hrUsd: coinData?.market_data?.total_volume?.usd || 1000000,
    liquidityUsd: coinData?.market_data?.market_cap?.usd || 5000000,
    priceUsd: coinData?.market_data?.current_price?.usd || 0,
    priceNative: coinData?.market_data?.current_price?.usd || 0,
    quoteToken: "USDT",
    pairCreatedAt: launchDate,
    baseToken: {
      symbol: symbol,
      name: coinData?.name || symbol,
      address: contractAddress,
    },
    pair: [
      {
        pairTokenType: "token0",
        symbol: symbol,
        name: coinData?.name || symbol,
      },
      {
        pairTokenType: "token1",
        symbol: "USDT",
        name: "Tether USD",
      },
    ],
  };
}; 