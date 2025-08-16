module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    ...(process.env.NODE_ENV === 'production' ? [
      ['@fullhuman/postcss-purgecss', {
        content: [
          './src/**/*.{js,jsx,ts,tsx}',
          './src/**/*.{html,md,mdx}',
          './public/**/*.html',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: [
          // Tailwind utilities that might be generated dynamically
          /^(text|bg|border|ring|shadow|animate|duration|ease|transition)/,
          // Crypto ticker animations
          /^crypto-ticker/,
          // Logo animations  
          /^logo-color/,
          // Animation states
          /^(hover|focus|active|group-hover)/,
          // Keep responsive prefixes
          /^(sm|md|lg|xl|2xl):/,
          // Component specific classes
          'line-clamp-2',
          'line-clamp-3',
          'scrollbar-hide',
          'custom-scrollbar',
          // Additional classes that might be used
          /^(w|h|p|m|flex|grid|hidden|block|inline|relative|absolute)/,
          /^(top|right|bottom|left|z-)/,
          /^(rounded|overflow|cursor|select)/,
          /^(opacity|scale|rotate|skew|translate)/,
          // Chart and component specific
          /^(chart|canvas|svg|path|line|area)/,
          /^(duniacrypto|dex)-/,
        ],
        // Ensure critical CSS is not purged
        rejected: true,
        // Keep important CSS rules
        keyframes: true,
        fontFace: true,
      }],
      'cssnano'
    ] : []),
  ],
}
