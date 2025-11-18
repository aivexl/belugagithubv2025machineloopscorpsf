// Script untuk check articles
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function checkArticles() {
  try {
    console.log('🔍 Checking articles with coin tags...');

    // Check all articles with coin tags
    const query = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0] { _id, title, category, coinTags[]->{ name, symbol } }';
    const articles = await client.fetch(query);
    console.log('📊 Articles with coin tags:', articles.length);
    console.log('📋 Articles:', articles);

    // Check specifically for bitcoin
    const btcQuery = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0 && count(coinTags[]->[symbol == "BTC"]) > 0] { _id, title, category, coinTags[]->{ name, symbol } }';
    const btcArticles = await client.fetch(btcQuery);
    console.log('🎯 BTC articles:', btcArticles.length);
    console.log('📋 BTC Articles:', btcArticles);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkArticles();

























