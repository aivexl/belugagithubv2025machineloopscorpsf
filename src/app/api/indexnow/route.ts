import { NextResponse } from 'next/server';
import { submitIndexNow } from '@/lib/indexnow';

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const urls = Array.isArray(json?.urls) ? json.urls : [];

    if (!urls.length) {
      return NextResponse.json({ error: 'Body must include urls: string[]' }, { status: 400 });
    }

    const result = await submitIndexNow(urls);
    const status = result.status || (result.ok ? 200 : 500);
    return NextResponse.json({ ok: result.ok, status: result.status, body: result.body }, { status });
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error', details: `${error}` }, { status: 500 });
  }
}


