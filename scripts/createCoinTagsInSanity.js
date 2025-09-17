// Script untuk membuat coin tags di Sanity Studio
// Jalankan di Vision plugin Sanity Studio dengan mengklik "Execute"

// 1. Buat coin tags terlebih dahulu
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
    "createdAt": "2025-01-16T15:00:33.077Z"
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
    "createdAt": "2025-01-16T15:00:33.167Z"
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
    "createdAt": "2025-01-16T15:00:33.167Z"
  }
]

// 2. Setelah coin tags dibuat, ambil ID mereka dengan query ini:
// *[_type == "coinTag"] { _id, name, symbol }

// 3. Kemudian tambahkan coin tags ke artikel dengan query ini (ganti COIN_TAG_ID dengan ID yang didapat):
// *[_type == "article" && slug.current == "test12"][0] {
//   ...,
//   "coinTags": [
//     {
//       "_type": "reference",
//       "_ref": "COIN_TAG_ID_BITCOIN"
//     },
//     {
//       "_type": "reference", 
//       "_ref": "COIN_TAG_ID_ETHEREUM"
//     }
//   ]
// }


