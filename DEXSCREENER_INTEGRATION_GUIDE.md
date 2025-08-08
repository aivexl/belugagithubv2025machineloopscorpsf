# 🚀 DexScreener Integration Guide

## 📋 Overview
Aplikasi sekarang menggunakan **DexScreener API** untuk mendapatkan data transaksi real-time dari semua coin yang ada di DEX exchanges, tanpa perlu mapping yang sudah didefinisikan sebelumnya.

## ✨ Fitur Utama

### 🔍 **Support Semua Coin**
- **Tidak perlu mapping** - Bisa mencari data untuk coin apapun
- **Real-time data** dari DEX exchanges
- **Multi-chain support** (Ethereum, BSC, Polygon, Solana, dll)
- **Auto-detect network** berdasarkan data dari DexScreener

### 📊 **Data yang Tersedia**
- **Trading pairs** dengan liquidity tertinggi
- **Recent transactions** real-time
- **Price data** dan volume
- **Wallet addresses** dengan link ke blockchain explorer

## 🌐 **API Endpoints**

### 1. **Search Pairs by Symbol**
```
GET /api/dexscreener/pairs-by-symbol?symbol={SYMBOL}&chain={CHAIN}&limit={LIMIT}
```

**Parameters:**
- `symbol` (required): Symbol coin (e.g., "pepe", "shib", "wif")
- `chain` (optional): Filter by chain (e.g., "ethereum", "bsc", "solana")
- `limit` (optional): Number of pairs to return (default: 20)

**Example:**
```bash
curl "http://localhost:3000/api/dexscreener/pairs-by-symbol?symbol=pepe&limit=5"
```

### 2. **Get Transactions by Pair**
```
GET /api/dexscreener/transactions?pairAddress={PAIR_ADDRESS}&limit={LIMIT}
```

**Parameters:**
- `pairAddress` (required): Address dari trading pair
- `limit` (optional): Number of transactions (default: 50)

## 🎯 **Cara Penggunaan**

### **URL untuk Testing:**
- **Homepage**: `http://localhost:3000`
- **Chart & Transactions**: `http://localhost:3000/crypto/{SYMBOL}/chart-txns`

### **Contoh URL:**
- `http://localhost:3000/crypto/pepe/chart-txns`
- `http://localhost:3000/crypto/shib/chart-txns`
- `http://localhost:3000/crypto/wif/chart-txns`
- `http://localhost:3000/crypto/bonk/chart-txns`
- `http://localhost:3000/crypto/floki/chart-txns`

## 🔧 **Komponen yang Diupdate**

### 1. **`useDexScreenerData.js`**
- Hook baru untuk fetch data dari DexScreener
- Support semua coin tanpa mapping
- Auto-detect network dan contract address

### 2. **`DexScreenerTransactionTable.jsx`**
- Table untuk menampilkan transaksi
- Support multi-chain explorers
- Sorting dan pagination
- Real-time data formatting

### 3. **`ResizableChartTxnsLayout.jsx`**
- Layout chart dan transaksi dalam satu halaman
- Divider yang bisa di-resize
- Header dengan informasi coin

## 📈 **Data yang Ditampilkan**

### **Transaction Table Columns:**
1. **Time** - Waktu transaksi (relative)
2. **Type** - Jenis transaksi (buy/sell/swap)
3. **Amount In** - Jumlah token yang diinput
4. **Amount Out** - Jumlah token yang dioutput
5. **Value USD** - Nilai transaksi dalam USD
6. **Wallet** - Address wallet (dengan link ke explorer)

### **Transaction Stats:**
- Total Transactions
- Network (auto-detected)
- Token Symbol
- Data Source (DexScreener)

## 🌍 **Supported Chains**

### **EVM Chains:**
- **Ethereum** - etherscan.io
- **BSC** - bscscan.com
- **Polygon** - polygonscan.com
- **Avalanche** - snowtrace.io
- **Fantom** - ftmscan.com
- **Arbitrum** - arbiscan.io
- **Optimism** - optimistic.etherscan.io
- **Base** - basescan.org

### **Non-EVM:**
- **Solana** - solscan.io

## 🎨 **UI Features**

### **Resizable Layout:**
- Chart dan transaksi dalam satu halaman
- Divider yang bisa digeser (20%-80% chart height)
- Responsive design

### **Interactive Elements:**
- Sortable table columns
- Clickable wallet addresses
- Load more transactions
- Real-time data updates

## 🚀 **Keunggulan vs Moralis**

| Feature | DexScreener | Moralis |
|---------|-------------|---------|
| **API Key** | ❌ Tidak perlu | ✅ Diperlukan |
| **Rate Limit** | ❌ Unlimited | ✅ Terbatas |
| **Data Source** | ✅ DEX Real-time | ⚠️ Blockchain nodes |
| **Multi-chain** | ✅ Otomatis | ⚠️ Manual setup |
| **Cost** | ✅ Gratis | 💰 Berbayar |
| **Setup** | ✅ Simple | ⚠️ Complex |

## 🔍 **Testing Examples**

### **Test dengan berbagai token:**
```bash
# Popular tokens
curl "http://localhost:3000/api/dexscreener/pairs-by-symbol?symbol=pepe&limit=3"
curl "http://localhost:3000/api/dexscreener/pairs-by-symbol?symbol=shib&limit=3"
curl "http://localhost:3000/api/dexscreener/pairs-by-symbol?symbol=wif&limit=3"

# New tokens
curl "http://localhost:3000/api/dexscreener/pairs-by-symbol?symbol=bonk&limit=3"
curl "http://localhost:3000/api/dexscreener/pairs-by-symbol?symbol=floki&limit=3"

# Filter by chain
curl "http://localhost:3000/api/dexscreener/pairs-by-symbol?symbol=pepe&chain=solana&limit=3"
```

## 🎯 **Next Steps**

1. **Test semua token** yang Anda inginkan
2. **Customize UI** sesuai kebutuhan
3. **Add more features** seperti:
   - Price alerts
   - Portfolio tracking
   - Historical data
   - More DEX integrations

## 📞 **Support**

Jika ada masalah atau pertanyaan:
1. Cek console browser untuk error
2. Test API endpoints secara langsung
3. Pastikan server berjalan di `http://localhost:3000`

---

**🎉 Selamat! Sekarang aplikasi Anda bisa menampilkan data transaksi untuk SEMUA coin dari DexScreener!** 