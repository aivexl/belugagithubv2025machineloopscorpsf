// Script untuk test component logic
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

// Simulate the exact getArticlesByCoinTags function
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

// Simulate the exact getArticlesForCoin function
const getArticlesForCoin = async (coinSymbol, category) => {
  try {
    const articles = await getArticlesByCoinTags(category);
    // Filter articles that have coin tags matching the current coin symbol
    const normalizedCoinSymbol = coinSymbol.toLowerCase();

    return articles.filter(article =>
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

async function testComponentLogic() {
  try {
    console.log('🧪 Testing component logic...');

    // Simulate the useEffect logic
    const coinData = { symbol: 'bitcoin' };

    console.log('📊 Coin symbol:', coinData.symbol);

    // Simulate state
    let academyArticles = [];
    let newsArticles = [];
    let loadingAcademy = true;
    let loadingNews = true;

    // Simulate fetchAcademyArticles
    if (coinData?.symbol) {
      console.log('🎓 Fetching academy articles...');
      const articles = await getArticlesForCoin(coinData.symbol, 'academy');
      academyArticles = articles.slice(0, 4);
      loadingAcademy = false;
      console.log('Academy articles result:', academyArticles.length, 'articles');
    }

    // Simulate fetchNewsArticles
    if (coinData?.symbol) {
      console.log('📰 Fetching news articles...');
      const articles = await getArticlesForCoin(coinData.symbol, 'newsroom');
      newsArticles = articles.slice(0, 4);
      loadingNews = false;
      console.log('News articles result:', newsArticles.length, 'articles');
    }

    // Simulate the conditional rendering logic
    console.log('\n📋 Conditional Rendering Check:');
    console.log('loadingAcademy:', loadingAcademy);
    console.log('academyArticles.length:', academyArticles.length);
    console.log('loadingNews:', loadingNews);
    console.log('newsArticles.length:', newsArticles.length);

    // Check what should be displayed
    if (loadingAcademy) {
      console.log('🎓 Should show: Loading spinner for academy');
    } else if (academyArticles.length > 0) {
      console.log('🎓 Should show: Academy articles grid');
    } else {
      console.log('🎓 Should show: Coming Soon for academy');
    }

    if (loadingNews) {
      console.log('📰 Should show: Loading spinner for news');
    } else if (newsArticles.length > 0) {
      console.log('📰 Should show: News articles grid');
    } else {
      console.log('📰 Should show: Coming Soon for news');
    }

    console.log('\n✅ Component logic test completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testComponentLogic();


























