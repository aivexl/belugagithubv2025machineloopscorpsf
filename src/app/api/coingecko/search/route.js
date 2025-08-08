import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') || '10';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // CoinGecko search API
    const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DuniaCrypto/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko search API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter coins (exclude categories and exchanges)
    const coins = data.coins || [];
    const filteredCoins = coins
      .filter(coin => coin.id && coin.symbol)
      .slice(0, parseInt(limit));

    return NextResponse.json({
      success: true,
      data: {
        coins: filteredCoins,
        total: filteredCoins.length,
        query: query.toLowerCase()
      }
    });

  } catch (error) {
    console.error('CoinGecko search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search coins' },
      { status: 500 }
    );
  }
} 