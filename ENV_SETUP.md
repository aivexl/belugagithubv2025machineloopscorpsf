# Environment Variables Setup

## Langkah 1: Buat file .env.local

Buat file `.env.local` di root project dan tambahkan kode berikut:

```env
# Moralis API Key
MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVjMTAzOTRmLTU5MzMtNDE4NS1hZWIzLTk0ZjcyMGVkNGI3NSIsIm9yZ0lkIjoiNDYxNDYyIiwidXNlcklkIjoiNDc0NzU2IiwidHlwZUlkIjoiYTc4ZDlmZjMtMDlhZS00MmM2LTkxNDItMDk2MDg1ODY3NzE1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTM0ODE1NjgsImV4cCI6NDkwOTI0MTU2OH0.59Lf5n4sqfb7EuAYhpn141fdPigaD6lNgVNh-8t4_R0

# CoinGecko API Key (if needed)
COINGECKO_API_KEY=CG-YourCoinGeckoAPIKeyHere

# Other environment variables
NEXT_PUBLIC_APP_NAME=DuniaCrypto
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Langkah 2: Restart Development Server

Setelah menambahkan file `.env.local`, restart development server:

```bash
npm run dev
```

## Langkah 3: Test Transaksi

1. Buka browser ke `http://localhost:3002`
2. Pilih coin yang didukung (seperti BTC, ETH, DOGE)
3. Lihat bagian transaksi di bawah chart
4. Transaksi Moralis akan muncul dengan layout yang stabil

## Supported Coins untuk Testing:

- **Bitcoin (BTC)**: Native token
- **Ethereum (ETH)**: Native token  
- **Dogecoin (DOGE)**: Token
- **USDT**: Stablecoin
- **BNB**: BSC token

## Troubleshooting:

Jika transaksi tidak muncul:
1. Pastikan file `.env.local` ada di root project
2. Restart development server
3. Check browser console untuk error
4. Pastikan coin yang dipilih didukung 