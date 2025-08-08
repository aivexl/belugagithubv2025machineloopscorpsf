import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pairAddress = searchParams.get('pairAddress');
  const chain = searchParams.get('chain') || 'eth';
  const limit = searchParams.get('limit') || '50';
  const offset = searchParams.get('offset') || '0';
  const order = searchParams.get('order') || 'DESC';

  if (!pairAddress) {
    return NextResponse.json({ error: 'Pair address parameter is required' }, { status: 400 });
  }

  try {
    const moralisApiKey = process.env.MORALIS_API_KEY;
    if (!moralisApiKey) {
      return NextResponse.json({ error: 'Moralis API key not configured' }, { status: 500 });
    }

    const url = `https://deep-index.moralis.io/api/v2.2/pairs/${pairAddress}/swaps?chain=${chain}&limit=${limit}&offset=${offset}&order=${order}`;
    
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
    console.log('Moralis pair swaps raw response:', JSON.stringify(data, null, 2));

    // Extract pair info from response metadata (addresses or objects)
    const pairInfo = {
      pairAddress: data.pairAddress || pairAddress,
      pairLabel: data.pairLabel || '',
      baseToken: data.baseToken || {},
      quoteToken: data.quoteToken || {},
    };

    // Transform Moralis swaps data to standardized transaction format.
    // Support both old flat schema and new nested { bought, sold }.
    const transactions = (data.result || []).map((swap) => {
      const txType = (swap.transactionType || '').toLowerCase();

      // New schema with nested bought/sold
      const hasNested = !!(swap.bought || swap.sold);
      let baseAmt = 0;
      let quoteAmt = 0;
      let basePriceUsd = 0;
      let quotePriceUsd = 0;
      let totalUsd = parseFloat(swap.totalValueUsd || 0);
      let baseQuotePrice = parseFloat(swap.baseQuotePrice || swap.base_quote_price || 0);

      if (hasNested) {
        const baseAddr = (pairInfo.baseToken.address || data.baseToken || '').toLowerCase();
        const quoteAddr = (pairInfo.quoteToken.address || data.quoteToken || '').toLowerCase();
        const bought = swap.bought || {};
        const sold = swap.sold || {};

        // pick amounts for base and quote based on addresses
        const pick = (obj, addr) => {
          return (obj && (obj.address || '').toLowerCase() === addr) ? obj : null;
        };

        const boughtIsBase = pick(bought, baseAddr);
        const soldIsBase = pick(sold, baseAddr);
        const boughtIsQuote = pick(bought, quoteAddr);
        const soldIsQuote = pick(sold, quoteAddr);

        if (boughtIsBase || soldIsBase) {
          const node = boughtIsBase || soldIsBase;
          baseAmt = Math.abs(parseFloat(node.amount || 0));
          basePriceUsd = parseFloat(node.usdPrice || 0);
        }
        if (boughtIsQuote || soldIsQuote) {
          const node = boughtIsQuote || soldIsQuote;
          quoteAmt = Math.abs(parseFloat(node.amount || 0));
          quotePriceUsd = parseFloat(node.usdPrice || 0);
        }
        if (!totalUsd) {
          const boughtUsd = Math.abs(parseFloat(bought?.usdAmount || 0));
          const soldUsd = Math.abs(parseFloat(sold?.usdAmount || 0));
          totalUsd = Math.max(boughtUsd, soldUsd) || (boughtUsd + soldUsd) || 0;
        }
        if (!baseQuotePrice && basePriceUsd && quotePriceUsd) {
          baseQuotePrice = basePriceUsd / quotePriceUsd;
        }
      } else {
        // Old flat schema
        baseAmt = Math.abs(parseFloat(swap.baseTokenAmount || 0));
        quoteAmt = Math.abs(parseFloat(swap.quoteTokenAmount || 0));
        basePriceUsd = parseFloat(swap.baseTokenPriceUsd || 0);
        quotePriceUsd = parseFloat(swap.quoteTokenPriceUsd || 0);
        if (!totalUsd && baseAmt && basePriceUsd) totalUsd = baseAmt * basePriceUsd;
        if (!baseQuotePrice && basePriceUsd && quotePriceUsd) baseQuotePrice = basePriceUsd / quotePriceUsd;
      }

      return {
        transaction_hash: swap.transactionHash,
        wallet_address: swap.walletAddress,
        maker: swap.walletAddress,
        transaction_type: txType,
        base_token_amount: baseAmt,
        quote_token_amount: quoteAmt,
        base_token_price_usd: basePriceUsd,
        quote_token_price_usd: quotePriceUsd,
        total_value_usd: totalUsd,
        block_timestamp: swap.blockTimestamp,
        base_quote_price: baseQuotePrice,
        transactionHash: swap.transactionHash,
        walletAddress: swap.walletAddress,
        makerAddress: swap.walletAddress,
        transactionType: txType,
        baseTokenAmount: baseAmt,
        quoteTokenAmount: quoteAmt,
        baseTokenPriceUsd: basePriceUsd,
        quoteTokenPriceUsd: quotePriceUsd,
        totalValueUsd: totalUsd,
        blockTimestamp: swap.blockTimestamp,
        baseQuotePrice: baseQuotePrice,
      };
    });

    return NextResponse.json({
      success: true,
      source: 'moralis-pair-swaps',
      pair: pairInfo,
      transactions,
      total: transactions.length,
    });

  } catch (error) {
    console.error('Error fetching Moralis pair swaps:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 