# Setup Environment Variables SEKARANG

## Langkah 1: Buat file .env.local

Buat file baru bernama `.env.local` di folder root project (`E:\duniacrypto v2`) dan copy-paste kode berikut:

```env
# Moralis API Key (Required for token metadata)
# Get from: https://moralis.io/
NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_api_key_here

# CoinGecko API Key (Optional, for fallback)
# Get from: https://www.coingecko.com/en/api
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key_here

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=qaofdbqx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-07-22
```

## Langkah 2: Dapatkan API Keys

### Moralis API Key (PENTING)
1. Buka https://moralis.io/
2. Sign up/Login
3. Klik "Web3 APIs"
4. Copy API key Anda
5. Ganti `your_moralis_api_key_here` dengan API key yang sebenarnya

### CoinGecko API Key (Opsional)
1. Buka https://www.coingecko.com/en/api
2. Sign up/Login
3. Copy API key Anda
4. Ganti `your_coingecko_api_key_here` dengan API key yang sebenarnya

## Langkah 3: Restart Development Server

Setelah membuat file `.env.local`, restart development server:

```bash
# Stop server (Ctrl+C)
# Kemudian jalankan:
npm run dev
```

## Langkah 4: Test Setup

Buka browser dan test:

1. **Test Environment Variables:**
   ```
   http://localhost:3000/api/test-env
   ```

2. **Test Moralis API:**
   ```
   http://localhost:3000/api/moralis/test
   ```

## Troubleshooting

### Jika sidebar masih kosong:
1. Pastikan file `.env.local` ada di root project
2. Pastikan API key sudah benar
3. Restart development server
4. Check browser console untuk error messages

### Jika CoinGecko tidak bekerja:
- CoinGecko API gratis tapi ada rate limit
- Aplikasi akan menggunakan mock data sebagai fallback

## Hasil yang Diharapkan

Setelah setup yang benar:
- ✅ Sidebar akan menampilkan informasi token
- ✅ Data akan diambil dari Moralis atau CoinGecko
- ✅ Tidak ada error "API error: 400"
- ✅ Fallback ke mock data jika semua API gagal
