// Routes Manifest for Next.js 15
// This file helps prevent routing errors during development

export const routes = {
  pages: [
    '/',
    '/profile',
    '/auth/callback',
    '/api/health',
    '/api/auth/health',
    '/api/coingecko-proxy/global',
    '/api/coingecko-proxy/coins'
  ],
  api: [
    '/api/health',
    '/api/auth/health',
    '/api/coingecko-proxy/global',
    '/api/coingecko-proxy/coins'
  ]
};

export default routes;

