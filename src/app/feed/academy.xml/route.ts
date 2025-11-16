import { NextResponse } from 'next/server';
import { getArticlesByCategory, addImageUrls } from '../../../utils/sanity';

const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://beluga.id' 
  : 'http://localhost:3000';

// Helper function to extract text from portable text content
function extractTextFromContent(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((block: any) => {
        if (block._type === 'block' && block.children) {
          return block.children.map((child: any) => child.text || '').join('');
        }
        return '';
      })
      .join(' ')
      .substring(0, 500);
  }
  return '';
}

// Helper function to format date for RSS (RFC 822)
function formatRSSDate(date: string): string {
  const d = new Date(date);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const day = days[d.getUTCDay()];
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');
  
  return `${day}, ${String(d.getUTCDate()).padStart(2, '0')} ${month} ${year} ${hours}:${minutes}:${seconds} +0000`;
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const articles = await getArticlesByCategory('academy');
    const articlesWithImages = addImageUrls(articles);
    
    // Sort by published date (newest first) and limit to 50 most recent
    const sortedArticles = articlesWithImages
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 50);

    // Build RSS XML
    const rssItems = sortedArticles.map((article) => {
      const articleUrl = `${baseUrl}/academy/${article.slug?.current || article.slug}`;
      const imageUrl = article.imageUrl || `${baseUrl}/Asset/belugalogov3white.png`;
      const description = article.excerpt || extractTextFromContent(article.content);
      const pubDate = formatRSSDate(article.publishedAt);
      const guid = article._id;

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="false">${guid}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(article.source || 'Beluga Team')}</author>
      <category>Academy</category>
      <enclosure url="${imageUrl}" type="image/jpeg" />
    </item>`;
    }).join('\n');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Beluga Academy - Edukasi Crypto & Blockchain</title>
    <link>${baseUrl}/academy</link>
    <description>Edukasi cryptocurrency, blockchain, dan web3 dari Beluga. Panduan lengkap untuk pemula hingga expert tentang teknologi blockchain dan aset digital.</description>
    <language>id-ID</language>
    <lastBuildDate>${formatRSSDate(new Date().toISOString())}</lastBuildDate>
    <pubDate>${formatRSSDate(new Date().toISOString())}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/Asset/belugalogov3white.png</url>
      <title>Beluga Academy</title>
      <link>${baseUrl}/academy</link>
    </image>
    <atom:link href="${baseUrl}/feed/academy.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating Academy RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}



