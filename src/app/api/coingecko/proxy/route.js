export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { withCache } from '../../../lib/memoryCache';

const BASE = 'https://api.coingecko.com/api/v3';

function getApiKeyParam() {
  const key = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || process.env.COINGECKO_API_KEY;
  return key ? `&x_cg_demo_api_key=${key}` : '';
}

function asJson(data, init) {
  return new NextResponse(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init?.headers || {}) },
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    if (!action) return asJson({ error: 'missing action' }, { status: 400 });

    // Common cache TTLs
    const TTL_SHORT = 15 * 1000; // 15s for prices
    const TTL_MED = 60 * 1000;   // 60s for market_chart

    if (action === 'simple_price') {
      const ids = searchParams.get('ids');
      const vs = searchParams.get('vs') || 'usd';
      if (!ids) return asJson({ error: 'missing ids' }, { status: 400 });
      const key = `cg:simple:${ids}:${vs}`;
      const url = `${BASE}/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=${encodeURIComponent(vs)}${getApiKeyParam()}`;
      const data = await withCache(key, TTL_SHORT, async () => {
        const r = await fetch(url, { next: { revalidate: 0 } });
        if (!r.ok) throw new Error(`CG ${r.status}`);
        return r.json();
      });
      return asJson(data);
    }

    if (action === 'contract_lookup') {
      const platform = searchParams.get('platform');
      const address = searchParams.get('address');
      if (!platform || !address) return asJson({ error: 'missing platform/address' }, { status: 400 });
      const key = `cg:contract:${platform}:${address}`;
      const url = `${BASE}/coins/${platform}/contract/${address}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false${getApiKeyParam()}`;
      const data = await withCache(key, TTL_MED, async () => {
        const r = await fetch(url, { next: { revalidate: 0 } });
        if (!r.ok) throw new Error(`CG ${r.status}`);
        return r.json();
      });
      return asJson(data);
    }

    if (action === 'market_chart') {
      const id = searchParams.get('id');
      const vs = searchParams.get('vs') || 'usd';
      const days = searchParams.get('days') || '2';
      const interval = searchParams.get('interval') || 'minute';
      if (!id) return asJson({ error: 'missing id' }, { status: 400 });
      const key = `cg:mc:${id}:${vs}:${days}:${interval}`;
      const url = `${BASE}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=${encodeURIComponent(vs)}&days=${days}&interval=${interval}${getApiKeyParam()}`;
      const data = await withCache(key, TTL_MED, async () => {
        const r = await fetch(url, { next: { revalidate: 0 } });
        if (!r.ok) throw new Error(`CG ${r.status}`);
        return r.json();
      });
      return asJson(data);
    }

    if (action === 'search') {
      const q = searchParams.get('q') || '';
      const key = `cg:search:${q}`;
      const url = `${BASE}/search?query=${encodeURIComponent(q)}${getApiKeyParam()}`;
      const data = await withCache(key, TTL_MED, async () => {
        const r = await fetch(url, { next: { revalidate: 0 } });
        if (!r.ok) throw new Error(`CG ${r.status}`);
        return r.json();
      });
      return asJson(data);
    }

    return asJson({ error: 'unknown action' }, { status: 400 });
  } catch (e) {
    return asJson({ error: e?.message || 'proxy error' }, { status: 500 });
  }
}


