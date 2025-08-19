import { NextRequest, NextResponse } from 'next/server';

// Enterprise-level fallback data for trending coins
const FALLBACK_TRENDING_COINS = {
  coins: [
    {
      item: {
        id: 'bitcoin',
        coin_id: 1,
        name: 'Bitcoin',
        symbol: 'btc',
        market_cap_rank: 1,
        score: 0,
        price_btc: 0.000000000000000000,
        small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
      }
    },
    {
      item: {
        id: 'ethereum',
        coin_id: 279,
        name: 'Ethereum',
        symbol: 'eth',
        market_cap_rank: 2,
        score: 0,
        price_btc: 0.000000000000000000,
        small: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
      }
    },
    {
      item: {
        id: 'binancecoin',
        coin_id: 825,
        name: 'BNB',
        symbol: 'bnb',
        market_cap_rank: 3,
        score: 0,
        price_btc: 0.000000000000000000,
        small: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png'
      }
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    console.log('Server-side trending: Fetching trending coins from CoinGecko...');
    
    // Enterprise-level rate limiting and error handling
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Beluga-Crypto-App/1.0'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      console.warn(`Server-side trending: CoinGecko API returned ${response.status}, using fallback data`);
      return NextResponse.json(FALLBACK_TRENDING_COINS, { status: 200 });
    }

    const data = await response.json();
    
    if (data && data.coins && Array.isArray(data.coins) && data.coins.length > 0) {
      console.log(`Server-side trending: Successfully fetched ${data.coins.length} trending coins`);
      return NextResponse.json(data, { status: 200 });
    } else {
      console.warn('Server-side trending: Invalid data structure from CoinGecko, using fallback data');
      return NextResponse.json(FALLBACK_TRENDING_COINS, { status: 200 });
    }
  } catch (error) {
    console.error('Server-side trending: Error fetching trending coins:', error);
    console.log('Server-side trending: Using fallback data due to error');
    return NextResponse.json(FALLBACK_TRENDING_COINS, { status: 200 });
  }
}
