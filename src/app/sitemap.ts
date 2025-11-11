import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/client'
import { getAllArticles } from '@/utils/sanity'
import { createClient as createSanityClient } from 'next-sanity'
import { TOP_CRYPTO_IDS, getTrendingCoinIds } from '@/utils/getAllCoinIds'

// Base URL for the site
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://beluga.id' 
  : 'http://localhost:3000'

// Sanity client for fetching articles and news
const sanityClient = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-22',
  useCdn: false,
})

// Fetch all academy articles from Sanity
async function getAllAcademyArticles() {
  try {
    const query = `*[_type == "article" && category == "academy" && defined(publishedAt)] | order(publishedAt desc) {
      _id,
      slug
    }`
    const articles = await sanityClient.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } })
    return articles || []
  } catch (error) {
    console.error('Error fetching academy articles:', error)
    return []
  }
}

// Fetch all newsroom articles from Sanity
async function getAllNewsroomArticles() {
  try {
    const query = `*[_type == "article" && category == "newsroom" && defined(publishedAt)] | order(publishedAt desc) {
      _id,
      slug
    }`
    const articles = await sanityClient.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } })
    return articles || []
  } catch (error) {
    console.error('Error fetching newsroom articles:', error)
    return []
  }
}

// Fetch all news slugs
async function getAllNewsSlugs() {
  try {
    const articles = await getAllArticles()
    return articles.filter(article => article.category === 'newsroom')
      .map(article => article.slug?.current || '')
      .filter(Boolean)
  } catch (error) {
    console.error('Error fetching news slugs:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const lastModified = now.toISOString()

  // Prepare crypto IDs (only for chart-txns pages)
  let allCryptoIds = TOP_CRYPTO_IDS
  try {
    const trendingIds = await getTrendingCoinIds()
    allCryptoIds = [...new Set([...trendingIds, ...TOP_CRYPTO_IDS])].slice(0, 100)
  } catch (error) {
    console.error('Error fetching trending coins for sitemap:', error)
  }

  // Define static pages with high priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'hourly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/exchanges`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/airdrop`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fundraising`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ico-ido`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kamus`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/newsroom`,
      lastModified,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/asset`,
      lastModified,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/research`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/beluga-ai`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/academy`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/feed.xml`,
      lastModified,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
  ]


  // Fetch dynamic article pages
  const [academyArticles, newsroomArticles, newsArticles] = await Promise.all([
    getAllAcademyArticles(),
    getAllNewsroomArticles(),
    getAllNewsSlugs(),
  ])

  // Add academy articles
  const academyPages = academyArticles.map(article => ({
    url: `${baseUrl}/academy/${article.slug?.current || article.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Add newsroom articles
  const newsroomPages = newsroomArticles.map(article => ({
    url: `${baseUrl}/newsroom/${article.slug?.current || article.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Add news articles
  const newsPages = newsArticles.map(slug => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Add crypto chart transactions pages (allowed to be indexed)
  const cryptoChartTxPages = allCryptoIds.map(id => ({
    url: `${baseUrl}/crypto/${id}/chart-txns`,
    lastModified,
    changeFrequency: 'hourly' as const,
    priority: 0.7,
  }))

  // Combine all pages
  return [
    ...staticPages,
    ...academyPages,
    ...newsroomPages,
    ...newsPages,
    ...cryptoChartTxPages,
  ]
}

