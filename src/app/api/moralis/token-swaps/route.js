import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenAddress = searchParams.get('tokenAddress');
  const chain = searchParams.get('chain') || 'eth';
  const limit = searchParams.get('limit') || '100';
  const order = searchParams.get('order') || 'DESC';

  if (!tokenAddress) {
    return NextResponse.json({ error: 'tokenAddress parameter is required' }, { status: 400 });
  }

  try {
    const moralisApiKey = process.env.MORALIS_API_KEY;
    if (!moralisApiKey) {
      return NextResponse.json({ error: 'Moralis API key not configured' }, { status: 500 });
    }

    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/swaps?chain=${chain}&order=${order}&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'X-API-Key': moralisApiKey,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Moralis token swaps API error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to fetch token swaps' }, { status: response.status });
    }

    const data = await response.json();

    const baseToken = data.baseToken || data.token || {};
    const quoteToken = data.quoteToken || {};
    const pairLabel = data.pairLabel || (baseToken.symbol && quoteToken.symbol ? `${baseToken.symbol}/${quoteToken.symbol}` : '');

    const transactions = (data.result || []).map((swap) => {
      const baseAmt = parseFloat(swap.baseTokenAmount || 0);
      const quoteAmt = parseFloat(swap.quoteTokenAmount || 0);
      const basePriceUsd = parseFloat(swap.baseTokenPriceUsd || 0);
      const quotePriceUsd = parseFloat(swap.quoteTokenPriceUsd || 0);
      const totalUsd = parseFloat(swap.totalValueUsd || 0);
      const txType = (swap.transactionType || '').toLowerCase();

      let computedTotalUsd = totalUsd;
      if (!computedTotalUsd && baseAmt && basePriceUsd) computedTotalUsd = baseAmt * basePriceUsd;
      if (!computedTotalUsd && quoteAmt && quotePriceUsd) computedTotalUsd = quoteAmt * quotePriceUsd;

      const baseQuotePrice = basePriceUsd && quotePriceUsd ? basePriceUsd / quotePriceUsd : (baseAmt && quoteAmt ? quoteAmt / baseAmt : 0);

      return {
        transaction_hash: swap.transactionHash,
        wallet_address: swap.walletAddress,
        maker: swap.walletAddress,
        transaction_type: txType,
        base_token_amount: Math.abs(baseAmt),
        quote_token_amount: Math.abs(quoteAmt),
        base_token_price_usd: basePriceUsd,
        quote_token_price_usd: quotePriceUsd,
        total_value_usd: computedTotalUsd,
        block_timestamp: swap.blockTimestamp,
        base_quote_price: baseQuotePrice,
        transactionHash: swap.transactionHash,
        walletAddress: swap.walletAddress,
        makerAddress: swap.walletAddress,
        transactionType: txType,
        baseTokenAmount: Math.abs(baseAmt),
        quoteTokenAmount: Math.abs(quoteAmt),
        baseTokenPriceUsd: basePriceUsd,
        quoteTokenPriceUsd: quotePriceUsd,
        totalValueUsd: computedTotalUsd,
        blockTimestamp: swap.blockTimestamp,
        baseQuotePrice: baseQuotePrice,
      };
    });

    return NextResponse.json({
      success: true,
      source: 'moralis-token-swaps',
      pair: {
        pairAddress: tokenAddress,
        pairLabel,
        baseToken,
        quoteToken,
      },
      transactions,
      total: transactions.length,
    });
  } catch (error) {
    console.error('Error fetching Moralis token swaps:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}


