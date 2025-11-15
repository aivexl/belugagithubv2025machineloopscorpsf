// Script untuk test semua artikel dengan coin tags
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

async function testAllCoinTagsArticles() {
  try {
    console.log('🧪 Testing all articles with coin tags...');

    // Get all articles with coin tags
    const allArticles = await getArticlesByCoinTags('both');
    console.log(`📊 Total articles with coin tags: ${allArticles.length}`);

    // Group by category
    const academyArticles = allArticles.filter(a => a.category === 'academy');
    const newsArticles = allArticles.filter(a => a.category === 'newsroom');

    console.log(`🎓 Academy articles: ${academyArticles.length}`);
    console.log(`📰 News articles: ${newsArticles.length}`);

    // Show articles by coin tag
    const coinTagStats = {};
    allArticles.forEach(article => {
      if (article.coinTags) {
        article.coinTags.forEach(tag => {
          if (!coinTagStats[tag.symbol]) {
            coinTagStats[tag.symbol] = { academy: 0, news: 0, total: 0 };
          }
          coinTagStats[tag.symbol][article.category] += 1;
          coinTagStats[tag.symbol].total += 1;
        });
      }
    });

    console.log('\n📈 Coin Tag Statistics:');
    Object.entries(coinTagStats).forEach(([symbol, stats]) => {
      console.log(`  ${symbol}: Academy=${stats.academy}, News=${stats.news}, Total=${stats.total}`);
    });

    console.log('\n📋 Sample Academy Articles:');
    academyArticles.slice(0, 3).forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
      console.log(`     Coin Tags: ${article.coinTags?.map(tag => tag.symbol).join(', ')}`);
      console.log(`     Image: ${article.image ? '✅' : '❌'}`);
    });

    console.log('\n📋 Sample News Articles:');
    newsArticles.slice(0, 3).forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
      console.log(`     Coin Tags: ${article.coinTags?.map(tag => tag.symbol).join(', ')}`);
      console.log(`     Image: ${article.image ? '✅' : '❌'}`);
    });

    console.log('\n✅ All coin tags articles test completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAllCoinTagsArticles();






















