import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env['NEXT_PUBLIC_SANITY_API_VERSION'] || '2025-07-22',
  useCdn: false,
});

const builder = imageUrlBuilder(client);

function urlFor(source: { asset: { _ref: string } }) {
  return builder.image(source);
}

interface SanityArticle {
  _id: string;
  title: string;
  excerpt?: string;
  slug: { current: string };
  image?: { asset: { _ref: string } };
  publishedAt: string;
  source: string;
  category: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    if (!query) {
      return NextResponse.json([]);
    }

    // Build the GROQ query
    let groqQuery = `
      *[_type == "article" && (
        title match "*${query}*" ||
        excerpt match "*${query}*" ||
        content match "*${query}*"
      )]
    `;

    // Add category filter if specified
    if (category) {
      groqQuery = `
        *[_type == "article" && category == "${category}" && (
          title match "*${query}*" ||
          excerpt match "*${query}*" ||
          content match "*${query}*"
        )]
      `;
    }

    groqQuery += `
      {
        _id,
        title,
        excerpt,
        slug,
        image,
        publishedAt,
        source,
        category
      } | order(publishedAt desc)
    `;

    const results = await client.fetch(groqQuery);

    // Add image URLs to results
    const resultsWithImages = results.map((article: SanityArticle) => {
      try {
        if (article.image && article.image.asset && article.image.asset._ref) {
          const imageUrl = urlFor(article.image).url();
          return {
            ...article,
            imageUrl: imageUrl || '/Asset/duniacrypto.png'
          };
        } else {
          return {
            ...article,
            imageUrl: '/Asset/duniacrypto.png'
          };
        }
      } catch (error) {
        console.warn('Error generating image URL for article:', article._id, error);
        return {
          ...article,
          imageUrl: '/Asset/duniacrypto.png'
        };
      }
    });

    return NextResponse.json(resultsWithImages);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
} 