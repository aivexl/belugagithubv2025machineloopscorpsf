/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in development to prevent 404 errors
  productionBrowserSourceMaps: false,
  
  // Optimize images - use remotePatterns instead of deprecated domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Experimental features - minimal for stability
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Compiler options to reduce bundle size and warnings
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
    // Optimize CSS
    styledComponents: true,
  },
  
  // Minimal webpack configuration for stability
  webpack: (config, { dev, isServer }) => {
    // Only apply minimal optimizations for production
    if (!isServer && !dev) {
      // Simple and stable chunk splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      };
      
      // Stable module and chunk IDs
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }
    
    return config;
  },
  
  // Headers for better performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
  
  // Rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.coingecko.com/api/v3/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
