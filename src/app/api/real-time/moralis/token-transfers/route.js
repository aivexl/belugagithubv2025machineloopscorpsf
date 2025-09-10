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

    // Convert chain parameter to Moralis format
    const chainMap = {
      '1': 'eth',
      'eth': 'eth',
      '137': 'polygon',
      'polygon': 'polygon',
      '56': 'bsc',
      'bsc': 'bsc',
      '43114': 'avalanche',
      'avalanche': 'avalanche'
    };
    
    const moralisChain = chainMap[chain] || 'eth';
    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/transfers?chain=${moralisChain}&limit=${limit}&offset=${offset}`;
    
    console.log('Making Moralis token transfers API request to:', url);
    
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
        return NextResponse.json({ error: 'Failed to fetch token transfers' }, { status: response.status });
      }
    }

    const data = await response.json();
    
    // Transform Moralis data to match our expected format
    const transfers = data.result?.map(transfer => ({
      hash: transfer.transaction_hash,
      from_address: transfer.from_address,
      to_address: transfer.to_address,
      value: transfer.value,
      block_timestamp: transfer.block_timestamp,
      block_number: transfer.block_number,
      token_address: transfer.token_address,
      token_name: transfer.token_name,
      token_symbol: transfer.token_symbol,
      token_decimals: transfer.token_decimals,
      chain: transfer.chain,
      type: 'token_transfer'
    })) || [];

    return NextResponse.json({
      transfers,
      total: data.total || transfers.length,
      success: true
    });

  } catch (error) {
    console.error('Error fetching Moralis token transfers:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 