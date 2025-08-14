// Simple in-memory cache for rate limiting
const rateLimitCache = new Map();
const CACHE_DURATION = 60000; // 1 minute cache
const RATE_LIMIT_WINDOW = 60000; // 1 minute rate limit window
const MAX_REQUESTS_PER_WINDOW = 300; // CoinGecko Pro tier limit (with API key)

// CoinGecko API Key
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || 'CG-jrJUt1cGARECPAnb9TUeCdqE';

export async function GET(request, { params }) {
  try {
    // Properly await params to fix Next.js 15 requirement
    const resolvedParams = await params;
    const { slug = [] } = resolvedParams;
    const { searchParams } = new URL(request.url);
    
    // Build path
    const queryString = searchParams.toString() ? '?' + searchParams.toString() : '';
    const coingeckoPath = '/' + slug.join('/') + queryString;
    const apiUrl = `https://api.coingecko.com${coingeckoPath}`;

    // Add API key to the URL if it's not already present
    const urlWithKey = apiUrl.includes('?') 
      ? `${apiUrl}&x_cg_demo_api_key=${COINGECKO_API_KEY}`
      : `${apiUrl}?x_cg_demo_api_key=${COINGECKO_API_KEY}`;
    
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Making request to:', urlWithKey);
    }
    
    // Create abort controller for better timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
    
    try {
      const response = await fetch(urlWithKey, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Beluga-Crypto-Dashboard/1.0',
          'Accept': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      // Only log status in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Response status:', response.status);
      }
      
      if (!response.ok) {
        return new Response(JSON.stringify({ 
          error: `CoinGecko API error: ${response.status}`,
          detail: `Request to ${coingeckoPath} failed with status ${response.status}`,
          path: slug.join('/')
        }), {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });
      }
      
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=30, s-maxage=30', // Reduced cache time
            'Access-Control-Allow-Origin': '*',
          },
        });
      } else {
        const text = await response.text();
        return new Response(text, {
          status: 200,
          headers: {
            'Content-Type': contentType || 'text/plain',
            'Cache-Control': 'public, max-age=30, s-maxage=30',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        if (process.env.NODE_ENV === 'development') {
          console.error('Request timeout for:', coingeckoPath);
        }
        return new Response(JSON.stringify({ 
          error: 'Request timeout', 
          detail: 'The request took too long to complete',
          path: slug.join('/'),
          timeout: '10s'
        }), {
          status: 408,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      throw fetchError; // Re-throw other fetch errors
    }
    
  } catch (error) {
    // Always log errors for debugging
    console.error('CoinGecko Proxy Error:', error);
    
    // Safe parameter access
    let pathInfo = 'unknown';
    try {
      const resolvedParams = await params;
      pathInfo = resolvedParams?.slug?.join('/') || 'unknown';
    } catch (e) {
      console.warn('Could not resolve params for error response');
    }
    
    return new Response(JSON.stringify({ 
      error: 'Proxy error', 
      detail: error.message,
      path: pathInfo,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  }
} 