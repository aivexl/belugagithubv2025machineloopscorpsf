// Script untuk debug data coin tags di Sanity
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_AUTH_TOKEN || process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN
});

async function debugCoinTagsData() {
  try {
    console.log('🔍 Checking Sanity data...');

    // Check coin tags
    const coinTagsQuery = '*[_type == "coinTag"] { _id, name, symbol, isActive, category }';
    const coinTags = await client.fetch(coinTagsQuery);
    console.log('📊 Coin tags found:', coinTags.length);
    console.log('📋 Coin tags:', coinTags);

    // Check BTC coin tag specifically
    const btcTag = coinTags.find(tag => tag.symbol === 'BTC');
    console.log('🎯 BTC coin tag:', btcTag);

    // Check articles with BTC coin tag
    const btcArticlesQuery = '*[_type == "article" && count(coinTags[]->) > 0 && count(coinTags[]->[symbol == "BTC"]) > 0] { _id, title, category, source, coinTags[]->{ name, symbol } }';
    const btcArticles = await client.fetch(btcArticlesQuery);
    console.log('📰 Articles with BTC coin tag:', btcArticles.length);
    console.log('📝 BTC articles:', btcArticles);

    // Check all articles with any coin tags
    const articlesWithCoinTagsQuery = '*[_type == "article" && count(coinTags[]->) > 0] { _id, title, category, source, coinTags[]->{ name, symbol } }';
    const articlesWithCoinTags = await client.fetch(articlesWithCoinTagsQuery);
    console.log('📊 Total articles with coin tags:', articlesWithCoinTags.length);

    // Check articles by category
    const academyQuery = '*[_type == "article" && category == "academy"] { _id, title, coinTags[]->{ name, symbol } }';
    const newsQuery = '*[_type == "article" && category == "newsroom"] { _id, title, coinTags[]->{ name, symbol } }';

    const academyArticles = await client.fetch(academyQuery);
    const newsArticles = await client.fetch(newsQuery);

    console.log('🎓 Academy articles:', academyArticles.length);
    console.log('📰 News articles:', newsArticles.length);

    // Check if there are any articles with coin tags in each category
    const academyWithCoinTags = academyArticles.filter(article => article.coinTags && article.coinTags.length > 0);
    const newsWithCoinTags = newsArticles.filter(article => article.coinTags && article.coinTags.length > 0);

    console.log('🎓 Academy articles with coin tags:', academyWithCoinTags.length);
    console.log('📰 News articles with coin tags:', newsWithCoinTags.length);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugCoinTagsData();















