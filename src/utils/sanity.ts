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
    *[_type == "article" && defined(publishedAt)] | order(publishedAt desc) {
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
  // Avoid stale cache by disabling Next.js caching for this fetch
  return client.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } })
}

// Fetch articles by category
export async function getArticlesByCategory(category: 'newsroom' | 'academy'): Promise<SanityArticle[]> {
const query = `
  *[_type == "article" && category == $category && defined(publishedAt)] | order(publishedAt desc) {
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
  return client.fetch(query, { category }, { cache: 'no-store', next: { revalidate: 0 } })
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
  return client.fetch(query, { slug }, { cache: 'no-store', next: { revalidate: 0 } })
}

// Fetch featured articles
export async function getFeaturedArticles(): Promise<SanityArticle[]> {
  const query = `
    *[_type == "article" && featured == true && defined(publishedAt)] | order(publishedAt desc) {
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
  return client.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } })
}

// Fetch articles filtered by network and optional category
export async function getArticlesByNetwork(network: string, category: 'academy' | 'newsroom' | 'both' = 'both'): Promise<SanityArticle[]> {
  const categoryFilter = category === 'both' ? '' : ` && category == "${category}"`;
  const query = `*[_type == "article"${categoryFilter} && defined(publishedAt) &&
    defined(networks) && count(networks) > 0 &&
    "${network}" in networks] | order(publishedAt desc) {
      _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
      coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
    }`;

  try {
    const result = await client.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } });
    return result || [];
  } catch (error) {
    console.error('Error fetching articles by network:', { network, category }, error);
    return [];
  }
}

// Fetch academy articles by coin symbol from Dunia Crypto
export async function getAcademyArticlesByCoin(coinSymbol: string): Promise<SanityArticle[]> {
  const queries = [
    // Try exact symbol match
    `*[_type == "article" && category == "academy" && source == "Dunia Crypto" &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbol]) > 0] | order(publishedAt desc)`,
    // Try uppercase symbol match
    `*[_type == "article" && category == "academy" && source == "Dunia Crypto" &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbolUpper]) > 0] | order(publishedAt desc)`,
    // Try lowercase symbol match
    `*[_type == "article" && category == "academy" && source == "Dunia Crypto" &&
      count(coinTags[]->) > 0 &&
      count(coinTags[]->[symbol == $coinSymbolLower]) > 0] | order(publishedAt desc)`,
  ]

  const fieldQuery = `{
    _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
    coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
  }`

  try {
    // Try exact symbol match first
    let result = await client.fetch(`${queries[0]} ${fieldQuery}`, { coinSymbol: coinSymbol }, { cache: 'no-store', next: { revalidate: 0 } })
    if (result && result.length > 0) return result

    // Try uppercase match
    result = await client.fetch(`${queries[1]} ${fieldQuery}`, { coinSymbolUpper: coinSymbol.toUpperCase() }, { cache: 'no-store', next: { revalidate: 0 } })
    if (result && result.length > 0) return result

    // Try lowercase match
    result = await client.fetch(`${queries[2]} ${fieldQuery}`, { coinSymbolLower: coinSymbol.toLowerCase() }, { cache: 'no-store', next: { revalidate: 0 } })
    return result || []
  } catch (error) {
    console.error('Error fetching academy articles by coin:', error)
    return []
  }
}

// Enhanced function to fetch articles by coin tags supporting both categories
export async function getArticlesByCoinTags(category?: 'academy' | 'newsroom' | 'both'): Promise<SanityArticle[]> {
  // Add category filter if specified
  let categoryFilter = ''
  if (category && category !== 'both') {
    categoryFilter = ` && category == "${category}"`
  }

  const query = `*[_type == "article" && source == "Dunia Crypto"${categoryFilter} && defined(publishedAt) &&
    count(coinTags[]->) > 0] | order(publishedAt desc) {
    _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks,
    coinTags[]->{ _id, name, symbol, logo, category, isActive, link }
  }`

  try {
    const result = await client.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } })
    console.log(`📊 getArticlesByCoinTags(${category}) returned ${result?.length || 0} articles`)
    return result || []
  } catch (error) {
    console.error('Error fetching articles by coin tags:', error)
    return []
  }
}

// Fetch academy articles with fallback to general academy articles
export async function getAcademyArticlesWithFallback(network: string): Promise<SanityArticle[]> {
  try {
    // First try to get network-specific articles
    const networkSpecificArticles = await getArticlesByNetwork(network, 'academy')
    if (networkSpecificArticles && networkSpecificArticles.length > 0) {
      return networkSpecificArticles
    }

    // Fallback to general academy articles from Dunia Crypto
    const generalQuery = `*[_type == "article" && category == "academy" && source == "Dunia Crypto"] | order(publishedAt desc) [0...4] {
      _id, title, slug, excerpt, content, image, category, source, publishedAt, featured, showInSlider, level, topics, networks
    }`

    return await client.fetch(generalQuery)
  } catch (error) {
    console.error('Error fetching academy articles with fallback:', error)
    return []
  }
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

// Get all available coin tags for filtering
export async function getAllCoinTags(): Promise<Array<{ _id: string; name: string; symbol: string; category: string; isActive: boolean }>> {
  try {
    const query = `*[_type == "coinTag" && isActive == true] | order(marketCapRank asc, name asc) {
      _id,
      name,
      symbol,
      category,
      isActive
    }`

    const coinTags = await client.fetch(query)
    return coinTags || []
  } catch (error) {
    console.error('Error fetching all coin tags:', error)
    return []
  }
} 