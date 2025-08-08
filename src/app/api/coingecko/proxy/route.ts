import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

function withApiKey(url: URL): URL {
  const apiKey = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  if (!apiKey) return url;
  if (!url.searchParams.has('x_cg_demo_api_key')) {
    url.searchParams.set('x_cg_demo_api_key', apiKey);
  }
  return url;
}

export async function GET(req: NextRequest) {
  try {
    const target = req.nextUrl.searchParams.get('url');
    if (!target) {
      return new Response(JSON.stringify({ error: 'Missing url param' }), { status: 400 });
    }

    let url: URL;
    try {
      url = new URL(target);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400 });
    }

    // Restrict to CoinGecko API only to avoid SSRF
    if (url.hostname !== 'api.coingecko.com' || !url.pathname.startsWith('/api/v3/')) {
      return new Response(JSON.stringify({ error: 'Host not allowed' }), { status: 400 });
    }

    url = withApiKey(url);

    const upstream = await fetch(url.toString(), {
      headers: { accept: 'application/json' },
      cache: 'no-store',
      // @ts-ignore - next options allowed in app router
      next: { revalidate: 0 },
    });

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Proxy failed', detail: e?.message || String(e) }), { status: 500 });
  }
}


