# Crypto Detail Feature

## Overview
Fitur baru yang memungkinkan pengguna untuk melihat detail lengkap cryptocurrency dengan mengklik asset di crypto table. Fitur ini menggantikan overlay popup dengan halaman detail terpisah yang lebih informatif dan reusable.

## Fitur Utama

### 1. Halaman Detail Crypto (`/crypto/[id]`)
- **URL Dinamis**: Menggunakan dynamic routing Next.js dengan parameter `[id]`
- **Data Lengkap**: Menampilkan informasi detail cryptocurrency dari CoinGecko API
- **Responsive Design**: Optimized untuk desktop dan mobile
- **Navigation**: Tombol back untuk kembali ke halaman sebelumnya

### 2. Informasi yang Ditampilkan
- **Header**: Logo, nama, simbol, dan harga real-time
- **Price Chart**: Grafik harga dengan multiple timeframes (1d, 7d, 30d, 1y)
- **Market Data**: 
  - Current price dan market cap
  - Volume 24h
  - Market cap rank
- **Performance Metrics**: 
  - 1h, 24h, 7d, 30d price changes
  - Color-coded untuk gain/loss
- **Supply Information**:
  - Circulating supply
  - Total supply
  - Max supply
- **All Time Data**:
  - All Time High (ATH)
  - All Time Low (ATL)
- **Description**: Informasi lengkap tentang cryptocurrency

### 3. Integrasi dengan Crypto Table
- **Click Handler**: Setiap row di crypto table sekarang clickable
- **Navigation**: Otomatis redirect ke halaman detail
- **Consistent UX**: Menggunakan router.push untuk smooth navigation

## File Structure

```
src/
├── app/
│   └── crypto/
│       └── [id]/
│           └── page.tsx          # Dynamic route page
├── components/
│   ├── CryptoDetailClient.jsx    # Main detail component
│   ├── CryptoDetailClient.d.ts   # TypeScript definitions
│   └── CryptoTable.jsx           # Updated with navigation
```

## API Endpoints Used

### CoinGecko API
1. **Basic Coin Data**: `/api/coingecko/api/v3/coins/markets`
   - Current price, market cap, volume
   - Price change percentages
   - Basic market data

2. **Detailed Coin Data**: `/api/coingecko/api/v3/coins/{id}`
   - Supply information
   - ATH/ATL data
   - Market statistics
   - Description

3. **Price Chart Data**: `/api/coingecko/api/v3/coins/{id}/market_chart`
   - Historical price data
   - Multiple timeframes

## Implementation Details

### State Management
- Menggunakan React hooks untuk state management
- Loading states untuk UX yang smooth
- Error handling untuk API failures
- Fallback data untuk reliability

### Navigation
- Menggunakan Next.js router untuk navigation
- Browser back button support
- URL-based sharing capability

### Performance
- Lazy loading untuk chart data
- Optimized API calls
- Caching strategy untuk data yang sering diakses

## Usage

### Dari Crypto Table
1. Klik pada row cryptocurrency di crypto table
2. Otomatis redirect ke `/crypto/{coin-id}`
3. Lihat detail lengkap cryptocurrency

### Dari Trending Coins
1. Klik pada trending coin card
2. Navigate ke halaman detail
3. Lihat informasi lengkap

### Dari Heatmap
1. Klik pada coin di heatmap view
2. Redirect ke halaman detail
3. Analisis data cryptocurrency

## Benefits

1. **Better UX**: Halaman terpisah lebih informatif daripada overlay
2. **SEO Friendly**: URL yang dapat di-share dan bookmark
3. **Mobile Optimized**: Responsive design untuk semua device
4. **Reusable**: Komponen dapat digunakan di tempat lain
5. **Performance**: Tidak perlu load overlay data di background
6. **Accessibility**: Better keyboard navigation dan screen reader support

## Future Enhancements

1. **Social Sharing**: Share buttons untuk social media
2. **Watchlist Integration**: Add/remove dari watchlist
3. **Price Alerts**: Set price alerts untuk cryptocurrency
4. **Related Coins**: Show similar cryptocurrencies
5. **News Integration**: Related news articles
6. **Trading View Charts**: Advanced charting capabilities 