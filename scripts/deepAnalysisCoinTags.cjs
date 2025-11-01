// Deep analysis script untuk coin tags
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function deepAnalysis() {
  console.log('🔍 DEEP ANALYSIS: Coin Tags Filtering Issue');
  console.log('=' .repeat(60));

  try {
    // 1. Check all coin tags
    console.log('1️⃣ Checking all coin tags...');
    const coinTagsQuery = '*[_type == "coinTag"] { _id, name, symbol, isActive, category }';
    const coinTags = await client.fetch(coinTagsQuery);
    console.log(`Found ${coinTags.length} coin tags:`);
    coinTags.forEach(tag => {
      console.log(`  - ${tag.symbol}: ${tag.name} (Active: ${tag.isActive})`);
    });

    // 2. Check articles with coin tags
    console.log('\n2️⃣ Checking articles with coin tags...');
    const articlesQuery = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0] { _id, title, category, coinTags[]->{ _id, name, symbol, isActive } }';
    const articles = await client.fetch(articlesQuery);
    console.log(`Found ${articles.length} articles with coin tags:`);
    articles.forEach(article => {
      console.log(`  - ${article.title} (${article.category})`);
      console.log(`    Coin Tags: ${article.coinTags.map(tag => `${tag.symbol} (${tag.name})`).join(', ')}`);
    });

    // 3. Test exact query from getArticlesByCoinTags
    console.log('\n3️⃣ Testing exact query from getArticlesByCoinTags...');
    const exactQuery = `*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0] | order(publishedAt desc) {
      _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
      coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
    }`;
    const exactResults = await client.fetch(exactQuery);
    console.log(`Exact query returned ${exactResults.length} articles`);

    // 4. Test filtering for bitcoin
    console.log('\n4️⃣ Testing filtering logic...');
    const bitcoinArticles = exactResults.filter(article =>
      article.coinTags && article.coinTags.some(tag =>
        tag.symbol.toLowerCase() === 'bitcoin' ||
        tag.symbol.toLowerCase() === 'btc'
      )
    );
    console.log(`Bitcoin articles found: ${bitcoinArticles.length}`);
    bitcoinArticles.forEach(article => {
      console.log(`  - ${article.title} (${article.category})`);
      console.log(`    Coin Tags: ${article.coinTags.map(tag => tag.symbol).join(', ')}`);
    });

    // 5. Test case-insensitive matching
    console.log('\n5️⃣ Testing case-insensitive matching...');
    const testCases = ['BTC', 'btc', 'bitcoin', 'Bitcoin', 'ETH', 'eth', 'ethereum', 'Ethereum'];
    testCases.forEach(testCase => {
      const matches = exactResults.filter(article =>
        article.coinTags && article.coinTags.some(tag =>
          tag.symbol.toLowerCase() === testCase.toLowerCase()
        )
      );
      console.log(`"${testCase}" matches: ${matches.length} articles`);
    });

    // 6. Check for any data inconsistencies
    console.log('\n6️⃣ Checking for data inconsistencies...');
    const inconsistentArticles = exactResults.filter(article => {
      if (!article.coinTags || article.coinTags.length === 0) return false;
      return article.coinTags.some(tag => !tag.symbol || !tag.name || !tag.isActive);
    });
    console.log(`Inconsistent articles: ${inconsistentArticles.length}`);

    // 7. Check if there are any network references that might be causing issues
    console.log('\n7️⃣ Checking network field usage...');
    const networkQuery = '*[_type == "article" && source == "Dunia Crypto" && defined(networks) && networks != null] { _id, title, networks }';
    const networkArticles = await client.fetch(networkQuery);
    console.log(`Articles with network field: ${networkArticles.length}`);
    networkArticles.forEach(article => {
      console.log(`  - ${article.title}: ${article.networks}`);
    });

    console.log('\n✅ DEEP ANALYSIS COMPLETED');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ Error during deep analysis:', error.message);
  }
}

deepAnalysis();









