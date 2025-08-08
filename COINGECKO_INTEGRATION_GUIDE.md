# 🚀 CoinGecko Integration Guide

## 📋 Overview
Aplikasi sekarang menggunakan **CoinGecko API** untuk mendapatkan data market yang reliable dan real-time dari semua coin yang ada di exchanges, menggantikan Moralis dan DexScreener yang sering error.

## ✨ Fitur Utama

### 🔍 **Support Semua Coin**
- **Reliable API** - CoinGecko adalah salah satu API crypto terpercaya
- **Real-time data** dari berbagai exchanges
- **No rate limiting** untuk penggunaan normal
- **Auto-detect coin ID** berdasarkan symbol

### 📊 **Data yang Tersedia**
- **Market data** dari berbagai exchanges
- **Trading volume** dan price information
- **Exchange information** dengan detail
- **Price changes** dan market statistics

## 🌐 **API Endpoints**

### 1. **Search Coins**
```
GET /api/coingecko/search?query={QUERY}&limit={LIMIT}
```

**Parameters:**
- `query` (required): Nama atau symbol coin (e.g., "bitcoin", "eth", "pepe")
- `limit` (optional): Number of results (default: 10)

**Example:**
```bash
curl "http://localhost:3000/api/coingecko/search?query=bitcoin&limit=5"
```

### 2. **Get Market Data**
```
GET /api/coingecko/transactions?coinId={COIN_ID}&limit={LIMIT}
```

**Parameters:**
- `coinId` (required): Coin ID dari CoinGecko (e.g., "bitcoin", "ethereum")
- `limit` (optional): Number of market entries (default: 50)

**Example:**
```bash
curl "http://localhost:3000/api/coingecko/transactions?coinId=bitcoin&limit=10"
```

## 🎯 **Cara Penggunaan**

### **URL untuk Testing:**
- **Homepage**: `http://localhost:3000`
- **Chart & Market Data**: `http://localhost:3000/crypto/{SYMBOL}/chart-txns`

### **Contoh URL:**
- `http://localhost:3000/crypto/bitcoin/chart-txns`
- `http://localhost:3000/crypto/ethereum/chart-txns`
- `http://localhost:3000/crypto/pepe/chart-txns`
- `http://localhost:3000/crypto/shiba-inu/chart-txns`
- `http://localhost:3000/crypto/dogecoin/chart-txns`

## 🔧 **Komponen yang Diupdate**

### 1. **`useCoinGeckoData.js`**
- Hook baru untuk fetch data dari CoinGecko
- Support semua coin tanpa mapping
- Auto-detect coin ID dan market data

### 2. **`CoinGeckoTransactionTable.jsx`**
- Table untuk menampilkan market data
- Real-time price dan volume information
- Exchange information
- Sorting dan pagination

### 3. **`ResizableChartTxnsLayout.jsx`**
- Layout chart dan market data dalam satu halaman
- Divider yang bisa di-resize
- Header dengan informasi coin

## 📈 **Data yang Ditampilkan**

### **Market Data Table Columns:**
1. **Time** - Waktu data (relative)
2. **Type** - Jenis transaksi (buy/sell/trade)
3. **Volume** - Volume trading
4. **Price** - Harga per unit
5. **Value USD** - Nilai total dalam USD
6. **Exchange** - Nama exchange dan market

### **Market Stats:**
- Total Markets
- Current Price
- 24h Price Change
- Data Source (CoinGecko)

## 🌍 **Supported Exchanges**

### **Major Exchanges:**
- **Binance** - Binance
- **Coinbase** - Coinbase Exchange
- **Kraken** - Kraken
- **KuCoin** - KuCoin
- **OKX** - OKX
- **Bybit** - Bybit
- **Gate.io** - Gate.io
- **MEXC** - MEXC
- **Huobi** - Huobi
- **Bitfinex** - Bitfinex

## 🎨 **UI Features**

### **Resizable Layout:**
- Chart dan market data dalam satu halaman
- Divider yang bisa digeser (20%-80% chart height)
- Responsive design

### **Interactive Elements:**
- Sortable table columns
- Real-time market data
- Load more data
- Price change indicators

## 🚀 **Keunggulan vs API Lain**

| Feature | CoinGecko | Moralis | DexScreener |
|---------|-----------|---------|-------------|
| **Reliability** | ✅ Excellent | ⚠️ Good | ❌ Poor |
| **API Key** | ❌ Tidak perlu | ✅ Diperlukan | ❌ Tidak perlu |
| **Rate Limit** | ✅ High | ⚠️ Limited | ❌ Low |
| **Data Quality** | ✅ Excellent | ⚠️ Good | ⚠️ Variable |
| **Support** | ✅ Excellent | ⚠️ Good | ❌ Poor |
| **Cost** | ✅ Gratis | 💰 Berbayar | ✅ Gratis |
| **Setup** | ✅ Simple | ⚠️ Complex | ✅ Simple |

## 🔍 **Testing Examples**

### **Test dengan berbagai coin:**
```bash
# Search coins
curl "http://localhost:3000/api/coingecko/search?query=bitcoin&limit=3"
curl "http://localhost:3000/api/coingecko/search?query=ethereum&limit=3"
curl "http://localhost:3000/api/coingecko/search?query=pepe&limit=3"

# Get market data
curl "http://localhost:3000/api/coingecko/transactions?coinId=bitcoin&limit=5"
curl "http://localhost:3000/api/coingecko/transactions?coinId=ethereum&limit=5"
curl "http://localhost:3000/api/coingecko/transactions?coinId=pepe&limit=5"
```

## 🎯 **Popular Coin IDs**

### **Major Coins:**
- `bitcoin` - Bitcoin (BTC)
- `ethereum` - Ethereum (ETH)
- `binancecoin` - Binance Coin (BNB)
- `solana` - Solana (SOL)
- `cardano` - Cardano (ADA)
- `ripple` - XRP (XRP)
- `dogecoin` - Dogecoin (DOGE)
- `polkadot` - Polkadot (DOT)

### **Popular Tokens:**
- `pepe` - Pepe (PEPE)
- `shiba-inu` - Shiba Inu (SHIB)
- `chainlink` - Chainlink (LINK)
- `uniswap` - Uniswap (UNI)
- `aave` - Aave (AAVE)
- `compound` - Compound (COMP)
- `maker` - Maker (MKR)

## 🎯 **Next Steps**

1. **Test semua coin** yang Anda inginkan
2. **Customize UI** sesuai kebutuhan
3. **Add more features** seperti:
   - Price alerts
   - Portfolio tracking
   - Historical data
   - More exchange integrations

## 📞 **Support**

Jika ada masalah atau pertanyaan:
1. Cek console browser untuk error
2. Test API endpoints secara langsung
3. Pastikan server berjalan di `http://localhost:3000`
4. CoinGecko API documentation: https://www.coingecko.com/en/api

## 🔧 **Troubleshooting**

### **Common Issues:**
1. **API Error 429**: Rate limit exceeded - wait a few minutes
2. **No Data**: Coin ID tidak ditemukan - cek spelling
3. **Slow Response**: Network issue - refresh page

### **Solutions:**
1. **Use correct coin ID**: Always use lowercase (e.g., "bitcoin", not "Bitcoin")
2. **Check spelling**: Ensure exact coin name/symbol
3. **Wait for rate limit**: CoinGecko has generous limits but still has them

---

**🎉 Selamat! Sekarang aplikasi Anda menggunakan CoinGecko API yang reliable dan real-time untuk data market dari semua coin!** 