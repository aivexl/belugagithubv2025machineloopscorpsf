// Client-side Development Cache System untuk CoinGecko API
// Menggunakan localStorage untuk menyimpan cache 24 jam

const DEV_CACHE_KEY = 'coingecko-dev-cache';
const DEV_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 jam dalam milliseconds

// Check if cache is valid (within 24 hours)
function isCacheValid(timestamp) {
  if (!timestamp) return false;
  return (Date.now() - timestamp) < DEV_CACHE_TTL;
}

// Get cached data if valid
export async function getDevCache(key) {
  // Only use dev cache in development environment
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return null;
  }

  try {
    const cacheStr = localStorage.getItem(DEV_CACHE_KEY);
    if (!cacheStr) {
      return null;
    }

    const cache = JSON.parse(cacheStr);
    if (!cache[key]) {
      return null;
    }

    const { data, timestamp } = cache[key];
    
    if (isCacheValid(timestamp)) {
      const ageMinutes = Math.round((Date.now() - timestamp) / (1000 * 60));
      console.log(`[DEV CACHE] Using 24h cache for ${key} (${ageMinutes} minutes old)`);
      return data;
    } else {
      const ageHours = Math.round((Date.now() - timestamp) / (1000 * 60 * 60));
      console.log(`[DEV CACHE] Cache expired for ${key} (${ageHours} hours old)`);
      
      // Clean up expired entry
      delete cache[key];
      localStorage.setItem(DEV_CACHE_KEY, JSON.stringify(cache));
      
      return null;
    }
  } catch (error) {
    console.warn('[DEV CACHE] Error reading cache:', error.message);
    return null;
  }
}

// Set cache data
export async function setDevCache(key, data) {
  // Only use dev cache in development environment
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return;
  }

  try {
    let cache = {};
    
    const cacheStr = localStorage.getItem(DEV_CACHE_KEY);
    if (cacheStr) {
      cache = JSON.parse(cacheStr);
    }
    
    cache[key] = {
      data,
      timestamp: Date.now()
    };

    localStorage.setItem(DEV_CACHE_KEY, JSON.stringify(cache));
    console.log(`[DEV CACHE] Cached data for ${key} (valid for 24 hours)`);
  } catch (error) {
    console.warn('[DEV CACHE] Error writing cache:', error.message);
  }
}

// Clear specific cache entry
export async function clearDevCache(key) {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return;
  }

  try {
    const cacheStr = localStorage.getItem(DEV_CACHE_KEY);
    if (!cacheStr) return;

    const cache = JSON.parse(cacheStr);
    delete cache[key];
    localStorage.setItem(DEV_CACHE_KEY, JSON.stringify(cache));
    console.log(`[DEV CACHE] Cleared cache for ${key}`);
  } catch (error) {
    console.warn('[DEV CACHE] Error clearing cache:', error.message);
  }
}

// Clear all cache
export async function clearAllDevCache() {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(DEV_CACHE_KEY);
    console.log('[DEV CACHE] Cleared all cache');
  } catch (error) {
    console.warn('[DEV CACHE] Error clearing all cache:', error.message);
  }
}

// Get cache info for debugging
export async function getDevCacheInfo() {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return { enabled: false };
  }

  try {
    const cacheStr = localStorage.getItem(DEV_CACHE_KEY);
    if (!cacheStr) {
      return { enabled: true, entries: 0, keys: [] };
    }

    const cache = JSON.parse(cacheStr);
    const keys = Object.keys(cache);
    const entries = keys.map(key => {
      const { timestamp } = cache[key];
      const ageHours = Math.round((Date.now() - timestamp) / (1000 * 60 * 60) * 10) / 10;
      const isValid = isCacheValid(timestamp);
      
      return {
        key,
        ageHours,
        isValid,
        expiresIn: isValid ? Math.round((DEV_CACHE_TTL - (Date.now() - timestamp)) / (1000 * 60 * 60) * 10) / 10 : 0
      };
    });

    return {
      enabled: true,
      entries: keys.length,
      keys,
      details: entries,
      totalSize: new Blob([cacheStr]).size
    };
  } catch (error) {
    return { enabled: true, error: error.message };
  }
}

// Debug function untuk console
export function debugDevCache() {
  if (typeof window === 'undefined') {
    console.log('Dev cache only available in browser');
    return;
  }
  
  getDevCacheInfo().then(info => {
    console.table(info.details || []);
    console.log('Cache Info:', info);
  });
}

// Add to window for easy debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.debugDevCache = debugDevCache;
  window.clearDevCache = clearAllDevCache;
}

