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
    '/auth/',
  ]

  const allow = [
    '/',
    '/cryptocurrencies/*',
    '/crypto/*',
    '/newsroom',
    '/about',
    '/contact',
    '/exchanges',
    '/airdrop',
    '/fundraising',
    '/ico-ido',
    '/glossary',
    '/kamus',
    '/trending',
    '/asset',
    '/research',
    '/search',
    '/beluga-ai',
    '/logo',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow,
        disallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow,
        disallow,
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow,
        disallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'Slurp',
        allow,
        disallow,
        crawlDelay: 2,
      },
      {
        userAgent: 'DuckDuckBot',
        allow,
        disallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'Baiduspider',
        allow,
        disallow,
        crawlDelay: 2,
      },
      {
        userAgent: 'Yandex',
        allow,
        disallow,
        crawlDelay: 2,
      },
      // Allow AI Bots for better indexing
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended'],
        allow: ['/'],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}


