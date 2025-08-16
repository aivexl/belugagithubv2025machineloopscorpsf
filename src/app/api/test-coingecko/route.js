import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = 'CG-1NBArXikTdDPy9GPrpUyEmwt';
    
    console.log(`[TEST] Testing CoinGecko API key: ${apiKey.substring(0, 8)}...`);
    
    // Test 1: Ping endpoint (no auth required)
    console.log('[TEST] Testing ping endpoint...');
    const pingResponse = await fetch('https://api.coingecko.com/api/v3/ping');
    const pingData = await pingResponse.text();
    console.log(`[TEST] Ping response: ${pingResponse.status} - ${pingData}`);
    
    // Test 2: Simple endpoint with API key
    console.log('[TEST] Testing simple endpoint with API key...');
    const simpleResponse = await fetch('https://api.coingecko.com/api/v3/global', {
      headers: {
        'X-CG-Demo-API-Key': apiKey,
        'Accept': 'application/json'
      }
    });
    console.log(`[TEST] Simple endpoint response: ${simpleResponse.status} ${simpleResponse.statusText}`);
    
    // Test 3: Market chart endpoint (the one that's failing)
    console.log('[TEST] Testing market chart endpoint...');
    const chartResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=15min', {
      headers: {
        'X-CG-Demo-API-Key': apiKey,
        'Accept': 'application/json'
      }
    });
    console.log(`[TEST] Chart endpoint response: ${chartResponse.status} ${chartResponse.statusText}`);
    
    if (!chartResponse.ok) {
      const errorText = await chartResponse.text();
      console.error(`[TEST] Chart endpoint error: ${errorText}`);
    }
    
    return NextResponse.json({
      success: true,
      tests: {
        ping: {
          status: pingResponse.status,
          data: pingData
        },
        simple: {
          status: simpleResponse.status,
          statusText: simpleResponse.statusText
        },
        chart: {
          status: chartResponse.status,
          statusText: chartResponse.statusText
        }
      },
      apiKey: `${apiKey.substring(0, 8)}...`
    });
    
  } catch (error) {
    console.error('[TEST] Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
