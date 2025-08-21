#!/usr/bin/env node
// Development Cache Management Script
// Usage: npm run dev:cache [info|clear|clear-all]

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, '..', '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'coingecko-dev-cache.json');
const DEV_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 jam

function isCacheValid(timestamp) {
  if (!timestamp) return false;
  return (Date.now() - timestamp) < DEV_CACHE_TTL;
}

async function getCacheInfo() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    const cache = JSON.parse(data);
    const keys = Object.keys(cache);
    
    console.log('🔍 Development Cache Information');
    console.log('================================');
    console.log(`Cache file: ${CACHE_FILE}`);
    console.log(`Total entries: ${keys.length}`);
    console.log(`File size: ${(Buffer.byteLength(data, 'utf8') / 1024).toFixed(2)} KB`);
    console.log('');
    
    if (keys.length > 0) {
      console.log('📊 Cache Entries:');
      keys.forEach(key => {
        const { timestamp } = cache[key];
        const ageHours = Math.round((Date.now() - timestamp) / (1000 * 60 * 60) * 10) / 10;
        const isValid = isCacheValid(timestamp);
        const status = isValid ? '✅ Valid' : '❌ Expired';
        const expiresIn = isValid ? Math.round((DEV_CACHE_TTL - (Date.now() - timestamp)) / (1000 * 60 * 60) * 10) / 10 : 0;
        
        console.log(`  ${key}: ${status} (${ageHours}h old${isValid ? `, expires in ${expiresIn}h` : ''})`);
      });
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📦 No cache file found. Cache will be created on first API call.');
    } else {
      console.error('❌ Error reading cache:', error.message);
    }
  }
}

async function clearSpecificCache(key) {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    const cache = JSON.parse(data);
    
    if (cache[key]) {
      delete cache[key];
      await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
      console.log(`✅ Cleared cache for: ${key}`);
    } else {
      console.log(`⚠️  No cache found for: ${key}`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📦 No cache file found.');
    } else {
      console.error('❌ Error clearing cache:', error.message);
    }
  }
}

async function clearAllCache() {
  try {
    await fs.unlink(CACHE_FILE);
    console.log('🗑️  All cache cleared successfully');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📦 No cache file to clear.');
    } else {
      console.error('❌ Error clearing cache:', error.message);
    }
  }
}

async function preloadCache() {
  console.log('🚀 Preloading development cache...');
  
  try {
    // Simulate API calls to preload cache
    const endpoints = [
      '/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false',
      '/api/v3/global'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:3000/api/coingecko${endpoint}`);
        if (response.ok) {
          console.log(`✅ Preloaded: ${endpoint}`);
        } else {
          console.log(`⚠️  Failed to preload: ${endpoint} (${response.status})`);
        }
      } catch (error) {
        console.log(`❌ Error preloading ${endpoint}:`, error.message);
      }
    }
    
    console.log('🎉 Preloading completed');
  } catch (error) {
    console.error('❌ Preloading failed:', error.message);
  }
}

// Main script logic
const command = process.argv[2] || 'info';

switch (command) {
  case 'info':
    await getCacheInfo();
    break;
    
  case 'clear':
    const key = process.argv[3];
    if (key) {
      await clearSpecificCache(key);
    } else {
      console.log('Usage: npm run dev:cache clear <key>');
      console.log('Available keys:');
      console.log('  /api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      console.log('  /api/v3/global');
    }
    break;
    
  case 'clear-all':
    await clearAllCache();
    break;
    
  case 'preload':
    await preloadCache();
    break;
    
  default:
    console.log('🛠️  Development Cache Management');
    console.log('');
    console.log('Usage: npm run dev:cache [command]');
    console.log('');
    console.log('Commands:');
    console.log('  info      Show cache information (default)');
    console.log('  clear     Clear specific cache entry');
    console.log('  clear-all Clear all cache');
    console.log('  preload   Preload cache by making API calls');
    console.log('');
    console.log('Examples:');
    console.log('  npm run dev:cache info');
    console.log('  npm run dev:cache clear-all');
    console.log('  npm run dev:cache preload');
    break;
}












