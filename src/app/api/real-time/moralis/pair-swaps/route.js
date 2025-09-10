import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pairAddress = searchParams.get('pairAddress');
  const chain = searchParams.get('chain') || 'eth';
  const limit = searchParams.get('limit') || '50';
  const offset = searchParams.get('offset') || '0';

  if (!pairAddress) {
    return NextResponse.json({ error: 'Pair address parameter is required' }, { status: 400 });
  }

  try {
    const moralisApiKey = process.env.MORALIS_API_KEY;
    if (!moralisApiKey) {
      return NextResponse.json({ error: 'Moralis API key not configured' }, { status: 500 });
    }

    const url = `https://deep-index.moralis.io/api/v2.2/pairs/${pairAddress}/swaps?chain=${chain}&limit=${limit}&offset=${offset}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': moralisApiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Moralis API error:', response.status, errorText);
      
      if (response.status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      } else if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      } else {
        return NextResponse.json({ error: 'Failed to fetch pair swaps' }, { status: response.status });
      }
    }

    const data = await response.json();
    
    // Transform Moralis data to match our expected format
    const swaps = data.result?.map(swap => ({
      hash: swap.transaction_hash,
      from_address: swap.from_address,
      to_address: swap.to_address,
      token0_address: swap.token0_address,
      token1_address: swap.token1_address,
      token0_amount: swap.token0_amount,
      token1_amount: swap.token1_amount,
      token0_symbol: swap.token0_symbol,
      token1_symbol: swap.token1_symbol,
      block_timestamp: swap.block_timestamp,
      block_number: swap.block_number,
      pair_address: swap.pair_address,
      chain: swap.chain,
      type: 'swap',
      is_buy: swap.token0_amount > 0 && swap.token1_amount < 0
    })) || [];

    return NextResponse.json({
      swaps,
      total: data.total || swaps.length,
      success: true
    });

  } catch (error) {
    console.error('Error fetching Moralis pair swaps:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 