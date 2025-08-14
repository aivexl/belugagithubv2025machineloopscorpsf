// Simple performance cache utility
class PerformanceCache {
  constructor(maxSize = 100, defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Export singleton instance
export const performanceCache = new PerformanceCache();

// Utility function for cached fetch
export async function cachedFetch(url, options = {}, cacheTTL) {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = performanceCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Cache-Control': 'public, max-age=300',
        ...options.headers,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the result
    performanceCache.set(cacheKey, data, cacheTTL);
    
    return data;
  } catch (error) {
    console.error('Cached fetch error:', error);
    throw error;
  }
}

export default performanceCache;
