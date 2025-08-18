// TradingView API Service

// Add this interface for API responses
interface TradingViewApiResponse {
  error?: string;
  [key: string]: TradingViewQuote | null | string | undefined;
}

interface TradingViewSymbolResponse {
  error?: string;
  [key: string]: TradingViewSymbol | null | string | undefined;
}

export interface TradingViewSymbol {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  ticker: string;
  type: string;
  pricescale: number;
  minmov: number;
  fractional: boolean;
  minmove2: number;
  currency: string;
  currency_logo: string;
  original_currency: string;
  original_currency_logo: string;
  unit_id: string;
  original_unit_id: string;
  unit_conversion_types: string[];
  has_intraday: boolean;
  has_no_volume: boolean;
  has_weekly_and_monthly: boolean;
  has_empty_bars: boolean;
  force_session_rebuild: boolean;
  has_seconds: boolean;
  seconds_multipliers: number[];
  has_daily: boolean;
  intraday_multipliers: string[];
  supported_resolutions: string[];
  volume_precision: number;
  data_status: string;
  expired: boolean;
  expiration_date: number;
  sector: string;
  industry: string;
  currency_id: string;
  original_currency_id: string;
  unit_id_short: string;
  original_unit_id_short: string;
  unit_conversion_types_short: string[];
  currency_logo_dark: string;
  currency_logo_light: string;
  original_currency_logo_dark: string;
  original_currency_logo_light: string;
  logo_urls: {
    dark: string;
    light: string;
  };
  logo_urls_original: {
    dark: string;
    light: string;
  };
  logo_urls_short: {
    dark: string;
    light: string;
  };
  logo_urls_original_short: {
    dark: string;
    light: string;
  };
}

export interface TradingViewExchange {
  id: string;
  name: string;
  description: string;
  country: string;
  logo_urls: {
    dark: string;
    light: string;
  };
  website: string;
  type: string;
  timezone: string;
  trading_hours: string;
  currency: string;
  volume_24h: number;
  market_cap: number;
  pairs_count: number;
}

export interface TradingViewQuote {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  high_24h: number;
  low_24h: number;
  open: number;
  previous_close: number;
  timestamp: number;
}

export interface TradingViewSearchResult {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  ticker: string;
  type: string;
  logo_urls: {
    dark: string;
    light: string;
  };
}

class TradingViewService {
  private baseUrl = '/api/tradingview';

  async searchSymbols(query: string): Promise<TradingViewSearchResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/crypto/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "query": query,
          "type": "crypto",
          "limit": 20
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      return data.symbols || [];
    } catch (error) {
      console.error('TradingView search error:', error);
      return [];
    }
  }

  async getSymbolInfo(symbol: string): Promise<TradingViewSymbol | null> {
    try {
      console.log('TradingView: Fetching symbol info for:', symbol);
      const response = await fetch(`${this.baseUrl}/crypto/symbols?symbol=${encodeURIComponent(symbol)}`);
      
      console.log('TradingView: Symbol info response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Symbol info failed: ${response.status}`);
      }

      const data: TradingViewSymbolResponse = await response.json();
      console.log('TradingView: Symbol info data:', data);
      
      // Handle the case where the proxy returns a 404 response as 200 with error field
      if (data.error && data.error === 'Symbol not found') {
        return null;
      }
      
      const result = data[symbol];
      return typeof result === 'object' && result !== null ? result : null;
    } catch (error) {
      console.error('TradingView symbol info error:', error);
      return null;
    }
  }

  async getQuote(symbol: string): Promise<TradingViewQuote | null> {
    try {
      const response = await fetch(`${this.baseUrl}/crypto/quote?symbol=${encodeURIComponent(symbol)}`);
      
      if (!response.ok) {
        throw new Error(`Quote failed: ${response.status}`);
      }

      const data: TradingViewApiResponse = await response.json();
      
      // Handle the case where the proxy returns a 404 response as 200 with error field
      if (data.error && data.error === 'Symbol not found') {
        return null;
      }
      
      const result = data[symbol];
      return typeof result === 'object' && result !== null ? result : null;
    } catch (error) {
      console.error('TradingView quote error:', error);
      return null;
    }
  }

  async getExchanges(): Promise<TradingViewExchange[]> {
    try {
      const response = await fetch(`${this.baseUrl}/crypto/exchanges`);
      
      if (!response.ok) {
        throw new Error(`Exchanges failed: ${response.status}`);
      }

      const data: { error?: string; exchanges?: TradingViewExchange[] } = await response.json();
      
      // Handle the case where the proxy returns a 404 response as 200 with error field
      if (data.error && data.error === 'Symbol not found') {
        return [];
      }
      
      return data.exchanges || [];
    } catch (error) {
      console.error('TradingView exchanges error:', error);
      return [];
    }
  }

  async getExchangeSymbols(exchange: string): Promise<TradingViewSymbol[]> {
    try {
      const response = await fetch(`${this.baseUrl}/crypto/exchange/${exchange}/symbols`);
      
      if (!response.ok) {
        throw new Error(`Exchange symbols failed: ${response.status}`);
      }

      const data = await response.json();
      return data.symbols || [];
    } catch (error) {
      console.error('TradingView exchange symbols error:', error);
      return [];
    }
  }

  async getMarketData(symbol: string, resolution: string = '1D', limit: number = 100): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/crypto/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol,
          resolution,
          limit,
          to: Math.floor(Date.now() / 1000)
        }),
      });

      if (!response.ok) {
        throw new Error(`Market data failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('TradingView market data error:', error);
      return null;
    }
  }
}

export const tradingViewService = new TradingViewService(); 