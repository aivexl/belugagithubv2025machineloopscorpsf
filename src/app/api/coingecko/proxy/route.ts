import { NextRequest } from 'next/server';
import { withCache } from '../../../../lib/memoryCache';

export const dynamic = 'force-dynamic';

function withApiKey(url: URL): URL {
  const apiKey = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  if (!apiKey) return url;
  if (!url.searchParams.has('x_cg_demo_api_key')) {
    url.searchParams.set('x_cg_demo_api_key', apiKey);
  }
  return url;
}

type CachedResponse = { status: number; body: string; contentType: string };

async function fetchJson(url: URL): Promise<CachedResponse> {
  const upstream = await fetch(url.toString(), {
    headers: { accept: 'application/json' },
    cache: 'no-store',
    // @ts-ignore - next options allowed in app router
    next: { revalidate: 0 },
  });
  const body = await upstream.text();
  const contentType = upstream.headers.get('content-type') || 'application/json';
  return { status: upstream.status, body, contentType };
}

function buildUrl(pathname: string, params: Record<string, string | number | undefined>): URL {
  const url = new URL('https://api.coingecko.com');
  url.pathname = `/api/v3/${pathname.replace(/^\//, '')}`;
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  }
  return withApiKey(url);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const action = searchParams.get('action');

    // Back-compat: generic proxy with url param, with short caching
    if (!action) {
      const target = searchParams.get('url');
      if (!target) {
        return new Response(JSON.stringify({ error: 'Missing action or url param' }), { status: 400 });
      }
      let url: URL;
      try { url = new URL(target); } catch {
        return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400 });
      }
      if (url.hostname !== 'api.coingecko.com' || !url.pathname.startsWith('/api/v3/')) {
        return new Response(JSON.stringify({ error: 'Host not allowed' }), { status: 400 });
      }
      url = withApiKey(url);
      const key = `cg:generic:${url.pathname}?${url.searchParams.toString()}`;
      const ttlMs = 30 * 1000;
      const data = await withCache(key, ttlMs, () => fetchJson(url));
      return new Response(data.body, { status: data.status, headers: { 'content-type': data.contentType } });
    }

    // Whitelisted, action-based API with caching
    let url: URL;
    let cacheKey = '';
    let ttlMs = 0;

    switch (action) {
      case 'resolveByContract': {
        const platform = searchParams.get('platform') || '';
        const address = searchParams.get('address') || '';
        if (!platform || !address) {
          return new Response(JSON.stringify({ error: 'platform and address are required' }), { status: 400 });
        }
        url = buildUrl(`coins/${platform}/contract/${address}`, {
          localization: 'false',
          tickers: 'false',
          market_data: 'false',
          community_data: 'false',
          developer_data: 'false',
        });
        cacheKey = `cg:resolveByContract:${platform}:${address}`;
        ttlMs = 30 * 60 * 1000; // 30 min
        break;
      }
      case 'search': {
        const query = searchParams.get('query') || '';
        url = buildUrl('search', { query });
        cacheKey = `cg:search:${query}`;
        ttlMs = 10 * 60 * 1000; // 10 min
        break;
      }
      case 'detail': {
        const id = searchParams.get('id') || '';
        if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
        url = buildUrl(`coins/${id}`, {
          localization: 'false',
          tickers: 'false',
          market_data: 'true',
          community_data: 'false',
          developer_data: 'false',
          sparkline: 'false',
        });
        cacheKey = `cg:detail:${id}`;
        ttlMs = 2 * 60 * 1000; // 2 min
        break;
      }
      case 'market_chart': {
        const id = searchParams.get('id') || '';
        const vs = searchParams.get('vs_currency') || 'usd';
        const days = searchParams.get('days') || '2';
        const interval = searchParams.get('interval') || 'minute';
        if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
        url = buildUrl(`coins/${id}/market_chart`, { vs_currency: vs, days, interval });
        cacheKey = `cg:market_chart:${id}:${vs}:${days}:${interval}`;
        ttlMs = 60 * 1000; // 60s
        break;
      }
      case 'simple_price': {
        const id = searchParams.get('id') || '';
        const vsCurrencies = searchParams.get('vs_currencies') || 'usd';
        if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
        url = buildUrl('simple/price', { ids: id, vs_currencies: vsCurrencies });
        cacheKey = `cg:simple_price:${id}:${vsCurrencies}`;
        ttlMs = 15 * 1000; // 15s
        break;
      }
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
    }

    const data = await withCache(cacheKey, ttlMs, () => fetchJson(url));
    return new Response(data.body, { status: data.status, headers: { 'content-type': data.contentType } });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: 'Proxy failed', detail: e?.message || String(e) }),
      { status: 500 }
    );
  }
}

