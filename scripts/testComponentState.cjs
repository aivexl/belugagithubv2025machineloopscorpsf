// Test script untuk component state management
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

// Simulate the exact functions from CryptoDetailInfo.jsx
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

async function testComponentState() {
  try {
    console.log('🧪 Testing component state management...');

    // Simulate coinData from CoinGecko
    const coinData = { symbol: 'bitcoin' };
    console.log('📊 Coin data:', coinData);

    // Simulate React component state
    let academyArticles = [];
    let newsArticles = [];
    let loadingAcademy = true;
    let loadingNews = true;

    console.log('\n🎓 Initial state:');
    console.log(`  loadingAcademy: ${loadingAcademy}`);
    console.log(`  academyArticles.length: ${academyArticles.length}`);
    console.log(`  loadingNews: ${loadingNews}`);
    console.log(`  newsArticles.length: ${newsArticles.length}`);

    // Simulate fetchAcademyArticles useEffect
    console.log('\n🎓 Simulating fetchAcademyArticles...');
    if (coinData?.symbol) {
      const articles = await getArticlesForCoin(coinData.symbol, 'academy');
      academyArticles = articles.slice(0, 4);
      loadingAcademy = false;
      console.log(`✅ Academy articles loaded: ${academyArticles.length}`);
    }

    // Simulate fetchNewsArticles useEffect
    console.log('\n📰 Simulating fetchNewsArticles...');
    if (coinData?.symbol) {
      const articles = await getArticlesForCoin(coinData.symbol, 'newsroom');
      newsArticles = articles.slice(0, 4);
      loadingNews = false;
      console.log(`✅ News articles loaded: ${newsArticles.length}`);
    }

    console.log('\n📋 Final state:');
    console.log(`  loadingAcademy: ${loadingAcademy}`);
    console.log(`  academyArticles.length: ${academyArticles.length}`);
    console.log(`  loadingNews: ${loadingNews}`);
    console.log(`  newsArticles.length: ${newsArticles.length}`);

    // Simulate conditional rendering
    console.log('\n🎭 Conditional Rendering Simulation:');

    if (loadingAcademy) {
      console.log('🎓 ACADEMY: Should show loading spinner');
    } else if (academyArticles.length > 0) {
      console.log('🎓 ACADEMY: Should show articles grid');
    } else {
      console.log('🎓 ACADEMY: Should show "Coming Soon"');
    }

    if (loadingNews) {
      console.log('📰 NEWS: Should show loading spinner');
    } else if (newsArticles.length > 0) {
      console.log('📰 NEWS: Should show articles grid');
    } else {
      console.log('📰 NEWS: Should show "Coming Soon"');
    }

    console.log('\n✅ COMPONENT STATE TEST COMPLETED!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testComponentState();






















