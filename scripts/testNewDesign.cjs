// Script untuk test new design
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

// Coin symbol mapping
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

function getDatabaseCoinSymbol(coingeckoSymbol) {
  if (!coingeckoSymbol) return null;

  const lowerSymbol = coingeckoSymbol.toLowerCase();

  if (coinSymbolMapping[lowerSymbol]) {
    return coinSymbolMapping[lowerSymbol];
  }

  if (lowerSymbol === 'btc') return 'BTC';
  if (lowerSymbol === 'eth') return 'ETH';

  return coingeckoSymbol.toUpperCase();
}

async function getArticlesByCoinSymbol(coinSymbol, category = 'both') {
  let categoryFilter = ''
  if (category && category !== 'both') {
    categoryFilter = ` && category == "${category}"`
  }

  const queries = [
    `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbol]) > 0] | order(publishedAt desc)`,
    `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbolUpper]) > 0] | order(publishedAt desc)`,
    `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbolLower]) > 0] | order(publishedAt desc)`,
  ]

  const fieldQuery = `{
    _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
    coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
  }`

  try {
    let result = await client.fetch(`${queries[0]} ${fieldQuery}`, { coinSymbol: coinSymbol })
    if (result && result.length > 0) {
      return result
    }

    result = await client.fetch(`${queries[1]} ${fieldQuery}`, { coinSymbolUpper: coinSymbol.toUpperCase() })
    if (result && result.length > 0) {
      return result
    }

    result = await client.fetch(`${queries[2]} ${fieldQuery}`, { coinSymbolLower: coinSymbol.toLowerCase() })
    if (result && result.length > 0) {
      return result
    }

    return []
  } catch (error) {
    console.error('Error fetching articles by coin symbol:', error)
    return []
  }
}

async function testNewDesign() {
  try {
    console.log('🧪 Testing new horizontal grid design...');

    const coingeckoSymbol = 'bitcoin';
    const databaseSymbol = getDatabaseCoinSymbol(coingeckoSymbol);

    console.log(`📊 CoinGecko symbol: ${coingeckoSymbol}`);
    console.log(`🗃️  Database symbol: ${databaseSymbol}`);

    const academyResults = await getArticlesByCoinSymbol(databaseSymbol, 'academy');
    console.log(`🎓 Academy articles found: ${academyResults.length}`);

    const newsResults = await getArticlesByCoinSymbol(databaseSymbol, 'newsroom');
    console.log(`📰 News articles found: ${newsResults.length}`);

    console.log('\n📋 Academy Articles:');
    academyResults.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
      console.log(`     Category: ${article.category}`);
      console.log(`     Coin Tags: ${article.coinTags?.map(tag => tag.symbol).join(', ')}`);
      console.log(`     Image: ${article.image ? '✅' : '❌'}`);
    });

    console.log('\n📋 News Articles:');
    newsResults.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
      console.log(`     Category: ${article.category}`);
      console.log(`     Coin Tags: ${article.coinTags?.map(tag => tag.symbol).join(', ')}`);
      console.log(`     Image: ${article.image ? '✅' : '❌'}`);
    });

    console.log('\n✅ New design test completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testNewDesign();




















