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
        ],
      }],
      'cssnano'
    ] : []),
  ],
}
