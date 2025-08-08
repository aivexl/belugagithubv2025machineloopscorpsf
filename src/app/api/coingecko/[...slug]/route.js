// Simple in-memory cache for rate limiting
const rateLimitCache = new Map();
const CACHE_DURATION = 60000; // 1 minute cache
const RATE_LIMIT_WINDOW = 60000; // 1 minute rate limit window
const MAX_REQUESTS_PER_WINDOW = 300; // CoinGecko Pro tier limit (with API key)

// CoinGecko API Key
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || 'CG-jrJUt1cGARECPAnb9TUeCdqE';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { slug = [] } = resolvedParams;
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString() ? '?' + searchParams.toString() : '';
    const coingeckoPath = '/' + slug.join('/') + queryString;
    const apiUrl = `https://api.coingecko.com${coingeckoPath}`;

    // Add API key to the URL if it's not already present
    const urlWithKey = apiUrl.includes('?') 
      ? `${apiUrl}&x_cg_demo_api_key=${COINGECKO_API_KEY}`
      : `${apiUrl}?x_cg_demo_api_key=${COINGECKO_API_KEY}`;
    
    console.log('Making request to:', urlWithKey);
    
    const response = await fetch(urlWithKey, {
      method: 'GET',
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: `CoinGecko API error: ${response.status}`,
        detail: `Request to ${coingeckoPath} failed with status ${response.status}`
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
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
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      });
    } else {
      const text = await response.text();
      return new Response(text, {
        status: 200,
        headers: {
          'Content-Type': contentType || 'text/plain',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      });
    }
  } catch (error) {
    console.error('CoinGecko Proxy Error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Proxy error', 
      detail: error.message,
      path: params?.slug?.join('/') || 'unknown'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 