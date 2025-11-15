// Script untuk test network filtering
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

// Network mapping from CoinGecko symbols to network names
const getNetworkNameFromSymbol = (symbol) => {
  const networkMap = {
    'bitcoin': 'Bitcoin Network',
    'ethereum': 'Ethereum Network',
    'binancecoin': 'Binance Smart Chain (BSC)',
    'cardano': 'Cardano Network',
    'solana': 'Solana Network',
    'polygon': 'Polygon Network',
    'avalanche-2': 'Avalanche Network',
    'polkadot': 'Polkadot Network'
  };

  return networkMap[symbol?.toLowerCase()] || 'Bitcoin Network';
};

async function getArticlesByNetwork(network, category = 'both') {
  let categoryFilter = ''
  if (category && category !== 'both') {
    categoryFilter = ` && category == "${category}"`
  }

  const query = `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} &&
    networks == $network] | order(publishedAt desc) {
    _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks
  }`

  try {
    const result = await client.fetch(query, { network: network })
    return result || []
  } catch (error) {
    console.error('Error fetching articles by network:', error)
    return []
  }
}

async function testNetworkFiltering() {
  try {
    console.log('🧪 Testing network filtering...');

    const coingeckoSymbol = 'bitcoin';
    const networkName = getNetworkNameFromSymbol(coingeckoSymbol);

    console.log(`📊 CoinGecko symbol: ${coingeckoSymbol}`);
    console.log(`🗃️  Network name: ${networkName}`);

    // Test academy articles
    const academyResults = await getArticlesByNetwork(networkName, 'academy');
    console.log(`🎓 Academy articles found: ${academyResults.length}`);

    // Test news articles
    const newsResults = await getArticlesByNetwork(networkName, 'newsroom');
    console.log(`📰 News articles found: ${newsResults.length}`);

    console.log('\n📋 Academy Articles:');
    academyResults.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
      console.log(`     Category: ${article.category}`);
      console.log(`     Network: ${article.networks}`);
      console.log(`     Image: ${article.image ? '✅' : '❌'}`);
    });

    console.log('\n📋 News Articles:');
    newsResults.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
      console.log(`     Category: ${article.category}`);
      console.log(`     Network: ${article.networks}`);
      console.log(`     Image: ${article.image ? '✅' : '❌'}`);
    });

    console.log('\n✅ Network filtering test completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testNetworkFiltering();






















