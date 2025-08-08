# DexScreener Clone Integration

## Overview

This document describes the integration of DexScreener clone functionality into the Dunia Crypto Next.js application. The integration provides comprehensive token tracking, charting, and analytics features similar to DexScreener.

## Features Implemented

### 1. Token Page (`/token/[chainId]/[tokenAddress]`)
- **Dynamic routing** for different blockchain networks
- **Real-time token data** from Moralis APIs
- **Interactive price charts** using Moralis Chart Widget
- **Token information panel** with metadata, price, and market data
- **Multiple trading pairs** support with pair selector
- **Tabbed interface** for different data views

### 2. Trending Tokens Page (`/trending`)
- **Multi-chain support** for trending tokens
- **Chain selector** to switch between different blockchains
- **Token cards** with price, market cap, and volume data
- **Direct navigation** to individual token pages

### 3. Components Structure

#### Core Components
- `TokenPage` - Main token detail page
- `TokenChart` - Interactive price chart component
- `TokenInfo` - Token information and metadata panel
- `TokenTabs` - Tab navigation for different data views
- `PairSelector` - Dropdown for selecting trading pairs

#### Placeholder Components (Ready for Implementation)
- `TokenTransactions` - Transaction history view
- `TokenHolders` - Token holder analytics
- `TokenHolderInsights` - Advanced holder insights
- `TokenSnipers` - Early buyer/sniper analysis

## Supported Blockchains

| Chain | Chain ID | URL Path | Explorer |
|-------|----------|----------|----------|
| Ethereum | 0x1 | ethereum | Etherscan |
| BSC | 0x38 | bsc | BscScan |
| Polygon | 0x89 | polygon | PolygonScan |
| Arbitrum | 0xa4b1 | arbitrum | Arbiscan |
| Optimism | 0xa | optimism | Optimistic Etherscan |
| Base | 0x2105 | base | BaseScan |
| Avalanche | 0xa86a | avalanche | Snowtrace |
| Solana | solana | solana | Solscan |

## API Integration

### Moralis APIs Used
- **Token Pairs**: `/api/v2.2/erc20/{tokenAddress}/pairs`
- **Token Metadata**: `/api/v2.2/erc20/metadata`
- **Trending Tokens**: `/api/v2.2/tokens/trending`
- **Chart Widget**: Moralis Chart Widget for price charts

### Environment Variables
```env
NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_api_key_here
```

## File Structure

```
src/
├── app/
│   ├── token/
│   │   └── [chainId]/
│   │       └── [tokenAddress]/
│   │           └── page.tsx          # Token detail page
│   └── trending/
│       └── page.tsx                  # Trending tokens page
├── components/
│   └── token/
│       ├── TokenChart.jsx           # Price chart component
│       ├── TokenInfo.jsx            # Token info panel
│       ├── TokenTabs.jsx            # Tab navigation
│       ├── PairSelector.jsx         # Pair selection dropdown
│       ├── TokenTransactions.jsx    # Transaction history (placeholder)
│       ├── TokenHolders.jsx         # Holder analytics (placeholder)
│       ├── TokenHolderInsights.jsx  # Holder insights (placeholder)
│       └── TokenSnipers.jsx         # Sniper analysis (placeholder)
└── public/
    └── images/
        ├── token-default.svg        # Default token icon
        └── exchanges/
            └── default-exchange.svg  # Default exchange icon
```

## Usage Examples

### Accessing Token Pages
```
/token/ethereum/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984  # UNI token on Ethereum
/token/bsc/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82      # CAKE token on BSC
/token/polygon/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619  # WETH token on Polygon
```

### Accessing Trending Pages
```
/trending  # Default trending tokens (Ethereum)
```

## Chart Integration

The application uses Moralis Chart Widget for interactive price charts:

```javascript
// Chart configuration
window.createMyWidget(PRICE_CHART_ID, {
  autoSize: true,
  chainId: chartChainId,
  pairAddress: pair.pairAddress,
  defaultInterval: timeframeMap[timeFrame] || "1D",
  // ... other options
});
```

## Styling

The components use Tailwind CSS with a dark theme:
- Background: `bg-gray-900`
- Cards: `bg-gray-800`
- Borders: `border-gray-700`
- Text: `text-white`, `text-gray-400`
- Accents: `text-blue-400`, `text-green-400`, `text-red-400`

## Future Enhancements

### Planned Features
1. **Transaction History** - Real-time transaction feed
2. **Holder Analytics** - Token holder distribution and insights
3. **Sniper Detection** - Early buyer identification
4. **Portfolio Tracking** - User portfolio management
5. **Price Alerts** - Custom price notifications
6. **Social Features** - Token discussions and ratings

### API Extensions
- **Token Search** - Search tokens by name, symbol, or address
- **Filtered Tokens** - Advanced token filtering
- **Token Swaps** - Swap transaction history
- **Wallet Integration** - Connect wallet for portfolio tracking

## Troubleshooting

### Common Issues

1. **Chart Not Loading**
   - Check Moralis API key configuration
   - Verify pair address exists
   - Check browser console for errors

2. **Token Data Not Found**
   - Verify token address is correct
   - Check if token has trading pairs
   - Ensure chain ID is supported

3. **API Rate Limits**
   - Monitor API usage
   - Implement caching if needed
   - Consider upgrading Moralis plan

### Debug Information
- All API calls are logged to console
- Error states are displayed to users
- Loading states provide user feedback

## Contributing

To extend the DexScreener clone functionality:

1. **Add New Chains**: Update chain mapping in components
2. **Enhance Charts**: Modify TokenChart component
3. **Add Analytics**: Implement placeholder components
4. **Improve UI**: Update styling and layout
5. **Add Features**: Extend API integration

## References

- [Moralis Web3 API Documentation](https://docs.moralis.com/web3-data-api/evm)
- [Moralis Chart Widget](https://moralis.com/widgets/price-chart)
- [DexScreener Original](https://dexscreener.com)
- [Next.js Documentation](https://nextjs.org/docs) 