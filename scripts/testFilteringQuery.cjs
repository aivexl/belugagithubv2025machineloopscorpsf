// Script untuk test filtering query
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function testFilteringQuery() {
  try {
    // Test exact match query (without category filter)
    const exactQuery = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0 && count(coinTags[]->[symbol == "BTC"]) > 0] | order(publishedAt desc) { _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks, coinTags[]->{ _id, name, symbol, logo, category, isActive, link } }';
    const exactResults = await client.fetch(exactQuery);
    console.log('Exact match results:', exactResults.length);
    console.log('Exact results:', exactResults);

    // Test with category filter
    const categoryQuery = '*[_type == "article" && source == "Dunia Crypto" && category == "academy" && count(coinTags[]->) > 0 && count(coinTags[]->[symbol == "BTC"]) > 0] | order(publishedAt desc) { _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks, coinTags[]->{ _id, name, symbol, logo, category, isActive, link } }';
    const categoryResults = await client.fetch(categoryQuery);
    console.log('Category filter results:', categoryResults.length);
    console.log('Category results:', categoryResults);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testFilteringQuery();























