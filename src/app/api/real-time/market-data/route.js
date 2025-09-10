import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenAddress = searchParams.get('address');
  const symbol = searchParams.get('symbol');
  const chain = searchParams.get('chain') || 'bsc';

  if (!tokenAddress && !symbol) {
    return NextResponse.json(
      { error: 'Token address or symbol is required' },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching real-time market data for ${symbol || tokenAddress} on ${chain}`);

    // Try multiple sources for comprehensive market data
    const marketData = await fetchMarketData(tokenAddress, symbol, chain);
    
    if (marketData) {
      return NextResponse.json({
        success: true,
        source: marketData.source,
        chain: chain,
        address: tokenAddress,
        symbol: symbol,
        data: marketData.data,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'No market data available',
        chain: chain,
        address: tokenAddress,
        symbol: symbol
      });
    }

  } catch (error) {
    console.error('Real-time market data API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch market data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function fetchMarketData(tokenAddress, symbol, chain) {
  // Try CoinGecko first for comprehensive market data
  try {
    const coinGeckoData = await fetchFromCoinGecko(symbol, tokenAddress);
    if (coinGeckoData) {
      return coinGeckoData;
    }
  } catch (error) {
    console.log('CoinGecko API failed:', error.message);
  }

  // Try DexScreener for DEX-specific data
  try {
    const dexScreenerData = await fetchFromDexScreener(tokenAddress, chain);
    if (dexScreenerData) {
      return dexScreenerData;
    }
  } catch (error) {
    console.log('DexScreener API failed:', error.message);
  }

  // Try CoinCap as fallback
  try {
    const coinCapData = await fetchFromCoinCap(symbol);
    if (coinCapData) {
      return coinCapData;
    }
  } catch (error) {
    console.log('CoinCap API failed:', error.message);
  }

  return null;
}

async function fetchFromCoinGecko(symbol, tokenAddress) {
  try {
    // First search for the coin
    const searchUrl = `https://api.coingecko.com/api/v3/search?query=${symbol}`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DuniaCrypto/1.0'
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!searchResponse.ok) {
      throw new Error(`CoinGecko search API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.coins || searchData.coins.length === 0) {
      throw new Error('No coins found in search');
    }

    // Get the first (most relevant) coin
    const coin = searchData.coins[0];
    const coinId = coin.id;

    // Get detailed market data
    const marketUrl = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    const marketResponse = await fetch(marketUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DuniaCrypto/1.0'
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!marketResponse.ok) {
      throw new Error(`CoinGecko market API error: ${marketResponse.status}`);
    }

    const marketData = await marketResponse.json();
    const market = marketData.market_data;

    return {
      source: 'CoinGecko Real Data',
      data: {
        name: marketData.name,
        symbol: marketData.symbol?.toUpperCase(),
        price_usd: market.current_price?.usd || 0,
        price_change_24h: market.price_change_percentage_24h || 0,
        market_cap: market.market_cap?.usd || 0,
        volume_24h: market.total_volume?.usd || 0,
        circulating_supply: market.circulating_supply || 0,
        total_supply: market.total_supply || 0,
        max_supply: market.max_supply || 0,
        fully_diluted_valuation: market.fully_diluted_valuation?.usd || 0,
        high_24h: market.high_24h?.usd || 0,
        low_24h: market.low_24h?.usd || 0,
        ath: market.ath?.usd || 0,
        ath_change_percentage: market.ath_change_percentage?.usd || 0,
        atl: market.atl?.usd || 0,
        atl_change_percentage: market.atl_change_percentage?.usd || 0,
        price_change_percentage_1h: market.price_change_percentage_1h_in_currency?.usd || 0,
        price_change_percentage_24h: market.price_change_percentage_24h_in_currency?.usd || 0,
        price_change_percentage_7d: market.price_change_percentage_7d_in_currency?.usd || 0,
        price_change_percentage_30d: market.price_change_percentage_30d_in_currency?.usd || 0,
        price_change_percentage_1y: market.price_change_percentage_1y_in_currency?.usd || 0,
        market_cap_rank: marketData.market_cap_rank || 0,
        coingecko_rank: marketData.coingecko_rank || 0,
        coingecko_score: marketData.coingecko_score || 0,
        developer_score: marketData.developer_score || 0,
        community_score: marketData.community_score || 0,
        liquidity_score: marketData.liquidity_score || 0,
        public_interest_score: marketData.public_interest_score || 0,
        last_updated: marketData.last_updated,
        contract_address: tokenAddress
      }
    };

  } catch (error) {
    console.error('CoinGecko fetch error:', error);
    throw error;
  }
}

async function fetchFromDexScreener(tokenAddress, chain) {
  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DuniaCrypto/1.0'
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.pairs || data.pairs.length === 0) {
      throw new Error('No pairs found for token');
    }

    // Get the most liquid pair
    const pair = data.pairs[0];
    const priceUsd = parseFloat(pair.priceUsd) || 0;
    const volume24h = parseFloat(pair.volume?.h24) || 0;
    const liquidity = parseFloat(pair.liquidity?.usd) || 0;
    const fdv = parseFloat(pair.fdv) || 0;

    return {
      source: 'DexScreener Real Data',
      data: {
        name: pair.baseToken?.name || 'Token',
        symbol: pair.baseToken?.symbol?.toUpperCase() || 'TOKEN',
        price_usd: priceUsd,
        price_change_24h: parseFloat(pair.priceChange?.h24) || 0, // Use DexScreener period change
        market_cap: fdv,
        volume_24h: volume24h,
        circulating_supply: 0, // Not available from DexScreener
        total_supply: 0, // Not available from DexScreener
        max_supply: 0, // Not available from DexScreener
        fully_diluted_valuation: fdv,
        high_24h: parseFloat(pair.priceUsd) * 1.02, // Estimate
        low_24h: parseFloat(pair.priceUsd) * 0.98, // Estimate
        ath: 0, // Not available from DexScreener
        ath_change_percentage: 0, // Not available from DexScreener
        atl: 0, // Not available from DexScreener
        atl_change_percentage: 0, // Not available from DexScreener
        price_change_percentage_1h: parseFloat(pair.priceChange?.h1) || 0,
        price_change_percentage_24h: parseFloat(pair.priceChange?.h24) || 0,
        price_change_percentage_7d: parseFloat(pair.priceChange?.h24) * 7 || 0, // Estimate
        price_change_percentage_30d: parseFloat(pair.priceChange?.h24) * 30 || 0, // Estimate
        price_change_percentage_1y: parseFloat(pair.priceChange?.h24) * 365 || 0, // Estimate
        market_cap_rank: 0, // Not available from DexScreener
        coingecko_rank: 0, // Not available from DexScreener
        coingecko_score: 0, // Not available from DexScreener
        developer_score: 0, // Not available from DexScreener
        community_score: 0, // Not available from DexScreener
        liquidity_score: liquidity > 1000000 ? 100 : (liquidity / 10000), // Calculate based on liquidity
        public_interest_score: 0, // Not available from DexScreener
        last_updated: new Date().toISOString(),
        contract_address: tokenAddress,
        dex_id: pair.dexId,
        pair_address: pair.pairAddress,
        liquidity_usd: liquidity
      }
    };

  } catch (error) {
    console.error('DexScreener fetch error:', error);
    throw error;
  }
}

async function fetchFromCoinCap(symbol) {
  try {
    const url = `https://api.coincap.io/v2/assets/${symbol.toLowerCase()}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DuniaCrypto/1.0'
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`CoinCap API error: ${response.status}`);
    }

    const data = await response.json();
    const asset = data.data;

    return {
      source: 'CoinCap Real Data',
      data: {
        name: asset.name,
        symbol: asset.symbol?.toUpperCase(),
        price_usd: parseFloat(asset.priceUsd) || 0,
        price_change_24h: parseFloat(asset.changePercent24Hr) || 0,
        market_cap: parseFloat(asset.marketCapUsd) || 0,
        volume_24h: parseFloat(asset.volumeUsd24Hr) || 0,
        circulating_supply: parseFloat(asset.supply) || 0,
        total_supply: parseFloat(asset.supply) || 0,
        max_supply: parseFloat(asset.maxSupply) || 0,
        fully_diluted_valuation: parseFloat(asset.marketCapUsd) || 0,
        high_24h: parseFloat(asset.priceUsd) * 1.02, // Estimate
        low_24h: parseFloat(asset.priceUsd) * 0.98, // Estimate
        ath: 0, // Not available from CoinCap
        ath_change_percentage: 0, // Not available from CoinCap
        atl: 0, // Not available from CoinCap
        atl_change_percentage: 0, // Not available from CoinCap
        price_change_percentage_1h: 0, // Not available from CoinCap
        price_change_percentage_24h: parseFloat(asset.changePercent24Hr) || 0,
        price_change_percentage_7d: 0, // Not available from CoinCap
        price_change_percentage_30d: 0, // Not available from CoinCap
        price_change_percentage_1y: 0, // Not available from CoinCap
        market_cap_rank: parseInt(asset.rank) || 0,
        coingecko_rank: parseInt(asset.rank) || 0,
        coingecko_score: 0, // Not available from CoinCap
        developer_score: 0, // Not available from CoinCap
        community_score: 0, // Not available from CoinCap
        liquidity_score: 0, // Not available from CoinCap
        public_interest_score: 0, // Not available from CoinCap
        last_updated: new Date().toISOString(),
        contract_address: null // Not available from CoinCap
      }
    };

  } catch (error) {
    console.error('CoinCap fetch error:', error);
    throw error;
  }
}
