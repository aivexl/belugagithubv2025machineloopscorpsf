# Cara Mengisi Coin Tags di Sanity Studio

## Langkah 1: Buka Sanity Studio
1. Buka browser dan akses `/studio`
2. Login ke Sanity Studio

## Langkah 2: Install Vision Plugin (jika belum ada)
1. Di Sanity Studio, klik "Manage" di sidebar
2. Pilih "Plugins"
3. Cari dan install "Vision" plugin

## Langkah 3: Bulk Insert Top 10 Coins
1. Buka Vision plugin
2. Copy query berikut dan paste di Vision:

```groq
[
  {
    "_type": "coinTag",
    "name": "Bitcoin",
    "symbol": "BTC",
    "description": "Cryptocurrency pertama dan terbesar berdasarkan market cap",
    "category": "bitcoin",
    "marketCapRank": 1,
    "isActive": true,
    "isTop10": true,
    "link": "/crypto/bitcoin",
    "createdAt": "2025-09-16T15:00:33.077Z"
  },
  {
    "_type": "coinTag",
    "name": "Ethereum",
    "symbol": "ETH",
    "description": "Platform blockchain untuk smart contracts dan dApps",
    "category": "ethereum",
    "marketCapRank": 2,
    "isActive": true,
    "isTop10": true,
    "link": "/crypto/ethereum",
    "createdAt": "2025-09-16T15:00:33.167Z"
  },
  {
    "_type": "coinTag",
    "name": "Tether",
    "symbol": "USDT",
    "description": "Stablecoin yang dipatok dengan USD",
    "category": "stablecoin",
    "marketCapRank": 3,
    "isActive": true,
    "isTop10": true,
    "link": "/crypto/tether",
    "createdAt": "2025-09-16T15:00:33.167Z"
  },
  {
    "_type": "coinTag",
    "name": "BNB",
    "symbol": "BNB",
    "description": "Token native Binance Smart Chain",
    "category": "layer1",
    "marketCapRank": 4,
    "isActive": true,
    "isTop10": true,
    "link": "/crypto/bnb",
    "createdAt": "2025-09-16T15:00:33.167Z"
  },
  {
    "_type": "coinTag",
    "name": "Solana",
    "symbol": "SOL",
    "description": "Blockchain high-performance untuk dApps",
    "category": "layer1",
    "marketCapRank": 5,
    "isActive": true,
    "isTop10": true,
    "link": "/crypto/solana",
    "createdAt": "2025-09-16T15:00:33.167Z"
  },
  {
    "_type": "coinTag",
    "name": "USDC",
    "symbol": "USDC",
    "description": "USD Coin - Stablecoin yang dipatok dengan USD",
    "category": "stablecoin",
    "marketCapRank": 6,
    "isActive": true,
    "isTop10": true,
    "link": "/crypto/usd-coin",
    "createdAt": "2025-09-16T15:00:33.167Z"
  },
  {
    "_type": "coinTag",
    "name": "XRP",
    "symbol": "XRP",
    "description": "Token untuk transfer uang internasional yang cepat",
    "category": "infrastructure",
    "marketCapRank": 7,
    "isActive": true,
    "isTop10": true,
    "link": "/crypto/xrp",
    "createdAt": "2025-09-16T15:00:33.167Z"
  },
  {
    "_type": "coinTag",
    "name": "Cardano",
    "symbol": "ADA",
    "description": "Blockchain proof-of-stake yang sustainable",
    "category": "layer1",
    "marketCapRank": 8,
    "isActive": true,
    "isTop10": true,
    "link": "/crypto/cardano",
    "createdAt": "2025-09-16T15:00:33.167Z"
  },
  {
    "_type": "coinTag",
    "name": "Dogecoin",
    "symbol": "DOGE",
    "description": "Meme coin yang populer",
    "category": "meme",
    "marketCapRank": 9,
    "isActive": true,
    "isTop10": true,
    "link": "/crypto/dogecoin",
    "createdAt": "2025-09-16T15:00:33.167Z"
  },
  {
    "_type": "coinTag",
    "name": "Avalanche",
    "symbol": "AVAX",
    "description": "Platform blockchain yang scalable dan interoperable",
    "category": "layer1",
    "marketCapRank": 10,
    "isActive": true,
    "isTop10": true,
    "link": "/crypto/avalanche-2",
    "createdAt": "2025-09-16T15:00:33.167Z"
  }
]
```

3. Klik "Execute" untuk menjalankan query
4. Query akan membuat 10 coin tags sekaligus

## Langkah 4: Upload Logo untuk Setiap Coin
Setelah coin tags dibuat, Anda perlu mengupload logo untuk setiap coin:

1. Buka "Coin Tags" di sidebar Sanity Studio
2. Untuk setiap coin tag:
   - Klik pada coin tag yang ingin diedit
   - Scroll ke bagian "Logo Coin"
   - Upload logo dari URL berikut:
     - Bitcoin: https://assets.coingecko.com/coins/images/1/large/bitcoin.png
     - Ethereum: https://assets.coingecko.com/coins/images/279/large/ethereum.png
     - Tether: https://assets.coingecko.com/coins/images/325/large/Tether.png
     - BNB: https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png
     - Solana: https://assets.coingecko.com/coins/images/4128/large/solana.png
     - USDC: https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png
     - XRP: https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png
     - Cardano: https://assets.coingecko.com/coins/images/975/large/cardano.png
     - Dogecoin: https://assets.coingecko.com/coins/images/5/large/dogecoin.png
     - Avalanche: https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png
   - Atau upload logo dari komputer Anda
   - Simpan perubahan

## Langkah 5: Menambahkan Coin Tags ke Artikel
1. Buka artikel yang ingin diedit
2. Scroll ke bagian "Coin Tags"
3. Klik "Add item"
4. Pilih coin dari dropdown (hanya coin aktif yang muncul)
5. Ulangi untuk menambahkan coin lainnya (maksimal 10)
6. Simpan artikel

## Langkah 6: Verifikasi di Frontend
Setelah coin tags ditambahkan ke artikel, mereka akan muncul di:
- Homepage section "Berita Terbaru"
- Newsroom artikel cards
- Academy artikel cards
- Article detail pages
- News slider

## Troubleshooting
Jika coin tags tidak muncul di frontend:
1. Pastikan coin tags sudah diupload logonya
2. Pastikan coin tags memiliki `isActive: true`
3. Pastikan artikel sudah disimpan dengan coin tags
4. Refresh halaman frontend
5. Cek console browser untuk error

## Menambah Coin Tags Baru
Untuk menambah coin tags baru selain top 10:
1. Buka "Coin Tags" di Sanity Studio
2. Klik "Create"
3. Isi data coin tag
4. Upload logo
5. Set `isActive: true`
6. Simpan























