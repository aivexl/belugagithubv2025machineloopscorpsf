export async function GET(request, { params }) {
  const { slug } = await params;
  const path = slug.join('/');
  
  try {
    // Multiple CEX API sources
    const cexApis = [
      {
        name: 'Binance',
        url: `https://api.binance.com/api/v3/${path}`,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DuniaCrypto/1.0'
        }
      },
      {
        name: 'Coinbase',
        url: `https://api.coinbase.com/v2/${path}`,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DuniaCrypto/1.0'
        }
      },
      {
        name: 'Kraken',
        url: `https://api.kraken.com/0/public/${path}`,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DuniaCrypto/1.0'
        }
      },
      {
        name: 'KuCoin',
        url: `https://api.kucoin.com/api/v1/${path}`,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DuniaCrypto/1.0'
        }
      },
      {
        name: 'OKX',
        url: `https://www.okx.com/api/v5/${path}`,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DuniaCrypto/1.0'
        }
      }
    ];

    // Try each CEX API until one works
    for (const api of cexApis) {
      try {
        console.log(`Trying ${api.name} CEX API:`, api.url);
        
        const response = await fetch(api.url, {
          headers: api.headers,
          next: { revalidate: 10 } // Real-time data
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`${api.name} CEX API response status:`, response.status);
          return Response.json({ ...data, source: api.name });
        }
      } catch (error) {
        console.log(`${api.name} CEX API failed:`, error.message);
        continue;
      }
    }

    throw new Error('All CEX APIs failed');
  } catch (error) {
    console.error('CEX APIs error:', error);
    return Response.json(
      { error: 'Failed to fetch CEX data', details: error.message },
      { status: 500 }
    );
  }
} 