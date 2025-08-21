import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint and TypeScript errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enhanced image optimization
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
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enhanced compression and performance
  compress: true,
  poweredByHeader: false,
  
  // Performance optimizations
  experimental: {
    // Disable optimizeCss for now as it requires additional dependencies
    // optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@vercel/analytics'],
  },
  
  // Fix Supabase Edge Runtime warnings
  serverExternalPackages: ['@supabase/supabase-js', '@supabase/ssr'],
  
  // FORCE RESET: Disable ALL webpack customizations
  webpack: (config) => {
    // Return default Next.js webpack config without modifications
    return config;
  },
  
  // Headers for better caching and security
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
        // Development cache busting - less aggressive for chunks
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
      {
        // Exclude Next.js internal assets from strict headers
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
  
  // Ensure consistent output
  output: 'standalone',
  
  // Environment-specific configurations
  env: {
    CUSTOM_KEY: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  },
};

export default nextConfig;
