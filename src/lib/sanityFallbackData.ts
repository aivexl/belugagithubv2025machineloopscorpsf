// Fallback data for when Sanity API fails
export const fallbackAcademyArticles = [
  {
    _id: 'fallback-1',
    title: 'Getting Started with Cryptocurrency',
    slug: { current: 'getting-started-cryptocurrency' },
    excerpt: 'Learn the basics of cryptocurrency and blockchain technology from the ground up',
    content: 'This comprehensive guide covers everything you need to know about cryptocurrency, from understanding what blockchain is to making your first crypto purchase safely and securely.',
    image: {
      asset: {
        _ref: 'image-fallback-academy-1-800x450-webp',
        _type: 'reference'
      }
    },
    category: 'academy',
    source: 'Dunia Crypto',
    publishedAt: '2024-01-15T00:00:00.000Z',
    featured: true,
    showInSlider: false,
    level: 'Beginner',
    topics: 'Basics',
    networks: 'General'
  },
  {
    _id: 'fallback-2',
    title: 'Understanding Blockchain Technology',
    slug: { current: 'understanding-blockchain' },
    excerpt: 'Deep dive into how blockchain works and its real-world applications',
    content: 'Explore the fundamental concepts of blockchain technology, including consensus mechanisms, smart contracts, and how this revolutionary technology is transforming industries worldwide.',
    image: {
      asset: {
        _ref: 'image-fallback-academy-2-800x450-webp',
        _type: 'reference'
      }
    },
    category: 'academy',
    source: 'Dunia Crypto',
    publishedAt: '2024-01-10T00:00:00.000Z',
    featured: true,
    showInSlider: false,
    level: 'Intermediate',
    topics: 'Technology',
    networks: 'General'
  },
  {
    _id: 'fallback-3',
    title: 'DeFi Fundamentals: Decentralized Finance Explained',
    slug: { current: 'defi-fundamentals' },
    excerpt: 'Introduction to Decentralized Finance and its key concepts',
    content: 'Discover how DeFi is revolutionizing traditional financial services through decentralized protocols, yield farming, liquidity pools, and the future of finance.',
    image: {
      asset: {
        _ref: 'image-fallback-academy-3-800x450-webp',
        _type: 'reference'
      }
    },
    category: 'academy',
    source: 'Dunia Crypto',
    publishedAt: '2024-01-05T00:00:00.000Z',
    featured: true,
    showInSlider: false,
    level: 'Intermediate',
    topics: 'DeFi',
    networks: 'Ethereum'
  },
  {
    _id: 'fallback-4',
    title: 'NFTs: Beyond Digital Art',
    slug: { current: 'nfts-beyond-digital-art' },
    excerpt: 'Exploring the diverse applications of Non-Fungible Tokens',
    content: 'Learn about NFTs beyond just digital art - from gaming assets and virtual real estate to identity verification and supply chain management.',
    image: {
      asset: {
        _ref: 'image-fallback-academy-4-800x450-webp',
        _type: 'reference'
      }
    },
    category: 'academy',
    source: 'Dunia Crypto',
    publishedAt: '2024-01-01T00:00:00.000Z',
    featured: false,
    showInSlider: false,
    level: 'Beginner',
    topics: 'NFTs',
    networks: 'Multiple'
  },
  {
    _id: 'fallback-5',
    title: 'Cryptocurrency Trading Strategies',
    slug: { current: 'crypto-trading-strategies' },
    excerpt: 'Essential trading strategies for cryptocurrency markets',
    content: 'Master the fundamentals of crypto trading including technical analysis, risk management, portfolio diversification, and long-term investment strategies.',
    image: {
      asset: {
        _ref: 'image-fallback-academy-5-800x450-webp',
        _type: 'reference'
      }
    },
    category: 'academy',
    source: 'Dunia Crypto',
    publishedAt: '2023-12-28T00:00:00.000Z',
    featured: true,
    showInSlider: false,
    level: 'Advanced',
    topics: 'Trading',
    networks: 'General'
  }
];

export const fallbackNewsroomArticles = [
  {
    _id: 'fallback-news-1',
    title: 'Bitcoin Reaches New All-Time High',
    slug: { current: 'bitcoin-new-ath' },
    excerpt: 'Bitcoin has achieved a new milestone in the cryptocurrency market',
    content: 'The leading cryptocurrency has reached unprecedented heights, driven by institutional adoption and growing mainstream acceptance.',
    image: {
      asset: {
        _ref: 'image-fallback-news-1-800x450-webp',
        _type: 'reference'
      }
    },
    category: 'newsroom',
    source: 'Dunia Crypto',
    publishedAt: '2024-01-20T00:00:00.000Z',
    featured: true,
    showInSlider: true,
    level: null,
    topics: null,
    networks: null
  },
  {
    _id: 'fallback-news-2',
    title: 'Ethereum 2.0: The Future of Smart Contracts',
    slug: { current: 'ethereum-2-future' },
    excerpt: 'Major upgrades coming to Ethereum network',
    content: 'Ethereum 2.0 promises to revolutionize the network with improved scalability, security, and sustainability through proof-of-stake consensus.',
    image: {
      asset: {
        _ref: 'image-fallback-news-2-800x450-webp',
        _type: 'reference'
      }
    },
    category: 'newsroom',
    source: 'Dunia Crypto',
    publishedAt: '2024-01-18T00:00:00.000Z',
    featured: true,
    showInSlider: true,
    level: null,
    topics: null,
    networks: null
  }
];

// Function to get fallback data based on category
export function getFallbackArticles(category: string) {
  switch (category) {
    case 'academy':
      return fallbackAcademyArticles;
    case 'newsroom':
      return fallbackNewsroomArticles;
    default:
      return [];
  }
}
