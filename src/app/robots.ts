import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://beluga.id'
    : 'http://localhost:3000'

  const disallow = [
    '/api/',
    '/admin/',
    '/studio/',
    '/test/',
    '/test-*',
    '/profile',
    '/auth/',
    '/crypto/',
    '/crypto/*/chart',
    '/crypto/*/txns',
  ]

  const allow = ['/', '/crypto/*/chart-txns']

  return {
    rules: [
      { userAgent: '*', allow, disallow },
      { userAgent: 'Googlebot', allow, disallow },
      { userAgent: 'Bingbot', allow, disallow },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}


