# Development Cache System untuk CoinGecko API

## 🎯 **Tujuan**
Mengurangi API calls ke CoinGecko menjadi **24 jam sekali** dalam development environment untuk menghemat quota API, sambil tetap mempertahankan data yang update dan presisi.

## 🏗️ **Arsitektur**

### **Dual Cache System**
```
Production:  API → In-Memory Cache (30s) → Component
Development: API → Dev Cache (24h) + In-Memory Cache (30s) → Component
```

### **Cache Layers**
1. **Dev Cache (Development Only)**
   - **Storage**: localStorage (browser) + file system (server)
   - **TTL**: 24 jam
   - **Scope**: Development environment saja

2. **In-Memory Cache (Always Active)**
   - **Storage**: Memory Map
   - **TTL**: 30 detik
   - **Scope**: Semua environment

## 📁 **File Structure**

```
src/
├── lib/
│   ├── devCache.js          # Server-side dev cache (Node.js)
│   └── devCacheClient.js    # Client-side dev cache (Browser)
├── components/
│   └── CoinGeckoContext.tsx # Enhanced context dengan dev cache
scripts/
└── dev-cache.js             # Management script
```

## 🚀 **Fitur Utama**

### **1. Automatic Cache Management**
- ✅ **Auto-enable** dalam development
- ✅ **Auto-disable** dalam production
- ✅ **Graceful fallback** jika cache gagal
- ✅ **Automatic cleanup** untuk expired entries

### **2. Smart Cache Strategy**
```javascript
// Cache hierarchy:
1. Dev Cache (24h) → jika ada dan valid
2. In-Memory Cache (30s) → jika dev cache miss
3. API Call → jika semua cache miss
```

### **3. Intelligent Update Intervals**
- **Development**: 5 menit (akan menggunakan cache)
- **Production**: 60 detik (langsung ke API)

## 🛠️ **Penggunaan**

### **Management Commands**
```bash
# Lihat informasi cache
npm run dev:cache:info

# Clear all cache
npm run dev:cache:clear

# Preload cache (optional)
npm run dev:cache:preload

# Help command
npm run dev:cache
```

### **Debug di Browser Console**
```javascript
// Lihat cache info
window.debugDevCache()

// Clear cache
window.clearDevCache()
```

## 📊 **Monitoring & Logging**

### **Console Output Example**
```
[DEV CACHE] Development cache system enabled
[DEV CACHE] Using 24h cache for /api/v3/coins/markets... (45 minutes old)
[COINGECKO] Update interval: 5 minutes (dev with cache)
[API CALL] Fetching /api/v3/global
[DEV CACHE] Cached data for /api/v3/global (valid for 24 hours)
```

### **Cache Info Output**
```bash
$ npm run dev:cache:info

🔍 Development Cache Information
================================
Cache file: .cache/coingecko-dev-cache.json
Total entries: 2
File size: 15.32 KB

📊 Cache Entries:
  /api/v3/coins/markets...: ✅ Valid (2.5h old, expires in 21.5h)
  /api/v3/global: ✅ Valid (2.5h old, expires in 21.5h)
```

## ⚡ **Performance Benefits**

### **API Call Reduction**
- **Before**: ~1440 calls/day (60s interval)
- **After**: ~1-2 calls/day (24h cache)
- **Savings**: **99.9%** reduction dalam development

### **Development Speed**
- **First load**: Normal API call
- **Subsequent loads**: Instant dari cache
- **Page refresh**: Instant dari cache
- **Component remount**: Instant dari cache

## 🔧 **Technical Details**

### **Cache Storage**
```javascript
// Browser localStorage format
{
  "coingecko-dev-cache": {
    "/api/v3/coins/markets...": {
      "data": [...], 
      "timestamp": 1703123456789
    },
    "/api/v3/global": {
      "data": {...}, 
      "timestamp": 1703123456789
    }
  }
}
```

### **Environment Detection**
```javascript
// Hanya aktif dalam development
if (process.env.NODE_ENV === 'development') {
  // Enable dev cache
}
```

### **Error Handling**
- ✅ **Graceful degradation** jika cache gagal
- ✅ **Automatic fallback** ke in-memory cache
- ✅ **Preserve existing functionality** sepenuhnya
- ✅ **No breaking changes** sama sekali

## 🎯 **Cache Strategy Logic**

### **cachedFetch Flow**
```javascript
async function cachedFetch(url) {
  // 1. Try dev cache (24h) - development only
  if (development && devCache.has(url) && !expired) {
    return devCache.get(url)
  }
  
  // 2. Try in-memory cache (30s) - always
  if (memoryCache.has(url) && !expired) {
    return memoryCache.get(url)
  }
  
  // 3. Fetch from API
  const data = await fetch(url)
  
  // 4. Store in both caches
  devCache.set(url, data)      // 24h (dev only)
  memoryCache.set(url, data)   // 30s (always)
  
  return data
}
```

## 📈 **Data Freshness Strategy**

### **24 Hour Window**
- **Hour 0-23**: Cache valid, no API calls
- **Hour 24+**: Cache expired, fresh API call
- **Auto cleanup**: Expired entries dihapus otomatis

### **Component Behavior**
- **Initial render**: Data dari cache (jika ada)
- **Background refresh**: Setiap 5 menit cek cache
- **User refresh**: Manual refresh tetap bisa dengan `refresh()` function

## 🔄 **Migration & Compatibility**

### **Zero Breaking Changes**
- ✅ **Existing API**: Tetap sama persis
- ✅ **Props/Context**: Tidak ada perubahan
- ✅ **Production**: Behavior identik
- ✅ **Fallback**: Otomatis ke sistem lama jika error

### **Backward Compatibility**
```javascript
// Existing code tetap bekerja 100%
const { coins, global, loading, error, refresh } = useCoinGecko()
```

## 🎛️ **Configuration Options**

### **Customize TTL** (jika diperlukan)
```javascript
// devCacheClient.js
const DEV_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Untuk testing, bisa diperkecil:
const DEV_CACHE_TTL = 60 * 1000; // 1 minute
```

### **Customize Update Interval**
```javascript
// CoinGeckoContext.tsx
const intervalTime = isDev 
  ? 5 * 60 * 1000   // 5 minutes (customizable)
  : 60 * 1000;      // 60 seconds
```

## 🧪 **Testing & Validation**

### **Test Cache System**
```bash
# 1. Start development server
npm run dev

# 2. Check cache info
npm run dev:cache:info

# 3. Visit localhost:3000
# 4. Check console for cache logs
# 5. Refresh page - should use cache
# 6. Check cache info again
npm run dev:cache:info
```

### **Test Fallback**
```bash
# Clear cache and test fallback
npm run dev:cache:clear
```

## 📋 **Maintenance**

### **Regular Cleanup**
Cache akan auto-cleanup expired entries, tapi manual cleanup bisa dilakukan:
```bash
npm run dev:cache:clear
```

### **Storage Size**
- **Typical size**: 10-20 KB per endpoint
- **Total size**: ~50 KB untuk semua endpoints
- **Browser limit**: localStorage ~5MB (sangat aman)

## 🎉 **Result**

### **Development Experience**
- ✅ **99.9% API call reduction**
- ✅ **Instant loading** setelah first call
- ✅ **Zero configuration** needed
- ✅ **Automatic management**
- ✅ **Perfect fallback**
- ✅ **No breaking changes**

### **Production Impact**
- ✅ **Zero impact** pada production
- ✅ **Same performance** characteristics  
- ✅ **Same API behavior**
- ✅ **Same error handling**

---

**Sistem ini memberikan development experience yang optimal sambil menghemat API quota secara dramatis tanpa mengorbankan functionality atau reliability!**








