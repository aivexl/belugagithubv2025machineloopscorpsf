/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', '@vercel/analytics']
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
  
  // Security headers (complementing middleware)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  },

  // Environment-specific settings
  env: {
    CUSTOM_NODE_ENV: process.env.NODE_ENV,
  },

  // Image optimization
  images: {
    domains: [
      'cdn.sanity.io',
      'assets.coingecko.com',
      'images.unsplash.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production client-side optimizations
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        auth: {
          name: 'auth',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@supabase|cookies-next)[\\/]/,
          priority: 30,
          reuseExistingChunk: true,
        },
        analytics: {
          name: 'analytics',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]@vercel[\\/]analytics[\\/]/,
          priority: 25,
          reuseExistingChunk: true,
        }
      }
    }

    // Suppress console warnings in production
    if (!dev) {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }

    return config
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development'
    }
  }
}

export default nextConfig