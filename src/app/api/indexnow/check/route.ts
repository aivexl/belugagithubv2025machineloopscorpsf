import { NextResponse } from 'next/server';
import { submitIndexNow } from '@/lib/indexnow';

function getOrigin(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '';
  if (envUrl) {
    try {
      const u = new URL(envUrl.startsWith('http') ? envUrl : `https://${envUrl}`);
      return `${u.protocol}//${u.host}`;
    } catch {
      // ignore
    }
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

function getKey(): string {
  return process.env.INDEXNOW_KEY || 'a9c3f5d1e8b24f27a1c0b6d492ef34ab';
}

export async function GET(request: Request) {
  const origin = getOrigin();
  const key = getKey();
  const keyUrl = `${origin}/${key}.txt`;

  let keyFetchOk = false;
  let keyBody: string | null = null;
  let keyStatus = 0;
  try {
    const r = await fetch(keyUrl, { next: { revalidate: 0 } });
    keyStatus = r.status;
    if (r.ok) {
      keyBody = (await r.text()).trim();
      keyFetchOk = keyBody === key;
    }
  } catch (e) {
    keyBody = String(e);
  }

  // Optional submission test if user passes ?submit=1&url=
  const { searchParams } = new URL(request.url);
  const shouldSubmit = searchParams.get('submit') === '1';
  const testUrl = searchParams.get('url') || origin;

  let submission: { ok: boolean; status: number; body?: unknown } | null = null;
  if (shouldSubmit) {
    try {
      submission = await submitIndexNow([testUrl]);
    } catch (e) {
      submission = { ok: false, status: 0, body: String(e) };
    }
  }

  return NextResponse.json({
    origin,
    expectedKey: key,
    keyUrl,
    keyFetch: { ok: keyFetchOk, status: keyStatus, bodyPreview: keyBody?.slice(0, 128) },
    submission,
    instructions: {
      verify: `Open ${keyUrl} and ensure it contains exactly the key string`,
      submitExample: `${origin}/api/indexnow/check?submit=1&url=${encodeURIComponent(origin)}`,
    },
  });
}

















