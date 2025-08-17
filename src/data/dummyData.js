// Dummy data for exchanges, airdrops, fundraising, and ICO/IDO
// This data can be manually filled and updated later

export const dummyExchanges = [
  {
    id: 1,
    name: 'Binance',
    logo: 'https://ui-avatars.com/api/?name=B&background=F7931A&color=fff&size=64&font-size=0.4',
    type: 'Centralized',
    tradingVolume: '$15.2B',
    pairs: '1500+',
    status: 'Active',
    website: 'https://binance.com',
    description: 'World\'s largest cryptocurrency exchange by trading volume'
  },
  {
    id: 2,
    name: 'Coinbase',
    logo: 'https://ui-avatars.com/api/?name=C&background=0052FF&color=fff&size=64&font-size=0.4',
    type: 'Centralized',
    tradingVolume: '$2.8B',
    pairs: '200+',
    status: 'Active',
    website: 'https://coinbase.com',
    description: 'Leading cryptocurrency exchange with user-friendly interface'
  },
  {
    id: 3,
    name: 'Kraken',
    logo: 'https://ui-avatars.com/api/?name=K&background=5841D8&color=fff&size=64&font-size=0.4',
    type: 'Centralized',
    tradingVolume: '$1.2B',
    pairs: '100+',
    status: 'Active',
    website: 'https://kraken.com',
    description: 'Secure cryptocurrency exchange with advanced trading features'
  },
  {
    id: 4,
    name: 'KuCoin',
    logo: 'https://ui-avatars.com/api/?name=K&background=00D2FF&color=fff&size=64&font-size=0.4',
    type: 'Centralized',
    tradingVolume: '$800M',
    pairs: '600+',
    status: 'Active',
    website: 'https://kucoin.com',
    description: 'People\'s exchange with wide range of altcoins'
  },
  {
    id: 5,
    name: 'OKX',
    logo: 'https://ui-avatars.com/api/?name=O&background=000000&color=fff&size=64&font-size=0.4',
    type: 'Centralized',
    tradingVolume: '$1.5B',
    pairs: '300+',
    status: 'Active',
    website: 'https://okx.com',
    description: 'Global cryptocurrency exchange with DeFi integration'
  }
];

export const dummyAirdrops = [
  {
    id: 1,
    project: 'Jupiter',
    token: 'JUP',
    network: 'Solana',
    status: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    totalAllocation: '100,000,000',
    minAllocation: '100',
    maxAllocation: '10,000',
    requirements: 'Hold SOL, Use Jupiter DEX',
    estimatedValue: '$50 - $500',
    participants: '50,000+',
    website: 'https://jup.ag',
    type: 'DeFi',
    category: 'DEX',
    logo: 'https://ui-avatars.com/api/?name=J&background=9945FF&color=fff&size=64&font-size=0.4'
  },
  {
    id: 2,
    project: 'Pyth Network',
    token: 'PYTH',
    network: 'Multi-chain',
    status: 'Completed',
    startDate: '2023-11-20',
    endDate: '2023-12-20',
    totalAllocation: '50,000,000',
    minAllocation: '50',
    maxAllocation: '5,000',
    requirements: 'Use Pyth Oracle, Deploy contracts',
    estimatedValue: '$25 - $250',
    participants: '30,000+',
    website: 'https://pyth.network',
    type: 'Infrastructure',
    category: 'Oracle',
    logo: 'https://ui-avatars.com/api/?name=P&background=00D4FF&color=fff&size=64&font-size=0.4'
  },
  {
    id: 3,
    project: 'Celestia',
    token: 'TIA',
    network: 'Celestia',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-03-01',
    totalAllocation: '200,000,000',
    minAllocation: '200',
    maxAllocation: '20,000',
    requirements: 'Stake TIA, Participate in governance',
    estimatedValue: '$100 - $1,000',
    participants: '75,000+',
    website: 'https://celestia.org',
    type: 'Infrastructure',
    category: 'Layer 1',
    logo: 'https://ui-avatars.com/api/?name=C&background=FF6B6B&color=fff&size=64&font-size=0.4'
  },
  {
    id: 4,
    project: 'Sui',
    token: 'SUI',
    network: 'Sui',
    status: 'Upcoming',
    startDate: '2024-03-01',
    endDate: '2024-05-01',
    totalAllocation: '150,000,000',
    minAllocation: '150',
    maxAllocation: '15,000',
    requirements: 'Build on Sui, Deploy dApps',
    estimatedValue: '$75 - $750',
    participants: '40,000+',
    website: 'https://sui.io',
    type: 'Infrastructure',
    category: 'Layer 1',
    logo: 'https://ui-avatars.com/api/?name=S&background=6C5CE7&color=fff&size=64&font-size=0.4'
  },
  {
    id: 5,
    project: 'Berachain',
    token: 'BERA',
    network: 'Berachain',
    status: 'Upcoming',
    startDate: '2024-04-01',
    endDate: '2024-06-01',
    totalAllocation: '80,000,000',
    minAllocation: '80',
    maxAllocation: '8,000',
    requirements: 'Testnet participation, Community engagement',
    estimatedValue: '$200 - $2,000',
    participants: '25,000+',
    website: 'https://berachain.com',
    type: 'Infrastructure',
    category: 'Layer 1',
    logo: 'https://ui-avatars.com/api/?name=B&background=00B894&color=fff&size=64&font-size=0.4'
  }
];

export const dummyFundraising = [
  {
    id: 1,
    project: 'EigenLayer',
    logo: 'https://ui-avatars.com/api/?name=E&background=4ECDC4&color=fff&size=64&font-size=0.4',
    type: 'Series A',
    amount: '$50M',
    investors: 'Paradigm, a16z, Polychain',
    date: '2023-12-15',
    status: 'Completed',
    description: 'Restaking protocol for Ethereum',
    website: 'https://eigenlayer.xyz'
  },
  {
    id: 2,
    project: 'Monad',
    logo: 'https://ui-avatars.com/api/?name=M&background=FF7675&color=fff&size=64&font-size=0.4',
    type: 'Seed',
    amount: '$19M',
    investors: 'Dragonfly, Placeholder, Lemniscap',
    date: '2023-11-20',
    status: 'Completed',
    description: 'High-performance EVM-compatible blockchain',
    website: 'https://monad.xyz'
  },
  {
    id: 3,
    project: 'LayerZero',
    logo: 'https://ui-avatars.com/api/?name=L&background=74B9FF&color=fff&size=64&font-size=0.4',
    type: 'Series B',
    amount: '$120M',
    investors: 'Sequoia, Andreessen Horowitz, Tiger Global',
    date: '2023-10-10',
    status: 'Completed',
    description: 'Cross-chain messaging protocol',
    website: 'https://layerzero.network'
  },
  {
    id: 4,
    project: 'Scroll',
    logo: 'https://ui-avatars.com/api/?name=S&background=FD79A8&color=fff&size=64&font-size=0.4',
    type: 'Series A',
    amount: 'Undisclosed',
    investors: 'Polychain, Bain Capital, Paradigm',
    date: '2023-09-15',
    status: 'Completed',
    description: 'Ethereum L2 scaling solution',
    website: 'https://scroll.io'
  },
  {
    id: 5,
    project: 'Manta Network',
    logo: 'https://ui-avatars.com/api/?name=M&background=A29BFE&color=fff&size=64&font-size=0.4',
    type: 'Series A',
    amount: '$25M',
    investors: 'LongHash, ParaFi, CMS',
    date: '2023-08-20',
    status: 'Completed',
    description: 'Privacy-preserving DeFi protocol',
    website: 'https://manta.network'
  }
];

export const dummyICOIDO = [
  {
    id: 1,
    project: 'Arbitrum',
    token: 'ARB',
    network: 'Ethereum',
    type: 'IDO',
    price: '$0.10',
    hardCap: '$50M',
    softCap: '$25M',
    startDate: '2023-03-23',
    endDate: '2023-03-25',
    status: 'Completed',
    description: 'Ethereum L2 scaling solution',
    website: 'https://arbitrum.io',
    logo: 'https://ui-avatars.com/api/?name=A&background=28A0F0&color=fff&size=64&font-size=0.4'
  },
  {
    id: 2,
    project: 'Optimism',
    token: 'OP',
    network: 'Ethereum',
    type: 'IDO',
    price: '$0.25',
    hardCap: '$150M',
    softCap: '$75M',
    startDate: '2022-05-31',
    endDate: '2022-06-02',
    status: 'Completed',
    description: 'Ethereum L2 optimistic rollup',
    website: 'https://optimism.io',
    logo: 'https://ui-avatars.com/api/?name=O&background=FF0420&color=fff&size=64&font-size=0.4'
  },
  {
    id: 3,
    project: 'Polygon',
    token: 'MATIC',
    network: 'Ethereum',
    type: 'ICO',
    price: '$0.00263',
    hardCap: '$5M',
    softCap: '$2.5M',
    startDate: '2019-04-26',
    endDate: '2019-05-26',
    status: 'Completed',
    description: 'Ethereum scaling and infrastructure',
    website: 'https://polygon.technology',
    logo: 'https://ui-avatars.com/api/?name=P&background=8247E5&color=fff&size=64&font-size=0.4'
  },
  {
    id: 4,
    project: 'Avalanche',
    token: 'AVAX',
    network: 'Avalanche',
    type: 'ICO',
    price: '$0.50',
    hardCap: '$42M',
    softCap: '$21M',
    startDate: '2020-07-15',
    endDate: '2020-08-15',
    status: 'Completed',
    description: 'High-performance blockchain platform',
    website: 'https://avax.network',
    logo: 'https://ui-avatars.com/api/?name=A&background=E84142&color=fff&size=64&font-size=0.4'
  },
  {
    id: 5,
    project: 'Solana',
    token: 'SOL',
    network: 'Solana',
    type: 'ICO',
    price: '$0.22',
    hardCap: '$25.6M',
    softCap: '$12.8M',
    startDate: '2020-03-16',
    endDate: '2020-04-16',
    status: 'Completed',
    description: 'High-performance blockchain platform',
    website: 'https://solana.com',
    logo: 'https://ui-avatars.com/api/?name=S&background=14F195&color=fff&size=64&font-size=0.4'
  }
];

// Helper function to get data by type
export const getDummyData = (type) => {
  switch (type.toLowerCase()) {
    case 'exchanges':
      return dummyExchanges;
    case 'airdrops':
      return dummyAirdrops;
    case 'fundraising':
      return dummyFundraising;
    case 'ico':
    case 'ido':
      return dummyICOIDO;
    default:
      return [];
  }
};

// Helper function to get data by ID
export const getDummyDataById = (type, id) => {
  const data = getDummyData(type);
  return data.find(item => item.id === id);
};

// Helper function to search data
export const searchDummyData = (type, query) => {
  const data = getDummyData(type);
  const searchTerm = query.toLowerCase();
  
  return data.filter(item => 
    item.name?.toLowerCase().includes(searchTerm) ||
    item.project?.toLowerCase().includes(searchTerm) ||
    item.token?.toLowerCase().includes(searchTerm) ||
    item.description?.toLowerCase().includes(searchTerm)
  );
};
