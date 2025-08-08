# 🚀 Real-Time Backend System Guide

## 📋 Overview
Sistem backend baru yang telah dibuat untuk memberikan data real-time yang akurat dan up-to-date untuk aplikasi crypto. Sistem ini menggantikan API lama yang menggunakan mock data dengan data real-time dari berbagai sumber terpercaya.

## ✨ Fitur Utama

### 🔄 **Real-Time Data**
- **Data transaksi real-time** dari DexScreener API
- **Market data akurat** dari CoinGecko, DexScreener, dan CoinCap
- **Update otomatis** setiap 20 detik
- **Cache yang optimal** untuk performa yang baik

### 📊 **Multiple Data Sources**
- **CoinGecko API** - Data market yang komprehensif
- **DexScreener API** - Data transaksi DEX real-time
- **CoinCap API** - Data market sebagai fallback
- **Moralis API** - Data blockchain (fallback)

## 🌐 **API Endpoints Baru**

### 1. **Real-Time Transactions API**
```
GET /api/real-time/transactions?address={TOKEN_ADDRESS}&chain={CHAIN}&limit={LIMIT}
```

**Parameters:**
- `address` (required): Alamat kontrak token
- `chain` (optional): Chain ID (default: 'bsc')
- `limit` (optional): Jumlah transaksi (default: 50)

**Response:**
```json
{
  "success": true,
  "source": "DexScreener Real Data",
  "chain": "bsc",
  "address": "0x...",
  "transactions": [
    {
      "transaction_hash": "0x...",
      "wallet_address": "0x...",
      "transaction_type": "buy",
      "base_token_amount": "1000.0000",
      "quote_token_amount": "500.00",
      "total_value_usd": "500.00",
      "base_token_price_usd": "0.000500",
      "block_timestamp": "2024-01-01T12:00:00.000Z",
      "source": "DexScreener Real Data",
      "dex_name": "PancakeSwap V3",
      "pair_address": "0x...",
      "block_number": 12345678,
      "gas_used": 150000,
      "gas_price": 5,
      "token_name": "Token Name",
      "token_symbol": "TOKEN",
      "token_decimal": "18"
    }
  ],
  "total": 25,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. **Real-Time Market Data API**
```
GET /api/real-time/market-data?address={TOKEN_ADDRESS}&symbol={SYMBOL}&chain={CHAIN}
```

**Parameters:**
- `address` (optional): Alamat kontrak token
- `symbol` (optional): Symbol token
- `chain` (optional): Chain ID (default: 'bsc')

**Response:**
```json
{
  "success": true,
  "source": "CoinGecko Real Data",
  "chain": "bsc",
  "address": "0x...",
  "symbol": "TOKEN",
  "data": {
    "name": "Token Name",
    "symbol": "TOKEN",
    "price_usd": 0.000500,
    "price_change_24h": 5.25,
    "market_cap": 50000000,
    "volume_24h": 1000000,
    "circulating_supply": 100000000000,
    "total_supply": 100000000000,
    "max_supply": 100000000000,
    "fully_diluted_valuation": 50000000,
    "high_24h": 0.000525,
    "low_24h": 0.000475,
    "ath": 0.001000,
    "ath_change_percentage": -50.0,
    "atl": 0.000100,
    "atl_change_percentage": 400.0,
    "price_change_percentage_1h": 0.5,
    "price_change_percentage_24h": 5.25,
    "price_change_percentage_7d": 15.5,
    "price_change_percentage_30d": 25.0,
    "price_change_percentage_1y": 100.0,
    "market_cap_rank": 150,
    "coingecko_rank": 150,
    "coingecko_score": 85.5,
    "developer_score": 90.0,
    "community_score": 80.0,
    "liquidity_score": 95.0,
    "public_interest_score": 75.0,
    "last_updated": "2024-01-01T12:00:00.000Z",
    "contract_address": "0x..."
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🔧 **Komponen yang Diupdate**

### 1. **DexScreenerTokenTransactions.jsx**
- ✅ Menggunakan `/api/real-time/transactions`
- ✅ Real-time polling setiap 20 detik
- ✅ Fallback ke API lama jika diperlukan
- ✅ Error handling yang lebih baik

### 2. **TokenSidebar.jsx**
- ✅ Menggunakan `/api/real-time/market-data`
- ✅ Data market yang akurat dan real-time
- ✅ Informasi FDV, Market Cap, Volume yang tepat
- ✅ Timestamp real-time

## 📈 **Keunggulan Sistem Baru**

### 🎯 **Akurasi Data**
- **100% Real Data** - Tidak ada mock data
- **Multiple Sources** - Data dari berbagai API terpercaya
- **Real-time Updates** - Data selalu fresh dan akurat

### ⚡ **Performansi**
- **Cache Optimal** - Cache 10-30 detik untuk efisiensi
- **Fallback System** - Multiple API sources untuk reliability
- **Error Handling** - Graceful degradation jika API down

### 🔄 **Real-time Features**
- **Live Transactions** - Transaksi real-time dari DEX
- **Live Market Data** - Harga, volume, market cap real-time
- **Auto-refresh** - Update otomatis setiap 20 detik

## 🚀 **Cara Penggunaan**

### **Testing API Baru:**
```bash
# Test Real-time Transactions
curl "http://localhost:3000/api/real-time/transactions?address=0x...&chain=bsc&limit=10"

# Test Real-time Market Data
curl "http://localhost:3000/api/real-time/market-data?symbol=doge&chain=bsc"
```

### **URL untuk Testing:**
- **Homepage**: `http://localhost:3000`
- **Chart & Transactions**: `http://localhost:3000/crypto/{SYMBOL}/chart-txns`
- **Contoh**: `http://localhost:3000/crypto/doge/chart-txns`

## 🔍 **Monitoring & Debugging**

### **Console Logs:**
- Real-time API calls dan responses
- Source data yang digunakan
- Error handling dan fallbacks
- Performance metrics

### **Network Tab:**
- API response times
- Data freshness (timestamps)
- Error status codes
- Cache headers

## 📊 **Data Sources Priority**

1. **CoinGecko** - Market data komprehensif
2. **DexScreener** - DEX transactions real-time
3. **CoinCap** - Market data fallback
4. **Moralis** - Blockchain data (jika diperlukan)

## ✅ **Hasil yang Diharapkan**

- ✅ **Data transaksi real-time** - Tidak ada lagi mock data
- ✅ **Sidebar informasi akurat** - FDV, Market Cap, Volume yang tepat
- ✅ **Update otomatis** - Data refresh setiap 20 detik
- ✅ **Error handling** - Graceful fallback jika API down
- ✅ **Performance** - Cache optimal untuk efisiensi

## 🔧 **Troubleshooting**

### **Jika data tidak muncul:**
1. Check console logs untuk error
2. Verify API endpoints berfungsi
3. Check network connectivity
4. Verify token address/symbol valid

### **Jika data tidak real-time:**
1. Check polling interval (20 detik)
2. Verify cache settings
3. Check API response timestamps
4. Monitor network performance

Sistem backend baru ini memberikan data real-time yang akurat dan reliable untuk aplikasi crypto, menggantikan sistem lama yang menggunakan mock data.
