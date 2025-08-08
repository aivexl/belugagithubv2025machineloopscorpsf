# 🚨 URGENT: Setup untuk Mengatasi Error 500

## Langkah 1: Buat file .env.local SEKARANG

Buat file `.env.local` di folder `E:\duniacrypto v2` dan copy-paste kode berikut:

```env
# Moralis API Key
MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVjMTAzOTRmLTU5MzMtNDE4NS1hZWIzLTk0ZjcyMGVkNGI3NSIsIm9yZ0lkIjoiNDYxNDYyIiwidXNlcklkIjoiNDc0NzU2IiwidHlwZUlkIjoiYTc4ZDlmZjMtMDlhZS00MmM2LTkxNDItMDk2MDg1ODY3NzE1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTM0ODE1NjgsImV4cCI6NDkwOTI0MTU2OH0.59Lf5n4sqfb7EuAYhpn141fdPigaD6lNgVNh-8t4_R0

# Other environment variables
NEXT_PUBLIC_APP_NAME=DuniaCrypto
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Langkah 2: Restart Server

Setelah membuat file `.env.local`, restart development server:

```bash
npm run dev
```

## Langkah 3: Test API

1. Buka: `http://localhost:3002/test-moralis`
2. Klik "Test Moralis API"
3. Pastikan status "API Connected Successfully"

## Langkah 4: Test Transaksi

1. Buka: `http://localhost:3002/crypto/dogecoin/chart-txns`
2. Transaksi Moralis akan muncul dengan layout stabil

## 🔧 Perbaikan yang Sudah Dilakukan:

### ✅ Error Handling:
- Error Boundary untuk menangani crash
- Suspense untuk loading state
- Better error messages

### ✅ Crypto Mapping:
- DOGE sudah ditambahkan ke mapping
- Support untuk native dan token types
- Fallback address untuk testing

### ✅ API Route:
- Moralis transactions endpoint
- Proper error handling
- Data transformation

### ✅ Components:
- MoralisTransactionTable dengan layout stabil
- Fixed header yang tidak bergerak
- Custom scrollbar

## 🎯 Hasil Setelah Setup:

- **Error 500 teratasi**
- **Transaksi Moralis berfungsi**
- **Layout stabil dan tidak glitch**
- **Auto-refresh setiap 3 detik**
- **Sorting dan filtering**

## 🚨 Jika Masih Error:

1. Pastikan file `.env.local` ada di root project
2. Restart server dengan `npm run dev`
3. Clear browser cache
4. Check browser console untuk error detail 