// Development Cache System untuk CoinGecko API
// Mengurangi API calls menjadi 24 jam sekali dalam development

import { promises as fs } from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'coingecko-dev-cache.json');
const DEV_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 jam dalam milliseconds

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

// Read cache from file
async function readCache() {
  try {
    await ensureCacheDir();
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Cache file doesn't exist or is corrupted
    return null;
  }
}

// Write cache to file
async function writeCache(data) {
  try {
    await ensureCacheDir();
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.warn('Failed to write dev cache:', error.message);
  }
}

// Check if cache is valid (within 24 hours)
function isCacheValid(timestamp) {
  if (!timestamp) return false;
  return (Date.now() - timestamp) < DEV_CACHE_TTL;
}

// Get cached data if valid
export async function getDevCache(key) {
  // Only use dev cache in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  try {
    const cache = await readCache();
    if (!cache || !cache[key]) {
      return null;
    }

    const { data, timestamp } = cache[key];
    
    if (isCacheValid(timestamp)) {
      console.log(`[DEV CACHE] Using 24h cache for ${key} (${Math.round((Date.now() - timestamp) / (1000 * 60))} minutes old)`);
      return data;
    } else {
      console.log(`[DEV CACHE] Cache expired for ${key} (${Math.round((Date.now() - timestamp) / (1000 * 60 * 60))} hours old)`);
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
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  try {
    let cache = await readCache() || {};
    
    cache[key] = {
      data,
      timestamp: Date.now()
    };

    await writeCache(cache);
    console.log(`[DEV CACHE] Cached data for ${key} (valid for 24 hours)`);
  } catch (error) {
    console.warn('[DEV CACHE] Error writing cache:', error.message);
  }
}

// Clear specific cache entry
export async function clearDevCache(key) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  try {
    let cache = await readCache() || {};
    delete cache[key];
    await writeCache(cache);
    console.log(`[DEV CACHE] Cleared cache for ${key}`);
  } catch (error) {
    console.warn('[DEV CACHE] Error clearing cache:', error.message);
  }
}

// Clear all cache
export async function clearAllDevCache() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  try {
    await fs.unlink(CACHE_FILE);
    console.log('[DEV CACHE] Cleared all cache');
  } catch (error) {
    // File doesn't exist, that's fine
  }
}

// Get cache info for debugging
export async function getDevCacheInfo() {
  if (process.env.NODE_ENV !== 'development') {
    return { enabled: false };
  }

  try {
    const cache = await readCache();
    if (!cache) {
      return { enabled: true, entries: 0, keys: [] };
    }

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
      details: entries
    };
  } catch (error) {
    return { enabled: true, error: error.message };
  }
}

