import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://beluga.id' 
    : 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/studio/',
          '/test/',
          '/test-*',
          '/profile',
          '/auth/',
          '/studio/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/studio/',
          '/test/',
          '/test-*',
          '/profile',
          '/auth/',
          '/studio/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/studio/',
          '/test/',
          '/test-*',
          '/profile',
          '/auth/',
          '/studio/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

