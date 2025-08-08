# Moralis API Setup

## Setup Instructions

### 1. Get Moralis API Key
1. Go to [Moralis](https://moralis.io/)
2. Sign up or log in to your account
3. Navigate to your dashboard
4. Go to "API Keys" section
5. Create a new API key or copy your existing one

### 2. Add to Environment Variables
Add your Moralis API key to the `.env.local` file:

```env
MORALIS_API_KEY=your_moralis_api_key_here
```

### 3. Features
- **Blockchain Transactions**: Real-time transaction data from multiple blockchains
- **Stable Layout**: Fixed header controls and stable table layout
- **Auto-refresh**: Automatic data updates every 3 seconds
- **Sorting**: Sort by age, value, and other fields
- **Responsive**: Works on all screen sizes

### 4. Supported Networks
- Ethereum (ETH)
- Polygon (MATIC)
- BSC (BNB)
- Avalanche (AVAX)
- And more...

### 5. Transaction Types
- **Transfer**: Standard token transfers
- **Contract**: Smart contract interactions

### 6. Data Fields
- Transaction Hash
- From/To Addresses
- Value (in ETH/Wei)
- Block Timestamp
- Gas Used
- Transaction Type

## Troubleshooting

### Common Issues:
1. **401 Error**: Invalid API key - check your `.env.local` file
2. **429 Error**: Rate limit exceeded - wait a few minutes
3. **No Data**: Address might not have recent transactions

### Support:
- Moralis Documentation: https://docs.moralis.io/
- API Reference: https://docs.moralis.io/web3-data-api/evm 