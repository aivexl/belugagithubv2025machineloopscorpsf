import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

interface TokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  thumbnail?: string;
  total_supply?: string;
  total_supply_formatted?: string;
  market_cap?: number;
  fully_diluted_valuation?: number;
  categories?: string[];
  links?: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  created_at?: string;
}

async function fetchTokenMetadata(
  tokenAddress: string,
  chain: string
): Promise<TokenMetadata> {
  // Mock data for demonstration
  return {
    address: tokenAddress,
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimals: 8,
    logo: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png',
    thumbnail: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    total_supply: '1000000000000000000000000',
    total_supply_formatted: '1,000,000',
    market_cap: 50000000000,
    fully_diluted_valuation: 50000000000,
    categories: ['Wrapped Tokens', 'Bitcoin'],
    links: {
      website: 'https://wbtc.network/',
      twitter: 'https://twitter.com/WrappedBitcoin',
      telegram: 'https://t.me/wrappedbitcoin',
    },
    created_at: '2020-01-30T00:00:00.000Z',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const tokenAddress = searchParams.get('tokenAddress');
    const chain = searchParams.get('chain');

    if (!tokenAddress || !chain) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters: tokenAddress, chain'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const metadata = await fetchTokenMetadata(tokenAddress, chain);

    return new Response(
      JSON.stringify([metadata]), // Return as array for EVM compatibility
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch token metadata'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}



