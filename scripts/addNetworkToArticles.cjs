// Script untuk add network field to existing articles
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22',
  token: process.env.SANITY_AUTH_TOKEN
});

async function addNetworkToArticles() {
  try {
    console.log('Adding network field to articles...');

    // Get all articles
    const articles = await client.fetch('*[_type == "article"] { _id, title, category, networks }');

    console.log(`Found ${articles.length} articles`);

    // Update articles to add network field
    for (const article of articles) {
      if (!article.networks) {
        // Assign network based on title or category
        let network = 'Bitcoin Network'; // default

        if (article.title.toLowerCase().includes('ethereum')) {
          network = 'Ethereum Network';
        } else if (article.title.toLowerCase().includes('binance')) {
          network = 'Binance Smart Chain (BSC)';
        } else if (article.title.toLowerCase().includes('solana')) {
          network = 'Solana Network';
        } else if (article.title.toLowerCase().includes('polygon')) {
          network = 'Polygon Network';
        } else if (article.title.toLowerCase().includes('cardano')) {
          network = 'Cardano Network';
        }

        try {
          await client.patch(article._id).set({ networks: network }).commit();
          console.log(`Updated: ${article.title} -> ${network}`);
        } catch (error) {
          console.error(`Error updating ${article.title}:`, error.message);
        }
      }
    }

    console.log('Finished updating articles with network field');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

addNetworkToArticles();







