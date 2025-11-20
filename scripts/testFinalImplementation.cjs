// Script untuk test final implementation
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

// Coin symbol mapping (same as in coinDataUtils.js)
const coinSymbolMapping = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'tether': 'USDT',
  'binancecoin': 'BNB',
  'usd-coin': 'USDC',
  'ripple': 'XRP',
  'cardano': 'ADA',
  'solana': 'SOL',
  'avalanche-2': 'AVAX',
  'polkadot': 'DOT',
  'matic-network': 'MATIC',
  'chainlink': 'LINK',
  'litecoin': 'LTC',
  'polygon': 'MATIC',
  'uniswap': 'UNI',
  'wrapped-bitcoin': 'WBTC'
};

// Convert CoinGecko symbol to database coin tag symbol
function getDatabaseCoinSymbol(coingeckoSymbol) {
  if (!coingeckoSymbol) return null;

  const lowerSymbol = coingeckoSymbol.toLowerCase();

  // Direct mapping
  if (coinSymbolMapping[lowerSymbol]) {
    return coinSymbolMapping[lowerSymbol];
  }

  // Special cases
  if (lowerSymbol === 'btc') return 'BTC';
  if (lowerSymbol === 'eth') return 'ETH';

  // For unmapped symbols, try uppercase
  return coingeckoSymbol.toUpperCase();
}

async function getArticlesByCoinSymbol(coinSymbol, category = 'both') {
  // Add category filter if specified
  let categoryFilter = ''
  if (category && category !== 'both') {
    categoryFilter = ` && category == "${category}"`
  }

  const queries = [
    // Try exact symbol match
    `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbol]) > 0] | order(publishedAt desc)`,
    // Try uppercase symbol match
    `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbolUpper]) > 0] | order(publishedAt desc)`,
    // Try lowercase symbol match
    `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbolLower]) > 0] | order(publishedAt desc)`,
  ]

  const fieldQuery = `{
    _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
    coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
  }`

  try {
    // Try exact symbol match first
    let result = await client.fetch(`${queries[0]} ${fieldQuery}`, { coinSymbol: coinSymbol })
    if (result && result.length > 0) {
      return result
    }

    // Try uppercase symbol match
    result = await client.fetch(`${queries[1]} ${fieldQuery}`, { coinSymbolUpper: coinSymbol.toUpperCase() })
    if (result && result.length > 0) {
      return result
    }

    // Try lowercase symbol match
    result = await client.fetch(`${queries[2]} ${fieldQuery}`, { coinSymbolLower: coinSymbol.toLowerCase() })
    if (result && result.length > 0) {
      return result
    }

    // Return empty array if no matches found
    return []
  } catch (error) {
    console.error('Error fetching articles by coin symbol:', error)
    return []
  }
}

async function testFinalImplementation() {
  try {
    console.log('🧪 Testing final implementation...');

    // Test with CoinGecko symbol "bitcoin"
    const coingeckoSymbol = 'bitcoin';
    const databaseSymbol = getDatabaseCoinSymbol(coingeckoSymbol);

    console.log(`📊 CoinGecko symbol: ${coingeckoSymbol}`);
    console.log(`🗃️  Database symbol: ${databaseSymbol}`);

    // Test academy articles
    const academyResults = await getArticlesByCoinSymbol(databaseSymbol, 'academy');
    console.log(`🎓 Academy articles found: ${academyResults.length}`);

    // Test news articles
    const newsResults = await getArticlesByCoinSymbol(databaseSymbol, 'newsroom');
    console.log(`📰 News articles found: ${newsResults.length}`);

    console.log('✅ Final implementation test completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFinalImplementation();


























