export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const path = slug.join('/');
    
    console.log('DexScreener API request path:', path);
    
    const url = `https://api.dexscreener.com/latest/dex/${path}`;
    console.log('DexScreener API request URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DuniaCrypto/1.0'
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    console.log('DexScreener API response status:', response.status);

    if (!response.ok) {
      console.error(`DexScreener API error: ${response.status} ${response.statusText}`);
      return Response.json(
        { 
          error: 'DexScreener API error', 
          status: response.status,
          statusText: response.statusText,
          url: url
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('DexScreener API response data keys:', Object.keys(data));
    
    return Response.json(data);
  } catch (error) {
    console.error('DexScreener API error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      params: params
    });
    return Response.json(
      { 
        error: 'Failed to fetch DexScreener data', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 