// Script untuk add news articles with coin tags
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22',
  token: process.env.SANITY_AUTH_TOKEN
});

async function addNewsArticlesWithCoinTags() {
  try {
    console.log('Adding news articles with BTC coin tags...');

    // Get BTC coin tag reference
    const btcCoinTag = await client.fetch('*[_type == "coinTag" && symbol == "BTC"][0]');
    console.log('BTC coin tag:', btcCoinTag);

    if (!btcCoinTag) {
      console.log('BTC coin tag not found');
      return;
    }

    // Create news articles with BTC coin tags
    const newsArticles = [
      {
        _type: 'article',
        title: 'Bitcoin Mencapai All-Time High Baru',
        slug: { _type: 'slug', current: 'bitcoin-ath-baru' },
        excerpt: 'Bitcoin berhasil mencapai harga tertinggi sepanjang masa di angka $100,000',
        content: 'Hari ini Bitcoin mencatatkan rekor baru dengan mencapai harga $100,000 untuk pertama kalinya dalam sejarah. Pencapaian ini menandai tonggak penting dalam adopsi cryptocurrency secara global.',
        category: 'newsroom',
        source: 'Dunia Crypto',
        publishedAt: new Date().toISOString(),
        featured: true,
        showInSlider: false,
        coinTags: [{ _type: 'reference', _ref: btcCoinTag._id }]
      },
      {
        _type: 'article',
        title: 'Analisis Harga Bitcoin Minggu Ini',
        slug: { _type: 'slug', current: 'analisis-harga-bitcoin' },
        excerpt: 'Review pergerakan harga Bitcoin dan faktor-faktor yang mempengaruhinya',
        content: 'Pasar cryptocurrency menunjukkan volatilitas tinggi minggu ini dengan Bitcoin sebagai leading indicator. Para analis memperkirakan tren bullish akan berlanjut hingga akhir tahun.',
        category: 'newsroom',
        source: 'Dunia Crypto',
        publishedAt: new Date().toISOString(),
        featured: false,
        showInSlider: false,
        coinTags: [{ _type: 'reference', _ref: btcCoinTag._id }]
      }
    ];

    // Insert articles
    for (const article of newsArticles) {
      const result = await client.create(article);
      console.log('Created article:', result.title);
    }

    console.log('Successfully added news articles with BTC coin tags');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

addNewsArticlesWithCoinTags();








