/** @type {import('next').NextConfig} */
const nextConfig = {
  // ENTERPRISE-LEVEL: Production optimizations
  productionBrowserSourceMaps: false,
  
  // ENTERPRISE-LEVEL: Image optimization
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // ENTERPRISE-LEVEL: Experimental features for stability
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // ENTERPRISE-LEVEL: Server external packages for Edge Runtime compatibility
  serverExternalPackages: ['@supabase/realtime-js'],
  
  // ENTERPRISE-LEVEL: Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },
  
  // ENTERPRISE-LEVEL: Webpack configuration for stability
  webpack: (config, { dev, isServer }) => {
    // ENTERPRISE-LEVEL: Handle Supabase Edge Runtime issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    // ENTERPRISE-LEVEL: Production optimizations
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 20,
          },
        },
      };
      
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }
    
    return config;
  },
  
  // ENTERPRISE-LEVEL: Security headers
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // ENTERPRISE-LEVEL: Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // ENTERPRISE-LEVEL: Redirects for better routing
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
  
  // ENTERPRISE-LEVEL: API rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.coingecko.com/api/v3/:path*',
      },
    ];
  },
  
  // ENTERPRISE-LEVEL: Configuration
  trailingSlash: false,
  reactStrictMode: true,
  
  // ENTERPRISE-LEVEL: Performance optimizations
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // ENTERPRISE-LEVEL: TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ENTERPRISE-LEVEL: ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
