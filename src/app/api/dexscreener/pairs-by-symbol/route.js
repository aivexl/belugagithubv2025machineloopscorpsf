import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const chain = searchParams.get('chain') || 'all';
    const limit = searchParams.get('limit') || '20';

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // DexScreener API endpoint for searching by symbol
    const url = `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(symbol)}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DuniaCrypto/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter pairs by chain if specified
    let pairs = data.pairs || [];
    if (chain && chain !== 'all') {
      pairs = pairs.filter(pair => 
        pair.chainId?.toLowerCase() === chain.toLowerCase() ||
        pair.chain?.toLowerCase() === chain.toLowerCase()
      );
    }

    // Sort by liquidity (highest first)
    pairs.sort((a, b) => {
      const liquidityA = parseFloat(a.liquidity?.usd || 0);
      const liquidityB = parseFloat(b.liquidity?.usd || 0);
      return liquidityB - liquidityA;
    });

    // Limit results
    pairs = pairs.slice(0, parseInt(limit));

    return NextResponse.json({
      success: true,
      data: {
        pairs,
        total: pairs.length,
        symbol: symbol.toUpperCase()
      }
    });

  } catch (error) {
    console.error('DexScreener search API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trading pairs data' },
      { status: 500 }
    );
  }
} 