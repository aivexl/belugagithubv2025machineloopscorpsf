/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'duniacrypto-bg': '#0e1118',
        'duniacrypto-panel': '#141722',
        'duniacrypto-green': '#16c784',
        'duniacrypto-red': '#ea3943',
        'duniacrypto-blue': '#4878ff',
        // DexScreener colors
        "dex-bg-primary": "var(--color-bg-primary)",
        "dex-bg-secondary": "var(--color-bg-secondary)",
        "dex-bg-tertiary": "var(--color-bg-tertiary)",
        "dex-bg-highlight": "var(--color-bg-highlight)",
        "dex-text-primary": "var(--color-text-primary)",
        "dex-text-secondary": "var(--color-text-secondary)",
        "dex-text-tertiary": "var(--color-text-tertiary)",
        "dex-border": "var(--color-border)",
        "dex-green": "var(--color-green)",
        "dex-red": "var(--color-red)",
        "dex-blue": "var(--color-blue)",
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out forwards',
        'pulse-green': 'pulseGreen 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'slide-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'pulseGreen': {
          '0%, 100%': {
            borderColor: 'rgba(34, 197, 94, 0.5)',
            boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.5)',
          },
          '50%': {
            borderColor: 'rgba(34, 197, 94, 1)',
            boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.3)',
          },
        },
      },
    },
  },
  plugins: [],
} 