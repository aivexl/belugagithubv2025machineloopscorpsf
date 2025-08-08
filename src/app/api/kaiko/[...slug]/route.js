// Kaiko API Proxy
const KAIKO_API_KEY = process.env.KAIKO_API_KEY || 'YOUR_KAIKO_API_KEY';
const KAIKO_BASE_URL = 'https://us.market-api.kaiko.io/v2';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { slug = [] } = resolvedParams;
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString() ? '?' + searchParams.toString() : '';
  const kaikoPath = '/' + slug.join('/') + queryString;
  const apiUrl = `${KAIKO_BASE_URL}${kaikoPath}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-API-KEY': KAIKO_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
    });

    if (!response.ok) {
      if (response.status === 401) {
        return new Response(JSON.stringify({ 
          error: 'Unauthorized - Invalid Kaiko API key',
          detail: 'Please check your Kaiko API key configuration'
        }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded',
          detail: 'Too many requests to Kaiko API. Please wait before trying again.'
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      throw new Error(`Kaiko API error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=60', // 1 minute cache
      },
    });

  } catch (error) {
    console.error('Kaiko Proxy Error:', error);
    
    if (error.name === 'AbortError') {
      return new Response(JSON.stringify({ 
        error: 'Request timeout - Kaiko API took too long to respond',
        detail: error.message 
      }), {
        status: 408,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Proxy error', 
      detail: error.message,
      note: 'Using mock data for demo purposes'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 