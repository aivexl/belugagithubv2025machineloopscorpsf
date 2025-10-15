// Script untuk mengecek data coin tags di Sanity
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function checkCoinTags() {
  try {
    console.log('🔍 Checking coin tags data...');

    // Check coin tags
    const coinTagsQuery = `*[_type == "coinTag"] { _id, name, symbol, isActive, category, marketCapRank }`;
    const coinTags = await client.fetch(coinTagsQuery);
    console.log('📊 Coin tags found:', coinTags.length);
    console.log('✅ Active coin tags:', coinTags.filter(tag => tag.isActive).length);
    console.log('📋 Sample coin tags:', coinTags.slice(0, 5));

    // Check articles with coin tags by category
    const academyQuery = `
      *[_type == "article" && category == "academy" && count(coinTags[]->) > 0] {
        _id, title, category,
        coinTags[]->{ _id, name, symbol, isActive }
      }
    `;

    const newsQuery = `
      *[_type == "article" && category == "newsroom" && count(coinTags[]->) > 0] {
        _id, title, category,
        coinTags[]->{ _id, name, symbol, isActive }
      }
    `;

    const academyArticles = await client.fetch(academyQuery);
    const newsArticles = await client.fetch(newsQuery);

    console.log('🎓 Academy articles with coin tags:', academyArticles.length);
    console.log('📰 News articles with coin tags:', newsArticles.length);

    // Test filtering by specific coin
    const testCoin = 'BTC';
    const btcArticlesQuery = `
      *[_type == "article" && count(coinTags[]->) > 0 &&
        count(coinTags[]->[symbol == "${testCoin}"]) > 0] {
        _id, title, category, source,
        coinTags[]->{ name, symbol }
      }
    `;

    const btcArticles = await client.fetch(btcArticlesQuery);
    console.log(`🔍 Articles with ${testCoin} coin tag:`, btcArticles.length);
    console.log('Sample BTC articles:', btcArticles.slice(0, 3));

    // Check coin tag categories
    const categoryStats = {};
    coinTags.forEach(tag => {
      if (!categoryStats[tag.category]) {
        categoryStats[tag.category] = 0;
      }
      categoryStats[tag.category]++;
    });

    console.log('📈 Coin tag categories:', categoryStats);

  } catch (error) {
    console.error('❌ Error checking coin tags:', error);
  }
}

checkCoinTags();
