# Instruksi untuk Menambahkan Coin Tags ke Artikel

## Masalah Saat Ini
Logo coin tidak muncul di homepage section "Berita Terbaru" karena:
1. Belum ada coin tags di Sanity Studio
2. Artikel belum memiliki coin tags

## Solusi Langkah demi Langkah

### Langkah 1: Buat Coin Tags di Sanity Studio
1. Buka `/studio` di browser
2. Login ke Sanity Studio
3. Install Vision plugin jika belum ada
4. Buka Vision plugin
5. Jalankan query berikut untuk membuat coin tags:

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
  }
]
```

### Langkah 2: Upload Logo untuk Setiap Coin Tag
Setelah coin tags dibuat:
1. Buka "Coin Tags" di sidebar Sanity Studio
2. Edit setiap coin tag
3. Upload logo dari URL berikut:
   - Bitcoin: https://assets.coingecko.com/coins/images/1/large/bitcoin.png
   - Ethereum: https://assets.coingecko.com/coins/images/279/large/ethereum.png
   - Tether: https://assets.coingecko.com/coins/images/325/large/Tether.png
4. Simpan setiap coin tag

### Langkah 3: Tambahkan Coin Tags ke Artikel
1. Buka artikel yang ingin diedit (misalnya artikel "test12")
2. Scroll ke bagian "Coin Tags"
3. Klik "Add item"
4. Pilih coin dari dropdown (misalnya Bitcoin)
5. Simpan artikel

### Langkah 4: Verifikasi di Frontend
1. Refresh homepage
2. Lihat section "Berita Terbaru"
3. Logo coin seharusnya muncul di sebelah label "News" atau "Academy"

## Troubleshooting
Jika logo masih tidak muncul:
1. Pastikan coin tags sudah diupload logonya
2. Pastikan coin tags memiliki `isActive: true`
3. Pastikan artikel sudah disimpan dengan coin tags
4. Cek console browser untuk error
5. Pastikan tidak ada error di terminal development server

## Testing
Untuk testing cepat, Anda bisa:
1. Buat 1 coin tag saja (Bitcoin)
2. Upload logonya
3. Tambahkan ke 1 artikel
4. Lihat hasilnya di homepage

Setelah berhasil, Anda bisa menambahkan coin tags lainnya dan menambahkannya ke artikel lain.


































