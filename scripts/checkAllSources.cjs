// Script untuk check all sources in Sanity
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function checkAllSources() {
  try {
    const query = '*[_type == "article"] { _id, title, category, source }';
    const articles = await client.fetch(query);
    const sources = [...new Set(articles.map(a => a.source))];
    console.log('All sources:', sources);

    const btcQuery = '*[_type == "article" && count(coinTags[]->) > 0 && count(coinTags[]->[symbol == "BTC"]) > 0] { _id, title, category, source }';
    const btcArticles = await client.fetch(btcQuery);
    console.log('BTC articles with sources:', btcArticles);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAllSources();


