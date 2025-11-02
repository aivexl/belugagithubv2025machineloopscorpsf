// Script untuk check coin tag details
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function checkCoinTagDetails() {
  try {
    console.log('🔍 Checking coin tag details...');

    // Check coin tags
    const coinTagsQuery = '*[_type == "coinTag"] { _id, name, symbol, isActive }';
    const coinTags = await client.fetch(coinTagsQuery);
    console.log('📊 Coin tags:', coinTags);

    // Check articles with detailed coin tags
    const articlesQuery = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0] { _id, title, category, coinTags[]->{ _id, name, symbol, isActive } }';
    const articles = await client.fetch(articlesQuery);
    console.log('📋 Articles with coin tags:', articles);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkCoinTagDetails();















