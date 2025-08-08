# TradingView Integration for DuniaCrypto

## Overview

This integration provides comprehensive cryptocurrency information using TradingView's API, including detailed market data, exchange information, and real-time search capabilities.

## Features

### 🔍 Real-time Symbol Search
- Search through thousands of cryptocurrency symbols
- Auto-complete with detailed symbol information
- Real-time results with debounced search

### 📊 Detailed Market Data
- Current price and price changes
- Volume and market cap information
- 24-hour high/low data
- Open and previous close prices

### 🏢 Exchange Information
- List of exchanges where the cryptocurrency is traded
- Exchange details including country, type, and trading pairs
- 24-hour volume data for exchanges
- Exchange logos and branding

### 🎯 Reusable Components
- Modular components that can be used anywhere in the application
- TypeScript support with proper type definitions
- Error handling and loading states
- Responsive design

## Components

### TradingViewSearch
A search component for finding cryptocurrency symbols.

```tsx
import TradingViewSearch from '../components/TradingViewSearch';

<TradingViewSearch 
  onSymbolSelect={(symbol) => console.log(symbol)}
  placeholder="Search for crypto symbols..."
/>
```

**Props:**
- `onSymbolSelect`: Callback function when a symbol is selected
- `placeholder`: Custom placeholder text for the search input

### TradingViewCoinInfo
A comprehensive component displaying detailed coin information.

```tsx
import TradingViewCoinInfo from '../components/TradingViewCoinInfo';

<TradingViewCoinInfo 
  symbol="BTCUSD"
  showExchanges={true}
/>
```

**Props:**
- `symbol`: The trading symbol (e.g., "BTCUSD", "ETHUSD")
- `showExchanges`: Whether to display exchange information

## API Service

### TradingViewService
A service class that handles all TradingView API interactions.

```tsx
import { tradingViewService } from '../utils/tradingview';

// Search for symbols
const results = await tradingViewService.searchSymbols('BTC');

// Get symbol information
const symbolInfo = await tradingViewService.getSymbolInfo('BTCUSD');

// Get quote data
const quote = await tradingViewService.getQuote('BTCUSD');

// Get exchange information
const exchanges = await tradingViewService.getExchanges();
```

## API Endpoints

### TradingView Proxy
All TradingView API calls are proxied through `/api/tradingview/[...slug]` to handle CORS and rate limiting.

## Type Definitions

### TradingViewSymbol
```tsx
interface TradingViewSymbol {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  ticker: string;
  type: string;
  currency: string;
  logo_urls: {
    dark: string;
    light: string;
  };
  // ... more properties
}
```

### TradingViewQuote
```tsx
interface TradingViewQuote {
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
```

### TradingViewExchange
```tsx
interface TradingViewExchange {
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
```

## Usage Examples

### Basic Search Implementation
```tsx
import React, { useState } from 'react';
import TradingViewSearch from '../components/TradingViewSearch';
import TradingViewCoinInfo from '../components/TradingViewCoinInfo';

export default function MyComponent() {
  const [selectedSymbol, setSelectedSymbol] = useState('');

  return (
    <div>
      <TradingViewSearch onSymbolSelect={setSelectedSymbol} />
      {selectedSymbol && (
        <TradingViewCoinInfo symbol={selectedSymbol} />
      )}
    </div>
  );
}
```

### Integration with Existing Crypto Detail Page
The TradingView components are already integrated into the crypto detail page (`CryptoDetailClient.jsx`) to provide additional information alongside CoinGecko data.

### Demo Page
Visit `/tradingview-demo` to see a comprehensive demonstration of all TradingView features.

## Error Handling

All components include comprehensive error handling:
- Network errors
- API rate limiting
- Invalid symbols
- Loading states
- Retry mechanisms

## Performance Considerations

- Debounced search to prevent excessive API calls
- Caching of search results
- Lazy loading of exchange information
- Optimized re-renders with React.memo

## Styling

Components use Tailwind CSS classes and follow the DuniaCrypto design system:
- Dark theme with `bg-gray-900` background
- Panel styling with `bg-duniacrypto-panel`
- Consistent border colors with `border-gray-700`
- Responsive design with mobile-first approach

## Future Enhancements

- Historical price data integration
- Technical indicators
- Watchlist functionality
- Price alerts
- Advanced filtering options
- Multi-language support

## Troubleshooting

### Common Issues

1. **Symbol not found**: Ensure the symbol format is correct (e.g., "BTCUSD" not "BTC")
2. **API errors**: Check the browser console for detailed error messages
3. **Loading issues**: Verify network connectivity and API endpoint availability

### Debug Mode
Enable debug logging by setting `localStorage.setItem('tradingview-debug', 'true')` in the browser console.

## Contributing

When adding new features to the TradingView integration:
1. Follow the existing TypeScript patterns
2. Add proper error handling
3. Include loading states
4. Update this documentation
5. Test with various symbol types 