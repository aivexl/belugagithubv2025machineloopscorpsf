// Script untuk mengisi top 10 cryptocurrency ke Sanity
// Jalankan script ini setelah schema coinTag dibuat

const top10Coins = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    description: "Cryptocurrency pertama dan terbesar berdasarkan market cap",
    category: "bitcoin",
    marketCapRank: 1,
    isActive: true,
    isTop10: true,
    logoUrl: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    link: "/crypto/bitcoin"
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    description: "Platform blockchain untuk smart contracts dan dApps",
    category: "ethereum",
    marketCapRank: 2,
    isActive: true,
    isTop10: true,
    logoUrl: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    link: "/crypto/ethereum"
  },
  {
    name: "Tether",
    symbol: "USDT",
    description: "Stablecoin yang dipatok dengan USD",
    category: "stablecoin",
    marketCapRank: 3,
    isActive: true,
    isTop10: true,
    logoUrl: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    link: "/crypto/tether"
  },
  {
    name: "BNB",
    symbol: "BNB",
    description: "Token native Binance Smart Chain",
    category: "layer1",
    marketCapRank: 4,
    isActive: true,
    isTop10: true,
    logoUrl: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    link: "/crypto/bnb"
  },
  {
    name: "Solana",
    symbol: "SOL",
    description: "Blockchain high-performance untuk dApps",
    category: "layer1",
    marketCapRank: 5,
    isActive: true,
    isTop10: true,
    logoUrl: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    link: "/crypto/solana"
  },
  {
    name: "USDC",
    symbol: "USDC",
    description: "USD Coin - Stablecoin yang dipatok dengan USD",
    category: "stablecoin",
    marketCapRank: 6,
    isActive: true,
    isTop10: true,
    logoUrl: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    link: "/crypto/usd-coin"
  },
  {
    name: "XRP",
    symbol: "XRP",
    description: "Token untuk transfer uang internasional yang cepat",
    category: "infrastructure",
    marketCapRank: 7,
    isActive: true,
    isTop10: true,
    logoUrl: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    link: "/crypto/xrp"
  },
  {
    name: "Cardano",
    symbol: "ADA",
    description: "Blockchain proof-of-stake yang sustainable",
    category: "layer1",
    marketCapRank: 8,
    isActive: true,
    isTop10: true,
    logoUrl: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    link: "/crypto/cardano"
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    description: "Meme coin yang populer",
    category: "meme",
    marketCapRank: 9,
    isActive: true,
    isTop10: true,
    logoUrl: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    link: "/crypto/dogecoin"
  },
  {
    name: "Avalanche",
    symbol: "AVAX",
    description: "Platform blockchain yang scalable dan interoperable",
    category: "layer1",
    marketCapRank: 10,
    isActive: true,
    isTop10: true,
    logoUrl: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    link: "/crypto/avalanche-2"
  }
];

// Fungsi untuk membuat coin tag di Sanity
export async function createCoinTag(coinData) {
  const mutation = {
    _type: 'coinTag',
    name: coinData.name,
    symbol: coinData.symbol,
    description: coinData.description,
    category: coinData.category,
    marketCapRank: coinData.marketCapRank,
    isActive: coinData.isActive,
    isTop10: coinData.isTop10,
    link: coinData.link,
    createdAt: new Date().toISOString(),
    logo: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: `image-${coinData.symbol.toLowerCase()}-${Date.now()}`
      },
      alt: `${coinData.name} logo`
    }
  };

  return mutation;
}

// Fungsi untuk mengisi semua top 10 coins
export function getTop10CoinsData() {
  return top10Coins.map(coin => createCoinTag(coin));
}

// Export data untuk digunakan di Sanity Studio
export { top10Coins };

// Instruksi penggunaan:
// 1. Buka Sanity Studio di /studio
// 2. Pergi ke section "Coin Tags"
// 3. Klik "Create" untuk membuat coin tag baru
// 4. Isi data sesuai dengan struktur di atas
// 5. Upload logo dari URL yang disediakan atau upload file lokal
// 6. Simpan coin tag

// Alternatif: Gunakan Vision plugin di Sanity Studio untuk bulk insert
const bulkInsertQuery = `
// Query untuk bulk insert top 10 coins
// Jalankan di Vision plugin Sanity Studio

[
  ${top10Coins.map(coin => `
  {
    "_type": "coinTag",
    "name": "${coin.name}",
    "symbol": "${coin.symbol}",
    "description": "${coin.description}",
    "category": "${coin.category}",
    "marketCapRank": ${coin.marketCapRank},
    "isActive": ${coin.isActive},
    "isTop10": ${coin.isTop10},
    "link": "${coin.link}",
    "createdAt": "${new Date().toISOString()}"
  }`).join(',\n  ')}
]
`;

console.log('Bulk insert query untuk Sanity Vision:');
console.log(bulkInsertQuery);
