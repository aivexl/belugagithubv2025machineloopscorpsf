export async function GET(request, { params }) {
  const { slug } = await params;
  const path = slug.join('/');
  
  try {
    // Multiple API sources for better reliability
    const apis = [
      {
        name: 'CoinGecko',
        url: `https://api.coingecko.com/api/v3/${path}`,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DuniaCrypto/1.0'
        }
      },
      {
        name: 'CoinCap',
        url: `https://api.coincap.io/v2/${path}`,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DuniaCrypto/1.0'
        }
      },
      {
        name: 'CoinMarketCap',
        url: `https://pro-api.coinmarketcap.com/v1/${path}`,
        headers: {
          'Accept': 'application/json',
          'X-CMC_PRO_API_KEY': 'demo-key' // Free demo key
        }
      }
    ];

    // Try each API until one works
    for (const api of apis) {
      try {
        console.log(`Trying ${api.name} API:`, api.url);
        
        const response = await fetch(api.url, {
          headers: api.headers,
          next: { revalidate: 30 }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`${api.name} API response status:`, response.status);
          return Response.json({ ...data, source: api.name });
        }
      } catch (error) {
        console.log(`${api.name} API failed:`, error.message);
        continue;
      }
    }

    throw new Error('All APIs failed');
  } catch (error) {
    console.error('Crypto APIs error:', error);
    return Response.json(
      { error: 'Failed to fetch crypto data', details: error.message },
      { status: 500 }
    );
  }
} 