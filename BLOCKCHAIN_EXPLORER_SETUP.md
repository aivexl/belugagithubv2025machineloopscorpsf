# Blockchain Explorer API Setup Guide

## 🚀 Real-time Transaction Data dari Blockchain Explorer

Sistem ini menggunakan blockchain explorer APIs untuk mendapatkan data transaksi real-time langsung dari blockchain.

## 📋 Supported Blockchains

| Blockchain | Explorer | API URL | Free Tier |
|------------|----------|---------|-----------|
| **BSC (Binance Smart Chain)** | BSCScan | https://bscscan.com/apis | 100,000 calls/day |
| **Ethereum** | Etherscan | https://etherscan.io/apis | 100,000 calls/day |
| **Polygon** | PolygonScan | https://polygonscan.com/apis | 100,000 calls/day |
| **Avalanche** | Snowtrace | https://snowtrace.io/apis | 100,000 calls/day |
| **Arbitrum** | Arbiscan | https://arbiscan.io/apis | 100,000 calls/day |
| **Optimism** | OptimisticEtherscan | https://optimistic.etherscan.io/apis | 100,000 calls/day |

## 🔑 Cara Mendapatkan API Keys

### 1. BSCScan API Key
1. Kunjungi: https://bscscan.com/apis
2. Klik "Sign Up" atau "Login"
3. Pilih "Free Plan" (100,000 calls/day)
4. Copy API Key yang diberikan

### 2. Etherscan API Key
1. Kunjungi: https://etherscan.io/apis
2. Klik "Sign Up" atau "Login"
3. Pilih "Free Plan" (100,000 calls/day)
4. Copy API Key yang diberikan

### 3. PolygonScan API Key
1. Kunjungi: https://polygonscan.com/apis
2. Klik "Sign Up" atau "Login"
3. Pilih "Free Plan" (100,000 calls/day)
4. Copy API Key yang diberikan

### 4. Snowtrace API Key
1. Kunjungi: https://snowtrace.io/apis
2. Klik "Sign Up" atau "Login"
3. Pilih "Free Plan" (100,000 calls/day)
4. Copy API Key yang diberikan

## ⚙️ Konfigurasi Environment Variables

Tambahkan API keys ke file `.env.local`:

```bash
# Blockchain Explorer API Keys
BSCSCAN_API_KEY=YourBSCScanApiKeyHere
ETHERSCAN_API_KEY=YourEtherscanApiKeyHere
POLYGONSCAN_API_KEY=YourPolygonScanApiKeyHere
SNOWTRACE_API_KEY=YourSnowtraceApiKeyHere
ARBISCAN_API_KEY=YourArbiscanApiKeyHere
OPTIMISTIC_ETHERSCAN_API_KEY=YourOptimisticEtherscanApiKeyHere
```

## 🔄 Cara Kerja Sistem

### 1. **Prioritas Data Sources:**
1. **Blockchain Explorer APIs** (Real-time dari blockchain)
2. **CoinGecko API** (Market data)
3. **DexScreener API** (DEX data)
4. **Demo Data** (Fallback realistic)

### 2. **Chain Detection:**
- Otomatis mendeteksi chain berdasarkan `chainId`
- BSC: `0x38` atau `56`
- Ethereum: `0x1` atau `1`
- Polygon: `0x89` atau `137`
- Avalanche: `0xa86a` atau `43114`

### 3. **Data Transformation:**
- Mengkonversi raw blockchain data ke format yang konsisten
- Menghitung actual token amounts berdasarkan decimals
- Menentukan transaction type (buy/sell/transfer)
- Menambahkan metadata (block number, gas, dll)

## 📊 Contoh Response

```json
{
  "source": "BSCScan (BSC)",
  "chain": "bsc",
  "address": "0x3832d2f059e55934220881f831be501d180671a7",
  "transactions": [
    {
      "transaction_hash": "0x1234567890abcdef...",
      "wallet_address": "0xabcd1234...",
      "transaction_type": "buy",
      "base_token_amount": "1000.0000",
      "quote_token_amount": "0.00",
      "total_value_usd": "0.00",
      "base_token_price_usd": "0.000000",
      "block_timestamp": "2024-01-15T10:30:00.000Z",
      "source": "BSCScan (BSC)",
      "block_number": "12345678",
      "gas_used": "21000",
      "gas_price": "5000000000",
      "contract_address": "0x3832d2f059e55934220881f831be501d180671a7",
      "token_name": "Dogecoin",
      "token_symbol": "DOGE",
      "token_decimal": "18"
    }
  ]
}
```

## 🎯 Keuntungan

### ✅ **Real-time Data:**
- Data langsung dari blockchain
- Tidak ada delay atau cache
- 100% akurat

### ✅ **Multi-Chain Support:**
- Mendukung 6 blockchain utama
- Otomatis fallback antar explorer
- Chain detection otomatis

### ✅ **Free Tier:**
- 100,000 calls/day per explorer
- Total 600,000 calls/day untuk semua chains
- Cukup untuk aplikasi production

### ✅ **Robust Error Handling:**
- Fallback otomatis jika satu API gagal
- Alternative explorer jika primary gagal
- Demo data sebagai last resort

## 🚀 Testing

### Test dengan Token Populer:

```bash
# Dogecoin di BSC
GET /api/blockchain-explorer/transfers/0x3832d2f059e55934220881f831be501d180671a7/bsc

# USDT di Ethereum
GET /api/blockchain-explorer/transfers/0xdac17f958d2ee523a2206206994597c13d831ec7/ethereum

# MATIC di Polygon
GET /api/blockchain-explorer/transfers/0x0000000000000000000000000000000000001010/polygon
```

## 📈 Rate Limits

- **BSCScan**: 5 calls/sec, 100,000 calls/day
- **Etherscan**: 5 calls/sec, 100,000 calls/day
- **PolygonScan**: 5 calls/sec, 100,000 calls/day
- **Snowtrace**: 5 calls/sec, 100,000 calls/day

## 🔧 Troubleshooting

### Error: "API key not found"
- Pastikan API key sudah ditambahkan ke `.env.local`
- Restart development server setelah menambah environment variables

### Error: "Rate limit exceeded"
- Sistem akan otomatis fallback ke explorer lain
- Atau gunakan demo data sebagai fallback

### Error: "No transactions found"
- Token mungkin tidak memiliki transaksi di chain tersebut
- Coba chain lain atau gunakan token yang lebih aktif

## 🎉 Hasil Akhir

Dengan sistem ini, aplikasi Anda akan mendapatkan:
- **Data transaksi real-time** langsung dari blockchain
- **Multi-chain support** untuk 6 blockchain utama
- **Fallback system** yang robust
- **Free tier** yang cukup untuk production
- **Data yang 100% akurat** dan up-to-date

Sistem ini jauh lebih reliable daripada API pihak ketiga dan memberikan data yang real-time langsung dari sumbernya! 🚀 