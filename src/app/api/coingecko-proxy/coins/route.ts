import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en&price_change_percentage=1h,24h,7d,30d,1y';
    
    console.log('Server-side proxy: Fetching top 100 coins from CoinGecko...');
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Beluga-Crypto-App/1.0',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Rate limited, returning fallback coins data');
        return NextResponse.json([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            current_price: 45000,
            market_cap: 850000000000,
            market_cap_rank: 1,
            price_change_percentage_24h: 2.5,
            circulating_supply: 19500000,
            total_supply: 21000000,
            max_supply: 21000000,
            ath: 69000,
            total_volume: 25000000000,
            high_24h: 46000,
            low_24h: 44000,
            price_change_24h: 1125,
            market_cap_change_24h: 21250000000,
            market_cap_change_percentage_24h: 2.5,
            fully_diluted_valuation: 945000000000,
            ath_change_percentage: -34.78,
            ath_date: '2021-11-10T14:24:11.849Z',
            atl: 67.81,
            atl_change_percentage: 66263.25,
            atl_date: '2013-07-06T00:00:00.000Z',
            roi: null,
            last_updated: new Date().toISOString()
          }
        ]);
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Server-side proxy: Successfully fetched ${data.length} coins`);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Server-side proxy: Failed to fetch coins data:', error);
    
    // Return fallback data
    return NextResponse.json([
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 45000,
        market_cap: 850000000000,
        market_cap_rank: 1,
        price_change_percentage_24h: 2.5,
        circulating_supply: 19500000,
        total_supply: 21000000,
        max_supply: 21000000,
        ath: 69000,
        total_volume: 25000000000,
        high_24h: 46000,
        low_24h: 44000,
        price_change_24h: 1125,
        market_cap_change_24h: 21250000000,
        market_cap_change_percentage_24h: 2.5,
        fully_diluted_valuation: 945000000000,
        ath_change_percentage: -34.78,
        ath_date: '2021-11-10T14:24:11.849Z',
        atl: 67.81,
        atl_change_percentage: 66263.25,
        atl_date: '2013-07-06T00:00:00.000Z',
        roi: null,
        last_updated: new Date().toISOString()
      }
    ]);
  }
}
