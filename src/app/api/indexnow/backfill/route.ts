import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles } from '@/utils/sanity';
import { buildArticleUrl, submitIndexNow } from '@/lib/indexnow';

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    // Optional guard with secret
    const secret = process.env.INDEXNOW_BACKFILL_SECRET || '';
    if (secret) {
      const header = req.headers.get('x-backfill-secret') || '';
      if (header !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const articles = await getAllArticles();
    const urls = (articles || [])
      .map(a => buildArticleUrl(a.category, a.slug?.current))
      .filter(Boolean);

    if (urls.length === 0) {
      return NextResponse.json({ ok: true, submitted: 0 });
    }

    // IndexNow supports large batches; submit in moderate chunks to be safe
    const batches = chunk(urls, 500);
    const results = [] as Array<{ ok: boolean; status: number }>; 
    for (const batch of batches) {
      // eslint-disable-next-line no-await-in-loop
      const res = await submitIndexNow(batch);
      results.push({ ok: res.ok, status: res.status });
    }

    const okCount = results.filter(r => r.ok).length;
    return NextResponse.json({ ok: okCount === results.length, batches: results.length, submitted: urls.length, results });
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error', details: `${error}` }, { status: 500 });
  }
}




