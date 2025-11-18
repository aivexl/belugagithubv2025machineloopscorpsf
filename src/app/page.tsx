import React from "react";
import { getAllArticles, addImageUrls } from "../utils/sanity";
import type { SanityArticleWithImage } from "../utils/sanity";
import HomeClient from "../components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beluga - Berita dan Analisis Crypto Indonesia Terkini | Platform Cryptocurrency Terdepan",
  description: "Platform terdepan untuk berita cryptocurrency, analisis market, dan edukasi blockchain di Indonesia. Dapatkan insight terbaru tentang Bitcoin, Ethereum, DeFi, NFT, dan crypto lainnya. Update harga crypto real-time, analisis teknikal, dan panduan investasi crypto untuk pemula hingga advanced.",
  keywords: [
    "berita crypto indonesia",
    "analisis cryptocurrency",
    "harga bitcoin hari ini",
    "harga ethereum",
    "crypto news indonesia",
    "beluga crypto",
    "platform crypto indonesia",
    "edukasi blockchain",
    "trading crypto",
    "investasi cryptocurrency",
    "defi indonesia",
    "nft indonesia",
    "market analysis crypto",
    "crypto price indonesia",
  ],
  openGraph: {
    title: "Beluga - Berita dan Analisis Crypto Indonesia Terkini",
    description: "Platform terdepan untuk berita cryptocurrency, analisis market, dan edukasi blockchain di Indonesia. Dapatkan insight terbaru tentang Bitcoin, Ethereum, dan crypto lainnya.",
    url: "https://beluga.id",
    siteName: "Beluga",
    images: [
      {
        url: "/Asset/belugalogov3white.png",
        width: 1200,
        height: 630,
        alt: "Beluga - Platform Crypto Indonesia",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beluga - Berita dan Analisis Crypto Indonesia Terkini",
    description: "Platform terdepan untuk berita cryptocurrency, analisis market, dan edukasi blockchain di Indonesia.",
    images: ["/Asset/belugalogov3white.png"],
  },
  alternates: {
    canonical: "https://beluga.id",
  },
};

// Always render dynamically so homepage content stays in sync with Sanity
export const dynamic = 'force-dynamic';

// Enterprise-level fallback data to prevent server crashes
const FALLBACK_ARTICLES: SanityArticleWithImage[] = [
  {
    _id: 'fallback-1',
    title: 'Bitcoin Mempertahankan Momentum Bullish',
    slug: { current: 'bitcoin-bullish-momentum' },
    excerpt: 'Bitcoin menunjukkan kekuatan bullish yang konsisten dengan support level yang solid.',
    content: 'Bitcoin berhasil mempertahankan momentum bullish dengan volume trading yang meningkat...',
    category: 'newsroom',
    source: 'Beluga Analytics',
    publishedAt: new Date().toISOString(),
    featured: true,
    showInSlider: true,
    imageUrl: '/Asset/duniacrypto.png'
  },
  {
    _id: 'fallback-2',
    title: 'Ethereum 2.0: Upgrade Terbesar dalam Sejarah Crypto',
    slug: { current: 'ethereum-2-upgrade' },
    excerpt: 'Ethereum 2.0 membawa perubahan fundamental dalam ekosistem blockchain.',
    content: 'Upgrade Ethereum 2.0 merupakan milestone terbesar dalam sejarah cryptocurrency...',
    category: 'academy',
    source: 'Beluga Research',
    publishedAt: new Date().toISOString(),
    featured: true,
    showInSlider: true,
    level: ['intermediate'],
    topics: ['DeFi', 'Blockchain'],
    networks: ['Ethereum Network'],
    imageUrl: '/Asset/duniacrypto.png'
  }
];

export default async function Home() {
  // Enterprise-level error handling with fallback data
  let articles: SanityArticleWithImage[] = FALLBACK_ARTICLES;
  
  try {
    console.log('Homepage: Attempting to fetch articles from Sanity...');
    const fetchedArticles = await getAllArticles();
    
    if (fetchedArticles && Array.isArray(fetchedArticles) && fetchedArticles.length > 0) {
      articles = addImageUrls(fetchedArticles);
      console.log(`Homepage: Successfully loaded ${articles.length} articles from Sanity`);
    } else {
      console.warn('Homepage: No articles returned from Sanity, using fallback data');
      articles = FALLBACK_ARTICLES;
    }
  } catch (error) {
    console.error('Homepage: Error fetching articles from Sanity, using fallback data:', error);
    articles = FALLBACK_ARTICLES;
  }

  return <HomeClient articles={articles as SanityArticleWithImage[]} />;
}
