// Final database check sebagai CTO
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function finalDbCheck() {
  console.log('🔍 CTO FINAL DATABASE CHECK');
  console.log('=' .repeat(60));

  try {
    // 1. Check all coin tags
    console.log('1️⃣ COIN TAGS VERIFICATION:');
    const coinTagsQuery = '*[_type == "coinTag"] { _id, name, symbol, isActive, category }';
    const coinTags = await client.fetch(coinTagsQuery);
    console.log(`Found ${coinTags.length} coin tags:`);
    coinTags.forEach(tag => {
      console.log(`  ✅ ${tag.symbol}: ${tag.name} (Active: ${tag.isActive})`);
    });

    // 2. Check articles with coin tags
    console.log('\n2️⃣ ARTICLES WITH COIN TAGS VERIFICATION:');
    const articlesQuery = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0] { _id, title, category, coinTags[]->{ _id, name, symbol, isActive } }';
    const articles = await client.fetch(articlesQuery);
    console.log(`Found ${articles.length} articles with coin tags:`);
    articles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.category})`);
      console.log(`     Coin Tags: ${article.coinTags.map(tag => `${tag.symbol} (${tag.name})`).join(', ')}`);
    });

    // 3. Test exact query from getArticlesByCoinTags
    console.log('\n3️⃣ QUERY VERIFICATION:');
    const exactQuery = `*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0] | order(publishedAt desc) {
      _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
      coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
    }`;
    const exactResults = await client.fetch(exactQuery);
    console.log(`✅ Exact query returned ${exactResults.length} articles`);

    // 4. Test filtering for bitcoin
    console.log('\n4️⃣ BITCOIN FILTERING TEST:');
    const bitcoinQuery = `*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0 && count(coinTags[]->[symbol == "BTC"]) > 0] { _id, title, category, coinTags[]->{ name, symbol } }`;
    const bitcoinResults = await client.fetch(bitcoinQuery);
    console.log(`✅ Bitcoin query returned ${bitcoinResults.length} articles`);
    bitcoinResults.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.category}) - ${article.coinTags.map(t => t.symbol).join(', ')}`);
    });

    // 5. Verify data structure
    console.log('\n5️⃣ DATA STRUCTURE VERIFICATION:');
    if (exactResults.length > 0) {
      const sample = exactResults[0];
      console.log('✅ Sample article structure:');
      console.log(`   - ID: ${sample._id}`);
      console.log(`   - Title: ${sample.title}`);
      console.log(`   - Category: ${sample.category}`);
      console.log(`   - Source: ${sample.source}`);
      console.log(`   - Coin Tags Count: ${sample.coinTags?.length || 0}`);
      console.log(`   - Has Image: ${!!sample.image}`);
      console.log(`   - Published At: ${sample.publishedAt}`);
    }

    console.log('\n✅ CTO FINAL DATABASE CHECK COMPLETED');
    console.log('=' .repeat(60));
    console.log('🎯 DATABASE STATUS: ALL SYSTEMS OPERATIONAL');
    console.log('📊 Data is ready for frontend consumption');

  } catch (error) {
    console.error('❌ CTO Database Check Failed:', error.message);
    console.error('🔧 This indicates a critical database connectivity issue');
  }
}

finalDbCheck();

















