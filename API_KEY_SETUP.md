# API Key Setup Guide

## Error 401 - Unauthorized

Jika Anda melihat error `API error: 401`, ini berarti API key Moralis tidak dikonfigurasi atau tidak valid.

## Solusi

### 1. Buat file `.env.local`

Buat file `.env.local` di root project dengan konten berikut:

```env
# Moralis API Key (Get from https://admin.moralis.io/)
NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_api_key_here

# CoinGecko API Key (Optional - for higher rate limits)
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key_here
```

### 2. Dapatkan Moralis API Key

1. Kunjungi [Moralis Admin Panel](https://admin.moralis.io/)
2. Buat akun atau login
3. Buat project baru
4. Copy API key dari project settings
5. Paste ke file `.env.local`

### 3. Dapatkan CoinGecko API Key (Opsional)

1. Kunjungi [CoinGecko Pro](https://www.coingecko.com/en/api/pricing)
2. Pilih plan yang sesuai
3. Dapatkan API key
4. Paste ke file `.env.local`

### 4. Restart Development Server

```bash
# Stop server
Ctrl + C

# Restart server
npm run dev
```

## Fallback System

Jika API key tidak tersedia atau tidak valid, aplikasi akan menggunakan:

- **Mock Data**: Data statis untuk testing
- **CoinGecko Free API**: Untuk data dasar koin
- **DexScreener API**: Untuk data DEX

## Troubleshooting

### Error 401 tetap muncul
- Pastikan file `.env.local` ada di root project
- Pastikan tidak ada spasi di sekitar `=`
- Restart development server setelah menambah API key

### Rate Limit Error
- Upgrade ke plan berbayar
- Atau gunakan fallback system yang sudah ada

### API Key tidak terbaca
- Pastikan nama variabel dimulai dengan `NEXT_PUBLIC_`
- Pastikan file `.env.local` tidak di-commit ke git

## Current Status

✅ **Error handling sudah diperbaiki**
✅ **Fallback system sudah aktif**
✅ **Mock data tersedia**
✅ **Aplikasi tetap berfungsi tanpa API key**

Sekarang aplikasi akan menggunakan mock data jika API key tidak tersedia, sehingga tidak ada lagi error 401! 