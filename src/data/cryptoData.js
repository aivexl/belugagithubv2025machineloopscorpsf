// Data untuk semua kategori: Exchanges, Airdrop, ICO/IDO, Fundraising, dan Kamus WEB3

// ===== EXCHANGES DATA =====
export const exchangesData = [
  {
    id: 1,
    name: 'Binance',
    country: 'Malta',
    region: 'Europe',
    founded: '2017-07-14',
    website: 'https://www.binance.com',
    type: 'Centralized',
    status: 'Active',
    description: 'World\'s largest cryptocurrency exchange by trading volume',
    logo: 'https://ui-avatars.com/api/?name=B&background=F7931A&color=fff&size=64&font-size=0.4',
    tradingVolume: '$15.2B',
    pairs: '1500+',
    features: ['Spot Trading', 'Futures', 'Options', 'Staking', 'NFT Marketplace']
  },
  {
    id: 2,
    name: 'Coinbase',
    country: 'United States',
    region: 'North America',
    founded: '2012-06-20',
    website: 'https://www.coinbase.com',
    type: 'Centralized',
    status: 'Active',
    description: 'Leading cryptocurrency exchange with user-friendly interface',
    logo: 'https://ui-avatars.com/api/?name=C&background=0052FF&color=fff&size=64&font-size=0.4',
    tradingVolume: '$2.8B',
    pairs: '200+',
    features: ['Spot Trading', 'Advanced Trading', 'Staking', 'Earn Programs']
  },
  {
    id: 3,
    name: 'Uniswap',
    country: 'United States',
    region: 'North America',
    founded: '2018-11-02',
    website: 'https://app.uniswap.org',
    type: 'Decentralized',
    status: 'Active',
    description: 'Leading decentralized exchange protocol on Ethereum',
    logo: 'https://ui-avatars.com/api/?name=U&background=FF007A&color=fff&size=64&font-size=0.4',
    tradingVolume: '$500M',
    pairs: '1000+',
    features: ['AMM', 'Liquidity Mining', 'Governance Token', 'Multi-Chain']
  }
];

// ===== AIRDROP DATA =====
export const airdropData = [
  {
    id: 1,
    project: 'Jupiter',
    token: 'JUP',
    network: 'Solana',
    status: 'Completed',
    startDate: '2024-01-31',
    endDate: '2024-01-31',
    totalReward: '1,000,000,000 JUP',
    participants: '955,000+',
    website: 'https://jup.ag',
    estimatedValue: '$0.50 - $2.00',
    logo: 'https://ui-avatars.com/api/?name=JUP&background=9945FF&color=fff&size=64&font-size=0.4',
    description: 'Jupiter is a leading DEX aggregator on Solana, providing the best prices for token swaps.'
  },
  {
    id: 2,
    project: 'Ethena',
    token: 'ENA',
    network: 'Ethereum',
    status: 'Completed',
    startDate: '2024-04-02',
    endDate: '2024-04-02',
    totalReward: '750,000,000 ENA',
    participants: '500,000+',
    website: 'https://ethena.fi',
    estimatedValue: '$0.80 - $1.50',
    logo: 'https://ui-avatars.com/api/?name=ENA&background=9945FF&color=fff&size=64&font-size=0.4',
    description: 'Ethena is a synthetic dollar protocol built on Ethereum.'
  }
];

// ===== ICO/IDO DATA =====
export const icoIdoData = [
  {
    id: 1,
    project: 'Ethena',
    token: 'ENA',
    network: 'Ethereum',
    status: 'Completed',
    price: '$0.05',
    raised: '$14,000,000',
    participants: '50,000+',
    website: 'https://ethena.fi',
    category: 'DeFi',
    currentPrice: '$0.85',
    roi: '+1600%',
    vesting: '6 months',
    logo: 'https://ui-avatars.com/api/?name=ENA&background=FF6B35&color=fff&size=64&font-size=0.4',
    description: 'Ethena is a synthetic dollar protocol built on Ethereum.'
  },
  {
    id: 2,
    project: 'Monad',
    token: 'MON',
    network: 'Monad',
    status: 'Upcoming',
    price: '$0.10',
    raised: '$225,000,000',
    participants: '100,000+',
    website: 'https://monad.xyz',
    category: 'Infrastructure',
    currentPrice: 'TBD',
    roi: 'TBD',
    vesting: '12 months',
    logo: 'https://ui-avatars.com/api/?name=MON&background=FF6B35&color=fff&size=64&font-size=0.4',
    description: 'Monad is a high-performance EVM-compatible blockchain.'
  }
];

// ===== FUNDRAISING DATA =====
export const fundraisingData = [
  {
    id: 1,
    project: 'Monad',
    category: 'Infrastructure',
    status: 'Completed',
    raised: '$225,000,000',
    valuation: '$3,000,000,000',
    date: '2024-04-09',
    round: 'Series A',
    website: 'https://monad.xyz',
    useCase: 'EVM scaling solution',
    investors: ['Paradigm', 'Electric Capital', 'Coinbase Ventures'],
    logo: 'https://ui-avatars.com/api/?name=MON&background=00D4FF&color=fff&size=64&font-size=0.4',
    description: 'Monad is a high-performance EVM-compatible blockchain designed for high-throughput applications.'
  },
  {
    id: 2,
    project: 'EigenLayer',
    category: 'Infrastructure',
    status: 'Completed',
    raised: '$100,000,000',
    valuation: '$1,000,000,000',
    date: '2024-02-22',
    round: 'Series B',
    website: 'https://eigenlayer.xyz',
    useCase: 'Restaking protocol',
    investors: ['a16z', 'Polychain Capital', 'Coinbase Ventures'],
    logo: 'https://ui-avatars.com/api/?name=EIG&background=00D4FF&color=fff&size=64&font-size=0.4',
    description: 'EigenLayer is a restaking protocol that allows users to restake their ETH to secure additional protocols.'
  }
];

// ===== WEB3 GLOSSARY DATA =====
export const web3GlossaryData = [
  {
    id: 1,
    term: 'AMM',
    category: 'Protocol',
    definition: 'Automated Market Maker - A protocol that uses mathematical formulas to price assets and provide liquidity.',
    example: 'Uniswap uses an AMM model where x * y = k to determine token prices.',
    relatedTerms: ['Liquidity Pool', 'Impermanent Loss', 'Yield Farming'],
    logo: 'https://ui-avatars.com/api/?name=AMM&background=1E40AF&color=fff&size=64&font-size=0.4'
  },
  {
    id: 2,
    term: 'DeFi',
    category: 'Protocol',
    definition: 'Decentralized Finance - Financial services built on blockchain networks without traditional intermediaries.',
    example: 'Compound allows users to lend and borrow cryptocurrencies without a bank.',
    relatedTerms: ['AMM', 'Yield Farming', 'Liquidity Mining'],
    logo: 'https://ui-avatars.com/api/?name=DEFI&background=1E40AF&color=fff&size=64&font-size=0.4'
  },
  {
    id: 3,
    term: 'Yield Farming',
    category: 'Strategy',
    definition: 'A strategy where users provide liquidity to DeFi protocols in exchange for rewards.',
    example: 'Users can farm yield by providing ETH/USDC liquidity to Uniswap and earning UNI tokens.',
    relatedTerms: ['Liquidity Mining', 'AMM', 'DeFi'],
    logo: 'https://ui-avatars.com/api/?name=YIELD&background=1E40AF&color=fff&size=64&font-size=0.4'
  }
];

// ===== HELPER FUNCTIONS =====

// Exchange functions
export const getExchangeById = (id) => exchangesData.find(exchange => exchange.id === id);
export const getExchangesByType = (type) => exchangesData.filter(exchange => exchange.type === type);
export const getExchangesByRegion = (region) => exchangesData.filter(exchange => exchange.region === region);
export const searchExchanges = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return exchangesData.filter(exchange => 
    exchange.name.toLowerCase().includes(lowercaseQuery) ||
    exchange.country.toLowerCase().includes(lowercaseQuery) ||
    exchange.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Airdrop functions
export const getAirdropById = (id) => airdropData.find(airdrop => airdrop.id === id);
export const getAirdropsByStatus = (status) => airdropData.filter(airdrop => airdrop.status === status);
export const getAirdropsByNetwork = (network) => airdropData.filter(airdrop => airdrop.network === network);
export const searchAirdrops = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return airdropData.filter(airdrop => 
    airdrop.project.toLowerCase().includes(lowercaseQuery) ||
    airdrop.token.toLowerCase().includes(lowercaseQuery) ||
    airdrop.description.toLowerCase().includes(lowercaseQuery)
  );
};

// ICO/IDO functions
export const getIcoIdoById = (id) => icoIdoData.find(ico => ico.id === id);
export const getIcoIdosByStatus = (status) => icoIdoData.filter(ico => ico.status === status);
export const getIcoIdosByCategory = (category) => icoIdoData.filter(ico => ico.category === category);
export const searchIcoIdos = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return icoIdoData.filter(ico => 
    ico.project.toLowerCase().includes(lowercaseQuery) ||
    ico.token.toLowerCase().includes(lowercaseQuery) ||
    ico.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Fundraising functions
export const getFundraisingById = (id) => fundraisingData.find(fund => fund.id === id);
export const getFundraisingByStatus = (status) => fundraisingData.filter(fund => fund.status === status);
export const getFundraisingByCategory = (category) => fundraisingData.filter(fund => fund.category === category);
export const searchFundraising = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return fundraisingData.filter(fund => 
    fund.project.toLowerCase().includes(lowercaseQuery) ||
    fund.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Web3 Glossary functions
export const getWeb3TermById = (id) => web3GlossaryData.find(term => term.id === id);
export const getWeb3TermsByCategory = (category) => web3GlossaryData.filter(term => term.category === category);
export const searchWeb3Terms = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return web3GlossaryData.filter(term => 
    term.term.toLowerCase().includes(lowercaseQuery) ||
    term.definition.toLowerCase().includes(lowercaseQuery) ||
    term.example.toLowerCase().includes(lowercaseQuery)
  );
};

// CRUD functions for all categories
export const addExchange = (exchangeData) => {
  const newId = Math.max(...exchangesData.map(e => e.id)) + 1;
  const newExchange = { id: newId, ...exchangeData, status: exchangeData.status || 'Active' };
  exchangesData.push(newExchange);
  return newExchange;
};

export const addAirdrop = (airdropData) => {
  const newId = Math.max(...airdropData.map(a => a.id)) + 1;
  const newAirdrop = { id: newId, ...airdropData, status: airdropData.status || 'Upcoming' };
  airdropData.push(newAirdrop);
  return newAirdrop;
};

export const addIcoIdo = (icoData) => {
  const newId = Math.max(...icoIdoData.map(i => i.id)) + 1;
  const newIco = { id: newId, ...icoData, status: icoData.status || 'Upcoming' };
  icoIdoData.push(newIco);
  return newIco;
};

export const addFundraising = (fundData) => {
  const newId = Math.max(...fundraisingData.map(f => f.id)) + 1;
  const newFund = { id: newId, ...fundData, status: fundData.status || 'Ongoing' };
  fundraisingData.push(newFund);
  return newFund;
};

export const addWeb3Term = (termData) => {
  const newId = Math.max(...web3GlossaryData.map(t => t.id)) + 1;
  const newTerm = { id: newId, ...termData };
  web3GlossaryData.push(newTerm);
  return newTerm;
};

// Update functions
export const updateExchange = (id, updateData) => {
  const index = exchangesData.findIndex(e => e.id === id);
  if (index !== -1) {
    exchangesData[index] = { ...exchangesData[index], ...updateData };
    return exchangesData[index];
  }
  return null;
};

export const updateAirdrop = (id, updateData) => {
  const index = airdropData.findIndex(a => a.id === id);
  if (index !== -1) {
    airdropData[index] = { ...airdropData[index], ...updateData };
    return airdropData[index];
  }
  return null;
};

export const updateIcoIdo = (id, updateData) => {
  const index = icoIdoData.findIndex(i => i.id === id);
  if (index !== -1) {
    icoIdoData[index] = { ...icoIdoData[index], ...updateData };
    return icoIdoData[index];
  }
  return null;
};

export const updateFundraising = (id, updateData) => {
  const index = fundraisingData.findIndex(f => f.id === id);
  if (index !== -1) {
    fundraisingData[index] = { ...fundraisingData[index], ...updateData };
    return fundraisingData[index];
  }
  return null;
};

export const updateWeb3Term = (id, updateData) => {
  const index = web3GlossaryData.findIndex(t => t.id === id);
  if (index !== -1) {
    web3GlossaryData[index] = { ...web3GlossaryData[index], ...updateData };
    return web3GlossaryData[index];
  }
  return null;
};

// Delete functions
export const deleteExchange = (id) => {
  const index = exchangesData.findIndex(e => e.id === id);
  if (index !== -1) {
    return exchangesData.splice(index, 1)[0];
  }
  return null;
};

export const deleteAirdrop = (id) => {
  const index = airdropData.findIndex(a => a.id === id);
  if (index !== -1) {
    return airdropData.splice(index, 1)[0];
  }
  return null;
};

export const deleteIcoIdo = (id) => {
  const index = icoIdoData.findIndex(i => i.id === id);
  if (index !== -1) {
    return icoIdoData.splice(index, 1)[0];
  }
  return null;
};

export const deleteFundraising = (id) => {
  const index = fundraisingData.findIndex(f => f.id === id);
  if (index !== -1) {
    return fundraisingData.splice(index, 1)[0];
  }
  return null;
};

export const deleteWeb3Term = (id) => {
  const index = web3GlossaryData.findIndex(t => t.id === id);
  if (index !== -1) {
    return web3GlossaryData.splice(index, 1)[0];
  }
  return null;
};