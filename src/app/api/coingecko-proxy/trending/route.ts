import { NextRequest, NextResponse } from 'next/server';

// Server-side proxy for CoinGecko trending data
// Avoids CORS issues by making requests from server
export async function GET(request: NextRequest) {
  try {
    const url = 'https://api.coingecko.com/api/v3/search/trending';
    
    console.log('Server-side proxy: Fetching trending data from CoinGecko...');
    
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
        console.warn('Rate limited, returning fallback trending data');
        return NextResponse.json({
          coins: [
            {
              item: {
                id: 'bitcoin',
                coin_id: 1,
                name: 'Bitcoin',
                symbol: 'btc',
                market_cap_rank: 1,
                thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
                small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
                large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                slug: 'bitcoin',
                price_btc: 1.0,
                score: 100
              }
            },
            {
              item: {
                id: 'ethereum',
                coin_id: 279,
                name: 'Ethereum',
                symbol: 'eth',
                market_cap_rank: 2,
                thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
                small: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
                large: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
                slug: 'ethereum',
                price_btc: 0.06,
                score: 95
              }
            }
          ]
        });
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Server-side proxy: Successfully fetched trending data');
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Server-side proxy: Failed to fetch trending data:', error);
    
    // Return fallback data
    return NextResponse.json({
      coins: [
        {
          item: {
            id: 'bitcoin',
            coin_id: 1,
            name: 'Bitcoin',
            symbol: 'btc',
            market_cap_rank: 1,
            thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
            small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
            large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            slug: 'bitcoin',
            price_btc: 1.0,
            score: 100
          }
        },
        {
          item: {
            id: 'ethereum',
            coin_id: 279,
            name: 'Ethereum',
            symbol: 'eth',
            market_cap_rank: 2,
            thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
            small: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
            large: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            slug: 'ethereum',
            price_btc: 0.06,
            score: 95
          }
        }
      ]
    });
  }
}
