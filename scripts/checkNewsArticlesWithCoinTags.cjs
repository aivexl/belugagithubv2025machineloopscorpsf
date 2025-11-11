// Script untuk check news articles with coin tags
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function checkNewsArticlesWithCoinTags() {
  try {
    const query = '*[_type == "article" && category == "newsroom" && count(coinTags[]->) > 0] { _id, title, coinTags[]->{ name, symbol } }';
    const articles = await client.fetch(query);
    console.log('News articles with coin tags:', articles.length);
    console.log('News articles with coin tags:', articles);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkNewsArticlesWithCoinTags();




















