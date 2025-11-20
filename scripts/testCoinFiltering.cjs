// Script untuk test coin filtering
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

async function testCoinFiltering() {
  try {
    console.log('🧪 Testing coin filtering...');

    // Test filtering for BTC
    const allArticles = await getArticlesByCoinTags('both');
    console.log(`📊 Total articles with coin tags: ${allArticles.length}`);

    // Filter articles that have BTC coin tag
    const btcArticles = allArticles.filter(article =>
      article.coinTags && article.coinTags.some(tag =>
        tag.symbol.toLowerCase() === 'btc'
      )
    );

    console.log(`🎯 Articles with BTC coin tag: ${btcArticles.length}`);

    // Filter articles that have ETH coin tag
    const ethArticles = allArticles.filter(article =>
      article.coinTags && article.coinTags.some(tag =>
        tag.symbol.toLowerCase() === 'eth'
      )
    );

    console.log(`🎯 Articles with ETH coin tag: ${ethArticles.length}`);

    console.log('\n📋 BTC Articles:');
    btcArticles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.category})`);
      console.log(`     Coin Tags: ${article.coinTags?.map(tag => tag.symbol).join(', ')}`);
    });

    console.log('\n📋 ETH Articles:');
    ethArticles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.category})`);
      console.log(`     Coin Tags: ${article.coinTags?.map(tag => tag.symbol).join(', ')}`);
    });

    console.log('\n✅ Coin filtering test completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCoinFiltering();


























