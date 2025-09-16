// Script untuk mengecek data coin tags di Sanity
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function checkCoinTags() {
  try {
    console.log('Checking coin tags data...');
    
    // Check coin tags
    const coinTagsQuery = `
      *[_type == "coinTag"] {
        _id,
        name,
        symbol,
        isActive,
        isTop10,
        createdAt
      }
    `;
    
    const coinTags = await client.fetch(coinTagsQuery);
    console.log('Coin Tags found:', coinTags.length);
    console.log('Coin Tags:', coinTags);
    
    // Check articles with coin tags
    const articlesQuery = `
      *[_type == "article" && defined(coinTags)] {
        _id,
        title,
        coinTags[]->{
          _id,
          name,
          symbol,
          isActive
        }
      }
    `;
    
    const articlesWithCoinTags = await client.fetch(articlesQuery);
    console.log('Articles with coin tags:', articlesWithCoinTags.length);
    console.log('Articles:', articlesWithCoinTags);
    
  } catch (error) {
    console.error('Error checking coin tags:', error);
  }
}

checkCoinTags();
