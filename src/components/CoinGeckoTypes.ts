export type Global = unknown;
export type CoinAPI = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  total_volume: number;
};

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

export type CoinGeckoContextType = {
  coins: Coin[] | null;
  global: Global | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export const COINS_URL = '/api/coingecko-proxy/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
export const GLOBAL_URL = '/api/coingecko-proxy/global'; 