import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enterprise-level build configuration
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint for quality
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },
  
  // Enhanced image optimization for enterprise performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
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
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enterprise performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Stable experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@vercel/analytics'],
  },
  
  // Fix Supabase Edge Runtime compatibility
  serverExternalPackages: ['@supabase/supabase-js', '@supabase/ssr'],
  
  // Enterprise webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
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
      
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }
    
    return config;
  },
  
  // Enterprise security and caching headers
  async headers() {
    return [
      {
        source: '/Asset/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/((?!_next/).*)',
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
  
  // Enterprise output configuration
  output: 'standalone',
  
  // Environment configuration
  env: {
    CUSTOM_KEY: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  },
  
  // Enterprise routing configuration
  trailingSlash: false,
  reactStrictMode: true,
  
  // Performance monitoring
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
