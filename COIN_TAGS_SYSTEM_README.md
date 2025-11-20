# Sistem Coin Tags - Beluga.id

## Overview
Sistem coin tags memungkinkan Anda untuk menambahkan cryptocurrency terkait ke setiap artikel di platform Beluga.id. Sistem ini terintegrasi penuh dengan Sanity Studio untuk manajemen konten dan frontend untuk menampilkan logo coin.

## Fitur Utama

### 1. Sanity Studio Integration
- **Schema Coin Tag**: Schema lengkap untuk mengelola cryptocurrency
- **Upload Logo**: Upload logo coin dengan validasi gambar
- **Kategori Coin**: Kategorisasi coin berdasarkan jenis (Bitcoin, Ethereum, DeFi, dll.)
- **Status Aktif**: Kontrol visibility coin tags
- **Market Cap Rank**: Peringkat berdasarkan market cap

### 2. Frontend Display
- **Logo Display**: Menampilkan logo coin dengan berbagai ukuran
- **Responsive Design**: Adaptif untuk semua ukuran layar
- **Multiple Layouts**: Grid, List, dan Horizontal layout
- **Hover Effects**: Interaksi visual yang smooth
- **Fallback Handling**: Graceful fallback jika logo tidak tersedia

### 3. Article Integration
- **Multi-tag Support**: Satu artikel bisa memiliki multiple coin tags
- **Reference System**: Menggunakan Sanity reference untuk integrasi
- **Automatic Filtering**: Hanya menampilkan coin yang aktif
- **Limit Control**: Maksimal 10 coin tags per artikel

## Struktur Data

### Coin Tag Schema
```typescript
interface CoinTag {
  _id: string
  name: string           // Nama lengkap (contoh: Bitcoin)
  symbol: string         // Simbol (contoh: BTC)
  logo: {
    asset: {
      _ref: string
      _type: string
    }
    alt?: string
  }
  description?: string   // Deskripsi singkat
  category: string       // Kategori coin
  marketCapRank?: number // Peringkat market cap
  isActive: boolean      // Status aktif
  isTop10: boolean       // Flag top 10
  createdAt: string     // Tanggal dibuat
}
```

### Article Integration
```typescript
interface SanityArticle {
  // ... fields lainnya
  coinTags?: Array<{
    _id: string
    name: string
    symbol: string
    logo: {
      asset: {
        _ref: string
        _type: string
      }
      alt?: string
    }
    category: string
    isActive: boolean
  }>
}
```

## Komponen Frontend

### 1. CoinTags (Default)
```jsx
<CoinTags 
  coinTags={article.coinTags} 
  size="md"              // sm, md, lg
  showNames={true}      // Tampilkan nama coin
  maxDisplay={10}       // Maksimal coin yang ditampilkan
  className="flex-wrap" // CSS classes tambahan
/>
```

### 2. CoinTagsGrid
```jsx
<CoinTagsGrid 
  coinTags={article.coinTags}
  columns={4}           // Jumlah kolom
  size="md"            // Ukuran logo
  className="gap-3"    // CSS classes
/>
```

### 3. CoinTagsList
```jsx
<CoinTagsList 
  coinTags={article.coinTags}
  showCategory={true}  // Tampilkan kategori
  className="space-y-2" // CSS classes
/>
```

## Top 10 Cryptocurrency

Sistem sudah dilengkapi dengan data top 10 cryptocurrency:

1. **Bitcoin (BTC)** - Cryptocurrency pertama dan terbesar
2. **Ethereum (ETH)** - Platform smart contracts
3. **Tether (USDT)** - Stablecoin USD
4. **BNB (BNB)** - Token Binance Smart Chain
5. **Solana (SOL)** - High-performance blockchain
6. **USDC (USDC)** - USD Coin stablecoin
7. **XRP (XRP)** - Cross-border payments
8. **Cardano (ADA)** - Sustainable blockchain
9. **Dogecoin (DOGE)** - Meme coin populer
10. **Avalanche (AVAX)** - Scalable platform

## Cara Penggunaan

### 1. Mengelola Coin Tags di Sanity Studio
1. Buka `/studio` di browser
2. Pilih "Coin Tags" dari menu
3. Klik "Create" untuk membuat coin tag baru
4. Isi data:
   - **Name**: Nama lengkap cryptocurrency
   - **Symbol**: Simbol singkat (akan otomatis uppercase)
   - **Logo**: Upload logo coin
   - **Description**: Deskripsi singkat (opsional)
   - **Category**: Pilih kategori yang sesuai
   - **Market Cap Rank**: Peringkat berdasarkan market cap
   - **Is Active**: Centang untuk mengaktifkan
   - **Is Top 10**: Centang jika termasuk top 10
5. Simpan coin tag

### 2. Menambahkan Coin Tags ke Artikel
1. Buka artikel yang ingin diedit
2. Scroll ke bagian "Coin Tags"
3. Klik "Add item" untuk menambahkan coin tag
4. Pilih coin dari dropdown (hanya coin aktif yang muncul)
5. Ulangi untuk menambahkan coin lainnya (maksimal 10)
6. Simpan artikel

### 3. Menampilkan Coin Tags di Frontend
Coin tags akan otomatis muncul di:
- **Homepage**: Di NewsFeedServer
- **Newsroom**: Di artikel cards
- **Academy**: Di artikel cards
- **Article Detail**: Di halaman detail artikel

## Kategori Coin

Sistem mendukung kategori berikut:
- **Bitcoin**: Cryptocurrency Bitcoin dan fork-nya
- **Ethereum**: Platform Ethereum dan token ERC-20
- **DeFi**: Decentralized Finance protocols
- **Layer 1**: Blockchain layer 1 (Solana, Cardano, dll)
- **Layer 2**: Scaling solutions (Polygon, Arbitrum, dll)
- **Stablecoin**: Stable cryptocurrencies
- **Meme Coin**: Meme-based cryptocurrencies
- **Gaming**: Gaming-focused cryptocurrencies
- **NFT**: NFT-related cryptocurrencies
- **Infrastructure**: Blockchain infrastructure
- **Privacy**: Privacy-focused cryptocurrencies
- **Other**: Kategori lainnya

## Performance Optimization

### 1. Image Optimization
- Logo coin dioptimasi dengan Next.js Image component
- Lazy loading untuk logo yang tidak terlihat
- Fallback image jika logo gagal dimuat
- Responsive images dengan berbagai ukuran

### 2. Query Optimization
- Hanya mengambil coin yang aktif
- Limit jumlah coin yang ditampilkan
- Efficient Sanity queries dengan proper indexing

### 3. Caching
- Sanity CDN untuk logo images
- Client-side caching untuk coin data
- Optimized re-rendering dengan React.memo

## Troubleshooting

### 1. Logo Tidak Muncul
- Pastikan logo sudah diupload di Sanity Studio
- Check apakah coin tag sudah diaktifkan
- Verify image URL di Sanity Studio

### 2. Coin Tags Tidak Muncul di Artikel
- Pastikan artikel sudah memiliki coin tags
- Check apakah coin tags sudah diaktifkan
- Verify query Sanity sudah include coinTags

### 3. Performance Issues
- Reduce jumlah coin tags per artikel
- Optimize image sizes
- Check network connectivity

## Development Notes

### 1. Schema Updates
Jika perlu mengupdate schema coin tag:
1. Update `src/sanity/schemaTypes/coinTagType.ts`
2. Update interface di `src/utils/sanity.ts`
3. Update queries yang menggunakan coinTags

### 2. Component Updates
Jika perlu mengupdate komponen:
1. Update `src/components/CoinTags.jsx`
2. Test di semua halaman yang menggunakan coin tags
3. Verify responsive design

### 3. Data Migration
Untuk mengisi data coin tags:
1. Gunakan script di `scripts/populateTop10Coins.js`
2. Atau manual input melalui Sanity Studio
3. Verify data integrity setelah migration

## Future Enhancements

### 1. Planned Features
- **Coin Price Integration**: Tampilkan harga real-time
- **Market Data**: Volume, market cap, dll
- **Coin Comparison**: Bandingkan multiple coins
- **Trending Coins**: Coin yang sedang trending
- **User Preferences**: Customize coin display

### 2. Technical Improvements
- **GraphQL Integration**: Untuk query yang lebih efisien
- **Real-time Updates**: WebSocket untuk data real-time
- **Advanced Filtering**: Filter berdasarkan kategori, market cap, dll
- **Analytics**: Track coin tag usage dan engagement

## Support

Untuk pertanyaan atau masalah terkait sistem coin tags:
1. Check dokumentasi ini terlebih dahulu
2. Verify konfigurasi Sanity Studio
3. Check browser console untuk error messages
4. Contact development team jika diperlukan

---

**Sistem Coin Tags v1.0** - Beluga.id Platform
*Terakhir diupdate: Januari 2025*



































