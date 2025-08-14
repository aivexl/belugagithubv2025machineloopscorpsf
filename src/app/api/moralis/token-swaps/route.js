import { NextResponse } from 'next/server';
import { withCache } from '../../../../lib/memoryCache';

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
      // Soft-fail to avoid surfacing 500s in client; frontend will fallback
      return NextResponse.json({ success: false, source: 'moralis-token-swaps', transactions: [], total: 0, warning: 'Moralis API key not configured' }, { status: 200 });
    }
    const cacheKey = `moralis:token-swaps:${tokenAddress}:${safeChain}:${order}:${limitPerPage}:${windowParam}`;
    const ttlMs = 30 * 1000;

    const result = await withCache(cacheKey, ttlMs, async () => {
      let cursor = searchParams.get('cursor') || '';
      const aggregated = [];
      let pageCount = 0;
      const maxPages = 5;

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
          return { ok: false, transactions: [], total: 0 };
        }

        const data = await response.json();
        const batch = Array.isArray(data.result) ? data.result : [];

        for (const swap of batch) {
          const tsValue = swap.blockTimestamp;
          const tsMs = typeof tsValue === 'number' ? tsValue * 1000 : Date.parse(tsValue);
          if (isFinite(tsMs) && tsMs < cutoffMs) {
            // continue page but we'll stop outer loop after
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
            from_address: swap.fromAddress || swap.makerAddress || undefined,
            to_address: swap.toAddress || undefined,
            // Ensure maker always a wallet address
            maker: swap.walletAddress || swap.fromAddress || swap.toAddress,
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
            fromAddress: swap.fromAddress || swap.makerAddress || undefined,
            toAddress: swap.toAddress || undefined,
            makerAddress: swap.walletAddress || swap.fromAddress || swap.toAddress,
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

        if (order === 'DESC' && batch.length > 0) {
          const last = batch[batch.length - 1];
          const lastTs = typeof last.blockTimestamp === 'number' ? last.blockTimestamp * 1000 : Date.parse(last.blockTimestamp);
          if (isFinite(lastTs) && lastTs < cutoffMs) {
            break;
          }
        }

        cursor = data?.nextCursor || data?.cursor || '';
        if (!cursor) break;
        pageCount += 1;
      }

      return { ok: true, transactions: aggregated, total: aggregated.length };
    });

    if (!result?.ok) {
      return NextResponse.json({ success: false, source: 'moralis-token-swaps', transactions: [], total: 0 }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      source: 'moralis-token-swaps',
      pair: { pairAddress: tokenAddress, pairLabel: '', baseToken: {}, quoteToken: {} },
      transactions: result.transactions,
      total: result.total,
    });
  } catch (error) {
    console.error('Error fetching Moralis token swaps:', error);
    // Soft-fail
    return NextResponse.json({ success: false, source: 'moralis-token-swaps', transactions: [], total: 0, error: String(error?.message || error) }, { status: 200 });
  }
}


