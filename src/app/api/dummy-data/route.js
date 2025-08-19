import { NextResponse } from 'next/server';

// Comprehensive dummy data for various sections
const exchanges = [
  {
    id: 1,
    name: 'Binance',
    country: 'Global',
    url: 'https://binance.com',
    image: 'https://assets.coingecko.com/markets/images/52/large/binance.jpg',
    trust_score: 10,
    trust_score_rank: 1,
    trade_volume_24h_btc: 1250000.5,
    trade_volume_24h_btc_normalized: 1250000.5
  },
  {
    id: 2,
    name: 'Coinbase Exchange',
    country: 'United States',
    url: 'https://pro.coinbase.com',
    image: 'https://assets.coingecko.com/markets/images/23/large/coinbase_exchange.jpg',
    trust_score: 10,
    trust_score_rank: 2,
    trade_volume_24h_btc: 850000.3,
    trade_volume_24h_btc_normalized: 850000.3
  },
  {
    id: 3,
    name: 'Kraken',
    country: 'United States',
    url: 'https://kraken.com',
    image: 'https://assets.coingecko.com/markets/images/24/large/kraken.jpg',
    trust_score: 10,
    trust_score_rank: 3,
    trade_volume_24h_btc: 450000.7,
    trade_volume_24h_btc_normalized: 450000.7
  },
  {
    id: 4,
    name: 'KuCoin',
    country: 'Seychelles',
    url: 'https://kucoin.com',
    image: 'https://assets.coingecko.com/markets/images/151/large/kucoin.jpg',
    trust_score: 9,
    trust_score_rank: 4,
    trade_volume_24h_btc: 380000.2,
    trade_volume_24h_btc_normalized: 380000.2
  },
  {
    id: 5,
    name: 'OKX',
    country: 'Malta',
    url: 'https://okx.com',
    image: 'https://assets.coingecko.com/markets/images/294/large/okx.jpg',
    trust_score: 9,
    trust_score_rank: 5,
    trade_volume_24h_btc: 320000.8,
    trade_volume_24h_btc_normalized: 320000.8
  }
];

const airdrops = [
  {
    id: 1,
    project: 'Jupiter',
    token: 'JUP',
    network: 'Solana',
    type: 'Retroactive',
    category: 'DeFi',
    startDate: '2024-01-31',
    endDate: '2024-02-14',
    totalAllocation: '10000000',
    minAllocation: '100',
    maxAllocation: '10000',
    status: 'Active',
    description: 'Jupiter is Solana\'s leading DEX aggregator, offering the best prices and lowest fees across all Solana DEXs.',
    requirements: 'Must have used Jupiter before January 2024',
    estimatedValue: '$500-2000',
    link: 'https://jup.ag/airdrop'
  },
  {
    id: 2,
    project: 'Pyth Network',
    token: 'PYTH',
    network: 'Multi-chain',
    type: 'Retroactive',
    category: 'Oracle',
    startDate: '2023-11-20',
    endDate: '2023-12-04',
    totalAllocation: '255000000',
    minAllocation: '50',
    maxAllocation: '15000',
    status: 'Completed',
    description: 'Pyth Network is a first-party oracle network that provides real-time market data to smart contracts.',
    requirements: 'Must have used Pyth-powered protocols',
    estimatedValue: '$100-3000',
    link: 'https://pyth.network/airdrop'
  },
  {
    id: 3,
    project: 'Celestia',
    token: 'TIA',
    network: 'Celestia',
    type: 'Genesis',
    category: 'Modular Blockchain',
    startDate: '2023-10-31',
    endDate: '2023-11-14',
    totalAllocation: '60000000',
    minAllocation: '100',
    maxAllocation: '5000',
    status: 'Completed',
    description: 'Celestia is the first modular blockchain network that enables anyone to easily deploy their own blockchain.',
    requirements: 'Must have participated in testnet or used Celestia',
    estimatedValue: '$200-1000',
    link: 'https://celestia.org/airdrop'
  }
];

const fundraising = [
  {
    id: 1,
    project: 'EigenLayer',
    token: 'EIGEN',
    network: 'Ethereum',
    category: 'Restaking',
    fundingRound: 'Series B',
    amount: '$100M',
    valuation: '$1.5B',
    date: '2024-01-15',
    investors: 'a16z, Paradigm, Polychain',
    description: 'EigenLayer is a protocol built on Ethereum that introduces restaking, a new primitive in cryptoeconomic security.',
    status: 'Active',
    link: 'https://eigenlayer.xyz'
  },
  {
    id: 2,
    project: 'Scroll',
    token: 'SCROLL',
    network: 'Ethereum L2',
    category: 'ZK-Rollup',
    fundingRound: 'Series A',
    amount: '50M',
    valuation: '1.8B',
    date: '2023-12-20',
    investors: 'Polychain, Sequoia, Bain Capital',
    description: 'Scroll is a zkEVM-based zkRollup on Ethereum that enables native compatibility for existing Ethereum applications.',
    status: 'Active',
    link: 'https://scroll.io'
  },
  {
    id: 3,
    project: 'Manta Network',
    token: 'MANTA',
    network: 'Polkadot',
    category: 'Privacy',
    fundingRound: 'Series B',
    amount: '35M',
    valuation: '500M',
    date: '2023-11-10',
    investors: 'LongHash Ventures, ParaFi, CMS',
    description: 'Manta Network is a privacy-preserving DeFi protocol built on Polkadot.',
    status: 'Active',
    link: 'https://manta.network'
  }
];

const ico = [
  {
    id: 1,
    project: 'Sui',
    token: 'SUI',
    network: 'Sui',
    category: 'Layer 1',
    startDate: '2023-04-23',
    endDate: '2023-05-03',
    price: '$0.10',
    totalSupply: '10000000000',
    softCap: '50M',
    hardCap: '100M',
    status: 'Completed',
    description: 'Sui is a Layer 1 blockchain designed from the ground up to make digital asset ownership fast, private, secure, and accessible to everyone.',
    raised: '100M',
    link: 'https://sui.io'
  },
  {
    id: 2,
    project: 'Aptos',
    token: 'APT',
    network: 'Aptos',
    category: 'Layer 1',
    startDate: '2022-10-12',
    endDate: '2022-10-26',
    price: '$0.08',
    totalSupply: '1000000000',
    softCap: '150M',
    hardCap: '200M',
    status: 'Completed',
    description: 'Aptos is a Layer 1 blockchain that aims to bring mainstream adoption to web3 through better technology and user experience.',
    raised: '200M',
    link: 'https://aptos.dev'
  },
  {
    id: 3,
    project: 'Sei Network',
    token: 'SEI',
    network: 'Sei',
    category: 'Layer 1',
    startDate: '2023-08-15',
    endDate: '2023-08-29',
    price: '$0.05',
    totalSupply: '10000000000',
    softCap: '25M',
    hardCap: '50M',
    status: 'Completed',
    description: 'Sei Network is the fastest Layer 1 blockchain, built for trading and built for you.',
    raised: '50M',
    link: 'https://sei.io'
  }
];

// Market data for fallback
const marketData = {
  total_market_cap: { usd: 2500000000000 },
  total_volume: { usd: 80000000000 },
  market_cap_change_percentage_24h_usd: 2.5,
  active_cryptocurrencies: 2500,
  market_cap_percentage: {
    btc: 48.5,
    eth: 18.2
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let data;
    switch (type) {
      case 'exchanges':
        data = exchanges;
        break;
      case 'airdrops':
        data = airdrops;
        break;
      case 'fundraising':
        data = fundraising;
        break;
      case 'ico':
        data = ico;
        break;
      case 'market':
        data = marketData;
        break;
      default:
        data = {
          exchanges,
          airdrops,
          fundraising,
          ico,
          market: marketData
        };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error serving dummy data:', error);
    return NextResponse.json(
      { error: 'Failed to serve dummy data' },
      { status: 500 }
    );
  }
}

// POST method for adding new data (for future manual updates)
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({
        success: false,
        error: 'Type and data are required',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // This would typically save to a database
    // For now, just return success message
    return NextResponse.json({
      success: true,
      message: `Data added to ${type} successfully`,
      note: 'To permanently save data, update src/data/dummyData.js manually',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Invalid request body',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}
