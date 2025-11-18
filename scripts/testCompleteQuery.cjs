// Script untuk test complete query
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function testCompleteQuery() {
  try {
    // Test the exact query from getArticlesByCoinSymbol
    const query = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0 && count(coinTags[]->[symbol == $coinSymbol]) > 0] | order(publishedAt desc) { _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks, coinTags[]->{ _id, name, symbol, logo, category, isActive, link } }';
    const result = await client.fetch(query, { coinSymbol: 'BTC' });
    console.log('Complete query results:', result.length);
    console.log('Complete query result:', result);

    // Also test without the field selection
    const simpleQuery = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0 && count(coinTags[]->[symbol == $coinSymbol]) > 0] | order(publishedAt desc)';
    const simpleResult = await client.fetch(simpleQuery, { coinSymbol: 'BTC' });
    console.log('Simple query results:', simpleResult.length);
    console.log('Simple query result:', simpleResult);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCompleteQuery();

























