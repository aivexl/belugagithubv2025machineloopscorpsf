// Script untuk add more news articles with coin tags
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22',
  token: process.env.SANITY_AUTH_TOKEN
});

async function addMoreNewsArticles() {
  try {
    console.log('Adding more news articles with BTC coin tags...');

    // Get BTC coin tag reference
    const btcCoinTag = await client.fetch('*[_type == "coinTag" && symbol == "BTC"][0]');
    console.log('BTC coin tag:', btcCoinTag);

    if (!btcCoinTag) {
      console.log('BTC coin tag not found');
      return;
    }

    // Create additional news articles with BTC coin tags
    const newsArticles = [
      {
        _type: 'article',
        title: 'Bitcoin ETF Disetujui SEC - Dampaknya terhadap Pasar',
        slug: { _type: 'slug', current: 'bitcoin-etf-sec-approval' },
        excerpt: 'Persetujuan ETF Bitcoin oleh SEC membawa dampak signifikan terhadap pasar cryptocurrency global',
        content: 'Komisi Sekuritas dan Bursa Amerika Serikat (SEC) telah menyetujui ETF Bitcoin spot pertama. Keputusan ini diharapkan dapat membuka pintu bagi investor institusional untuk masuk ke pasar Bitcoin dengan lebih mudah dan aman.',
        category: 'newsroom',
        source: 'Dunia Crypto',
        publishedAt: new Date().toISOString(),
        featured: true,
        showInSlider: false,
        coinTags: [{ _type: 'reference', _ref: btcCoinTag._id }]
      },
      {
        _type: 'article',
        title: 'Analisis Teknikal Bitcoin: Support dan Resistance Minggu Ini',
        slug: { _type: 'slug', current: 'bitcoin-technical-analysis' },
        excerpt: 'Review level support dan resistance penting untuk trading Bitcoin minggu ini',
        content: 'Berdasarkan analisis teknikal terkini, Bitcoin menunjukkan pola bullish dengan beberapa level support dan resistance yang perlu diperhatikan trader. Level psikologis $100,000 menjadi fokus utama pasar saat ini.',
        category: 'newsroom',
        source: 'Dunia Crypto',
        publishedAt: new Date().toISOString(),
        featured: false,
        showInSlider: false,
        coinTags: [{ _type: 'reference', _ref: btcCoinTag._id }]
      },
      {
        _type: 'article',
        title: 'Institusi Besar Mulai Akumulasi Bitcoin',
        slug: { _type: 'slug', current: 'institutional-bitcoin-accumulation' },
        excerpt: 'Beberapa perusahaan besar mulai mengakumulasi Bitcoin sebagai bagian dari strategi treasury mereka',
        content: 'Tren adopsi Bitcoin oleh institusi besar semakin meningkat. Perusahaan seperti MicroStrategy dan Tesla telah menambahkan Bitcoin ke dalam neraca keuangan mereka, menciptakan preseden baru dalam industri keuangan tradisional.',
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

    console.log('Successfully added more news articles with BTC coin tags');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

addMoreNewsArticles();








