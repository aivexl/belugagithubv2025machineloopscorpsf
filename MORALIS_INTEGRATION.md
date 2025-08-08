# Moralis API Integration for Transaction Data

This document describes the integration of Moralis API to fetch real-time transaction data for cryptocurrencies, similar to DexScreener's functionality.

## Features Implemented

### 1. API Endpoints
- `/api/moralis/transactions` - Fetch wallet transactions
- `/api/moralis/token-transfers` - Fetch token transfer data
- `/api/moralis/contract-events` - Fetch smart contract events

### 2. Supported Cryptocurrencies
The system includes mappings for popular cryptocurrencies across multiple blockchains:

#### Ethereum Mainnet
- ETH (native)
- USDT, USDC, WBTC, DAI, LINK, UNI, AAVE, COMP, MKR

#### Binance Smart Chain (BSC)
- BNB (native)
- BUSD, CAKE

#### Other Networks
- Polygon (MATIC, WMATIC)
- Avalanche (AVAX)
- Fantom (FTM)
- Arbitrum (ARB)
- Optimism (OP)
- Solana (SOL)

### 3. Components
- `TransactionDataTable` - Displays transaction data in a sortable table
- `useMoralisData` - Custom React hook for fetching data
- `cryptoMapping` - Utility for mapping symbols to contract addresses

## Setup Instructions

### 1. Install Dependencies
```bash
npm install moralis @moralisweb3/common-evm-utils date-fns
```

### 2. Environment Variables
Add the following to your `.env.local` file:
```
MORALIS_API_KEY=your_moralis_api_key_here
```

### 3. Get Moralis API Key
1. Visit https://admin.moralis.io/
2. Create an account or sign in
3. Create a new project
4. Copy your API key from the project settings

## Usage

### Chart & Transactions Page
The `/crypto/[id]/chart-txns` page now includes:
- Tabbed interface for Chart and Transactions
- Real-time transaction data from Moralis
- Sortable transaction table
- Network and token type information

### Transactions Page
The `/crypto/[id]/txns` page displays:
- Transaction overview statistics
- Detailed transaction table
- Network activity information

## API Response Format

### Transaction Data Structure
```json
{
  "success": true,
  "data": {
    "result": [
      {
        "hash": "0x...",
        "from_address": "0x...",
        "to_address": "0x...",
        "value": "1000000000000000000",
        "block_timestamp": "1640995200",
        "type": "transfer",
        "decimals": 18
      }
    ],
    "total": 1000
  },
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 50,
    "offset": 0
  }
}
```

## Error Handling

The system includes comprehensive error handling:
- API rate limiting
- Network errors
- Unsupported cryptocurrencies
- Missing API keys

## Performance Considerations

- Data is paginated (50 items per page)
- Loading states for better UX
- Error boundaries for graceful failures
- Caching through React hooks

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live transaction feeds
2. **More Networks**: Support for additional blockchains
3. **Advanced Filtering**: Filter by transaction type, value range, etc.
4. **Transaction Analytics**: Charts and statistics for transaction patterns
5. **Address Tracking**: Track specific wallet addresses

## Troubleshooting

### Common Issues

1. **"Transaction Data Not Available"**
   - Check if the cryptocurrency is supported in `cryptoMapping`
   - Verify the Moralis API key is set correctly

2. **API Rate Limiting**
   - Moralis has rate limits based on your plan
   - Implement exponential backoff for retries

3. **Network Errors**
   - Check internet connection
   - Verify Moralis service status

### Debug Mode
Enable debug logging by adding to your environment:
```
DEBUG_MORALIS=true
```

## Security Notes

- Never expose your Moralis API key in client-side code
- All API calls are made server-side through Next.js API routes
- Implement proper rate limiting and validation
- Consider implementing API key rotation for production use 