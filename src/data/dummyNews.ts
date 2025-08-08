export const dummyNews = [
  // Newsroom dummy
  ...Array.from({ length: 10 }, (_, i) => ({
    slug: `news-${i + 1}`,
    title: `Berita Crypto #${i + 1}`,
    image: '/Asset/duniacrypto.png',
    excerpt: `Update terbaru dunia crypto ke-${i + 1}, mulai dari regulasi, harga, hingga inovasi blockchain dan Web3.`,
    content: `Ini adalah isi lengkap dari berita crypto nomor ${i + 1}. Anda bisa mengisi dengan konten berita, analisis, atau update industri crypto dan blockchain.`,
    source: { name: 'Newsroom' },
    publishedAt: new Date(Date.UTC(2024, 6, 22, 10, 0, 0) + i * 86400000).toISOString(),
    type: 'news',
  })),
  // Academy dummy
  ...Array.from({ length: 10 }, (_, i) => ({
    slug: `artikel-${i + 1}`,
    title: `Tips Web3 #${i + 1}`,
    image: '/Asset/duniacrypto.png',
    excerpt: `Pelajari topik Web3 menarik ke-${i + 1}, mulai dari blockchain, NFT, hingga DeFi dan keamanan digital.`,
    content: `Ini adalah isi lengkap dari artikel Web3 nomor ${i + 1}. Anda bisa mengisi dengan konten edukasi Web3, blockchain, crypto, keamanan, dan topik lain sesuai kebutuhan.`,
    source: { name: 'Academy' },
    publishedAt: new Date(Date.UTC(2024, 6, 22, 10, 0, 0) + (i + 10) * 86400000).toISOString(),
    type: 'academy',
  })),
]; 