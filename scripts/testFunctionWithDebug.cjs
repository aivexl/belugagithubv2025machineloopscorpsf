// Script untuk test function with debug
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function getArticlesByCoinSymbol(coinSymbol, category = 'both') {
  const queries = [
    // Try exact symbol match
    `*[_type == "article" && source == "Dunia Crypto" &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbol]) > 0] | order(publishedAt desc)`,
    // Try uppercase symbol match
    `*[_type == "article" && source == "Dunia Crypto" &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbolUpper]) > 0] | order(publishedAt desc)`,
    // Try lowercase symbol match
    `*[_type == "article" && source == "Dunia Crypto" &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbolLower]) > 0] | order(publishedAt desc)`,
  ]

  // Add category filter if specified
  let categoryFilter = ''
  if (category && category !== 'both') {
    categoryFilter = ` && category == "${category}"`
  }

  const fieldQuery = `{
    _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
    coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
  }`

  console.log('🔍 Testing with coinSymbol:', coinSymbol);
  console.log('🔍 Testing with category:', category);
  console.log('🔍 Category filter:', categoryFilter);

  try {
    // Try exact symbol match first
    console.log('🔍 Trying exact match...');
    const query1 = `${queries[0]}${categoryFilter} ${fieldQuery}`;
    console.log('🔍 Query 1:', query1);
    let result = await client.fetch(query1, { coinSymbol: coinSymbol })
    console.log('🔍 Result 1 length:', result ? result.length : 'null/undefined');
    if (result && result.length > 0) {
      console.log('✅ Found with exact match');
      return result
    }

    // Try uppercase symbol match
    console.log('🔍 Trying uppercase match...');
    const query2 = `${queries[1]}${categoryFilter} ${fieldQuery}`;
    console.log('🔍 Query 2:', query2);
    result = await client.fetch(query2, { coinSymbolUpper: coinSymbol.toUpperCase() })
    console.log('🔍 Result 2 length:', result ? result.length : 'null/undefined');
    if (result && result.length > 0) {
      console.log('✅ Found with uppercase match');
      return result
    }

    // Try lowercase symbol match
    console.log('🔍 Trying lowercase match...');
    const query3 = `${queries[2]}${categoryFilter} ${fieldQuery}`;
    console.log('🔍 Query 3:', query3);
    result = await client.fetch(query3, { coinSymbolLower: coinSymbol.toLowerCase() })
    console.log('🔍 Result 3 length:', result ? result.length : 'null/undefined');
    if (result && result.length > 0) {
      console.log('✅ Found with lowercase match');
      return result
    }

    console.log('❌ No matches found');
    // Return empty array if no matches found
    return []
  } catch (error) {
    console.error('❌ Error fetching articles by coin symbol:', error)
    return []
  }
}

async function testFunction() {
  try {
    console.log('Testing getArticlesByCoinSymbol function...');

    const results = await getArticlesByCoinSymbol('BTC', 'academy');
    console.log('Final results:', results.length);
    console.log('Final results:', results);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testFunction();














