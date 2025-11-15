// Test script untuk filtering yang sudah diperbaiki
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

// Coin symbol mapping dari CoinGecko ke database
const coinSymbolMap = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'binancecoin': 'BNB',
  'cardano': 'ADA',
  'solana': 'SOL',
  'polygon': 'MATIC',
  'avalanche-2': 'AVAX',
  'polkadot': 'DOT',
  'litecoin': 'LTC',
  'chainlink': 'LINK',
  'uniswap': 'UNI',
  'wrapped-bitcoin': 'WBTC'
};

// Get database coin symbol from CoinGecko symbol
const getDatabaseCoinSymbol = (coingeckoSymbol) => {
  if (!coingeckoSymbol) return null;
  return coinSymbolMap[coingeckoSymbol.toLowerCase()] || coingeckoSymbol.toUpperCase();
};

async function getArticlesByCoinTags(category = 'both') {
  let categoryFilter = ''
  if (category && category !== 'both') {
    categoryFilter = ` && category == "${category}"`
  }

  const query = `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
    count(coinTags[]->) > 0] | order(publishedAt desc) {
    _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
    coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
  }`

  try {
    const result = await client.fetch(query)
    console.log(`📊 getArticlesByCoinTags(${category}) returned ${result?.length || 0} articles`)
    return result || []
  } catch (error) {
    console.error('Error fetching articles by coin tags:', error)
    return []
  }
}

// Simulate the getArticlesForCoin function from CryptoDetailInfo
const getArticlesForCoin = async (coinSymbol, category) => {
  try {
    console.log(`🎯 getArticlesForCoin called with: ${coinSymbol}, ${category}`);

    const articles = await getArticlesByCoinTags(category);
    console.log(`📋 getArticlesByCoinTags returned ${articles.length} articles for category ${category}`);

    // Map CoinGecko symbol to database symbol
    const databaseSymbol = getDatabaseCoinSymbol(coinSymbol);
    console.log(`🔍 Mapping: ${coinSymbol} (CoinGecko) -> ${databaseSymbol} (Database)`);

    // Filter articles that have coin tags matching the database symbol
    const filteredArticles = articles.filter(article =>
      article.coinTags && article.coinTags.some(tag =>
        tag.symbol === databaseSymbol
      )
    );

    console.log(`✅ Filtered ${filteredArticles.length} articles for ${databaseSymbol}`);
    filteredArticles.forEach(article => {
      console.log(`   - ${article.title} (${article.category}): ${article.coinTags.map(t => t.symbol).join(', ')}`);
    });

    return filteredArticles;
  } catch (error) {
    console.error('Error fetching articles for coin:', error);
    return [];
  }
};

async function testFixedFiltering() {
  try {
    console.log('🧪 Testing FIXED filtering logic...');

    // Test for bitcoin (from CoinGecko API)
    const bitcoinArticles = await getArticlesForCoin('bitcoin', 'both');
    console.log(`🎯 Bitcoin articles found: ${bitcoinArticles.length}`);

    // Test for BTC (uppercase)
    const btcArticles = await getArticlesForCoin('BTC', 'both');
    console.log(`🎯 BTC articles found: ${btcArticles.length}`);

    // Test for academy only
    const bitcoinAcademyArticles = await getArticlesForCoin('bitcoin', 'academy');
    console.log(`🎓 Bitcoin academy articles found: ${bitcoinAcademyArticles.length}`);

    // Test for news only
    const bitcoinNewsArticles = await getArticlesForCoin('bitcoin', 'newsroom');
    console.log(`📰 Bitcoin news articles found: ${bitcoinNewsArticles.length}`);

    console.log('\n✅ FIXED FILTERING TEST COMPLETED!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFixedFiltering();






















