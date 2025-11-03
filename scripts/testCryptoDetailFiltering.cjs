// Script untuk test crypto detail filtering
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

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
    return result || []
  } catch (error) {
    console.error('Error fetching articles by coin tags:', error)
    return []
  }
}

// Simulate the getArticlesForCoin function from CryptoDetailInfo
const getArticlesForCoin = async (coinSymbol, category) => {
  try {
    const articles = await getArticlesByCoinTags(category);
    // Filter articles that have coin tags matching the current coin symbol
    // Handle both lowercase (from CoinGecko) and uppercase (from database) symbols
    const normalizedCoinSymbol = coinSymbol.toLowerCase();

    return articles.filter(article =>
      article.coinTags && article.coinTags.some(tag => {
        // Check if the coin tag matches (case-insensitive)
        const tagSymbol = tag.symbol.toLowerCase();
        return tagSymbol === normalizedCoinSymbol ||
               (normalizedCoinSymbol === 'bitcoin' && tagSymbol === 'btc') ||
               (normalizedCoinSymbol === 'btc' && tagSymbol === 'bitcoin') ||
               (normalizedCoinSymbol === 'ethereum' && tagSymbol === 'eth') ||
               (normalizedCoinSymbol === 'eth' && tagSymbol === 'ethereum');
      })
    );
  } catch (error) {
    console.error('Error fetching articles for coin:', error);
    return [];
  }
};

async function testCryptoDetailFiltering() {
  try {
    console.log('🧪 Testing crypto detail filtering...');

    // Test for bitcoin (from CoinGecko)
    const bitcoinArticles = await getArticlesForCoin('bitcoin', 'both');
    console.log(`🎯 Bitcoin articles found: ${bitcoinArticles.length}`);
    bitcoinArticles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.category})`);
      console.log(`     Coin Tags: ${article.coinTags?.map(tag => tag.symbol).join(', ')}`);
    });

    // Test for BTC (uppercase)
    const btcArticles = await getArticlesForCoin('BTC', 'both');
    console.log(`🎯 BTC articles found: ${btcArticles.length}`);
    btcArticles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.category})`);
      console.log(`     Coin Tags: ${article.coinTags?.map(tag => tag.symbol).join(', ')}`);
    });

    // Test for academy only
    const bitcoinAcademyArticles = await getArticlesForCoin('bitcoin', 'academy');
    console.log(`🎓 Bitcoin academy articles found: ${bitcoinAcademyArticles.length}`);

    // Test for news only
    const bitcoinNewsArticles = await getArticlesForCoin('bitcoin', 'newsroom');
    console.log(`📰 Bitcoin news articles found: ${bitcoinNewsArticles.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCryptoDetailFiltering();

















