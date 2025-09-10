import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenAddress = searchParams.get('tokenAddress');
  const chain = searchParams.get('chain') || 'eth';
  const limit = searchParams.get('limit') || '50';
  const offset = searchParams.get('offset') || '0';

  if (!tokenAddress) {
    return NextResponse.json({ error: 'Token address parameter is required' }, { status: 400 });
  }

  try {
    const moralisApiKey = process.env.MORALIS_API_KEY;
    if (!moralisApiKey) {
      return NextResponse.json({ error: 'Moralis API key not configured' }, { status: 500 });
    }

    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/holders?chain=${chain}&limit=${limit}&offset=${offset}`;
    
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
        return NextResponse.json({ error: 'Failed to fetch token holders' }, { status: response.status });
      }
    }

    const data = await response.json();
    
    // Transform Moralis data to match our expected format
    const holders = data.result?.map(holder => ({
      address: holder.address,
      balance: holder.balance,
      balance_formatted: holder.balance_formatted,
      token_address: holder.token_address,
      token_name: holder.token_name,
      token_symbol: holder.token_symbol,
      token_decimals: holder.token_decimals,
      chain: holder.chain,
      percentage: holder.percentage || 0
    })) || [];

    return NextResponse.json({
      holders,
      total: data.total || holders.length,
      success: true
    });

  } catch (error) {
    console.error('Error fetching Moralis token holders:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 