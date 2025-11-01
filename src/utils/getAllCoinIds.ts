// Utility to fetch all coin IDs from various sources
import { createClient } from 'next-sanity'

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-22',
  useCdn: false,
})

// Top crypto IDs from CoinGecko (most popular/tracked)
export const TOP_CRYPTO_IDS = [
  'bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana',
  'usd-coin', 'xrp', 'staked-ether', 'cardano', 'dogecoin',
  'avalanche-2', 'shiba-inu', 'polkadot', 'chainlink', 'polygon',
  'bitcoin-cash', 'litecoin', 'uniswap', 'near', 'unus-sed-leo',
  'tron', 'ethereum-classic', 'cosmos', 'stellar', 'monero',
  'okb', 'internet-computer', 'filecoin', 'hedera-hashgraph', 'aptos',
  'vechain', 'crypto-com-chain', 'optimism', 'the-graph', 'maker',
  'celo', 'fantom', 'algorand', 'immutable-x', 'arbitrum',
  'the-sandbox', 'axie-infinity', 'aave', 'tezos', 'whitebit',
  'eos', 'multiversx', 'singularitynet', 'theta-token', 'rocket-pool',
  'kucoin-shares', 'render-token', 'injective-protocol', 'thorchain', 'lido-dao',
  'ethereum-name-service', 'curve-dao-token', 'conflux-token', 'compound-ether', 'gnosis',
  'moonbeam', 'illuvium', 'loopring', 'mina-protocol', 'gala',
  'harmony', 'pancakeswap-token', '1inch', 'bone-shibaswap', 'magic',
  'ankr', 'livepeer', 'dydx', 'zilliqa', 'bone-shibaswap'
]

// Fetch all active coin tags from Sanity
export async function getAllCoinTagSlugs() {
  try {
    const query = `*[_type == "coinTag" && isActive == true] {
      _id,
      name,
      symbol,
      slug
    }`
    const coins = await sanityClient.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } })
    return coins || []
  } catch (error) {
    console.error('Error fetching coin tags:', error)
    return []
  }
}

// Fetch trending crypto IDs from CoinGecko API
export async function getTrendingCoinIds(): Promise<string[]> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    
    if (!response.ok) {
      return TOP_CRYPTO_IDS
    }
    
    const data = await response.json()
    const trendingIds = data.coins?.map((coin: { item: { id: string } }) => coin.item.id) || []
    
    // Combine trending with top crypto IDs
    const allIds = [...new Set([...trendingIds, ...TOP_CRYPTO_IDS])]
    return allIds.slice(0, 100) // Limit to top 100
  } catch (error) {
    console.error('Error fetching trending coins:', error)
    return TOP_CRYPTO_IDS
  }
}











