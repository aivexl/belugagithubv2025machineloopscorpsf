// Script untuk debug crypto detail page
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

// Simulate the exact logic from CryptoDetailInfo.jsx
async function debugCryptoDetailPage() {
  try {
    console.log('🔍 Debugging crypto detail page...');

    // Simulate coinData from CoinGecko
    const coinData = {
      symbol: 'bitcoin',
      name: 'Bitcoin',
      current_price: 50000,
      market_cap: 900000000000,
      price_change_percentage_24h: 5.5
    };

    console.log('📊 Coin data:', coinData);

    // Get all articles with coin tags
    const allArticlesQuery = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0] | order(publishedAt desc) { _id, title, category, coinTags[]->{ name, symbol } }';
    const allArticles = await client.fetch(allArticlesQuery);
    console.log('📋 All articles with coin tags:', allArticles.length);

    // Simulate the getArticlesForCoin function
    const getArticlesForCoin = async (coinSymbol, category) => {
      try {
        let categoryFilter = ''
        if (category && category !== 'both') {
          categoryFilter = ` && category == "${category}"`
        }

        const query = `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
          count(coinTags[]->) > 0] | order(publishedAt desc) {
          _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
          coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
        }`

        const result = await client.fetch(query)
        if (!result) return []

        // Filter articles that have coin tags matching the current coin symbol
        const normalizedCoinSymbol = coinSymbol.toLowerCase();

        return result.filter(article =>
          article.coinTags && article.coinTags.some(tag => {
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

    // Test academy articles
    console.log('🎓 Testing academy articles...');
    const academyArticles = await getArticlesForCoin(coinData.symbol, 'academy');
    console.log('Academy articles found:', academyArticles.length);
    console.log('Academy articles:', academyArticles.map(a => ({ title: a.title, category: a.category, coinTags: a.coinTags?.map(t => t.symbol) })));

    // Test news articles
    console.log('📰 Testing news articles...');
    const newsArticles = await getArticlesForCoin(coinData.symbol, 'newsroom');
    console.log('News articles found:', newsArticles.length);
    console.log('News articles:', newsArticles.map(a => ({ title: a.title, category: a.category, coinTags: a.coinTags?.map(t => t.symbol) })));

    // Check if there are any issues with the data
    if (academyArticles.length === 0 && newsArticles.length === 0) {
      console.log('❌ No articles found - this explains why "Coming Soon" is shown');
    } else {
      console.log('✅ Articles found - should be displayed in the UI');
    }

  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

debugCryptoDetailPage();

























