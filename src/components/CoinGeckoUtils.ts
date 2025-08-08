// CoinGeckoUtils.ts
// Berisi type, constant, dan helper non-komponen untuk CoinGeckoContext

// Tipe data global dari CoinGecko
export type Global = unknown;

// Tipe data API CoinGecko
export type CoinAPI = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  total_volume: number;
};

// Tipe data Coin yang digunakan di context
export type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
};

// Tipe context CoinGecko
export type CoinGeckoContextType = {
  coins: Coin[] | null;
  global: Global | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

// Endpoint CoinGecko
export const COINS_URL = '/api/coingecko/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
export const GLOBAL_URL = '/api/coingecko/api/v3/global'; 