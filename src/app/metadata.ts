import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dunia Crypto - Platform Berita dan Edukasi Cryptocurrency",
  description: "Platform terdepan untuk berita cryptocurrency terbaru, edukasi blockchain, dan analisis pasar crypto di Indonesia.",
  keywords: "cryptocurrency, bitcoin, blockchain, crypto news, edukasi crypto, trading crypto",
  authors: [{ name: "Dunia Crypto Team" }],
  creator: "Dunia Crypto",
  publisher: "Dunia Crypto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://duniacrypto.com'),
  openGraph: {
    title: "Dunia Crypto - Platform Berita dan Edukasi Cryptocurrency",
    description: "Platform terdepan untuk berita cryptocurrency terbaru, edukasi blockchain, dan analisis pasar crypto di Indonesia.",
    url: 'https://duniacrypto.com',
    siteName: 'Dunia Crypto',
    images: [
      {
        url: '/Asset/duniacrypto.png',
        width: 1200,
        height: 630,
        alt: 'Dunia Crypto Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dunia Crypto - Platform Berita dan Edukasi Cryptocurrency",
    description: "Platform terdepan untuk berita cryptocurrency terbaru, edukasi blockchain, dan analisis pasar crypto di Indonesia.",
    images: ['/Asset/duniacrypto.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}; 