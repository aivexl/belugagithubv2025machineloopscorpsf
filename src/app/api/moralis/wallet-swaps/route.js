import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');
  const chain = searchParams.get('chain') || 'eth';
  const order = searchParams.get('order') || 'DESC';
  const limit = searchParams.get('limit') || '100';

  if (!walletAddress) {
    return NextResponse.json({ error: 'walletAddress parameter is required' }, { status: 400 });
  }

  try {
    const moralisApiKey = process.env.MORALIS_API_KEY;
    if (!moralisApiKey) {
      return NextResponse.json({ error: 'Moralis API key not configured' }, { status: 500 });
    }

    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/swaps?chain=${chain}&order=${order}&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'X-API-Key': moralisApiKey,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Moralis wallet swaps API error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to fetch wallet swaps' }, { status: response.status });
    }

    const data = await response.json();

    const transactions = (data.result || []).map((swap) => {
      const txType = (swap.transactionType || '').toLowerCase();
      const bought = swap.bought || {};
      const sold = swap.sold || {};

      // Choose base/quote as the token with higher absolute USD as base
      const boughtUsd = Math.abs(parseFloat(bought.usdAmount || 0));
      const soldUsd = Math.abs(parseFloat(sold.usdAmount || 0));
      const baseNode = boughtUsd >= soldUsd ? bought : sold;
      const quoteNode = boughtUsd >= soldUsd ? sold : bought;

      const baseAmt = Math.abs(parseFloat(baseNode.amount || 0));
      const quoteAmt = Math.abs(parseFloat(quoteNode.amount || 0));
      const basePriceUsd = parseFloat(baseNode.usdPrice || 0);
      const quotePriceUsd = parseFloat(quoteNode.usdPrice || 0);
      const totalUsd = Math.max(boughtUsd, soldUsd) || (boughtUsd + soldUsd) || 0;
      const baseQuotePrice = basePriceUsd && quotePriceUsd ? basePriceUsd / quotePriceUsd : 0;

      return {
        transaction_hash: swap.transactionHash,
        wallet_address: swap.walletAddress,
        transaction_type: txType,
        base_token_amount: baseAmt,
        quote_token_amount: quoteAmt,
        base_token_price_usd: basePriceUsd,
        quote_token_price_usd: quotePriceUsd,
        total_value_usd: totalUsd,
        block_timestamp: swap.blockTimestamp,
        base_quote_price: baseQuotePrice,
        // camelCase mirrors
        transactionHash: swap.transactionHash,
        walletAddress: swap.walletAddress,
        transactionType: txType,
        baseTokenAmount: baseAmt,
        quoteTokenAmount: quoteAmt,
        baseTokenPriceUsd: basePriceUsd,
        quoteTokenPriceUsd: quotePriceUsd,
        totalValueUsd: totalUsd,
        blockTimestamp: swap.blockTimestamp,
        baseQuotePrice: baseQuotePrice,
        // token metadata passthrough
        baseToken: {
          address: baseNode.address,
          symbol: baseNode.symbol,
          name: baseNode.name,
          logo: baseNode.logo,
        },
        quoteToken: {
          address: quoteNode.address,
          symbol: quoteNode.symbol,
          name: quoteNode.name,
          logo: quoteNode.logo,
        },
      };
    });

    return NextResponse.json({ success: true, source: 'moralis-wallet-swaps', transactions, total: transactions.length });
  } catch (error) {
    console.error('Error fetching Moralis wallet swaps:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}


