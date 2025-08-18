import { getFallbackArticles } from '../../lib/sanityFallbackData';

// Create a custom client that uses our API route
interface SanityClient {
  fetch: (query: string, params?: Record<string, unknown>) => Promise<unknown>;
}

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const customClient: SanityClient = {
  fetch: async (query: string, params?: Record<string, unknown>) => {
    // Create cache key
    const cacheKey = `${query}-${JSON.stringify(params || {})}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    
    if (params) {
      queryParams.append('params', JSON.stringify(params));
    }
    
    try {
      const response = await fetch(`/api/sanity/query?${queryParams.toString()}`, {
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store in cache
      cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.warn('Sanity API failed, using fallback data:', error);
      
      // Extract category from query to provide appropriate fallback
      let category = 'academy'; // default
      if (params && typeof params === 'object' && 'category' in params) {
        category = params.category as string;
      }
      
      // Return fallback data
      const fallbackData = getFallbackArticles(category);
      
      // Store fallback data in cache to prevent repeated API calls
      cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
      
      return fallbackData;
    }
  }
};

export const client = customClient;
