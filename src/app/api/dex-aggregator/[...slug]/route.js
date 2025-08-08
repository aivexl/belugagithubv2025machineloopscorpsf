export async function GET(request, { params }) {
  const { slug } = await params;
  const path = slug.join('/');
  
  try {
    // Multiple DEX API sources
    const dexApis = [
      {
        name: 'DexScreener',
        url: `https://api.dexscreener.com/latest/dex/${path}`,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DuniaCrypto/1.0'
        }
      },
      {
        name: '1inch',
        url: `https://api.1inch.dev/swap/v5.2/1/${path}`,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer demo-key' // Free demo key
        }
      },
      {
        name: 'Uniswap',
        url: `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`,
        method: 'POST',
        body: JSON.stringify({
          query: `{
            swaps(first: 10, orderBy: timestamp, orderDirection: desc) {
              id
              timestamp
              amount0
              amount1
              amountUSD
              token0 { symbol }
              token1 { symbol }
            }
          }`
        })
      }
    ];

    // Try each DEX API until one works
    for (const api of dexApis) {
      try {
        console.log(`Trying ${api.name} DEX API:`, api.url);
        
        const options = {
          headers: api.headers,
          next: { revalidate: 30 }
        };

        if (api.method === 'POST' && api.body) {
          options.method = 'POST';
          options.body = api.body;
        }

        const response = await fetch(api.url, options);

        if (response.ok) {
          const data = await response.json();
          console.log(`${api.name} DEX API response status:`, response.status);
          return Response.json({ ...data, source: api.name });
        }
      } catch (error) {
        console.log(`${api.name} DEX API failed:`, error.message);
        continue;
      }
    }

    throw new Error('All DEX APIs failed');
  } catch (error) {
    console.error('DEX APIs error:', error);
    return Response.json(
      { error: 'Failed to fetch DEX data', details: error.message },
      { status: 500 }
    );
  }
} 