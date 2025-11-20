// Script untuk check source of articles with BTC coin tags
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function checkArticleSource() {
  try {
    const query = '*[_type == "article" && count(coinTags[]->) > 0 && count(coinTags[]->[symbol == "BTC"]) > 0] { _id, title, category, source, coinTags[]->{ name, symbol } }';
    const articles = await client.fetch(query);
    console.log('Articles with BTC:', JSON.stringify(articles, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkArticleSource();


























