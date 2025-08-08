import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenAddress = searchParams.get('tokenAddress');
    const chain = searchParams.get('chain') || 'ethereum';

    if (!tokenAddress) {
      return NextResponse.json(
        { error: 'Token address parameter is required' },
        { status: 400 }
      );
    }

    // DexScreener API endpoint
    const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
    
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

    return NextResponse.json({
      success: true,
      data: {
        pairs,
        total: pairs.length
      }
    });

  } catch (error) {
    console.error('DexScreener API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trading pairs data' },
      { status: 500 }
    );
  }
} 