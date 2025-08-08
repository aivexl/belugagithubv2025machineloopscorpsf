import { NextResponse } from 'next/server';

export async function GET() {
  try {
    let moralisApiKey = process.env.MORALIS_API_KEY;
    
    console.log('=== MORALIS API TEST DEBUG ===');
    console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('MORALIS')));
    console.log('API Key length:', moralisApiKey ? moralisApiKey.length : 'undefined');
    console.log('API Key starts with:', moralisApiKey ? moralisApiKey.substring(0, 20) + '...' : 'undefined');
    console.log('API Key ends with:', moralisApiKey ? '...' + moralisApiKey.substring(moralisApiKey.length - 20) : 'undefined');
    
    // Fallback to NEXT_PUBLIC if MORALIS_API_KEY is not available
    if (!moralisApiKey) {
      moralisApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
      console.log('Using NEXT_PUBLIC_MORALIS_API_KEY as fallback');
    }
    
    if (!moralisApiKey) {
      console.log('ERROR: No API key found');
      return NextResponse.json({ 
        error: 'Moralis API key not configured',
        debug: {
          envVars: Object.keys(process.env).filter(key => key.includes('MORALIS')),
          nodeEnv: process.env.NODE_ENV,
          allEnvVars: Object.keys(process.env).slice(0, 10) // First 10 env vars for debugging
        },
        status: 'error'
      }, { status: 500 });
    }

    // Get current timestamp and 30 days ago for fresh data
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Test with a popular Ethereum wallet address (from the example)
    const testAddress = '0xcB1C1FdE09f811B294172696404e88E658659905';
    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${testAddress}/swaps?chain=eth&order=DESC&from_date=${fromDate}&limit=10`;
    
    console.log('Making request to:', url);
    console.log('Using API Key:', moralisApiKey.substring(0, 20) + '...');
    console.log('Fetching data from:', fromDate, '(30 days ago) to now');
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': moralisApiKey,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Moralis API test error:', response.status, errorText);
      
      return NextResponse.json({ 
        error: `API test failed: ${response.status}`,
        details: errorText,
        debug: {
          url: url,
          apiKeyLength: moralisApiKey.length,
          apiKeyStart: moralisApiKey.substring(0, 10) + '...'
        },
        status: 'error'
      }, { status: response.status });
    }

    const data = await response.json();
    
    console.log('SUCCESS: API call successful');
    console.log('Response data keys:', Object.keys(data));
    console.log('Number of swaps:', data.result?.length || 0);
    
    // Filter to only include recent transactions (last 30 days)
    const recentSwaps = data.result ? data.result.filter(swap => {
      const swapDate = new Date(swap.blockTimestamp);
      return swapDate >= thirtyDaysAgo;
    }) : [];
    
    console.log('Recent swaps (last 30 days):', recentSwaps.length);
    
    return NextResponse.json({
      success: true,
      status: 'connected',
      message: 'Moralis API is working correctly',
      testData: {
        address: testAddress,
        totalSwaps: data.result?.length || 0,
        recentSwaps: recentSwaps.length,
        fromDate: fromDate,
        toDate: now.toISOString(),
        sampleSwap: recentSwaps.length > 0 ? {
          transactionHash: recentSwaps[0].transactionHash,
          transactionType: recentSwaps[0].transactionType,
          walletAddress: recentSwaps[0].walletAddress,
          pairAddress: recentSwaps[0].pairAddress,
          pairLabel: recentSwaps[0].pairLabel,
          exchangeName: recentSwaps[0].exchangeName,
          totalValueUsd: recentSwaps[0].totalValueUsd,
          blockTimestamp: recentSwaps[0].blockTimestamp,
          blockNumber: recentSwaps[0].blockNumber,
          bought: recentSwaps[0].bought ? {
            symbol: recentSwaps[0].bought.symbol,
            name: recentSwaps[0].bought.name,
            amount: recentSwaps[0].bought.amount,
            usdPrice: recentSwaps[0].bought.usdPrice,
            usdAmount: recentSwaps[0].bought.usdAmount
          } : null,
          sold: recentSwaps[0].sold ? {
            symbol: recentSwaps[0].sold.symbol,
            name: recentSwaps[0].sold.name,
            amount: recentSwaps[0].sold.amount,
            usdPrice: recentSwaps[0].sold.usdPrice,
            usdAmount: recentSwaps[0].sold.usdAmount
          } : null
        } : null,
        responseKeys: Object.keys(data)
      }
    });

  } catch (error) {
    console.error('Error testing Moralis API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message,
      status: 'error'
    }, { status: 500 });
  }
} 