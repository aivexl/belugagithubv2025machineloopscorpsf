import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

interface PairStats {
  currentUsdPrice?: number;
  currentNativePrice?: number;
  totalLiquidityUsd?: number;
  pricePercentChange?: {
    '5min'?: number;
    '1h'?: number;
    '4h'?: number;
    '24h'?: number;
  };
  buys?: {
    '5min'?: number;
    '1h'?: number;
    '4h'?: number;
    '24h'?: number;
  };
  sells?: {
    '5min'?: number;
    '1h'?: number;
    '4h'?: number;
    '24h'?: number;
  };
  buyVolume?: {
    '5min'?: number;
    '1h'?: number;
    '4h'?: number;
    '24h'?: number;
  };
  sellVolume?: {
    '5min'?: number;
    '1h'?: number;
    '4h'?: number;
    '24h'?: number;
  };
  buyers?: {
    '5min'?: number;
    '1h'?: number;
    '4h'?: number;
    '24h'?: number;
  };
  sellers?: {
    '5min'?: number;
    '1h'?: number;
    '4h'?: number;
    '24h'?: number;
  };
  totalVolume?: {
    '5min'?: number;
    '1h'?: number;
    '4h'?: number;
    '24h'?: number;
  };
  pairCreated?: string;
}

async function fetchPairStats(
  pairAddress: string,
  chain: string
): Promise<PairStats> {
  // Mock data for demonstration
  return {
    currentUsdPrice: 50000,
    currentNativePrice: 0.025,
    totalLiquidityUsd: 1000000,
    pricePercentChange: {
      '5min': 0.5,
      '1h': 1.2,
      '4h': -0.8,
      '24h': 2.5,
    },
    buys: {
      '5min': 15,
      '1h': 120,
      '4h': 480,
      '24h': 2880,
    },
    sells: {
      '5min': 12,
      '1h': 95,
      '4h': 380,
      '24h': 2280,
    },
    buyVolume: {
      '5min': 25000,
      '1h': 200000,
      '4h': 800000,
      '24h': 4800000,
    },
    sellVolume: {
      '5min': 20000,
      '1h': 160000,
      '4h': 640000,
      '24h': 3840000,
    },
    buyers: {
      '5min': 8,
      '1h': 65,
      '4h': 260,
      '24h': 1560,
    },
    sellers: {
      '5min': 6,
      '1h': 48,
      '4h': 192,
      '24h': 1152,
    },
    totalVolume: {
      '5min': 45000,
      '1h': 360000,
      '4h': 1440000,
      '24h': 8640000,
    },
    pairCreated: '2020-01-30T00:00:00.000Z',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const pairAddress = searchParams.get('pairAddress');
    const chain = searchParams.get('chain');

    if (!pairAddress || !chain) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters: pairAddress, chain'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const stats = await fetchPairStats(pairAddress, chain);

    return new Response(
      JSON.stringify(stats),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching pair stats:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch pair stats'
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



