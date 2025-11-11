import type { NextRequest } from 'next/server';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export function getSiteOrigin(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '';
  if (envUrl) {
    try {
      const u = new URL(envUrl.startsWith('http') ? envUrl : `https://${envUrl}`);
      return `${u.protocol}//${u.host}`;
    } catch {
      // fall through
    }
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

function getIndexNowKey(): string {
  return process.env.INDEXNOW_KEY || 'a9c3f5d1e8b24f27a1c0b6d492ef34ab';
}

function getKeyLocation(): string {
  const origin = getSiteOrigin();
  const key = getIndexNowKey();
  return `${origin}/${key}.txt`;
}

export async function submitIndexNow(urls: string[]): Promise<{ ok: boolean; status: number; body?: unknown }> {
  const filtered = Array.from(new Set(urls.filter(Boolean)));
  if (filtered.length === 0) {
    return { ok: false, status: 400, body: { error: 'No URLs to submit' } };
  }

  const origin = getSiteOrigin();
  const payload = {
    host: new URL(origin).host,
    key: getIndexNowKey(),
    keyLocation: getKeyLocation(),
    urlList: filtered,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = undefined;
  }

  return { ok: res.ok, status: res.status, body };
}

export function extractUrlsFromRequest(req: NextRequest): string[] {
  try {
    return [];
  } catch {
    return [];
  }
}

export function buildArticleUrl(category: string, slug: string): string {
  const origin = getSiteOrigin();
  const safeCategory = (category || '').toLowerCase();
  const basePath = safeCategory === 'academy' ? 'academy' : safeCategory === 'newsroom' ? 'newsroom' : 'news';
  const safeSlug = (slug || '').replace(/^\/+|\/+$/g, '');
  return `${origin}/${basePath}/${safeSlug}`;
}


