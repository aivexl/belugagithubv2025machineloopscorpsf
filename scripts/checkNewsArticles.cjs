// Script untuk check news articles
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function checkNewsArticles() {
  try {
    const query = '*[_type == "article" && category == "newsroom"] { _id, title, coinTags[]->{ name, symbol } }';
    const articles = await client.fetch(query);
    console.log('News articles:', articles.length);
    console.log('News articles with coin tags:', articles.filter(a => a.coinTags && a.coinTags.length > 0).length);
    console.log('Sample news articles:', articles.slice(0, 3));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkNewsArticles();






















