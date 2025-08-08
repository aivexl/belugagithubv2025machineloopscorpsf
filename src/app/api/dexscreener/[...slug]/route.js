export async function GET(request, { params }) {
  const { slug } = await params;
  const path = slug.join('/');
  
  try {
    const url = `https://api.dexscreener.com/latest/dex/${path}`;
    console.log('DexScreener API request:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DuniaCrypto/1.0'
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('DexScreener API response status:', response.status);
    
    return Response.json(data);
  } catch (error) {
    console.error('DexScreener API error:', error);
    return Response.json(
      { error: 'Failed to fetch DexScreener data', details: error.message },
      { status: 500 }
    );
  }
} 