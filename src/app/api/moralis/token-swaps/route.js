import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenAddress = searchParams.get('tokenAddress');
  const chain = (searchParams.get('chain') || 'eth').toLowerCase();
  const limitPerPageRaw = parseInt(searchParams.get('limit') || '200', 10);
  const order = (searchParams.get('order') || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const windowParam = (searchParams.get('window') || '24h').toLowerCase();

  if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
    return NextResponse.json({ error: 'tokenAddress parameter is required' }, { status: 400 });
  }

  // Clamp and validate
  const supportedChains = new Set(['eth','bsc','polygon','avalanche','arbitrum','optimism','base']);
  const safeChain = supportedChains.has(chain) ? chain : 'eth';
  const limitPerPage = Math.max(50, Math.min(200, isFinite(limitPerPageRaw) ? limitPerPageRaw : 200));

  // Determine window ms threshold
  const nowMs = Date.now();
  const windowMs = windowParam === '5m' ? 5*60*1000
                  : windowParam === '1h' ? 60*60*1000
                  : windowParam === '4h' ? 4*60*60*1000
                  : 24*60*60*1000; // default 24h
  const cutoffMs = nowMs - windowMs;

  try {
    const moralisApiKey = process.env.MORALIS_API_KEY;
    if (!moralisApiKey) {
      return NextResponse.json({ error: 'Moralis API key not configured' }, { status: 500 });
    }

    let cursor = searchParams.get('cursor') || '';
    const aggregated = [];
    let pageCount = 0;
    const maxPages = 5; // up to ~1000 records

    while (pageCount < maxPages) {
      const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/swaps?chain=${safeChain}&order=${order}&limit=${limitPerPage}` + (cursor ? `&cursor=${encodeURIComponent(cursor)}` : '');

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
        return NextResponse.json({ error: 'Failed to fetch token swaps', status: response.status, details: errorText?.slice(0, 500) }, { status: response.status });
      }

      const data = await response.json();
      const batch = Array.isArray(data.result) ? data.result : [];

      // Transform and push
      for (const swap of batch) {
        const tsValue = swap.blockTimestamp;
        const tsMs = typeof tsValue === 'number' ? tsValue * 1000 : Date.parse(tsValue);
        if (isFinite(tsMs) && tsMs < cutoffMs) {
          // If data is sorted by DESC and we've passed the cutoff, we can break early
          // But continue collecting current page just in case; then stop outer loop
        }

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

        aggregated.push({
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
        });
      }

      // Stop if last item in this batch is older than cutoff and order is DESC
      if (order === 'DESC' && batch.length > 0) {
        const last = batch[batch.length - 1];
        const lastTs = typeof last.blockTimestamp === 'number' ? last.blockTimestamp * 1000 : Date.parse(last.blockTimestamp);
        if (isFinite(lastTs) && lastTs < cutoffMs) {
          break;
        }
      }

      // Prepare next cursor
      cursor = data?.nextCursor || data?.cursor || '';
      if (!cursor) break;
      pageCount += 1;
    }

    return NextResponse.json({
      success: true,
      source: 'moralis-token-swaps',
      pair: {
        pairAddress: tokenAddress,
        pairLabel: '',
        baseToken: {},
        quoteToken: {},
      },
      transactions: aggregated,
      total: aggregated.length,
    });
  } catch (error) {
    console.error('Error fetching Moralis token swaps:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}


