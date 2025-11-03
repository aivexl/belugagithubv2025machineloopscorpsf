// Script untuk check news article detail
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function checkNewsArticleDetail() {
  try {
    const query = '*[_type == "article" && category == "newsroom" && count(coinTags[]->) > 0] { _id, title, coinTags[]->{ name, symbol }, source }';
    const articles = await client.fetch(query);
    console.log('News articles with coin tags:', JSON.stringify(articles, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkNewsArticleDetail();

















