// Script untuk test dengan symbol bitcoin (lowercase)
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function getArticlesByCoinSymbol(coinSymbol, category = 'both') {
  // Add category filter if specified
  let categoryFilter = ''
  if (category && category !== 'both') {
    categoryFilter = ` && category == "${category}"`
  }

  const queries = [
    // Try exact symbol match
    `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbol]) > 0] | order(publishedAt desc)`,
    // Try uppercase symbol match
    `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbolUpper]) > 0] | order(publishedAt desc)`,
    // Try lowercase symbol match
    `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbolLower]) > 0] | order(publishedAt desc)`,
  ]

  const fieldQuery = `{
    _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
    coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
  }`

  try {
    // Try exact symbol match first
    let result = await client.fetch(`${queries[0]} ${fieldQuery}`, { coinSymbol: coinSymbol })
    if (result && result.length > 0) {
      return result
    }

    // Try uppercase symbol match
    result = await client.fetch(`${queries[1]} ${fieldQuery}`, { coinSymbolUpper: coinSymbol.toUpperCase() })
    if (result && result.length > 0) {
      return result
    }

    // Try lowercase symbol match
    result = await client.fetch(`${queries[2]} ${fieldQuery}`, { coinSymbolLower: coinSymbol.toLowerCase() })
    if (result && result.length > 0) {
      return result
    }

    // Return empty array if no matches found
    return []
  } catch (error) {
    console.error('Error fetching articles by coin symbol:', error)
    return []
  }
}

async function testBitcoinLowercase() {
  try {
    console.log('Testing with bitcoin (lowercase)...');

    const academyResults = await getArticlesByCoinSymbol('bitcoin', 'academy');
    console.log('Bitcoin academy results:', academyResults.length);

    const newsResults = await getArticlesByCoinSymbol('bitcoin', 'newsroom');
    console.log('Bitcoin news results:', newsResults.length);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testBitcoinLowercase();

























