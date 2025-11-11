import { NextRequest, NextResponse } from 'next/server';
import { submitIndexNow, buildArticleUrl, getSiteOrigin } from '@/lib/indexnow';

function isValidSecret(req: NextRequest): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET || '';
  if (!secret) return true; // allow if not configured
  const header = req.headers.get('x-sanity-secret') || req.headers.get('x-webhook-secret') || '';
  return header === secret;
}

type SanityDoc = {
  _type?: string;
  slug?: { current?: string } | string;
  category?: string;
  publishedAt?: string;
};

export async function POST(req: NextRequest) {
  try {
    if (!isValidSecret(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({} as Record<string, unknown>));

    // Common Sanity webhook formats
    const doc: SanityDoc = (body?.current as SanityDoc) || (body?.document as SanityDoc) || (body as SanityDoc) || {};
    const event = (body?.event as string) || (body?._eventType as string) || '';
    const operation = (body?.operation as string) || '';

    const type = (doc?._type || '').toLowerCase();
    if (type !== 'article') {
      return NextResponse.json({ ok: true, skipped: 'not-article', type });
    }

    // Extract slug
    let slug = '';
    if (typeof doc?.slug === 'string') slug = doc.slug;
    else if (doc?.slug && typeof doc.slug === 'object') slug = doc.slug.current || '';

    const category = (doc?.category || '').toString();

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // Only submit on publish/update/create events
    // Sanity webhook events: create, update, delete, publish, unpublish
    const shouldSubmit = 
      !event || 
      /^(create|publish|update|draft\.publish|publish\.create)$/i.test(event) ||
      operation === 'create' || 
      operation === 'update' ||
      operation === 'publish';

    if (!shouldSubmit) {
      return NextResponse.json({ 
        ok: true, 
        skipped: 'event-filter', 
        event, 
        operation,
        message: 'Event not in whitelist for IndexNow submission' 
      });
    }

    const origin = getSiteOrigin();
    const urlsToSubmit: string[] = [];

    // 1. Submit the article URL itself
    const articleUrl = buildArticleUrl(category, slug);
    urlsToSubmit.push(articleUrl);

    // 2. Submit homepage (for latest articles section)
    urlsToSubmit.push(origin);

    // 3. Submit category page (newsroom or academy)
    if (category === 'newsroom') {
      urlsToSubmit.push(`${origin}/newsroom`);
    } else if (category === 'academy') {
      urlsToSubmit.push(`${origin}/academy`);
    }

    // 4. Submit RSS feed (so search engines know there's new content)
    urlsToSubmit.push(`${origin}/feed.xml`);
    if (category === 'newsroom') {
      urlsToSubmit.push(`${origin}/feed/newsroom.xml`);
    } else if (category === 'academy') {
      urlsToSubmit.push(`${origin}/feed/academy.xml`);
    }

    // Submit all URLs to IndexNow
    const result = await submitIndexNow(urlsToSubmit);
    
    return NextResponse.json({ 
      ok: result.ok, 
      status: result.status, 
      submitted: urlsToSubmit.length,
      urls: urlsToSubmit,
      articleUrl,
      event,
      operation,
      body: result.body
    });
  } catch (error) {
    console.error('IndexNow webhook error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}




