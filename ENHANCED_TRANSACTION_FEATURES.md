# Enhanced Transaction Features - DexScreener Style

## Overview

This document describes the enhanced transaction features implemented for the chart & Txns page, similar to DexScreener. The implementation includes advanced transaction tracking, holder analytics, and real-time data visualization using Moralis API.

## Features Implemented

### 1. Enhanced Transaction Table
- **Real-time transaction monitoring** with auto-refresh every 5 seconds
- **Advanced filtering** by transaction type, address, and amount range
- **Sortable columns** for time, amount, and other metrics
- **Transaction type icons** (transfers, swaps, contracts)
- **Address formatting** with copy functionality
- **Amount formatting** with USD value display
- **Load more functionality** for pagination

### 2. Token Holders Table
- **Holder ranking** with balance percentages
- **Holder categorization** (whales, sharks, fish, minnows)
- **Balance filtering** and search functionality
- **Progress bars** for top holders
- **Export capabilities** for holder data

### 3. Transaction Sidebar
- **Multi-tab interface** (Overview, Holders, Analytics, Actions)
- **Real-time statistics** with timeframe selection
- **Transaction metrics** (volume, unique addresses, avg transaction)
- **Holder analytics** (distribution, top holders percentage)
- **Network activity** (gas usage, transaction speed)
- **Quick actions** (export, alerts, sharing)

### 4. API Endpoints Created

#### Token Transfers API
```
GET /api/moralis/token-transfers
Parameters:
- tokenAddress: Token contract address
- chain: Blockchain network (eth, bsc, polygon, etc.)
- limit: Number of results (default: 50)
- offset: Pagination offset (default: 0)
```

#### Token Holders API
```
GET /api/moralis/token-holders
Parameters:
- tokenAddress: Token contract address
- chain: Blockchain network
- limit: Number of results (default: 50)
- offset: Pagination offset (default: 0)
```

#### Pair Swaps API
```
GET /api/moralis/pair-swaps
Parameters:
- pairAddress: Trading pair address
- chain: Blockchain network
- limit: Number of results (default: 50)
- offset: Pagination offset (default: 0)
```

## Components Created

### 1. EnhancedTransactionTable.jsx
Advanced transaction table with:
- Real-time data updates
- Advanced filtering and sorting
- Transaction type visualization
- Address and amount formatting
- Auto-refresh functionality

### 2. TokenHoldersTable.jsx
Comprehensive holder analytics with:
- Holder ranking and categorization
- Balance and percentage display
- Search and filter capabilities
- Progress bars for visualization

### 3. TransactionSidebar.jsx
Multi-functional sidebar with:
- Overview statistics
- Holder analytics
- Network metrics
- Quick actions and exports

### 4. EnhancedTransactionPage.jsx
Main page component that:
- Combines all transaction features
- Manages data fetching and state
- Provides unified interface
- Handles error states and loading

## Setup Instructions

### 1. Environment Variables
Add the following to your `.env.local` file:

```bash
MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVjMTAzOTRmLTU5MzMtNDE4NS1hZWIzLTk0ZjcyMGVkNGI3NSIsIm9yZ0lkIjoiNDYxNDYyIiwidXNlcklkIjoiNDc0NzU2IiwidHlwZUlkIjoiYTc4ZDlmZjMtMDlhZS00MmM2LTkxNDItMDk2MDg1ODY3NzE1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTM0ODE1NjgsImV4cCI6NDkwOTI0MTU2OH0.59Lf5n4sqfb7EuAYhpn141fdPigaD6lNgVNh-8t4_R0
```

### 2. Dependencies
Ensure you have the following dependencies installed:

```bash
npm install date-fns
```

### 3. File Structure
The enhanced transaction features are organized as follows:

```
src/
├── components/
│   ├── EnhancedTransactionTable.jsx
│   ├── TokenHoldersTable.jsx
│   ├── TransactionSidebar.jsx
│   ├── EnhancedTransactionPage.jsx
│   └── CoinTxnsPage.jsx (updated)
├── app/api/moralis/
│   ├── token-transfers/route.js
│   ├── token-holders/route.js
│   └── pair-swaps/route.js
```

## Usage

### Accessing the Enhanced Transaction Page
Navigate to any cryptocurrency detail page and click on the "Txns" tab:

```
/crypto/{coinId}/txns
```

### Features Available

#### Transaction View
- View real-time transaction data
- Filter by transaction type (transfers, swaps, contracts)
- Search by address
- Filter by amount range
- Sort by time or amount
- Auto-refresh every 5 seconds

#### Holders View
- View token holder rankings
- See holder distribution (whales, sharks, fish, minnows)
- Filter holders by balance range
- Search specific addresses
- View percentage ownership

#### Sidebar Analytics
- **Overview Tab**: Transaction statistics, volume metrics, unique addresses
- **Holders Tab**: Holder count, top 10 percentage, circulating supply
- **Analytics Tab**: Network activity, price impact, liquidity metrics
- **Actions Tab**: Export options, quick actions, API access

## API Integration

### Moralis API Endpoints Used

1. **Token Transfers**: `/api/v2.2/erc20/{tokenAddress}/transfers`
2. **Token Holders**: `/api/v2.2/erc20/{tokenAddress}/holders`
3. **Pair Swaps**: `/api/v2.2/pairs/{pairAddress}/swaps`

### Supported Blockchains
- Ethereum (eth)
- BSC (bsc)
- Polygon (polygon)
- Arbitrum (arbitrum)
- Optimism (optimism)
- Base (base)
- Avalanche (avalanche)
- Fantom (fantom)
- Pulse (pulse)
- Ronin (ronin)

## Data Formatting

### Transaction Data
```javascript
{
  hash: "0x...",
  from_address: "0x...",
  to_address: "0x...",
  value: "1000000000000000000",
  block_timestamp: "2024-01-01T00:00:00.000Z",
  block_number: 12345678,
  token_address: "0x...",
  token_name: "Token Name",
  token_symbol: "TKN",
  token_decimals: 18,
  chain: "eth",
  type: "token_transfer"
}
```

### Holder Data
```javascript
{
  address: "0x...",
  balance: "1000000000000000000",
  balance_formatted: "1.0",
  token_address: "0x...",
  token_name: "Token Name",
  token_symbol: "TKN",
  token_decimals: 18,
  chain: "eth",
  percentage: "0.5"
}
```

## Error Handling

The implementation includes comprehensive error handling:

1. **API Errors**: Graceful handling of rate limits, authentication errors
2. **Network Errors**: Retry mechanisms and user-friendly error messages
3. **Data Validation**: Safe handling of missing or malformed data
4. **Loading States**: Skeleton loaders and progress indicators

## Performance Optimizations

1. **Memoization**: React.useMemo for expensive calculations
2. **Debouncing**: Search and filter inputs
3. **Pagination**: Load more functionality to prevent large data loads
4. **Auto-refresh**: Configurable refresh intervals
5. **Lazy Loading**: Components loaded on demand

## Customization

### Styling
The components use Tailwind CSS classes and can be customized by modifying:
- Color schemes in the component files
- Layout configurations
- Responsive breakpoints

### Functionality
Key areas for customization:
- Auto-refresh intervals
- Pagination limits
- Filter options
- Sort fields
- Export formats

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the API key is correctly set in `.env.local`
   - Check if the key has the necessary permissions
   - Ensure the key is not expired

2. **No Data Displayed**
   - Check if the token address is valid
   - Verify the blockchain network is supported
   - Check browser console for errors

3. **Slow Performance**
   - Reduce auto-refresh interval
   - Implement virtual scrolling for large datasets
   - Optimize API calls with caching

### Debug Mode
Enable debug logging by adding:

```javascript
console.log('Transaction Data:', transactionData);
console.log('Holder Data:', holderData);
```

## Future Enhancements

1. **Advanced Analytics**: Price impact calculations, liquidity analysis
2. **Chart Integration**: Transaction volume charts, holder distribution charts
3. **Alert System**: Price and transaction alerts
4. **Portfolio Tracking**: User portfolio integration
5. **Multi-chain Support**: Enhanced cross-chain functionality
6. **Mobile Optimization**: Responsive design improvements

## Support

For issues or questions regarding the enhanced transaction features:

1. Check the browser console for error messages
2. Verify API key configuration
3. Test with different token addresses
4. Review network connectivity

## License

This implementation is part of the Duniacrypto project and follows the same licensing terms. 