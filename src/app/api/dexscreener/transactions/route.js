import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pairAddress = searchParams.get('pairAddress');
    const limit = searchParams.get('limit') || '50';

    if (!pairAddress) {
      return NextResponse.json(
        { error: 'Pair address parameter is required' },
        { status: 400 }
      );
    }

    // DexScreener API endpoint for pair transactions
    const url = `https://api.dexscreener.com/latest/dex/pairs/${pairAddress}`;
    
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
    const pair = data.pair;
    
    if (!pair) {
      return NextResponse.json({
        success: true,
        data: {
          transactions: [],
          total: 0
        }
      });
    }

    // Get recent transactions from the pair data
    const transactions = pair.txns || [];
    const recentTransactions = transactions.slice(0, parseInt(limit));

    return NextResponse.json({
      success: true,
      data: {
        transactions: recentTransactions,
        total: transactions.length,
        pair: {
          address: pair.pairAddress,
          chainId: pair.chainId,
          dexId: pair.dexId,
          baseToken: pair.baseToken,
          quoteToken: pair.quoteToken,
          priceUsd: pair.priceUsd,
          volume24h: pair.volume24h,
          liquidity: pair.liquidity
        }
      }
    });

  } catch (error) {
    console.error('DexScreener transactions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction data' },
      { status: 500 }
    );
  }
} 