import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-22',
  useCdn: false,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: { asset: { _ref: string } }) {
  return builder.image(source)
}

export interface SanityArticle {
  _id: string
  title: string
  slug: { current: string } // Fix: slug is an object with current property
  excerpt?: string
  content: string
  image?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  category: 'newsroom' | 'academy'
  source: string
  publishedAt: string
  featured: boolean
  showInSlider: boolean
  // Academy specific fields
  level?: string[] // ['newbie', 'intermediate', 'expert']
  topics?: string[] // ['DeFi', 'NFT', 'Wallet', etc.]
  networks?: string[] // ['Bitcoin Network', 'Ethereum Network', etc.]
  // Coin tags
  coinTags?: Array<{
    _id: string
    name: string
    symbol: string
    logo: {
      asset: {
        _ref: string
        _type: string
      }
      alt?: string
    }
    category: string
    isActive: boolean
    link?: string
  }>
}

export interface SanityArticleWithImage extends SanityArticle {
  imageUrl: string
}

// Fetch all articles
export async function getAllArticles(): Promise<SanityArticle[]> {
  const query = `
    *[_type == "article"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      source,
      publishedAt,
      featured,
      showInSlider,
      level,
      topics,
      networks,
      coinTags[]->{
        _id,
        name,
        symbol,
        logo,
        category,
        isActive,
        link
      }
    }
  `
  return client.fetch(query)
}

// Fetch articles by category
export async function getArticlesByCategory(category: 'newsroom' | 'academy'): Promise<SanityArticle[]> {
const query = `
  *[_type == "article" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    content,
    image,
    category,
    source,
    publishedAt,
    featured,
    showInSlider,
    level,
    topics,
    networks,
    coinTags[]->{
      _id,
      name,
      symbol,
      logo,
      category,
      isActive
    }
  }
`
  return client.fetch(query, { category })
}

// Fetch a single article by slug
export async function getArticleBySlug(slug: string): Promise<SanityArticle | null> {
  const query = `
    *[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      source,
      publishedAt,
      featured,
      showInSlider,
      level,
      topics,
      networks,
      coinTags[]->{
        _id,
        name,
        symbol,
        logo,
        category,
        isActive,
        link
      }
    }
  `
  return client.fetch(query, { slug })
}

// Fetch featured articles
export async function getFeaturedArticles(): Promise<SanityArticle[]> {
  const query = `
    *[_type == "article" && featured == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      source,
      publishedAt,
      featured,
      showInSlider,
      level,
      topics,
      networks,
      coinTags[]->{
        _id,
        name,
        symbol,
        logo,
        category,
        isActive,
        link
      }
    }
  `
  return client.fetch(query)
}

// Add image URLs to articles
export function addImageUrls(articles: SanityArticle[]): SanityArticleWithImage[] {
  // Ensure articles is an array
  if (!Array.isArray(articles)) {
    console.warn('addImageUrls: articles is not an array:', articles);
    return [];
  }
  
  return articles.map(article => {
    try {
      // Check if article.image exists and has the required structure
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
} 