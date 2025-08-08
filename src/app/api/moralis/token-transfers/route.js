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

    // Convert big integer string to decimal number with token decimals
    const scaleDown = (valStr, decimals) => {
      try {
        const num = parseFloat(valStr);
        const d = Number(decimals || 0);
        if (!isFinite(num)) return 0;
        return num / Math.pow(10, d);
      } catch {
        return 0;
      }
    };

    // Map to the generic transaction shape the frontend expects
    const transactions = (data.result || []).map((t) => {
      const amount = scaleDown(t.value, t.token_decimals);
      return {
        // snake_case
        transaction_hash: t.transaction_hash,
        wallet_address: t.from_address,
        transaction_type: 'transfer',
        base_token_amount: amount,
        quote_token_amount: null,
        total_value_usd: null,
        base_token_price_usd: null,
        block_timestamp: t.block_timestamp,
        // camelCase mirrors
        transactionHash: t.transaction_hash,
        walletAddress: t.from_address,
        transactionType: 'transfer',
        baseTokenAmount: amount,
        quoteTokenAmount: null,
        totalValueUsd: null,
        baseTokenPriceUsd: null,
        blockTimestamp: t.block_timestamp,
      };
    });

    return NextResponse.json({ success: true, source: 'moralis-token-transfers', transactions });

  } catch (error) {
    console.error('Error fetching Moralis token transfers:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 