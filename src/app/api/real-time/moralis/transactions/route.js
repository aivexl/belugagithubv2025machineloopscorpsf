import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chain = searchParams.get('chain') || 'eth';
  const limit = searchParams.get('limit') || '50';

  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
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
    const url = `https://deep-index.moralis.io/api/v2.2/${address}/transactions?chain=${moralisChain}&limit=${limit}`;
    
    console.log('Making Moralis API request to:', url);
    
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
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: response.status });
      }
    }

    const data = await response.json();
    
    // Transform Moralis data to match our expected format
    const transactions = data.result?.map(tx => ({
      hash: tx.hash,
      from_address: tx.from_address,
      to_address: tx.to_address,
      value: tx.value,
      block_timestamp: tx.block_timestamp,
      block_number: tx.block_number,
      gas: tx.gas,
      gas_price: tx.gas_price,
      transaction_index: tx.transaction_index,
      chain: tx.chain,
      type: tx.type || 'transfer'
    })) || [];

    return NextResponse.json({
      transactions,
      total: transactions.length,
      success: true
    });

  } catch (error) {
    console.error('Error fetching Moralis transactions:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 