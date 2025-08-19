import { NextRequest, NextResponse } from 'next/server';

// Server-side proxy for CoinGecko global data
// Avoids CORS issues by making requests from server
export async function GET(request: NextRequest) {
  try {
    const url = 'https://api.coingecko.com/api/v3/global';
    
    console.log('Server-side proxy: Fetching global data from CoinGecko...');
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Beluga-Crypto-App/1.0',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Rate limited, returning fallback data');
        return NextResponse.json({
          data: {
            active_cryptocurrencies: 2500,
            total_market_cap: { usd: 2500000000000 },
            total_volume: { usd: 80000000000 },
            market_cap_percentage: { btc: 48.5, eth: 18.2 },
            market_cap_change_percentage_24h_usd: 2.5,
            updated_at: Date.now()
          }
        });
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Server-side proxy: Successfully fetched global data');
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Server-side proxy: Failed to fetch global data:', error);
    
    // Return fallback data
    return NextResponse.json({
      data: {
        active_cryptocurrencies: 2500,
        total_market_cap: { usd: 2500000000000 },
        total_volume: { usd: 80000000000 },
        market_cap_percentage: { btc: 48.5, eth: 18.2 },
        market_cap_change_percentage_24h_usd: 2.5,
        updated_at: Date.now()
      }
    });
  }
}
