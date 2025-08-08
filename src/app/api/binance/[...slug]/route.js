export async function GET(request, { params }) {
  const { slug } = await params;
  const path = slug.join('/');
  
  try {
         const url = `https://api.binance.com/api/v3/${path}`;
     
     // Add query parameters from request
     const { searchParams } = new URL(request.url);
     const queryString = searchParams.toString();
     const fullUrl = queryString ? `${url}?${queryString}` : url;
         console.log('Binance API request:', fullUrl);
     
     const response = await fetch(fullUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DuniaCrypto/1.0'
      },
      next: { revalidate: 10 } // Cache for 10 seconds (real-time data)
    });

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Binance API response status:', response.status);
    
    return Response.json(data);
  } catch (error) {
    console.error('Binance API error:', error);
    return Response.json(
      { error: 'Failed to fetch Binance data', details: error.message },
      { status: 500 }
    );
  }
} 