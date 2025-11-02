# 🚀 Panduan Lengkap: Menampilkan Logo Coin di Homepage

## ✅ Masalah yang Sudah Diperbaiki
1. **Nested `<a>` tags error** - Sudah diperbaiki dengan menambahkan `disableLinks={true}` di NewsSlider
2. **Komponen CoinLogosOnly** - Sudah terintegrasi di semua halaman
3. **Debug info** - Ditambahkan untuk membantu troubleshooting

## 🎯 Langkah Selanjutnya: Mengisi Data Coin Tags

### Langkah 1: Buka Sanity Studio
1. Buka `http://localhost:3002/studio` di browser
2. Login ke Sanity Studio

### Langkah 2: Install Vision Plugin (jika belum ada)
1. Di Sanity Studio, klik "Tools" di sidebar
2. Klik "Install" di Vision plugin
3. Install dan buka Vision plugin

### Langkah 3: Buat Coin Tags
1. Di Vision plugin, paste query berikut dan klik "Execute":

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
```

### Langkah 4: Upload Logo untuk Setiap Coin Tag
1. Buka "Coin Tags" di sidebar Sanity Studio
2. Edit setiap coin tag yang baru dibuat
3. Upload logo dari URL berikut:
   - **Bitcoin**: https://assets.coingecko.com/coins/images/1/large/bitcoin.png
   - **Ethereum**: https://assets.coingecko.com/coins/images/279/large/ethereum.png
   - **Tether**: https://assets.coingecko.com/coins/images/325/large/Tether.png
4. Simpan setiap coin tag

### Langkah 5: Ambil ID Coin Tags
Di Vision plugin, jalankan query ini untuk mendapatkan ID:

```groq
*[_type == "coinTag"] { _id, name, symbol }
```

Copy ID yang muncul (contoh: `abc123def456`)

### Langkah 6: Tambahkan Coin Tags ke Artikel
Di Vision plugin, jalankan query ini (ganti `COIN_TAG_ID` dengan ID yang didapat):

```groq
*[_type == "article" && slug.current == "test12"][0] {
  ...,
  "coinTags": [
    {
      "_type": "reference",
      "_ref": "COIN_TAG_ID_BITCOIN"
    },
    {
      "_type": "reference", 
      "_ref": "COIN_TAG_ID_ETHEREUM"
    }
  ]
}
```

### Langkah 7: Verifikasi di Frontend
1. Refresh homepage `http://localhost:3002`
2. Lihat section "Berita Terbaru"
3. Logo coin seharusnya muncul di sebelah label "News" atau "Academy"
4. Di development mode, Anda akan melihat debug info seperti "Coins: 2"

## 🔍 Troubleshooting

### Jika logo masih tidak muncul:
1. **Cek debug info**: Di development mode, lihat apakah ada teks "Coins: X" di sebelah label
2. **Pastikan coin tags aktif**: Di Sanity Studio, pastikan `isActive: true`
3. **Pastikan logo sudah diupload**: Logo harus ada di setiap coin tag
4. **Cek console browser**: Lihat apakah ada error di console
5. **Cek terminal**: Pastikan tidak ada error di development server

### Jika ada error "No coins":
- Artinya artikel belum memiliki coin tags
- Ulangi Langkah 6 untuk menambahkan coin tags ke artikel

### Jika ada error lain:
- Restart development server: `Ctrl+C` lalu `npm run dev`
- Clear browser cache dan refresh

## 📝 Catatan Penting
- Logo coin akan muncul di sebelah label pada homepage, newsroom, dan academy
- Logo coin akan muncul di atas judul pada artikel detail dan slider
- Maksimal 3 logo coin yang ditampilkan di homepage
- Maksimal 4 logo coin yang ditampilkan di slider
- Maksimal 5 logo coin yang ditampilkan di artikel detail

## 🎉 Setelah Berhasil
Setelah logo coin muncul, Anda bisa:
1. Menambahkan lebih banyak coin tags
2. Menambahkan coin tags ke artikel lain
3. Mengatur link untuk setiap coin tag
4. Mengatur kategori dan deskripsi coin

Sistem coin tags sudah siap digunakan! 🚀
























